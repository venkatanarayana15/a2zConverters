import React, { useState, useRef } from 'react';
import { Upload, PenTool, Download, Eraser, AlertCircle, FileText } from 'lucide-react';
import BackLink from '../../../components/BackLink';
import InlineNotice from '../../../components/ui/InlineNotice';
import { apiPost, dataUrlToBlob } from '../../../lib/api';
import { readFileAsArrayBuffer, loadPdfDoc, renderPdfPageToCanvas, downloadBlob, stripExtension } from '../../../lib/pdfUtils';

const DRAW_WIDTH = 400;
const DRAW_HEIGHT = 160;
const SIG_SCALE = 0.25;

const ESign = () => {
    const [file, setFile] = useState(null);
    const [previewDataUrl, setPreviewDataUrl] = useState(null);
    const [signature, setSignature] = useState(null);
    const [sigPos, setSigPos] = useState(null); // { x, y } in PDF points (bottom-left origin)
    const [sigImgSize, setSigImgSize] = useState({ width: 0, height: 0 });
    const [pageW, setPageW] = useState(0); // page 1 size in PDF points
    const [pageH, setPageH] = useState(0);
    const [isSigning, setIsSigning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const canvasRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setError(null);
        setSignature(null);
        setSigPos(null);
        try {
            const data = await readFileAsArrayBuffer(selectedFile);
            const pdf = await loadPdfDoc(data);
            const { canvas, page } = await renderPdfPageToCanvas(pdf, 1, 1.5);
            const viewport = page.getViewport({ scale: 1.5 });
            setFile(selectedFile);
            setPreviewDataUrl(canvas.toDataURL('image/jpeg', 0.85));
            setPageW(viewport.width / 1.5);
            setPageH(viewport.height / 1.5);
        } catch (err) {
            setError(err.message || 'Could not preview this PDF. Try another file.');
        }
    };

    // Pointer-based drawing — works with mouse AND touch (uses pointer capture)
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = DRAW_WIDTH / rect.width;
        const scaleY = DRAW_HEIGHT / rect.height;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
        canvas.setPointerCapture(e.pointerId);

        const draw = (ev) => {
            ctx.lineTo((ev.clientX - rect.left) * scaleX, (ev.clientY - rect.top) * scaleY);
            ctx.stroke();
        };
        const stop = () => {
            canvas.removeEventListener('pointermove', draw);
            canvas.removeEventListener('pointerup', stop);
            canvas.removeEventListener('pointercancel', stop);
        };
        canvas.addEventListener('pointermove', draw);
        canvas.addEventListener('pointerup', stop);
        canvas.addEventListener('pointercancel', stop);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setSignature(null);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        const img = new Image();
        img.onload = () => setSigImgSize({ width: img.naturalWidth, height: img.naturalHeight });
        img.src = dataUrl;
        setSignature(dataUrl);
        setSigPos(null);
        setIsSigning(false);
    };

    // Click the preview to place the signature; maps displayed pixels → PDF points
    const handlePlaceSignature = (e) => {
        if (!signature || !pageW || !pageH) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const scale = rect.width / pageW; // displayed px per PDF point
        const x = Math.max(0, Math.min(cx / scale, pageW));
        const y = Math.max(0, Math.min(pageH - cy / scale, pageH));
        setSigPos({ x, y });
    };

    const handleDownload = async () => {
        if (!file || !signature) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('signature', signature);
            form.append('page', '1');
            form.append('scale', String(SIG_SCALE));
            if (sigPos) {
                form.append('x', String(sigPos.x));
                form.append('y', String(sigPos.y));
            }
            const res = await apiPost('/api/v1/pdf/sign', form);
            downloadBlob(dataUrlToBlob(res.dataUrl), `${stripExtension(file.name)}-signed.pdf`);
        } catch (err) {
            setError(err.message || 'Signing failed. Is the backend running?');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Overlay geometry in % so it tracks the preview at any display size
    const overlayLeft = sigPos && pageW ? (sigPos.x / pageW) * 100 : null;
    const overlayTop = sigPos && pageH ? ((pageH - sigPos.y) / pageH) * 100 : null;
    const overlayWidth = sigPos && sigImgSize.width && pageW ? ((sigImgSize.width * SIG_SCALE) / pageW) * 100 : null;

    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-[96rem] mx-auto">
                <div className="pl-10 sm:pl-12 lg:pl-14 mb-8">
                    <BackLink />
                </div>
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-sm font-medium text-purple-600 mb-4 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400">
                        <PenTool className="w-4 h-4 mr-2" />
                        Digital Signature
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-slate-100">
                        eSign PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-slate-400">
                        Draw your signature, place it on the document, and download the signed PDF.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Tools */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl -z-10 dark:bg-purple-900/20" />
                            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-slate-100">Document Upload</h2>

                            {!file ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer relative dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-primary/5 dark:hover:border-primary/30">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                    <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">Drop PDF here</span>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 mb-4 dark:bg-slate-800 dark:border-slate-700">
                                        <FileText className="w-6 h-6 text-red-500 mr-2" />
                                        <span className="text-sm font-medium truncate max-w-[150px] dark:text-slate-300">{file.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setFile(null); setPreviewDataUrl(null); setSignature(null); setSigPos(null); setError(null); }}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                                    >
                                        Remove File
                                    </button>
                                </div>
                            )}
                        </div>

                        {file && (
                            <div className="glass-card p-6 rounded-2xl relative overflow-hidden animate-slide-up">
                                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-slate-100">Your Signature</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsSigning(true)}
                                    className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex items-center justify-center dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-primary/10 dark:hover:text-primary dark:hover:border-primary/30"
                                >
                                    <PenTool className="w-4 h-4 mr-2" />
                                    {signature ? 'Redraw Signature' : 'Create Signature'}
                                </button>

                                {signature && (
                                    <div className="mt-4 p-2 bg-white border border-gray-200 rounded-lg dark:bg-slate-800 dark:border-slate-700">
                                        <img src={signature} alt="Signature" className="h-12 mx-auto" />
                                        <p className="text-center text-xs text-gray-400 mt-2 dark:text-slate-500">
                                            Click anywhere on the preview to place it
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main Preview Area */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-4 rounded-2xl min-h-[600px] flex items-center justify-center bg-gray-100/50 border-gray-200 relative dark:bg-slate-800/50 dark:border-slate-700">
                            {!file ? (
                                <div className="text-center text-gray-400 dark:text-slate-400">
                                    <Upload className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Upload a PDF to start signing</p>
                                </div>
                            ) : previewDataUrl ? (
                                <div className="relative w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
                                    <img
                                        src={previewDataUrl}
                                        alt="PDF page 1 preview"
                                        className="w-full h-auto select-none"
                                        onClick={handlePlaceSignature}
                                        style={{ cursor: signature ? 'copy' : 'default' }}
                                    />
                                    {signature && sigPos && overlayLeft !== null && (
                                        <div
                                            className="absolute border-2 border-dashed border-purple-500 bg-white/70 flex items-center justify-center pointer-events-none"
                                            style={{ left: `${overlayLeft}%`, top: `${overlayTop}%`, width: `${overlayWidth}%`, aspectRatio: `${sigImgSize.width} / ${sigImgSize.height}` }}
                                        >
                                            <img src={signature} alt="Placed signature" className="w-full h-full object-contain p-0.5" />
                                        </div>
                                    )}
                                    {signature && !sigPos && (
                                        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-purple-600 text-white px-3 py-1 rounded-full shadow">
                                            Click the preview to place your signature
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 dark:text-slate-400">
                                    <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Could not preview this PDF</p>
                                </div>
                            )}

                            {/* Signature Modal */}
                            {isSigning && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl z-20 flex items-center justify-center">
                                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md m-4 dark:bg-slate-800">
                                        <h3 className="text-xl font-bold mb-4 dark:text-slate-100">Draw Your Signature</h3>
                                        <div className="border border-gray-200 rounded-xl bg-gray-50 mb-4 h-40 relative dark:border-slate-700 dark:bg-slate-700">
                                            <canvas
                                                ref={canvasRef}
                                                width={DRAW_WIDTH}
                                                height={DRAW_HEIGHT}
                                                className="w-full h-full cursor-crosshair bg-white touch-none"
                                                onPointerDown={startDrawing}
                                            />
                                            <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">Sign Here</div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => { setIsSigning(false); }}
                                                className="flex-1 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:bg-primary/10"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={clearSignature}
                                                className="flex-1 py-2 px-4 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors dark:text-orange-400 dark:hover:bg-orange-900/20"
                                            >
                                                Clear
                                            </button>
                                            <button
                                                type="button"
                                                onClick={saveSignature}
                                                className="flex-1 py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                            >
                                                Adopt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-4">
                                <InlineNotice variant="error" title="Signing failed">
                                    {error}
                                </InlineNotice>
                            </div>
                        )}

                        {file && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    disabled={!signature || isSubmitting}
                                    className={`py-3 px-8 rounded-xl font-bold font-lg shadow-lg transition-all flex items-center ${signature && !isSubmitting
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-200 dark:shadow-purple-900/30 hover:shadow-purple-300 dark:hover:shadow-purple-900/60 hover:scale-[1.02]'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                                            Signing PDF…
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5 mr-2" />
                                            Download Signed PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ESign;

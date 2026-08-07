import React, { useState } from 'react';
import { EyeOff, Download, Search } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import { loadPdfDoc, renderPdfPageToCanvas, downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';

const RedactPDF = () => {
    const [file, setFile] = useState([]);
    const [terms, setTerms] = useState('');
    const [redactAll, setRedactAll] = useState(false);
    const [preview, setPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleFile = (files) => {
        setFile(files);
        setError(null);
        setResult(null);
        setPreview(null);
    };

    const analyze = async () => {
        if (!file[0]) return;
        const termList = terms
            .split(/[\n,]+/)
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);
        if (!redactAll && termList.length === 0) {
            setError('Enter at least one word to redact, or enable "Redact all text".');
            return;
        }
        setError(null);
        setPreview(null);
        setIsPreviewing(true);
        try {
            const data = new Uint8Array(await file[0].arrayBuffer());
            const pdf = await loadPdfDoc(data.slice());
            const pageCount = pdf.numPages;
            const pagePlans = [];

            for (let n = 1; n <= pageCount; n++) {
                const page = await pdf.getPage(n);
                const content = await page.getTextContent();
                const boxes = [];
                for (const item of content.items) {
                    if (!item.str) continue;
                    const lower = item.str.toLowerCase();
                    const hit = redactAll || termList.some((t) => lower.includes(t));
                    if (!hit) continue;
                    const [x, y] = [item.transform[4], item.transform[5]];
                    const h = item.height || 12;
                    boxes.push({ x: x - 1, y: y - h * 0.3, width: item.width + 2, height: h * 1.15 });
                }
                pagePlans.push(boxes);
            }

            setPreview({ pageCount, pagePlans, data });
            const { canvas } = await renderPdfPageToCanvas(pdf, 1, 1.2);
            const ctx = canvas.getContext('2d');
            const viewport = await (await pdf.getPage(1)).getViewport({ scale: 1.2 });
            const rects = pagePlans[0] || [];
            for (const r of rects) {
                const [vx, vyBottom] = viewport.convertToViewportPoint(r.x, r.y);
                const [vx2, vyTop] = viewport.convertToViewportPoint(r.x + r.width, r.y + r.height);
                ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
                ctx.fillRect(vx, vyTop, vx2 - vx, vyBottom - vyTop);
            }
            setPreview((p) => ({ ...p, previewDataUrl: canvas.toDataURL('image/jpeg', 0.9), totalMatches: rects.length }));
        } catch {
            setError('Could not analyze this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsPreviewing(false);
        }
    };

    const handleRedact = async () => {
        if (!file[0] || !preview) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const doc = await PDFDocument.load(preview.data);
            for (let i = 0; i < preview.pagePlans.length; i++) {
                const page = doc.getPage(i);
                for (const r of preview.pagePlans[i]) {
                    page.drawRectangle({ x: r.x, y: r.y, width: r.width, height: r.height, color: rgb(0, 0, 0) });
                }
            }
            const bytes = await doc.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${stripExtension(file[0].name)}_redacted.pdf`);
            setResult({ pages: preview.pageCount, size: bytes.length });
        } catch {
            setError('Could not redact this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={EyeOff} badge="Edit & Security" title="Redact PDF" subtitle="Permanently black out sensitive text across your entire PDF." accent="gray">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={handleFile} label="Drop a PDF here" hint="or click to browse" />

                {file[0] && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                <Search className="w-4 h-4 inline mr-1 text-gray-600" /> Words to redact
                            </label>
                            <textarea
                                value={terms}
                                onChange={(e) => setTerms(e.target.value)}
                                rows={3}
                                disabled={redactAll}
                                placeholder="One term per line, e.g.&#10;John Doe&#10;123-45-6789"
                                className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                            />
                            <label className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-700 cursor-pointer dark:text-gray-300">
                                <input type="checkbox" checked={redactAll} onChange={(e) => setRedactAll(e.target.checked)} className="w-4 h-4 accent-gray-600" />
                                Redact all text on every page
                            </label>
                        </div>

                        <ProcessButton
                            onClick={analyze}
                            disabled={isPreviewing}
                            isProcessing={isPreviewing}
                            processingText="Scanning PDF..."
                            accent="from-gray-600 to-slate-700 shadow-gray-200 hover:shadow-gray-300"
                        >
                            <Search className="w-5 h-5 mr-2" /> Find matches
                        </ProcessButton>

                        {preview && (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {preview.totalMatches} match{preview.totalMatches === 1 ? '' : 'es'} on the first page
                                </p>
                                {preview.previewDataUrl && (
                                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img src={preview.previewDataUrl} alt="Preview" className="w-full h-auto" />
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 dark:text-gray-500">Detected areas are highlighted in red. Black bars will be drawn over them.</p>
                            </div>
                        )}
                    </>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> PDF redacted</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleRedact}
                    disabled={!file[0] || !preview}
                    isProcessing={isProcessing}
                    processingText="Applying redactions..."
                    accent="from-gray-800 to-black shadow-gray-200 hover:shadow-gray-300"
                >
                    <EyeOff className="w-5 h-5 mr-2" /> Apply Redactions
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default RedactPDF;

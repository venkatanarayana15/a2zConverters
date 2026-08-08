import React, { useState } from 'react';
import { Gauge } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { loadPdfDoc, renderPdfPageToCanvas, downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import InlineNotice from '../../../components/ui/InlineNotice';

const CompressPDF = () => {
    const [file, setFile] = useState([]);
    const [level, setLevel] = useState('strong');
    const [quality, setQuality] = useState('medium');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleCompress = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const source = await file[0].arrayBuffer();
            let bytes;

            if (level === 'fast') {
                const doc = await PDFDocument.load(source);
                bytes = await doc.save({ useObjectStreams: true });
            } else {
                const data = new Uint8Array(source);
                const pdf = await loadPdfDoc(data);
                const qualityMap = { low: { scale: 1, jpeg: 0.5 }, medium: { scale: 1.5, jpeg: 0.7 }, high: { scale: 2, jpeg: 0.85 } };
                const { scale, jpeg } = qualityMap[quality];
                const out = await PDFDocument.create();

                for (let n = 1; n <= pdf.numPages; n++) {
                    const { canvas } = await renderPdfPageToCanvas(pdf, n, scale);
                    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', jpeg));
                    const image = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
                    const page = out.addPage([image.width / scale, image.height / scale]);
                    page.drawImage(image, { x: 0, y: 0, width: image.width / scale, height: image.height / scale });
                }
                bytes = await out.save();
            }

            const compressed = new Blob([bytes], { type: 'application/pdf' });
            downloadBlob(compressed, `${stripExtension(file[0].name)}_compressed.pdf`);
            setResult({ size: compressed.size, original: source.byteLength });
        } catch {
            setError('Could not compress this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    const savings = result ? Math.round((1 - result.size / result.original) * 100) : 0;

    return (
        <ToolLayout icon={Gauge} badge="Convert from pdf" title="Compress PDF" subtitle="Shrink your PDF file size while keeping it readable." accent="teal">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {file[0] && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Compression level</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-slate-800">
                                <button
                                    onClick={() => setLevel('fast')}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${level === 'fast' ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                                >
                                    Fast · keep quality
                                </button>
                                <button
                                    onClick={() => setLevel('strong')}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${level === 'strong' ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                                >
                                    Strong · smallest size
                                </button>
                            </div>
                        </div>

                        {level === 'strong' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Quality</label>
                                <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-slate-800">
                                    {['low', 'medium', 'high'].map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => setQuality(q)}
                                            className={`py-2 rounded-lg text-sm font-medium capitalize transition-all ${quality === q ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2 dark:text-slate-400">Strong mode re-renders pages as images — great for scans, but text becomes non-selectable.</p>
                            </div>
                        )}
                    </>
                )}

                {error && <InlineNotice variant="error" title="Compression failed">{error}</InlineNotice>}

                {result && (
                    <InlineNotice variant="success" title="Compressed">
                        {formatBytes(result.original)} → {formatBytes(result.size)} ({savings}% smaller)
                    </InlineNotice>
                )}

                <ProcessButton
                    onClick={handleCompress}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Compressing PDF..."
                    accent="from-teal-500 to-cyan-600 shadow-teal-200 dark:shadow-teal-900/40 hover:shadow-teal-300 dark:hover:shadow-teal-900/60"
                >
                    <Gauge className="w-5 h-5 mr-2" /> Compress PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default CompressPDF;

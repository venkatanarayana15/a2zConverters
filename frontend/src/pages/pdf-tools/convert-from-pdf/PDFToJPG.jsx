import React, { useState } from 'react';
import { FileImage, Download } from 'lucide-react';
import { loadPdfDoc, renderPdfPageToCanvas, downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';

const PDFToJPG = () => {
    const [file, setFile] = useState([]);
    const [mode, setMode] = useState('all');
    const [scale, setScale] = useState(2);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleConvert = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const data = new Uint8Array(await file[0].arrayBuffer());
            const pdf = await loadPdfDoc(data);
            const total = pdf.numPages;
            const pagesToConvert = mode === 'all' ? Array.from({ length: total }, (_, i) => i + 1) : [1];
            const pageCount = pagesToConvert.length;

            if (pageCount === 1) {
                const { canvas } = await renderPdfPageToCanvas(pdf, pagesToConvert[0], scale);
                const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
                downloadBlob(blob, `${stripExtension(file[0].name)}.jpg`);
                setResult({ count: 1, size: blob.size, pageCount: total });
                return;
            }

            const zip = await import('jszip');
            const z = new zip.default();
            for (let i = 0; i < pageCount; i++) {
                const { canvas } = await renderPdfPageToCanvas(pdf, pagesToConvert[i], scale);
                const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
                z.file(`${stripExtension(file[0].name)}_page_${pagesToConvert[i]}.jpg`, blob);
            }
            const zipped = await z.generateAsync({ type: 'blob' });
            downloadBlob(zipped, `${stripExtension(file[0].name)}_images.zip`);
            setResult({ count: pageCount, size: zipped.size, pageCount: total });
        } catch {
            setError('Could not convert this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={FileImage} badge="Convert from pdf" title="PDF to JPG" subtitle="Turn every PDF page into a high-quality JPG image." accent="red">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {file[0] && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Pages</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-slate-800">
                                <button
                                    onClick={() => setMode('all')}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${mode === 'all' ? 'bg-white shadow-sm text-red-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                                >
                                    All pages
                                </button>
                                <button
                                    onClick={() => setMode('first')}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${mode === 'first' ? 'bg-white shadow-sm text-red-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                                >
                                    First page only
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Image quality · {scale === 1 ? 'Standard' : scale === 2 ? 'High' : 'Best'}</label>
                            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-slate-800">
                                {[1, 2, 3].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setScale(s)}
                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${scale === s ? 'bg-white shadow-sm text-red-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                                    >
                                        {s === 1 ? 'Standard' : s === 2 ? 'High' : 'Best'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Converted {result.count} page{result.count === 1 ? '' : 's'}</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.count === 1 ? `${formatBytes(result.size)} JPG downloaded.` : `JPGs bundled into a ${formatBytes(result.size)} ZIP.`}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleConvert}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Converting to JPG..."
                    accent="from-red-500 to-rose-600 shadow-red-200 dark:shadow-red-900/40 hover:shadow-red-300 dark:hover:shadow-red-900/60"
                >
                    <FileImage className="w-5 h-5 mr-2" /> Convert to JPG
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default PDFToJPG;

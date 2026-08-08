import React, { useState } from 'react';
import { Layout, ArrowUp, ArrowDown, Trash2, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes, loadPdfDoc, renderPdfPageToCanvas } from '../../../lib/pdfUtils';

const MAX_PAGES = 50;

const OrganizePDF = () => {
    const [file, setFile] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleFile = async (files) => {
        setFile(files);
        setResult(null);
        setError(null);
        setThumbnails([]);
        if (files.length > 0) {
            try {
                const pdf = await loadPdfDoc(await files[0].arrayBuffer());
                const cap = Math.min(pdf.numPages, MAX_PAGES);
                const items = [];
                for (let i = 1; i <= cap; i++) {
                    const { canvas } = await renderPdfPageToCanvas(pdf, i, 0.6);
                    items.push({ index: i - 1, dataUrl: canvas.toDataURL('image/jpeg', 0.6) });
                }
                setThumbnails(items);
            } catch {
                setError('Could not read this PDF. Please make sure it is a valid PDF file.');
            }
        }
    };

    const move = (i, dir) => {
        setThumbnails((prev) => {
            const j = i + dir;
            if (j < 0 || j >= prev.length) return prev;
            const next = [...prev];
            [next[i], next[j]] = [next[j], next[i]];
            return next;
        });
    };

    const remove = (i) => setThumbnails((prev) => prev.filter((_, idx) => idx !== i));

    const handleOrganize = async () => {
        if (!file[0] || thumbnails.length === 0) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const src = await PDFDocument.load(await file[0].arrayBuffer());
            const out = await PDFDocument.create();
            const indices = thumbnails.map((t) => t.index);
            const pages = await out.copyPages(src, indices);
            pages.forEach((p) => out.addPage(p));
            const bytes = await out.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${stripExtension(file[0].name)}_organized.pdf`);
            setResult({ pages: out.getPageCount(), size: bytes.length });
        } catch {
            setError('Could not organize this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={Layout} badge="Organize" title="Organize PDF" subtitle="Reorder, remove, and arrange pages in your PDF exactly how you want them." accent="red">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={handleFile} label="Drop a PDF here" hint="or click to browse" />

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {thumbnails.length > 0 && (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                                {thumbnails.length} page{thumbnails.length !== 1 ? 's' : ''} loaded. Use the arrows to reorder, or remove pages you don't want.
                            </p>
                            <span className="text-xs text-gray-400 dark:text-slate-400">{thumbnails.length === MAX_PAGES && `Showing first ${MAX_PAGES} pages.`}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {thumbnails.map((t, i) => (
                                <div key={t.index} className="border border-gray-200 rounded-xl overflow-hidden bg-white dark:border-slate-700 dark:bg-slate-800">
                                    <div className="relative bg-gray-50 dark:bg-slate-900">
                                        <img src={t.dataUrl} alt={`Page ${t.index + 1}`} className="w-full aspect-[3/4] object-contain" />
                                        <span className="absolute top-1 left-1 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs font-bold">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-2">
                                        <button
                                            onClick={() => move(i, -1)}
                                            disabled={i === 0}
                                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-primary/10"
                                            aria-label="Move up"
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => move(i, 1)}
                                            disabled={i === thumbnails.length - 1}
                                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-primary/10"
                                            aria-label="Move down"
                                        >
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => remove(i)}
                                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            aria-label="Remove page"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Organize complete</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleOrganize}
                    disabled={!file[0] || thumbnails.length === 0}
                    isProcessing={isProcessing}
                    processingText="Organizing pages..."
                    accent="from-red-500 to-rose-500 shadow-red-200 dark:shadow-red-900/40 hover:shadow-red-300 dark:hover:shadow-red-900/60"
                >
                    <Layout className="w-5 h-5 mr-2" /> Organize PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default OrganizePDF;

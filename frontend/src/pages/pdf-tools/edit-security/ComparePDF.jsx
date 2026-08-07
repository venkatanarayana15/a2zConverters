import React, { useState } from 'react';
import { GitCompare, ChevronLeft, ChevronRight } from 'lucide-react';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { loadPdfDoc, renderPdfPageToCanvas } from '../../../lib/pdfUtils';

const ComparePDF = () => {
    const [fileA, setFileA] = useState([]);
    const [fileB, setFileB] = useState([]);
    const [page, setPage] = useState(1);
    const [imgA, setImgA] = useState(null);
    const [imgB, setImgB] = useState(null);
    const [maxPage, setMaxPage] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const renderAt = async (n) => {
        if (!fileA[0] || !fileB[0]) return;
        setIsProcessing(true);
        setError(null);
        try {
            const [pdfA, pdfB] = await Promise.all([
                loadPdfDoc(await fileA[0].arrayBuffer()),
                loadPdfDoc(await fileB[0].arrayBuffer()),
            ]);
            const clamp = Math.max(1, Math.min(n, pdfA.numPages, pdfB.numPages));
            const [{ canvas: cA }, { canvas: cB }] = await Promise.all([
                renderPdfPageToCanvas(pdfA, clamp, 1.2),
                renderPdfPageToCanvas(pdfB, clamp, 1.2),
            ]);
            setImgA(cA.toDataURL('image/png'));
            setImgB(cB.toDataURL('image/png'));
            setPage(clamp);
            setMaxPage(Math.min(pdfA.numPages, pdfB.numPages));
        } catch {
            setError('Could not render the PDFs for comparison. Please make sure both files are valid PDFs.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCompare = () => renderAt(page);

    return (
        <ToolLayout icon={GitCompare} badge="Edit & Security" title="Compare PDF" subtitle="View any page of two PDF documents side by side." accent="purple">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">First PDF</p>
                        <ToolDropzone files={fileA} onChange={setFileA} label="Drop first PDF here" hint="or click to browse" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Second PDF</p>
                        <ToolDropzone files={fileB} onChange={setFileB} label="Drop second PDF here" hint="or click to browse" />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Page Number</label>
                        <input
                            type="number"
                            min="1"
                            value={page}
                            onChange={(e) => setPage(Math.max(1, parseInt(e.target.value || '1', 10)))}
                            className="w-32 bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                        />
                    </div>
                    <ProcessButton
                        onClick={handleCompare}
                        disabled={!fileA[0] || !fileB[0]}
                        isProcessing={isProcessing}
                        processingText="Rendering pages..."
                        accent="from-purple-500 to-violet-500 shadow-purple-200 hover:shadow-purple-300"
                    >
                        <GitCompare className="w-5 h-5 mr-2" /> Compare
                    </ProcessButton>
                </div>

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {imgA && imgB && (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Viewing page <span className="font-bold text-gray-900 dark:text-gray-100">{page}</span> of up to {maxPage}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => renderAt(page - 1)}
                                    disabled={page <= 1 || isProcessing}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => renderAt(page + 1)}
                                    disabled={page >= maxPage || isProcessing}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <p className="px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">First PDF</p>
                                <img src={imgA} alt="First PDF page" className="w-full bg-white" />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <p className="px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">Second PDF</p>
                                <img src={imgB} alt="Second PDF page" className="w-full bg-white" />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ToolLayout>
    );
};

export default ComparePDF;

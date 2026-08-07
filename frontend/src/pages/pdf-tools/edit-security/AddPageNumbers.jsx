import React, { useState } from 'react';
import { Hash, Download } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const AddPageNumbers = () => {
    const [file, setFile] = useState([]);
    const [format, setFormat] = useState('page-of');
    const [position, setPosition] = useState('bottom-center');
    const [startAt, setStartAt] = useState(1);
    const [fontSize, setFontSize] = useState(12);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleAdd = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const doc = await PDFDocument.load(await file[0].arrayBuffer());
            const font = await doc.embedFont(StandardFonts.Helvetica);
            const pages = doc.getPages();
            const last = startAt + pages.length - 1;

            pages.forEach((page, i) => {
                const num = startAt + i;
                const label = format === 'page-of'
                    ? `${num} / ${last}`
                    : format === 'page-only'
                        ? `${num}`
                        : `${last}`;
                const { width } = page.getSize();
                const textWidth = font.widthOfTextAtSize(label, fontSize);
                const x = position === 'bottom-left'
                    ? 36
                    : position === 'bottom-right'
                        ? width - 36 - textWidth
                        : (width - textWidth) / 2;
                const y = 24;
                page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.35, 0.35, 0.35) });
            });

            const bytes = await doc.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${stripExtension(file[0].name)}_numbered.pdf`);
            setResult({ pages: pages.length, size: bytes.length });
        } catch {
            setError('Could not add page numbers to this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={Hash} badge="Edit & Security" title="Add Page Numbers" subtitle="Add page numbers to every page of your PDF in seconds." accent="indigo">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {file[0] && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Number Format</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'page-of', label: 'Page X of Y' },
                                    { value: 'page-only', label: 'Page number only' },
                                    { value: 'total-only', label: 'Total only' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setFormat(opt.value)}
                                        className={`p-2 rounded-lg border text-xs font-medium transition-all ${format === opt.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'border-gray-200 hover:border-gray-300 text-gray-500 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-400'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Position</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setPosition(pos)}
                                        className={`p-2 rounded-lg border text-xs font-medium transition-all ${position === pos ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'border-gray-200 hover:border-gray-300 text-gray-500 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-400'}`}
                                    >
                                        {pos.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Start Number</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={startAt}
                                    onChange={(e) => setStartAt(Math.max(0, parseInt(e.target.value || '0', 10)))}
                                    className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Font Size</label>
                                <input
                                    type="number"
                                    min="8"
                                    max="48"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Math.max(8, Math.min(48, parseInt(e.target.value || '12', 10))))}
                                    className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>
                        </div>
                    </>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Page numbers added</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleAdd}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Adding page numbers..."
                    accent="from-indigo-500 to-purple-500 shadow-indigo-200 hover:shadow-indigo-300"
                >
                    <Hash className="w-5 h-5 mr-2" /> Add Page Numbers
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default AddPageNumbers;

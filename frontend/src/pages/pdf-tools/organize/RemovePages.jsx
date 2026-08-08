import React, { useState } from 'react';
import { FileMinus, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const parsePageList = (input, max) => {
    const pages = new Set();
    for (const part of input.split(',')) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        const m = trimmed.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
        if (!m) return null;
        const start = parseInt(m[1], 10);
        const end = m[2] ? parseInt(m[2], 10) : start;
        if (start < 1 || end > max || start > end) return null;
        for (let p = start; p <= end; p++) pages.add(p);
    }
    return pages.size ? [...pages] : null;
};

const RemovePages = () => {
    const [file, setFile] = useState([]);
    const [pageCount, setPageCount] = useState(null);
    const [pagesInput, setPagesInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleFile = async (files) => {
        setFile(files);
        setResult(null);
        setError(null);
        if (files.length > 0) {
            try {
                const doc = await PDFDocument.load(await files[0].arrayBuffer());
                setPageCount(doc.getPageCount());
            } catch {
                setError('This does not look like a valid PDF file.');
                setPageCount(null);
            }
        } else {
            setPageCount(null);
        }
    };

    const handleRemove = async () => {
        if (!file[0]) return;
        const toRemove = parsePageList(pagesInput, pageCount);
        if (!toRemove) {
            setError(`Invalid page list. Use formats like "2, 4, 6-8" (pages 1-${pageCount}).`);
            return;
        }
        if (toRemove.length >= pageCount) {
            setError('You cannot remove every page from the document.');
            return;
        }
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const doc = await PDFDocument.load(await file[0].arrayBuffer());
            const indices = toRemove.map((p) => p - 1).sort((a, b) => b - a);
            for (const idx of indices) doc.removePage(idx);
            const bytes = await doc.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${stripExtension(file[0].name)}_removed.pdf`);
            setResult({ removed: toRemove.length, remaining: doc.getPageCount(), size: bytes.length });
        } catch {
            setError('Could not process this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={FileMinus} badge="Organize" title="Remove Pages" subtitle="Delete unwanted pages from your PDF. Enter page numbers to remove." accent="red">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={handleFile} label="Drop a PDF here" hint="or click to browse" />

                {pageCount !== null && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                        This PDF has <span className="font-bold text-gray-900 dark:text-slate-100">{pageCount}</span> pages.
                    </div>
                )}

                {pageCount !== null && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Pages to remove</label>
                        <input
                            type="text"
                            value={pagesInput}
                            onChange={(e) => setPagesInput(e.target.value)}
                            placeholder={`e.g. 2, 4, 6-8`}
                            className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-100"
                        />
                    </div>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Removed {result.removed} pages</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.remaining} pages remaining · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleRemove}
                    disabled={!file[0] || pageCount === null || !pagesInput.trim()}
                    isProcessing={isProcessing}
                    processingText="Removing pages..."
                    accent="from-red-500 to-rose-500 shadow-red-200 dark:shadow-red-900/40 hover:shadow-red-300 dark:hover:shadow-red-900/60"
                >
                    <FileMinus className="w-5 h-5 mr-2" /> Remove Pages
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default RemovePages;

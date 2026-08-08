import React, { useState } from 'react';
import { Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import InlineNotice from '../../../components/ui/InlineNotice';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const parseRanges = (input, max) => {
    const ranges = [];
    for (const part of input.split(',')) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        const m = trimmed.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
        if (!m) return null;
        const start = parseInt(m[1], 10);
        const end = m[2] ? parseInt(m[2], 10) : start;
        if (start < 1 || end > max || start > end) return null;
        ranges.push([start, end]);
    }
    return ranges.length ? ranges : null;
};

const SplitPDF = () => {
    const [file, setFile] = useState([]);
    const [pageCount, setPageCount] = useState(null);
    const [mode, setMode] = useState('single');
    const [rangesInput, setRangesInput] = useState('');
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

    const handleSplit = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const srcBytes = await file[0].arrayBuffer();
            const src = await PDFDocument.load(srcBytes);
            const total = src.getPageCount();
            const base = stripExtension(file[0].name);

            const outputs = [];
            if (mode === 'single') {
                for (let i = 0; i < total; i++) {
                    const out = await PDFDocument.create();
                    const pages = await out.copyPages(src, [i]);
                    pages.forEach((p) => out.addPage(p));
                    const bytes = await out.save();
                    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${base}_page_${i + 1}.pdf`);
                    outputs.push(bytes.length);
                }
            } else {
                const ranges = parseRanges(rangesInput, total);
                if (!ranges) {
                    setError(`Invalid page ranges. Use formats like "1-3, 5, 8-10" (pages 1-${total}).`);
                    setIsProcessing(false);
                    return;
                }
                for (let idx = 0; idx < ranges.length; idx++) {
                    const [start, end] = ranges[idx];
                    const out = await PDFDocument.create();
                    const indices = [];
                    for (let p = start; p <= end; p++) indices.push(p - 1);
                    const pages = await out.copyPages(src, indices);
                    pages.forEach((p) => out.addPage(p));
                    const bytes = await out.save();
                    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${base}_${start}-${end}.pdf`);
                    outputs.push(bytes.length);
                }
            }
            setResult({ count: outputs.length, total: outputs.reduce((a, b) => a + b, 0) });
        } catch {
            setError('Could not split this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={Scissors} badge="Organize" title="Split PDF" subtitle="Split a PDF into separate files — one page each, or by custom page ranges." accent="red">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={handleFile} label="Drop a PDF here" hint="or click to browse" />

                {pageCount !== null && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                        This PDF has <span className="font-bold text-gray-900 dark:text-slate-100">{pageCount}</span> pages.
                    </div>
                )}

                {pageCount > 1 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Split Mode</label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-slate-800">
                            <button
                                onClick={() => setMode('single')}
                                className={`py-2 rounded-lg text-sm font-medium transition-all ${mode === 'single' ? 'bg-white shadow-sm text-red-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                            >
                                One page per file
                            </button>
                            <button
                                onClick={() => setMode('ranges')}
                                className={`py-2 rounded-lg text-sm font-medium transition-all ${mode === 'ranges' ? 'bg-white shadow-sm text-red-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                            >
                                Custom ranges
                            </button>
                        </div>

                        {mode === 'ranges' && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Page Ranges</label>
                                <input
                                    type="text"
                                    value={rangesInput}
                                    onChange={(e) => setRangesInput(e.target.value)}
                                    placeholder={`e.g. 1-3, 5, 8-${pageCount}`}
                                    className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-100"
                                />
                            </div>
                        )}
                    </div>
                )}

                {error && <InlineNotice variant="error" title="Split failed">{error}</InlineNotice>}

                {result && (
                    <InlineNotice variant="success" title="Split complete">
                        {result.count} files created ({formatBytes(result.total)})
                    </InlineNotice>
                )}

                <ProcessButton
                    onClick={handleSplit}
                    disabled={!file[0] || pageCount === null || (mode === 'ranges' && !rangesInput.trim())}
                    isProcessing={isProcessing}
                    processingText="Splitting PDF..."
                    accent="from-red-500 to-rose-500 shadow-red-200 dark:shadow-red-900/40 hover:shadow-red-300 dark:hover:shadow-red-900/60"
                >
                    <Scissors className="w-5 h-5 mr-2" /> Split PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default SplitPDF;

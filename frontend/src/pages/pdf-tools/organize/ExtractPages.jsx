import React, { useState } from 'react';
import { FileOutput, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
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

const ExtractPages = () => {
    const [file, setFile] = useState([]);
    const [pageCount, setPageCount] = useState(null);
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

    const handleExtract = async () => {
        if (!file[0] || pageCount === null) return;
        const ranges = parseRanges(rangesInput, pageCount);
        if (!ranges) {
            setError(`Invalid page ranges. Use formats like "1-3, 5, 8-10" (pages 1-${pageCount}).`);
            return;
        }
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const src = await PDFDocument.load(await file[0].arrayBuffer());
            const out = await PDFDocument.create();
            const indices = [];
            for (const [start, end] of ranges) {
                for (let p = start; p <= end; p++) indices.push(p - 1);
            }
            const pages = await out.copyPages(src, indices);
            pages.forEach((p) => out.addPage(p));
            const bytes = await out.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${stripExtension(file[0].name)}_extracted.pdf`);
            setResult({ pages: out.getPageCount(), size: bytes.length });
        } catch {
            setError('Could not extract pages from this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={FileOutput} badge="Organize" title="Extract Pages" subtitle="Pull specific pages out of a PDF and save them as a new document." accent="red">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={handleFile} label="Drop a PDF here" hint="or click to browse" />

                {pageCount !== null && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        This PDF has <span className="font-bold text-gray-900 dark:text-gray-100">{pageCount}</span> pages.
                    </div>
                )}

                {pageCount !== null && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Pages to Extract</label>
                        <input
                            type="text"
                            value={rangesInput}
                            onChange={(e) => setRangesInput(e.target.value)}
                            placeholder={`e.g. 1-3, 5, 8-${pageCount}`}
                            className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                        />
                    </div>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Extract complete</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages extracted ({formatBytes(result.size)})</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleExtract}
                    disabled={!file[0] || pageCount === null || !rangesInput.trim()}
                    isProcessing={isProcessing}
                    processingText="Extracting pages..."
                    accent="from-red-500 to-rose-500 shadow-red-200 hover:shadow-red-300"
                >
                    <FileOutput className="w-5 h-5 mr-2" /> Extract Pages
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default ExtractPages;

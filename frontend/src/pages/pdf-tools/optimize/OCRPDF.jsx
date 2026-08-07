import React, { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, loadPdfDoc, renderPdfPageToCanvas } from '../../../lib/pdfUtils';

const MAX_PAGES = 10;

const LANGS = [
    { code: 'eng', label: 'English' },
    { code: 'hin', label: 'Hindi' },
    { code: 'spa', label: 'Spanish' },
    { code: 'fra', label: 'French' },
    { code: 'deu', label: 'German' },
    { code: 'ara', label: 'Arabic' },
];

const OCRPDF = () => {
    const [file, setFile] = useState([]);
    const [lang, setLang] = useState('eng');
    const [pageCount, setPageCount] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleFile = async (files) => {
        setFile(files);
        setResult(null);
        setError(null);
        if (files.length > 0) {
            try {
                const pdf = await loadPdfDoc(await files[0].arrayBuffer());
                setPageCount(pdf.numPages);
            } catch {
                setError('This does not look like a valid PDF file.');
                setPageCount(null);
            }
        } else {
            setPageCount(null);
        }
    };

    const handleOCR = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        let worker = null;
        try {
            const pdf = await loadPdfDoc(await file[0].arrayBuffer());
            const total = Math.min(pdf.numPages, MAX_PAGES);
            worker = await createWorker(lang);
            const chunks = [];
            for (let i = 1; i <= total; i++) {
                setProgress(`Recognizing page ${i}/${total}...`);
                const { canvas } = await renderPdfPageToCanvas(pdf, i, 2);
                const { data } = await worker.recognize(canvas);
                chunks.push(`--- Page ${i} ---\n${data.text.trim()}\n`);
            }
            const text = chunks.join('\n');
            downloadBlob(new Blob([text], { type: 'text/plain' }), `${stripExtension(file[0].name)}_ocr.txt`);
            setResult({ text, pages: total });
        } catch {
            setError('Could not recognize text from this PDF. Please check your internet connection and try again.');
        } finally {
            if (worker) await worker.terminate().catch(() => {});
            setIsProcessing(false);
            setProgress('');
        }
    };

    return (
        <ToolLayout icon={Eye} badge="Optimize" title="OCR PDF" subtitle="Extract searchable text from scanned documents with optical character recognition." accent="teal">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={handleFile} label="Drop a scanned PDF here" hint="or click to browse" />

                {pageCount !== null && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        This PDF has <span className="font-bold text-gray-900 dark:text-gray-100">{pageCount}</span> pages.
                        <span className="ml-1 text-gray-400 dark:text-gray-500">The first {MAX_PAGES} pages will be recognized.</span>
                    </div>
                )}

                {pageCount !== null && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Recognition Language</label>
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                        >
                            {LANGS.map((l) => (
                                <option key={l.code} value={l.code}>{l.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Recognition complete</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages recognized · .txt file downloaded</p>
                        <pre className="mt-3 p-3 rounded-xl bg-white/70 border border-green-100 text-xs text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-300">
                            {result.text.slice(0, 2000)}
                        </pre>
                    </div>
                )}

                <ProcessButton
                    onClick={handleOCR}
                    disabled={!file[0] || pageCount === null}
                    isProcessing={isProcessing}
                    processingText={progress || 'Recognizing text...'}
                    accent="from-teal-500 to-emerald-500 shadow-teal-200 hover:shadow-teal-300"
                >
                    <Eye className="w-5 h-5 mr-2" /> Recognize Text
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default OCRPDF;

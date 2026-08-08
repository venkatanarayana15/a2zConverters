import React, { useState } from 'react';
import { FileArchive, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { apiPost, dataUrlToBlob } from '../../../lib/api';
import { downloadBlob } from '../../../lib/pdfUtils';

const PDFToPDFA = () => {
    const [file, setFile] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleConvert = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const form = new FormData();
            form.append('file', file[0]);
            const res = await apiPost('/api/v1/pdf/pdf-to-pdfa', form);
            const base = (file[0].name || 'document').replace(/\.[^.]+$/, '');
            setResult({ dataUrl: res.dataUrl, name: `${base}-pdfa.pdf` });
        } catch (e) {
            setError(e.message || 'Conversion failed. Is the backend running?');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        downloadBlob(dataUrlToBlob(result.dataUrl), result.name);
    };

    return (
        <ToolLayout icon={FileArchive} badge="Convert from PDF" title="PDF to PDF/A" subtitle="Convert your PDF into the archival PDF/A format for long-term preservation." accent="green">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" accent="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" />

                {error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        {error}
                    </div>
                )}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> PDF/A ready
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500 mb-4">
                            {result.name} — your file has been converted to the archival format.
                        </p>
                        <button
                            type="button"
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors"
                        >
                            <Download className="w-4 h-4" /> Download PDF/A
                        </button>
                    </div>
                )}

                {!result && (
                    <ProcessButton
                        onClick={handleConvert}
                        disabled={!file[0]}
                        isProcessing={isProcessing}
                        processingText="Converting to PDF/A..."
                        accent="from-green-500 to-emerald-500 shadow-green-200 dark:shadow-green-900/40 hover:shadow-green-300 dark:hover:shadow-green-900/60"
                    >
                        <FileArchive className="w-5 h-5 mr-2" /> Convert to PDF/A
                    </ProcessButton>
                )}
            </div>
        </ToolLayout>
    );
};

export default PDFToPDFA;

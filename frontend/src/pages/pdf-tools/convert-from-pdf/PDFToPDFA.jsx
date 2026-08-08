import React, { useState } from 'react';
import { FileArchive, CheckCircle2 } from 'lucide-react';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';

const PDFToPDFA = () => {
    const [file, setFile] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleConvert = () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        setTimeout(() => {
            setIsProcessing(false);
            setResult({ done: true });
        }, 2000);
    };

    return (
        <ToolLayout icon={FileArchive} badge="Convert from PDF" title="PDF to PDF/A" subtitle="Convert your PDF into the archival PDF/A format for long-term preservation." accent="green">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                <p className="p-3 rounded-xl bg-blue-50 text-blue-600 text-sm border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">Demo preview — this tool is simulated in the browser and no file is generated.</p>

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Demo complete</p>
                        <p className="text-sm text-green-600 dark:text-green-500">No file is generated in this demo — full conversion is coming soon.</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleConvert}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Converting to PDF/A..."
                    accent="from-green-500 to-emerald-500 shadow-green-200 dark:shadow-green-900/40 hover:shadow-green-300 dark:hover:shadow-green-900/60"
                >
                    <FileArchive className="w-5 h-5 mr-2" /> Convert to PDF/A
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default PDFToPDFA;

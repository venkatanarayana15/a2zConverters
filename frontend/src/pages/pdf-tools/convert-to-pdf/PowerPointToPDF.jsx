import React, { useState } from 'react';
import { Presentation, CheckCircle2 } from 'lucide-react';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';

const PowerPointToPDF = () => {
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
        <ToolLayout icon={Presentation} badge="Convert to PDF" title="PowerPoint to PDF" subtitle="Turn your PowerPoint slides into a PDF presentation you can share anywhere." accent="orange">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} accept=".pptx,.ppt" label="Drop a PowerPoint here" hint="or click to browse (.pptx)" />

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
                    processingText="Converting slides..."
                    accent="from-orange-500 to-red-500 shadow-orange-200 hover:shadow-orange-300"
                >
                    <Presentation className="w-5 h-5 mr-2" /> Convert to PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default PowerPointToPDF;

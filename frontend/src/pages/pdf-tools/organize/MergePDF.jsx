import React, { useState } from 'react';
import { Files, Combine, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, formatBytes } from '../../../lib/pdfUtils';

const MergePDF = () => {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please add at least two PDF files.');
            return;
        }
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const merged = await PDFDocument.create();
            for (const file of files) {
                const doc = await PDFDocument.load(await file.arrayBuffer());
                const pages = await merged.copyPages(doc, doc.getPageIndices());
                pages.forEach((p) => merged.addPage(p));
            }
            const bytes = await merged.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'merged.pdf');
            setResult({ size: bytes.length, pages: merged.getPageCount() });
        } catch {
            setError('Could not merge these PDFs. Please make sure they are valid PDF files.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={Files} badge="Organize" title="Merge PDF" subtitle="Combine multiple PDF files into one document in the order you upload them." accent="red">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800">
                <ToolDropzone files={files} onChange={setFiles} multiple label="Drop PDFs here" hint="or click to browse (select multiple)" />

                {error && (
                    <p className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>
                )}

                {result && (
                    <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between dark:bg-green-900/20 dark:border-green-800">
                        <div>
                            <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Merge complete</p>
                            <p className="text-sm text-green-600 dark:text-green-500">{files.length} files, {result.pages} pages, {formatBytes(result.size)}</p>
                        </div>
                        <button
                            onClick={handleMerge}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors"
                        >
                            Download Again
                        </button>
                    </div>
                )}

                <div className="mt-6">
                    <ProcessButton
                        onClick={handleMerge}
                        disabled={files.length < 2}
                        isProcessing={isProcessing}
                        processingText="Merging PDFs..."
                        accent="from-red-500 to-rose-500 shadow-red-200 hover:shadow-red-300"
                    >
                        <Combine className="w-5 h-5 mr-2" /> Merge PDFs
                    </ProcessButton>
                </div>
            </div>
        </ToolLayout>
    );
};

export default MergePDF;

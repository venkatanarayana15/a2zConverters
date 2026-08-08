import React, { useState } from 'react';
import { Files, Combine } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import InlineNotice from '../../../components/ui/InlineNotice';
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
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800">
                <ToolDropzone files={files} onChange={setFiles} multiple label="Drop PDFs here" hint="or click to browse (select multiple)" />

                {error && (
                    <InlineNotice variant="error" title="Merge failed">{error}</InlineNotice>
                )}

                {result && (
                    <InlineNotice
                        variant="success"
                        title="Merge complete"
                        action={
                            <button
                                onClick={handleMerge}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors"
                            >
                                Download Again
                            </button>
                        }
                    >
                        {files.length} files, {result.pages} pages, {formatBytes(result.size)}
                    </InlineNotice>
                )}

                <div className="mt-6">
                    <ProcessButton
                        onClick={handleMerge}
                        disabled={files.length < 2}
                        isProcessing={isProcessing}
                        processingText="Merging PDFs..."
                        accent="from-red-500 to-rose-500 shadow-red-200 dark:shadow-red-900/40 hover:shadow-red-300 dark:hover:shadow-red-900/60"
                    >
                        <Combine className="w-5 h-5 mr-2" /> Merge PDFs
                    </ProcessButton>
                </div>
            </div>
        </ToolLayout>
    );
};

export default MergePDF;

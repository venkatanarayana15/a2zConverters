import React, { useState } from 'react';
import { Wrench, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const RepairPDF = () => {
    const [file, setFile] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleRepair = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const bytes = await file[0].arrayBuffer();
            const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, throwOnInvalidObject: false });
            const repaired = await doc.save();
            downloadBlob(new Blob([repaired], { type: 'application/pdf' }), `${stripExtension(file[0].name)}_repaired.pdf`);
            setResult({ pages: doc.getPageCount(), original: bytes.length, size: repaired.length });
        } catch {
            setError('This PDF could not be repaired. It may be too badly damaged to recover.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={Wrench} badge="Optimize" title="Repair PDF" subtitle="Rebuild the internal structure of a damaged or corrupted PDF file." accent="teal">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Repair complete</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.original)} → {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleRepair}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Repairing PDF..."
                    accent="from-teal-500 to-emerald-500 shadow-teal-200 dark:shadow-teal-900/40 hover:shadow-teal-300 dark:hover:shadow-teal-900/60"
                >
                    <Wrench className="w-5 h-5 mr-2" /> Repair PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default RepairPDF;

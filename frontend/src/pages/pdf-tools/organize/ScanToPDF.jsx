import React, { useState } from 'react';
import { Scan, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const ScanToPDF = () => {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleScan = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const doc = await PDFDocument.create();
            for (const f of files) {
                const bytes = await f.arrayBuffer();
                const isPng = f.type === 'image/png' || f.name.toLowerCase().endsWith('.png');
                const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
                doc.addPage([img.width, img.height]);
            }
            const bytes = await doc.save();
            const base = files.length === 1 ? stripExtension(files[0].name) : 'scanned-documents';
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${base}_scan.pdf`);
            setResult({ pages: doc.getPageCount(), size: bytes.length });
        } catch {
            setError('Could not create the PDF. Only PNG and JPG images are supported.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={Scan} badge="Organize" title="Scan to PDF" subtitle="Turn a set of scanned images or photos into a single PDF document." accent="red">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={files} onChange={setFiles} multiple accept="image/png,image/jpeg" label="Drop images here" hint="or click to browse (PNG or JPG)" />

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Scan complete</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleScan}
                    disabled={files.length === 0}
                    isProcessing={isProcessing}
                    processingText="Creating PDF..."
                    accent="from-red-500 to-rose-500 shadow-red-200 dark:shadow-red-900/40 hover:shadow-red-300 dark:hover:shadow-red-900/60"
                >
                    <Scan className="w-5 h-5 mr-2" /> Convert to PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default ScanToPDF;

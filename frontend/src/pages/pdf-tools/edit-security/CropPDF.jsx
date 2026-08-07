import React, { useState } from 'react';
import { Crop, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const CropPDF = () => {
    const [file, setFile] = useState([]);
    const [margins, setMargins] = useState({ left: 5, right: 5, top: 5, bottom: 5 });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const updateMargin = (key, value) => {
        const num = Math.min(45, Math.max(0, parseFloat(value) || 0));
        setMargins((prev) => ({ ...prev, [key]: num }));
    };

    const handleCrop = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const doc = await PDFDocument.load(await file[0].arrayBuffer());
            const { left, right, top, bottom } = margins;
            for (const page of doc.getPages()) {
                const { width, height } = page.getSize();
                const cw = Math.max(1, width * (1 - (left + right) / 100));
                const ch = Math.max(1, height * (1 - (top + bottom) / 100));
                page.setCropBox((left / 100) * width, (bottom / 100) * height, cw, ch);
            }
            const bytes = await doc.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${stripExtension(file[0].name)}_cropped.pdf`);
            setResult({ pages: doc.getPageCount(), size: bytes.length });
        } catch {
            setError('Could not crop this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    const marginsConfig = [
        { key: 'left', label: 'Left' },
        { key: 'right', label: 'Right' },
        { key: 'top', label: 'Top' },
        { key: 'bottom', label: 'Bottom' },
    ];

    return (
        <ToolLayout icon={Crop} badge="Edit & Security" title="Crop PDF" subtitle="Trim the margins of every page in your PDF by a percentage." accent="blue">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {file[0] && (
                    <div className="grid grid-cols-2 gap-4">
                        {marginsConfig.map(({ key, label }) => (
                            <div key={key}>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                                    <span className="text-sm text-blue-600 font-bold">{margins[key]}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="45"
                                    step="1"
                                    value={margins[key]}
                                    onChange={(e) => updateMargin(key, e.target.value)}
                                    className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Crop applied</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleCrop}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Cropping PDF..."
                    accent="from-blue-600 to-indigo-600 shadow-blue-200 hover:shadow-blue-300"
                >
                    <Crop className="w-5 h-5 mr-2" /> Crop PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default CropPDF;

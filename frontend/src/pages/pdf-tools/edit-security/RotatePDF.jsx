import React, { useState } from 'react';
import { RotateCw, Download } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const options = [
    { value: 90, label: '90°' },
    { value: 180, label: '180°' },
    { value: 270, label: '270°' },
];

const RotatePDF = () => {
    const [file, setFile] = useState([]);
    const [rotation, setRotation] = useState(90);
    const [direction, setDirection] = useState('clockwise');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleRotate = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const doc = await PDFDocument.load(await file[0].arrayBuffer());
            const delta = direction === 'clockwise' ? rotation : 360 - rotation;
            for (const page of doc.getPages()) {
                const current = page.getRotation().angle;
                page.setRotation(degrees((current + delta) % 360));
            }
            const bytes = await doc.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${stripExtension(file[0].name)}_rotated.pdf`);
            setResult({ pages: doc.getPageCount(), size: bytes.length });
        } catch {
            setError('Could not rotate this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={RotateCw} badge="Edit & Security" title="Rotate PDF" subtitle="Rotate every page in your PDF by 90°, 180° or 270°." accent="blue">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {file[0] && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Direction</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-gray-800">
                                <button
                                    onClick={() => setDirection('clockwise')}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${direction === 'clockwise' ? 'bg-white shadow-sm text-blue-600 dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                >
                                    Clockwise
                                </button>
                                <button
                                    onClick={() => setDirection('counterclockwise')}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${direction === 'counterclockwise' ? 'bg-white shadow-sm text-blue-600 dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                >
                                    Counter-clockwise
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Angle</label>
                            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-gray-800">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setRotation(opt.value)}
                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${rotation === opt.value ? 'bg-white shadow-sm text-blue-600 dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Rotation applied</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleRotate}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Rotating PDF..."
                    accent="from-blue-600 to-indigo-600 shadow-blue-200 hover:shadow-blue-300"
                >
                    <RotateCw className="w-5 h-5 mr-2" /> Rotate PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default RotatePDF;

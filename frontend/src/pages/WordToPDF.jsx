import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Download } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';
import { apiPost, downloadDataUrl, makeUploadForm } from '../lib/api';

const WordToPDF = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfName, setPdfName] = useState('converted.pdf');

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setIsDone(false);
            setPdfUrl(null);
        }
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsConverting(true);
        try {
            const result = await apiPost('/api/v1/pdf/word-to-pdf', makeUploadForm(file, {}, 'file'));
            setPdfUrl(result.dataUrl);
            setPdfName(result.fileName);
            setIsDone(true);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50 text-gray-900">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-sm font-medium text-blue-600 mb-4">
                        <FileText className="w-4 h-4 mr-2" />
                        Word to PDF
                    </div>
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
                        Convert Word to PDF
                    </h1>
                    <p className="text-gray-600">
                        DOC and DOCX to PDF. Easy, fast, and free.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">
                    {!file ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 hover:bg-gray-50 transition-colors">
                            <input type="file" accept=".doc,.docx" onChange={handleFileChange} className="hidden" id="word-upload" />
                            <label htmlFor="word-upload" className="cursor-pointer">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FileText className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Select WORD file</h3>
                                <p className="text-sm text-gray-500">or drop DOC/DOCX here</p>
                            </label>
                        </div>
                    ) : (
                        <div className="py-10">
                            <div className="mb-8">
                                <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900">{file.name}</h3>
                                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>

                            {!isDone ? (
                                <PhysicsButton onClick={handleConvert} disabled={isConverting} className="px-12 w-full sm:w-auto">
                                    {isConverting ? 'Converting...' : 'Convert to PDF'}
                                </PhysicsButton>
                            ) : (
                                <div className="animate-slide-up-sm">
                                    <div className="flex items-center justify-center text-green-600 mb-6 gap-2">
                                        <CheckCircle className="w-6 h-6" />
                                        <span className="font-bold text-lg">Conversion Successful!</span>
                                    </div>
                                    <PhysicsButton onClick={() => downloadDataUrl(pdfUrl, pdfName)} className="bg-gray-900 text-white hover:bg-black px-12 w-full sm:w-auto">
                                        <Download className="w-4 h-4 mr-2" /> Download PDF
                                    </PhysicsButton>
                                    <button onClick={() => setFile(null)} className="block mt-4 mx-auto text-sm text-gray-500 hover:text-gray-900 underline">
                                        Convert another file
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WordToPDF;

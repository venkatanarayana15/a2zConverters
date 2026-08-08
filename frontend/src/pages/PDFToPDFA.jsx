import React, { useState } from 'react';
import { Upload, Archive, CheckCircle, Download } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';
import { apiPost, downloadDataUrl, makeUploadForm } from '../lib/api';

const PDFToPDFA = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsConverting(true);
        try {
            const res = await apiPost('/api/v1/pdf/pdf-to-pdfa', makeUploadForm(file, {}, 'file'));
            setResult(res);
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
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-sm font-medium text-purple-600 mb-4">
                        <Archive className="w-4 h-4 mr-2" />
                        PDF to PDF/A
                    </div>
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-500">
                        Convert PDF to PDF/A
                    </h1>
                    <p className="text-gray-600">
                        Create an ISO-standard archival PDF/A file for long-term storage.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">
                    {!file ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 hover:bg-gray-50 transition-colors">
                            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-pdfa-upload" />
                            <label htmlFor="pdf-pdfa-upload" className="cursor-pointer">
                                <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Archive className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Select PDF file</h3>
                                <p className="text-sm text-gray-500">or drop your PDF here</p>
                            </label>
                        </div>
                    ) : (
                        <div className="py-10">
                            <div className="mb-8">
                                <Archive className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900">{file.name}</h3>
                                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>

                            {!result ? (
                                <PhysicsButton onClick={handleConvert} disabled={isConverting} className="px-12 w-full sm:w-auto">
                                    {isConverting ? 'Converting...' : 'Convert to PDF/A'}
                                </PhysicsButton>
                            ) : (
                                <div className="animate-slide-up-sm">
                                    <div className="flex items-center justify-center text-green-600 mb-6 gap-2">
                                        <CheckCircle className="w-6 h-6" />
                                        <span className="font-bold text-lg">Conversion Successful!</span>
                                    </div>
                                    <PhysicsButton onClick={() => downloadDataUrl(result.dataUrl, result.fileName)} className="bg-gray-900 text-white hover:bg-black px-12 w-full sm:w-auto">
                                        <Download className="w-4 h-4 mr-2" /> Download PDF/A
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

export default PDFToPDFA;

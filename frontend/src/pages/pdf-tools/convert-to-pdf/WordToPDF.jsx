import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Download } from 'lucide-react';
import PhysicsButton from '../../../components/PhysicsButton';
import BackLink from '../../../components/BackLink';

const WordToPDF = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setIsDone(false);
        }
    };

    const handleConvert = () => {
        if (!file) return;
        setIsConverting(true);
        setTimeout(() => {
            setIsConverting(false);
            setIsDone(true);
        }, 2000);
    };

    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <BackLink />
                </div>
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-sm font-medium text-blue-600 mb-4 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">
                        <FileText className="w-4 h-4 mr-2" />
                        Word to PDF
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        Convert Word to PDF
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        DOC and DOCX to PDF. Easy, fast, and free.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center dark:bg-gray-900 dark:border-gray-800">
                    {!file ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800">
                            <input type="file" accept=".doc,.docx" onChange={handleFileChange} className="hidden" id="word-upload" />
                            <label htmlFor="word-upload" className="cursor-pointer">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-blue-900/20 dark:text-blue-400">
                                    <FileText className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-gray-100">Select WORD file</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">or drop DOC/DOCX here</p>
                            </label>
                        </div>
                    ) : (
                        <div className="py-10">
                            <div className="mb-8">
                                <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{file.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
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
                                    <PhysicsButton className="bg-gray-900 text-white hover:bg-black px-12 w-full sm:w-auto">
                                        <Download className="w-4 h-4 mr-2" /> Download PDF
                                    </PhysicsButton>
                                    <button onClick={() => setFile(null)} className="block mt-4 mx-auto text-sm text-gray-500 hover:text-gray-900 underline dark:text-gray-400 dark:hover:text-gray-100">
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

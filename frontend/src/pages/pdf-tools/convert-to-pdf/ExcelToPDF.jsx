import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Download } from 'lucide-react';
import PhysicsButton from '../../../components/PhysicsButton';
import BackLink from '../../../components/BackLink';

const ExcelToPDF = () => {
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
            <div className="max-w-[96rem] mx-auto">
                <div className="pl-10 sm:pl-12 lg:pl-14 mb-8">
                    <BackLink />
                </div>
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm font-medium text-green-600 mb-4 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Excel to PDF
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-slate-100">
                        Convert Excel to PDF
                    </h1>
                    <p className="text-gray-600 dark:text-slate-400">
                        Make your spreadsheets easy to read by converting them to PDF.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center dark:bg-slate-900 dark:border-slate-800">
                    {!file ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:hover:bg-primary/5 dark:hover:border-primary/30">
                            <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="hidden" id="excel-upload" />
                            <label htmlFor="excel-upload" className="cursor-pointer">
                                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-900/20 dark:text-green-400">
                                    <FileSpreadsheet className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-slate-100">Select EXCEL file</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400">or drop XLS/XLSX here</p>
                            </label>
                        </div>
                    ) : (
                        <div className="py-10">
                            <div className="mb-8">
                                <FileSpreadsheet className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 dark:text-slate-100">{file.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
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
                                    <PhysicsButton className="bg-gray-900 text-white hover:bg-black dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white px-12 w-full sm:w-auto">
                                        <Download className="w-4 h-4 mr-2" /> Download PDF
                                    </PhysicsButton>
                                    <button onClick={() => setFile(null)} className="block mt-4 mx-auto text-sm text-gray-500 hover:text-gray-900 underline dark:text-slate-400 dark:hover:text-slate-100">
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

export default ExcelToPDF;

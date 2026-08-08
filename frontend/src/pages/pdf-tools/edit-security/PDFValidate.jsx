import React, { useState } from 'react';
import { Upload, CheckCircle, AlertTriangle, FileText, ShieldCheck, AlertCircle } from 'lucide-react';
import BackLink from '../../../components/BackLink';
import { apiPost } from '../../../lib/api';

const isFailDetail = (detail) => /failed|missing|corrupt/i.test(detail);

const PDFValidate = () => {
    const [file, setFile] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setValidationResult(null);
            setError(null);
        }
    };

    const handleValidate = async () => {
        if (!file) return;
        setIsValidating(true);
        setError(null);
        try {
            const form = new FormData();
            form.append('file', file);
            const result = await apiPost('/api/v1/pdf/validate', form);
            setValidationResult(result);
        } catch (e) {
            setError(e.message || 'Validation failed. Is the backend running?');
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-[96rem] mx-auto">
                <div className="pl-10 sm:pl-12 lg:pl-14 mb-8">
                    <BackLink />
                </div>
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-sm font-medium text-blue-600 mb-4 dark:bg-primary/20 dark:border-primary/30 dark:text-primary">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        ISO Standard Validation
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-slate-100">
                        PDF Validator
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-slate-400">
                        Check if your PDF file is corrupted, valid, or compliant with PDF/A standards.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden group md:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -z-10 transition-all group-hover:bg-blue-200 dark:bg-blue-900/15 dark:group-hover:bg-blue-900/25" />

                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-slate-100">
                            <Upload className="w-5 h-5 mr-2 text-blue-500" />
                            Upload PDF
                        </h2>

                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${file ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-600 dark:hover:bg-blue-900/10'}`}>
                            <input
                                type="file"
                                id="pdf-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="pdf-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                {file ? (
                                    <div className="flex flex-col items-center">
                                        <FileText className="w-16 h-16 text-blue-500 mb-4" />
                                        <span className="text-gray-900 font-medium dark:text-slate-100">{file.name}</span>
                                        <span className="text-sm text-gray-500 mt-1 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <button
                                            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFile(null);
                                                setValidationResult(null);
                                                setError(null);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <span className="text-gray-900 font-medium dark:text-slate-100">Click to upload PDF</span>
                                        <span className="text-sm text-gray-500 mt-2 dark:text-slate-400">PDF documents only</span>
                                    </>
                                )}
                            </label>
                        </div>

                        <button
                            disabled={!file || isValidating}
                            onClick={handleValidate}
                            className={`w-full mt-6 py-4 rounded-xl font-bold font-lg shadow-lg transition-all flex items-center justify-center ${file && !isValidating
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200 dark:shadow-blue-900/40 hover:shadow-blue-300 dark:hover:shadow-blue-900/60 hover:scale-[1.02]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 dark:bg-slate-800 dark:border-slate-700'
                                }`}
                        >
                            {isValidating ? (
                                <>
                                    <span className="animate-spin mr-2 h-5 w-5 border-2 border-b-transparent border-white rounded-full"></span>
                                    Validating...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5 mr-2" />
                                    Validate PDF
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -z-10 dark:bg-indigo-900/15" />

                        {error && (
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                {error}
                            </div>
                        )}

                        {!validationResult && !error ? (
                            <div className="text-center text-gray-500 dark:text-slate-400">
                                <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                                <h3 className="text-lg font-medium mb-2">Ready to Validate</h3>
                                <p>Upload a PDF file to check its integrity and compliance.</p>
                            </div>
                        ) : validationResult ? (
                            <div className="animate-fade-in">                                <div className={`flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-6 ${validationResult.isValid ? 'bg-green-100 text-green-600 dark:bg-green-900/25 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/25 dark:text-red-400'}`}>
                                    {validationResult.isValid ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                                </div>
                                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2 dark:text-slate-100">
                                    {validationResult.isValid ? 'Validation Successful' : 'Validation Failed'}
                                </h3>
                                <p className="text-center text-gray-600 mb-8 dark:text-slate-400">
                                    {validationResult.message}
                                </p>
                                {typeof validationResult.pageCount === 'number' && (
                                    <p className="text-center text-sm text-gray-500 mb-4 dark:text-slate-400">
                                        {validationResult.pageCount} page{validationResult.pageCount === 1 ? '' : 's'} detected
                                    </p>
                                )}

                                <div className="space-y-3">
                                    {validationResult.details.map((detail, idx) => {
                                        const failed = isFailDetail(detail);
                                        return (
                                            <div key={idx} className={`flex items-center p-3 bg-white/50 rounded-lg border ${failed ? 'border-red-200 dark:border-red-900/50' : 'border-gray-100 dark:border-slate-700'} dark:bg-slate-800/50`}>
                                                {failed ? (
                                                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                                                ) : (
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                )}
                                                <span className={`text-sm ${failed ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'}`}>{detail}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFValidate;

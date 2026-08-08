import React, { useState } from 'react';
import { Upload, Download, Layers, Wand2, Eraser, AlertCircle } from 'lucide-react';
import LoadingState from '../../components/ui/LoadingState';
import BackLink from '../../components/BackLink';
import { apiPost, dataUrlToBlob } from '../../lib/api';
import { downloadBlob } from '../../lib/pdfUtils';

const BackgroundRemover = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isProcessed, setIsProcessed] = useState(false);
    const [resultDataUrl, setResultDataUrl] = useState('');
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setIsProcessed(false);
            setResultDataUrl('');
            setError(null);
        }
    };

    const handleRemoveBackground = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        try {
            const form = new FormData();
            form.append('image', file);
            const res = await apiPost('/api/v1/image/bg-remove', form);
            setResultDataUrl(res.dataUrl);
            setIsProcessed(true);
        } catch (e) {
            setError(e.message || 'Background removal failed. Is the backend running?');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!resultDataUrl) return;
        const base = (file?.name || 'image').replace(/\.[^.]+$/, '');
        downloadBlob(dataUrlToBlob(resultDataUrl), `${base}-no-bg.png`);
    };

    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-[96rem] mx-auto">
                <div className="pl-10 sm:pl-12 lg:pl-14 mb-8">
                    <BackLink />
                </div>
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-sm font-medium text-rose-600 mb-4 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400">
                        <Eraser className="w-4 h-4 mr-2" />
                        AI Magic Tool
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-slate-100">
                        Background Remover
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-slate-400">
                        Remove backgrounds from images instantly with AI precision. precise cutouts for products, portraits, and more.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Upload & Result Area */}
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-center items-center group">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10 transition-all group-hover:bg-rose-100 dark:bg-rose-900/10 dark:group-hover:bg-rose-900/20" />

                        {!file ? (
                            <div className={`border-2 border-dashed rounded-2xl p-12 text-center w-full h-full flex flex-col items-center justify-center transition-all duration-300 border-gray-300 hover:border-rose-400 hover:bg-rose-50/30 dark:border-slate-600 dark:hover:bg-rose-900/10`}>
                                <input
                                    type="file"
                                    id="bg-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="bg-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm dark:bg-rose-900/20 dark:text-rose-400 dark:shadow-black/30 group-hover:scale-110 transition-transform">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-slate-100">Upload Image</h3>
                                    <p className="text-gray-500 dark:text-slate-400">We support JPG, PNG, WebP</p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl dark:shadow-black/50 checkerboard">
                            <div className="relative w-full h-[450px] flex items-center justify-center">
                                {isProcessed ? (
                                    <>
                                        {/* Original Image (Behind) */}
                                        <img src={preview} alt="Original" className="absolute inset-0 w-full h-full object-contain opacity-30 blur-sm" />

                                        {/* Processed Result (real PNG with transparency) */}
                                        <div className="relative z-10 max-w-full max-h-full">
                                            <img src={resultDataUrl} alt="Background removed result" className="max-w-full max-h-[420px] object-contain rounded-xl border border-gray-200 dark:border-slate-700" />
                                        </div>
                                    </>
                                ) : (
                                    <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain relative z-10" />
                                )}

                                {/* Loading Overlay */}
                                {isProcessing && (
                                    <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">
                                            <LoadingState size="card" label="Removing background…" description="AI is cutting out your subject." />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                    {/* Right: Actions */}
                    <div className="space-y-8 pt-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-slate-100">One-Click Removal</h2>
                            <p className="text-gray-600 text-lg leading-relaxed dark:text-slate-400">
                                Our AI automatically detects the subject and removes the background in seconds.
                                Perfect for e-commerce, profiles, and design projects.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-colors dark:hover:bg-primary/5">
                                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 dark:bg-rose-900/20 dark:text-rose-400">
                                    <Wand2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-slate-100">Automatic Detection</h4>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">No manual selection needed. Just upload and wait.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-colors dark:hover:bg-primary/5">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-slate-100">Transparent Background</h4>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">Download as PNG with transparency preserved.</p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                {error}
                            </div>
                        )}

                        {!isProcessed ? (
                            <button
                                type="button"
                                onClick={handleRemoveBackground}
                                disabled={!file || isProcessing}
                                className={`w-full py-4 rounded-xl font-bold text-xl shadow-lg transition-all flex items-center justify-center ${file && !isProcessing
                                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-200 dark:shadow-rose-900/40 hover:shadow-rose-300 dark:hover:shadow-rose-900/60 hover:scale-[1.02]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800'
                                    }`}
                            >
                                {isProcessing ? (
                                    'Processing Magic...'
                                ) : (
                                    <>
                                        <Wand2 className="w-6 h-6 mr-2" />
                                        Remove Background
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => { setFile(null); setIsProcessed(false); setResultDataUrl(''); setError(null); }}
                                    className="w-full py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-primary/10 dark:hover:text-primary dark:hover:border-primary/30"
                                >
                                    Upload New
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    className="w-full py-4 rounded-xl font-bold bg-gray-900 text-white shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:shadow-black/40 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center transition-all"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download HD
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundRemover;

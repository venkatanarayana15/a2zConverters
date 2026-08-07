import React, { useState } from 'react';
import { Upload, Download, Image as ImageIcon, Layers, Wand2, Eraser, Check } from 'lucide-react';
import LoadingState from '../../components/ui/LoadingState';
import BackLink from '../../components/BackLink';

const BackgroundRemover = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isProcessed, setIsProcessed] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setIsProcessed(false);
        }
    };

    const handleRemoveBackground = () => {
        if (!file) return;
        setIsProcessing(true);

        // Simulate API processing delay
        setTimeout(() => {
            setIsProcessing(false);
            setIsProcessed(true);
        }, 2500);
    };

    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-[96rem] mx-auto">
                <div className="mb-6">
                    <BackLink />
                </div>
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-sm font-medium text-rose-600 mb-4 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400">
                        <Eraser className="w-4 h-4 mr-2" />
                        AI Magic Tool
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        Background Remover
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
                        Remove backgrounds from images instantly with AI precision. precise cutouts for products, portraits, and more.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Upload & Result Area */}
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-center items-center group">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10 transition-all group-hover:bg-rose-100" />

                        {!file ? (
                            <div className={`border-2 border-dashed rounded-2xl p-12 text-center w-full h-full flex flex-col items-center justify-center transition-all duration-300 border-gray-300 hover:border-rose-400 hover:bg-rose-50/30 dark:border-gray-600 dark:hover:bg-rose-900/10`}>
                                <input
                                    type="file"
                                    id="bg-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="bg-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">Upload Image</h3>
                                    <p className="text-gray-500 dark:text-gray-400">We support JPG, PNG, WebP</p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-[url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.8Q2X5X0X5X0.jpg&f=1&nofb=1')] bg-repeat" style={{ backgroundImage: 'conic-gradient(#eee 25%, white 0 50%, #eee 0 75%, white 0)', backgroundSize: '20px 20px' }}>
                                {/* This is a simulation of comparison. In a real app we would overlay the processed image on top */}
                                <div className="relative w-full h-[450px] flex items-center justify-center">
                                    {isProcessed ? (
                                        <>
                                            {/* Original Image (Behind) */}
                                            <img src={preview} alt="Original" className="absolute inset-0 w-full h-full object-contain opacity-30 blur-sm" />

                                            {/* Processed Result (Placeholder for simulation as we don't have real AI here) */}
                                            <div className="relative z-10 p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-xl text-center max-w-sm dark:bg-gray-800/90">
                                                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle dark:bg-green-900/20 dark:text-green-400">
                                                    <Check className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-gray-100">Background Removed!</h3>
                                                <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
                                                    Your image is ready. In this demo, we simulate the process.
                                                </p>
                                                <img src={preview} alt="Result" className="w-24 h-24 object-cover rounded-lg mx-auto border-2 border-white shadow-md" />
                                            </div>
                                        </>
                                    ) : (
                                        <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain relative z-10" />
                                    )}

                                    {/* Loading Overlay */}
                                    {isProcessing && (
                                        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-gray-100">One-Click Removal</h2>
                            <p className="text-gray-600 text-lg leading-relaxed dark:text-gray-400">
                                Our AI automatically detects the subject and removes the background in seconds.
                                Perfect for e-commerce, profiles, and design projects.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-colors dark:hover:bg-gray-800/50">
                                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 dark:bg-rose-900/20 dark:text-rose-400">
                                    <Wand2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100">Automatic Detection</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No manual selection needed. Just upload and wait.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-colors dark:hover:bg-gray-800/50">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100">Transparent Background</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Download as PNG with transparency preserved.</p>
                                </div>
                            </div>
                        </div>

                        {!isProcessed ? (
                            <button
                                onClick={handleRemoveBackground}
                                disabled={!file || isProcessing}
                                className={`w-full py-4 rounded-xl font-bold text-xl shadow-lg transition-all flex items-center justify-center ${file && !isProcessing
                                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-200 hover:shadow-rose-300 hover:scale-[1.02]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
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
                                    onClick={() => setFile(null)}
                                    className="w-full py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                                >
                                    Upload New
                                </button>
                                <button
                                    className="w-full py-4 rounded-xl font-bold bg-gray-900 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center transition-all"
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

import React, { useState } from 'react';
import { Upload, Download, Image as ImageIcon, RotateCw, Contrast, Sun, Droplets, Wand2, RefreshCw, Sliders } from 'lucide-react';
import BackLink from '../../components/BackLink';

const ImageEditor = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [grayscale, setGrayscale] = useState(0);
    const [sepia, setSepia] = useState(0);
    const [rotation, setRotation] = useState(0);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            resetFilters();
        }
    };

    const resetFilters = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setGrayscale(0);
        setSepia(0);
        setRotation(0);
    };

    const filterStyle = {
        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%)`,
        transform: `rotate(${rotation}deg)`
    };

    const handleDownload = () => {
        if (!file || !preview) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Handle rotation dimensions
            if (rotation % 180 !== 0) {
                canvas.width = img.height;
                canvas.height = img.width;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }

            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%)`;

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = canvas.toDataURL();
            link.click();
        };
        img.src = preview;
    };

    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-[96rem] mx-auto">
                <div className="pl-10 sm:pl-12 lg:pl-14 mb-8">
                    <BackLink />
                </div>
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-sm font-medium text-purple-600 mb-4 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Creative Studio
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-slate-100">
                        Online Image Editor
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-slate-400">
                        Enhance your photos with professional filters, adjustments, and effects directly in your browser.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Editor Canvas */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-8 rounded-2xl relative overflow-hidden min-h-[600px] flex flex-col justify-center items-center group bg-gray-900/5 backdrop-blur-sm">
                            {!file ? (
                                <div className={`border-2 border-dashed rounded-2xl p-12 text-center w-full h-full flex flex-col items-center justify-center transition-all duration-300 border-gray-400 hover:border-purple-400 hover:bg-purple-50/10 dark:border-slate-600 dark:hover:bg-purple-900/10`}>
                                    <input
                                        type="file"
                                        id="editor-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="editor-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 shadow-sm dark:bg-purple-900/20 dark:text-purple-400 dark:shadow-black/30 group-hover:scale-110 transition-transform">
                                            <Upload className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2 dark:text-slate-200">Open Photo</h3>
                                        <p className="text-gray-500 dark:text-slate-400">Edit JPG, PNG, WEBP securely</p>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={filterStyle}
                                        className="max-w-full max-h-[550px] object-contain transition-all duration-200 shadow-2xl"
                                    />
                                    <button
                                        onClick={() => { setFile(null); setPreview(null); }}
                                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-red-50 text-gray-600 hover:text-red-500 transition-all z-10 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:bg-red-900/20"
                                        title="Close Image"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls Panel */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl max-h-[600px] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg flex items-center">
                                    <Sliders className="w-5 h-5 mr-2 text-purple-600" />
                                    Adjustments
                                </h3>
                                <button onClick={resetFilters} className="text-xs text-purple-600 hover:underline">Reset All</button>
                            </div>

                            <div className="space-y-6">
                                {/* Brightness */}
                                <div>
                                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                                        <span className="flex items-center"><Sun className="w-4 h-4 mr-1 text-orange-500" /> Brightness</span>
                                        <span>{brightness}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={brightness}
                                        onChange={(e) => setBrightness(e.target.value)}
                                        className="w-full accent-purple-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                    />
                                </div>

                                {/* Contrast */}
                                <div>
                                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                                        <span className="flex items-center"><Contrast className="w-4 h-4 mr-1 text-gray-600 dark:text-slate-400" /> Contrast</span>
                                        <span>{contrast}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={contrast}
                                        onChange={(e) => setContrast(e.target.value)}
                                        className="w-full accent-purple-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                    />
                                </div>

                                {/* Saturation */}
                                <div>
                                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                                        <span className="flex items-center"><Droplets className="w-4 h-4 mr-1 text-blue-500" /> Saturation</span>
                                        <span>{saturation}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={saturation}
                                        onChange={(e) => setSaturation(e.target.value)}
                                        className="w-full accent-purple-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                    />
                                </div>

                                <hr className="border-gray-100 dark:border-slate-800" />

                                {/* Filters */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3 dark:text-slate-100">Filters</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setGrayscale(prev => prev > 0 ? 0 : 100)}
                                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${grayscale > 0 ? 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-primary/10 dark:hover:text-primary dark:hover:border-primary/30'}`}
                                        >
                                            B&W
                                        </button>
                                        <button
                                            onClick={() => setSepia(prev => prev > 0 ? 0 : 100)}
                                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${sepia > 0 ? 'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-primary/10 dark:hover:text-primary dark:hover:border-primary/30'}`}
                                        >
                                            Sepia
                                        </button>
                                    </div>
                                </div>

                                {/* Rotation */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3 dark:text-slate-100">Transform</h4>
                                    <button
                                        onClick={() => setRotation(prev => prev + 90)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-primary/10 dark:hover:text-primary dark:hover:border-primary/30"
                                    >
                                        <RotateCw className="w-4 h-4 mr-2" />
                                        Rotate 90°
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!file}
                            onClick={handleDownload}
                            className={`w-full py-4 rounded-xl font-bold font-lg shadow-lg transition-all flex items-center justify-center ${file
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-purple-200 dark:shadow-purple-900/40 hover:shadow-purple-300 dark:hover:shadow-purple-900/60 hover:scale-[1.02]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800'
                                }`}
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Save Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;

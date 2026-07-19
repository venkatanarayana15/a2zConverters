import React, { useState, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Check, Sliders, RefreshCw, AlertCircle } from 'lucide-react';

const ImageResizer = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [unit, setUnit] = useState('px');
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [quality, setQuality] = useState(90);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);

            // Get original dimensions
            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({ width: img.width, height: img.height });
                setWidth(img.width);
                setHeight(img.height);
                setAspectRatio(img.width / img.height);
            };
            img.src = objectUrl;
        }
    };

    const handleWidthChange = (e) => {
        const val = e.target.value;
        setWidth(val);
        if (lockAspectRatio && val && unit === 'px') {
            setHeight(Math.round(val / aspectRatio));
        }
    };

    const handleHeightChange = (e) => {
        const val = e.target.value;
        setHeight(val);
        if (lockAspectRatio && val && unit === 'px') {
            setWidth(Math.round(val * aspectRatio));
        }
    };

    const toggleUnit = (u) => {
        setUnit(u);
        // Reset to original or convert logic could go here, for now just resetting/clearing or keeping values if px
        if (u === 'px' && originalDimensions.width > 0) {
            setWidth(originalDimensions.width);
            setHeight(originalDimensions.height);
        } else if (u === '%') {
            setWidth(100);
            setHeight(100);
        } else {
            setWidth('');
            setHeight('');
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-background text-foreground">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-sm font-medium text-blue-600 mb-4">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Professional Tools
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400">
                        Image Resizer & Compressor
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Resize images by pixel, percentage, or dimensions. Compress without losing visible quality.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Upload & Preview */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8 rounded-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-center items-center group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 transition-all group-hover:bg-blue-100" />

                            {!file ? (
                                <div className={`border-2 border-dashed rounded-2xl p-12 text-center w-full h-full flex flex-col items-center justify-center transition-all duration-300 border-gray-300 hover:border-blue-400 hover:bg-blue-50/30`}>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                            <Upload className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Image</h3>
                                        <p className="text-gray-500">JPG, PNG, WEBP up to 10MB</p>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-w-full max-h-[500px] object-contain rounded-lg shadow-xl"
                                    />
                                    <button
                                        onClick={() => { setFile(null); setPreview(null); }}
                                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-red-50 text-gray-600 hover:text-red-500 transition-all"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        Original: {originalDimensions.width} x {originalDimensions.height} px
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="font-bold text-lg mb-6 flex items-center">
                                <Sliders className="w-5 h-5 mr-2 text-blue-600" />
                                Resize Settings
                            </h3>

                            {/* Unit Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    {['px', '%', 'cm', 'inch'].map((u) => (
                                        <button
                                            key={u}
                                            onClick={() => toggleUnit(u)}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${unit === u ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            {u}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={handleWidthChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={handleHeightChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Aspect Ratio */}
                            <div className="mb-6 flex items-center">
                                <input
                                    type="checkbox"
                                    id="aspect"
                                    checked={lockAspectRatio}
                                    onChange={(e) => setLockAspectRatio(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="aspect" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
                                    Lock Aspect Ratio
                                </label>
                            </div>

                            {/* Quality */}
                            <div className="mb-8">
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">Quality</label>
                                    <span className="text-sm font-bold text-blue-600">{quality}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(e.target.value)}
                                    className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <button
                                disabled={!file}
                                className={`w-full py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center ${file
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.02]'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Resize & Download
                            </button>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start">
                            <AlertCircle className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-orange-700">
                                <strong>Tip:</strong> Use 'px' for exact dimensions or '%' for quick scaling. Reducing quality helps lower file size.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageResizer;

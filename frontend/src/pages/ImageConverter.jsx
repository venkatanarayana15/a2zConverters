import React, { useState } from 'react';
import { Upload, Download, Image as ImageIcon, RefreshCw, FileImage, Settings, Check } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';
import { apiPost, dataUrlToBlob, makeUploadForm } from '../lib/api';

const ImageConverter = () => {
    const [files, setFiles] = useState([]);
    const [targetFormat, setTargetFormat] = useState('image/jpeg');
    const [isConverting, setIsConverting] = useState(false);
    const [convertedFiles, setConvertedFiles] = useState([]);

    const formats = [
        { value: 'image/jpeg', label: 'JPG', ext: 'jpg' },
        { value: 'image/png', label: 'PNG', ext: 'png' },
        { value: 'image/webp', label: 'WEBP', ext: 'webp' },
        { value: 'image/bmp', label: 'BMP', ext: 'bmp' }, // Browser support varies
        { value: 'image/gif', label: 'GIF', ext: 'gif' }  // static only
    ];

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            originalSize: (file.size / 1024).toFixed(2) + ' KB',
            name: file.name
        }));
        setFiles(prev => [...prev, ...newFiles]);
        setConvertedFiles([]); // Reset converted if new files added (optional strategy)
    };

    const convertImages = async () => {
        setIsConverting(true);
        setConvertedFiles([]);
        const results = [];

        for (const item of files) {
            try {
                const result = await processImage(item.file);
                results.push({
                    originalId: item.id,
                    url: result.url,
                    blob: result.blob,
                    name: item.name.substring(0, item.name.lastIndexOf('.')) + '.' + formats.find(f => f.value === targetFormat).ext,
                    size: (result.blob.size / 1024).toFixed(2) + ' KB'
                });
            } catch (error) {
                console.error("Conversion failed for", item.name, error);
            }
        }

        setConvertedFiles(results);
        setIsConverting(false);
    };

    const processImage = async (file) => {
        const ext = formats.find(f => f.value === targetFormat)?.ext;
        if (!ext) throw new Error('Unknown target format');
        const result = await apiPost('/api/v1/image/convert', makeUploadForm(file, { format: ext, quality: 90 }, 'image'));
        const blob = dataUrlToBlob(result.dataUrl);
        return { url: URL.createObjectURL(blob), blob };
    };

    const removeFile = (id) => {
        setFiles(files.filter(f => f.id !== id));
        setConvertedFiles(convertedFiles.filter(f => f.originalId !== id));
    };

    const downloadAll = () => {
        convertedFiles.forEach(file => {
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50 text-gray-900">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-sm font-medium text-blue-600 mb-4 animate-float">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Universal Image Converter
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Convert Images to Any Format
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Transform your images instantly. Support for JPG, PNG, WEBP, BMP, and more.
                        Batch processing handled on our secure servers.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        {/* Upload Area */}
                        {files.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors group">
                                <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Upload className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Click to Upload Images</h3>
                                    <p className="text-gray-500">or drag and drop here</p>
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* File List */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {files.map(file => (
                                        <div key={file.id} className="relative group bg-gray-50 rounded-xl p-3 border border-gray-100">
                                            <div className="aspect-square rounded-lg overflow-hidden bg-white mb-2 relative">
                                                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => removeFile(file.id)}
                                                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                            <div className="text-xs font-medium truncate">{file.name}</div>
                                            <div className="text-[10px] text-gray-500">{file.originalSize}</div>
                                        </div>
                                    ))}
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 min-h-[140px]">
                                        <input
                                            type="file"
                                            id="add-more"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="add-more" className="cursor-pointer flex flex-col items-center p-4">
                                            <div className="p-2 bg-gray-100 rounded-full mb-2">
                                                <Upload className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">Add More</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-6 rounded-2xl gap-4">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                            <Settings className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Convert to</label>
                                            <select
                                                value={targetFormat}
                                                onChange={(e) => setTargetFormat(e.target.value)}
                                                className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 outline-none"
                                            >
                                                {formats.map(format => (
                                                    <option key={format.value} value={format.value}>{format.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto">
                                        <PhysicsButton
                                            onClick={convertImages}
                                            disabled={isConverting}
                                            className="w-full md:w-auto"
                                        >
                                            {isConverting ? (
                                                <span className="flex items-center">
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                    Converting...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Convert All Images
                                                </span>
                                            )}
                                        </PhysicsButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Area */}
                {convertedFiles.length > 0 && (
                    <div className="mt-8 animate-slide-up-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Converted Files</h2>
                            <button
                                onClick={downloadAll}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                            >
                                <Download className="w-4 h-4 mr-1" /> Download All
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                            {convertedFiles.map((file, idx) => (
                                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                            <Check className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{file.name}</div>
                                            <div className="text-xs text-gray-500">{file.size}</div>
                                        </div>
                                    </div>
                                    <a
                                        href={file.url}
                                        download={file.name}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageConverter;

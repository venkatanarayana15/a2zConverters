import React, { useState } from 'react';
import { Upload, FileText, FileImage, Download, AlertCircle } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';

const JPGToPDF = () => {
    const [files, setFiles] = useState([]);
    const [isConverting, setIsConverting] = useState(false);
    const [convertedFile, setConvertedFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles.map(f => ({
            name: f.name,
            size: (f.size / 1024).toFixed(2) + ' KB',
            preview: URL.createObjectURL(f)
        }))]);
    };

    const convertToPDF = () => {
        if (files.length === 0) return;
        setIsConverting(true);

        // Simulate conversion
        setTimeout(() => {
            setIsConverting(false);
            setConvertedFile({
                name: 'merged_images.pdf',
                size: '1.2 MB', // Simulated size
                url: '#' // Would be a real blob URL in production
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50 text-gray-900">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200 text-sm font-medium text-red-600 mb-4">
                        <FileImage className="w-4 h-4 mr-2" />
                        JPG to PDF
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                        Convert Images to PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Turn your photos into a single, high-quality PDF document.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 min-h-[400px]">
                    {files.length === 0 ? (
                        <div className="h-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:bg-gray-50 transition-colors">
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="upload" />
                            <label htmlFor="upload" className="cursor-pointer text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Drop JPGs here</h3>
                                <p className="text-gray-500">or click to browse</p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {files.map((file, i) => (
                                    <div key={i} className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                                        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                                    <label htmlFor="add-more" className="w-full h-full flex items-center justify-center cursor-pointer">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </label>
                                    <input type="file" multiple accept="image/*" id="add-more" onChange={handleFileChange} className="hidden" />
                                </div>
                            </div>

                            <div className="flex justify-center pt-4">
                                {!convertedFile ? (
                                    <PhysicsButton onClick={convertToPDF} disabled={isConverting} className="w-full md:w-auto px-12">
                                        {isConverting ? 'Generating PDF...' : 'Convert to PDF'}
                                    </PhysicsButton>
                                ) : (
                                    <PhysicsButton className="bg-green-600 hover:bg-green-700 w-full md:w-auto px-12">
                                        <Download className="w-5 h-5 mr-2" /> Download PDF
                                    </PhysicsButton>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JPGToPDF;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileImage, Download } from 'lucide-react';
import PhysicsButton from '../../../components/PhysicsButton';
import BackLink from '../../../components/BackLink';
import InlineNotice from '../../../components/ui/InlineNotice';

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
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-[96rem] mx-auto">
                <div className="pl-10 sm:pl-12 lg:pl-14 mb-8">
                    <BackLink />
                </div>
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200 text-sm font-medium text-red-600 mb-4 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                        <FileImage className="w-4 h-4 mr-2" />
                        JPG to PDF
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-slate-100">
                        Convert Images to PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-slate-400">
                        Turn your photos into a single, high-quality PDF document.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 min-h-[400px] dark:bg-slate-900 dark:border-slate-800">
                    {files.length === 0 ? (
                        <div className="h-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:hover:bg-primary/5 dark:hover:border-primary/30">
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="upload" />
                            <label htmlFor="upload" className="cursor-pointer text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-slate-100">Drop JPGs here</h3>
                                <p className="text-gray-500 dark:text-slate-400">or click to browse</p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {files.map((file, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                        className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-sm dark:bg-slate-800"
                                    >
                                        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                                    </motion.div>
                                ))}
                                <div className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 cursor-pointer dark:border-slate-700 dark:hover:bg-primary/5 dark:hover:border-primary/30">
                                    <label htmlFor="add-more" className="w-full h-full flex items-center justify-center cursor-pointer">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </label>
                                    <input type="file" multiple accept="image/*" id="add-more" onChange={handleFileChange} className="hidden" />
                                </div>
                            </div>

                            {convertedFile && (
                                <InlineNotice variant="success" title="PDF ready">
                                    {convertedFile.name} · {convertedFile.size}
                                </InlineNotice>
                            )}

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

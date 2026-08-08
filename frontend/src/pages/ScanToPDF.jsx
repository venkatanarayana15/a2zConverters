import React, { useState } from 'react';
import { Upload, Download, RefreshCw, X, FileImage, ScanLine, CheckCircle } from 'lucide-react';
import { apiPost, downloadDataUrl } from '../lib/api';

const ScanToPDF = () => {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const handleAdd = (e) => {
        const selected = Array.from(e.target.files || []).filter((f) => /image\//i.test(f.type));
        setFiles(prev => [...prev, ...selected.map(f => ({
            file: f,
            id: Math.random().toString(36).substr(2, 9),
            preview: URL.createObjectURL(f),
        }))]);
        setResult(null);
    };

    const removeFile = (id) => setFiles(files.filter(f => f.id !== id));

    const handleCreate = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        try {
            const form = new FormData();
            files.forEach(f => form.append('images', f.file));
            const res = await apiPost('/api/v1/pdf/scan-to-pdf', form);
            setResult(res);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-background text-foreground">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-600 mb-4">
                        <ScanLine className="w-4 h-4 mr-2" />
                        PDF Tools
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                        Scan to PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Turn photos of your documents into a single clean PDF.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {files.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:bg-gray-50 transition-colors">
                            <input type="file" multiple accept="image/*" onChange={handleAdd} className="hidden" id="scan-upload" />
                            <label htmlFor="scan-upload" className="cursor-pointer text-center">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Drop scan images here</h3>
                                <p className="text-gray-500">JPG, PNG or WEBP scans — order matters</p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {files.map((f, idx) => (
                                    <div key={f.id} className="relative group">
                                        <img src={f.preview} alt={`Scan ${idx + 1}`} className="aspect-[3/4] w-full object-cover rounded-xl border border-gray-200 shadow-sm" />
                                        <span className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center font-semibold">{idx + 1}</span>
                                        <button
                                            onClick={() => removeFile(f.id)}
                                            className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                <label htmlFor="scan-add" className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors">
                                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500 font-medium">Add More</span>
                                    <input type="file" multiple accept="image/*" onChange={handleAdd} className="hidden" id="scan-add" />
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{files.length} scan{files.length === 1 ? '' : 's'} ready</span>
                                <button
                                    onClick={handleCreate}
                                    disabled={isProcessing}
                                    className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${isProcessing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02]'}`}
                                >
                                    {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /> Creating PDF...</> : <><FileImage className="w-5 h-5" /> Create PDF</>}
                                </button>
                            </div>

                            {result && (
                                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-between animate-slide-up">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                        <div>
                                            <div className="font-semibold text-gray-900">{result.fileName}</div>
                                            <div className="text-xs text-gray-500">{(result.size / 1024).toFixed(2)} KB</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => downloadDataUrl(result.dataUrl, result.fileName)}
                                        className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" /> Download
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

export default ScanToPDF;

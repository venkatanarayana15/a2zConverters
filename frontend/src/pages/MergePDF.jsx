import React, { useState } from 'react';
import { Upload, FileText, Download, X, Layers, RefreshCw, CheckCircle } from 'lucide-react';
import { apiPost, downloadDataUrl } from '../lib/api';

const MergePDF = () => {
    const [files, setFiles] = useState([]);
    const [isMerging, setIsMerging] = useState(false);
    const [result, setResult] = useState(null);

    const handleAdd = (e) => {
        const selected = Array.from(e.target.files || []).filter((f) => /\.pdf$/i.test(f.name));
        setFiles(prev => [...prev, ...selected.map(f => ({
            file: f,
            id: Math.random().toString(36).substr(2, 9),
            size: (f.size / 1024).toFixed(2),
        }))]);
        setResult(null);
    };

    const removeFile = (id) => setFiles(files.filter(f => f.id !== id));

    const handleMerge = async () => {
        if (files.length < 2) return;
        setIsMerging(true);
        try {
            const form = new FormData();
            files.forEach(f => form.append('files', f.file));
            const res = await apiPost('/api/v1/pdf/merge', form);
            setResult(res);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsMerging(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-background text-foreground">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-sm font-medium text-indigo-600 mb-4">
                        <Layers className="w-4 h-4 mr-2" />
                        PDF Tools
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Merge PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Combine multiple PDF files into a single document in seconds.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {files.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:bg-gray-50 transition-colors">
                            <input type="file" multiple accept=".pdf" onChange={handleAdd} className="hidden" id="merge-upload" />
                            <label htmlFor="merge-upload" className="cursor-pointer text-center">
                                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Drop PDFs here</h3>
                                <p className="text-gray-500">Select at least two PDF files to merge</p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                {files.map((f, idx) => (
                                    <div key={f.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                                            <FileText className="w-5 h-5 text-red-500" />
                                            <span className="text-sm font-medium text-gray-800 truncate max-w-xs">{f.file.name}</span>
                                            <span className="text-xs text-gray-400">{f.size} KB</span>
                                        </div>
                                        <button onClick={() => removeFile(f.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="file" multiple accept=".pdf" onChange={handleAdd} className="hidden" id="merge-add" />
                                <label htmlFor="merge-add" className="cursor-pointer px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                                    Add More PDFs
                                </label>
                                <div className="flex-1" />
                                <button
                                    onClick={handleMerge}
                                    disabled={isMerging || files.length < 2}
                                    className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${isMerging || files.length < 2 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02]'}`}
                                >
                                    {isMerging ? <><RefreshCw className="w-5 h-5 animate-spin" /> Merging...</> : <><Layers className="w-5 h-5" /> Merge PDFs</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="mt-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-between animate-slide-up">
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
            </div>
        </div>
    );
};

export default MergePDF;

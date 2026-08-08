import React, { useState } from 'react';
import { Upload, FileText, Download, Eraser, RefreshCw, CheckCircle } from 'lucide-react';
import { apiPost, downloadDataUrl } from '../lib/api';

const RemovePages = () => {
    const [file, setFile] = useState(null);
    const [pageCount, setPageCount] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const handleFile = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile || !/\.pdf$/i.test(selectedFile.name)) return;
        setFile(selectedFile);
        setResult(null);
        setSelected(new Set());
        try {
            const form = new FormData();
            form.append('file', selectedFile);
            const info = await apiPost('/api/v1/pdf/info', form);
            setPageCount(info.pageCount);
        } catch (error) {
            alert(error.message);
        }
    };

    const toggle = (n) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(n)) next.delete(n);
            else next.add(n);
            return next;
        });
    };

    const handleRemove = async () => {
        if (!file || selected.size === 0) return;
        setIsProcessing(true);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('pages', [...selected].sort((a, b) => a - b).join(','));
            const res = await apiPost('/api/v1/pdf/remove-pages', form);
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
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200 text-sm font-medium text-red-600 mb-4">
                        <Eraser className="w-4 h-4 mr-2" />
                        PDF Tools
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500">
                        Remove Pages
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Select the pages you want to delete from your PDF.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {!file ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:bg-gray-50 transition-colors">
                            <input type="file" accept=".pdf" onChange={handleFile} className="hidden" id="remove-upload" />
                            <label htmlFor="remove-upload" className="cursor-pointer text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload a PDF</h3>
                                <p className="text-gray-500">Choose the document you want to edit</p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-red-500" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">{file.name}</div>
                                        <div className="text-xs text-gray-500">{pageCount ?? '...'} pages</div>
                                    </div>
                                </div>
                                <button onClick={() => { setFile(null); setPageCount(null); setSelected(new Set()); setResult(null); }} className="text-xs text-red-500 hover:text-red-700 font-medium">
                                    Remove
                                </button>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-gray-900">Tap pages to remove</h3>
                                    <span className="text-sm text-red-600 font-semibold">{selected.size} selected</span>
                                </div>
                                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                    {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
                                        <button
                                            key={n}
                                            onClick={() => toggle(n)}
                                            className={`aspect-square rounded-xl border text-sm font-semibold transition-all ${selected.has(n) ? 'bg-red-500 border-red-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'}`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleRemove}
                                disabled={isProcessing || selected.size === 0}
                                className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${isProcessing || selected.size === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-red-200 hover:shadow-red-300 hover:scale-[1.02]'}`}
                            >
                                {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /> Removing...</> : <><Eraser className="w-5 h-5" /> Remove {selected.size} Page{selected.size === 1 ? '' : 's'}</>}
                            </button>

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

export default RemovePages;

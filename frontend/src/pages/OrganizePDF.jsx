import React, { useState } from 'react';
import { Upload, FileText, Download, ArrowUp, ArrowDown, RefreshCw, Shuffle, RotateCcw, CheckCircle } from 'lucide-react';
import { apiPost, downloadDataUrl } from '../lib/api';

const OrganizePDF = () => {
    const [file, setFile] = useState(null);
    const [pageCount, setPageCount] = useState(null);
    const [order, setOrder] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const handleFile = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile || !/\.pdf$/i.test(selectedFile.name)) return;
        setFile(selectedFile);
        setResult(null);
        try {
            const form = new FormData();
            form.append('file', selectedFile);
            const info = await apiPost('/api/v1/pdf/info', form);
            setPageCount(info.pageCount);
            setOrder(Array.from({ length: info.pageCount }, (_, i) => i + 1));
        } catch (error) {
            alert(error.message);
        }
    };

    const move = (idx, dir) => {
        setOrder(prev => {
            const next = [...prev];
            const target = idx + dir;
            if (target < 0 || target >= next.length) return prev;
            [next[idx], next[target]] = [next[target], next[idx]];
            return next;
        });
    };

    const handleApply = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('order', order.join(','));
            const res = await apiPost('/api/v1/pdf/organize', form);
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
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-sm font-medium text-violet-600 mb-4">
                        <Shuffle className="w-4 h-4 mr-2" />
                        PDF Tools
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500">
                        Organize PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Reorder pages in your document the way you want them.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {!file ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:bg-gray-50 transition-colors">
                            <input type="file" accept=".pdf" onChange={handleFile} className="hidden" id="organize-upload" />
                            <label htmlFor="organize-upload" className="cursor-pointer text-center">
                                <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6 text-violet-500">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload a PDF</h3>
                                <p className="text-gray-500">Choose the document to reorganize</p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-violet-500" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">{file.name}</div>
                                        <div className="text-xs text-gray-500">{pageCount ?? '...'} pages</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setOrder(prev => [...prev].reverse())} className="px-3 py-1.5 text-xs font-semibold bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors flex items-center gap-1">
                                        <Shuffle className="w-3.5 h-3.5" /> Reverse
                                    </button>
                                    <button onClick={() => setOrder(Array.from({ length: pageCount }, (_, i) => i + 1))} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.map((pageNum, idx) => (
                                    <div key={pageNum} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="w-9 h-9 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                                            {pageNum}
                                        </span>
                                        <div className="flex-1 text-sm font-medium text-gray-700">
                                            Page {idx + 1} <span className="text-gray-400">→ position</span> <span className="font-bold text-gray-900">{pageNum}</span>
                                        </div>
                                        <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => move(idx, 1)} disabled={idx === order.length - 1} className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleApply}
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.02]'}`}
                            >
                                {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /> Applying order...</> : <><Shuffle className="w-5 h-5" /> Apply New Order</>}
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

export default OrganizePDF;

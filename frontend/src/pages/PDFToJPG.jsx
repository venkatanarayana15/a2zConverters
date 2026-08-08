import React, { useState } from 'react';
import { Upload, FileText, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { apiPost, downloadDataUrl } from '../lib/api';

const PDFToJPG = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [results, setResults] = useState([]);

    const handleFile = (e) => {
        const selected = e.target.files[0];
        if (!selected || !/\.pdf$/i.test(selected.name)) return;
        setFile(selected);
        setResults([]);
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsConverting(true);
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await apiPost('/api/v1/pdf/pdf-to-jpg', form);
            setResults(res.files || []);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsConverting(false);
        }
    };

    const downloadAll = () => results.forEach((r) => downloadDataUrl(r.dataUrl, r.fileName));

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50 text-gray-900">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-sm font-medium text-amber-600 mb-4">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        PDF to JPG
                    </div>
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-500">
                        Convert PDF to JPG
                    </h1>
                    <p className="text-gray-600">
                        Turn every page of your PDF into a high-quality JPG image.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                    {!file ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:bg-gray-50 transition-colors">
                            <input type="file" accept=".pdf" onChange={handleFile} className="hidden" id="pdf-jpg-upload" />
                            <label htmlFor="pdf-jpg-upload" className="cursor-pointer text-center">
                                <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload a PDF</h3>
                                <p className="text-sm text-gray-500">or drop your PDF here</p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-amber-500" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">{file.name}</div>
                                        <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
                                    </div>
                                </div>
                                <button onClick={() => { setFile(null); setResults([]); }} className="text-xs text-red-500 hover:text-red-700 font-medium">
                                    Remove
                                </button>
                            </div>

                            {results.length === 0 ? (
                                <button
                                    onClick={handleConvert}
                                    disabled={isConverting}
                                    className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${isConverting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-amber-200 hover:shadow-amber-300 hover:scale-[1.02]'}`}
                                >
                                    {isConverting ? <><RefreshCw className="w-5 h-5 animate-spin" /> Converting...</> : <><ImageIcon className="w-5 h-5" /> Convert to JPG</>}
                                </button>
                            ) : (
                                <div className="space-y-4 animate-slide-up">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900">{results.length} page{results.length > 1 ? 's' : ''} converted</h3>
                                        <button onClick={downloadAll} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                                            <Download className="w-4 h-4" /> Download All
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {results.map((r, idx) => (
                                            <div key={idx} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                                <img src={r.dataUrl} alt={r.fileName} className="w-full h-40 object-contain" />
                                                <div className="p-2 flex items-center justify-between gap-2 bg-white">
                                                    <span className="text-xs font-medium text-gray-700 truncate">Page {idx + 1}</span>
                                                    <button
                                                        onClick={() => downloadDataUrl(r.dataUrl, r.fileName)}
                                                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => { setFile(null); setResults([]); }} className="block mx-auto text-sm text-gray-500 hover:text-gray-900 underline">
                                        Convert another PDF
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

export default PDFToJPG;

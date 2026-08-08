import React, { useState } from 'react';
import { Upload, FileText, Download, Scissors, RefreshCw, FilePlus2, Hash } from 'lucide-react';
import { apiPost, downloadDataUrl } from '../lib/api';

const SplitPDF = () => {
    const [file, setFile] = useState(null);
    const [pageCount, setPageCount] = useState(null);
    const [mode, setMode] = useState('all');
    const [ranges, setRanges] = useState('');
    const [isSplitting, setIsSplitting] = useState(false);
    const [results, setResults] = useState([]);

    const handleFile = async (e) => {
        const selected = e.target.files[0];
        if (!selected || !/\.pdf$/i.test(selected.name)) return;
        setFile(selected);
        setResults([]);
        try {
            const form = new FormData();
            form.append('file', selected);
            const info = await apiPost('/api/v1/pdf/info', form);
            setPageCount(info.pageCount);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSplit = async () => {
        if (!file) return;
        setIsSplitting(true);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('mode', mode);
            if (mode === 'ranges') form.append('ranges', ranges);
            const res = await apiPost('/api/v1/pdf/split', form);
            setResults(res.files || []);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSplitting(false);
        }
    };

    const downloadAll = () => results.forEach(r => downloadDataUrl(r.dataUrl, r.fileName));

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-background text-foreground">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-sm font-medium text-rose-600 mb-4">
                        <Scissors className="w-4 h-4 mr-2" />
                        PDF Tools
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-500">
                        Split PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Separate one PDF into individual pages or custom page ranges.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {!file ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:bg-gray-50 transition-colors">
                            <input type="file" accept=".pdf" onChange={handleFile} className="hidden" id="split-upload" />
                            <label htmlFor="split-upload" className="cursor-pointer text-center">
                                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload a PDF</h3>
                                <p className="text-gray-500">Choose the file you want to split</p>
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
                                <button onClick={() => { setFile(null); setPageCount(null); setResults([]); }} className="text-xs text-red-500 hover:text-red-700 font-medium">
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                                <button
                                    onClick={() => setMode('all')}
                                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'all' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FilePlus2 className="w-4 h-4 inline mr-1" /> Every Page
                                </button>
                                <button
                                    onClick={() => setMode('ranges')}
                                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'ranges' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Hash className="w-4 h-4 inline mr-1" /> Custom Ranges
                                </button>
                            </div>

                            {mode === 'ranges' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Page ranges</label>
                                    <input
                                        type="text"
                                        value={ranges}
                                        onChange={(e) => setRanges(e.target.value)}
                                        placeholder={`e.g. 1-2, 4, 6-8  (document has ${pageCount} pages)`}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-500 transition-all"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleSplit}
                                disabled={isSplitting || (mode === 'ranges' && !ranges.trim())}
                                className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${isSplitting || (mode === 'ranges' && !ranges.trim()) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-rose-200 hover:shadow-rose-300 hover:scale-[1.02]'}`}
                            >
                                {isSplitting ? <><RefreshCw className="w-5 h-5 animate-spin" /> Splitting...</> : <><Scissors className="w-5 h-5" /> Split PDF</>}
                            </button>

                            {results.length > 0 && (
                                <div className="space-y-3 animate-slide-up">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900">Split into {results.length} file{results.length > 1 ? 's' : ''}</h3>
                                        <button onClick={downloadAll} className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center gap-1">
                                            <Download className="w-4 h-4" /> Download All
                                        </button>
                                    </div>
                                    {results.map((r, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-red-400" />
                                                <span className="text-sm font-medium text-gray-800">{r.fileName}</span>
                                                <span className="text-xs text-gray-400">{(r.size / 1024).toFixed(2)} KB</span>
                                            </div>
                                            <button
                                                onClick={() => downloadDataUrl(r.dataUrl, r.fileName)}
                                                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SplitPDF;

import React, { useState } from 'react';
import { Upload, Type, Image as ImageIcon, Download, Settings, Grid as GridIcon, CheckCircle } from 'lucide-react';
import { apiPost, downloadDataUrl } from '../lib/api';

const WatermarkPDF = () => {
    const [file, setFile] = useState(null);
    const [watermarkType, setWatermarkType] = useState('text');
    const [text, setText] = useState('CONFIDENTIAL');
    const [opacity, setOpacity] = useState(50);
    const [position, setPosition] = useState('center');
    const [wmImage, setWmImage] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [resultPdf, setResultPdf] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResultPdf(null);
        }
    };

    const handleAddWatermark = async () => {
        if (!file) return;
        setIsAdding(true);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('type', watermarkType);
            form.append('text', text);
            form.append('opacity', opacity);
            form.append('position', position);
            if (watermarkType === 'image' && wmImage) form.append('image', wmImage);
            const result = await apiPost('/api/v1/pdf/watermark', form);
            setResultPdf({ url: result.dataUrl, name: result.fileName });
        } catch (error) {
            alert(error.message);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-background text-foreground">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-sm font-medium text-cyan-600 mb-4">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Brand & Protect
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500">
                        Watermark PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Stamp an image or text over your PDF in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Preview Section */}
                    <div className="lg:col-span-2 glass-card p-4 rounded-2xl min-h-[500px] flex items-center justify-center bg-gray-100/50 relative overflow-hidden">
                        {!file ? (
                            <div className="text-center text-gray-400">
                                <Upload className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Upload a PDF to preview watermark</p>
                            </div>
                        ) : (
                            <div className="relative w-3/4 aspect-[1/1.414] bg-white shadow-2xl rounded-sm flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 p-8 text-xs text-gray-300 pointer-events-none select-none">
                                    {[...Array(20)].map((_, i) => (
                                        <p key={i}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    ))}
                                </div>

                                {/* Watermark Result Preview */}
                                <div
                                    className={`absolute pointer-events-none transform transition-all duration-300 ${position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' :
                                            position === 'top-left' ? 'top-10 left-10' :
                                                position === 'top-right' ? 'top-10 right-10' :
                                                    position === 'bottom-left' ? 'bottom-10 left-10' :
                                                        'bottom-10 right-10'
                                        }`}
                                    style={{
                                        opacity: opacity / 100,
                                        transform: `${position === 'center' ? 'translate(-50%, -50%)' : ''} rotate(-45deg)`
                                    }}
                                >
                                    {watermarkType === 'text' ? (
                                        <span className="text-6xl font-black text-gray-400 whitespace-nowrap border-4 border-gray-400 p-4 rounded-xl">
                                            {text}
                                        </span>
                                    ) : (
                                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-400">
                                            <span className="text-gray-500 font-bold">LOGO</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settings / Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-3xl -z-10" />

                            <h2 className="text-lg font-bold mb-6 text-gray-900 flex items-center">
                                <Settings className="w-5 h-5 mr-2 text-teal-500" />
                                Configuration
                            </h2>

                            {!file && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                        <span className="text-sm font-medium text-teal-600">Choose PDF File</span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Watermark Type</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                                    <button
                                        onClick={() => setWatermarkType('text')}
                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${watermarkType === 'text' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <Type className="w-4 h-4 inline mr-1" /> Text
                                    </button>
                                    <button
                                        onClick={() => setWatermarkType('image')}
                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${watermarkType === 'image' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <ImageIcon className="w-4 h-4 inline mr-1" /> Image
                                    </button>
                                </div>
                            </div>

                            {watermarkType === 'text' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                                    />
                                </div>
                            )}

                            {watermarkType === 'image' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Image</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                if (e.target.files[0]) setWmImage(e.target.files[0]);
                                            }}
                                        />
                                        <span className="text-sm font-medium text-teal-600">
                                            {wmImage ? wmImage.name : 'Choose watermark image'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Transparency</label>
                                    <span className="text-sm text-teal-600 font-bold">{opacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={opacity}
                                    onChange={(e) => setOpacity(e.target.value)}
                                    className="w-full accent-teal-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'].map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setPosition(pos)}
                                            className={`p-2 rounded-lg border text-xs font-medium transition-all ${position === pos ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
                                        >
                                            {pos.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                disabled={!file || isAdding}
                                onClick={handleAddWatermark}
                                className={`w-full py-3 rounded-xl font-bold font-lg shadow-lg transition-all flex items-center justify-center ${file && !isAdding
                                    ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-teal-200 hover:shadow-teal-300 hover:scale-[1.02]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                    }`}
                            >
                                {isAdding ? (
                                    <span className="flex items-center">
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2"></span>
                                        Adding Watermark...
                                    </span>
                                ) : resultPdf ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Watermark Added
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5 mr-2" />
                                        Add Watermark
                                    </>
                                )}
                            </button>

                            {resultPdf && (
                                <button
                                    onClick={() => downloadDataUrl(resultPdf.url, resultPdf.name)}
                                    className="w-full mt-3 py-3 rounded-xl font-bold bg-gray-900 text-white shadow-lg hover:bg-black transition-all flex items-center justify-center"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download PDF
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatermarkPDF;

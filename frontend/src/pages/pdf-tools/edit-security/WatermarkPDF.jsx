import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Type, Image as ImageIcon, Wand2, Settings, Grid as GridIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import BackLink from '../../../components/BackLink';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const positionCoords = {
    'center': { xRatio: 0.5, yRatio: 0.5 },
    'top-left': { xRatio: 0.1, yRatio: 0.9 },
    'top-right': { xRatio: 0.9, yRatio: 0.9 },
    'bottom-left': { xRatio: 0.1, yRatio: 0.1 },
    'bottom-right': { xRatio: 0.9, yRatio: 0.1 },
};

const WatermarkPDF = () => {
    const [file, setFile] = useState(null);
    const [watermarkType, setWatermarkType] = useState('text');
    const [text, setText] = useState('CONFIDENTIAL');
    const [opacity, setOpacity] = useState(50);
    const [position, setPosition] = useState('center');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
            setError(null);
        }
    };

    const handleAddWatermark = async () => {
        if (!file) return;
        if (watermarkType === 'image') {
            setError('Image watermarks are not supported yet — switch to Text to continue.');
            return;
        }
        if (!text.trim()) {
            setError('Enter some watermark text first.');
            return;
        }
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const doc = await PDFDocument.load(await file.arrayBuffer());
            const font = await doc.embedFont(StandardFonts.Helvetica);
            const { xRatio, yRatio } = positionCoords[position] || positionCoords.center;
            const size = 60;

            for (const page of doc.getPages()) {
                const { width, height } = page.getSize();
                const textWidth = font.widthOfTextAtSize(text, size);
                const textHeight = font.heightAtSize(size);
                const x = xRatio * width - textWidth / 2;
                const y = yRatio * height - textHeight / 2;
                page.drawText(text, {
                    x,
                    y,
                    size,
                    font,
                    color: rgb(0.2, 0.2, 0.2),
                    opacity: opacity / 100,
                    rotate: degrees(45),
                });
            }

            const bytes = await doc.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${stripExtension(file.name)}_watermarked.pdf`);
            setResult({ pages: doc.getPageCount(), size: bytes.length });
        } catch {
            setError('Could not watermark this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-[96rem] mx-auto">
                <div className="mb-6">
                    <BackLink />
                </div>
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-sm font-medium text-cyan-600 mb-4 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Brand & Protect
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        Watermark PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
                        Stamp an image or text over your PDF in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Preview Section */}
                    <div className="lg:col-span-2 glass-card p-4 rounded-2xl min-h-[500px] flex items-center justify-center bg-gray-100/50 relative overflow-hidden dark:bg-gray-800/50">
                        <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-center text-gray-400 dark:text-gray-500"
                            >
                                <Upload className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Upload a PDF to preview watermark</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="relative w-3/4 aspect-[1/1.414] bg-white shadow-2xl rounded-sm flex items-center justify-center overflow-hidden"
                            >
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
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                    {/* Settings / Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-3xl -z-10" />

                            <h2 className="text-lg font-bold mb-6 text-gray-900 flex items-center dark:text-gray-100">
                                <Settings className="w-5 h-5 mr-2 text-teal-500" />
                                Configuration
                            </h2>

                            {!file && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Upload Document</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer relative dark:border-gray-600 dark:hover:bg-teal-900/10">
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
                                <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">Watermark Type</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-gray-800">
                                    <button
                                        onClick={() => setWatermarkType('text')}
                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${watermarkType === 'text' ? 'bg-white shadow-sm text-teal-600 dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                                    >
                                        <Type className="w-4 h-4 inline mr-1" /> Text
                                    </button>
                                    <button
                                        onClick={() => setWatermarkType('image')}
                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${watermarkType === 'image' ? 'bg-white shadow-sm text-teal-600 dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                                    >
                                        <ImageIcon className="w-4 h-4 inline mr-1" /> Image
                                    </button>
                                </div>
                            </div>

                            {watermarkType === 'text' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Watermark Text</label>
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                                    />
                                </div>
                            )}

                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transparency</label>
                                    <span className="text-sm text-teal-600 font-bold">{opacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={opacity}
                                    onChange={(e) => setOpacity(e.target.value)}
                                    className="w-full accent-teal-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Position</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'].map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setPosition(pos)}
                                            className={`p-2 rounded-lg border text-xs font-medium transition-all ${position === pos ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' : 'border-gray-200 hover:border-gray-300 text-gray-500 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-400'}`}
                                        >
                                            {pos.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                disabled={!file || isProcessing}
                                onClick={handleAddWatermark}
                                className={`w-full py-3 rounded-xl font-bold font-lg shadow-lg transition-all flex items-center justify-center ${file && !isProcessing
                                    ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-teal-200 hover:shadow-teal-300 hover:scale-[1.02]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                    }`}
                            >
                                <Wand2 className="w-5 h-5 mr-2" />
                                {isProcessing ? 'Adding Watermark...' : 'Add Watermark'}
                            </button>

                            {error && (
                                <p className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    {error}
                                </p>
                            )}

                            {result && (
                                <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                                    <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Watermark applied
                                    </p>
                                    <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatermarkPDF;

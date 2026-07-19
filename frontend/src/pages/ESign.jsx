import React, { useState, useRef } from 'react';
import { Upload, PenTool, Download, Eraser, Move } from 'lucide-react';

const ESign = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [signature, setSignature] = useState(null);
    const [isSigning, setIsSigning] = useState(false);
    const canvasRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // In a real app, we'd render the PDF pages here.
            // For this UI demo, we'll just show a placeholder or the file name.
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const startSigning = () => {
        setIsSigning(true);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setSignature(null);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            setSignature(canvas.toDataURL());
            setIsSigning(false);
        }
    };

    // Simple drawing logic for the canvas
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);

        canvas.onmousemove = (ev) => {
            ctx.lineTo(ev.clientX - rect.left, ev.clientY - rect.top);
            ctx.stroke();
        };

        canvas.onmouseup = () => {
            canvas.onmousemove = null;
            canvas.onmouseup = null;
        };
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-background text-foreground">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-sm font-medium text-purple-600 mb-4">
                        <PenTool className="w-4 h-4 mr-2" />
                        Digital Signature
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
                        eSign PDF
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Sign documents yourself or request signatures from others securely.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Tools */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl -z-10" />
                            <h2 className="text-lg font-bold mb-4 text-gray-900">Document Upload</h2>

                            {!file ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                    <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                    <span className="text-sm font-medium text-gray-600">Drop PDF here</span>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
                                        <FileIcon className="w-6 h-6 text-red-500 mr-2" />
                                        <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                                    >
                                        Remove File
                                    </button>
                                </div>
                            )}
                        </div>

                        {file && (
                            <div className="glass-card p-6 rounded-2xl relative overflow-hidden animate-slide-up">
                                <h2 className="text-lg font-bold mb-4 text-gray-900">Your Signature</h2>
                                <button
                                    onClick={startSigning}
                                    className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex items-center justify-center"
                                >
                                    <PenTool className="w-4 h-4 mr-2" />
                                    Create Signature
                                </button>

                                {signature && (
                                    <div className="mt-4 p-2 bg-white border border-gray-200 rounded-lg">
                                        <img src={signature} alt="Signature" className="h-12 mx-auto" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main Preview Area */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-4 rounded-2xl min-h-[600px] flex items-center justify-center bg-gray-100/50 border-gray-200 relative">
                            {!file ? (
                                <div className="text-center text-gray-400">
                                    <Upload className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Upload a PDF to start signing</p>
                                </div>
                            ) : (
                                <div className="relative w-full h-full bg-white shadow-lg rounded-lg min-h-[550px] flex items-center justify-center">
                                    <p className="text-gray-400">PDF Preview Area (Page 1)</p>

                                    {/* Draggable Signature Placeholder */}
                                    {signature && (
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 border-2 border-dashed border-purple-500 bg-white/50 cursor-move group">
                                            <div className="absolute -top-3 -right-3 hidden group-hover:flex">
                                                <button onClick={() => setSignature(null)} className="p-1 bg-red-500 text-white rounded-full">
                                                    <Eraser className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <img src={signature} alt="Placed Signature" className="h-16" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Signature Modal */}
                            {isSigning && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl z-20 flex items-center justify-center">
                                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md m-4">
                                        <h3 className="text-xl font-bold mb-4">Draw Your Signature</h3>
                                        <div className="border border-gray-200 rounded-xl bg-gray-50 mb-4 h-40 relative touch-none">
                                            <canvas
                                                ref={canvasRef}
                                                width={400}
                                                height={160}
                                                className="w-full h-full cursor-crosshair"
                                                onMouseDown={startDrawing}
                                            />
                                            <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">Sign Here</div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => { setIsSigning(false); clearSignature(); }}
                                                className="flex-1 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={clearSignature}
                                                className="flex-1 py-2 px-4 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                                            >
                                                Clear
                                            </button>
                                            <button
                                                onClick={saveSignature}
                                                className="flex-1 py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                            >
                                                Adopt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {file && (
                            <div className="mt-6 flex justify-end">
                                <button className="py-3 px-8 rounded-xl font-bold font-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:scale-[1.02] transition-all flex items-center">
                                    <Download className="w-5 h-5 mr-2" />
                                    Download Signed PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Start Helper Component
const FileIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
// End Helper Component

export default ESign;

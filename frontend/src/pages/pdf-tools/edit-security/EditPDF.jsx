import React, { useState } from 'react';
import { PenLine, Download, Type } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const positions = ['top', 'center', 'bottom'];
const positionLabels = { top: 'Top', center: 'Center', bottom: 'Bottom' };

const hexToRgb = (hex) => {
    const m = hex.replace('#', '');
    return { r: parseInt(m.slice(0, 2), 16) / 255, g: parseInt(m.slice(2, 4), 16) / 255, b: parseInt(m.slice(4, 6), 16) / 255 };
};

const EditPDF = () => {
    const [file, setFile] = useState([]);
    const [text, setText] = useState('');
    const [position, setPosition] = useState('bottom');
    const [fontSize, setFontSize] = useState(24);
    const [color, setColor] = useState('#ef4444');
    const [opacity, setOpacity] = useState(80);
    const [pageScope, setPageScope] = useState('all');
    const [pageNumber, setPageNumber] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleEdit = async () => {
        if (!file[0]) return;
        if (!text.trim()) {
            setError('Enter some text to add to your PDF.');
            return;
        }
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const doc = await PDFDocument.load(await file[0].arrayBuffer());
            const font = await doc.embedFont(StandardFonts.Helvetica);
            const fillColor = hexToRgb(color);
            const textWidth = font.widthOfTextAtSize(text, fontSize);
            const textHeight = font.heightAtSize(fontSize);

            const targets = pageScope === 'all'
                ? doc.getPageIndices()
                : [Math.min(Math.max(pageNumber - 1, 0), doc.getPageCount() - 1)];

            for (const index of targets) {
                const page = doc.getPage(index);
                const width = page.getWidth();
                const height = page.getHeight();
                const margin = 48;

                let x;
                let y;
                if (position === 'top') {
                    x = (width - textWidth) / 2;
                    y = height - margin - textHeight;
                } else if (position === 'bottom') {
                    x = (width - textWidth) / 2;
                    y = margin;
                } else {
                    x = (width - textWidth) / 2;
                    y = (height - textHeight) / 2;
                }

                page.drawText(text, {
                    x: Math.max(x, 8),
                    y: Math.max(y, 8),
                    size: fontSize,
                    font,
                    color: rgb(fillColor.r, fillColor.g, fillColor.b),
                    opacity: opacity / 100,
                });
            }

            const bytes = await doc.save();
            downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${stripExtension(file[0].name)}_edited.pdf`);
            setResult({ pages: doc.getPageCount(), size: bytes.length });
        } catch {
            setError('Could not edit this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={PenLine} badge="Edit & Security" title="Edit PDF" subtitle="Stamp custom text, notes or watermarks onto any page of your PDF." accent="cyan">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {file[0] && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                <Type className="w-4 h-4 inline mr-1 text-cyan-600" /> Text to add
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={2}
                                placeholder="e.g. CONFIDENTIAL, Approved by Finance, Draft v2"
                                className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Position</label>
                            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-gray-800">
                                {positions.map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setPosition(pos)}
                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${position === pos ? 'bg-white shadow-sm text-cyan-600 dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                    >
                                        {positionLabels[pos]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Font size · {fontSize}px</label>
                                <input
                                    type="range"
                                    min={10}
                                    max={80}
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full accent-cyan-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Color</label>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-16 h-9 rounded-lg border border-gray-200 bg-white p-1 cursor-pointer dark:border-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Opacity · {opacity}%</label>
                                <input
                                    type="range"
                                    min={10}
                                    max={100}
                                    value={opacity}
                                    onChange={(e) => setOpacity(Number(e.target.value))}
                                    className="w-full accent-cyan-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Apply to</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer dark:text-gray-300">
                                    <input type="radio" name="scope" checked={pageScope === 'all'} onChange={() => setPageScope('all')} className="accent-cyan-600" />
                                    All pages
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer dark:text-gray-300">
                                    <input type="radio" name="scope" checked={pageScope === 'page'} onChange={() => setPageScope('page')} className="accent-cyan-600" />
                                    Page
                                </label>
                                {pageScope === 'page' && (
                                    <input
                                        type="number"
                                        min={1}
                                        value={pageNumber}
                                        onChange={(e) => setPageNumber(Number(e.target.value))}
                                        className="w-20 bg-white/50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 outline-none dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> PDF updated</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleEdit}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Updating PDF..."
                    accent="from-cyan-500 to-teal-600 shadow-cyan-200 hover:shadow-cyan-300"
                >
                    <PenLine className="w-5 h-5 mr-2" /> Add Text to PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default EditPDF;

import React, { useState, useRef } from 'react';
import { Globe, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { downloadBlob, formatBytes } from '../../../lib/pdfUtils';
import ToolLayout from '../../../components/ui/ToolLayout';
import ProcessButton from '../../../components/ui/ProcessButton';

const sampleHtml = `<h1 style="text-align:center">Hello!</h1>
<p>Type or paste your HTML content on the left, then convert it to a clean PDF.</p>
<ul><li>Headings and paragraphs</li><li>Lists and tables</li><li>Images and colors</li></ul>
<p style="color:#2563eb">Everything renders exactly like a web page.</p>`;

const HTMLToPDF = () => {
    const [html, setHtml] = useState(sampleHtml);
    const [orientation, setOrientation] = useState('portrait');
    const [format, setFormat] = useState('a4');
    const renderRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleConvert = async () => {
        if (!html.trim()) {
            setError('Add some HTML content to convert.');
            return;
        }
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const el = renderRef.current;
            const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({ orientation, unit: 'pt', format });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const ratio = pdfWidth / canvas.width;
            const scaledHeight = canvas.height * ratio;

            let heightLeft = scaledHeight;
            let position = 0;
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, scaledHeight);
            heightLeft -= pdfHeight;
            while (heightLeft > 0) {
                position = heightLeft - scaledHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, scaledHeight);
                heightLeft -= pdfHeight;
            }

            const blob = pdf.output('blob');
            downloadBlob(blob, 'webpage.pdf');
            setResult({ size: blob.size, pages: pdf.getNumberOfPages() });
        } catch {
            setError('Could not render this content to PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={Globe} badge="Convert to pdf" title="HTML to PDF" subtitle="Paste any HTML content and download it as a clean PDF." accent="red">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">HTML content</label>
                        <textarea
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            rows={14}
                            spellCheck={false}
                            className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Live preview</label>
                        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white dark:border-slate-700">
                            <div className="px-4 py-3 text-sm dark:bg-slate-100" ref={renderRef} dangerouslySetInnerHTML={{ __html: html }} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Page size</label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-slate-800">
                            {['a4', 'letter'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={`py-2 rounded-lg text-sm font-medium capitalize transition-all ${format === f ? 'bg-white shadow-sm text-red-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Orientation</label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl dark:bg-slate-800">
                            {['portrait', 'landscape'].map((o) => (
                                <button
                                    key={o}
                                    onClick={() => setOrientation(o)}
                                    className={`py-2 rounded-lg text-sm font-medium capitalize transition-all ${orientation === o ? 'bg-white shadow-sm text-red-600 dark:bg-slate-700' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> PDF created</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleConvert}
                    disabled={isProcessing}
                    isProcessing={isProcessing}
                    processingText="Rendering PDF..."
                    accent="from-red-500 to-rose-600 shadow-red-200 dark:shadow-red-900/40 hover:shadow-red-300 dark:hover:shadow-red-900/60"
                >
                    <Globe className="w-5 h-5 mr-2" /> Convert to PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default HTMLToPDF;

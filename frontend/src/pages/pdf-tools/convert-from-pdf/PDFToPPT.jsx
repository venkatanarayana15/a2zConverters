import React, { useState } from 'react';
import { Presentation, Download } from 'lucide-react';
import PptxGenJS from 'pptxgenjs';
import { loadPdfDoc, renderPdfPageToCanvas, downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';

const PDFToPPT = () => {
    const [file, setFile] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleConvert = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const data = new Uint8Array(await file[0].arrayBuffer());
            const pdf = await loadPdfDoc(data);
            const total = pdf.numPages;
            const pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_16x9';
            const slideW = 10;
            const slideH = 5.625;

            for (let n = 1; n <= total; n++) {
                const { canvas } = await renderPdfPageToCanvas(pdf, n, 1.5);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                const ratio = canvas.height / canvas.width;
                let w = slideW - 1;
                let h = w * ratio;
                if (h > slideH - 1) {
                    h = slideH - 1;
                    w = h / ratio;
                }
                const slide = pptx.addSlide();
                slide.background = { color: 'FFFFFF' };
                slide.addImage({ data: dataUrl, x: (slideW - w) / 2, y: (slideH - h) / 2, w, h });
            }

            const buffer = await pptx.write({ outputType: 'arraybuffer' });
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
            downloadBlob(blob, `${stripExtension(file[0].name)}.pptx`);
            setResult({ size: blob.size, slides: total });
        } catch {
            setError('Could not convert this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={Presentation} badge="Convert from pdf" title="PDF to PPT" subtitle="Turn your PDF pages into a ready-to-present PowerPoint file." accent="orange">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Presentation ready</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.slides} slides · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleConvert}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Building slides..."
                    accent="from-orange-500 to-amber-600 shadow-orange-200 hover:shadow-orange-300"
                >
                    <Presentation className="w-5 h-5 mr-2" /> Convert to PPT
                </ProcessButton>

                <p className="text-xs text-gray-400 dark:text-gray-500">Each page becomes a slide with the page image. Text stays non-editable — perfect for sharing, not editing.</p>
            </div>
        </ToolLayout>
    );
};

export default PDFToPPT;

import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { loadPdfDoc, extractPageTextLines, downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';

const PDFToWord = () => {
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
            const paragraphs = [];

            for (let n = 1; n <= pdf.numPages; n++) {
                paragraphs.push(
                    new Paragraph({
                        children: [new TextRun({ text: `Page ${n}`, bold: true, size: 28, color: '999999' })],
                        spacing: { before: 240, after: 120 },
                    })
                );
                const lines = await extractPageTextLines(pdf, n);
                for (const line of lines) {
                    paragraphs.push(new Paragraph({ children: [new TextRun(line)], spacing: { after: 80 } }));
                }
                paragraphs.push(new Paragraph({ children: [new TextRun('')] }));
            }

            const doc = new Document({ sections: [{ children: paragraphs }] });
            const blob = await Packer.toBlob(doc);
            downloadBlob(blob, `${stripExtension(file[0].name)}.docx`);
            setResult({ size: blob.size, pages: pdf.numPages });
        } catch {
            setError('Could not convert this PDF. Scanned or image-only PDFs have no text to extract.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={FileText} badge="Convert from pdf" title="PDF to Word" subtitle="Extract the text from your PDF into a clean editable Word document." accent="blue">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Word document ready</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleConvert}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Extracting text..."
                    accent="from-blue-600 to-indigo-600 shadow-blue-200 dark:shadow-blue-900/40 hover:shadow-blue-300 dark:hover:shadow-blue-900/60"
                >
                    <FileText className="w-5 h-5 mr-2" /> Convert to Word
                </ProcessButton>

                <p className="text-xs text-gray-400 dark:text-slate-400">Text extraction preserves the words, not the exact layout. Use a scanned PDF for images only.</p>
            </div>
        </ToolLayout>
    );
};

export default PDFToWord;

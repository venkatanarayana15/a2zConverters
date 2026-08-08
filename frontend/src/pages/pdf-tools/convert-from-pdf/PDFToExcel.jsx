import React, { useState } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { loadPdfDoc, extractPageTextLines, downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';

const PDFToExcel = () => {
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
            const workbook = XLSX.utils.book_new();

            for (let n = 1; n <= pdf.numPages; n++) {
                const lines = await extractPageTextLines(pdf, n);
                const rows = lines.map((line) =>
                    line.split(/\s{2,}|\t/).map((cell) => cell.trim()).filter(Boolean).length > 1
                        ? line.split(/\s{2,}|\t/).map((cell) => cell.trim())
                        : [line]
                );
                const ws = XLSX.utils.aoa_to_sheet(rows);
                ws['!cols'] = rows.reduce((acc, row) => {
                    row.forEach((cell, ci) => {
                        acc[ci] = Math.max(acc[ci] || 10, typeof cell === 'string' ? cell.length + 2 : 10);
                    });
                    return acc;
                }, []);
                XLSX.utils.book_append_sheet(workbook, ws, `Page ${n}`);
            }

            const array = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            downloadBlob(blob, `${stripExtension(file[0].name)}.xlsx`);
            setResult({ size: blob.size, pages: pdf.numPages });
        } catch {
            setError('Could not convert this PDF. Scanned or image-only PDFs have no text to extract.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={FileSpreadsheet} badge="Convert from pdf" title="PDF to Excel" subtitle="Turn the tables and text in your PDF into spreadsheet rows." accent="green">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Spreadsheet ready</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} sheets · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleConvert}
                    disabled={!file[0]}
                    isProcessing={isProcessing}
                    processingText="Extracting tables..."
                    accent="from-green-600 to-emerald-600 shadow-green-200 dark:shadow-green-900/40 hover:shadow-green-300 dark:hover:shadow-green-900/60"
                >
                    <FileSpreadsheet className="w-5 h-5 mr-2" /> Convert to Excel
                </ProcessButton>

                <p className="text-xs text-gray-400 dark:text-slate-400">Each PDF page becomes a sheet. Columns are detected from spacing — exact cell alignment is best effort.</p>
            </div>
        </ToolLayout>
    );
};

export default PDFToExcel;

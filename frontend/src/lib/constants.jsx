import {
    Files, Scissors, FileMinus, FileOutput, Layout, Scan,
    Minimize2, Wrench, Eye,
    FileImage, FileText, Presentation, FileSpreadsheet, Globe, FileArchive,
    RotateCw, Hash, Stamp, Crop, PenSquare,
    Unlock, Lock, PenTool, Eraser, Shield, GitCompare, Languages,
    Image as ImageIcon, PenLine, RefreshCw, Grid,
} from 'lucide-react';

export const pdfTools = [
    // Built
    { name: 'Merge PDF', path: '/merge-pdf', icon: Files, desc: 'Combine multiple PDFs', type: 'pdf', status: 'built' },
    { name: 'Split PDF', path: '/split-pdf', icon: Scissors, desc: 'Separate specific pages', type: 'pdf', status: 'built' },
    { name: 'Remove Pages', path: '/remove-pages', icon: FileMinus, desc: 'Delete unwanted pages', type: 'pdf', status: 'built' },
    { name: 'Compress PDF', path: '/compress-pdf', icon: Minimize2, desc: 'Reduce file size', type: 'optimize', status: 'built' },
    { name: 'Rotate PDF', path: '/rotate-pdf', icon: RotateCw, desc: 'Turn pages', type: 'security', status: 'built' },
    { name: 'Crop PDF', path: '/crop-pdf', icon: Crop, desc: 'Trim pages', type: 'security', status: 'built' },
    { name: 'Redact PDF', path: '/redact-pdf', icon: Eraser, desc: 'Hide sensitive info', type: 'security', status: 'built' },
    { name: 'Edit PDF', path: '/edit-pdf', icon: PenSquare, desc: 'Add text/shapes', type: 'security', status: 'built' },
    { name: 'Unlock PDF', path: '/unlock-pdf', icon: Unlock, desc: 'Remove password', type: 'security', status: 'built' },
    { name: 'Protect PDF', path: '/protect-pdf', icon: Lock, desc: 'Add password', type: 'security', status: 'built' },
    { name: 'eSign PDF', path: '/esign-pdf', icon: PenTool, desc: 'Sign PDF', type: 'security', status: 'built' },
    { name: 'Watermark PDF', path: '/watermark-pdf', icon: Stamp, desc: 'Add overlay', type: 'security', status: 'built' },
    { name: 'PDF Validate', path: '/pdf-validate', icon: Shield, desc: 'Check PDF standard', type: 'security', status: 'built' },
    { name: 'JPG to PDF', path: '/jpg-to-pdf', icon: FileImage, desc: 'Images to PDF', type: 'word', status: 'built' },
    { name: 'Word to PDF', path: '/word-to-pdf', icon: FileText, desc: 'Doc to PDF', type: 'word', status: 'built' },
    { name: 'Excel to PDF', path: '/excel-to-pdf', icon: FileSpreadsheet, desc: 'Sheets to PDF', type: 'excel', status: 'built' },
    { name: 'HTML to PDF', path: '/html-to-pdf', icon: Globe, desc: 'Web to PDF', type: 'word', status: 'built' },
    { name: 'PDF to Word', path: '/pdf-to-word', icon: FileText, desc: 'Editable Doc', type: 'word', status: 'built' },
    { name: 'PDF to Excel', path: '/pdf-to-excel', icon: FileSpreadsheet, desc: 'Editable Sheet', type: 'excel', status: 'built' },
    { name: 'PDF to JPG', path: '/pdf-to-jpg', icon: FileImage, desc: 'Save as Image', type: 'ppt', status: 'built' },
    { name: 'PDF to PowerPoint', path: '/pdf-to-powerpoint', icon: Presentation, desc: 'Editable Slide', type: 'ppt', status: 'built' },

    { name: 'Extract Pages', path: '/extract-pages', icon: FileOutput, desc: 'Get specific pages', type: 'pdf', status: 'built' },
    { name: 'Organize PDF', path: '/organize-pdf', icon: Layout, desc: 'Reorder your pages', type: 'pdf', status: 'built' },
    { name: 'Scan to PDF', path: '/scan-to-pdf', icon: Scan, desc: 'Digitize documents', type: 'pdf', status: 'built' },
    { name: 'Repair PDF', path: '/repair-pdf', icon: Wrench, desc: 'Fix damaged files', type: 'optimize', status: 'built' },
    { name: 'OCR PDF', path: '/ocr-pdf', icon: Eye, desc: 'Recognize text', type: 'optimize', status: 'built' },
    { name: 'PowerPoint to PDF', path: '/powerpoint-to-pdf', icon: Presentation, desc: 'Slides to PDF', type: 'word', status: 'built' },
    { name: 'PDF to PDF/A', path: '/pdf-to-pdfa', icon: FileArchive, desc: 'Archive Format', type: 'excel', status: 'built' },
    { name: 'Add Page Numbers', path: '/add-page-numbers', icon: Hash, desc: 'Add numbering', type: 'security', status: 'built' },
    { name: 'Compare PDF', path: '/compare-pdf', icon: GitCompare, desc: 'Side by side', type: 'security', status: 'built' },
    { name: 'Translate PDF', path: '/translate-pdf', icon: Languages, desc: 'Translate text', type: 'security', status: 'built' },
];

export const imageTools = [
    { name: 'Govt. Exam Resizer', path: '/gov-resizer', icon: Grid, desc: 'Strict format', type: 'image', status: 'built' },
    { name: 'Image Resizer', path: '/image-resizer', icon: ImageIcon, desc: 'Resize image', type: 'image', status: 'built' },
    { name: 'Image Editor', path: '/image-editor', icon: PenLine, desc: 'Filters/Effects', type: 'image', status: 'built' },
    { name: 'Image Converter', path: '/image-converter', icon: RefreshCw, desc: 'Change format', type: 'image', status: 'built' },
    { name: 'Background Remover', path: '/bg-remover', icon: Eraser, desc: 'Transparent bg', type: 'image', status: 'built' },
];

export const builtPdfTools = pdfTools.filter((tool) => tool.status === 'built');
export const builtImageTools = imageTools.filter((tool) => tool.status === 'built');

export const pdfToolByPath = Object.fromEntries(pdfTools.map((tool) => [tool.path, tool]));
export const imageToolByPath = Object.fromEntries(imageTools.map((tool) => [tool.path, tool]));

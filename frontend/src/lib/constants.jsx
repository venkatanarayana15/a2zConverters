import { FileText, Image as ImageIcon, Sparkles, Zap, Scissors, Minimize2, RefreshCw, FileImage, Type, Grid, Shield, Lock, Unlock, PenTool, Eraser, Table, Globe } from 'lucide-react';

export const pdfTools = [
    { name: 'Merge PDF', path: '/merge-pdf', icon: FileText },
    { name: 'Split PDF', path: '/split-pdf', icon: Scissors },
    { name: 'Compress PDF', path: '/compress-pdf', icon: Minimize2 },
    { name: 'JPG to PDF', path: '/jpg-to-pdf', icon: FileImage },
    { name: 'Excel to CSV', path: '/excel-to-csv', icon: Table },
    { name: 'CSV to Excel', path: '/csv-to-excel', icon: Table },
    { name: 'Word to PDF', path: '/word-to-pdf', icon: FileText },
    { name: 'Excel to PDF', path: '/excel-to-pdf', icon: Table },
    { name: 'PDF to Word', path: '/pdf-to-word', icon: FileText },
    { name: 'PDF to Excel', path: '/pdf-to-excel', icon: Table },
    { name: 'PDF to JPG', path: '/pdf-to-jpg', icon: FileImage },
    { name: 'Web to PDF', path: '/web-to-pdf', icon: Globe },
    { name: 'Protect PDF', path: '/protect-pdf', icon: Lock },
    { name: 'Unlock PDF', path: '/unlock-pdf', icon: Unlock },
    { name: 'Edit PDF', path: '/edit-pdf', icon: PenTool },
    { name: 'Remove Pages', path: '/remove-pages', icon: Eraser },
    { name: 'PDF Validate', path: '/pdf-validate', icon: Shield },
    { name: 'eSign PDF', path: '/esign-pdf', icon: PenTool },
    { name: 'Watermark PDF', path: '/watermark-pdf', icon: Zap },
];

export const imageTools = [
    { name: 'Image Resizer', path: '/image-resizer', icon: ImageIcon },
    { name: 'Image Editor', path: '/image-editor', icon: PenTool },
    { name: 'Image Converter', path: '/image-converter', icon: RefreshCw },
    { name: 'Background Remover', path: '/bg-remover', icon: Scissors },
    { name: 'Gov Exam Resizer', path: '/gov-resizer', icon: Grid },
];

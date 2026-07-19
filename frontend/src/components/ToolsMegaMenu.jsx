import React from 'react';
import {
    Files, Scissors, FileMinus, FileOutput, Layout, Scan,
    Minimize2, Wrench, Eye,
    FileImage, FileText, Presentation, FileSpreadsheet, Globe, FileArchive,
    RotateCw, Hash, Stamp, Crop, PenSquare,
    Unlock, Lock, PenTool, EyeOff, GitCompare,
    Languages,
    Image as ImageIcon, PenLine, Eraser, RefreshCw,
    ArrowRight,
    Sparkles,
    Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

// Unified icon styles - Functional colors only for the icon itself
// The container will use a consistent brand-aligned style to avoid "rainbow" copycat look
const getIconColor = (type) => {
    switch (type) {
        case 'pdf': return 'text-red-500';
        case 'word': return 'text-blue-600';
        case 'excel': return 'text-green-600';
        case 'ppt': return 'text-orange-500';
        case 'image': return 'text-purple-500';
        case 'security': return 'text-gray-600';
        case 'optimize': return 'text-teal-500';
        default: return 'text-primary';
    }
};

const getHoverColor = (type) => {
    switch (type) {
        case 'pdf': return 'hover:bg-red-50';
        case 'word': return 'hover:bg-blue-50';
        case 'excel': return 'hover:bg-green-50';
        case 'ppt': return 'hover:bg-orange-50';
        case 'image': return 'hover:bg-purple-50';
        case 'security': return 'hover:bg-gray-100';
        case 'optimize': return 'hover:bg-teal-50';
        default: return 'hover:bg-gray-50';
    }
};

const pdfCategories = [
    {
        title: 'Organize',
        description: 'Manage page structure',
        type: 'pdf',
        tools: [
            { icon: Files, name: 'Merge PDF', path: '/merge-pdf', desc: 'Combine multiple PDFs' },
            { icon: Scissors, name: 'Split PDF', path: '/split-pdf', desc: 'Separate specific pages' },
            { icon: FileMinus, name: 'Remove Pages', path: '/remove-pages', desc: 'Delete unwanted pages' },
            { icon: FileOutput, name: 'Extract Pages', path: '/extract-pages', desc: 'Get specific pages' },
            { icon: Layout, name: 'Organize PDF', path: '/organize-pdf', desc: 'Reorder your pages' },
            { icon: Scan, name: 'Scan to PDF', path: '/scan-to-pdf', desc: 'Digitize documents' },
        ]
    },
    {
        title: 'Optimize',
        description: 'Reduce size & improve',
        type: 'optimize',
        tools: [
            { icon: Minimize2, name: 'Compress PDF', path: '/compress-pdf', desc: 'Reduce file size' },
            { icon: Wrench, name: 'Repair PDF', path: '/repair-pdf', desc: 'Fix damaged files' },
            { icon: Eye, name: 'OCR PDF', path: '/ocr-pdf', desc: 'Recognize text' },
        ]
    },
    {
        title: 'Convert to PDF',
        description: 'Create PDFs from files',
        type: 'word',
        tools: [
            { icon: FileImage, name: 'JPG to PDF', path: '/jpg-to-pdf', desc: 'Images to PDF' },
            { icon: FileText, name: 'WORD to PDF', path: '/word-to-pdf', desc: 'Doc to PDF' },
            { icon: Presentation, name: 'PPT to PDF', path: '/powerpoint-to-pdf', desc: 'Slides to PDF' },
            { icon: FileSpreadsheet, name: 'EXCEL to PDF', path: '/excel-to-pdf', desc: 'Sheets to PDF' },
            { icon: Globe, name: 'HTML to PDF', path: '/html-to-pdf', desc: 'Web to PDF' },
        ]
    },
    {
        title: 'Convert from PDF',
        description: 'Export PDF to others',
        type: 'excel',
        tools: [
            { icon: ImageIcon, name: 'PDF to JPG', path: '/pdf-to-jpg', desc: 'Save as Image' },
            { icon: FileText, name: 'PDF to WORD', path: '/pdf-to-word', desc: 'Editable Doc' },
            { icon: Presentation, name: 'PDF to PPT', path: '/pdf-to-powerpoint', desc: 'Editable Slide' },
            { icon: FileSpreadsheet, name: 'PDF to EXCEL', path: '/pdf-to-excel', desc: 'Editable Sheet' },
            { icon: FileArchive, name: 'PDF to PDF/A', path: '/pdf-to-pdfa', desc: 'Archive Format' },
        ]
    },
    {
        title: 'Edit & Security',
        description: 'Modify content & access',
        type: 'security',
        tools: [
            { icon: RotateCw, name: 'Rotate PDF', path: '/rotate-pdf', desc: 'Turn pages' },
            { icon: Hash, name: 'Page Numbers', path: '/add-page-numbers', desc: 'Add numbering' },
            { icon: Stamp, name: 'Watermark', path: '/watermark-pdf', desc: 'Add overlay' },
            { icon: PenSquare, name: 'Edit PDF', path: '/edit-pdf', desc: 'Add text/shapes' },
            { icon: Unlock, name: 'Unlock', path: '/unlock-pdf', desc: 'Remove password' },
            { icon: Lock, name: 'Protect', path: '/protect-pdf', desc: 'Add password' },
            { icon: PenTool, name: 'eSign', path: '/esign-pdf', desc: 'Digital signature' },
        ]
    },
];

const imageCategories = [
    {
        title: 'Image Tools',
        description: 'Edit & Convert Images',
        type: 'image',
        tools: [
            { icon: Crop, name: 'Exam Resizer', path: '/gov-resizer', desc: 'Govt. format' },
            { icon: ImageIcon, name: 'Resizer', path: '/image-resizer', desc: 'Change dimensions' },
            { icon: PenLine, name: 'Editor', path: '/image-editor', desc: 'Filters & effects' },
            { icon: RefreshCw, name: 'Converter', path: '/image-converter', desc: 'Change format' },
            { icon: Eraser, name: 'BG Remover', path: '/bg-remover', desc: 'Transparent bg' },
        ]
    }
];

const ToolsMegaMenu = ({ onClose, activeSection = 'pdf' }) => {
    return (
        <div className="w-full bg-white/95 backdrop-blur-3xl border-t border-gray-100 shadow-2xl overflow-y-auto max-h-[85vh] animate-slide-up-sm">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* PDF TOOLS SECTION */}
                {activeSection === 'pdf' && (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <div className="p-1.5 rounded-md bg-red-50 text-red-600">
                                <Files className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-gray-900 tracking-wide">PDF Tools</h2>
                        </div>

                        <div className="grid grid-cols-5 gap-6">
                            {pdfCategories.map((category, idx) => (
                                <div key={idx} className="space-y-3">
                                    <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pl-1.5">
                                        {category.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {category.tools.map((tool, tIdx) => (
                                            <Link
                                                key={tIdx}
                                                to={tool.path}
                                                onClick={onClose}
                                                className={cn("group flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200", getHoverColor(category.type))}
                                            >
                                                <tool.icon className={cn("w-4 h-4 transition-colors shrink-0", getIconColor(category.type))} />
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 leading-tight">
                                                        {tool.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 group-hover:text-gray-500 leading-tight mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity h-0 group-hover:h-auto overflow-hidden">
                                                        {tool.desc}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* IMAGE TOOLS SECTION - CENTERED GRID - SMALLER */}
                {activeSection === 'image' && (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center gap-2 pb-3 border-b border-gray-100">
                            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                                <ImageIcon className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-gray-900 tracking-wide">Image Tools</h2>
                        </div>

                        <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
                            {imageCategories[0].tools.map((tool, tIdx) => (
                                <Link
                                    key={tIdx}
                                    to={tool.path}
                                    onClick={onClose}
                                    className={cn(
                                        "group flex flex-col items-center text-center p-3 rounded-lg transition-all duration-300 border border-transparent hover:border-purple-100 hover:shadow-sm",
                                        getHoverColor('image')
                                    )}
                                >
                                    <div className={cn("p-2 rounded-full bg-white mb-2 shadow-sm group-hover:scale-105 transition-transform duration-300", getIconColor('image'))}>
                                        <tool.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 mb-0.5">
                                        {tool.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400 group-hover:text-gray-500 leading-tight">
                                        {tool.desc}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Bottom Bar Removed */}
        </div>
    );
};

export default ToolsMegaMenu;

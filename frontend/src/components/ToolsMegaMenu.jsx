import React from 'react';
import { Files, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { pdfToolByPath, imageToolByPath } from '../lib/constants';

// Unified icon styles - Functional colors only for the icon itself
// The container will use a consistent brand-aligned style to avoid "rainbow" copycat look
const getIconColor = (type) => {
    switch (type) {
        case 'pdf': return 'text-red-500';
        case 'word': return 'text-blue-600';
        case 'excel': return 'text-green-600';
        case 'ppt': return 'text-orange-500';
        case 'image': return 'text-purple-500';
        case 'security': return 'text-gray-600 dark:text-slate-400';
        case 'optimize': return 'text-teal-500';
        default: return 'text-primary';
    }
};

const getHoverColor = (type) => {
    switch (type) {
        case 'pdf': return 'hover:bg-red-50 dark:hover:bg-red-900/10';
        case 'word': return 'hover:bg-blue-50 dark:hover:bg-blue-900/10';
        case 'excel': return 'hover:bg-green-50 dark:hover:bg-green-900/10';
        case 'ppt': return 'hover:bg-orange-50 dark:hover:bg-orange-900/10';
        case 'image': return 'hover:bg-purple-50 dark:hover:bg-purple-900/10';
        case 'security': return 'hover:bg-gray-100 dark:hover:bg-slate-800';
        case 'optimize': return 'hover:bg-teal-50 dark:hover:bg-teal-900/10';
        default: return 'hover:bg-gray-50 dark:hover:bg-slate-800';
    }
};

const pdfCategories = [
    {
        title: 'Organize',
        description: 'Manage page structure',
        type: 'pdf',
        paths: ['/merge-pdf', '/split-pdf', '/remove-pages', '/extract-pages', '/organize-pdf', '/scan-to-pdf'],
    },
    {
        title: 'Optimize',
        description: 'Reduce size & improve',
        type: 'optimize',
        paths: ['/compress-pdf', '/repair-pdf', '/ocr-pdf'],
    },
    {
        title: 'Convert to PDF',
        description: 'Create PDFs from files',
        type: 'word',
        paths: ['/jpg-to-pdf', '/word-to-pdf', '/powerpoint-to-pdf', '/excel-to-pdf', '/html-to-pdf'],
    },
    {
        title: 'Convert from PDF',
        description: 'Export PDF to others',
        type: 'excel',
        paths: ['/pdf-to-jpg', '/pdf-to-word', '/pdf-to-powerpoint', '/pdf-to-excel', '/pdf-to-pdfa'],
    },
    {
        title: 'Edit & Security',
        description: 'Modify content & access',
        type: 'security',
        paths: [
            '/rotate-pdf',
            '/crop-pdf',
            '/redact-pdf',
            '/add-page-numbers',
            '/watermark-pdf',
            '/edit-pdf',
            '/unlock-pdf',
            '/protect-pdf',
            '/esign-pdf',
        ],
    },
];

const imageCategories = [
    {
        title: 'Image Tools',
        description: 'Edit & Convert Images',
        type: 'image',
        paths: ['/gov-resizer', '/image-resizer', '/image-editor', '/image-converter', '/bg-remover'],
    },
];

const ToolsMegaMenu = ({ onClose, activeSection = 'pdf' }) => {
    return (
        <div className="w-full bg-white/95 dark:bg-slate-900 backdrop-blur-3xl border-t border-gray-100 dark:border-slate-700 shadow-2xl dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.4),0_32px_64px_rgba(0,0,0,0.25)] overflow-y-auto max-h-[85vh]">
            <div className="max-w-[96rem] mx-auto px-6 py-5">

                {/* PDF TOOLS SECTION */}
                {activeSection === 'pdf' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-700">
                            <div className="p-1.5 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600">
                                <Files className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100 tracking-wide">PDF Tools</h2>
                        </div>

                        <div className="grid grid-cols-5 gap-6">
                            {pdfCategories.map((category, idx) => (
                                <div key={idx} className="space-y-3">
                                    <h3 className="text-[11px] font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider pl-1.5">
                                        {category.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {category.paths.map((path) => {
                                            const tool = pdfToolByPath[path];
                                            if (!tool) return null;
                                            const Icon = tool.icon;
                                            return (
                                            <Link
                                                key={path}
                                                to={tool.path}
                                                onClick={onClose}
                                                className={cn("group flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200", getHoverColor(category.type))}
                                            >
                                                <Icon className={cn("w-4 h-4 transition-colors shrink-0", getIconColor(category.type))} />
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-medium text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-100 leading-tight">
                                                        {tool.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 dark:text-slate-400 group-hover:text-gray-500 dark:group-hover:text-slate-400 leading-tight mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity h-0 group-hover:h-auto overflow-hidden">
                                                        {tool.desc}
                                                    </span>
                                                </div>
                                            </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* IMAGE TOOLS SECTION - CENTERED GRID - SMALLER */}
                {activeSection === 'image' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-700">
                            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                                <ImageIcon className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100 tracking-wide">Image Tools</h2>
                        </div>

                        <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
                            {imageCategories[0].paths.map((path) => {
                                const tool = imageToolByPath[path];
                                if (!tool) return null;
                                const Icon = tool.icon;
                                return (
                                <Link
                                    key={path}
                                    to={tool.path}
                                    onClick={onClose}
                                    className={cn(
                                        "group p-3 rounded-lg transition-all duration-300 border border-transparent hover:border-purple-100 dark:hover:border-purple-900/30 hover:shadow-sm",
                                        getHoverColor('image')
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 shrink-0 rounded-full bg-white dark:bg-slate-800 shadow-sm dark:shadow-black/30 group-hover:scale-105 transition-transform duration-300", getIconColor('image'))}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-slate-100 block">
                                                {tool.name}
                                            </span>
                                            <span className="text-[10px] text-gray-400 dark:text-slate-400 group-hover:text-gray-500 dark:group-hover:text-slate-400 leading-tight block">
                                                {tool.desc}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            {/* Bottom Bar Removed */}
        </div>
    );
};

export default React.memo(ToolsMegaMenu);

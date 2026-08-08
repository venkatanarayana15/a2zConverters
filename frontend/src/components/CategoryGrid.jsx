import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText, Image as ImageIcon, ArrowRight, ChevronDown, ChevronUp, Grid, Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { builtPdfTools, builtImageTools } from '../lib/constants';
import { hueThemes, toolHues } from '../lib/toolStyles';

const tryHoverMap = {
    'text-red-600': 'group-hover:text-red-600 dark:group-hover:text-red-400',
    'text-green-600': 'group-hover:text-green-600 dark:group-hover:text-green-400',
    'text-blue-600': 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    'text-orange-600': 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
    'text-purple-600': 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    'text-gray-600': 'group-hover:text-gray-600 dark:group-hover:text-gray-300',
    'text-teal-600': 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
    'text-indigo-600': 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
    'text-rose-600': 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
};

const pdfOverrides = {
    '/merge-pdf': { description: 'Combine PDFs in the order you want.' },
    '/split-pdf': { description: 'Separate a large PDF or extract pages.' },
    '/compress-pdf': { description: 'Reduce file size while optimizing quality.' },
    '/pdf-to-word': { description: 'Convert PDF to editable WORD docs.' },
    '/word-to-pdf': { description: 'DOC and DOCX to PDF.' },
    '/excel-to-pdf': { description: 'EXCEL spreadsheets to PDF.' },
    '/jpg-to-pdf': { description: 'Convert JPG images to PDF.' },
    '/edit-pdf': { description: 'Add text, shapes, comments.' },
    '/remove-pages': { description: 'Remove PDF pages you don\'t need.' },
    '/unlock-pdf': { description: 'Remove password security.' },
    '/protect-pdf': { description: 'Encrypt your PDF with a password.' },
    '/esign-pdf': { description: 'Sign yourself or request signatures.' },
    '/rotate-pdf': { description: 'Rotate individual pages or whole documents.' },
    '/crop-pdf': { description: 'Trim away unwanted page margins.' },
    '/redact-pdf': { description: 'Black out sensitive text permanently.' },
    '/pdf-to-excel': { description: 'Export PDF tables to editable EXCEL.' },
    '/pdf-to-jpg': { description: 'Export PDF pages as high-quality JPG.' },
    '/pdf-to-powerpoint': { description: 'Convert PDF into editable PPT slides.' },
    '/html-to-pdf': { description: 'Turn HTML content into a PDF file.' },
    '/pdf-validate': { description: 'Check your PDF against the standard.' },
    '/watermark-pdf': { description: 'Add an overlay to every page.' },
};

const imageOverrides = {
    '/gov-resizer': { description: 'Resize photos & signatures for exams.', popular: true },
    '/image-resizer': { description: 'Resize images with quality control.' },
    '/image-editor': { description: 'Edit your images with filters.' },
    '/bg-remover': { description: 'Remove backgrounds automatically.' },
    '/image-converter': { description: 'Convert images to various formats.' },
};

const pdfDefault = { description: 'Built PDF tool.' };
const imageDefault = { description: 'Image tool.' };

const withOverrides = (overrides, fallback) => (tool) => ({
    ...tool,
    ...(overrides[tool.path] || fallback),
});

const withPdf = withOverrides(pdfOverrides, pdfDefault);
const withImage = withOverrides(imageOverrides, imageDefault);

const displayedPdfTools = builtPdfTools.map(withPdf);
const displayedImageTools = builtImageTools.map(withImage);

const CategoryGrid = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showAll, setShowAll] = useState(false);
    const [search, setSearch] = useState('');

    const getDisplayedTools = () => {
        if (activeTab === 'pdf') return displayedPdfTools;
        if (activeTab === 'image') return displayedImageTools;
        return [...displayedImageTools, ...displayedPdfTools]; // Show image tools first as they are unique features
    };

    const initialCount = 8;
    const allTools = getDisplayedTools();
    const filteredTools = search.trim()
        ? allTools.filter((t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase())
        )
        : allTools;
    const displayedTools = (showAll || activeTab !== 'all' || search.trim()) ? filteredTools : filteredTools.slice(0, initialCount);
    const totalTools = allTools.length;

    return (
        <section id="tools" className="py-12 sm:py-16 lg:py-20 relative z-10 px-4 sm:px-6 bg-gray-50/50 dark:bg-slate-900/50 w-full">
            <div className="max-w-[96rem] mx-auto w-full">

                {/* Header & Tabs */}
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4 text-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-sky-400 dark:to-cyan-500">
                            Everything you need
                        </span>
                    </h2>
                    <p className="text-gray-500 dark:text-slate-400 text-center mb-8">
                        We offer a suite of PDF and Image tools to make your document management easier and faster.
                    </p>

                    <div className="flex p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-slate-700/60 rounded-xl shadow-sm dark:shadow-black/20">
                        <button
                            onClick={() => { setActiveTab('all'); setShowAll(false); }}
                            className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === 'all' ? "bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:ring-sky-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-sky-900/30"
                            )}
                        >
                            <Grid className="w-4 h-4 mr-2" />
                            All Tools
                        </button>
                        <button
                            onClick={() => { setActiveTab('pdf'); setShowAll(false); }}
                            className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === 'pdf' ? "bg-red-50 text-red-600 shadow-sm ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/30"
                            )}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            PDF Tools
                        </button>
                        <button
                            onClick={() => { setActiveTab('image'); setShowAll(false); }}
                            className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === 'image' ? "bg-purple-50 text-purple-600 shadow-sm ring-1 ring-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:ring-purple-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/30"
                            )}
                        >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Image Tools
                        </button>
                    </div>

                    <div className="relative w-full max-w-md mt-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-300" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tools…"
                            className="input-base pl-12!"
                        />
                    </div>
                </div>

                {/* Grid */}
                {filteredTools.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                        <p className="text-gray-500 dark:text-slate-400">No tools match "{search}".</p>
                        <button
                            onClick={() => setSearch('')}
                            className="mt-4 text-sm font-semibold text-primary hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
                    {displayedTools.map((tool, idx) => {
                        const Icon = tool.icon;
                        const theme = hueThemes[toolHues[tool.path]] || hueThemes.blue;
                        return (
                        <motion.div
                            key={tool.path}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.04 }}
                        >
                        <Link
                            to={tool.path}
                            className={cn(
                                "group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full",
                                theme.color
                            )}
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 dark:group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 shrink-0 rounded-xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-black/5 dark:ring-slate-700 dark:shadow-black/30 group-hover:scale-110 transition-transform duration-300">
                                    {Icon && <Icon className={cn("w-6 h-6", theme.iconColor)} />}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                                    {tool.name}
                                </h3>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow">
                                {tool.description}
                            </p>

                            <div className={cn("flex items-center text-xs font-semibold transition-colors mt-auto text-gray-400 dark:text-slate-400", theme.tryColor && tryHoverMap[theme.tryColor])}>
                                Try Now <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>

                            {tool.popular && (
                                <div className="absolute top-4 right-4">
                                    <span className="flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                                    </span>
                                </div>
                            )}
                        </Link>
                        </motion.div>
                        );
                    })}
                </div>
                )}
                {activeTab === 'all' && !search.trim() && totalTools > initialCount && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="flex items-center px-7 py-3 rounded-full text-sm font-semibold text-gray-600 dark:text-slate-400 border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-primary/10 hover:text-blue-600 dark:hover:text-primary hover:border-blue-200 dark:hover:border-primary/30 transition-colors duration-300"
                        >
                            {showAll ? 'View Less' : 'View All Tools'}
                            {showAll ? <ChevronUp className="w-3.5 h-3.5 ml-1.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-1.5" />}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryGrid;

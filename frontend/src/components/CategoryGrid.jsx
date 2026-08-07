import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText, Image as ImageIcon, ArrowRight, ChevronDown, ChevronUp, Grid
} from 'lucide-react';
import { cn } from '../lib/utils';
import { builtPdfTools, builtImageTools } from '../lib/constants';

const pdfOverrides = {
    '/merge-pdf': { description: 'Combine PDFs in the order you want.', color: 'bg-red-50/50 border-red-100', tryColor: 'text-red-600', iconColor: 'text-red-500' },
    '/split-pdf': { description: 'Separate a large PDF or extract pages.', color: 'bg-red-50/50 border-red-100', tryColor: 'text-red-600', iconColor: 'text-red-500' },
    '/compress-pdf': { description: 'Reduce file size while optimizing quality.', color: 'bg-green-50/50 border-green-100', tryColor: 'text-green-600', iconColor: 'text-green-500' },
    '/pdf-to-word': { description: 'Convert PDF to editable WORD docs.', color: 'bg-blue-50/50 border-blue-100', tryColor: 'text-blue-600', iconColor: 'text-blue-600' },
    '/word-to-pdf': { description: 'DOC and DOCX to PDF.', color: 'bg-blue-50/50 border-blue-100', tryColor: 'text-blue-600', iconColor: 'text-blue-600' },
    '/excel-to-pdf': { description: 'EXCEL spreadsheets to PDF.', color: 'bg-green-50/50 border-green-100', tryColor: 'text-green-600', iconColor: 'text-green-600' },
    '/jpg-to-pdf': { description: 'Convert JPG images to PDF.', color: 'bg-orange-50/50 border-orange-100', tryColor: 'text-orange-600', iconColor: 'text-orange-500' },
    '/edit-pdf': { description: 'Add text, shapes, comments.', color: 'bg-purple-50/50 border-purple-100', tryColor: 'text-purple-600', iconColor: 'text-purple-500' },
    '/remove-pages': { description: 'Remove PDF pages you don\'t need.', color: 'bg-red-50/50 border-red-100', tryColor: 'text-red-600', iconColor: 'text-red-500' },
    '/unlock-pdf': { description: 'Remove password security.', color: 'bg-gray-50/50 border-gray-200', tryColor: 'text-gray-600', iconColor: 'text-gray-500' },
    '/protect-pdf': { description: 'Encrypt your PDF with a password.', color: 'bg-gray-50/50 border-gray-200', tryColor: 'text-gray-600', iconColor: 'text-gray-500' },
    '/esign-pdf': { description: 'Sign yourself or request signatures.', color: 'bg-gray-50/50 border-gray-200', tryColor: 'text-gray-600', iconColor: 'text-gray-500' },
    '/rotate-pdf': { description: 'Rotate individual pages or whole documents.', color: 'bg-teal-50/50 border-teal-100', tryColor: 'text-teal-600', iconColor: 'text-blue-500' },
    '/crop-pdf': { description: 'Trim away unwanted page margins.', color: 'bg-indigo-50/50 border-indigo-100', tryColor: 'text-indigo-600', iconColor: 'text-indigo-500' },
    '/redact-pdf': { description: 'Black out sensitive text permanently.', color: 'bg-rose-50/50 border-rose-100', tryColor: 'text-rose-600', iconColor: 'text-rose-500' },
    '/pdf-to-excel': { description: 'Export PDF tables to editable EXCEL.', color: 'bg-green-50/50 border-green-100', tryColor: 'text-green-600', iconColor: 'text-green-600' },
    '/pdf-to-jpg': { description: 'Export PDF pages as high-quality JPG.', color: 'bg-orange-50/50 border-orange-100', tryColor: 'text-orange-600', iconColor: 'text-orange-500' },
    '/pdf-to-powerpoint': { description: 'Convert PDF into editable PPT slides.', color: 'bg-orange-50/50 border-orange-100', tryColor: 'text-orange-600', iconColor: 'text-orange-500' },
    '/html-to-pdf': { description: 'Turn HTML content into a PDF file.', color: 'bg-blue-50/50 border-blue-100', tryColor: 'text-blue-600', iconColor: 'text-blue-600' },
    '/pdf-validate': { description: 'Check your PDF against the standard.', color: 'bg-teal-50/50 border-teal-100', tryColor: 'text-teal-600', iconColor: 'text-teal-500' },
    '/watermark-pdf': { description: 'Add an overlay to every page.', color: 'bg-purple-50/50 border-purple-100', tryColor: 'text-purple-600', iconColor: 'text-purple-500' },
};

const imageOverrides = {
    '/gov-resizer': { description: 'Resize photos & signatures for exams.', color: 'bg-orange-50/50 border-orange-100', tryColor: 'text-orange-600', iconColor: 'text-orange-500', popular: true },
    '/image-resizer': { description: 'Resize images with quality control.', color: 'bg-indigo-50/50 border-indigo-100', tryColor: 'text-indigo-600', iconColor: 'text-indigo-500' },
    '/image-editor': { description: 'Edit your images with filters.', color: 'bg-purple-50/50 border-purple-100', tryColor: 'text-purple-600', iconColor: 'text-purple-500' },
    '/bg-remover': { description: 'Remove backgrounds automatically.', color: 'bg-rose-50/50 border-rose-100', tryColor: 'text-rose-600', iconColor: 'text-rose-500' },
    '/image-converter': { description: 'Convert images to various formats.', color: 'bg-blue-50/50 border-blue-100', tryColor: 'text-blue-600', iconColor: 'text-blue-500' },
};

const pdfDefault = { description: 'Built PDF tool.', color: 'bg-blue-50/50 border-blue-100', tryColor: 'text-blue-600', iconColor: 'text-blue-500' };
const imageDefault = { description: 'Image tool.', color: 'bg-indigo-50/50 border-indigo-100', tryColor: 'text-indigo-600', iconColor: 'text-indigo-500' };

const withOverrides = (overrides, fallback) => (tool) => ({
    ...tool,
    ...(overrides[tool.path] || fallback),
});

const hoverColorMap = {
    'text-red-600': 'hover:text-red-600',
    'text-green-600': 'hover:text-green-600',
    'text-blue-600': 'hover:text-blue-600',
    'text-orange-600': 'hover:text-orange-600',
    'text-purple-600': 'hover:text-purple-600',
    'text-gray-600': 'hover:text-gray-600',
    'text-indigo-600': 'hover:text-indigo-600',
    'text-rose-600': 'hover:text-rose-600',
    'text-teal-600': 'hover:text-teal-600',
};

const withPdf = withOverrides(pdfOverrides, pdfDefault);
const withImage = withOverrides(imageOverrides, imageDefault);

const displayedPdfTools = builtPdfTools.map(withPdf);
const displayedImageTools = builtImageTools.map(withImage);

const CategoryGrid = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showAll, setShowAll] = useState(false);

    const getDisplayedTools = () => {
        if (activeTab === 'pdf') return displayedPdfTools;
        if (activeTab === 'image') return displayedImageTools;
        return [...displayedImageTools, ...displayedPdfTools]; // Show image tools first as they are unique features
    };

    const initialCount = 8;
    const allTools = getDisplayedTools();
    const displayedTools = (showAll || activeTab !== 'all') ? allTools : allTools.slice(0, initialCount);
    const totalTools = allTools.length;

    return (
        <section id="tools" className="py-12 sm:py-16 lg:py-20 relative z-10 px-4 sm:px-6 bg-gray-50/50 dark:bg-gray-900/50 w-full">
            <div className="max-w-[96rem] mx-auto w-full">

                {/* Header & Tabs */}
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                            Everything you need
                        </span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                        We offer a suite of PDF and Image tools to make your document management easier and faster.
                    </p>

                    <div className="flex p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm">
                        <button
                            onClick={() => { setActiveTab('all'); setShowAll(false); }}
                            className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === 'all' ? "bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:ring-sky-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <Grid className="w-4 h-4 mr-2" />
                            All Tools
                        </button>
                        <button
                            onClick={() => { setActiveTab('pdf'); setShowAll(false); }}
                            className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === 'pdf' ? "bg-red-50 text-red-600 shadow-sm ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            PDF Tools
                        </button>
                        <button
                            onClick={() => { setActiveTab('image'); setShowAll(false); }}
                            className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === 'image' ? "bg-purple-50 text-purple-600 shadow-sm ring-1 ring-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:ring-purple-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Image Tools
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
                    {displayedTools.map((tool, idx) => {
                        const Icon = tool.icon;
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
                                "group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-900 flex flex-col h-full",
                                tool.color
                            )}
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 shrink-0 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black/5 dark:ring-gray-700 group-hover:scale-110 transition-transform duration-300">
                                    {Icon && <Icon className={cn("w-6 h-6", tool.iconColor)} />}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {tool.name}
                                </h3>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                                {tool.description}
                            </p>

                            <div className={cn("flex items-center text-xs font-semibold text-primary/80 transition-colors mt-auto", tool.tryColor && hoverColorMap[tool.tryColor])}>
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
                {activeTab === 'all' && totalTools > initialCount && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="flex items-center px-7 py-3 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-sky-400 hover:border-blue-200 dark:hover:border-sky-800 transition-colors duration-300"
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

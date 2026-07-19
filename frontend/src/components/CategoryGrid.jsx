import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Files, Scissors, FileMinus, FileOutput, Layout, Scan,
    Minimize2, Wrench, Eye,
    FileImage, FileText, Presentation, FileSpreadsheet, Globe, FileArchive,
    RotateCw, Hash, Stamp, Crop, PenSquare,
    Unlock, Lock, PenTool, EyeOff, GitCompare,
    Languages,
    Image as ImageIcon, PenLine, Eraser, RefreshCw, Zap,
    ArrowRight, ChevronDown, ChevronUp, Grid, Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

// Separated Data Sources
const pdfTools = [
    { icon: <Files className="w-6 h-6 text-red-500" />, title: 'Merge PDF', description: 'Combine PDFs in the order you want.', path: '/merge-pdf', color: 'bg-red-50/50 border-red-100' },
    { icon: <Scissors className="w-6 h-6 text-red-500" />, title: 'Split PDF', description: 'Separate a large PDF or extract pages.', path: '/split-pdf', color: 'bg-red-50/50 border-red-100' },
    { icon: <Minimize2 className="w-6 h-6 text-green-500" />, title: 'Compress PDF', description: 'Reduce file size while optimizing quality.', path: '/compress-pdf', color: 'bg-green-50/50 border-green-100' },
    { icon: <FileText className="w-6 h-6 text-blue-600" />, title: 'PDF to Word', description: 'Convert PDF to editable WORD docs.', path: '/pdf-to-word', color: 'bg-blue-50/50 border-blue-100' },
    { icon: <FileText className="w-6 h-6 text-blue-600" />, title: 'Word to PDF', description: 'DOC and DOCX to PDF.', path: '/word-to-pdf', color: 'bg-blue-50/50 border-blue-100' },
    { icon: <FileSpreadsheet className="w-6 h-6 text-green-600" />, title: 'Excel to PDF', description: 'EXCEL spreadsheets to PDF.', path: '/excel-to-pdf', color: 'bg-green-50/50 border-green-100' },
    { icon: <FileImage className="w-6 h-6 text-orange-500" />, title: 'JPG to PDF', description: 'Convert JPG images to PDF.', path: '/jpg-to-pdf', color: 'bg-orange-50/50 border-orange-100' },
    { icon: <PenSquare className="w-6 h-6 text-purple-500" />, title: 'Edit PDF', description: 'Add text, shapes, comments.', path: '/edit-pdf', color: 'bg-purple-50/50 border-purple-100' },
    { icon: <FileMinus className="w-6 h-6 text-red-500" />, title: 'Remove Pages', description: 'Remove PDF pages you don’t need.', path: '/remove-pages', color: 'bg-red-50/50 border-red-100' },
    { icon: <Unlock className="w-6 h-6 text-gray-500" />, title: 'Unlock PDF', description: 'Remove password security.', path: '/unlock-pdf', color: 'bg-gray-50/50 border-gray-200' },
    { icon: <Lock className="w-6 h-6 text-gray-500" />, title: 'Protect PDF', description: 'Encrypt your PDF with a password.', path: '/protect-pdf', color: 'bg-gray-50/50 border-gray-200' },
    { icon: <PenTool className="w-6 h-6 text-gray-500" />, title: 'Sign PDF', description: 'Sign yourself or request signatures.', path: '/esign-pdf', color: 'bg-gray-50/50 border-gray-200' },
];

const imageTools = [
    { icon: <Crop className="w-6 h-6 text-orange-500" />, title: 'Gov Exam Resizer', description: 'Resize photos & signatures for exams.', path: '/gov-resizer', color: 'bg-orange-50/50 border-orange-100', popular: true },
    { icon: <ImageIcon className="w-6 h-6 text-indigo-500" />, title: 'Image Resizer', description: 'Resize images with quality control.', path: '/image-resizer', color: 'bg-indigo-50/50 border-indigo-100' },
    { icon: <PenLine className="w-6 h-6 text-purple-500" />, title: 'Image Editor', description: 'Edit your images with filters.', path: '/image-editor', color: 'bg-purple-50/50 border-purple-100' },
    { icon: <Eraser className="w-6 h-6 text-rose-500" />, title: 'Background Remover', description: 'Remove backgrounds automatically.', path: '/bg-remover', color: 'bg-rose-50/50 border-rose-100' },
    { icon: <RefreshCw className="w-6 h-6 text-blue-500" />, title: 'Image Converter', description: 'Convert images to various formats.', path: '/image-converter', color: 'bg-blue-50/50 border-blue-100' },
];

const CategoryGrid = () => {
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pdf', 'image'

    // Combine for 'all' view but prioritize popular ones
    const getDisplayedTools = () => {
        if (activeTab === 'pdf') return pdfTools;
        if (activeTab === 'image') return imageTools;
        return [...imageTools, ...pdfTools]; // Show image tools first as they are unique features
    };

    const displayedTools = getDisplayedTools();

    return (
        <section id="tools" className="py-12 sm:py-16 lg:py-20 relative z-10 px-4 sm:px-6 bg-gray-50/50 w-full">
            <div className="max-w-7xl mx-auto w-full">

                {/* Header & Tabs */}
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                            Everything you need
                        </span>
                    </h2>
                    <p className="text-gray-500 text-center max-w-xl mb-8">
                        We offer a suite of PDF and Image tools to make your document management easier and faster.
                    </p>

                    <div className="flex p-1 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === 'all' ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                            <Grid className="w-4 h-4 mr-2" />
                            All Tools
                        </button>
                        <button
                            onClick={() => setActiveTab('pdf')}
                            className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === 'pdf' ? "bg-red-50 text-red-600 shadow-sm ring-1 ring-red-200" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            PDF Tools
                        </button>
                        <button
                            onClick={() => setActiveTab('image')}
                            className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === 'image' ? "bg-purple-50 text-purple-600 shadow-sm ring-1 ring-purple-200" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Image Tools
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
                    {displayedTools.map((tool, idx) => (
                        <Link
                            key={idx}
                            to={tool.path}
                            className={cn(
                                "group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white flex flex-col items-start h-full",
                                tool.color
                            )}
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="mb-4 p-3 rounded-xl bg-white shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-300">
                                {tool.icon}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                {tool.title}
                            </h3>

                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                                {tool.description}
                            </p>

                            <div className="flex items-center text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors mt-auto">
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;

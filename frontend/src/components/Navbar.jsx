import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Zap, Search, FileText, Image as ImageIcon, Sparkles, ChevronDown, User, LogOut, Settings, Home, Menu, X, DollarSign,
    Files, Scissors, FileMinus, FileOutput, Layout, Scan, Minimize2, Wrench, Eye, FileImage, Presentation,
    FileSpreadsheet, Globe, FileArchive, RotateCw, Hash, Stamp, Crop, PenSquare, Unlock, Lock, PenTool,
    PenLine, RefreshCw, Eraser
} from 'lucide-react';
import { cn } from '../lib/utils';
import ToolsMegaMenu from './ToolsMegaMenu';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    // Mobile State
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [mobileView, setMobileView] = useState('all'); // 'all', 'pdf', 'image'

    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setActiveMenu(null);
        setShowResults(false);
        setShowProfile(false);
        setMobileDrawerOpen(false);
    }, [location.pathname]);

    // PDF Categories with Icons
    const pdfCategories = [
        {
            title: 'Organize',
            tools: [
                { icon: Files, name: 'Merge PDF', path: '/merge-pdf', desc: 'Combine PDFs' },
                { icon: Scissors, name: 'Split PDF', path: '/split-pdf', desc: 'Separate pages' },
                { icon: FileMinus, name: 'Remove Pages', path: '/remove-pages', desc: 'Delete pages' },
                { icon: FileOutput, name: 'Extract Pages', path: '/extract-pages', desc: 'Get pages' },
                { icon: Layout, name: 'Organize PDF', path: '/organize-pdf', desc: 'Reorder pages' },
                { icon: Scan, name: 'Scan to PDF', path: '/scan-to-pdf', desc: 'Scan docs' },
            ]
        },
        {
            title: 'Optimize',
            tools: [
                { icon: Minimize2, name: 'Compress PDF', path: '/compress-pdf', desc: 'Reduce size' },
                { icon: Wrench, name: 'Repair PDF', path: '/repair-pdf', desc: 'Fix PDF' },
                { icon: Eye, name: 'OCR PDF', path: '/ocr-pdf', desc: 'Recognize text' },
            ]
        },
        {
            title: 'Convert to PDF',
            tools: [
                { icon: FileImage, name: 'JPG to PDF', path: '/jpg-to-pdf', desc: 'Images to PDF' },
                { icon: FileText, name: 'Word to PDF', path: '/word-to-pdf', desc: 'Doc to PDF' },
                { icon: Presentation, name: 'PPT to PDF', path: '/powerpoint-to-pdf', desc: 'Slides to PDF' },
                { icon: FileSpreadsheet, name: 'Excel to PDF', path: '/excel-to-pdf', desc: 'Sheets to PDF' },
                { icon: Globe, name: 'Web to PDF', path: '/web-to-pdf', desc: 'HTML to PDF' },
            ]
        },
        {
            title: 'Convert from PDF',
            tools: [
                { icon: ImageIcon, name: 'PDF to JPG', path: '/pdf-to-jpg', desc: 'Save as Image' },
                { icon: FileText, name: 'PDF to Word', path: '/pdf-to-word', desc: 'Editable Doc' },
                { icon: Presentation, name: 'PDF to PPT', path: '/pdf-to-powerpoint', desc: 'Editable Slide' },
                { icon: FileSpreadsheet, name: 'PDF to Excel', path: '/pdf-to-excel', desc: 'Editable Sheet' },
                { icon: FileArchive, name: 'PDF to PDF/A', path: '/pdf-to-pdfa', desc: 'Archive Format' },
            ]
        },
        {
            title: 'Edit & Security',
            tools: [
                { icon: RotateCw, name: 'Rotate PDF', path: '/rotate-pdf', desc: 'Turn pages' },
                { icon: Hash, name: 'Add Page Numbers', path: '/add-page-numbers', desc: 'Numbering' },
                { icon: Stamp, name: 'Watermark PDF', path: '/watermark-pdf', desc: 'Add overlay' },
                { icon: PenSquare, name: 'Edit PDF', path: '/edit-pdf', desc: 'Add text' },
                { icon: Crop, name: 'Crop PDF', path: '/crop-pdf', desc: 'Trim pages' },
                { icon: Unlock, name: 'Unlock PDF', path: '/unlock-pdf', desc: 'Remove password' },
                { icon: Lock, name: 'Protect PDF', path: '/protect-pdf', desc: 'Add password' },
                { icon: PenTool, name: 'eSign PDF', path: '/esign-pdf', desc: 'Sign PDF' },
                { icon: Eraser, name: 'Redact PDF', path: '/redact-pdf', desc: 'Hide info' },
            ]
        },
        {
            title: 'Other',
            tools: [
                { icon: Globe, name: 'Translate PDF', path: '/translate-pdf', desc: 'Translate text' },
                { icon: Layout, name: 'Compare PDF', path: '/compare-pdf', desc: 'Side by side' },
                { icon: FileText, name: 'PDF Validate', path: '/pdf-validate', desc: 'Check standard' },
            ]
        }
    ];

    // Image Categories
    const imageCategories = [
        {
            title: 'Image Tools',
            tools: [
                { icon: Crop, name: 'Gov Exam Resizer', path: '/gov-resizer', desc: 'Strict format' },
                { icon: ImageIcon, name: 'Image Resizer', path: '/image-resizer', desc: 'Resize image' },
                { icon: PenLine, name: 'Image Editor', path: '/image-editor', desc: 'Filters/Effects' },
                { icon: RefreshCw, name: 'Image Converter', path: '/image-converter', desc: 'Change format' },
                { icon: Eraser, name: 'Background Remover', path: '/bg-remover', desc: 'Transparent bg' },
            ]
        }
    ];

    // Derived Flat Lists for Search & Backward Compat
    const pdfTools = pdfCategories.flatMap(cat => cat.tools);
    const imageTools = imageCategories.flatMap(cat => cat.tools);

    const allTools = [...pdfTools, ...imageTools];
    const filteredTools = allTools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchSelect = (path) => {
        navigate(path);
        setSearchQuery('');
        setShowResults(false);
        setMobileDrawerOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        {
            name: 'PDF Tools',
            path: '#',
            icon: <FileText className="w-4 h-4 mr-2" />,
            isMegaMenu: true,
            dropdown: pdfTools
        },
        {
            name: 'Image Tools',
            path: '#',
            icon: <ImageIcon className="w-4 h-4 mr-2" />,
            isMegaMenu: true,
            dropdown: imageTools
        },
        { name: 'Pricing', path: '/pricing' },
    ];

    const isActive = (path) => location.pathname === path;

    // Helper to open specific mobile view
    const openMobileView = (view) => {
        if (mobileDrawerOpen && mobileView === view) {
            setMobileDrawerOpen(false); // Toggle close if same
        } else {
            setMobileView(view);
            setMobileDrawerOpen(true);
        }
    };

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
                    scrolled || activeMenu || mobileDrawerOpen
                        ? "bg-white/95 backdrop-blur-md border-gray-200/50 shadow-sm"
                        : "bg-transparent border-transparent"
                )}
                onMouseLeave={() => setActiveMenu(null)}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

                        {/* Left: Logo */}
                        <Link to="/" className="flex items-center space-x-2.5 group select-none z-50 shrink-0">
                            <div className="relative w-9 h-9">
                                <div className={cn("absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100")} />
                                {/* Custom SVG Logo: Teal Swirls */}
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-105 duration-300">
                                    {/* Top Right Arc */}
                                    <path d="M50 20C66.5685 20 80 33.4315 80 50C80 55.6 78.5 60.8 75.8 65.3C83.5 59.8 88.5 50.8 88.5 40.5C88.5 23.655 74.845 10 58 10C48.5 10 40 14.2 34.2 20.8C39 20.3 44.4 20 50 20Z" fill="url(#paint0_linear)" />
                                    {/* Bottom Right Arc */}
                                    <path d="M80 50C80 66.5685 66.5685 80 50 80C44.4 80 39.2 78.5 34.7 75.8C40.2 83.5 49.2 88.5 59.5 88.5C76.345 88.5 90 74.845 90 58C90 48.5 85.8 40 79.2 34.2C79.7 39 80 44.4 80 50Z" fill="url(#paint1_linear)" />
                                    {/* Left Arc */}
                                    <path d="M50 80C33.4315 80 20 66.5685 20 50C20 44.4 21.5 39.2 24.2 34.7C16.5 40.2 11.5 49.2 11.5 59.5C11.5 76.345 25.155 90 42 90C51.5 90 60 85.8 65.8 79.2C61 79.7 55.6 80 50 80Z" fill="url(#paint2_linear)" />

                                    {/* Inner Swirls (Darker accents) - Simplified for cleaner icon */}
                                    <path d="M50 28C62.15 28 72 37.85 72 50C72 52.8 71.3 55.4 70.1 57.8C75.2 53.5 78.5 47.1 78.5 40C78.5 25.36 66.64 13.5 52 13.5C44.8 13.5 38.3 16.3 33.5 20.8C38.2 25.3 43.8 28 50 28Z" fill="#00897B" />
                                    <path d="M72 50C72 62.15 62.15 72 50 72C47.2 72 44.6 71.3 42.2 70.1C46.5 75.2 52.9 78.5 60 78.5C74.64 78.5 86.5 66.64 86.5 52C86.5 44.8 83.7 38.3 79.2 33.5C74.7 38.2 72 43.8 72 50Z" fill="#00695C" />
                                    <path d="M50 72C37.85 72 28 62.15 28 50C28 47.2 28.7 44.6 29.9 42.2C24.8 46.5 21.5 52.9 21.5 60C21.5 74.64 33.36 86.5 48 86.5C55.2 86.5 61.7 83.7 66.5 79.2C61.8 74.7 56.2 72 50 72Z" fill="#004D40" />

                                    <defs>
                                        <linearGradient id="paint0_linear" x1="34" y1="20" x2="88" y2="40" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#26A69A" />
                                            <stop offset="1" stopColor="#00897B" />
                                        </linearGradient>
                                        <linearGradient id="paint1_linear" x1="80" y1="34" x2="60" y2="88" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#00897B" />
                                            <stop offset="1" stopColor="#00695C" />
                                        </linearGradient>
                                        <linearGradient id="paint2_linear" x1="66" y1="80" x2="12" y2="60" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#00695C" />
                                            <stop offset="1" stopColor="#004D40" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <span className={cn("text-lg font-bold text-gray-900 group-hover:text-primary transition-colors")}>
                                a2zconverters
                            </span>
                        </Link>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 z-50 flex-1 justify-end md:justify-end">

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="relative group px-1"
                                        onMouseEnter={() => {
                                            if (link.name === 'PDF Tools') setActiveMenu('pdf');
                                            else if (link.name === 'Image Tools') setActiveMenu('image');
                                            else setActiveMenu(null);
                                        }}
                                    >
                                        <span
                                            className={cn(
                                                "px-3 py-2 text-sm font-medium transition-all duration-300 flex items-center outline-none cursor-pointer",
                                                ((activeMenu === 'pdf' && link.name === 'PDF Tools') || (activeMenu === 'image' && link.name === 'Image Tools') || isActive(link.path))
                                                    ? "text-primary bg-linear-to-b from-primary/5 to-primary/10 border-b-2 border-primary shadow-[0_4px_15px_-3px_rgba(59,130,246,0.4)] rounded-t-lg"
                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg border-b-2 border-transparent"
                                            )}
                                        >
                                            {link.name}
                                            {(link.dropdown || link.isMegaMenu) && (
                                                <ChevronDown className={cn("w-3.5 h-3.5 ml-1.5 opacity-50 transition-transform duration-200", ((activeMenu === 'pdf' && link.name === 'PDF Tools') || (activeMenu === 'image' && link.name === 'Image Tools')) ? "rotate-180" : "")} />
                                            )}
                                        </span>

                                        {/* Standard Dropdown (Non-Mega) */}
                                        {link.dropdown && !link.isMegaMenu && (
                                            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 w-56 z-50">
                                                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-1.5 ring-1 ring-black/5">
                                                    {link.dropdown.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            to={item.path}
                                                            className={cn("flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/5 transition-all group/item")}
                                                        >
                                                            <div className={cn("w-7 h-7 rounded-md bg-gray-50 text-gray-400 flex items-center justify-center mr-3 group-hover/item:bg-white group-hover/item:text-primary group-hover/item:shadow-sm transition-all")}>
                                                                <Sparkles className="w-3.5 h-3.5" />
                                                            </div>
                                                            <span className="font-medium">{item.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>

                            {/* Search Bar - Visible on Mobile & Desktop */}
                            <div className="relative group flex-1 md:max-w-64 max-w-[200px] md:flex-none">
                                <div className={cn("flex items-center bg-gray-100/50 border border-gray-200 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all w-full")}>
                                    <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder:text-gray-400 min-w-0"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowResults(true);
                                        }}
                                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                                        onFocus={() => setShowResults(true)}
                                    />
                                </div>
                                {/* Search Results */}
                                {showResults && searchQuery && (
                                    <div className="absolute top-full right-0 w-full md:w-72 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[60]">
                                        <div className="py-2 max-h-80 overflow-y-auto">
                                            {filteredTools.length > 0 ? (
                                                filteredTools.map((tool, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSearchSelect(tool.path)}
                                                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 flex items-center transition-colors border-b border-gray-50 last:border-0"
                                                    >
                                                        <Search className="w-3.5 h-3.5 mr-3 text-gray-400" />
                                                        <span className="font-medium line-clamp-1">{tool.name}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-4 text-center text-gray-500 text-xs">No tools found.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Toggle - NOW VISIBLE ON MOBILE */}
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center transition-all shadow-sm"
                                >
                                    <User className="w-4 h-4 text-gray-600" />
                                </button>
                                {showProfile && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-slide-up-sm">
                                        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                            <p className="font-bold text-gray-900 text-sm">Demo User</p>
                                            <p className="text-xs text-gray-500">user@example.com</p>
                                        </div>
                                        <div className="p-1">
                                            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                                            </button>
                                            <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mega Menu Overlay (Desktop Only) */}
                {(activeMenu === 'pdf' || activeMenu === 'image') && (
                    <div
                        className="absolute top-full left-0 w-full z-40 animate-slide-up-sm hidden md:block"
                        onMouseEnter={() => setActiveMenu(activeMenu)}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <ToolsMegaMenu
                            activeSection={activeMenu}
                            onClose={() => setActiveMenu(null)}
                        />
                    </div>
                )}
            </nav>

            {/* Bottom Navigation (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-[60] pb-safe">
                <div className="grid grid-cols-5 gap-1 p-2">
                    <Link
                        to="/"
                        className={cn("flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium", location.pathname === '/' ? "text-primary bg-primary/5" : "text-gray-500 hover:text-gray-900")}
                    >
                        <Home className="w-5 h-5 mb-1" />
                        Home
                    </Link>
                    <button
                        onClick={() => openMobileView('pdf')}
                        className={cn("flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium", mobileDrawerOpen && mobileView === 'pdf' ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-gray-900")}
                    >
                        <FileText className="w-5 h-5 mb-1" />
                        PDF Tools
                    </button>
                    <button
                        onClick={() => openMobileView('image')}
                        className={cn("flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium", mobileDrawerOpen && mobileView === 'image' ? "text-purple-500 bg-purple-50" : "text-gray-500 hover:text-gray-900")}
                    >
                        <ImageIcon className="w-5 h-5 mb-1" />
                        Image Tools
                    </button>
                    <Link
                        to="/pricing"
                        className={cn("flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium", location.pathname === '/pricing' ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-gray-900")}
                    >
                        <DollarSign className="w-5 h-5 mb-1" />
                        Pricing
                    </Link>
                    <button
                        onClick={() => openMobileView('profile')}
                        className={cn("flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium", mobileDrawerOpen && mobileView === 'profile' ? "text-blue-500 bg-blue-50" : "text-gray-500 hover:text-gray-900")}
                    >
                        <User className="w-5 h-5 mb-1" />
                        Profile
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Sheet/Drawer */}
            {mobileDrawerOpen && (
                <div className="md:hidden fixed inset-x-0 bottom-[64px] top-16 bg-white z-[55] overflow-y-auto animate-slide-up bg-white/95 backdrop-blur-xl">
                    <div className="p-4 safe-area-bottom">
                        {/* View: PDF Tools */}
                        {mobileView === 'pdf' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10 pb-2 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-red-500" /> All PDF Tools
                                    </h3>
                                    <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-full bg-gray-100"><X className="w-4 h-4" /></button>
                                </div>
                                {pdfCategories.map((category, catIdx) => (
                                    <div key={catIdx} className="space-y-3 pb-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 pt-2">{category.title}</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {category.tools.map((tool, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={tool.path}
                                                    onClick={() => setMobileDrawerOpen(false)}
                                                    className="flex flex-col p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-red-100 hover:shadow-md transition-all active:scale-[0.98]"
                                                >
                                                    <div className="p-2 rounded-lg bg-red-50 w-fit mb-2">
                                                        <tool.icon className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-800 line-clamp-1">{tool.name}</span>
                                                    <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{tool.desc}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="h-12" /> {/* Extra spacing at bottom */}
                            </div>
                        )}

                        {/* View: Image Tools */}
                        {mobileView === 'image' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10 pb-2 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <ImageIcon className="w-5 h-5 mr-2 text-purple-500" /> Image Tools
                                    </h3>
                                    <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-full bg-gray-100"><X className="w-4 h-4" /></button>
                                </div>

                                {imageCategories.map((category, catIdx) => (
                                    <div key={catIdx} className="space-y-3 pb-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 pt-2">{category.title}</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {category.tools.map((tool, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={tool.path}
                                                    onClick={() => setMobileDrawerOpen(false)}
                                                    className="flex flex-col p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-purple-100 hover:shadow-md transition-all active:scale-[0.98]"
                                                >
                                                    <div className="p-2 rounded-lg bg-purple-50 w-fit mb-2">
                                                        <tool.icon className="w-5 h-5 text-purple-500" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-800 line-clamp-1">{tool.name}</span>
                                                    <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{tool.desc}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="h-12" /> {/* Extra spacing at bottom */}
                            </div>
                        )}

                        {/* View: Menu */}
                        {mobileView === 'profile' && (
                            <div className="space-y-2 pb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account & Settings</h3>
                                <Link to="/profile" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">D</div>
                                        <div>
                                            <p className="font-bold text-gray-900">Demo User</p>
                                            <p className="text-xs text-gray-500">Free Plan</p>
                                        </div>
                                    </div>
                                </Link>
                                <button className="w-full flex items-center p-4 text-gray-700 hover:bg-gray-50 rounded-xl font-medium border border-gray-100 bg-white mb-2">
                                    <Settings className="w-5 h-5 mr-3 text-gray-400" /> Settings
                                </button>
                                <button className="w-full flex items-center p-4 text-red-600 hover:bg-red-50 rounded-xl font-medium border border-red-100 bg-white">
                                    <LogOut className="w-5 h-5 mr-3" /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;

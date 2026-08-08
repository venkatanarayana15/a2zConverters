import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, FileText, Image as ImageIcon, Sparkles, ChevronDown, User, LogOut, Settings,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { pdfTools, imageTools } from '../lib/constants';
import ToolsMegaMenu from './ToolsMegaMenu';
import SettingsModal from './SettingsModal';

const menuVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

const allTools = [...pdfTools, ...imageTools];

const pdfPaths = new Set(pdfTools.map((t) => t.path));
const imagePaths = new Set(imageTools.map((t) => t.path));

const navLinks = [
    { name: 'Home', path: '/' },
    {
        name: 'PDF Tools',
        path: '/pdf-tools',
        icon: <FileText className="w-4 h-4 mr-2" />,
        isMegaMenu: true,
        dropdown: pdfTools
    },
    {
        name: 'Image Tools',
        path: '/image-tools',
        icon: <ImageIcon className="w-4 h-4 mr-2" />,
        isMegaMenu: true,
        dropdown: imageTools
    },
    { name: 'Pricing', path: '/pricing' },
];

const NavLinks = ({ activeMenu, onMenuChange, pathname }) => {
    const [hoveredLink, setHoveredLink] = useState(null);

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setHoveredLink(null);
    }

    const isActive = (path) => {
        if (pathname === path) return true;
        if (path === '/pdf-tools') return pdfPaths.has(pathname);
        if (path === '/image-tools') return imagePaths.has(pathname);
        return false;
    };

    return (
        <div className="hidden md:flex items-center space-x-1" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => {
                const isMenuOpen = (link.name === 'PDF Tools' && activeMenu === 'pdf') || (link.name === 'Image Tools' && activeMenu === 'image');
                const isActiveLink = isActive(link.path);
                const isHovered = hoveredLink === link.name;
                return (
                <Link
                    key={link.name}
                    to={link.path}
                    className="relative group px-1"
                    onMouseEnter={() => {
                        setHoveredLink(link.name);
                        if (link.name === 'PDF Tools') onMenuChange('pdf');
                        else if (link.name === 'Image Tools') onMenuChange('image');
                        else onMenuChange(null);
                    }}
                >
                    <span
                        className={cn(
                            "px-3 py-2 text-sm font-medium transition-all duration-150 flex items-center outline-none cursor-pointer",
                            ((hoveredLink === link.name) || (activeMenu === 'pdf' && link.name === 'PDF Tools') || (activeMenu === 'image' && link.name === 'Image Tools') || (!hoveredLink && !activeMenu && isActiveLink))
                                ? "text-primary bg-linear-to-b from-primary/5 to-primary/10 border-b-2 border-primary shadow-[0_4px_15px_-3px_rgba(59,130,246,0.4)] rounded-t-lg"
                                : "text-gray-600 hover:text-primary hover:border-primary hover:rounded-t-lg rounded-lg border-b-2 border-transparent dark:text-slate-400",
                            isMenuOpen
                                ? "dark:bg-none dark:bg-primary/10 dark:rounded-lg dark:border-transparent dark:shadow-none dark:text-primary"
                                : (isHovered || (!hoveredLink && !activeMenu && isActiveLink))
                                    ? "dark:bg-none dark:bg-primary/10 dark:rounded-lg dark:border-transparent dark:shadow-none dark:text-primary"
                                    : "dark:border-transparent"
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
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden p-1.5 ring-1 ring-black/5">
                                {link.dropdown.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={cn("flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/5 transition-all group/item dark:text-slate-400 dark:hover:text-primary dark:hover:bg-primary/10")}
                                    >
                                        <div className={cn("w-7 h-7 rounded-md bg-gray-50 text-gray-400 flex items-center justify-center mr-3 group-hover/item:bg-white group-hover/item:text-primary group-hover/item:shadow-sm transition-all dark:bg-slate-800 dark:group-hover/item:bg-slate-700")}>
                                            <Sparkles className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </Link>
                );
            })}
        </div>
    );
};

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    // Settings
    const [showSettings, setShowSettings] = useState(false);

    const profileRef = useRef(null);
    const searchRef = useRef(null);

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
    const [prevPathname, setPrevPathname] = useState(location.pathname);
    if (location.pathname !== prevPathname) {
        setPrevPathname(location.pathname);
        setActiveMenu(null);
        setShowResults(false);
        setShowProfile(false);
    }

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cmd/Ctrl+K to focus search, Esc to close results
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
                setShowResults(true);
            }
            if (e.key === 'Escape') {
                setShowResults(false);
                searchRef.current?.blur();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // PDF Categories with Icons
    // (pdfCategories/imageCategories/allTools live at module scope)

    const filteredTools = useMemo(() => allTools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]);

    const handleSearchSelect = (path) => {
        navigate(path);
        setSearchQuery('');
        setShowResults(false);
    };

    const handleMegaMenuClose = useCallback(() => setActiveMenu(null), []);

    return (
        <>
            <nav
                className={cn(
                    "font-sans fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
                    scrolled || activeMenu
                        ? "bg-white/95 backdrop-blur-md border-gray-200/50 shadow-sm dark:bg-slate-900/95 dark:border-slate-700/50"
                        : "bg-transparent border-transparent"
                )}
                onMouseLeave={() => { setActiveMenu(null); }}
            >
                <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

                        {/* Left: Logo */}
                        <Link to="/" className="flex items-center space-x-2.5 group select-none z-50 shrink-0">
                            <div className="relative w-9 h-9">
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
                                <span className="text-lg font-bold font-serif text-gray-900 dark:text-slate-100">
                                a2zconverters
                            </span>
                        </Link>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 z-50 flex-1 justify-end md:justify-end">

                            {/* Desktop Navigation */}
                            <NavLinks activeMenu={activeMenu} onMenuChange={setActiveMenu} pathname={location.pathname} />

                            {/* Search Bar - Visible on Mobile & Desktop */}
                            <div className="relative group flex-1 md:max-w-64 max-w-[200px] md:flex-none">
                                <div className={cn("flex items-center bg-gray-100/50 border border-gray-200 rounded-full px-3 py-1.5 transition-all w-full search-focus dark:bg-slate-800/50 dark:border-slate-700")}>
                                    <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0 dark:text-slate-400" />
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder="Search..."
                                        className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder:text-gray-400 min-w-0 dark:text-slate-200 dark:placeholder:text-slate-500"
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
                                <AnimatePresence>
                                {showResults && searchQuery && (
                                    <motion.div
                                        variants={menuVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute top-full right-0 w-full md:w-72 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-[60]"
                                    >
                                        <div className="py-2 max-h-80 overflow-y-auto">
                                            {filteredTools.length > 0 ? (
                                                filteredTools.map((tool, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSearchSelect(tool.path)}
                                                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-primary/10 text-sm text-gray-700 dark:text-slate-300 group flex items-center transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0"
                                                    >
                                                        <Search className="w-3.5 h-3.5 mr-3 text-gray-400 dark:text-slate-400" />
                                                        <span className="font-medium line-clamp-1 dark:group-hover:text-primary">{tool.name}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-4 text-center text-gray-500 dark:text-slate-400 text-xs">No tools found.</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                            <div className="relative hidden md:block" ref={profileRef}>
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center transition-all shadow-sm group dark:bg-slate-800 dark:hover:bg-primary/10 dark:border-slate-700"
                                >
                                    <User className="w-4 h-4 text-gray-600 dark:text-slate-400 dark:group-hover:text-primary" />
                                </button>
                                {showProfile && (
                                    <motion.div
                                        variants={menuVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50"
                                    >
                                        <div className="p-4 border-b border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                                            <p className="font-bold text-gray-900 dark:text-slate-100 text-sm">Demo User</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">user@example.com</p>
                                        </div>
                                        <div className="p-1">
                                            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-primary/10 rounded-lg transition-colors" onClick={() => setShowSettings(true)}>
                                                <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                                            </button>
                                            <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mega Menu Overlay (Desktop Only) */}
                <AnimatePresence>
                {(activeMenu === 'pdf' || activeMenu === 'image') && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-full left-0 w-full z-40 hidden md:block"
                        onMouseEnter={() => setActiveMenu(activeMenu)}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <ToolsMegaMenu
                            activeSection={activeMenu}
                            onClose={handleMegaMenuClose}
                        />
                    </motion.div>
                )}
                </AnimatePresence>
            </nav>

            {/* Backdrop overlay when mega menu is open */}
            <AnimatePresence>
            {activeMenu && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 bg-black/10 z-30 hidden md:block"
                    onMouseEnter={() => setActiveMenu(null)}
                />
            )}
            </AnimatePresence>

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </>
    );
};

export default Navbar;

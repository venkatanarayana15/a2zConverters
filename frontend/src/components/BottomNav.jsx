import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Image as ImageIcon, Sparkles, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { pdfTools, imageTools } from '../lib/constants';

const BottomNav = () => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(null); // 'pdf' | 'img' | null
    const [showAllTools, setShowAllTools] = useState(false);

    const isActive = (path) => location.pathname === path;
    const isMenuOpen = (menu) => activeMenu === menu;

    const toggleMenu = (menu) => {
        if (activeMenu === menu) {
            setActiveMenu(null);
            setShowAllTools(false);
        } else {
            setActiveMenu(menu);
            setShowAllTools(false);
        }
    };

    const closeMenu = () => {
        setActiveMenu(null);
        setShowAllTools(false);
    };

    const navItems = [
        { name: 'Home', path: '/', icon: Home, type: 'link' },
        { name: 'PDF Tools', icon: FileText, type: 'menu', menuId: 'pdf', tools: pdfTools },
        { name: 'Image Tools', icon: ImageIcon, type: 'menu', menuId: 'img', tools: imageTools },
        { name: 'Pricing', path: '/pricing', icon: Sparkles, type: 'link' },
    ];

    return (
        <>
            {/* Backdrop for Drawers */}
            <AnimatePresence>
                {activeMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMenu}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Tool Drawers */}
            <AnimatePresence>
                {activeMenu && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] z-50 md:hidden max-h-[75vh] flex flex-col pb-24"
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">
                                {activeMenu === 'pdf' ? 'PDF Tools' : 'Image Tools'}
                            </h3>
                            <button
                                onClick={closeMenu}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-4 flex-1">
                            <div className="grid grid-cols-2 gap-3">
                                {(activeMenu === 'pdf' ? pdfTools : imageTools)
                                    .slice(0, showAllTools ? undefined : 6)
                                    .map((tool, idx) => {
                                        const Icon = tool.icon || FileText;
                                        return (
                                            <Link
                                                key={idx}
                                                to={tool.path}
                                                onClick={closeMenu}
                                                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-xs font-medium text-center text-gray-700 group-hover:text-primary leading-tight">
                                                    {tool.name}
                                                </span>
                                            </Link>
                                        );
                                    })}

                                {!showAllTools && (activeMenu === 'pdf' ? pdfTools : imageTools).length > 6 && (
                                    <button
                                        onClick={() => setShowAllTools(true)}
                                        className="col-span-2 flex flex-col items-center justify-center p-3 rounded-xl bg-linear-to-r from-primary/5 to-blue-50 hover:from-primary/10 hover:to-blue-100 border border-primary/10 transition-all group"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-semibold text-primary">View All Tools</span>
                                            <ChevronDown className="w-4 h-4 text-primary group-hover:translate-y-0.5 transition-transform" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Bar */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-lg shadow-gray-200/50 rounded-2xl px-2 py-2 flex items-center justify-around">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActiveItem = item.type === 'link'
                            ? isActive(item.path) || (item.path !== '/' && location.pathname.startsWith(item.path))
                            : isMenuOpen(item.menuId);

                        if (item.type === 'menu') {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => toggleMenu(item.menuId)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-16 outline-none",
                                        isActiveItem
                                            ? "text-primary"
                                            : "text-gray-500 hover:text-gray-900"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all",
                                        isActiveItem ? "bg-primary/10" : "bg-transparent h-6 w-auto mb-0.5"
                                    )}>
                                        <Icon className={cn(
                                            "transition-all",
                                            isActiveItem ? "w-5 h-5 fill-primary/20" : "w-6 h-6"
                                        )} />
                                    </div>
                                    <span className="text-[10px] font-medium leading-none whitespace-nowrap">{item.name}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={closeMenu}
                                className={cn(
                                    "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-16 outline-none",
                                    isActiveItem
                                        ? "text-primary"
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all",
                                    isActiveItem ? "bg-primary/10" : "bg-transparent h-6 w-auto mb-0.5"
                                )}>
                                    <Icon className={cn(
                                        "transition-all",
                                        isActiveItem ? "w-5 h-5 fill-primary/20" : "w-6 h-6"
                                    )} />
                                </div>
                                <span className="text-[10px] font-medium leading-none whitespace-nowrap">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default BottomNav;

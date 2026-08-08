import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Image as ImageIcon, Sparkles, X, ChevronDown, ChevronUp, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { builtPdfTools, builtImageTools } from '../lib/constants';
import SettingsModal from './SettingsModal';

const BottomNav = () => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(null); // 'pdf' | 'img' | null
    const [showAllTools, setShowAllTools] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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
        { name: 'PDF Tools', icon: FileText, type: 'menu', menuId: 'pdf', tools: builtPdfTools },
        { name: 'Image Tools', icon: ImageIcon, type: 'menu', menuId: 'img', tools: builtImageTools },
        { name: 'Pricing', path: '/pricing', icon: Sparkles, type: 'link' },
        { name: 'Profile', icon: User, type: 'menu', menuId: 'profile' },
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
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] z-50 md:hidden max-h-[75vh] flex flex-col pb-24 dark:bg-slate-900 dark:shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.7)]"
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                {activeMenu === 'pdf' || activeMenu === 'img' ? (
                                    <div className={cn(
                                        "w-9 h-9 rounded-lg flex items-center justify-center",
                                        activeMenu === 'pdf' ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                                    )}>
                                        {activeMenu === 'pdf' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight dark:text-slate-100">
                                        {activeMenu === 'pdf' ? 'PDF Tools' : activeMenu === 'img' ? 'Image Tools' : 'Account'}
                                    </h3>
                                    {activeMenu === 'pdf' || activeMenu === 'img' ? (
                                        <p className="text-xs text-gray-500 dark:text-slate-400">
                                            {(activeMenu === 'pdf' ? builtPdfTools : builtImageTools).length} tools available
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                            <button
                                onClick={closeMenu}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors dark:bg-slate-800"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-slate-300" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-4 flex-1">
                            {activeMenu === 'profile' ? (
                                <div className="space-y-2">
                                    <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">D</div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-slate-100">Demo User</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">Free Plan</p>
                                        </div>
                                    </Link>
                                    <button onClick={() => { setShowSettings(true); closeMenu(); }} className="w-full flex items-center p-4 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-primary/10 rounded-xl font-medium border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <Settings className="w-5 h-5 mr-3 text-gray-400 dark:text-slate-300" /> Settings
                                    </button>
                                    <button className="w-full flex items-center p-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium border border-red-100 dark:border-red-900/30 bg-white dark:bg-slate-900">
                                        <LogOut className="w-5 h-5 mr-3" /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {(activeMenu === 'pdf' ? builtPdfTools : builtImageTools)
                                        .slice(0, showAllTools ? undefined : 6)
                                        .map((tool, idx) => {
                                            const Icon = tool.icon || FileText;
                                            return (
                                                <Link
                                                    key={idx}
                                                    to={tool.path}
                                                    onClick={closeMenu}
                                                    className="p-3 bg-gray-50 rounded-xl hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group dark:bg-slate-800 dark:hover:bg-primary/10"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform dark:bg-slate-700 dark:shadow-black/30">
                                                            <Icon className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-700 group-hover:text-primary leading-tight line-clamp-1 dark:text-slate-300">
                                                            {tool.name}
                                                        </span>
                                                    </div>
                                                </Link>
                                            );
                                        })}

                                    {(activeMenu === 'pdf' ? builtPdfTools : builtImageTools).length > 6 && (
                                        <button
                                            onClick={() => setShowAllTools(!showAllTools)}
                                            className="col-span-2 flex flex-col items-center justify-center p-3 rounded-xl bg-linear-to-r from-primary/5 to-blue-50 hover:from-primary/10 hover:to-blue-100 border border-primary/10 transition-all group dark:from-primary/10 dark:to-blue-900/30 dark:hover:from-primary/20 dark:hover:to-blue-900/50"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-semibold text-primary">{showAllTools ? 'View Less' : 'View All Tools'}</span>
                                                {showAllTools
                                                    ? <ChevronUp className="w-4 h-4 text-primary group-hover:-translate-y-0.5 transition-transform" />
                                                    : <ChevronDown className="w-4 h-4 text-primary group-hover:translate-y-0.5 transition-transform" />}
                                            </div>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Bar */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-lg shadow-gray-200/50 rounded-2xl px-2 py-2 flex items-center justify-around dark:bg-slate-900/90 dark:border-slate-700/40 dark:shadow-slate-900/50">
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
                                        "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 flex-1 min-w-0 outline-none",
                                        isActiveItem
                                            ? "text-primary"
                                            : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
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
                                    "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 flex-1 min-w-0 outline-none",
                                    isActiveItem
                                        ? "text-primary"
                                        : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
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
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </>
    );
};

export default BottomNav;

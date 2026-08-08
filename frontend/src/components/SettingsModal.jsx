import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Palette, Sliders, HardDrive, Globe, Info, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import AccountSettings from './settings/AccountSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import ExportSettings from './settings/ExportSettings';
import StorageSettings from './settings/StorageSettings';
import LanguageSettings from './settings/LanguageSettings';
import AboutSettings from './settings/AboutSettings';

const STORAGE_KEY = 'a2z_settings';

const defaultSettings = {
    displayName: 'Demo User',
    email: 'user@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    darkMode: false,
    accentColor: 'blue',
    imageQuality: 90,
    defaultFormat: 'image/jpeg',
    pdfCompression: 'medium',
    language: 'en',
    unit: 'px',
    dateFormat: 'DD/MM/YYYY',
    autoDelete: false,
    autoDeleteHours: 24,
};

const sections = [
    { id: 'account', label: 'Account Settings', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'export', label: 'Default Export', icon: Sliders },
    { id: 'storage', label: 'Storage & Cache', icon: HardDrive },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'about', label: 'About & Support', icon: Info },
];

const SettingsModal = ({ isOpen, onClose }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [activeSection, setActiveSection] = useState('account');
    const [localFields, setLocalFields] = useState({ displayName: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });

    const [prevOpen, setPrevOpen] = useState(isOpen);
    if (isOpen !== prevOpen) {
        setPrevOpen(isOpen);
        if (isOpen) {
            setActiveSection('account');
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setSettings(prev => ({ ...prev, ...parsed, currentPassword: '', newPassword: '', confirmPassword: '' }));
                    setLocalFields({ displayName: parsed.displayName || defaultSettings.displayName, email: parsed.email || defaultSettings.email, currentPassword: '', newPassword: '', confirmPassword: '' });
                } else {
                    setLocalFields({ displayName: defaultSettings.displayName, email: defaultSettings.email, currentPassword: '', newPassword: '', confirmPassword: '' });
                }
            } catch { /* ignore */ }
        }
    }

    useLayoutEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const saveSettings = useCallback((updated) => {
        setSettings(prev => {
            const next = { ...prev, ...updated };
            const toStore = { ...next };
            delete toStore.currentPassword;
            delete toStore.newPassword;
            delete toStore.confirmPassword;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
            return next;
        });
    }, []);

    const handleChange = useCallback((key, value) => {
        saveSettings({ [key]: value });
        if (key === 'darkMode') {
            const flip = () => document.documentElement.classList.toggle('dark', value);
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (document.startViewTransition && !reduceMotion) {
                document.startViewTransition(flip);
            } else {
                flip();
            }
        }
    }, [saveSettings]);

    const handleLocalChange = useCallback((key, value) => {
        setLocalFields(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleBlur = useCallback((key) => {
        saveSettings({ [key]: localFields[key] });
    }, [saveSettings, localFields]);

    const sectionRender = useMemo(() => {
        switch (activeSection) {
            case 'account': return <AccountSettings localFields={localFields} onLocalChange={handleLocalChange} onBlur={handleBlur} />;
            case 'appearance': return <AppearanceSettings darkMode={settings.darkMode} accentColor={settings.accentColor} onChange={handleChange} />;
            case 'export': return <ExportSettings imageQuality={settings.imageQuality} defaultFormat={settings.defaultFormat} pdfCompression={settings.pdfCompression} onChange={handleChange} />;
            case 'storage': return <StorageSettings autoDelete={settings.autoDelete} autoDeleteHours={settings.autoDeleteHours} onChange={handleChange} />;
            case 'language': return <LanguageSettings language={settings.language} unit={settings.unit} dateFormat={settings.dateFormat} onChange={handleChange} />;
            case 'about': return <AboutSettings onClose={onClose} />;
            default: return null;
        }
    }, [activeSection, settings.darkMode, settings.accentColor, settings.imageQuality, settings.defaultFormat, settings.pdfCompression, settings.autoDelete, settings.autoDeleteHours, settings.language, settings.unit, settings.dateFormat, localFields, handleChange, handleLocalChange, handleBlur, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
                        onClick={onClose}
                    />

                    {/* Desktop Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="hidden md:flex relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-black/50 w-full md:w-[min(672px,92vw)] h-[min(540px,85vh)] overflow-hidden border border-white/50 dark:border-slate-700/50 ring-1 ring-black/5 z-10 flex-col"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Settings</h2>
                            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-primary/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                            </button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            <div className="w-52 shrink-0 border-r border-gray-100 dark:border-slate-700 p-3 space-y-0.5 overflow-y-auto">
                                {sections.map(s => {
                                    const Icon = s.icon;
                                    return (
                                        <button key={s.id} onClick={() => setActiveSection(s.id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all", activeSection === s.id ? 'bg-blue-50 text-blue-600 dark:bg-primary/20 dark:text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-primary/10 dark:hover:text-primary')}>
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{s.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-5">{sections.find(s => s.id === activeSection)?.label}</h3>
                                <AnimatePresence mode="popLayout">
                                    <motion.div
                                        key={activeSection}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {sectionRender}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile Modal */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="md:hidden fixed inset-x-0 bottom-0 z-10 bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.5)] max-h-[85vh] flex flex-col"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 shrink-0">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Settings</h2>
                            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-primary/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 space-y-6">
                            {sections.map((s, idx) => {
                                const Icon = s.icon;
                                return (
                                    <div key={s.id}>
                                        {idx > 0 && <hr className="border-gray-100 dark:border-slate-700 mb-6" />}
                                        <button onClick={() => setActiveSection(s.id)} className="flex items-center justify-between w-full mb-4 group">
                                            <div className="flex items-center gap-2.5">
                                                <div className={cn("p-2 rounded-xl transition-colors", activeSection === s.id ? 'bg-blue-50 text-blue-600 dark:bg-primary/20 dark:text-primary' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700')}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">{s.label}</h3>
                                            </div>
                                            <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", activeSection === s.id ? 'rotate-90 text-blue-500' : 'text-gray-400 dark:text-slate-400')} />
                                        </button>
                                        <AnimatePresence>
                                            {activeSection === s.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-0 space-y-4">
                                                        {sectionRender}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;

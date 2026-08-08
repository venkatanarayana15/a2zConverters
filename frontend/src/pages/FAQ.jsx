import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, Inbox } from 'lucide-react';
import { cn } from '../lib/utils';
import PageHeader from '../components/PageHeader';
import PageCTA from '../components/PageCTA';

const faqs = [
    {
        id: 'server-upload',
        q: 'Are my files uploaded to a server?',
        a: 'No. All conversion, compression, and editing happens locally in your browser using WebAssembly and canvas APIs. Your files never leave your device.',
        tags: ['privacy', 'upload', 'server', 'local'],
    },
    {
        id: 'free',
        q: 'Is a2zconverters really free?',
        a: 'Yes, all tools are free to use with no limits on file size or the number of conversions.',
        tags: ['free', 'price', 'cost', 'pricing'],
    },
    {
        id: 'formats',
        q: 'Which file formats are supported?',
        a: 'We support the most common formats: PDF, JPG, PNG, WEBP, BMP, GIF, Word, and Excel. More formats are added regularly.',
        tags: ['formats', 'supported', 'pdf', 'jpg', 'png', 'word', 'excel'],
    },
    {
        id: 'slow',
        q: 'Why is my conversion slow?',
        a: 'Slow conversions are usually caused by large files or a slow connection. Processing is done locally, so performance depends mostly on your device.',
        tags: ['slow', 'speed', 'performance', 'large', 'lag'],
    },
    {
        id: 'not-responding',
        q: 'What happens if my tool stops responding?',
        a: 'Try refreshing the page and processing the file again. If the issue persists, let us know through the contact page and we will look into it.',
        tags: ['crash', 'stuck', 'freeze', 'not responding', 'error'],
    },
    {
        id: 'export-rejected',
        q: 'Why is my export rejected by another app?',
        a: 'Rarely, another application may not recognize a file it expects in a specific variant. Try exporting in a different format or re-converting the file.',
        tags: ['export', 'rejected', 'conversion', 'failed', 'compatibility'],
    },
    {
        id: 'report-bug',
        q: 'How do I report a bug or request a feature?',
        a: 'Use the feedback button in the bottom-right corner, or reach us via the contact page. We read every message.',
        tags: ['bug', 'feature', 'request', 'feedback', 'report'],
    },
    {
        id: 'data',
        q: 'Do you keep any of my data?',
        a: "We store only lightweight preferences (like theme and default export settings) in your browser's local storage. There are no accounts and no server-side storage of your files.",
        tags: ['data', 'privacy', 'storage', 'localstorage', 'preferences'],
    },
];

const FaqItem = ({ faq, index, open, onToggle }) => (
    <div className={cn(
        'group rounded-2xl border transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900',
        open
            ? 'border-teal-200 dark:border-teal-800 shadow-lg shadow-teal-500/10 dark:shadow-teal-900/20'
            : 'border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-slate-700'
    )}>
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        >
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-4">
                <span className={cn(
                    'hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-xs font-extrabold border transition-colors shrink-0',
                    open
                        ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white border-transparent'
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-400 border-gray-100 dark:border-slate-700'
                )}>
                    {index + 1}
                </span>
                {faq.q}
            </h3>
            <ChevronDown
                className={cn(
                    'w-5 h-5 text-gray-400 dark:text-slate-400 shrink-0 transition-[transform,color] duration-300',
                    open ? 'rotate-180 text-teal-500' : 'group-hover:text-teal-500'
                )}
            />
        </button>
        <AnimatePresence initial={false}>
            {open && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <p className="px-6 pb-5 sm:pl-18 text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FAQ = () => {
    const { hash } = useLocation();
    const [query, setQuery] = useState('');
    const [openId, setOpenId] = useState(() => {
        if (typeof window === 'undefined') return null;
        return window.location.hash.replace('#', '') || null;
    });

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return faqs;
        return faqs.filter((faq) => {
            const haystack = [faq.q, faq.a, ...faq.tags].join(' ').toLowerCase();
            return haystack.includes(q);
        });
    }, [query]);

    useEffect(() => {
        const onHashChange = () => {
            const target = window.location.hash.replace('#', '');
            if (target) setOpenId(target);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    useEffect(() => {
        const target = hash && hash.replace('#', '');
        if (!target) return;
        const el = document.getElementById(target);
        if (el) {
            const t = setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
            return () => clearTimeout(t);
        }
    }, [hash]);

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
                <PageHeader
                    badge={{ icon: HelpCircle, label: 'Support' }}
                    accent="teal"
                    title={<>Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Questions</span></>}
                    subtitle="Quick answers to the things people ask us most."
                >
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-300" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search questions, keywords…"
                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl pl-12 pr-5 py-4 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 shadow-sm dark:shadow-black/20 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all"
                        />
                    </div>
                    </PageHeader>
                <div className="max-w-3xl mx-auto">

                    {filtered.length > 0 ? (
                        <div className="space-y-3.5 mb-12">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((faq, i) => (
                                    <motion.div
                                        key={faq.id}
                                        layout
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.25 }}
                                        id={faq.id}
                                        className="scroll-mt-28"
                                    >
                                        <FaqItem
                                            faq={faq}
                                            index={i}
                                            open={openId === faq.id}
                                            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 p-10 text-center mb-12"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-400 flex items-center justify-center mx-auto mb-4">
                                <Inbox className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">No questions found</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm mb-5">
                                We couldn't find anything matching "{query}".
                            </p>
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:shadow-lg dark:bg-none dark:bg-primary dark:text-white transition-all"
                            >
                                Clear search
                            </button>
                        </motion.div>
                    )}

                    <PageCTA
                        title="Can't find what you're looking for?"
                        subtitle="Our team is happy to help — send us a message and we'll get back to you."
                        primary={{ to: '/contact', label: 'Contact Support', className: 'dark:bg-none dark:bg-primary dark:text-white' }}
                        secondary={{ to: '/help', label: 'Visit Help Center' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FAQ;

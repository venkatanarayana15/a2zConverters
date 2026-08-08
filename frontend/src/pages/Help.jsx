import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, FileQuestion, Wrench, ShieldCheck, Search, TrendingUp, MessageCircleQuestion, Inbox } from 'lucide-react';
import { cn } from '../lib/utils';
import PageHeader from '../components/PageHeader';
import PageCTA from '../components/PageCTA';

const categories = [
    {
        icon: LifeBuoy,
        gradient: 'from-teal-500 to-cyan-500',
        tile: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
        title: 'Getting Started',
        desc: 'New here? Learn how conversion works and what happens to your files.',
        links: [
            { label: 'How processing works', to: '/faq#server-upload' },
            { label: 'Supported formats', to: '/faq#formats' },
        ],
        keywords: ['start', 'beginner', 'begin', 'processing', 'formats', 'works'],
    },
    {
        icon: FileQuestion,
        gradient: 'from-blue-500 to-cyan-500',
        tile: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        title: 'File Conversion',
        desc: 'Tips for PDF, image, and document conversions gone wrong.',
        links: [
            { label: 'PDF conversion tips', to: '/faq#export-rejected' },
            { label: 'Image quality settings', to: '/faq#formats' },
        ],
        keywords: ['convert', 'conversion', 'pdf', 'image', 'quality', 'export'],
    },
    {
        icon: Wrench,
        gradient: 'from-amber-500 to-orange-500',
        tile: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
        title: 'Troubleshooting',
        desc: 'Fix common problems like slow tools, stuck uploads, or failed exports.',
        links: [
            { label: 'Tool not responding', to: '/faq#not-responding' },
            { label: 'Export failed', to: '/faq#export-rejected' },
        ],
        keywords: ['slow', 'stuck', 'failed', 'error', 'issue', 'problem', 'not responding', 'bug', 'report', 'crash'],
    },
    {
        icon: ShieldCheck,
        gradient: 'from-emerald-500 to-teal-500',
        tile: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        title: 'Privacy & Security',
        desc: 'Understand how we keep your files safe and private.',
        links: [
            { label: 'Local processing', to: '/faq#server-upload' },
            { label: 'Data policy', to: '/privacy' },
        ],
        keywords: ['privacy', 'secure', 'security', 'data', 'local', 'server', 'private'],
    },
];

const popularTopics = ['File conversions', 'Local processing', 'Supported formats', 'Slow conversions', 'Report a bug'];

const Help = () => {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter((category) => {
            const haystack = [category.title, category.desc, ...category.keywords, ...category.links.map((l) => l.label)].join(' ').toLowerCase();
            return haystack.includes(q);
        });
    }, [query]);

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
                <PageHeader
                    badge={{ icon: LifeBuoy, label: 'Support' }}
                    accent="teal"
                    title={<>Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Center</span></>}
                    subtitle="Guides and answers to the most common questions."
                >
                    {/* Search */}
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-300" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search help articles, topics, keywords…"
                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl pl-12 pr-5 py-4 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 shadow-sm dark:shadow-black/20 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all"
                        />
                    </div>

                        {/* Popular topics */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
                                <TrendingUp className="w-3.5 h-3.5" /> Popular:
                            </span>
                            {popularTopics.map((topic) => (
                                <button
                                    key={topic}
                                    type="button"
                                    onClick={() => setQuery(topic)}
                                    className={cn(
                                        'px-3 py-1 rounded-full text-xs font-semibold border transition-all',
                                        query === topic
                                            ? 'bg-teal-600 text-white border-teal-600'
                                            : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400'
                                    )}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </PageHeader>
                <div className="max-w-5xl mx-auto">

                    {/* Results */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((category) => (
                                    <motion.div
                                        key={category.title}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{ duration: 0.3 }}
                                        className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 hover:shadow-xl hover:shadow-teal-500/5 dark:hover:shadow-teal-900/10 hover:-translate-y-1 hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-300"
                                    >
                                        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 text-white shadow-lg shadow-black/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300', category.gradient)}>
                                            <category.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">{category.title}</h3>
                                        <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{category.desc}</p>
                                        <ul className="space-y-1.5 text-sm">
                                            {category.links.map((link) => (
                                                <li key={link.label}>
                                                    <Link to={link.to} className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline underline-offset-4">
                                                        <MessageCircleQuestion className="w-4 h-4 shrink-0" />
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
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
                            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">No results for "{query}"</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm mb-5">
                                Try a different keyword, or browse the FAQ directly.
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
                        title="Still stuck?"
                        subtitle="Browse the FAQ or get in touch — we usually reply within 24 hours."
                        primary={{ to: '/contact', label: 'Contact Support', className: 'dark:bg-none dark:bg-primary dark:text-white' }}
                        secondary={{ to: '/faq', label: 'View FAQ' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Help;

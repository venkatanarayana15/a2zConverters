import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Files, Image as ImageIcon, Search, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { builtPdfTools, builtImageTools } from '../lib/constants';
import { hueThemes, toolHues } from '../lib/toolStyles';
import PageHeader from '../components/PageHeader';
import PageCTA from '../components/PageCTA';

const ToolsIndex = ({ type = 'pdf' }) => {
    const [query, setQuery] = useState('');

    const isPdf = type === 'pdf';
    const tools = isPdf ? builtPdfTools : builtImageTools;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return tools;
        return tools.filter(
            (t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
        );
    }, [query, tools]);

    const badge = isPdf
        ? { icon: Files, label: 'PDF Tools' }
        : { icon: ImageIcon, label: 'Image Tools' };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background text-foreground">
            <div className="max-w-[96rem] mx-auto px-2 md:px-4">
                <PageHeader
                    badge={badge}
                    title={isPdf ? 'All PDF Tools' : 'All Image Tools'}
                    subtitle={
                        isPdf
                            ? 'Organize, optimize, convert and secure your PDF documents — all in your browser, no sign-up needed.'
                            : 'Resize, edit, convert and clean up your images — right in the browser, no sign-up needed.'
                    }
                    accent={isPdf ? 'blue' : 'purple'}
                >
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-300" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={isPdf ? 'Search PDF tools…' : 'Search image tools…'}
                            className="input-base pl-12!"
                        />
                    </div>
                </PageHeader>

                <div className="mb-6 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">
                        {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'} available
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-slate-700/50">
                        <p className="text-gray-500 dark:text-slate-400">No tools match "{query}".</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filtered.map((tool, idx) => {
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
                                            'group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full dark:shadow-lg dark:shadow-black/10',
                                            theme.color,
                                            theme.glow
                                        )}
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 dark:group-hover:opacity-100 transition-opacity" />

                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={cn('p-3 shrink-0 rounded-xl shadow-sm dark:shadow-black/30 ring-1 ring-black/5 dark:ring-slate-700 group-hover:scale-110 transition-transform duration-300', theme.tile)}>
                                                {Icon && <Icon className={cn('w-6 h-6', theme.iconColor)} />}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                                                {tool.name}
                                            </h3>
                                        </div>

                                        <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow">
                                            {tool.desc}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="relative">
                                                <span className={cn('block text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r transition-opacity duration-300 dark:group-hover:opacity-0', theme.grad)}>
                                                    Try Now
                                                </span>
                                                <span aria-hidden="true" className={cn('absolute inset-0 text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r transition-opacity duration-300 opacity-0 dark:group-hover:opacity-100', theme.gradHover)}>
                                                    Try Now
                                                </span>
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <PageCTA
                title={isPdf ? 'Need more than PDF tools?' : 'Looking for PDF tools too?'}
                subtitle={
                    isPdf
                        ? 'Explore our image tools — resizing, editing, converting and more.'
                        : 'We also have a full suite of PDF tools — merge, split, compress and secure.'
                }
                primary={{ label: isPdf ? 'View Image Tools' : 'View PDF Tools', to: isPdf ? '/image-tools' : '/pdf-tools' }}
                secondary={{ label: 'All tools on one page', to: '/' }}
            />
        </div>
    );
};

export default ToolsIndex;

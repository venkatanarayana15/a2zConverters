import React from 'react';
import { History, Sparkles, Wrench, ShieldCheck, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import PageCTA from '../components/PageCTA';
import { cn } from '../lib/utils';

const typeStyles = {
    feature: { icon: Sparkles, label: 'New feature', cls: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
    improvement: { icon: Wrench, label: 'Improvement', cls: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400' },
    security: { icon: ShieldCheck, label: 'Security', cls: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
    launch: { icon: Rocket, label: 'Launch', cls: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
};

const releases = [
    {
        version: 'v2.1.0',
        date: 'August 3, 2026',
        highlights: 'Brand-new home page, redesigned help & legal pages.',
        items: [
            { type: 'feature', text: 'All-new Security page and System Status page.' },
            { type: 'improvement', text: 'Redesigned Help Center, FAQ, About and Contact pages.' },
            { type: 'feature', text: 'Added dedicated PDF and Image tools index pages.' },
            { type: 'improvement', text: 'Navbar search now opens with ⌘K and shows "view all" links.' },
        ],
    },
    {
        version: 'v2.0.0',
        date: 'June 12, 2026',
        highlights: 'Complete visual redesign across tools.',
        items: [
            { type: 'feature', text: 'Unified design language: glass cards, gradient accents, dark mode polish.' },
            { type: 'improvement', text: 'Smoother drag-and-drop uploads with clearer states.' },
            { type: 'improvement', text: 'Faster page loads with lazy-loaded tool libraries.' },
        ],
    },
    {
        version: 'v1.8.0',
        date: 'April 20, 2026',
        highlights: 'Expanded the image toolkit.',
        items: [
            { type: 'feature', text: 'Government Exam Photo Resizer with SSC/UPSC/IBPS presets.' },
            { type: 'feature', text: 'Background Remover and advanced Image Converter.' },
        ],
    },
    {
        version: 'v1.5.0',
        date: 'February 2, 2026',
        highlights: 'More PDF tools, all free.',
        items: [
            { type: 'feature', text: 'Added eSign, Watermark, Compare and Translate PDF.' },
            { type: 'improvement', text: 'Compression engine tuned for smaller output files.' },
        ],
    },
    {
        version: 'v1.0.0',
        date: 'December 1, 2025',
        highlights: 'First public release.',
        items: [
            { type: 'launch', text: 'Core PDF suite: merge, split, compress, convert and protect.' },
            { type: 'feature', text: '100% client-side processing — your files never leave your device.' },
        ],
    },
];

const Changelog = () => (
    <div className="min-h-screen pt-24 pb-12 bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-2 md:px-4">
            <PageHeader
                badge={{ icon: History, label: 'Changelog' }}
                title="What's New"
                subtitle="Every update, improvement, and fix — all free, all in your browser."
                accent="teal"
            />

            <div className="space-y-6">
                {releases.map((release, rIdx) => (
                    <motion.div
                        key={release.version}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.4, delay: rIdx * 0.05 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 p-6 md:p-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                                {release.version}
                            </h3>
                            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{release.date}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{release.highlights}</p>

                        <ul className="space-y-2.5">
                            {release.items.map((item, i) => {
                                const s = typeStyles[item.type] || typeStyles.improvement;
                                return (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className={cn('w-7 h-7 shrink-0 rounded-lg flex items-center justify-center mt-0.5', s.cls)}>
                                            <s.icon className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="text-sm text-gray-700 dark:text-slate-300">{item.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto px-2 md:px-4 mt-12">
            <PageCTA
                title="Want a feature we don't have?"
                subtitle="We read every message — tell us what would make a2zconverters better for you."
                primary={{ label: 'Request a Feature', to: '/contact' }}
                secondary={{ label: 'See all tools', to: '/pdf-tools' }}
            />
        </div>
    </div>
);

export default Changelog;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Files, Image as ImageIcon, RefreshCw, ShieldCheck, Lock, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import PageHeader from '../components/PageHeader';
import PageCTA from '../components/PageCTA';
import { pdfTools, imageTools } from '../lib/constants';

const categories = [
    { icon: Files, title: 'PDF Tools', desc: 'Merge, split, compress, convert and secure your PDF documents with a full suite of tools.', to: '/#tools', gradient: 'from-teal-500 to-cyan-500', tile: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
    { icon: ImageIcon, title: 'Image Tools', desc: 'Resize, edit, convert and enhance images in any format — all without leaving your browser.', to: '/#tools', gradient: 'from-blue-500 to-cyan-500', tile: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { icon: RefreshCw, title: 'Universal Converter', desc: 'Convert between dozens of formats: PDF, Word, Excel, JPG, PNG, WEBP and more.', to: '/#tools', gradient: 'from-purple-500 to-pink-500', tile: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
    { icon: ShieldCheck, title: 'Secure Processing', desc: 'All files are processed locally on your device. Nothing is uploaded to any server.', to: '/#tools', gradient: 'from-emerald-500 to-teal-500', tile: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
];

const highlights = [
    { icon: Lock, title: 'Privacy First', desc: "We don't store your data. What happens on your device, stays completely private.", tile: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
    { icon: ShieldCheck, title: '100% Secure', desc: 'Your files never leave your device. All processing is done locally via WebAssembly.', tile: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Processing happens instantly in your browser. No queue, no waiting, just results.', tile: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
];

const featuredTools = [...pdfTools.slice(0, 6), ...imageTools.slice(0, 4)];

const FeaturesPage = () => (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
            <PageHeader
                badge={{ icon: Sparkles, label: 'Why a2zconverters' }}
                accent="purple"
                title={<>Everything you need, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-sky-400 dark:to-cyan-500">nothing you don't.</span></>}
                subtitle="A complete suite of file tools built for speed, privacy, and simplicity."
            />
            <div className="max-w-5xl mx-auto">

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {categories.map((category) => (
                        <Link
                            key={category.title}
                            to={category.to}
                            className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-gray-200 dark:hover:border-slate-700 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300', category.tile)}>
                                    <category.icon className="w-6 h-6" />
                                </div>
                                <span className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300', category.gradient)}>
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">{category.title}</h3>
                            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{category.desc}</p>
                            <span className="inline-flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400 mt-4">
                                Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Highlights */}
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 text-center mb-10"
                    >
                        Built Different
                    </motion.h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {highlights.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300', feature.tile)}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Featured tools */}
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 text-center mb-4"
                    >
                        Popular Tools
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-gray-600 dark:text-slate-400 text-center mb-10"
                    >
                        Jump straight into the tools people use most.
                    </motion.p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {featuredTools.map((tool) => (
                            <Link
                                key={tool.path}
                                to={tool.path}
                                className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <tool.icon className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-tight">{tool.name}</div>
                                <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 truncate">{tool.desc}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <PageCTA
                    title="Ready to get started?"
                    subtitle="Try any tool right now — it's free and your files never leave your device."
                    primary={{ to: '/#tools', label: 'Browse All Tools', className: 'dark:bg-none dark:bg-primary dark:text-white' }}
                    secondary={{ to: '/pricing', label: 'View Pricing' }}
                />
            </div>
        </div>
    </div>
);

export default FeaturesPage;

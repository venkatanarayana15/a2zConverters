import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Files, Image as ImageIcon, RefreshCw, ShieldCheck, Lock, Zap } from 'lucide-react';
import Features from '../components/Features';
import BackLink from '../components/BackLink';

const FeaturesPage = () => {
    const categories = [
        { icon: Files, title: 'PDF Tools', desc: 'Merge, split, compress, convert and secure your PDF documents with a full suite of tools.', to: '/#tools' },
        { icon: ImageIcon, title: 'Image Tools', desc: 'Resize, edit, convert and enhance images in any format — all without leaving your browser.', to: '/#tools' },
        { icon: RefreshCw, title: 'Universal Converter', desc: 'Convert between dozens of formats: PDF, Word, Excel, JPG, PNG, WEBP and more.', to: '/#tools' },
        { icon: ShieldCheck, title: 'Secure Processing', desc: 'All files are processed locally on your device. Nothing is uploaded to any server.', to: '/#tools' },
    ];

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-teal-200/20 rounded-full blur-[120px]" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
                <div className="mb-3">
                    <BackLink />
                </div>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 shadow-sm">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Why a2zconverters</span>
                    </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
                        Everything you need, <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">nothing you don't.</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        A complete suite of file tools built for speed, privacy, and simplicity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {categories.map((category) => (
                        <Link
                            key={category.title}
                            to={category.to}
                            className="group bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <category.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{category.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{category.desc}</p>
                            <span className="flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400">
                                Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mb-16">
                    <Features />
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-teal-500" />
                        <Lock className="w-5 h-5 text-teal-500" />
                        <ShieldCheck className="w-5 h-5 text-teal-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ready to get started?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Try any tool right now — it's free and your files never leave your device.
                    </p>
                    <Link
                        to="/#tools"
                        className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                        Browse All Tools <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;

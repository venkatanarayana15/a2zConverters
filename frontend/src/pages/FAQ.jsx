import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import BackLink from '../components/BackLink';

const faqs = [
    {
        q: 'Are my files uploaded to a server?',
        a: 'No. All conversion, compression, and editing happens locally in your browser using WebAssembly and canvas APIs. Your files never leave your device.',
    },
    {
        q: 'Is a2zconverters really free?',
        a: 'Yes, all tools are free to use with no limits on file size or the number of conversions.',
    },
    {
        q: 'Which file formats are supported?',
        a: 'We support the most common formats: PDF, JPG, PNG, WEBP, BMP, GIF, Word, and Excel. More formats are added regularly.',
    },
    {
        q: 'Why is my conversion slow?',
        a: 'Slow conversions are usually caused by large files or a slow connection. Processing is done locally, so performance depends mostly on your device.',
    },
    {
        q: 'What happens if my tool stops responding?',
        a: 'Try refreshing the page and processing the file again. If the issue persists, let us know through the contact page and we will look into it.',
    },
    {
        q: 'Why is my export rejected by another app?',
        a: 'Rarely, another application may not recognize a file it expects in a specific variant. Try exporting in a different format or re-converting the file.',
    },
    {
        q: 'How do I report a bug or request a feature?',
        a: 'Use the feedback button in the bottom-right corner, or reach us via the contact page. We read every message.',
    },
    {
        q: 'Do you keep any of my data?',
        a: 'We store only lightweight preferences (like theme and default export settings) in your browser\'s local storage. There are no accounts and no server-side storage of your files.',
    },
];

const FaqItem = ({ faq }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
            >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                    {faq.q}
                </h3>
                <ChevronDown
                    className={cn(
                        'w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 transition-[transform,color] duration-300 group-hover:text-teal-500',
                        open && 'rotate-180 text-teal-500'
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
                        <p className="px-6 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-teal-200/20 rounded-full blur-[120px]" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
            <div className="mb-3">
                <BackLink />
            </div>
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 shadow-sm">
                    <HelpCircle className="w-4 h-4 text-teal-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Support</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
                    Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Questions</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Quick answers to the things people ask us most.
                </p>
            </div>

            <div className="space-y-4 mb-10">
                {faqs.map((faq) => (
                    <FaqItem key={faq.q} faq={faq} />
                ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Can't find what you're looking for?
                </p>
                <Link
                    to="/contact"
                    className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                    Contact Support
                </Link>
            </div>
        </div>
    </div>
);

export default FAQ;

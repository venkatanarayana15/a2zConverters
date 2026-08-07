import React from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, FileQuestion, Wrench, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import BackLink from '../components/BackLink';

const Help = () => {
    const categories = [
        { icon: LifeBuoy, title: 'Getting Started', desc: 'New here? Learn how conversion works and what happens to your files.', links: ['How processing works', 'Supported formats'] },
        { icon: FileQuestion, title: 'File Conversion', desc: 'Tips for PDF, image, and document conversions gone wrong.', links: ['PDF conversion tips', 'Image quality settings'] },
        { icon: Wrench, title: 'Troubleshooting', desc: 'Fix common problems like slow tools, stuck uploads, or failed exports.', links: ['Tool not responding', 'Export failed'] },
        { icon: ShieldCheck, title: 'Privacy & Security', desc: 'Understand how we keep your files safe and private.', links: ['Local processing', 'Data policy'] },
    ];

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[120px]" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
                <div className="mb-3">
                    <BackLink />
                </div>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 shadow-sm">
                        <LifeBuoy className="w-4 h-4 text-teal-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Support</span>
                    </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
                        Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Center</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        Guides and answers to the most common questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {categories.map((category) => (
                        <div key={category.title} className="bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                                <category.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{category.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{category.desc}</p>
                            <ul className="space-y-2 text-sm">
                                {category.links.map((link) => (
                                    <li key={link}>
                                        <Link to="/faq" className="text-teal-600 dark:text-teal-400 hover:underline">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Still stuck?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Browse the FAQ or get in touch — we usually reply within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/faq"
                            className="inline-flex items-center px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            View FAQ <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                            <Mail className="w-4 h-4 mr-2" /> Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;

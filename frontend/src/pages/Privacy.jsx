import React from 'react';
import { ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackLink from '../components/BackLink';

const LegalSection = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">{children}</div>
    </section>
);

const LegalP = ({ children }) => <p>{children}</p>;

const Privacy = () => (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[120px]" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
            <div className="mb-3">
                <BackLink />
            </div>
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-teal-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Legal</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">Privacy Policy</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: August 3, 2026</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 md:p-12">
                <LegalSection title="Our promise">
                    <LegalP>a2zconverters is built around a simple principle: your files are yours. All conversion, compression, and editing is performed locally in your browser. Your documents and images never leave your device.</LegalP>
                </LegalSection>

                <LegalSection title="What we collect">
                    <LegalP>We do not collect, upload, or store the files you process. We do not require an account to use the tools.</LegalP>
                    <LegalP>We may store minimal preference data — such as your theme choice and default export settings — in your browser's local storage. This data never leaves your device and can be cleared at any time from the Settings panel.</LegalP>
                </LegalSection>

                <LegalSection title="Cookies & analytics">
                    <LegalP>We do not use tracking cookies. Anonymous, aggregate analytics may be used to understand how the tools are used so we can improve them, but this never includes the content of your files.</LegalP>
                </LegalSection>

                <LegalSection title="Third parties">
                    <LegalP>Because processing happens on your device, no files are transmitted to third parties. Where we link to external resources, those parties have their own privacy policies.</LegalP>
                </LegalSection>

                <LegalSection title="Your rights">
                    <LegalP>Since we hold no data about you, there is nothing to export or delete on our servers. You can clear locally stored preferences at any time in your browser.</LegalP>
                </LegalSection>

                <LegalSection title="Contact">
                    <LegalP>Questions about this policy? Reach us at <span className="inline-flex items-center gap-1.5 font-medium text-teal-600 dark:text-teal-400"><Mail className="w-4 h-4" /> support@convertpro.com</span> or via our <Link to="/contact" className="text-teal-600 dark:text-teal-400 hover:underline">contact page</Link>.</LegalP>
                </LegalSection>
            </div>
        </div>
    </div>
);

export default Privacy;

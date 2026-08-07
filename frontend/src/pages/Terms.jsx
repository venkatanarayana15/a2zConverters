import React from 'react';
import { Scale, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackLink from '../components/BackLink';

const LegalSection = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">{children}</div>
    </section>
);

const LegalP = ({ children }) => <p>{children}</p>;

const Terms = () => (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/20 rounded-full blur-[120px]" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
            <div className="mb-3">
                <BackLink />
            </div>
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 shadow-sm">
                    <Scale className="w-4 h-4 text-teal-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Legal</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">Terms of Service</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: August 3, 2026</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 md:p-12">
                <LegalSection title="Acceptance of terms">
                    <LegalP>By accessing or using a2zconverters, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</LegalP>
                </LegalSection>

                <LegalSection title="Use of the service">
                    <LegalP>Our tools are provided free of charge for your personal and professional use. You agree not to use the service for any unlawful purpose or to process files you do not have the right to process.</LegalP>
                </LegalSection>

                <LegalSection title="Acceptable use">
                    <LegalP>You agree not to: upload or process content that infringes on others' rights; attempt to disrupt, overload, or gain unauthorized access to the service; or reverse-engineer any part of the application.</LegalP>
                </LegalSection>

                <LegalSection title="Intellectual property">
                    <LegalP>a2zconverters and its branding, logo, and design are our property. The files you create with our tools remain yours.</LegalP>
                </LegalSection>

                <LegalSection title="Disclaimer">
                    <LegalP>The service is provided "as is" without warranties of any kind, express or implied. We do not guarantee that processing will be error-free or that output files will be accepted by every recipient.</LegalP>
                </LegalSection>

                <LegalSection title="Limitation of liability">
                    <LegalP>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</LegalP>
                </LegalSection>

                <LegalSection title="Changes to these terms">
                    <LegalP>We may update these terms from time to time. Continued use of the service after changes take effect constitutes acceptance of the revised terms.</LegalP>
                </LegalSection>

                <LegalSection title="Contact">
                    <LegalP>Questions about these terms? Email <span className="inline-flex items-center gap-1.5 font-medium text-teal-600 dark:text-teal-400"><Mail className="w-4 h-4" /> support@convertpro.com</span> or visit our <Link to="/contact" className="text-teal-600 dark:text-teal-400 hover:underline">contact page</Link>.</LegalP>
                </LegalSection>
            </div>
        </div>
    </div>
);

export default Terms;

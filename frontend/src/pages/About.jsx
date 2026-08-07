import React from 'react';
import { ShieldCheck, Zap, Lock, Globe, Users, Award } from 'lucide-react';
import BackLink from '../components/BackLink';

const About = () => {
    const stats = [
        { value: '20+', label: 'Free Tools' },
        { value: '100%', label: 'Browser-Based' },
        { value: '0', label: 'Files Stored' },
        { value: '24/7', label: 'Available' },
    ];

    const values = [
        { icon: Zap, title: 'Speed First', desc: 'Every tool processes files instantly, right in your browser. No queues, no waiting.' },
        { icon: ShieldCheck, title: 'Secure by Design', desc: 'Files never leave your device. All conversion happens locally, keeping your data private.' },
        { icon: Lock, title: 'Privacy Obsessed', desc: "We don't upload, store, or track your documents. What you convert stays with you." },
        { icon: Globe, title: 'Built for Everyone', desc: 'Simple, clean tools that work on any device — from smartphones to desktops.' },
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
                        <Users className="w-4 h-4 text-teal-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Who We Are</span>
                    </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">a2zconverters</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        We build simple, fast, and private file conversion tools for everyone.
                        From PDFs to images, our entire suite runs directly in your browser —
                        no uploads, no waiting, no compromises.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-10">What We Stand For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((value) => (
                            <div key={value.title} className="bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                    <Award className="w-10 h-10 text-teal-500 mx-auto mb-4" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Mission</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Converting files shouldn't cost you time or compromise your privacy.
                        Our mission is to provide a complete suite of free, fast, and secure
                        conversion tools that anyone can use — from a quick image resize to
                        a full document workflow.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;

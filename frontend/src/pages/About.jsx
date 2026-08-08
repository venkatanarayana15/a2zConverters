import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Users, Zap, ShieldCheck, Lock, Globe, Award, Rocket, MonitorSmartphone, ShieldOff, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import PageHeader from '../components/PageHeader';
import PageCTA from '../components/PageCTA';

const StatCounter = ({ value, suffix = '', label, icon: Icon, gradient }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, value, {
            duration: 1.3,
            ease: 'easeOut',
            onUpdate: (v) => setDisplay(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, value]);

    return (
        <div ref={ref} className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 hover:shadow-xl dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-60', gradient)} />
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
            </div>
            <div className={cn('text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r mb-1', gradient)}>
                {display}{suffix}
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">{label}</div>
        </div>
    );
};

const values = [
    { icon: Zap, title: 'Speed First', desc: 'Every tool processes files instantly, right in your browser. No queues, no waiting.', tile: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400', gradient: 'from-amber-500 to-orange-500' },
    { icon: ShieldCheck, title: 'Secure by Design', desc: 'Files never leave your device. All conversion happens locally, keeping your data private.', tile: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-500 to-teal-500' },
    { icon: Lock, title: 'Privacy Obsessed', desc: "We don't upload, store, or track your documents. What you convert stays with you.", tile: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400', gradient: 'from-teal-500 to-cyan-500' },
    { icon: Globe, title: 'Built for Everyone', desc: 'Simple, clean tools that work on any device — from smartphones to desktops.', tile: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
];

const About = () => {
    const stats = [
        { value: 20, suffix: '+', label: 'Free Tools', icon: Rocket, gradient: 'from-teal-500 to-cyan-500' },
        { value: 100, suffix: '%', label: 'Browser-Based', icon: MonitorSmartphone, gradient: 'from-blue-500 to-cyan-500' },
        { value: 0, suffix: '', label: 'Files Stored', icon: ShieldOff, gradient: 'from-emerald-500 to-teal-500' },
        { value: 24, suffix: '/7', label: 'Available', icon: Clock, gradient: 'from-purple-500 to-pink-500' },
    ];

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
                <PageHeader
                    badge={{ icon: Users, label: 'Who We Are' }}
                    accent="teal"
                    title={<>About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">a2zconverters</span></>}
                    subtitle="We build simple, fast, and private file conversion tools for everyone."
                />
                <div className="max-w-5xl mx-auto">

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {stats.map((stat) => (
                            <StatCounter key={stat.label} {...stat} />
                        ))}
                    </div>

                    {/* Our Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 p-8 md:p-12 mb-16"
                    >
                        <div className="md:col-span-3">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">Our Story</h2>
                            <div className="space-y-4 text-gray-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    It started with a simple frustration: converting a file always meant waiting for an upload,
                                    worrying about privacy, or paying for a subscription. There had to be a better way.
                                </p>
                                <p>
                                    So we built a2zconverters — a complete suite of tools that runs entirely in your browser.
                                    From PDFs to images, everything happens locally on your device. No uploads, no waiting,
                                    no compromises.
                                </p>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: Zap, label: 'Instant results', tile: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400' },
                                    { icon: Lock, label: 'Private by default', tile: 'bg-teal-50 dark:bg-teal-900/20 text-teal-500 dark:text-teal-400' },
                                    { icon: ShieldCheck, label: 'Secure processing', tile: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400' },
                                    { icon: Globe, label: 'Free for everyone', tile: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400' },
                                ].map((chip) => (
                                    <div key={chip.label} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40 p-4 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
                                        <span className={cn('w-9 h-9 rounded-lg flex items-center justify-center', chip.tile)}>
                                            <chip.icon className="w-4.5 h-4.5" />
                                        </span>
                                        <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{chip.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Values */}
                    <div className="mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.4 }}
                            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 text-center mb-10"
                        >
                            What We Stand For
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {values.map((value, i) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 hover:shadow-xl dark:hover:shadow-black/40 hover:-translate-y-1 hover:border-gray-200 dark:hover:border-slate-700 transition-all duration-300"
                                >
                                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300', value.tile)}>
                                        <value.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">{value.title}</h3>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-600 p-8 md:p-12 text-center text-white shadow-xl shadow-teal-600/20 mb-16"
                    >
                        <div className="absolute top-[-30%] left-[-10%] w-[40%] h-[60%] bg-white/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute bottom-[-30%] right-[-10%] w-[40%] h-[60%] bg-white/10 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-5">
                                <Award className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="max-w-2xl mx-auto leading-relaxed text-teal-50">
                                Converting files shouldn't cost you time or compromise your privacy. Our mission is to
                                provide a complete suite of free, fast, and secure conversion tools that anyone can use —
                                from a quick image resize to a full document workflow.
                            </p>
                        </div>
                    </motion.div>

                    <PageCTA
                        title="Ready to experience the difference?"
                        subtitle="Try any tool right now — it's free, instant, and your files never leave your device."
                        primary={{ to: '/#tools', label: 'Browse All Tools', className: 'dark:bg-none dark:bg-primary dark:text-white' }}
                        secondary={{ to: '/features', label: 'See Features' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default About;

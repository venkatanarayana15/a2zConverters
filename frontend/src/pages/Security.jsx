import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Trash2, EyeOff, Lock, Zap, MonitorSmartphone, CheckCircle2, FileLock2 } from 'lucide-react';
import { cn } from '../lib/utils';
import PageHeader from '../components/PageHeader';
import PageCTA from '../components/PageCTA';

const guarantees = [
    { icon: Cpu, title: 'Local Processing', desc: 'Every conversion runs in your browser using WebAssembly and canvas APIs — your files are processed on your own device, not on our servers.', tile: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
    { icon: Trash2, title: 'Nothing is Stored', desc: 'We hold zero copies of your files. When you close the tab, everything is gone. There are no upload queues and no cloud buckets.', tile: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
    { icon: EyeOff, title: 'No Tracking', desc: 'We use no tracking cookies and don\u2019t profile you. Anonymous aggregate analytics help us improve tools, but never touch your content.', tile: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
    { icon: Lock, title: 'Private by Default', desc: 'No account, no sign-up, no email required. Just open a tool, drop your file, and convert — your privacy needs no configuration.', tile: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
];

const steps = [
    { icon: MonitorSmartphone, step: '01', title: 'Pick a tool', desc: 'Choose any converter from the tools menu — PDF, image, document, or OCR.' },
    { icon: FileLock2, step: '02', title: 'Add your file', desc: 'Your file loads directly into your browser and stays on your device the entire time.' },
    { icon: Zap, step: '03', title: 'Get your result', desc: 'Processing finishes instantly. Download your output — and nothing was ever uploaded.' },
];

const Security = () => (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
            <PageHeader
                badge={{ icon: ShieldCheck, label: 'Trust & Safety' }}
                accent="teal"
                title={<>Security & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Privacy</span></>}
                subtitle="We built a2zconverters so your files never have to leave your device."
            />
            <div className="max-w-5xl mx-auto">

                {/* Guarantees */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {guarantees.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300', item.tile)}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{item.title}</h3>
                            </div>
                            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* How it works */}
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 text-center mb-10"
                    >
                        How It Works
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: i * 0.12 }}
                                className="relative bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <span className="absolute top-5 right-6 text-4xl font-extrabold text-gray-100 dark:text-slate-800 select-none">{step.step}</span>
                                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 relative">
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">{step.title}</h3>
                                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Promise strip */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-600 p-8 md:p-12 text-white shadow-xl shadow-teal-600/20 mb-16"
                >
                    <div className="absolute top-[-30%] left-[-10%] w-[40%] h-[60%] bg-white/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-[-30%] right-[-10%] w-[40%] h-[60%] bg-white/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div className="flex items-center gap-4">
                            <span className="shrink-0 w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </span>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold mb-1">Our Promise</h2>
                                <p className="text-teal-50 max-w-md leading-relaxed">
                                    We can't read your files, we can't sell your files, and we can't lose your files.
                                    Because we never see them in the first place.
                                </p>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-teal-50 shrink-0">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Files never leave your device</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> No accounts, no sign-ups</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Free, forever</li>
                        </ul>
                    </div>
                </motion.div>

                <PageCTA
                    title="Privacy without compromise"
                    subtitle="Experience conversion that never sees your data. Start with any tool right now."
                    primary={{ to: '/#tools', label: 'Browse All Tools', className: 'dark:bg-none dark:bg-primary dark:text-white' }}
                    secondary={{ to: '/privacy', label: 'Read Privacy Policy' }}
                />
            </div>
        </div>
    </div>
);

export default Security;

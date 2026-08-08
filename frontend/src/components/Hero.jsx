import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileCheck, Image as ImageIcon } from 'lucide-react';
import Interactive3DBackground from './Interactive3DBackground';
import PhysicsButton from './PhysicsButton';
import ModernBackground from './ModernBackground';
import { cn } from '../lib/utils';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
    }),
};

const Hero = () => {
    return (
        <div className="relative min-h-[85vh] md:min-h-screen w-full max-w-full flex items-center justify-center overflow-hidden pt-20 md:pt-16">
            {/* Layer 1: Gradient Blobs (deepest) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-20">
                <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-sky-200/40 rounded-full blur-[120px] animate-pulse-glow dark:bg-sky-900/25" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-cyan-200/40 rounded-full blur-[120px] animate-pulse-glow dark:bg-cyan-900/25" style={{ animationDelay: '1s' }} />
            </div>

            {/* Layer 2: Interactive Background (above blobs, below content) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                {/* Desktop: 3D Physics Grid */}
                <div className="hidden md:block w-full h-full">
                    <Interactive3DBackground />
                </div>

                {/* Mobile: Modern Background */}
                <div className="block md:hidden w-full h-full pointer-events-none">
                    <ModernBackground />
                </div>
            </div>

            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full flex flex-col items-center justify-center h-full">

                <motion.h1
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-4 md:mb-6 text-gray-900 w-full dark:text-slate-100"
                >
                    <span className="block mb-1 md:mb-2">Every PDF & Image tool</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">
                        you'll ever need
                    </span>
                </motion.h1>

                <motion.p
                    custom={1}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="mt-3 md:mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 md:mb-10 w-full px-2 dark:text-slate-400"
                >
                    Merge, split, compress and convert PDFs, resize photos for government exams (SSC, UPSC, IBPS),
                    and more — all free, right in your browser, no sign-up needed.
                </motion.p>

                <motion.div
                    custom={2}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 md:mb-12 w-full"
                >
                    <Link to="/gov-resizer" className="w-full sm:w-auto">
                        <PhysicsButton variant="electric" className="w-full sm:w-auto justify-center">
                            Resize for Exam
                            <ArrowRight className={cn("ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform text-cyan-400")} />
                        </PhysicsButton>
                    </Link>

                    <PhysicsButton variant="outline" className="w-full sm:w-auto justify-center" onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}>
                        <FileCheck className="mr-2 w-5 h-5 text-sky-500" />
                        Explore PDF Tools
                    </PhysicsButton>
                </motion.div>

                {/* Trust Row */}
                <motion.div
                    custom={2.5}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8 w-full"
                >
                    {[
                        { value: '30+', label: 'Free Tools' },
                        { value: 'No sign-up', label: 'Start instantly' },
                        { value: '100%', label: 'In-browser' },
                        { value: 'Private', label: 'Files stay on your device' },
                    ].map((stat) => (
                        <div key={stat.label} className="flex items-center gap-2">
                            <span className="text-sm md:text-base font-bold text-gray-900 dark:text-slate-100">{stat.value}</span>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-slate-400">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>



                {/* Floating Cards (Decorative) */}
                <motion.div
                    custom={3}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="hidden lg:block absolute top-[20%] left-[5%] animate-float"
                    style={{ animationDelay: '0.5s' }}
                >
                    <div className="glass-card p-4 rounded-2xl flex items-center gap-3 w-48 bg-white/80 backdrop-blur-md border border-white/40 shadow-xl dark:bg-slate-900/80 dark:border-slate-700/40">
                        <div className="p-2 rounded-lg bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-slate-100">PDF to Word</div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">Converting...</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    custom={4}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="hidden lg:block absolute bottom-[30%] right-[5%] animate-float"
                    style={{ animationDelay: '1.5s' }}
                >
                    <div className="glass-card p-4 rounded-2xl flex items-center gap-3 w-48 bg-white/80 backdrop-blur-md border border-white/40 shadow-xl dark:bg-slate-900/80 dark:border-slate-700/40">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-slate-100">JPG Resizer</div>
                            <div className="text-xs text-green-600 flex items-center dark:text-green-400">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-1" /> Done
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;

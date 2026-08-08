import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import BackLink from './BackLink';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
    }),
};

const accents = {
    teal: ['bg-teal-100/70 dark:bg-teal-900/30', 'bg-teal-200/25', 'bg-blue-200/25'],
    blue: ['bg-blue-100/70 dark:bg-blue-900/30', 'bg-blue-200/25', 'bg-teal-200/25'],
    purple: ['bg-purple-100/70 dark:bg-purple-900/30', 'bg-purple-200/25', 'bg-teal-200/25'],
};

const PageHeader = ({ badge, title, subtitle, accent = 'teal', children, className }) => {
    const [badgeBg, blob1, blob2] = accents[accent] || accents.teal;

    return (
        <div className={cn('relative overflow-hidden', className)}>
            <div className={cn('absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full blur-[130px] pointer-events-none', blob1)} />
            <div className={cn('absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full blur-[130px] pointer-events-none', blob2)} />

            <div className="relative">
                <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="pl-4 sm:pl-6 lg:pl-8 pt-4 sm:pt-6 lg:pt-8 pb-1">
                    <BackLink />
                </motion.div>

                <div className="max-w-3xl mx-auto text-center mb-12">
                    <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-5 shadow-sm">
                            <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center', badgeBg)}>
                                <badge.icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            </span>
                            <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{badge.label}</span>
                        </div>
                    </motion.div>

                    <motion.h1 custom={2} variants={fadeUp} initial="hidden" animate="visible" className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight mb-4">
                        {title}
                    </motion.h1>

                    {subtitle && (
                        <motion.p custom={3} variants={fadeUp} initial="hidden" animate="visible" className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
                            {subtitle}
                        </motion.p>
                    )}

                    {children && (
                        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mt-8">
                            {children}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;

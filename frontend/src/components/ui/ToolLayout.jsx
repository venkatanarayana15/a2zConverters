import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import BackLink from '../BackLink';

const accentMap = {
    red: 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
    blue: 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
    green: 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
    teal: 'bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-400',
    purple: 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400',
    orange: 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400',
    gray: 'bg-gray-100 border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400',
};

const blobMap = {
    red: 'bg-red-200/20',
    blue: 'bg-blue-200/20',
    green: 'bg-green-200/20',
    teal: 'bg-teal-200/20',
    purple: 'bg-purple-200/20',
    orange: 'bg-orange-200/20',
    gray: 'bg-gray-200/20',
    cyan: 'bg-cyan-200/20',
    indigo: 'bg-indigo-200/20',
};

const ToolLayout = ({ icon: Icon, badge, title, subtitle, accent = 'red', children }) => {
    const badgeCls = accentMap[accent] || accentMap.red;
    const blob = blobMap[accent] || blobMap.red;

    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground relative overflow-hidden">
            <div className={cn('absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[130px] pointer-events-none', blob)} />
            <div className={cn('absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[130px] pointer-events-none', blob)} />

            <div className="max-w-[96rem] mx-auto relative">
                <div className="pl-10 sm:pl-12 lg:pl-14 mb-8">
                    <BackLink />
                </div>

                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-4 shadow-sm"
                    >
                        <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center', badgeCls)}>
                            <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{badge}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-slate-100"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-600 max-w-2xl mx-auto dark:text-slate-400"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                {children}
            </div>
        </div>
    );
};

export default ToolLayout;

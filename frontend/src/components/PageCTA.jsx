import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const PageCTA = ({ title, subtitle, primary, secondary }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 p-8 md:p-12 text-center"
    >
        <div className="absolute top-[-30%] left-[-10%] w-[40%] h-[60%] bg-teal-200/20 rounded-full blur-[100px] pointer-events-none dark:bg-teal-500/10" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[40%] h-[60%] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none dark:bg-blue-500/10" />

        <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-3">{title}</h2>
            {subtitle && (
                <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {primary && (
                    <Link
                        to={primary.to}
                        className={cn(
                            'inline-flex items-center px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-cyan-500 font-bold rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
                            primary.className || 'dark:bg-none dark:bg-primary dark:text-white'
                        )}
                    >
                        {primary.icon}
                        {primary.label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                )}
                {secondary && (
                    <Link
                        to={secondary.to}
                        className={cn(
                            'inline-flex items-center px-8 py-3.5 font-bold rounded-xl border transition-all',
                            secondary.className ||
                                'bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-primary/10 dark:hover:text-primary dark:hover:border-primary/30'
                        )}
                    >
                        {secondary.icon}
                        {secondary.label}
                    </Link>
                )}
            </div>
        </div>
    </motion.div>
);

export default PageCTA;

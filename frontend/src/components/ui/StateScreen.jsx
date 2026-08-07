import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const tones = {
    gray: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-500 dark:text-gray-400' },
    teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
    red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
};

const StateScreen = ({
    icon: Icon,
    title,
    description,
    badge,
    action,
    secondaryAction,
    size = 'card',
    tone = 'gray',
    iconClassName,
    className,
    children,
}) => {
    const toneClasses = tones[tone] || tones.gray;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={cn(
                'flex flex-col items-center justify-center text-center',
                size === 'full' ? 'min-h-[60vh] px-6 py-16' : 'py-12 px-6',
                className
            )}
        >
            {badge && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 mb-6">
                    {badge}
                </span>
            )}

            <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm', toneClasses.bg)}>
                <Icon className={cn('w-10 h-10', toneClasses.text, iconClassName)} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm leading-relaxed mb-6">{description}</p>
            )}

            {children}

            {(action || secondaryAction) && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {action}
                    {secondaryAction}
                </div>
            )}
        </motion.div>
    );
};

export default StateScreen;

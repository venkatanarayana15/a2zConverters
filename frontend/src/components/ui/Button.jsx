import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const base =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-base',
};

const variants = {
    primary:
        'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/10 hover:shadow-lg hover:scale-[1.02]',
    teal: 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-500/10 hover:shadow-lg hover:scale-[1.02]',
    success:
        'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md shadow-green-500/10 hover:shadow-lg hover:scale-[1.02]',
    secondary:
        'bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700',
    ghost: 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800',
    danger:
        'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30',
};

const Button = ({ variant = 'primary', size = 'md', to, href, className, children, ...props }) => {
    const classes = cn(base, sizes[size], variants[variant], className);

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }
    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {children}
            </a>
        );
    }
    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;

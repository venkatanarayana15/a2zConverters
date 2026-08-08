import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const variants = {
    success: {
        wrap: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
        iconWrap: 'bg-green-600 text-white',
        icon: CheckCircle2,
        title: 'text-green-800 dark:text-green-400',
        body: 'text-green-700 dark:text-green-500',
    },
    error: {
        wrap: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
        iconWrap: 'bg-red-600 text-white',
        icon: AlertCircle,
        title: 'text-red-700 dark:text-red-400',
        body: 'text-red-600 dark:text-red-400',
    },
    warning: {
        wrap: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
        iconWrap: 'bg-orange-500 text-white',
        icon: AlertTriangle,
        title: 'text-orange-800 dark:text-orange-400',
        body: 'text-orange-700 dark:text-orange-400',
    },
    info: {
        wrap: 'bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-800',
        iconWrap: 'bg-sky-600 text-white',
        icon: Info,
        title: 'text-sky-800 dark:text-sky-400',
        body: 'text-sky-700 dark:text-sky-400',
    },
};

const InlineNotice = ({ variant = 'info', title, icon: CustomIcon, children, action }) => {
    const v = variants[variant];
    const Icon = CustomIcon || v.icon;
    return (
        <div className={cn('mt-4 p-4 rounded-xl border flex items-start gap-3', v.wrap)}>
            <div className={cn('w-8 h-8 shrink-0 rounded-lg flex items-center justify-center', v.iconWrap)}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                {title && <p className={cn('font-bold flex items-center gap-2', v.title)}>{title}</p>}
                <div className={cn('text-sm', v.body)}>{children}</div>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
};

export default InlineNotice;

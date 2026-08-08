import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const ProcessButton = ({ onClick, disabled, isProcessing, processingText, children, accent = 'from-red-500 to-rose-500 shadow-red-200 dark:shadow-red-900/40 hover:shadow-red-300 dark:hover:shadow-red-900/60' }) => {
    const ready = !disabled && !isProcessing;
    return (
        <button
            onClick={onClick}
            disabled={!ready}
            className={cn(
                'w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center disabled:cursor-not-allowed',
                ready
                    ? cn('bg-gradient-to-r text-white hover:scale-[1.02] active:scale-[0.98]', accent)
                    : 'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-slate-800 dark:border-slate-700'
            )}
        >
            {isProcessing ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
                    {processingText}
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default ProcessButton;

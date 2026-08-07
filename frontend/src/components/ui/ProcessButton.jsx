import React from 'react';

const ProcessButton = ({ onClick, disabled, isProcessing, processingText, children, accent = 'from-red-500 to-rose-500 shadow-red-200 hover:shadow-red-300' }) => {
    const ready = !disabled && !isProcessing;
    return (
        <button
            onClick={onClick}
            disabled={!ready}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center disabled:cursor-not-allowed ${
                ready
                    ? `bg-gradient-to-r ${accent} text-white hover:scale-[1.02] active:scale-[0.98]`
                    : 'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
            }`}
        >
            {isProcessing && <span className="animate-spin mr-2 h-5 w-5 border-2 border-b-transparent border-white rounded-full"></span>}
            {isProcessing ? processingText : children}
        </button>
    );
};

export default ProcessButton;

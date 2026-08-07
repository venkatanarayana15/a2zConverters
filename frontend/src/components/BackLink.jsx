import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackLink = ({ children = 'Back', to = '/' }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        let from = null;
        try {
            from = sessionStorage.getItem('a2z_prev_path');
        } catch { /* ignore */ }
        navigate(from && from !== window.location.pathname ? from : to);
    };

    return (
        <button
            type="button"
            aria-label="Go back"
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
            <ArrowLeft className="w-4 h-4" />
            {children}
        </button>
    );
};

export default BackLink;

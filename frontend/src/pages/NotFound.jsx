import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, HelpCircle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[120px] dark:bg-blue-900/15" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 rounded-full blur-[120px] dark:bg-purple-900/15" />

            <div className="relative text-center px-4 max-w-xl mx-auto">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-6 shadow-sm dark:shadow-black/20">
                    <Compass className="w-4 h-4 text-teal-500 mr-2" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Lost in the maze?</span>
                </div>

                <h1 className="text-7xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-500 mb-4">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                    The page you are looking for doesn't exist or may have been moved.
                    Let's get you back to converting files.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg dark:bg-none dark:bg-primary dark:text-white hover:scale-[1.02] transition-all"
                    >
                        <Home className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                    <Link
                        to="/contact"
                        className="flex items-center px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-semibold rounded-xl hover:border-teal-300 dark:hover:border-teal-800 transition-all"
                    >
                        <HelpCircle className="w-4 h-4 mr-2" /> Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

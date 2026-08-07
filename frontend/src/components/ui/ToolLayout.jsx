import React from 'react';
import BackLink from '../BackLink';

const accentMap = {
    red: 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
    blue: 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
    green: 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
    teal: 'bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-400',
    purple: 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400',
    orange: 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400',
    gray: 'bg-gray-100 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400',
};

const ToolLayout = ({ icon: Icon, badge, title, subtitle, accent = 'red', children }) => {
    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <BackLink />
                </div>
                <div className="text-center mb-10">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium mb-4 ${accentMap[accent] || accentMap.red}`}>
                        <Icon className="w-4 h-4 mr-2" />
                        {badge}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        {title}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
                        {subtitle}
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default ToolLayout;

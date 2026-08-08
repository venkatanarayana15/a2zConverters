import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail } from 'lucide-react';

const AboutSettings = ({ onClose }) => (
    <div className="space-y-5">
        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">a2zconverters</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Version 1.0.0</p>
        </div>
        <div className="space-y-1">
            <Link to="/terms" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/60 dark:hover:bg-blue-900/20 hover:translate-x-1 transition-all duration-200 group">
                <span className="text-sm text-gray-700 dark:text-slate-300 font-medium transition-colors">Terms of Service</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:-translate-x-0.5 transition-all" />
            </Link>
            <Link to="/privacy" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/60 dark:hover:bg-blue-900/20 hover:translate-x-1 transition-all duration-200 group">
                <span className="text-sm text-gray-700 dark:text-slate-300 font-medium transition-colors">Privacy Policy</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:-translate-x-0.5 transition-all" />
            </Link>
            <Link to="/cookies" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/60 dark:hover:bg-blue-900/20 hover:translate-x-1 transition-all duration-200 group">
                <span className="text-sm text-gray-700 dark:text-slate-300 font-medium transition-colors">Cookie Policy</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:-translate-x-0.5 transition-all" />
            </Link>
            <Link to="/contact" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/60 dark:hover:bg-blue-900/20 hover:translate-x-1 transition-all duration-200 group">
                <span className="text-sm text-gray-700 dark:text-slate-300 font-medium transition-colors">Contact Support</span>
                <Mail className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:-translate-x-0.5 transition-all" />
            </Link>
            <a
                href="https://github.com/venatanarayana15/a2zConverters"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/60 dark:hover:bg-blue-900/20 hover:translate-x-1 transition-all duration-200 group"
            >
                <span className="text-sm text-gray-700 dark:text-slate-300 font-medium transition-colors">GitHub Repository</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:-translate-x-0.5 transition-all" />
            </a>
        </div>
    </div>
);

export default AboutSettings;

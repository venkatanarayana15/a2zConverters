import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail } from 'lucide-react';

const AboutSettings = ({ onClose }) => (
    <div className="space-y-5">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">a2zconverters</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Version 1.0.0</p>
        </div>
        <div className="space-y-1">
            <Link to="/terms" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Terms of Service</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </Link>
            <Link to="/privacy" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Privacy Policy</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </Link>
            <Link to="/contact" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Contact Support</span>
                <Mail className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </Link>
            <a
                href="https://github.com/venatanarayana15/a2zConverters"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">GitHub Repository</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </a>
        </div>
    </div>
);

export default AboutSettings;

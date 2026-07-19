import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ComingSoon = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar is already in App.jsx layout, so we don't need it here if it's outside Routes */}
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
                <p className="text-lg text-gray-600 mb-8">
                    We are working hard to bring this tool to you. Stay tuned!
                </p>
                <Link
                    to="/"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ComingSoon;

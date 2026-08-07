import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Star } from 'lucide-react';

const FeedbackButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setTimeout(() => {
                setIsOpen(false);
                setSubmitted(false);
                setRating(0);
            }, 2500);
        }, 1000);
    };

    useEffect(() => {
        const checkBottom = () => {
            const buffer = 50;
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - buffer;
            setIsAtBottom(atBottom);
        };

        window.addEventListener('scroll', checkBottom, { passive: true });
        checkBottom();
        return () => window.removeEventListener('scroll', checkBottom);
    }, []);

    return (
        <>
            {/* Trigger Button with Pulse Effect */}
            <div className={`fixed bottom-24 md:bottom-6 right-6 z-50 group transition-all duration-300 ${isAtBottom ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <div className="absolute inset-0 bg-blue-400 rounded-full blur opacity-40 animate-pulse group-hover:opacity-75 transition-opacity duration-500"></div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 transform"
                    aria-label="Open Feedback Form"
                >
                    <MessageSquare className="w-6 h-6 fill-current" />
                </button>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-gray-100 dark:bg-gray-800/90 dark:text-gray-200 dark:border-gray-700">
                    Help us improve!
                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white/90 rotate-45 border-r border-t border-gray-100 dark:bg-gray-800/90 dark:border-gray-700"></div>
                </div>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-auto"
                        onClick={() => setIsOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto relative overflow-hidden border border-white/50 ring-1 ring-black/5 dark:bg-gray-900/95 dark:border-gray-700/50"
                    >
                        {/* Decorative gradient blob */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5 flex justify-between items-center text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <h3 className="font-bold text-lg flex items-center relative z-10">
                                <span className="mr-2 text-2xl">✨</span>
                                <span className="tracking-wide">Feedback</span>
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors relative z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 relative z-10">
                            <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-center py-10"
                                >
                                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100 animate-success-bounce">
                                        <CheckIcon className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">Thanks!</h4>
                                    <p className="text-gray-500 dark:text-gray-400">Your feedback makes us better.</p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    <div className="text-center mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider text-xs dark:text-gray-300">Rate your experience</label>
                                        <div className="flex justify-center items-center space-x-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoveredStar(star)}
                                                    onMouseLeave={() => setHoveredStar(0)}
                                                    onClick={() => setRating(star)}
                                                    className="p-1 transition-all duration-200 hover:scale-125 focus:outline-none"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 ${star <= (hoveredStar || rating) ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'text-gray-200 fill-gray-100'}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="h-6 text-sm font-medium text-blue-600">
                                            {(hoveredStar || rating) === 5 ? "Amazing! 😍" :
                                                (hoveredStar || rating) === 4 ? "Good! 🙂" :
                                                    (hoveredStar || rating) === 3 ? "It's Okay 😐" :
                                                        (hoveredStar || rating) === 2 ? "Bad 😕" :
                                                            (hoveredStar || rating) === 1 ? "Terrible 😫" : ""}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Request New Converters? 💡</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400 dark:bg-gray-800/50 dark:border-gray-700"
                                            placeholder="e.g. GIF to MP4, SVG to PNG..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Your Thoughts</label>
                                        <textarea
                                            rows="3"
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none placeholder-gray-400 dark:bg-gray-800/50 dark:border-gray-700"
                                            placeholder="What can we improve?..."
                                            required
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Email <span className="font-normal text-gray-400">(Optional)</span></label>
                                        <input
                                            type="email"
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400 dark:bg-gray-800/50 dark:border-gray-700"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={rating === 0}
                                        className={`w-full py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform flex items-center justify-center ${rating > 0 ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-[1.02] hover:shadow-blue-300' : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'}`}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Feedback
                                    </button>
                                </motion.form>
                            )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </>
    );
};

// Helper
const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

export default FeedbackButton;

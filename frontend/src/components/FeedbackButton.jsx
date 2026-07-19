import React, { useState } from 'react';
import { MessageSquare, X, Send, Star, Smile, Frown, Meh } from 'lucide-react';

const FeedbackButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);

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

    const getRatingEmoji = () => {
        if (hoveredStar >= 4 || rating >= 4) return <Smile className="w-8 h-8 text-green-500 animate-bounce" />;
        if (hoveredStar === 3 || rating === 3) return <Meh className="w-8 h-8 text-yellow-500 animate-pulse" />;
        if (hoveredStar > 0 || rating > 0) return <Frown className="w-8 h-8 text-red-500 animate-pulse" />;
        return <MessageSquare className="w-6 h-6 text-blue-100" />;
    };

    return (
        <>
            {/* Trigger Button with Pulse Effect */}
            <div className="fixed bottom-24 md:bottom-6 right-6 z-50 group">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur opacity-40 animate-pulse group-hover:opacity-75 transition-opacity duration-500"></div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 transform"
                    aria-label="Open Feedback Form"
                >
                    <MessageSquare className="w-6 h-6 fill-current" />
                </button>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-gray-100">
                    Help us improve!
                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white/90 rotate-45 border-r border-t border-gray-100"></div>
                </div>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6 pointer-events-none">
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300 ease-in-out"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto transform transition-all animate-slide-up relative overflow-hidden border border-white/50 ring-1 ring-black/5">
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
                            {submitted ? (
                                <div className="text-center py-10 animate-fade-in">
                                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100 animate-success-bounce">
                                        <CheckIcon className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Thanks!</h4>
                                    <p className="text-gray-500">Your feedback makes us better.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="text-center mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider text-xs">Rate your experience</label>
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Request New Converters? 💡</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400"
                                            placeholder="e.g. GIF to MP4, SVG to PNG..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Thoughts</label>
                                        <textarea
                                            rows="3"
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none placeholder-gray-400"
                                            placeholder="What can we improve?..."
                                            required
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="font-normal text-gray-400">(Optional)</span></label>
                                        <input
                                            type="email"
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={rating === 0}
                                        className={`w-full py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform flex items-center justify-center ${rating > 0 ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-[1.02] hover:shadow-blue-300' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Feedback
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
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

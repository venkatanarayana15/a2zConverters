import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Clock, MapPin, Check } from 'lucide-react';
import BackLink from '../components/BackLink';

const Contact = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const subject = encodeURIComponent('Support request from a2zconverters');
        const body = encodeURIComponent(
            `Name: ${form.name.value}\nEmail: ${form.email.value}\n\n${form.message.value}`
        );
        window.location.href = `mailto:support@convertpro.com?subject=${subject}&body=${body}`;
        setSent(true);
        setTimeout(() => setSent(false), 4000);
    };

    const details = [
        { icon: Mail, label: 'Email Us', value: 'support@convertpro.com' },
        { icon: Clock, label: 'Response Time', value: 'Within 24 hours' },
        { icon: MapPin, label: 'Location', value: 'Working remotely, worldwide' },
    ];

    const inputClass = "w-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all";

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-200/20 rounded-full blur-[120px]" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
                <div className="mb-3">
                    <BackLink />
                </div>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 shadow-sm">
                        <MessageSquare className="w-4 h-4 text-teal-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Get in Touch</span>
                    </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
                        We'd love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">hear from you</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        Questions, feedback, or a tool you'd love to see? Drop us a message.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {details.map((item) => (
                        <div key={item.label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                            <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 break-words">{item.value}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 md:p-12 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Send us a message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                                <input type="text" name="name" required placeholder="Your name" className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                <input type="email" name="email" required placeholder="you@example.com" className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                            <textarea name="message" required rows="5" placeholder="How can we help?" className={`${inputClass} resize-none`} />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                        >
                            {sent ? (
                                <><Check className="w-4 h-4 mr-2" /> Opening your email client…</>
                            ) : (
                                <><Send className="w-4 h-4 mr-2" /> Send Message</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Clock, MapPin, Check, ShieldCheck, User, Github, Twitter, Linkedin } from 'lucide-react';
import { cn } from '../lib/utils';
import PageHeader from '../components/PageHeader';

const details = [
    { icon: Mail, label: 'Email Us', value: 'support@convertpro.com', href: 'mailto:support@convertpro.com', tile: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
    { icon: Clock, label: 'Response Time', value: 'Within 24 hours', href: null, tile: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { icon: MapPin, label: 'Location', value: 'Working remotely, worldwide', href: null, tile: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
];

const inputBase = "w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all";

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

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
                <PageHeader
                    badge={{ icon: MessageSquare, label: 'Get in Touch' }}
                    accent="blue"
                    title={<>We'd love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">hear from you</span></>}
                    subtitle="Questions, feedback, or a tool you'd love to see? Drop us a message."
                />
                <div className="max-w-5xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        {/* Left: info */}
                        <div className="lg:col-span-2 space-y-4">
                            {details.map((item) => {
                                const inner = (
                                    <>
                                        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-3', item.tile)}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.label}</div>
                                        <div className="text-sm text-gray-500 dark:text-slate-400 mt-0.5 break-words">{item.value}</div>
                                    </>
                                );
                                const className = 'block bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 hover:shadow-lg dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300';
                                return item.href ? (
                                    <a key={item.label} href={item.href} className={className}>
                                        {inner}
                                    </a>
                                ) : (
                                    <div key={item.label} className={className}>
                                        {inner}
                                    </div>
                                );
                            })}

                            {/* Trust strip */}
                            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 p-6 text-white shadow-lg shadow-teal-600/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="w-9 h-9 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5" />
                                    </span>
                                    <span className="font-bold">We reply within 24 hours</span>
                                </div>
                                <p className="text-sm text-teal-50 leading-relaxed">
                                    Every message is read by a real person. No bots, no canned replies — just helpful answers.
                                </p>
                            </div>

                            {/* Socials */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20">
                                <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4">Follow along</div>
                                <div className="flex space-x-3">
                                    {[
                                        { icon: Github, href: '#', hover: 'hover:text-gray-900 dark:hover:text-slate-100' },
                                        { icon: Twitter, href: '#', hover: 'hover:text-blue-500' },
                                        { icon: Linkedin, href: '#', hover: 'hover:text-blue-700' },
                                    ].map((social) => (
                                        <a key={social.icon.name} href={social.href} className={cn('w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-400 flex items-center justify-center transition-colors', social.hover)}>
                                            <social.icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: form */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 p-8 md:p-10"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Send us a message</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-8">
                                Fill in the form and we'll open your email client with everything ready to send.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-300" />
                                            <input type="text" name="name" required placeholder="Your name" className={inputBase} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-300" />
                                            <input type="email" name="email" required placeholder="you@example.com" className={inputBase} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Message</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-gray-400 dark:text-slate-300" />
                                        <textarea name="message" required rows="6" placeholder="How can we help?" className={cn(inputBase, 'resize-none')} />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg dark:bg-none dark:bg-primary dark:text-white hover:scale-[1.01] active:scale-[0.99] transition-all"
                                >
                                    {sent ? (
                                        <><Check className="w-4 h-4 mr-2" /> Opening your email client…</>
                                    ) : (
                                        <><Send className="w-4 h-4 mr-2" /> Send Message</>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

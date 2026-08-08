import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const FooterColumn = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 md:border-none last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-4 md:py-0 md:mb-3 text-left group"
            >
                <h4 className="text-gray-900 dark:text-slate-100 font-semibold">{title}</h4>
                <ChevronDown
                    className={cn(
                        "w-5 h-5 text-gray-400 dark:text-slate-400 transition-transform duration-300 md:hidden",
                        isOpen && "rotate-180 text-primary"
                    )}
                />
            </button>
            {/* Desktop: always visible. Mobile: animated */}
            <div className="hidden md:block pb-0">
                {children}
            </div>
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden md:hidden pb-4"
                >
                    {children}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

const Footer = () => {
    return (
        <footer className="relative pt-4 md:pt-6 pb-6 md:pb-1 overflow-hidden border-t border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-12 mb-4 md:mb-6">
                    {/* Brand - Always visible */}
                    <div className="col-span-1 md:col-span-1 py-4 md:py-0">
                        <Link to="/" className="flex items-center space-x-2.5 mb-6 group select-none">
                            <div className="relative w-8 h-8">
                                {/* Custom SVG Logo: Teal Swirls */}
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-105 duration-300">
                                    <path d="M50 20C66.5685 20 80 33.4315 80 50C80 55.6 78.5 60.8 75.8 65.3C83.5 59.8 88.5 50.8 88.5 40.5C88.5 23.655 74.845 10 58 10C48.5 10 40 14.2 34.2 20.8C39 20.3 44.4 20 50 20Z" fill="url(#paint0_linear_footer)" />
                                    <path d="M80 50C80 66.5685 66.5685 80 50 80C44.4 80 39.2 78.5 34.7 75.8C40.2 83.5 49.2 88.5 59.5 88.5C76.345 88.5 90 74.845 90 58C90 48.5 85.8 40 79.2 34.2C79.7 39 80 44.4 80 50Z" fill="url(#paint1_linear_footer)" />
                                    <path d="M50 80C33.4315 80 20 66.5685 20 50C20 44.4 21.5 39.2 24.2 34.7C16.5 40.2 11.5 49.2 11.5 59.5C11.5 76.345 25.155 90 42 90C51.5 90 60 85.8 65.8 79.2C61 79.7 55.6 80 50 80Z" fill="url(#paint2_linear_footer)" />

                                    <path d="M50 28C62.15 28 72 37.85 72 50C72 52.8 71.3 55.4 70.1 57.8C75.2 53.5 78.5 47.1 78.5 40C78.5 25.36 66.64 13.5 52 13.5C44.8 13.5 38.3 16.3 33.5 20.8C38.2 25.3 43.8 28 50 28Z" fill="#00897B" />
                                    <path d="M72 50C72 62.15 62.15 72 50 72C47.2 72 44.6 71.3 42.2 70.1C46.5 75.2 52.9 78.5 60 78.5C74.64 78.5 86.5 66.64 86.5 52C86.5 44.8 83.7 38.3 79.2 33.5C74.7 38.2 72 43.8 72 50Z" fill="#00695C" />
                                    <path d="M50 72C37.85 72 28 62.15 28 50C28 47.2 28.7 44.6 29.9 42.2C24.8 46.5 21.5 52.9 21.5 60C21.5 74.64 33.36 86.5 48 86.5C55.2 86.5 61.7 83.7 66.5 79.2C61.8 74.7 56.2 72 50 72Z" fill="#004D40" />

                                    <defs>
                                        <linearGradient id="paint0_linear_footer" x1="34" y1="20" x2="88" y2="40" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#26A69A" />
                                            <stop offset="1" stopColor="#00897B" />
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_footer" x1="80" y1="34" x2="60" y2="88" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#00897B" />
                                            <stop offset="1" stopColor="#00695C" />
                                        </linearGradient>
                                        <linearGradient id="paint2_linear_footer" x1="66" y1="80" x2="12" y2="60" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#00695C" />
                                            <stop offset="1" stopColor="#004D40" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <span className="text-xl font-bold font-serif text-gray-900 dark:text-slate-100">a2zconverters</span>
                        </Link>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                            The most advanced file conversion tool on the web. Secure, fast, and beautifully designed for professionals.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className={cn("text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors")}><Github className="w-5 h-5" /></a>
                            <a href="#" className={cn("text-gray-400 dark:text-slate-400 hover:text-blue-500 dark:hover:text-sky-400 transition-colors")}><Twitter className="w-5 h-5" /></a>
                            <a href="#" className={cn("text-gray-400 dark:text-slate-400 hover:text-blue-700 dark:hover:text-sky-400 transition-colors")}><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <FooterColumn title="Products">
                        <ul className="space-y-1 text-sm">
                            <li><Link to="/merge-pdf" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 hover:translate-x-1">Merge PDF</Link></li>
                            <li><Link to="/compress-pdf" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 hover:translate-x-1">Compress PDF</Link></li>
                            <li><Link to="/gov-resizer" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 hover:translate-x-1 flex items-center">Govt. Resizer <span className="ml-2 text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full">NEW</span></Link></li>
                            <li><Link to="/html-to-pdf" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 hover:translate-x-1">HTML to PDF</Link></li>
                        </ul>
                    </FooterColumn>

                    {/* Links Column 2 */}
                    <FooterColumn title="Company">
                        <ul className="space-y-1 text-sm">
                            <li><Link to="/about" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition-all duration-200 hover:translate-x-1">About Us</Link></li>
                            <li><Link to="/features" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition-all duration-200 hover:translate-x-1">Features</Link></li>
                            <li><Link to="/pricing" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition-all duration-200 hover:translate-x-1">Pricing</Link></li>
                            <li><Link to="/contact" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition-all duration-200 hover:translate-x-1">Contact</Link></li>
                        </ul>
                    </FooterColumn>

                    {/* Contact/Support */}
                    <FooterColumn title="Support">
                        <ul className="space-y-1 text-sm">
                            <li><Link to="/help" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200 hover:translate-x-1">Help Center</Link></li>
                            <li><Link to="/faq" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200 hover:translate-x-1">FAQ</Link></li>
                            <li><Link to="/security" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200 hover:translate-x-1">Security</Link></li>
                            <li><Link to="/privacy" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200 hover:translate-x-1">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="block px-3 py-1 -mx-3 rounded-lg text-gray-900 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200 hover:translate-x-1">Terms of Service</Link></li>
                            <li className="flex items-center pt-2 px-3 text-gray-500 dark:text-slate-400">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>support@a2zconverters.com</span>
                            </li>
                        </ul>
                    </FooterColumn>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-1.5">
                    <p className="text-gray-400 dark:text-slate-400 text-xs">
                        © {new Date().getFullYear()} a2zconverters. All rights reserved.
                    </p>
                    <Link to="/status" className="flex items-center space-x-2 text-xs text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span>Systems Operational</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

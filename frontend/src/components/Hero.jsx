import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileCheck, Image as ImageIcon } from 'lucide-react';
import Interactive3DBackground from './Interactive3DBackground';
import PhysicsButton from './PhysicsButton';
import ModernBackground from './ModernBackground';
import { cn } from '../lib/utils';

const Hero = () => {
    return (
        <div className="relative min-h-[85vh] md:min-h-screen w-full max-w-full flex items-center justify-center overflow-hidden pt-20 md:pt-16">
            {/* Layer 1: Gradient Blobs (deepest) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-20">
                <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-sky-200/40 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-cyan-200/40 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            {/* Layer 2: Interactive Background (above blobs, below content) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                {/* Desktop: 3D Physics Grid */}
                <div className="hidden md:block w-full h-full">
                    <Interactive3DBackground />
                </div>

                {/* Mobile: Modern Background */}
                <div className="block md:hidden w-full h-full pointer-events-none">
                    <ModernBackground />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full flex flex-col items-center justify-center h-full">

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 text-gray-900 w-full">
                    <span className="block mb-1 md:mb-2">Perfect Photos for</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">
                        Gov Exams & PDFs
                    </span>
                </h1>

                <p className="mt-3 md:mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 md:mb-10 w-full px-2">
                    Resize images to exact government exam dimensions (SSC, UPSC, IBPS) in seconds.
                    Plus, the ultimate PDF toolkit for all your conversion needs.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 md:mb-20 w-full">
                    <Link to="/gov-resizer" className="w-full sm:w-auto">
                        <PhysicsButton variant="electric" className="w-full sm:w-auto justify-center">
                            Resize for Exam
                            <ArrowRight className={cn("ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform text-cyan-400")} />
                        </PhysicsButton>
                    </Link>

                    <PhysicsButton variant="outline" className="w-full sm:w-auto justify-center" onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}>
                        <FileCheck className="mr-2 w-5 h-5 text-sky-500" />
                        Explore PDF Tools
                    </PhysicsButton>
                </div>



                {/* Floating Cards (Decorative) */}
                <div className="hidden lg:block absolute top-[20%] left-[5%] animate-float" style={{ animationDelay: '0.5s' }}>
                    <div className="glass-card p-4 rounded-2xl flex items-center gap-3 w-48 bg-white/80 backdrop-blur-md border border-white/40 shadow-xl">
                        <div className="p-2 rounded-lg bg-red-100 text-red-500">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">PDF to Word</div>
                            <div className="text-xs text-gray-500">Converting...</div>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block absolute bottom-[30%] right-[5%] animate-float" style={{ animationDelay: '1.5s' }}>
                    <div className="glass-card p-4 rounded-2xl flex items-center gap-3 w-48 bg-white/80 backdrop-blur-md border border-white/40 shadow-xl">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-500">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">JPG Resizer</div>
                            <div className="text-xs text-green-600 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-1" /> Done
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;

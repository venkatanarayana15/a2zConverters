import React from 'react';
import { Zap, ShieldCheck, Lock } from 'lucide-react';

const Features = () => {
    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-50/50 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="text-primary">ConvertPro</span>?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Fast, secure, and private tools designed for your workflow.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100/50 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Lightning Fast</h3>
                        <p className="text-gray-600 leading-relaxed">Processing happens instantly in your browser. No queue, no waiting, just results.</p>
                    </div>

                    <div className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-100 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-green-100/50 flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform duration-300">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">100% Secure</h3>
                        <p className="text-gray-600 leading-relaxed">Your files never leave your device. All processing is done locally via WebAssembly.</p>
                    </div>

                    <div className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-100 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-purple-100/50 flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                            <Lock className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Privacy First</h3>
                        <p className="text-gray-600 leading-relaxed">We don't store your data. What happens on your device, stays completely private.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;

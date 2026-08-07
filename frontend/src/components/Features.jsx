import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Lock } from 'lucide-react';

const features = [
    { icon: Lock, title: 'Privacy First', desc: "We don't store your data. What happens on your device, stays completely private.", color: 'purple' },
    { icon: ShieldCheck, title: '100% Secure', desc: 'Your files never leave your device. All processing is done locally via WebAssembly.', color: 'green' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Processing happens instantly in your browser. No queue, no waiting, just results.', color: 'blue' },
];

const colorMap = {
    blue: { bg: 'bg-blue-100/50', text: 'text-blue-600', hover: 'group-hover:text-blue-600', shadow: 'hover:shadow-blue-500/10 hover:border-blue-100' },
    green: { bg: 'bg-green-100/50', text: 'text-green-600', hover: 'group-hover:text-green-600', shadow: 'hover:shadow-green-500/10 hover:border-green-100' },
    purple: { bg: 'bg-purple-100/50', text: 'text-purple-600', hover: 'group-hover:text-purple-600', shadow: 'hover:shadow-purple-500/10 hover:border-purple-100' },
};

const Features = () => {
    return (
        <section className="py-16 bg-white dark:bg-gray-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-50/50 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                            Why Choose ConvertPro?
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Fast, secure, and private tools designed for your workflow.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature, i) => {
                        const c = colorMap[feature.color];
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className={`group p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 hover:shadow-2xl ${c.shadow} transition-all duration-300 hover:-translate-y-1`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-14 h-14 shrink-0 rounded-2xl ${c.bg} flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${c.hover} transition-colors`}>{feature.title}</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;

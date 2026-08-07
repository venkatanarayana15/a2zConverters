import React from 'react';
import { motion } from 'framer-motion';
import {
    Check, Zap, Star, Crown, ArrowRight, X,
    Shield, Clock, Cloud, Users, Sparkles,
    HelpCircle, Layout, FileText, BadgeCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import BackLink from '../components/BackLink';

const Pricing = () => {
    const plans = [
        {
            id: 'day',
            name: '24h Pass',
            price: '₹49',
            period: '/day',
            description: 'Urgent tasks & quick fixes',
            features: [
                'Unlimited PDF Conversions',
                'Access to All Tools',
                'High Priority Processing',
                'No Ads',
            ],
            limit: '24 Hours Access',
            color: 'blue',
            icon: Zap,
            buttonGradient: 'from-blue-500 to-cyan-500',
            popular: false
        },
        {
            id: 'week',
            name: 'Week Pro',
            price: '₹199',
            period: '/week',
            description: 'Short-term projects',
            features: [
                'Everything in Day Pass',
                'Batch Processing',
                '10GB Cloud Storage',
                'OCR & eSign',
            ],
            limit: '7 Days Access',
            color: 'purple',
            icon: Star,
            buttonGradient: 'from-purple-500 to-pink-500',
            popular: true
        },
        {
            id: 'month',
            name: 'Month Elite',
            price: '₹499',
            period: '/month',
            description: 'Power users & teams',
            features: [
                'Everything in Week Pass',
                'Team Collaboration (3 Users)',
                'API Access (1k calls)',
                'Priority 24/7 Support',
            ],
            limit: '30 Days Access',
            color: 'orange',
            icon: Crown,
            buttonGradient: 'from-orange-400 to-amber-500',
            popular: false
        }
    ];

    const comparisonFeatures = [
        {
            category: 'Core Tools',
            items: [
                { name: 'Merge, Split, Compress', day: true, week: true, month: true },
                { name: 'Convert (Word, Excel, PPT)', day: true, week: true, month: true },
                { name: 'Edit PDF Text & Images', day: true, week: true, month: true },
            ]
        },
        {
            category: 'Advanced Features',
            items: [
                { name: 'OCR (Text Recognition)', day: false, week: true, month: true },
                { name: 'eSignature', day: true, week: true, month: true },
                { name: 'Password Protect/Unlock', day: true, week: true, month: true },
                { name: 'Batch Processing', day: false, week: true, month: true },
            ]
        },
        {
            category: 'Limits & Storage',
            items: [
                { name: 'Daily Conversions', day: 'Unlimited', week: 'Unlimited', month: 'Unlimited' },
                { name: 'Max File Size', day: '100MB', week: '2GB', month: '5GB' },
                { name: 'Cloud Storage', day: 'No', week: '10GB', month: '50GB' },
                { name: 'Ads', day: 'No Ads', week: 'No Ads', month: 'No Ads' },
            ]
        },
        {
            category: 'Support & Teams',
            items: [
                { name: 'Customer Support', day: 'Email', week: 'Priority Email', month: '24/7 Live Chat' },
                { name: 'Team Members', day: '1', week: '1', month: '3' },
                { name: 'API Access', day: '-', week: '-', month: '1,000 Calls' },
            ]
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-3">
                    <BackLink />
                </div>
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-5 duration-700 fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6 shadow-sm">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unlock Full Potential</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-6">
                        Simple Pricing. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
                            Professional Features.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        Choose the perfect plan for your needs. Whether it's a quick fix or a long-term project, we have you covered.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative z-10">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className={cn(
                                "relative rounded-3xl bg-white dark:bg-gray-900 border transition-[box-shadow] duration-300 flex flex-col",
                                plan.popular
                                    ? "border-purple-200 dark:border-purple-800 shadow-2xl shadow-purple-200/50 md:scale-105 z-10"
                                    : "border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:border-gray-200 dark:hover:border-gray-700"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-white" /> Most Popular
                                </div>
                            )}

                            <div className="p-8 flex-1">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
                                    plan.color === 'blue' && "bg-blue-100 text-blue-600",
                                    plan.color === 'purple' && "bg-purple-100 text-purple-600",
                                    plan.color === 'orange' && "bg-orange-100 text-orange-600",
                                )}>
                                    <plan.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{plan.description}</p>

                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{plan.price}</span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">{plan.period}</span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                                                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <button className={cn(
                                    "w-full py-4 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
                                    `bg-linear-to-r ${plan.buttonGradient}`
                                )}>
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </button>
                                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 font-medium flex items-center justify-center gap-1">
                                    <Shield className="w-3 h-3" /> Secure Payment
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Feature Comparison Table */}
                <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <div className="p-8 md:p-10 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Compare Plans</h2>
                        <p className="text-gray-600 dark:text-gray-400">Detailed breakdown of features and limits</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white dark:bg-gray-900">
                                    <th className="p-6 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">Features</th>
                                    <th className="p-6 text-center text-gray-900 dark:text-gray-100 font-bold bg-blue-50/30 dark:bg-blue-900/10 w-1/5">24h Pass</th>
                                    <th className="p-6 text-center text-purple-600 dark:text-purple-400 font-bold bg-purple-50/30 dark:bg-purple-900/10 w-1/5 border-x border-purple-100 dark:border-purple-800 relative">
                                        Week Pro
                                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                                    </th>
                                    <th className="p-6 text-center text-gray-900 dark:text-gray-100 font-bold bg-orange-50/30 dark:bg-orange-900/10 w-1/5">Month Elite</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {comparisonFeatures.map((section, sIdx) => (
                                    <React.Fragment key={sIdx}>
                                        <tr className="bg-gray-50/80 dark:bg-gray-800/80">
                                            <td colSpan={4} className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {section.category}
                                            </td>
                                        </tr>
                                        {section.items.map((item, iIdx) => (
                                            <tr key={iIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <td className="p-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <div className="flex items-center gap-2">
                                                        {item.name}
                                                        {item.name.includes('OCR') && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center bg-blue-50/10 dark:bg-blue-900/5">
                                                    {renderFeatureValue(item.day)}
                                                </td>
                                                <td className="p-6 text-center bg-purple-50/10 dark:bg-purple-900/5 border-x border-purple-50 dark:border-purple-900/20 font-medium">
                                                    {renderFeatureValue(item.week)}
                                                </td>
                                                <td className="p-6 text-center bg-orange-50/10 dark:bg-orange-900/5">
                                                    {renderFeatureValue(item.month)}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section (Optional enhancement) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5 }}
                    className="mt-24 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Can I cancel my subscription anytime?", a: "Yes! For the monthly plan, you can cancel anytime and you won't be charged for the next cycle. Day and Week passes expire automatically." },
                            { q: "Is my data secure?", a: "Absolutely. We use 256-bit SSL encryption and automatically delete your files from our servers after 1 hour of processing." },
                            { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee if you're not satisfied with our service, applicable for the Monthly plan." }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    {faq.q}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 ml-7">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Helper to render check/cross/text
const renderFeatureValue = (value) => {
    if (value === true) return <Check className="w-5 h-5 text-green-500 dark:text-green-400 mx-auto" />;
    if (value === false) return <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />;
    if (value === '-') return <span className="text-gray-300 dark:text-gray-600">-</span>;
    return <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{value}</span>;
};

export default Pricing;

import React from 'react';
import { User, Mail, Crown, LogOut, Shield, Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Profile = () => {
    const details = [
        { icon: Mail, label: 'Email', value: 'user@example.com' },
        { icon: Crown, label: 'Plan', value: 'Free' },
        { icon: Shield, label: 'Data Policy', value: 'All processing is local' },
        { icon: Calendar, label: 'Member Since', value: '2026' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-200/20 rounded-full blur-[120px] dark:bg-teal-900/15" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/20 rounded-full blur-[120px] dark:bg-purple-900/15" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 relative">
                <PageHeader
                    badge={{ icon: User, label: 'Account' }}
                    title="Your Profile"
                    subtitle="Manage your account details and preferences."
                    accent="teal"
                />
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 overflow-hidden">
                    <div className="h-28 bg-gradient-to-r from-teal-600 to-cyan-500 relative">
                        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22><rect width=%2220%22 height=%2220%22 fill=%22none%22/><path d=%22M0 10h20M10 0v20%22 stroke=%22white%22 stroke-width=%221%22/></svg>')]" />
                    </div>

                    <div className="px-8 pb-8 -mt-12 text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-lg">
                            D
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-4">Demo User</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Free Plan</p>

                        <div className="mt-8 space-y-3 text-left">
                            {details.map((item) => (
                                <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 shadow-sm dark:shadow-black/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-slate-400">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                            <User className="w-4 h-4" />
                            Account settings are available from the Settings menu in the top navigation.
                        </div>

                        <button
                            type="button"
                            className="mt-6 w-full flex items-center justify-center px-8 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

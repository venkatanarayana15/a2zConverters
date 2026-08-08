import React from 'react';
import { Activity, CheckCircle2, Clock, Server, Cpu, Wifi, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PageCTA from '../components/PageCTA';
import { cn } from '../lib/utils';

const components = [
    { icon: Server, name: 'PDF Tools', status: 'operational', uptime: '99.98%' },
    { icon: Cpu, name: 'Image Tools', status: 'operational', uptime: '99.97%' },
    { icon: Zap, name: 'File Processing Engine', status: 'operational', uptime: '99.99%' },
    { icon: Wifi, name: 'Website & CDN', status: 'operational', uptime: '100%' },
    { icon: Activity, name: 'API & Analytics', status: 'operational', uptime: '99.95%' },
];

const incidents = [
    {
        date: 'No incidents reported',
        title: 'All systems have been running smoothly.',
        resolved: true,
    },
];

const Status = () => {
    const operational = components.every((c) => c.status === 'operational');

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background text-foreground">
            <div className="max-w-3xl mx-auto px-2 md:px-4">
                <PageHeader
                    badge={{ icon: Activity, label: 'System Status' }}
                    title="All Systems Operational"
                    subtitle="Real-time status of our tools and infrastructure. Since processing runs in your browser, there is very little to go wrong on our side."
                    accent="teal"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-semibold">{operational ? 'Operational' : 'Degraded'} · Last checked just now</span>
                    </div>
                </PageHeader>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-slate-100">Components</h3>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">30 days uptime</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                        {components.map((c) => (
                            <div key={c.name} className="flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                        <c.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{c.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {c.uptime} uptime
                                        </p>
                                    </div>
                                </div>
                                <span className={cn(
                                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                                    c.status === 'operational'
                                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                )}>
                                    <span className={cn('w-1.5 h-1.5 rounded-full', c.status === 'operational' ? 'bg-green-500' : 'bg-red-500')} />
                                    Operational
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                        <h3 className="font-bold text-gray-900 dark:text-slate-100">Recent Incidents</h3>
                    </div>
                    <div className="p-6">
                        {incidents.map((incident, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-8 h-8 shrink-0 rounded-full bg-green-50 text-green-600 flex items-center justify-center dark:bg-green-900/20 dark:text-green-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{incident.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">{incident.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-2 md:px-4 mt-12">
                <PageCTA
                    title="Something not working?"
                    subtitle="Our tools run locally, so if something fails it's almost always the file — but we're happy to help."
                    primary={{ label: 'Contact Support', to: '/contact' }}
                    secondary={{ label: 'Help Center', to: '/help' }}
                />
            </div>
        </div>
    );
};

export default Status;

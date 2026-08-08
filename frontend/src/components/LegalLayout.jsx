import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import PageHeader from './PageHeader';

export const LegalHighlight = ({ children, icon: Icon }) => (
    <div className="flex items-start gap-3 rounded-2xl bg-teal-50/70 dark:bg-teal-900/15 border border-teal-100 dark:border-teal-800/40 px-5 py-4 mb-6">
        {Icon && (
            <span className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-800/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Icon className="w-4 h-4" />
            </span>
        )}
        <p className="text-sm text-teal-900 dark:text-teal-200 leading-relaxed">{children}</p>
    </div>
);

const LegalSection = ({ section, registerRef }) => (
    <section id={section.id} ref={registerRef} className="mb-12 scroll-mt-28">
        <div className="flex items-center gap-3 mb-5">
            <span className="shrink-0 w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <section.icon className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100">{section.title}</h2>
        </div>

        {section.highlight && <LegalHighlight icon={section.highlightIcon || Sparkles}>{section.highlight}</LegalHighlight>}

        <div className="space-y-4 text-gray-600 dark:text-slate-400 leading-relaxed pl-0 md:pl-13">
            {section.body.map((p, i) => (
                <p key={i}>{p}</p>
            ))}
        </div>
    </section>
);

const LegalLayout = ({ badge, title, subtitle, accent = 'teal', lastUpdated, sections }) => {
    const [activeId, setActiveId] = useState(sections[0]?.id);
    const sectionRefs = useRef({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
        );

        Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const registerRef = (el) => {
        if (el) sectionRefs.current[el.id] = el;
    };

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
                <PageHeader
                    badge={badge}
                    title={title}
                    subtitle={subtitle}
                    accent={accent}
                />
                <div className="max-w-5xl mx-auto">

                    {lastUpdated && (
                        <div className="flex justify-center -mt-4 mb-12">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full px-3.5 py-1.5 shadow-sm dark:shadow-black/20">
                                <CalendarDays className="w-3.5 h-3.5" />
                                Last updated: {lastUpdated}
                            </span>
                        </div>
                    )}

                    {/* Mobile TOC chips */}
                    <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-10 -mx-4 px-4">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={cn(
                                    'shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-colors',
                                    activeId === section.id
                                        ? 'bg-teal-600 text-white border-teal-600'
                                        : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700'
                                )}
                            >
                                <section.icon className="w-3.5 h-3.5" />
                                {section.title}
                            </a>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
                        {/* Desktop sticky TOC */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-28 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 p-5">
                                <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-4 px-3">
                                    On this page
                                </p>
                                <nav className="space-y-1">
                                    {sections.map((section) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className={cn(
                                                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                                                activeId === section.id
                                                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                                                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-primary/10 dark:hover:text-primary'
                                            )}
                                        >
                                            <section.icon className="w-4 h-4 shrink-0" />
                                            {section.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Content */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 p-8 md:p-10">
                            {sections.map((section) => (
                                <LegalSection key={section.id} section={section} registerRef={registerRef} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalLayout;

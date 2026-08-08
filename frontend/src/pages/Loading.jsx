import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import LoadingState from '../components/ui/LoadingState';
import SuccessState from '../components/ui/SuccessState';
import PageHeader from '../components/PageHeader';

const LoadingDemo = () => {
    const [progress, setProgress] = useState(null);
    const timerRef = useRef(null);

    const play = () => {
        clearInterval(timerRef.current);
        setProgress(0);
        timerRef.current = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(timerRef.current);
                    return 100;
                }
                return p + 5;
            });
        }, 100);
    };

    const reset = () => {
        clearInterval(timerRef.current);
        setProgress(null);
    };

    useEffect(() => () => clearInterval(timerRef.current), []);

    if (progress === null) {
        return (
            <button
                type="button"
                onClick={play}
                className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:scale-[1.02] transition-all"
            >
                Simulate Loading
            </button>
        );
    }

    return progress >= 100
        ? <SuccessState title="Loading complete!" description="The simulated load finished successfully." onDone={reset} doneLabel="Run Again" />
        : <LoadingState size="full" progress={progress} label="Processing your file…" />;
};

const Loading = () => (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-200/20 rounded-full blur-[120px] dark:bg-teal-900/15" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] dark:bg-blue-900/15" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
            <PageHeader
                badge={{ icon: Sparkles, label: 'Design System' }}
                title={<>Loading <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Page</span></>}
                subtitle="A full-screen loading state you can reuse while tools prepare your workspace."
                accent="teal"
            />

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-black/20 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-slate-100">Live Preview</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Hit simulate to watch the progress animate.</p>
                    </div>
                </div>
                <div className="p-6 bg-gray-50/50 dark:bg-slate-950/40">
                    <LoadingDemo />
                </div>
            </div>
        </div>
    </div>
);

export default Loading;

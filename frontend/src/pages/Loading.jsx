import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import LoadingState from '../components/ui/LoadingState';
import SuccessState from '../components/ui/SuccessState';
import BackLink from '../components/BackLink';

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
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
            <div className="mb-3">
                <BackLink />
            </div>
            <div className="text-center max-w-3xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 shadow-sm">
                    <Sparkles className="w-4 h-4 text-teal-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Design System</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
                    Loading <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Page</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    A full-screen loading state you can reuse while tools prepare your workspace.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">Live Preview</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Hit simulate to watch the progress animate.</p>
                    </div>
                </div>
                <div className="p-6 bg-gray-50/50 dark:bg-gray-950/40">
                    <LoadingDemo />
                </div>
            </div>
        </div>
    </div>
);

export default Loading;

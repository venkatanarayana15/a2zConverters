import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import NoInternetState from '../components/ui/NoInternetState';
import SlowNetworkState from '../components/ui/SlowNetworkState';
import NoResultsState from '../components/ui/NoResultsState';
import PermissionDeniedState from '../components/ui/PermissionDeniedState';
import SessionExpiredState from '../components/ui/SessionExpiredState';
import FormValidationState from '../components/ui/FormValidationState';
import SuccessState from '../components/ui/SuccessState';
import PageHeader from '../components/PageHeader';
import DemoToast from '../components/DemoToast';

const PatternCard = ({ name, description, children, reset }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100">{name}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">{description}</p>
            </div>
            {reset}
        </div>
        <div className="p-6 bg-gray-50/50 dark:bg-slate-950/40 flex items-center justify-center">
            {children}
        </div>
    </div>
);

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
            <button type="button" onClick={play} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg transition-all">
                Simulate Loading
            </button>
        );
    }

    return progress >= 100
        ? <SuccessState title="Loading complete!" description="The simulated load finished successfully." onDone={reset} doneLabel="Run Again" />
        : <LoadingState progress={progress} label="Processing your file…" />;
};

const SlowNetworkDemo = () => {
    const [state, setState] = useState({ running: false, progress: 0, elapsed: 0 });
    const timerRef = useRef(null);

    const play = () => {
        if (state.running) return;
        setState({ running: true, progress: 5, elapsed: 0 });
        const start = Date.now();
        timerRef.current = setInterval(() => {
            const seconds = Math.floor((Date.now() - start) / 1000);
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            setState((s) => {
                const next = s.progress + 3;
                if (next >= 92) {
                    clearInterval(timerRef.current);
                    return { running: false, progress: 92, elapsed: `${mins}:${secs.toString().padStart(2, '0')}` };
                }
                return { ...s, progress: next, elapsed: `${mins}:${secs.toString().padStart(2, '0')}` };
            });
        }, 500);
    };

    const reset = () => {
        clearInterval(timerRef.current);
        setState({ running: false, progress: 0, elapsed: 0 });
    };

    useEffect(() => () => clearInterval(timerRef.current), []);

    if (!state.running && state.progress === 0) {
        return (
            <button type="button" onClick={play} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg transition-all">
                Simulate Slow Network
            </button>
        );
    }

    return (
        <div className="w-full">
            <SlowNetworkState progress={state.progress} elapsed={state.elapsed} />
            {!state.running && (
                <div className="flex items-center justify-center pb-6 -mt-2">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-primary/10 dark:hover:text-primary dark:hover:border-primary/30 transition-all"
                    >
                        Run Again
                    </button>
                </div>
            )}
        </div>
    );
};

const SessionDemo = () => {
    const [active, setActive] = useState(false);
    if (active) {
        return (
            <div className="w-full flex items-center justify-center">
                <SessionExpiredState countdown={10} onSignIn={() => setActive(false)} onExpire={() => setActive(false)} />
            </div>
        );
    }
    return (
        <button type="button" onClick={() => setActive(true)} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:shadow-lg transition-all">
            Simulate Expired Session
        </button>
    );
};

const StatePatterns = () => {
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(null);
        setTimeout(() => setToast(message), 0);
    };

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-200/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px]" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
                <PageHeader
                    badge={{ icon: Sparkles, label: 'Design System' }}
                    title={<>State <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Patterns</span></>}
                    subtitle="Every state your UI can be in — ready to reuse across tools. Interactive ones can be played with."
                    accent="teal"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PatternCard name="Empty State" description="No items to show yet.">
                        <EmptyState />
                    </PatternCard>

                    <PatternCard name="Loading State" description="Indeterminate or progress-based.">
                        <LoadingDemo />
                    </PatternCard>

                    <PatternCard name="Error State" description="A request failed.">
                        <ErrorState onRetry={() => showToast('This is a demo — no request was made.')} />
                    </PatternCard>

                    <PatternCard name="No Internet" description="Device is offline.">
                        <NoInternetState onRetry={() => showToast('Reconnect is simulated in this demo.')} />
                    </PatternCard>

                    <PatternCard name="Slow Network" description="Long wait with live progress.">
                        <SlowNetworkDemo />
                    </PatternCard>

                    <PatternCard name="No Search Results" description="Query matched nothing.">
                        <NoResultsState onClearFilters={() => showToast('Filters cleared (demo).')} />
                    </PatternCard>

                    <PatternCard name="Permission Denied" description="Camera, mic or file access blocked.">
                        <PermissionDeniedState onOpenSettings={() => showToast('Opening settings is simulated here.')} />
                    </PatternCard>

                    <PatternCard name="Session Expired" description="Auto-redirect with countdown.">
                        <SessionDemo />
                    </PatternCard>

                    <PatternCard name="Form Validation" description="Inline field errors + success flow.">
                        <FormValidationState />
                    </PatternCard>

                    <PatternCard name="Success State" description="Completed action confirmation.">
                        <SuccessState onDone={() => showToast('Demo completed!')} />
                    </PatternCard>
                </div>
            </div>

            <DemoToast message={toast} />
        </div>
    );
};

export default StatePatterns;

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home, ArrowLeft, MonitorX } from 'lucide-react';
import ErrorState from './ui/ErrorState';
import { isBrowserSupported } from '../lib/browserSupport';

const quietButton = "inline-flex items-center px-6 py-3 rounded-xl font-bold text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-primary/10 dark:hover:text-primary transition-all";

const ErrorFallback = ({ onReset, unsupported }) => {
    const navigate = useNavigate();

    const goHome = useCallback(() => {
        onReset();
        navigate('/');
    }, [navigate, onReset]);

    const goBack = useCallback(() => {
        let from = null;
        try {
            from = sessionStorage.getItem('a2z_prev_path');
        } catch { /* ignore */ }
        onReset();
        navigate(from && from !== window.location.pathname ? from : '/');
    }, [navigate, onReset]);

    const retry = useCallback(() => {
        window.location.reload();
    }, []);

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-background text-foreground">
            <ErrorState
                badge={unsupported ? 'Browser not supported' : 'Oops'}
                title="This page failed to load"
                description={unsupported
                    ? 'Your browser is too old to run this page. This tool needs a modern browser — the latest Chrome, Edge, Firefox, or Safari 16 or newer. Try again, go back, or head to the homepage.'
                    : 'Something went wrong while loading this tool. Try again, go back, or head to the homepage.'}
                icon={unsupported ? MonitorX : undefined}
                tone={unsupported ? 'amber' : undefined}
                action={
                    <button type="button" onClick={retry} className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg dark:bg-none dark:bg-primary dark:text-white hover:scale-[1.02] transition-all">
                        <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                    </button>
                }
                secondaryAction={
                    <>
                        <button type="button" onClick={goBack} className={quietButton}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                        </button>
                        <button type="button" onClick={goHome} className={quietButton}>
                            <Home className="w-4 h-4 mr-2" /> Go Home
                        </button>
                    </>
                }
            />
        </div>
    );
};

class RouteErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Route error caught by boundary:', error, info);
        this.maybeAutoReload(error);
    }

    // When a lazy tool chunk fails to load (e.g. a stale tab references a
    // moved/renamed module, or an old build is cached after a deploy), the
    // import() rejects and this boundary renders. Reload once so the browser
    // fetches the current index.html / chunk URLs and the tool recovers
    // automatically.
    //
    // The timestamp guard prevents an infinite reload loop if the chunk
    // genuinely keeps failing: after an auto-reload we wait 30s before
    // allowing another one, and the guard self-expires (no explicit clearing
    // needed, so a successful page load can't race with a slow chunk error).
    maybeAutoReload(error) {
        const message = error?.message || '';
        const isChunkLoadFailure =
            error?.name === 'ChunkLoadError' ||
            /dynamically imported module/i.test(message) ||
            /error loading dynamically imported module/i.test(message) ||
            /Importing a module script failed/i.test(message) ||
            /Importing a module failed/i.test(message);
        if (!isChunkLoadFailure) return;

        let lastReload = 0;
        try {
            lastReload = parseInt(sessionStorage.getItem('a2z_boundary_reloaded_at') || '0', 10) || 0;
        } catch { /* ignore */ }

        const now = Date.now();
        if (now - lastReload < 30000) return;

        try {
            sessionStorage.setItem('a2z_boundary_reloaded_at', String(now));
        } catch { /* ignore */ }
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback onReset={() => this.setState({ hasError: false })} unsupported={!isBrowserSupported()} />;
        }
        return this.props.children;
    }
}

export default RouteErrorBoundary;

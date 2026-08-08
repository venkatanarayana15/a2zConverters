import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
            return;
        }

        const id = hash.slice(1);
        const scrollTo = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const timer = window.setTimeout(scrollTo, 400);
        return () => window.clearTimeout(timer);
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;

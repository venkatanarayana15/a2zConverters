import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const PrevPathTracker = () => {
    const { pathname } = useLocation();
    const prevPathRef = useRef(null);

    useEffect(() => {
        if (prevPathRef.current && prevPathRef.current !== pathname) {
            try {
                sessionStorage.setItem('a2z_prev_path', prevPathRef.current);
            } catch { /* ignore */ }
        }
        prevPathRef.current = pathname;
    }, [pathname]);

    return null;
};

export default PrevPathTracker;

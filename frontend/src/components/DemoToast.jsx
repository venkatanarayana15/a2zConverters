import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DemoToast = ({ message }) => {
    const [prevMessage, setPrevMessage] = useState(message);
    const [hidden, setHidden] = useState(false);

    if (message !== prevMessage) {
        setPrevMessage(message);
        if (message) setHidden(false);
    }

    useEffect(() => {
        if (!message || hidden) return;
        const timer = setTimeout(() => setHidden(true), 2000);
        return () => clearTimeout(timer);
    }, [message, hidden]);

    return (
        <div className="fixed inset-x-0 bottom-20 md:bottom-8 z-50 flex justify-center px-4 pointer-events-none">
            <AnimatePresence>
                {!hidden && message && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium shadow-lg dark:bg-slate-800 dark:text-slate-100 dark:border dark:border-slate-700 dark:shadow-black/40"
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DemoToast;

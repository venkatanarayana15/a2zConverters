import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import StateScreen from './StateScreen';

const LoadingState = ({ label = 'Loading…', progress, description, ...props }) => (
    <StateScreen
        icon={Loader2}
        tone="teal"
        iconClassName="animate-spin"
        title={label}
        description={description || (typeof progress === 'number' ? `${progress}%` : 'Please wait while we load your content.')}
        {...props}
    >
        {typeof progress === 'number' && (
            <div className="w-full max-w-xs mx-auto mb-6">
                <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                    />
                </div>
            </div>
        )}
    </StateScreen>
);

export default LoadingState;

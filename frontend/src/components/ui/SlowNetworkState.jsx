import React from 'react';
import { motion } from 'framer-motion';
import { Hourglass } from 'lucide-react';
import StateScreen from './StateScreen';

const SlowNetworkState = ({
    progress = 30,
    elapsed = '0:12',
    title = 'Still loading…',
    description = 'Your connection seems slow. Hang tight — this may take a moment.',
    badge = 'Slow Connection',
    ...props
}) => (
    <StateScreen
        icon={Hourglass}
        tone="orange"
        badge={badge}
        title={title}
        description={description}
        {...props}
    >
        <div className="w-full max-w-xs mx-auto mb-6">
            <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{progress}%</span>
                <span>Elapsed {elapsed}</span>
            </div>
        </div>
    </StateScreen>
);

export default SlowNetworkState;

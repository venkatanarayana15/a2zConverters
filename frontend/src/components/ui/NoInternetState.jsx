import React from 'react';
import { WifiOff } from 'lucide-react';
import StateScreen from './StateScreen';

const NoInternetState = ({
    onRetry,
    retryLabel = 'Retry',
    title = 'No internet connection',
    description = "You're offline. Check your connection and try again — your files stay safely on your device.",
    badge = 'Offline',
    ...props
}) => (
    <StateScreen
        icon={WifiOff}
        tone="amber"
        badge={badge}
        title={title}
        description={description}
        action={
            onRetry && (
                <button type="button" onClick={onRetry} className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:scale-[1.02] transition-all">
                    {retryLabel}
                </button>
            )
        }
        {...props}
    />
);

export default NoInternetState;

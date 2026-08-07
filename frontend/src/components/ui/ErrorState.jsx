import React from 'react';
import { AlertTriangle } from 'lucide-react';
import StateScreen from './StateScreen';

const primaryAction = "inline-flex items-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:scale-[1.02] transition-all";

const ErrorState = ({
    onRetry,
    retryLabel = 'Try Again',
    title = 'Something went wrong',
    description = "We couldn't complete your request. Please try again.",
    badge = 'Error',
    ...props
}) => (
    <StateScreen
        icon={AlertTriangle}
        tone="red"
        badge={badge}
        title={title}
        description={description}
        action={
            onRetry && (
                <button type="button" onClick={onRetry} className={primaryAction}>
                    {retryLabel}
                </button>
            )
        }
        {...props}
    />
);

export default ErrorState;

import React, { useEffect, useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import StateScreen from './StateScreen';

const SessionExpiredState = ({
    onSignIn,
    onExpire,
    signInLabel = 'Sign In Again',
    countdown = 10,
    title = 'Your session has ended',
    description = "For your security, you've been signed out after a period of inactivity.",
    badge = 'Session Expired',
    ...props
}) => {
    const [secondsLeft, setSecondsLeft] = useState(countdown);
    const expiredRef = useRef(false);

    useEffect(() => {
        setSecondsLeft(countdown);
    }, [countdown]);

    useEffect(() => {
        if (secondsLeft > 0) {
            expiredRef.current = false;
            const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
            return () => clearTimeout(id);
        }
        if (!expiredRef.current) {
            expiredRef.current = true;
            if (onExpire) onExpire();
        }
        return undefined;
    }, [secondsLeft, onExpire]);

    return (
        <StateScreen
            icon={Timer}
            tone="purple"
            badge={badge}
            title={title}
            description={description}
            action={
                onSignIn && (
                    <button type="button" onClick={onSignIn} className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:shadow-lg hover:scale-[1.02] transition-all">
                        {signInLabel}
                    </button>
                )
            }
            secondaryAction={
                <span className="text-sm text-gray-400 dark:text-gray-500">Redirecting in {secondsLeft}s</span>
            }
            {...props}
        />
    );
};

export default SessionExpiredState;

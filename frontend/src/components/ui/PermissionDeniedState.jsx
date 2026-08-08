import React from 'react';
import { ShieldAlert } from 'lucide-react';
import StateScreen from './StateScreen';

const PermissionDeniedState = ({
    onOpenSettings,
    settingsLabel = 'Open Settings',
    title = 'Access denied',
    description = 'We need your permission to use this feature. Allow it in your browser settings and try again.',
    badge = 'Permission Required',
    ...props
}) => (
    <StateScreen
        icon={ShieldAlert}
        tone="red"
        badge={badge}
        title={title}
        description={description}
        action={
            onOpenSettings && (
                <button type="button" onClick={onOpenSettings} className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg hover:scale-[1.02] transition-all">
                    {settingsLabel}
                </button>
            )
        }
        {...props}
    />
);

export default PermissionDeniedState;

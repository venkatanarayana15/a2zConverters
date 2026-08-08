import React, { useState, useCallback } from 'react';
import { inputClass, labelClass } from './shared';

const AccountSettings = ({ localFields, onLocalChange, onBlur }) => {
    const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

    const handleForgotPassword = useCallback(() => {
        setForgotPasswordSent(true);
        setTimeout(() => setForgotPasswordSent(false), 3000);
    }, []);

    return (
        <div className="space-y-5">
            <div>
                <label className={labelClass}>Display Name</label>
                <input type="text" value={localFields.displayName} onChange={(e) => onLocalChange('displayName', e.target.value)} onBlur={() => onBlur('displayName')} className={inputClass} placeholder="Enter your name" />
            </div>
            <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" value={localFields.email} onChange={(e) => onLocalChange('email', e.target.value)} onBlur={() => onBlur('email')} className={inputClass} placeholder="you@example.com" />
            </div>
            <hr className="border-gray-100 dark:border-slate-700" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Change Password</h4>
            <div>
                <label className={labelClass}>Current Password</label>
                <input type="password" value={localFields.currentPassword} onChange={(e) => onLocalChange('currentPassword', e.target.value)} onBlur={() => onBlur('currentPassword')} className={inputClass} placeholder="Enter current password" />
                <div className="flex justify-end mt-1.5">
                    <button type="button" onClick={handleForgotPassword} className="text-xs text-blue-400 hover:text-red-500 font-medium transition-colors mt-2 mb-1">
                        Forgot Password?
                    </button>
                </div>
                {forgotPasswordSent && (
                    <p className="text-xs text-green-600 font-medium mt-1">Password reset link sent to your email.</p>
                )}
            </div>
            {localFields.currentPassword && (
                <>
                    <div>
                        <label className={labelClass}>New Password</label>
                        <input type="password" value={localFields.newPassword} onChange={(e) => onLocalChange('newPassword', e.target.value)} onBlur={() => onBlur('newPassword')} className={inputClass} placeholder="Enter new password" />
                    </div>
                    <div>
                        <label className={labelClass}>Confirm Password</label>
                        <input type="password" value={localFields.confirmPassword} onChange={(e) => onLocalChange('confirmPassword', e.target.value)} onBlur={() => onBlur('confirmPassword')} className={inputClass} placeholder="Confirm new password" />
                    </div>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all dark:bg-none dark:bg-primary dark:text-white">
                        Update Password
                    </button>
                </>
            )}
        </div>
    );
};

export default AccountSettings;

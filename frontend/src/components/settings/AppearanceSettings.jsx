import React from 'react';
import { cn } from '../../lib/utils';
import { toggleClass, accentColors } from './shared';

const AppearanceSettings = ({ darkMode, accentColor, onChange }) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Switch to a darker theme</p>
            </div>
            <button onClick={() => onChange('darkMode', !darkMode)} className={cn(toggleClass, darkMode ? 'bg-blue-600' : 'bg-gray-300')}>
                <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200", darkMode ? 'translate-x-6' : 'translate-x-1')} />
            </button>
        </div>
        <hr className="border-gray-100 dark:border-gray-700" />
        <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Accent Color</p>
            <div className="flex gap-3">
                {accentColors.map(c => (
                    <button key={c.id} onClick={() => onChange('accentColor', c.id)} className={cn("w-9 h-9 rounded-full transition-all", c.class, accentColor === c.id ? `ring-2 ${c.ring} ring-offset-2 scale-110` : 'hover:scale-105')} />
                ))}
            </div>
        </div>
    </div>
);

export default AppearanceSettings;

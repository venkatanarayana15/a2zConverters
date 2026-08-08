import React, { useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { inputClass, labelClass, toggleClass } from './shared';
import { Trash2 } from 'lucide-react';

const StorageSettings = ({ autoDelete, autoDeleteHours, onChange }) => {
    const [cacheCleared, setCacheCleared] = useState(false);

    const handleClearCache = useCallback(() => {
        setCacheCleared(true);
        setTimeout(() => setCacheCleared(false), 2000);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className={labelClass}>Local Storage Usage</p>
                <div className="bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: '12%' }} />
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5">~1.2 MB used of 10 MB estimated</p>
            </div>
            <div>
                <button onClick={handleClearCache} className={cn("px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2", cacheCleared ? 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50')}>
                    <Trash2 className="w-4 h-4" />
                    {cacheCleared ? 'Cache Cleared!' : 'Clear Cache'}
                </button>
            </div>
            <hr className="border-gray-100 dark:border-slate-700" />
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Auto-Delete Files</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Automatically clear processed files</p>
                </div>
                <button onClick={() => onChange('autoDelete', !autoDelete)} className={cn(toggleClass, autoDelete ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600')}>
                    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200", autoDelete ? 'translate-x-6' : 'translate-x-1')} />
                </button>
            </div>
            {autoDelete && (
                <div>
                    <label className={labelClass}>Delete After</label>
                    <select value={autoDeleteHours} onChange={(e) => onChange('autoDeleteHours', parseInt(e.target.value))} className={inputClass}>
                        <option value={1}>1 Hour</option>
                        <option value={6}>6 Hours</option>
                        <option value={12}>12 Hours</option>
                        <option value={24}>24 Hours</option>
                        <option value={72}>3 Days</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default StorageSettings;

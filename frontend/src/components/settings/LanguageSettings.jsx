import React from 'react';
import { cn } from '../../lib/utils';
import { inputClass, labelClass } from './shared';

const LanguageSettings = ({ language, unit, dateFormat, onChange }) => (
    <div className="space-y-6">
        <div>
            <label className={labelClass}>Language</label>
            <select value={language} onChange={(e) => onChange('language', e.target.value)} className={inputClass}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
            </select>
        </div>
        <div>
            <label className={labelClass}>Measurement Unit</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                {['px', 'cm', 'inch'].map(u => (
                    <button key={u} onClick={() => onChange('unit', u)} className={cn("py-2 rounded-lg text-sm font-medium transition-all", unit === u ? 'bg-white shadow-sm text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200')}>
                        {u === 'px' ? 'Pixels' : u === 'cm' ? 'CM' : 'Inches'}
                    </button>
                ))}
            </div>
        </div>
        <div>
            <label className={labelClass}>Date Format</label>
            <select value={dateFormat} onChange={(e) => onChange('dateFormat', e.target.value)} className={inputClass}>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            </select>
        </div>
    </div>
);

export default LanguageSettings;

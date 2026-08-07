import React from 'react';
import { cn } from '../../lib/utils';
import { inputClass, labelClass } from './shared';

const ExportSettings = ({ imageQuality, defaultFormat, pdfCompression, onChange }) => (
    <div className="space-y-6">
        <div>
            <div className="flex justify-between mb-2">
                <label className={labelClass}>Image Quality</label>
                <span className="text-sm font-bold text-blue-600">{imageQuality}%</span>
            </div>
            <input type="range" min="10" max="100" value={imageQuality} onChange={(e) => onChange('imageQuality', parseInt(e.target.value))} className="w-full accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
            <label className={labelClass}>Default Output Format</label>
            <select value={defaultFormat} onChange={(e) => onChange('defaultFormat', e.target.value)} className={inputClass}>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
            </select>
        </div>
        <div>
            <label className={labelClass}>PDF Compression</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                {['low', 'medium', 'high'].map(level => (
                    <button key={level} onClick={() => onChange('pdfCompression', level)} className={cn("py-2 rounded-lg text-sm font-medium transition-all", pdfCompression === level ? 'bg-white shadow-sm text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200')}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default ExportSettings;

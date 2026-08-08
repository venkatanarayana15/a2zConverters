import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { formatBytes } from '../../lib/pdfUtils';
import { cn } from '../../lib/utils';

const ToolDropzone = ({ files, onChange, accept = '.pdf', multiple = false, label = 'Drop files here', hint = 'or click to browse', accent = 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' }) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = Array.from(e.dataTransfer.files);
        if (!multiple) {
            onChange(dropped.slice(0, 1));
        } else {
            onChange((prev) => [...prev, ...dropped]);
        }
    }, [multiple, onChange]);

    const handleChange = (e) => {
        const selected = Array.from(e.target.files);
        if (!multiple) {
            onChange(selected.slice(0, 1));
        } else {
            onChange((prev) => [...prev, ...selected]);
        }
        e.target.value = '';
    };

    const removeFile = (index) => {
        onChange((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
                'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group',
                dragging
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10 shadow-lg shadow-teal-500/10 scale-[1.01]'
                    : 'border-gray-300 dark:border-slate-700 hover:bg-gray-50 hover:border-gray-400 dark:hover:bg-primary/5 dark:hover:border-primary/30'
            )}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
                className="hidden"
            />
            {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4">
                    <div className={cn('w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform', accent)}>
                        <Upload className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-slate-100">{label}</h3>
                    <p className="text-gray-500 mb-4 dark:text-slate-400">{hint}</p>
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-teal-900/20 dark:group-hover:text-teal-400">
                        <Upload className="w-3.5 h-3.5" />
                        Browse files
                    </span>
                </div>
            ) : (
                <div className="space-y-2 text-left" onClick={(e) => e.stopPropagation()}>
                    {files.map((file, i) => (
                        <div key={i} className={cn('flex items-center gap-3 p-3 rounded-xl border transition-all', accent.includes('bg-') ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700' : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700')}>
                            <div className={cn('w-9 h-9 shrink-0 rounded-lg flex items-center justify-center', accent)}>
                                <FileIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-slate-100">{file.name}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">{formatBytes(file.size)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {multiple && (
                        <p className="text-xs text-center text-gray-400 pt-2 dark:text-slate-400">
                            Click to add more files
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ToolDropzone;

import React, { useCallback, useRef } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { formatBytes } from '../../lib/pdfUtils';

const ToolDropzone = ({ files, onChange, accept = '.pdf', multiple = false, label = 'Drop files here', hint = 'or click to browse', accent = 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400' }) => {
    const inputRef = useRef(null);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
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
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer dark:border-gray-700 dark:hover:bg-gray-800"
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
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${accent}`}>
                        <Upload className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-gray-100">{label}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{hint}</p>
                </div>
            ) : (
                <div className="space-y-2 text-left" onClick={(e) => e.stopPropagation()}>
                    {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${accent}`}>
                                <FileIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">{file.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
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
                        <p className="text-xs text-center text-gray-400 dark:text-gray-500 pt-2">
                            Click to add more files
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ToolDropzone;

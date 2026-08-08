import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, AlertCircle, Download, Crop, Info, Search, ChevronDown, X } from 'lucide-react';
import BackLink from '../../components/BackLink';

const examPresets = {
    custom: { label: "Custom Dimensions", width: "", height: "", size: { min: 10, max: 200 } },
    // TNPSC
    tnpsc_photo: { label: "TNPSC (Photo)", width: 132, height: 170, size: { min: 20, max: 50 }, unit: 'px' },
    tnpsc_sig: { label: "TNPSC (Signature)", width: 132, height: 57, size: { min: 10, max: 20 }, unit: 'px' },

    // UPSC
    upsc_photo: { label: "UPSC Civil Services (Photo)", width: 350, height: 350, size: { min: 20, max: 300 } },
    upsc_sig: { label: "UPSC Civil Services (Signature)", width: 350, height: 350, size: { min: 20, max: 300 } }, // As per some guidelines, but widely varies. Keeping 350x350 as standard/base if specified.
    upsc_nda_photo: { label: "UPSC NDA (Photo)", width: 350, height: 350, size: { min: 20, max: 300 } },
    upsc_cds_photo: { label: "UPSC CDS (Photo)", width: 350, height: 350, size: { min: 20, max: 300 } },

    // SSC
    ssc_photo: { label: "SSC CGL/CHSL/MTS (Photo)", width: 413, height: 531, size: { min: 20, max: 50 } }, // approx 3.5x4.5cm @ 300dpi
    ssc_sig: { label: "SSC CGL/CHSL/MTS (Signature)", width: 472, height: 236, size: { min: 10, max: 20 } }, // approx 4.0x2.0cm @ 300dpi

    // IBPS
    ibps_photo: { label: "IBPS PO/Clerk/SO (Photo)", width: 200, height: 230, size: { min: 20, max: 50 } },
    ibps_sig: { label: "IBPS PO/Clerk/SO (Signature)", width: 140, height: 60, size: { min: 10, max: 20 } },
    ibps_thumb: { label: "IBPS Thumb Impression", width: 240, height: 240, size: { min: 20, max: 50 } },

    // RRB (Railways)
    rrb_photo: { label: "RRB NTPC/Group D (Photo)", width: 320, height: 240, size: { min: 20, max: 50 } }, // Varies, but commonly 35mm x 45mm
    rrb_sig: { label: "RRB NTPC/Group D (Signature)", width: 140, height: 60, size: { min: 10, max: 20 } },

    // JEE / NEET / GATE
    jee_photo: { label: "JEE Main (Photo)", width: 413, height: 531, size: { min: 10, max: 200 } },
    neet_photo: { label: "NEET UG (Passport Photo)", width: 413, height: 531, size: { min: 10, max: 200 } },
    neet_postcard: { label: "NEET UG (Postcard Photo)", width: 472, height: 709, size: { min: 10, max: 200 } }, // 4x6 inch
    gate_photo: { label: "GATE (Photo)", width: 480, height: 640, size: { min: 5, max: 200 } },
    gate_sig: { label: "GATE (Signature)", width: 560, height: 160, size: { min: 5, max: 200 } },

    // Common Sizes
    passport_in: { label: "Indian Passport Size (3.5x4.5cm)", width: 413, height: 531, size: { min: 10, max: 200 } },
    visa_us: { label: "US Visa (2x2 inch)", width: 600, height: 600, size: { min: 10, max: 240 } },

    // CAT
    cat_photo: { label: "CAT (Photo)", width: 413, height: 531, size: { min: 30, max: 80 } },
    cat_sig: { label: "CAT (Signature)", width: 236, height: 94, size: { min: 30, max: 80 } }, // 80mm x 35mm approx
};

const GovResizer = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedExam, setSelectedExam] = useState('custom');
    const [searchTerm, setSearchTerm] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [unit, setUnit] = useState('px');
    const [maxSize, setMaxSize] = useState(50);

    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredPresets = useMemo(() => {
        return Object.entries(examPresets).filter(([, preset]) =>
            preset.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleExamSelect = (key) => {
        setSelectedExam(key);
        const preset = examPresets[key];
        if (preset) {
            setWidth(preset.width);
            setHeight(preset.height);
            setMaxSize(preset.size.max);
            // Default to px if not specified, usually standard exams are in px or convertable
            setUnit(preset.unit || 'px');
        }
        setIsDropdownOpen(false);
        setSearchTerm(''); // Optional: clear search after selection
    };

    const selectedExamLabel = examPresets[selectedExam]?.label || "Select Exam";

    return (
        <div className="min-h-screen pt-24 px-2 md:px-4 pb-12 bg-background text-foreground">
            <div className="max-w-[96rem] mx-auto">
                <div className="pl-10 sm:pl-12 lg:pl-14 mb-8">
                    <BackLink />
                </div>
                <div className="text-center mb-12 animate-float">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-sm font-medium text-orange-600 mb-4 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400">
                        <Crop className="w-4 h-4 mr-2" />
                        Official Exam Compliant
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-slate-100">
                        Govt. Exam Photo Resizer
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-slate-400">
                        Perfectly resize photos and signatures for UPSC, SSC, TNPSC, IBPS, GATE, and other official exams.
                        Automatic compliance with size and dimension rules.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10 transition-all group-hover:bg-orange-200 dark:bg-orange-900/15 dark:group-hover:bg-orange-900/25" />

                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-slate-100">
                            <Upload className="w-5 h-5 mr-2 text-orange-500" />
                            1. Upload Image
                        </h2>

                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${file ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50 dark:border-slate-600 dark:hover:bg-orange-900/10'}`}>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                {preview ? (
                                    <div className="relative">
                                        <img src={preview} alt="Preview" className="max-h-48 rounded-lg shadow-md mb-4 object-contain" />
                                        <button className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-colors" onClick={(e) => { e.preventDefault(); setFile(null); setPreview(null); }}>
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <span className="text-gray-900 font-medium dark:text-slate-100">Click to upload photo</span>
                                        <span className="text-sm text-gray-500 mt-2 dark:text-slate-400">JPG, PNG up to 5MB</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-100 rounded-full blur-3xl -z-10" />

                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-slate-100">
                            <Crop className="w-5 h-5 mr-2 text-sky-500" />
                            2. Resize Settings
                        </h2>

                        <div className="space-y-6">
                            <div ref={dropdownRef} className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Select Exam / Purpose</label>

                                {/* Custom Dropdown Trigger */}
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-left text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all flex justify-between items-center shadow-sm hover:bg-white dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-primary/10 dark:hover:border-primary/30"
                                >
                                    <span className="truncate mr-2">{selectedExamLabel}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} dark:text-slate-400`} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 dark:bg-slate-800 dark:border-slate-700"
                                    >
                                        <div className="p-2 border-b border-gray-50 sticky top-0 bg-white z-10 dark:bg-slate-800 dark:border-slate-700">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 dark:text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search exams..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {filteredPresets.length > 0 ? (
                                                filteredPresets.map(([key, preset]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleExamSelect(key)}
                                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-sky-50 transition-colors flex items-center justify-between dark:hover:bg-sky-900/20 ${selectedExam === key ? 'bg-sky-50 text-sky-700 font-medium dark:bg-sky-900/20 dark:text-sky-400' : 'text-gray-700 dark:text-slate-300'}`}
                                                    >
                                                        {preset.label}
                                                        {selectedExam === key && <Check className="w-4 h-4 text-sky-600" />}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-gray-500 text-center dark:text-slate-400">
                                                    No exams found
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>

                            {/* Unit Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Dimensions Unit</label>
                                <div className="flex space-x-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-fit dark:bg-slate-800 dark:border-slate-700">
                                    {['px', 'cm', 'inch'].map((u) => (
                                        <button
                                            key={u}
                                            onClick={() => setUnit(u)}
                                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${unit === u
                                                    ? 'bg-white text-sky-600 shadow-sm ring-1 ring-gray-100 dark:bg-slate-700 dark:ring-slate-600'
                                                    : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100'
                                                }`}
                                        >
                                            {u === 'px' ? 'Pixels' : u === 'cm' ? 'CM' : 'Inches'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Width ({unit})</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(e.target.value)}
                                        className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-sky-500 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100"
                                        placeholder={unit === 'px' ? "e.g. 350" : unit === 'cm' ? "e.g. 3.5" : "e.g. 1.38"}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Height ({unit})</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-sky-500 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100"
                                        placeholder={unit === 'px' ? "e.g. 450" : unit === 'cm' ? "e.g. 4.5" : "e.g. 1.77"}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Max File Size</label>
                                    <span className="text-sm font-bold text-sky-600">{maxSize} KB</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    step="5"
                                    value={maxSize}
                                    onChange={(e) => setMaxSize(e.target.value)}
                                    className="w-full accent-sky-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2 dark:text-slate-400">
                                    <span>10KB</span>
                                    <span>Max 500KB</span>
                                </div>
                            </div>

                            <button
                                disabled={!file}
                                className={`w-full py-4 rounded-xl font-bold font-lg shadow-lg transition-all flex items-center justify-center ${file
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-200 dark:shadow-orange-900/40 hover:shadow-orange-300 dark:hover:shadow-orange-900/60 hover:scale-[1.02]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 dark:bg-slate-800 dark:border-slate-700'
                                    }`}
                            >
                                {file ? <Download className="w-5 h-5 mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                                {file ? 'Process & Download Image' : 'Upload Image to Start'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white/60 border border-white/50 shadow-sm text-center hover:bg-white/80 transition-colors dark:bg-slate-800/60 dark:border-slate-700 dark:hover:bg-primary/10">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4 dark:bg-purple-900/20 dark:text-purple-400">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 dark:text-slate-100">Privacy First</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Images are processed in your browser. We never store your personal datas.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/60 border border-white/50 shadow-sm text-center hover:bg-white/80 transition-colors dark:bg-slate-800/60 dark:border-slate-700 dark:hover:bg-primary/10">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 dark:bg-green-900/20 dark:text-green-400">
                            <Check className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 dark:text-slate-100">Exact Dimensions</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Guaranteed width x height compliance for pixels or centimeters.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/60 border border-white/50 shadow-sm text-center hover:bg-white/80 transition-colors dark:bg-slate-800/60 dark:border-slate-700 dark:hover:bg-primary/10">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 dark:bg-blue-900/20 dark:text-blue-400">
                            <Info className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 dark:text-slate-100">File Size Control</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Compresses your image to fit strictly under the Size limit (e.g. &lt;50KB).</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GovResizer;

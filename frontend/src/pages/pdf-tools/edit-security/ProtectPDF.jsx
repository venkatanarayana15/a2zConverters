import React, { useState } from 'react';
import { ShieldCheck, Download, Lock } from 'lucide-react';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const permissions = [
    { key: 'allowPrinting', label: 'Allow printing' },
    { key: 'allowCopying', label: 'Allow copying text & images' },
    { key: 'allowModifying', label: 'Allow editing content' },
    { key: 'allowAnnotating', label: 'Allow adding comments' },
    { key: 'allowFillingForms', label: 'Allow filling forms' },
];

const ProtectPDF = () => {
    const [file, setFile] = useState([]);
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [perms, setPerms] = useState({
        allowPrinting: true,
        allowCopying: true,
        allowModifying: false,
        allowAnnotating: false,
        allowFillingForms: true,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const togglePerm = (key) => setPerms((p) => ({ ...p, [key]: !p[key] }));

    const handleProtect = async () => {
        if (!file[0]) return;
        if (!password) {
            setError('Please enter a password to protect your PDF.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const bytes = await file[0].arrayBuffer();
            const encrypted = await encryptPDF(new Uint8Array(bytes), password, perms);
            const blob = new Blob([encrypted], { type: 'application/pdf' });
            downloadBlob(blob, `${stripExtension(file[0].name)}_protected.pdf`);
            setResult({ size: encrypted.byteLength });
        } catch {
            setError('Could not protect this PDF. Please make sure it is a valid PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={ShieldCheck} badge="Edit & Security" title="Protect PDF" subtitle="Lock your PDF with a password and control what others can do with it." accent="purple">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} label="Drop a PDF here" hint="or click to browse" />

                {file[0] && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                                    <Lock className="w-4 h-4 inline mr-1 text-purple-600" /> Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Required to open the PDF"
                                    className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                                    <Lock className="w-4 h-4 inline mr-1 text-purple-600" /> Confirm password
                                </label>
                                <input
                                    type="password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Repeat the password"
                                    className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Permissions</label>
                            <div className="space-y-2">
                                {permissions.map((p) => (
                                    <button
                                        key={p.key}
                                        onClick={() => togglePerm(p.key)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${perms[p.key]
                                            ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
                                            : 'bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700'
                                        }`}
                                    >
                                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{p.label}</span>
                                        <span className={`w-9 h-5 rounded-full relative transition-all ${perms[p.key] ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
                                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${perms[p.key] ? 'left-4' : 'left-0.5'}`} />
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2 dark:text-slate-400">Note: PDF permissions are advisory and honored by conforming readers.</p>
                        </div>
                    </>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> PDF protected</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{formatBytes(result.size)} — the download has started.</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleProtect}
                    disabled={!file[0] || !password || !confirm}
                    isProcessing={isProcessing}
                    processingText="Protecting PDF..."
                    accent="from-purple-600 to-violet-600 shadow-purple-200 dark:shadow-purple-900/40 hover:shadow-purple-300 dark:hover:shadow-purple-900/60"
                >
                    <ShieldCheck className="w-5 h-5 mr-2" /> Protect PDF
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default ProtectPDF;

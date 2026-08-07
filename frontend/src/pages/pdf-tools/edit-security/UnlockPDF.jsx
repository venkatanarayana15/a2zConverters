import React, { useState } from 'react';
import { Unlock, Download, Lock } from 'lucide-react';
import { isEncrypted, decryptPDF } from '@pdfsmaller/pdf-decrypt';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';
import ProcessButton from '../../../components/ui/ProcessButton';
import { downloadBlob, stripExtension, formatBytes } from '../../../lib/pdfUtils';

const UnlockPDF = () => {
    const [file, setFile] = useState([]);
    const [password, setPassword] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleFile = (files) => {
        setFile(files);
        setError(null);
        setResult(null);
        setPasswordRequired(false);
        setPassword('');
        if (files[0]) {
            files[0].arrayBuffer().then(async (buf) => {
                const check = await isEncrypted(new Uint8Array(buf));
                if (check && check.encrypted) {
                    setPasswordRequired(true);
                    setError('This PDF is password protected. Enter the password to unlock it.');
                }
            }).catch(() => {});
        }
    };

    const handleUnlock = async () => {
        if (!file[0]) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);
        try {
            const bytes = await file[0].arrayBuffer();
            const unlocked = await decryptPDF(new Uint8Array(bytes), password);
            let pages = 0;
            try {
                const doc = await PDFDocument.load(unlocked, { ignoreEncryption: true });
                pages = doc.getPageCount();
            } catch { /* page count is optional */ }
            const blob = new Blob([unlocked], { type: 'application/pdf' });
            downloadBlob(blob, `${stripExtension(file[0].name)}_unlocked.pdf`);
            setResult({ size: unlocked.byteLength, pages });
            setPasswordRequired(false);
        } catch {
            setError('Could not unlock this PDF. The password may be incorrect or the file is invalid.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout icon={Unlock} badge="Edit & Security" title="Unlock PDF" subtitle="Remove password protection from your PDF and download an open copy." accent="green">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800 space-y-6">
                <ToolDropzone files={file} onChange={handleFile} label="Drop a locked PDF here" hint="or click to browse" />

                {passwordRequired && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                            <Lock className="w-4 h-4 inline mr-1 text-green-600" /> PDF Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter document password"
                            className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100"
                        />
                    </div>
                )}

                {error && <p className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</p>}

                {result && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="w-4 h-4" /> Unlocked successfully</p>
                        <p className="text-sm text-green-600 dark:text-green-500">{result.pages} pages · {formatBytes(result.size)}</p>
                    </div>
                )}

                <ProcessButton
                    onClick={handleUnlock}
                    disabled={!file[0] || (passwordRequired && !password)}
                    isProcessing={isProcessing}
                    processingText="Unlocking PDF..."
                    accent="from-green-600 to-emerald-600 shadow-green-200 hover:shadow-green-300"
                >
                    <Unlock className="w-5 h-5 mr-2" /> {passwordRequired ? 'Unlock with Password' : 'Unlock PDF'}
                </ProcessButton>
            </div>
        </ToolLayout>
    );
};

export default UnlockPDF;

import React, { useState } from 'react';
import { Presentation, Info } from 'lucide-react';
import ToolLayout from '../../../components/ui/ToolLayout';
import ToolDropzone from '../../../components/ui/ToolDropzone';

const PowerPointToPDF = () => {
    const [file, setFile] = useState([]);

    return (
        <ToolLayout icon={Presentation} badge="Convert to PDF" title="PowerPoint to PDF" subtitle="Turn your PowerPoint slides into a PDF presentation you can share anywhere." accent="orange">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <ToolDropzone files={file} onChange={setFile} accept=".pptx,.ppt" label="Drop a PowerPoint here" hint="or click to browse (.pptx)" accent="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" />

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                    <p className="font-bold flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 shrink-0" /> Server-side conversion required
                    </p>
                    <p>
                        Converting PowerPoint slides to PDF needs server-side processing. This tool will work once the
                        backend conversion service is enabled — the file you select is kept in your browser and never uploaded
                        until conversion is available.
                    </p>
                </div>
            </div>
        </ToolLayout>
    );
};

export default PowerPointToPDF;

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Presentation, Table2, FileImage, Archive, ArrowRight } from 'lucide-react';

const options = [
    { name: 'PDF to JPG', desc: 'Convert every page to a JPG image', path: '/pdf-to-jpg', icon: FileImage, color: 'text-amber-600 bg-amber-50' },
    { name: 'PDF to Word', desc: 'Get an editable DOCX document', path: '/pdf-to-word', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { name: 'PDF to PowerPoint', desc: 'Turn your PDF into a PPTX deck', path: '/pdf-to-powerpoint', icon: Presentation, color: 'text-orange-600 bg-orange-50' },
    { name: 'PDF to Excel', desc: 'Extract content into an XLSX workbook', path: '/pdf-to-excel', icon: Table2, color: 'text-green-600 bg-green-50' },
    { name: 'PDF to PDF/A', desc: 'Create an archival PDF/A file', path: '/pdf-to-pdfa', icon: Archive, color: 'text-purple-600 bg-purple-50' },
];

const ConvertFromPDF = () => {
    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50 text-gray-900">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-sm font-medium text-indigo-600 mb-4">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Convert from PDF
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-500">
                        Convert PDF to other formats
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Pick a target format and turn your PDF into JPG, Word, PowerPoint, Excel, or an archival PDF/A file.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {options.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.path}
                                to={tool.path}
                                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                            >
                                <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-4`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-sm text-gray-500">{tool.desc}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ConvertFromPDF;

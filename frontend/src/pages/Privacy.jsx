import React from 'react';
import { ShieldCheck, HeartHandshake, Database, Cookie, ExternalLink, UserCheck, Mail, FileLock2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import LegalLayout from '../components/LegalLayout';

const sections = [
    {
        id: 'promise',
        icon: HeartHandshake,
        title: 'Our promise',
        highlight: 'Your files are yours. Everything runs locally in your browser — nothing is uploaded, stored, or tracked.',
        highlightIcon: FileLock2,
        body: [
            'a2zconverters is built around a simple principle: your files are yours. All conversion, compression, and editing is performed locally in your browser. Your documents and images never leave your device.',
        ],
    },
    {
        id: 'collect',
        icon: Database,
        title: 'What we collect',
        highlight: 'We collect nothing about your files and require no account to use the tools.',
        highlightIcon: ShieldCheck,
        body: [
            'We do not collect, upload, or store the files you process. We do not require an account to use the tools.',
            'We may store minimal preference data — such as your theme choice and default export settings — in your browser\u2019s local storage. This data never leaves your device and can be cleared at any time from the Settings panel.',
        ],
    },
    {
        id: 'cookies',
        icon: Cookie,
        title: 'Cookies & analytics',
        body: [
            'We do not use tracking cookies. Anonymous, aggregate analytics may be used to understand how the tools are used so we can improve them, but this never includes the content of your files.',
        ],
    },
    {
        id: 'third-parties',
        icon: ExternalLink,
        title: 'Third parties',
        body: [
            'Because processing happens on your device, no files are transmitted to third parties. Where we link to external resources, those parties have their own privacy policies.',
        ],
    },
    {
        id: 'rights',
        icon: UserCheck,
        title: 'Your rights',
        body: [
            'Since we hold no data about you, there is nothing to export or delete on our servers. You can clear locally stored preferences at any time in your browser.',
        ],
    },
    {
        id: 'contact',
        icon: Mail,
        title: 'Contact',
        body: [
            <React.Fragment key="contact">
                Questions about this policy? Reach us at <span className="inline-flex items-center gap-1.5 font-medium text-teal-600 dark:text-teal-400"><Mail className="w-4 h-4" /> support@a2zconverters.com</span> or via our <Link to="/contact" className="text-teal-600 dark:text-teal-400 hover:underline">contact page</Link>.
            </React.Fragment>,
        ],
    },
];

const Privacy = () => (
    <LegalLayout
        badge={{ icon: ShieldCheck, label: 'Legal' }}
        accent="teal"
        title="Privacy Policy"
        subtitle="How we handle your files, your data, and your trust."
        lastUpdated="August 3, 2026"
        sections={sections}
    />
);

export default Privacy;

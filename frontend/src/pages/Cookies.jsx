import React from 'react';
import { Cookie, Settings, ShieldCheck, Sparkles, UserCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import LegalLayout from '../components/LegalLayout';

const sections = [
    {
        id: 'what-are',
        icon: Cookie,
        title: 'What are cookies?',
        body: [
            'Cookies are small text files stored on your device by websites you visit. They are used widely to remember preferences, keep you signed in, and understand how sites are used.',
        ],
    },
    {
        id: 'ours',
        icon: ShieldCheck,
        title: 'How we use cookies',
        highlight: 'a2zconverters does not use tracking cookies. We only store minimal preferences on your own device.',
        highlightIcon: ShieldCheck,
        body: [
            'Because every tool runs locally in your browser, we have no need for cookies that track you across sites or profile your behaviour.',
            'We may store simple preference data — such as your theme choice and default export settings — in your browser\u2019s local storage so your experience stays consistent between visits.',
        ],
    },
    {
        id: 'manage',
        icon: Settings,
        title: 'Managing your preferences',
        body: [
            <React.Fragment key="manage">
                You can clear or update these preferences at any time from the <span className="font-medium text-teal-600 dark:text-teal-400">Settings</span> panel in the top navigation, or by clearing your browser\u2019s site data.
            </React.Fragment>,
        ],
    },
    {
        id: 'analytics',
        icon: Sparkles,
        title: 'Analytics',
        body: [
            'Anonymous, aggregate analytics may be used to understand how our tools are used and to improve them. This never includes the content of your files, and it is never used to identify you personally.',
        ],
    },
    {
        id: 'changes',
        icon: UserCheck,
        title: 'Changes to this policy',
        body: [
            'If we change how we use cookies or local storage, we will update this page and revise the \u201clast updated\u201d date below.',
        ],
    },
    {
        id: 'contact',
        icon: Mail,
        title: 'Contact',
        body: [
            <React.Fragment key="contact">
                Questions about cookies? Reach us at <span className="inline-flex items-center gap-1.5 font-medium text-teal-600 dark:text-teal-400"><Mail className="w-4 h-4" /> support@a2zconverters.com</span> or via our <Link to="/contact" className="text-teal-600 dark:text-teal-400 hover:underline">contact page</Link>.
            </React.Fragment>,
        ],
    },
];

const Cookies = () => (
    <LegalLayout
        badge={{ icon: Cookie, label: 'Legal' }}
        accent="teal"
        title="Cookie Policy"
        subtitle="What cookies we use, why, and how to manage them."
        lastUpdated="August 3, 2026"
        sections={sections}
    />
);

export default Cookies;

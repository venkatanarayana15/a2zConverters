import React from 'react';
import { Scale, FileCheck2, Hammer, Copyright, AlertTriangle, ShieldX, RefreshCw, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import LegalLayout from '../components/LegalLayout';

const sections = [
    {
        id: 'acceptance',
        icon: FileCheck2,
        title: 'Acceptance of terms',
        body: [
            'By accessing or using a2zconverters, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.',
        ],
    },
    {
        id: 'use',
        icon: Scale,
        title: 'Use of the service',
        body: [
            'Our tools are provided free of charge for your personal and professional use. You agree not to use the service for any unlawful purpose or to process files you do not have the right to process.',
        ],
    },
    {
        id: 'acceptable-use',
        icon: Hammer,
        title: 'Acceptable use',
        highlight: 'Process only files you own or have permission to use — and never attempt to disrupt the service.',
        highlightIcon: AlertTriangle,
        body: [
            'You agree not to: upload or process content that infringes on others\u2019 rights; attempt to disrupt, overload, or gain unauthorized access to the service; or reverse-engineer any part of the application.',
        ],
    },
    {
        id: 'intellectual-property',
        icon: Copyright,
        title: 'Intellectual property',
        body: [
            'a2zconverters and its branding, logo, and design are our property. The files you create with our tools remain yours.',
        ],
    },
    {
        id: 'disclaimer',
        icon: ShieldX,
        title: 'Disclaimer',
        highlight: 'The service is provided "as is" — we do not guarantee error-free processing or universal compatibility of output files.',
        highlightIcon: AlertTriangle,
        body: [
            'The service is provided "as is" without warranties of any kind, express or implied. We do not guarantee that processing will be error-free or that output files will be accepted by every recipient.',
        ],
    },
    {
        id: 'liability',
        icon: ShieldX,
        title: 'Limitation of liability',
        body: [
            'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.',
        ],
    },
    {
        id: 'changes',
        icon: RefreshCw,
        title: 'Changes to these terms',
        body: [
            'We may update these terms from time to time. Continued use of the service after changes take effect constitutes acceptance of the revised terms.',
        ],
    },
    {
        id: 'contact',
        icon: Mail,
        title: 'Contact',
        body: [
            <React.Fragment key="contact">
                Questions about these terms? Email <span className="inline-flex items-center gap-1.5 font-medium text-teal-600 dark:text-teal-400"><Mail className="w-4 h-4" /> support@convertpro.com</span> or visit our <Link to="/contact" className="text-teal-600 dark:text-teal-400 hover:underline">contact page</Link>.
            </React.Fragment>,
        ],
    },
];

const Terms = () => (
    <LegalLayout
        badge={{ icon: Scale, label: 'Legal' }}
        accent="purple"
        title="Terms of Service"
        subtitle="The ground rules for using a2zconverters."
        lastUpdated="August 3, 2026"
        sections={sections}
    />
);

export default Terms;

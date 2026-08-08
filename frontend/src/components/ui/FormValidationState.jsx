import React, { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import StateScreen from './StateScreen';
import SuccessState from './SuccessState';

const validate = (values) => {
    const errors = {};
    if (!values.name.trim()) errors.name = 'Name is required.';
    else if (values.name.trim().length < 3) errors.name = 'Name must be at least 3 characters.';
    if (!values.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.';
    return errors;
};

const fieldClass = (hasError) =>
    cn(
        'w-full bg-white/80 dark:bg-slate-800/80 border rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all',
        hasError
            ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-200 dark:border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
    );

const FormValidationState = ({ onSubmit, title = 'Check your details', description = 'Fill in the form to see inline validation in action.', badge = 'Validation Demo', ...props }) => {
    const [values, setValues] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
        setErrors((er) => ({ ...er, [name]: undefined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate(values);
        setErrors(errs);
        if (Object.keys(errs).length === 0) {
            if (onSubmit) onSubmit(values);
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <SuccessState
                title="Form submitted!"
                description="Your details were saved successfully."
                badge="Validation Passed"
                onDone={() => setSubmitted(false)}
                doneLabel="Submit Again"
            />
        );
    }

    return (
        <StateScreen icon={CircleAlert} tone="amber" badge={badge} title={title} description={description} {...props}>
            <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm mx-auto text-left space-y-4 mb-2">
                <div>
                    <label htmlFor="fv-name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Name</label>
                    <input
                        id="fv-name"
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={fieldClass(Boolean(errors.name))}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="fv-email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                    <input
                        id="fv-email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={fieldClass(Boolean(errors.email))}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                    Submit
                </button>
            </form>
        </StateScreen>
    );
};

export default FormValidationState;

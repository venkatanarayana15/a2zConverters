import React from 'react';
import { CircleCheck } from 'lucide-react';
import StateScreen from './StateScreen';

const SuccessState = ({
    onDone,
    doneLabel = 'Done',
    title = 'All done!',
    description = 'Your request was processed successfully.',
    badge = 'Success',
    ...props
}) => (
    <StateScreen
        icon={CircleCheck}
        tone="green"
        badge={badge}
        title={title}
        description={description}
        action={
            onDone && (
                <button type="button" onClick={onDone} className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:shadow-lg hover:scale-[1.02] transition-all">
                    {doneLabel}
                </button>
            )
        }
        {...props}
    />
);

export default SuccessState;

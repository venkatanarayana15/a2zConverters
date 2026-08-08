import React from 'react';
import { SearchX } from 'lucide-react';
import StateScreen from './StateScreen';

const NoResultsState = ({
    onClearFilters,
    clearLabel = 'Clear Filters',
    title = 'No results found',
    description = "We couldn't find anything matching your search. Try different keywords or clear your filters.",
    ...props
}) => (
    <StateScreen
        icon={SearchX}
        tone="blue"
        title={title}
        description={description}
        action={
            onClearFilters && (
                <button type="button" onClick={onClearFilters} className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg dark:bg-none dark:bg-primary dark:text-white hover:scale-[1.02] transition-all">
                    {clearLabel}
                </button>
            )
        }
        {...props}
    />
);

export default NoResultsState;

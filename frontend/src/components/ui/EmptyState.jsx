import React from 'react';
import { Inbox } from 'lucide-react';
import StateScreen from './StateScreen';

const EmptyState = ({ title = 'Nothing here yet', description = "No items to display. Once you add something, it will show up here.", ...props }) => (
    <StateScreen icon={Inbox} tone="gray" title={title} description={description} {...props} />
);

export default EmptyState;

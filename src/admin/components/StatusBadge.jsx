import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'pending';
            case 'Confirmed': return 'confirmed';
            case 'Completed': return 'completed';
            case 'Cancelled': return 'cancelled';
            default: return '';
        }
    };

    return (
        <span className={`status-badge ${getStatusClass(status)}`}>
            {status}
        </span>
    );
};

export default StatusBadge;

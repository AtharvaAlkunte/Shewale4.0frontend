import React from 'react';

const DashboardCard = ({ title, value, icon, colorClass }) => {
    return (
        <div className={`stat-card ${colorClass}`}>
            <div className="stat-header">
                <span className="stat-title">{title}</span>
                <div className="stat-icon-wrapper">
                    {icon}
                </div>
            </div>
            <div className="stat-value">{value}</div>
        </div>
    );
};

export default DashboardCard;

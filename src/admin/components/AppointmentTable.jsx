import React from 'react';
import { Edit2, Trash2, ChevronDown, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

import StatusBadge from './StatusBadge';

const AppointmentTable = ({
    appointments,
    onStatusChange,
    onDelete
}) => {
    return (
        <div className="table-container pt-0">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Contact Details</th>
                        <th>Date & Time</th>
                        <th>Service</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((app) => (
                            <tr key={app._id}>
                                <td>
                                    <Link
                                        to={`/admin/reports/${app._id}?name=${encodeURIComponent(app.patientName)}&phone=${encodeURIComponent(app.phone)}`}
                                        className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 group"
                                    >
                                        {app.patientName}
                                        <MessageSquare size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </td>
                                <td>
                                    <div className="text-sm font-medium">{app.phone}</div>
                                    <div className="text-xs text-slate-400">{app.email || 'No email'}</div>
                                </td>
                                <td>
                                    <div className="text-sm">{new Date(app.appointmentDate).toLocaleDateString()}</div>
                                    <div className="text-xs text-slate-500 font-medium">{app.timeSlot || 'Not specified'}</div>
                                </td>
                                <td>
                                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600">
                                        {app.serviceType || 'General'}
                                    </span>
                                </td>
                                <td>
                                    <StatusBadge status={app.status} />
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <div className="status-dropdown-group">
                                            <select
                                                value={app.status}
                                                onChange={(e) => onStatusChange(app._id, e.target.value)}
                                                className="status-select-action"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <ChevronDown size={14} className="dropdown-chevron" />
                                        </div>

                                        <button
                                            onClick={() => onDelete(app._id)}
                                            className="delete-icon-btn"
                                            title="Delete Appointment"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-12 text-slate-400">
                                No appointments found matches the criteria
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentTable;

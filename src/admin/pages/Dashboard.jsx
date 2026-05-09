import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Calendar,
    Clock,
    CheckCircle,
    MessageSquare,
    Activity
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';

import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import DashboardCard from '../components/DashboardCard';
import '../styles/admin.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        completedAppointments: 0,
        totalEnquiries: 0,
        todayAppointments: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, recentRes] = await Promise.all([
                    appointmentService.getDashboardStats(),
                    appointmentService.getRecentAppointments()
                ]);

                if (statsRes.data.success) {
                    setStats(statsRes.data.data);
                }
                if (recentRes.data.success) {
                    setRecentAppointments(recentRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartData = [
        { name: 'Pending', value: stats.pendingAppointments },
        { name: 'Confirmed', value: stats.confirmedAppointments },
        { name: 'Completed', value: stats.completedAppointments },
    ];

    const trendData = [
        { day: 'Mon', apps: 4 },
        { day: 'Tue', apps: 7 },
        { day: 'Wed', apps: 5 },
        { day: 'Thu', apps: 8 },
        { day: 'Fri', apps: 6 },
        { day: 'Sat', apps: 9 },
        { day: 'Sun', apps: 3 },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="text-xl font-bold text-slate-600 animate-pulse">Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            <main className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <AdminNavbar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

                <div className="admin-content">
                    <div className="stats-grid">
                        <DashboardCard
                            title="Total Appointments"
                            value={stats.totalAppointments}
                            colorClass="total"
                            icon={<Users className="text-blue-500" />}
                        />
                        <DashboardCard
                            title="Pending Appointments"
                            value={stats.pendingAppointments}
                            colorClass="pending"
                            icon={<Clock className="text-orange-500" />}
                        />
                        <DashboardCard
                            title="Confirmed Appointments"
                            value={stats.confirmedAppointments}
                            colorClass="confirmed"
                            icon={<CheckCircle className="text-green-500" />}
                        />
                        <DashboardCard
                            title="Completed Appointments"
                            value={stats.completedAppointments}
                            colorClass="completed"
                            icon={<Activity className="text-purple-500" />}
                        />
                        <DashboardCard
                            title="Total Enquiries"
                            value={stats.totalEnquiries}
                            colorClass="enquiries"
                            icon={<MessageSquare className="text-red-500" />}
                        />
                        <DashboardCard
                            title="Today's Appointments"
                            value={stats.todayAppointments}
                            colorClass="today"
                            icon={<Calendar className="text-teal-500" />}
                        />
                    </div>

                    <div className="charts-grid">
                        <div className="chart-container">
                            <h3 className="chart-title">Appointment Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-container">
                            <h3 className="chart-title">Weekly Trends</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="apps" stroke="#e10600" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="table-container">
                        <h3 className="chart-title">Recent Appointments</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Contact Info</th>
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAppointments.length > 0 ? (
                                    recentAppointments.map((app) => (
                                        <tr key={app._id}>
                                            <td className="font-semibold">
                                                <div>{app.patientName}</div>
                                                <div className="text-xs text-slate-400 font-normal">{app.email || 'No email'}</div>
                                            </td>
                                            <td>{app.phone}</td>
                                            <td>
                                                <div>{new Date(app.appointmentDate).toLocaleDateString()}</div>
                                                <div className="text-xs text-slate-500">{app.timeSlot || ''}</div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${app.status}`}>
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="view-btn">View</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-slate-400">No recent appointments found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import SearchFilterBar from '../components/SearchFilterBar';
import AppointmentTable from '../components/AppointmentTable';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import '../styles/admin.css';
import '../styles/appointments.css';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const params = {
                search,
                date,
                status,
                page,
                limit: 10
            };
            const res = await appointmentService.getAppointments(params);
            if (res.data.success) {
                setAppointments(res.data.data);
                setTotalPages(res.data.totalPages);
                setTotalCount(res.data.totalCount);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAppointments();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, date, status, page]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await appointmentService.updateStatus(id, newStatus);
            if (res.data.success) {
                setAppointments(appointments.map(app =>
                    app._id === id ? { ...app, status: newStatus } : app
                ));
                toast.success(`Appointment marked as ${newStatus}`);
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            try {
                const res = await appointmentService.deleteAppointment(id);
                if (res.data.success) {
                    setAppointments(appointments.filter(app => app._id !== id));
                    setTotalCount(prev => prev - 1);
                    toast.success("Appointment deleted successfully");
                }
            } catch (error) {
                toast.error("Failed to delete appointment");
            }
        }
    };

    const handleExport = async () => {
        try {
            await appointmentService.exportAppointments();
            toast.success("Export successful - Download starting...");
        } catch (error) {
            toast.error("Failed to export appointments");
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            <main className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <AdminNavbar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} title="Appointment Management" />

                <div className="admin-content">
                    <div className="page-header">
                        <h1 className="text-2xl font-bold text-slate-800">Appointment Management</h1>
                        <span className="text-sm text-slate-500 font-medium">{totalCount} total records</span>
                    </div>

                    <SearchFilterBar
                        search={search}
                        setSearch={setSearch}
                        date={date}
                        setDate={setDate}
                        status={status}
                        setStatus={setStatus}
                        onExport={handleExport}
                    />

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg shadow-sm border border-slate-100">
                            <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
                            <p className="text-slate-500 font-medium">Fetching details...</p>
                        </div>
                    ) : (
                        <>
                            <AppointmentTable
                                appointments={appointments}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                        className="pagination-btn"
                                    >
                                        <ChevronLeft size={18} /> Previous
                                    </button>

                                    <div className="page-numbers">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i + 1)}
                                                className={`page-num ${page === i + 1 ? 'active' : ''}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                        className="pagination-btn"
                                    >
                                        Next <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Appointments;

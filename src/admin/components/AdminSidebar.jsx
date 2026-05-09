import React, { useState } from 'react';
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    Image as ImageIcon,
    Star,
    LogOut,
    ChevronLeft,
    Menu,
    HelpCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();

    const menuItems = [
        { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { title: 'Patients', path: '/admin/patients', icon: LayoutDashboard },
        { title: 'Prescriptions', path: '/admin/prescriptions', icon: Calendar },
        { title: 'Appointments', path: '/admin/appointments', icon: Calendar },
        // { title: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
        // { title: 'Banners', path: '/admin/banners', icon: ImageIcon },
        { title: 'Testimonials', path: '/admin/testimonials', icon: Star },
        { title: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    ];

    return (
        <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    {!collapsed && <span>Sai Heart & <br></br>Maternity Care</span>}
                    {collapsed && <span>SHMC</span>}
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        {!collapsed && <span className="nav-text">{item.title}</span>}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div
                    className="nav-item cursor-pointer"
                    onClick={() => {
                        localStorage.removeItem('adminToken');
                        window.location.href = '/admin/login';
                    }}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="nav-text">Logout</span>}
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;

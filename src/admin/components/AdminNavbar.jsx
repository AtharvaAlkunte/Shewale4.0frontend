import React from 'react';
import { Bell, User, LogOut, Menu } from 'lucide-react';

const AdminNavbar = ({ toggleSidebar }) => {
    return (
        <div className="admin-navbar">
            <div className="navbar-left">
                <button className="md:hidden mr-4" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <h2 className="navbar-title">Dashboard Overview</h2>
            </div>

            <div className="navbar-actions">
                <button className="p-2 text-slate-500 hover:text-slate-700 relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-2 cursor-pointer border-l pl-4">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <User size={18} className="text-slate-600" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">Admin</span>
                </div>
                <button className="p-2 text-slate-500 hover:text-red-600 ml-2">
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default AdminNavbar;

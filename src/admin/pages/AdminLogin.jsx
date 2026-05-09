import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { API_BASE_URL } from '@/lib/apiConfig';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin/dashboard');
            } else {
                alert(data.error || 'Invalid credentials');
            }
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Activity className="text-red-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
                    <p className="text-slate-500">Sign in to manage your clinic</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                            placeholder="Enter admin password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-red-500/30"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-slate-400">
                    Powered by Sai Heart & Maternity Care
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;

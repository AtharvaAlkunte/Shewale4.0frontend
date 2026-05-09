import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { reportService } from '@/services/reportService';
import {
    FileText,
    Download,
    Loader2,
    MessageSquare,
    ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import TopBar from '@/components/clinic/TopBar';
import Navbar from '@/components/clinic/Navbar';
import ClinicFooter from '@/components/clinic/ClinicFooter';

const Reports = () => {
    const { appointmentId } = useParams();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // For patient side, we might need a different auth or just rely on the appointmentId 
                // but the backend uses 'protect' middleware which currently checks for 'adminToken' 
                // or 'token' in reportService.
                const res = await reportService.getReports(appointmentId);
                if (res.data.success) {
                    setMessages(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [appointmentId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderMessage = (msg) => {
        const isAdmin = msg.sender === 'admin';
        return (
            <div key={msg._id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'} mb-6 group animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                <div className={`relative max-w-[90%] sm:max-w-[75%] flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                    <div className={`relative py-4 px-5 shadow-lg ${isAdmin
                        ? 'bg-white text-slate-900 rounded-2xl rounded-tl-none border border-slate-100'
                        : 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                        }`}>

                        {isAdmin && (
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <MessageSquare size={12} fill="currentColor" />
                                </div>
                                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">Official Care Message</span>
                            </div>
                        )}

                        {msg.messageText && <p className="text-[15px] leading-relaxed mb-2 whitespace-pre-wrap">{msg.messageText}</p>}

                        {msg.fileUrl && (
                            <div className={`mt-3 overflow-hidden rounded-xl border ${isAdmin ? 'border-slate-100 bg-slate-50' : 'border-blue-500 bg-blue-700/50'}`}>
                                {msg.fileType === 'pdf' ? (
                                    <div className="p-4 flex items-center gap-4 hover:bg-black/5 transition-all cursor-pointer group/file"
                                        onClick={() => window.open(msg.fileUrl, '_blank')}>
                                        <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover/file:scale-105 transition-transform">
                                            <FileText size={30} />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className={`text-sm font-bold truncate ${isAdmin ? 'text-slate-800' : 'text-white'}`}>
                                                {msg.fileName || 'Medical Report.pdf'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isAdmin ? 'text-slate-400' : 'text-blue-200'}`}>Official Document</span>
                                                <span className={`w-1 h-1 rounded-full ${isAdmin ? 'bg-slate-300' : 'bg-blue-300'}`}></span>
                                                <span className={`text-[10px] font-bold ${isAdmin ? 'text-blue-600' : 'text-blue-100'}`}>Click to View / Download</span>
                                            </div>
                                        </div>
                                        <div className={`p-2.5 rounded-full ${isAdmin ? 'bg-white shadow-sm text-blue-600' : 'bg-blue-500 text-white'}`}>
                                            <Download size={20} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative group/img cursor-pointer" onClick={() => window.open(msg.fileUrl, '_blank')}>
                                        <img
                                            src={msg.fileUrl}
                                            alt="Medical scan"
                                            className="w-full max-h-[400px] object-cover transition-transform group-hover/img:scale-[1.01] duration-700"
                                        />
                                        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white text-blue-600 px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl">
                                                <ExternalLink size={16} /> Open Full View
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={`flex items-center gap-2 mt-2 ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                            <span className={`text-[10px] font-bold ${isAdmin ? 'text-slate-400' : 'text-blue-100'}`}>
                                {format(new Date(msg.createdAt), 'MMM dd • hh:mm a')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <TopBar />
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-slate-100 flex flex-col min-h-[700px]">
                    {/* Premium Header */}
                    <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/15 rounded-3xl backdrop-blur-md shadow-xl border border-white/20">
                                    <FileText size={42} className="text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-blue-400/30 text-blue-100 text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/10">Patient Portal</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none mb-2">Medical Reports</h1>
                                    <p className="text-blue-100/80 text-sm font-medium">Securely view your clinical documentation and messages.</p>
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 text-right">
                                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-tighter">Appointment ID</p>
                                    <p className="text-xs font-mono font-bold text-white truncate max-w-[120px]">{appointmentId}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 sm:p-12 bg-slate-50/50">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <div className="relative w-20 h-20 mb-6">
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                                </div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Accessing Records</h3>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Establishing secure connection...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto">
                                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8 border border-slate-50">
                                    <MessageSquare size={48} className="text-slate-200" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-3">No Documents Found</h3>
                                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                    We couldn't find any reports or messages for this appointment ID yet. They will appear here once the doctor uploads them.
                                </p>
                                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
                                    Refresh Results
                                </button>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto">
                                <div className="flex items-center justify-center gap-4 mb-10">
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                    <span className="px-4 py-1.5 bg-white text-slate-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-slate-100 shadow-sm">
                                        Clinical History
                                    </span>
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                </div>
                                <div className="space-y-2">
                                    {messages.map(renderMessage)}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Footer Warning */}
                    <div className="bg-slate-50 p-8 border-t border-slate-100 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 mb-4">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-tight">Security Alert: Read-Only Portal</p>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
                            For your privacy, this channel is read-only. Responses cannot be sent through this portal. For clinical questions, please call our support line.
                        </p>
                    </div>
                </div>
            </main>

            <ClinicFooter />

            <style>{`
                body {
                    background-color: #f8fafc;
                    font-family: 'Inter', sans-serif;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Reports;

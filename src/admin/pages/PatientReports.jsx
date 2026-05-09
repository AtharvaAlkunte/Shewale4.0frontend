import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { reportService } from '@/services/reportService';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import {
    Send,
    Paperclip,
    FileText,
    Image as ImageIcon,
    Download,
    ChevronLeft,
    Loader2,
    MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const PatientReports = () => {
    const { appointmentId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const patientName = queryParams.get('name') || 'Patient';
    const patientPhone = queryParams.get('phone') || '';

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchReports();
    }, [appointmentId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchReports = async () => {
        try {
            const res = await reportService.getReports(appointmentId);
            if (res.data.success) {
                setMessages(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error("Failed to load message history");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() && !file) return;

        setSending(true);
        const formData = new FormData();
        formData.append('appointmentId', appointmentId);
        formData.append('messageText', newMessage);
        if (file) {
            formData.append('file', file);
        }

        try {
            const res = await reportService.sendReport(formData);
            if (res.data.success) {
                setMessages([...messages, res.data.data]);
                setNewMessage('');
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                toast.success("Message sent successfully");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Check Cloudinary settings.");
        } finally {
            setSending(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const renderMessage = (msg) => {
        const isAdmin = msg.sender === 'admin';
        return (
            <div key={msg._id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4 group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`relative max-w-[80%] sm:max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`relative py-3 px-4 shadow-sm ${isAdmin
                        ? 'bg-[#E7FFDB] text-slate-900 rounded-2xl rounded-tr-none border border-[#d1f4bd]'
                        : 'bg-white text-slate-900 rounded-2xl rounded-tl-none border border-slate-100'
                        }`}>

                        {/* Chat bubble tail */}
                        <div className={`absolute top-0 w-3 h-3 ${isAdmin
                            ? '-right-1.5 bg-[#E7FFDB] border-r border-t border-[#d1f4bd] rotate-45'
                            : '-left-1.5 bg-white border-l border-t border-slate-100 -rotate-45'
                            } rounded-sm`}></div>

                        {msg.messageText && <p className="text-[14.5px] leading-relaxed mb-1 whitespace-pre-wrap">{msg.messageText}</p>}

                        {msg.fileUrl && (
                            <div className="mt-2 overflow-hidden rounded-xl border border-black/5 bg-black/5">
                                {msg.fileType === 'pdf' ? (
                                    <div className="flex items-center gap-4 p-3 hover:bg-black/10 transition-colors cursor-pointer"
                                        onClick={() => window.open(msg.fileUrl, '_blank')}>
                                        <div className="w-12 h-12 flex-shrink-0 bg-red-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-2">
                                            <p className="text-sm font-bold truncate text-slate-800">
                                                {msg.fileName || 'Medical Report.pdf'}
                                            </p>
                                            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">PDF Document • Click to Open</p>
                                        </div>
                                        <div className="p-2 bg-white/50 rounded-full text-slate-600">
                                            <Download size={18} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative group/img cursor-pointer" onClick={() => window.open(msg.fileUrl, '_blank')}>
                                        <img
                                            src={msg.fileUrl}
                                            alt="Medical scan"
                                            className="w-full max-h-[350px] object-cover transition-transform group-hover/img:scale-[1.02] duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/90 text-slate-800 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                                                <ImageIcon size={16} /> Open Full Image
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-1.5 mt-1.5">
                            <span className="text-[10.5px] font-medium text-slate-500">
                                {format(new Date(msg.createdAt), 'hh:mm a')}
                            </span>
                            {isAdmin && (
                                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 7 17l-5-5"></path>
                                    <path d="m22 10-7.5 7.5L13 16"></path>
                                </svg>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-layout min-h-screen bg-[#F0F2F5]">
            <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            <main className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''} h-screen flex flex-col`}>
                <AdminNavbar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} title="Patient Communication" />

                <div className="flex-1 flex flex-col mx-auto w-full max-w-5xl shadow-2xl bg-white border-x border-slate-200 overflow-hidden">
                    {/* Enhanced Header */}
                    <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/appointments')}
                                className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-all active:scale-95"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl shadow-sm border border-blue-100">
                                    {patientName.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-[17px] font-black text-slate-900 leading-tight tracking-tight">{patientName}</h2>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Communication Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <div className="p-2.5 text-slate-500 hover:bg-slate-200 rounded-full cursor-not-allowed hidden sm:block">
                                <MessageSquare size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Chat Area with Wallpaper */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#EFEAE2] relative"
                        style={{
                            backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                            backgroundBlendMode: 'overlay',
                            opacity: 1
                        }}>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="p-4 bg-white/80 backdrop-blur rounded-2xl shadow-lg flex flex-col items-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                                    <p className="text-sm font-bold text-slate-600 tracking-tight">Syncing encrypted messages...</p>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white max-w-sm text-center shadow-xl">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-inner">
                                        <MessageSquare size={40} />
                                    </div>
                                    <h3 className="text-lg font-extrabold text-slate-800 mb-2 whitespace-nowrap">Start Secure Consultation</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium"> Send medical reports, prescription images or clinical notes directly to the patient.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto space-y-2">
                                <div className="flex justify-center mb-8">
                                    <span className="px-3 py-1 bg-[#d9fdd3] text-[#41535d] text-[11px] font-bold rounded-lg shadow-sm border border-[#c1e8ba] uppercase tracking-wide">
                                        Today
                                    </span>
                                </div>
                                {messages.map(renderMessage)}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-[#f0f2f5] p-3 px-4 flex flex-col gap-2">
                        {file && (
                            <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in zoom-in-95">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                        {file.type.includes('pdf') ? <FileText size={20} /> : <ImageIcon size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tighter">Ready to upload</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="p-2 hover:bg-slate-100 text-red-500 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 text-slate-500 hover:bg-slate-200 rounded-full transition-all active:scale-90"
                                title="Attach File"
                            >
                                <Paperclip size={24} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,image/*"
                                onChange={handleFileChange}
                            />
                            <div className="flex-1 relative">
                                <textarea
                                    rows="1"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a clinical message..."
                                    className="w-full bg-white border border-white rounded-2xl px-5 py-3 text-[15px] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-sm resize-none overflow-hidden"
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={sending || (!newMessage.trim() && !file)}
                                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-95 ${sending || (!newMessage.trim() && !file)
                                    ? 'bg-slate-300 text-slate-500'
                                    : 'bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:rotate-6'
                                    }`}
                            >
                                {sending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .admin-main { background-color: #F0F2F5; }
                textarea::-webkit-scrollbar { width: 0px; }
            `}</style>
        </div>
    );
};

export default PatientReports;

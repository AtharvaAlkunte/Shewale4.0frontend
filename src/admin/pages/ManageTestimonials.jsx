import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Upload, Play, Star, X, Video, CheckCircle2, AlertCircle, ChevronUp } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

// ─── Inline premium styles ────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  .mt-root {
    font-family: 'DM Sans', sans-serif;
    background: #f7f8fc;
    min-height: 100vh;
  }

  /* ── Form card ── */
  .mt-form-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(200,16,46,0.04);
    padding: 36px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }
  .mt-form-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1a2a4a 0%, #c8102e 100%);
  }

  .mt-section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #c8102e;
    margin-bottom: 6px;
  }
  .mt-section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: #1a2a4a;
    margin-bottom: 28px;
    font-weight: 400;
  }

  /* ── Input ── */
  .mt-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
  .mt-input {
    width: 100%;
    padding: 11px 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1a2a4a;
    background: #fafafa;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .mt-input:focus {
    border-color: #c8102e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(200,16,46,0.08);
  }
  .mt-textarea {
    resize: vertical;
    min-height: 80px;
  }

  /* ── Star Rating ── */
  .mt-star {
    cursor: pointer;
    transition: transform 0.15s;
    color: #d1d5db;
    font-size: 22px;
  }
  .mt-star.active { color: #f59e0b; }
  .mt-star:hover { transform: scale(1.2); }

  /* ── Upload zone ── */
  .mt-upload-zone {
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 24px 16px;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition: border-color 0.25s, background 0.25s;
    background: #fafafa;
  }
  .mt-upload-zone:hover, .mt-upload-zone.has-file {
    border-color: #c8102e;
    background: #fff5f6;
  }
  .mt-upload-zone input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  /* ── Buttons ── */
  .mt-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #1a2a4a 0%, #243556 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(26,42,74,0.28);
  }
  .mt-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(26,42,74,0.35);
  }
  .mt-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f3f4f6;
    color: #374151;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: background 0.2s;
  }
  .mt-btn-secondary:hover { background: #e9ebef; }

  /* ── Table card ── */
  .mt-table-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    overflow: hidden;
  }
  .mt-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 32px;
    border-bottom: 1px solid #f3f4f6;
  }
  .mt-table th {
    padding: 14px 24px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9ca3af;
    background: #f9fafb;
  }
  .mt-table td {
    padding: 18px 24px;
    vertical-align: middle;
  }
  .mt-table tr {
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.18s;
  }
  .mt-table tbody tr:hover { background: #fafbff; }
  .mt-table tbody tr:last-child { border-bottom: none; }

  /* ── Avatar ── */
  .mt-avatar {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1a2a4a, #c8102e);
    color: white;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ── Video thumb ── */
  .mt-video-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eff6ff;
    color: #2563eb;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;
  }
  .mt-video-pill:hover { background: #dbeafe; }

  /* ── Action buttons ── */
  .mt-action-edit {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
    color: #2563eb;
    background: #eff6ff;
    border: none;
    padding: 7px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.18s, transform 0.15s;
  }
  .mt-action-edit:hover { background: #dbeafe; transform: translateY(-1px); }

  .mt-action-delete {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
    color: #c8102e;
    background: #fff1f2;
    border: none;
    padding: 7px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.18s, transform 0.15s;
  }
  .mt-action-delete:hover { background: #ffe4e6; transform: translateY(-1px); }

  /* ── Badge ── */
  .mt-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
  }
  .mt-badge-active { background: #dcfce7; color: #16a34a; }
  .mt-badge-count {
    background: #f0f4ff;
    color: #1a2a4a;
    font-weight: 700;
    font-size: 12px;
    padding: 3px 12px;
    border-radius: 20px;
  }

  /* ── Skeleton / Loading ── */
  .mt-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Delete confirm modal ── */
  .mt-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }
  .mt-modal {
    background: white;
    border-radius: 20px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    animation: slideUp 0.25s cubic-bezier(.22,1,.36,1);
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

// ─── Star Rating component ─────────────────────────────────────────────────────
const StarRating = ({ value, onChange }) => (
    <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
        {[1, 2, 3, 4, 5].map((n) => (
            <span
                key={n}
                className={`mt-star${n <= value ? ' active' : ''}`}
                onClick={() => onChange(n)}
                role="button"
                aria-label={`${n} star`}
            >
                ★
            </span>
        ))}
    </div>
);

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ onConfirm, onCancel }) => (
    <div className="mt-modal-backdrop">
        <div className="mt-modal">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: '#fff1f2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}>
                    <Trash2 size={24} color="#c8102e" />
                </div>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1a2a4a', marginBottom: 8 }}>
                    Delete Testimonial?
                </p>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                    This action cannot be undone. The video and patient story will be permanently removed.
                </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
                <button className="mt-btn-secondary" onClick={onCancel} style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: '#c8102e', color: 'white', padding: '12px 20px',
                        borderRadius: 10, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                    }}
                >
                    <Trash2 size={15} /> Delete
                </button>
            </div>
        </div>
    </div>
);

// ─── Skeleton rows ────────────────────────────────────────────────────────────
const SkeletonRows = () => (
    <>
        {[1, 2, 3].map((i) => (
            <tr key={i}>
                <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="mt-skeleton" style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0 }} />
                        <div>
                            <div className="mt-skeleton" style={{ width: 120, height: 13, marginBottom: 6 }} />
                            <div className="mt-skeleton" style={{ width: 80, height: 11 }} />
                        </div>
                    </div>
                </td>
                <td style={{ padding: '18px 24px' }}>
                    <div className="mt-skeleton" style={{ width: 70, height: 26, borderRadius: 20 }} />
                </td>
                <td style={{ padding: '18px 24px' }}>
                    <div className="mt-skeleton" style={{ width: '100%', height: 13, maxWidth: 220 }} />
                </td>
                <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <div className="mt-skeleton" style={{ width: 68, height: 32, borderRadius: 8 }} />
                        <div className="mt-skeleton" style={{ width: 68, height: 32, borderRadius: 8 }} />
                    </div>
                </td>
            </tr>
        ))}
    </>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ManageTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', designation: '', rating: 5, quote: '' });
    const [videoFile, setVideoFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const formRef = useRef(null);
    const { toast } = useToast();

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('https://shewale4-0.onrender.com/api/testimonials');
            const data = await res.json();
            if (data.success) setTestimonials(data.data);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch testimonials' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const getAuthHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    });

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) setVideoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingId && !videoFile) {
            toast({ variant: 'destructive', title: 'Missing Video', description: 'Please select a video file to upload.' });
            return;
        }
        setSubmitting(true);
        try {
            const url = editingId
                ? `https://shewale4-0.onrender.com/api/testimonials/${editingId}`
                : 'https://shewale4-0.onrender.com/api/testimonials';
            const submitData = new FormData();
            Object.entries(formData).forEach(([k, v]) => submitData.append(k, v));
            if (videoFile) submitData.append('video', videoFile);

            const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: getAuthHeaders(), body: submitData });
            const data = await res.json();

            if (data.success) {
                toast({ title: 'Success ✓', description: editingId ? 'Testimonial updated successfully.' : 'Testimonial added successfully.' });
                resetForm();
                fetchTestimonials();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: data.error });
            }
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save testimonial.' });
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', designation: '', rating: 5, quote: '' });
        setVideoFile(null);
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = (testi) => {
        setEditingId(testi._id);
        setFormData({ name: testi.name, designation: testi.designation, rating: testi.rating, quote: testi.quote });
        setVideoFile(null);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res = await fetch(`https://shewale4-0.onrender.com/api/testimonials/${deleteTarget}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: 'Deleted', description: 'Testimonial removed.' });
                fetchTestimonials();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: data.error });
            }
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete.' });
        } finally {
            setDeleteTarget(null);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{styles}</style>
            {deleteTarget && <DeleteModal onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}

            <div className="admin-layout mt-root">
                <AdminSidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />

                <main className={`admin-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <AdminNavbar
                        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        title="Manage Testimonials"
                    />

                    <div className="admin-content" style={{ padding: '32px 28px' }}>

                        {/* ── Form Card ── */}
                        <div className="mt-form-card" ref={formRef}>
                            <p className="mt-section-label">
                                {editingId ? 'Editing' : 'New Entry'}
                            </p>
                            <h2 className="mt-section-title">
                                {editingId ? 'Update Patient Testimonial' : 'Add Patient Testimonial'}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                {/* Row 1 */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                    <div>
                                        <label className="mt-label">Patient Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-input"
                                            placeholder="e.g. Rajani Karkare"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="mt-label">Surgery / Designation</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-input"
                                            placeholder="e.g. Angioplasty Patient"
                                            value={formData.designation}
                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                    {/* Upload */}
                                    <div>
                                        <label className="mt-label">Patient Video</label>
                                        <div className={`mt-upload-zone${videoFile ? ' has-file' : ''}`}>
                                            <input
                                                type="file"
                                                accept="video/mp4,video/quicktime,video/webm"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                required={!editingId}
                                            />
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
                                                {videoFile ? (
                                                    <>
                                                        <CheckCircle2 size={28} color="#16a34a" />
                                                        <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                                                            {videoFile.name}
                                                        </span>
                                                        <span style={{ fontSize: 11, color: '#6b7280' }}>
                                                            {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{
                                                            width: 44, height: 44, borderRadius: '50%',
                                                            background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            <Upload size={20} color="#9ca3af" />
                                                        </div>
                                                        <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                                                            {editingId ? 'Upload new to replace' : 'Click or drag video here'}
                                                        </span>
                                                        <span style={{ fontSize: 11, color: '#d1d5db' }}>MP4, MOV, WEBM</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div>
                                        <label className="mt-label">Patient Rating</label>
                                        <div style={{
                                            border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '14px 16px',
                                            background: '#fafafa', minHeight: 58, display: 'flex', alignItems: 'center',
                                        }}>
                                            <StarRating value={formData.rating} onChange={(v) => setFormData({ ...formData, rating: v })} />
                                            <span style={{ marginLeft: 12, fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
                                                {formData.rating} / 5
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quote */}
                                <div style={{ marginBottom: 28 }}>
                                    <label className="mt-label">Patient Quote</label>
                                    <textarea
                                        required
                                        className="mt-input mt-textarea"
                                        placeholder="Share what the patient said about their experience..."
                                        value={formData.quote}
                                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                    />
                                </div>

                                {/* Actions */}
                                <div style={{
                                    borderTop: '1px solid #f3f4f6', paddingTop: 24,
                                    display: 'flex', justifyContent: 'flex-end', gap: 12,
                                }}>
                                    {editingId && (
                                        <button type="button" className="mt-btn-secondary" onClick={resetForm}>
                                            <X size={15} /> Cancel
                                        </button>
                                    )}
                                    <button type="submit" className="mt-btn-primary" disabled={submitting}>
                                        {submitting ? (
                                            <span style={{ opacity: 0.8 }}>Saving…</span>
                                        ) : (
                                            <>
                                                {editingId ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                                                {editingId ? 'Update Testimonial' : 'Add Testimonial'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ── Table Card ── */}
                        <div className="mt-table-card">
                            <div className="mt-table-header">
                                <div>
                                    <p className="mt-section-label" style={{ marginBottom: 2 }}>Records</p>
                                    <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1a2a4a', fontWeight: 400 }}>
                                        All Testimonials
                                    </p>
                                </div>
                                <span className="mt-badge-count">{testimonials.length} total</span>
                            </div>

                            {loading ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="mt-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th>Patient</th>
                                                <th>Video</th>
                                                <th>Quote</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody><SkeletonRows /></tbody>
                                    </table>
                                </div>
                            ) : testimonials.length === 0 ? (
                                <div style={{ padding: '64px 32px', textAlign: 'center' }}>
                                    <Video size={40} color="#e5e7eb" style={{ margin: '0 auto 16px' }} />
                                    <p style={{ fontSize: 15, color: '#6b7280', fontWeight: 500 }}>No testimonials yet</p>
                                    <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Add your first patient video story above.</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="mt-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th>Patient</th>
                                                <th>Video</th>
                                                <th>Quote</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testimonials.map((testi) => (
                                                <tr key={testi._id}>
                                                    {/* Patient */}
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                            <div className="mt-avatar">
                                                                {testi.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 14, fontWeight: 600, color: '#1a2a4a', marginBottom: 2 }}>
                                                                    {testi.name}
                                                                </p>
                                                                <p style={{ fontSize: 12, color: '#9ca3af' }}>{testi.designation}</p>
                                                                <div style={{ display: 'flex', gap: 2, marginTop: 3 }}>
                                                                    {[1, 2, 3, 4, 5].map((n) => (
                                                                        <Star
                                                                            key={n}
                                                                            size={11}
                                                                            color={n <= testi.rating ? '#f59e0b' : '#e5e7eb'}
                                                                            fill={n <= testi.rating ? '#f59e0b' : '#e5e7eb'}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Video */}
                                                    <td>
                                                        {testi.video ? (
                                                            <a
                                                                href={testi.video.startsWith('/') ? `https://shewale4-0.onrender.com${testi.video}` : testi.video}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="mt-video-pill"
                                                            >
                                                                <Play size={13} /> Watch
                                                            </a>
                                                        ) : (
                                                            <span style={{ fontSize: 12, color: '#d1d5db' }}>— none —</span>
                                                        )}
                                                    </td>

                                                    {/* Quote */}
                                                    <td style={{ maxWidth: 280 }}>
                                                        <p style={{
                                                            fontSize: 13, color: '#6b7280', fontStyle: 'italic',
                                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                        }} title={testi.quote}>
                                                            "{testi.quote}"
                                                        </p>
                                                    </td>

                                                    {/* Actions */}
                                                    <td style={{ textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                            <button className="mt-action-edit" onClick={() => handleEdit(testi)}>
                                                                <Edit2 size={14} /> Edit
                                                            </button>
                                                            <button className="mt-action-delete" onClick={() => setDeleteTarget(testi._id)}>
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
};

export default ManageTestimonials;
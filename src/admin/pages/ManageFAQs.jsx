import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, CheckCircle2, X, MessageSquare } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { API_BASE_URL } from '@/lib/apiConfig';

// ─── Inline premium styles (mirrors ManageTestimonials design system) ─────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  .mf-root {
    font-family: 'DM Sans', sans-serif;
    background: #f7f8fc;
    min-height: 100vh;
  }

  /* ── Form card ── */
  .mf-form-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(200,16,46,0.04);
    padding: 36px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }
  .mf-form-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1a2a4a 0%, #c8102e 100%);
  }

  .mf-section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #c8102e;
    margin-bottom: 6px;
  }
  .mf-section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: #1a2a4a;
    margin-bottom: 28px;
    font-weight: 400;
  }

  /* ── Inputs ── */
  .mf-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
  .mf-input {
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
  .mf-input:focus {
    border-color: #c8102e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(200,16,46,0.08);
  }
  .mf-textarea {
    resize: vertical;
    min-height: 100px;
    line-height: 1.6;
  }

  /* Character counter */
  .mf-char-counter {
    font-size: 11px;
    color: #9ca3af;
    text-align: right;
    margin-top: 4px;
  }
  .mf-char-counter.warn { color: #f59e0b; }
  .mf-char-counter.over  { color: #c8102e; }

  /* ── Buttons ── */
  .mf-btn-primary {
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
    font-family: 'DM Sans', sans-serif;
  }
  .mf-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(26,42,74,0.35);
  }
  .mf-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .mf-btn-secondary {
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
    font-family: 'DM Sans', sans-serif;
  }
  .mf-btn-secondary:hover { background: #e9ebef; }

  /* ── Table card ── */
  .mf-table-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    overflow: hidden;
  }
  .mf-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 32px;
    border-bottom: 1px solid #f3f4f6;
  }
  .mf-table {
    width: 100%;
    border-collapse: collapse;
  }
  .mf-table th {
    padding: 14px 24px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9ca3af;
    background: #f9fafb;
  }
  .mf-table td {
    padding: 20px 24px;
    vertical-align: top;
  }
  .mf-table tbody tr {
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.18s;
  }
  .mf-table tbody tr:hover { background: #fafbff; }
  .mf-table tbody tr:last-child { border-bottom: none; }

  /* ── Q&A number badge ── */
  .mf-num-badge {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1a2a4a, #c8102e);
    color: white;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  /* ── Question pill tag ── */
  .mf-q-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f0f4ff;
    color: #1a2a4a;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 3px 10px;
    border-radius: 20px;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  /* ── Action buttons ── */
  .mf-action-edit {
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
    font-family: 'DM Sans', sans-serif;
  }
  .mf-action-edit:hover { background: #dbeafe; transform: translateY(-1px); }

  .mf-action-delete {
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
    font-family: 'DM Sans', sans-serif;
  }
  .mf-action-delete:hover { background: #ffe4e6; transform: translateY(-1px); }

  /* ── Count badge ── */
  .mf-badge-count {
    background: #f0f4ff;
    color: #1a2a4a;
    font-weight: 700;
    font-size: 12px;
    padding: 3px 12px;
    border-radius: 20px;
  }

  /* ── Skeleton shimmer ── */
  .mf-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: mf-shimmer 1.4s infinite;
    border-radius: 8px;
  }
  @keyframes mf-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Delete modal ── */
  .mf-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: mf-fadeIn 0.2s ease;
  }
  .mf-modal {
    background: white;
    border-radius: 20px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    animation: mf-slideUp 0.25s cubic-bezier(.22,1,.36,1);
  }
  @keyframes mf-fadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes mf-slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* ── Editing highlight on form ── */
  .mf-form-card.editing {
    box-shadow: 0 2px 16px rgba(0,0,0,0.06), 0 0 0 2px rgba(200,16,46,0.18);
  }
`;

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ onConfirm, onCancel }) => (
    <div className="mf-modal-backdrop">
        <div className="mf-modal">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: '#fff1f2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}>
                    <Trash2 size={24} color="#c8102e" />
                </div>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1a2a4a', marginBottom: 8 }}>
                    Delete this FAQ?
                </p>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                    This question and its answer will be permanently removed from the website.
                </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
                <button className="mf-btn-secondary" onClick={onCancel} style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: '#c8102e', color: 'white', padding: '12px 20px',
                        borderRadius: 10, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
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
                <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div className="mf-skeleton" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div className="mf-skeleton" style={{ width: '80%', height: 13, marginBottom: 8 }} />
                            <div className="mf-skeleton" style={{ width: '50%', height: 11 }} />
                        </div>
                    </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                    <div className="mf-skeleton" style={{ width: '100%', height: 13, marginBottom: 6 }} />
                    <div className="mf-skeleton" style={{ width: '70%', height: 13 }} />
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <div className="mf-skeleton" style={{ width: 68, height: 32, borderRadius: 8 }} />
                        <div className="mf-skeleton" style={{ width: 68, height: 32, borderRadius: 8 }} />
                    </div>
                </td>
            </tr>
        ))}
    </>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ManageFAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ question: '', answer: '' });
    const [editingId, setEditingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef(null);
    const { toast } = useToast();

    const MAX_ANSWER = 400;

    const fetchFAQs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/faqs`);
            const data = await res.json();
            if (data.success) setFaqs(data.data);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch FAQs' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFAQs(); }, []);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingId
                ? `${API_BASE_URL}/api/faqs/${editingId}`
                : `${API_BASE_URL}/api/faqs`;

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                toast({ title: 'Success ✓', description: editingId ? 'FAQ updated successfully.' : 'FAQ added successfully.' });
                resetForm();
                fetchFAQs();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: data.error });
            }
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save FAQ.' });
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ question: '', answer: '' });
        setEditingId(null);
    };

    const handleEdit = (faq) => {
        setEditingId(faq._id);
        setFormData({ question: faq.question, answer: faq.answer });
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/faqs/${deleteTarget}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: 'Deleted', description: 'FAQ removed.' });
                fetchFAQs();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: data.error });
            }
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete.' });
        } finally {
            setDeleteTarget(null);
        }
    };

    // Answer character counter color
    const answerLen = formData.answer.length;
    const counterClass = answerLen > MAX_ANSWER ? 'over' : answerLen > MAX_ANSWER * 0.85 ? 'warn' : '';

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{styles}</style>
            {deleteTarget && <DeleteModal onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}

            <div className="admin-layout mf-root">
                <AdminSidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />

                <main className={`admin-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <AdminNavbar
                        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        title="Manage FAQs"
                    />

                    <div className="admin-content" style={{ padding: '32px 28px' }}>

                        {/* ── Form Card ── */}
                        <div className={`mf-form-card${editingId ? ' editing' : ''}`} ref={formRef}>
                            <p className="mf-section-label">{editingId ? 'Editing' : 'New Entry'}</p>
                            <h2 className="mf-section-title">
                                {editingId ? 'Update FAQ' : 'Add New FAQ'}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                {/* Question */}
                                <div style={{ marginBottom: 20 }}>
                                    <label className="mf-label">Question</label>
                                    <input
                                        type="text"
                                        required
                                        className="mf-input"
                                        placeholder="e.g. Will I be conscious during the surgery?"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    />
                                </div>

                                {/* Answer */}
                                <div style={{ marginBottom: 28 }}>
                                    <label className="mf-label">Answer</label>
                                    <textarea
                                        required
                                        className="mf-input mf-textarea"
                                        placeholder="Write a clear, reassuring answer for the patient..."
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    />
                                    <p className={`mf-char-counter ${counterClass}`}>
                                        {answerLen} / {MAX_ANSWER} characters
                                    </p>
                                </div>

                                {/* Actions */}
                                <div style={{
                                    borderTop: '1px solid #f3f4f6',
                                    paddingTop: 24,
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 12,
                                }}>
                                    {editingId && (
                                        <button type="button" className="mf-btn-secondary" onClick={resetForm}>
                                            <X size={15} /> Cancel
                                        </button>
                                    )}
                                    <button type="submit" className="mf-btn-primary" disabled={submitting}>
                                        {submitting ? (
                                            <span style={{ opacity: 0.8 }}>Saving…</span>
                                        ) : (
                                            <>
                                                {editingId ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                                                {editingId ? 'Update FAQ' : 'Add FAQ'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ── Table Card ── */}
                        <div className="mf-table-card">
                            <div className="mf-table-header">
                                <div>
                                    <p className="mf-section-label" style={{ marginBottom: 2 }}>Records</p>
                                    <p style={{
                                        fontFamily: "'DM Serif Display', serif",
                                        fontSize: 20, color: '#1a2a4a', fontWeight: 400,
                                    }}>
                                        All FAQs
                                    </p>
                                </div>
                                <span className="mf-badge-count">{faqs.length} total</span>
                            </div>

                            {loading ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="mf-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '35%' }}>Question</th>
                                                <th style={{ width: '45%' }}>Answer</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody><SkeletonRows /></tbody>
                                    </table>
                                </div>
                            ) : faqs.length === 0 ? (
                                <div style={{ padding: '64px 32px', textAlign: 'center' }}>
                                    <HelpCircle size={40} color="#e5e7eb" style={{ margin: '0 auto 16px' }} />
                                    <p style={{ fontSize: 15, color: '#6b7280', fontWeight: 500 }}>No FAQs yet</p>
                                    <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
                                        Add your first question and answer above.
                                    </p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="mf-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '35%' }}>Question</th>
                                                <th style={{ width: '45%' }}>Answer</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {faqs.map((faq, index) => (
                                                <tr key={faq._id}>
                                                    {/* Question cell */}
                                                    <td>
                                                        <div style={{ display: 'flex', gap: 12 }}>
                                                            <div className="mf-num-badge">{index + 1}</div>
                                                            <div>
                                                                <span className="mf-q-tag">
                                                                    <MessageSquare size={10} /> Question
                                                                </span>
                                                                <p style={{ fontSize: 14, fontWeight: 600, color: '#1a2a4a', lineHeight: 1.5 }}>
                                                                    {faq.question}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Answer cell */}
                                                    <td>
                                                        <p style={{
                                                            fontSize: 13,
                                                            color: '#6b7280',
                                                            lineHeight: 1.65,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }} title={faq.answer}>
                                                            {faq.answer}
                                                        </p>
                                                    </td>

                                                    {/* Actions */}
                                                    <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                            <button className="mf-action-edit" onClick={() => handleEdit(faq)}>
                                                                <Edit2 size={14} /> Edit
                                                            </button>
                                                            <button className="mf-action-delete" onClick={() => setDeleteTarget(faq._id)}>
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

export default ManageFAQs;
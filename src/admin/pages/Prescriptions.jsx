import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { Download, ArrowLeft, FileText, Search, ClipboardList, Eye } from 'lucide-react';
import PatientSearch from '../components/prescriptions/PatientSearch';
import PatientHistory from '../components/prescriptions/PrescriptionHistory';
import PrescriptionForm from '../components/prescriptions/PrescriptionForm';
import PrescriptionTemplate from '../components/prescriptions/PrescriptionTemplate';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

// ─── Inline premium styles (same design system) ───────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  .rx-root {
    font-family: 'DM Sans', sans-serif;
    background: #f7f8fc;
    min-height: 100vh;
  }

  /* ── Page header ── */
  .rx-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 28px;
  }
  .rx-page-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #c8102e;
    margin-bottom: 4px;
  }
  .rx-page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    color: #1a2a4a;
    font-weight: 400;
    margin: 0;
    line-height: 1.2;
  }
  .rx-page-sub {
    font-size: 13px;
    color: #9ca3af;
    margin-top: 3px;
    font-weight: 400;
  }

  /* ── Breadcrumb / step indicator ── */
  .rx-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .rx-step {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 20px;
    border: 1.5px solid #e5e7eb;
    color: #9ca3af;
    background: #fff;
    transition: all 0.2s;
  }
  .rx-step.active {
    background: linear-gradient(135deg, #1a2a4a, #243556);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 3px 10px rgba(26,42,74,0.22);
  }
  .rx-step.done {
    background: #f0fdf4;
    color: #16a34a;
    border-color: #bbf7d0;
  }
  .rx-step-sep {
    width: 24px;
    height: 1.5px;
    background: #e5e7eb;
    border-radius: 2px;
  }

  /* ── Content card ── */
  .rx-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    overflow: hidden;
    position: relative;
  }
  .rx-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1a2a4a 0%, #c8102e 100%);
    z-index: 1;
  }
  .rx-card-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 24px 28px 20px;
    border-bottom: 1px solid #f3f4f6;
  }
  .rx-card-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #c8102e;
    margin-bottom: 3px;
  }
  .rx-card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    color: #1a2a4a;
    font-weight: 400;
    margin: 0;
  }
  .rx-card-body {
    padding: 28px;
  }

  /* ── Patient info chip ── */
  .rx-patient-chip {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #f0f4ff;
    border: 1px solid #e0e7ff;
    border-radius: 12px;
    padding: 8px 16px 8px 8px;
  }
  .rx-patient-avatar {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: linear-gradient(135deg, #1a2a4a, #c8102e);
    color: white;
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .rx-patient-name {
    font-size: 13px;
    font-weight: 700;
    color: #1a2a4a;
    line-height: 1.2;
  }
  .rx-patient-sub {
    font-size: 11px;
    color: #6b7280;
    margin-top: 1px;
  }

  /* ── Buttons ── */
  .rx-btn-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #f3f4f6;
    color: #374151;
    padding: 9px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: background 0.18s, transform 0.18s;
    font-family: 'DM Sans', sans-serif;
  }
  .rx-btn-back:hover { background: #e9ebef; transform: translateX(-2px); }

  .rx-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: linear-gradient(135deg, #c8102e 0%, #e11d48 100%);
    color: white;
    padding: 10px 22px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(200,16,46,0.28);
    font-family: 'DM Sans', sans-serif;
  }
  .rx-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(200,16,46,0.36);
  }

  /* ── PDF preview shell ── */
  .rx-pdf-shell {
    background: #e5e7eb;
    border-radius: 12px;
    padding: 32px;
    display: flex;
    justify-content: center;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.06);
    overflow: auto;
  }
  .rx-pdf-paper {
    background: white;
    box-shadow:
      0 4px 24px rgba(0,0,0,0.12),
      0 1px 4px rgba(0,0,0,0.06);
    border-radius: 4px;
    overflow: hidden;
  }
`;

// ─── Step breadcrumb data ──────────────────────────────────────────────────────
const STEPS = [
    { key: 'search', label: 'Search Patient', icon: Search },
    { key: 'history', label: 'History', icon: ClipboardList },
    { key: 'create', label: 'Write Rx', icon: FileText },
    { key: 'view', label: 'Preview', icon: Eye },
];

const stepIndex = (mode) => STEPS.findIndex((s) => s.key === mode);

// ─── Breadcrumb component ─────────────────────────────────────────────────────
const Breadcrumb = ({ viewMode }) => {
    const current = stepIndex(viewMode);
    return (
        <div className="rx-breadcrumb">
            {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isDone = i < current;
                const isActive = i === current;
                return (
                    <React.Fragment key={step.key}>
                        <span className={`rx-step${isActive ? ' active' : isDone ? ' done' : ''}`}>
                            <Icon size={12} />
                            {step.label}
                        </span>
                        {i < STEPS.length - 1 && <div className="rx-step-sep" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Prescriptions = () => {
    const location = useLocation();

    const initialPatient = location.state?.prefilledPatient || null;
    const initialMode = initialPatient ? 'history' : 'search';

    const [viewMode, setViewMode] = useState(initialMode);
    const [selectedPatient, setSelectedPatient] = useState(initialPatient);
    const [currentPrescription, setCurrentPrescription] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const printRef = useRef();

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setViewMode('history');
    };

    const handleBackToSearch = () => {
        setSelectedPatient(null);
        setViewMode('search');
    };

    const handleBackToHistory = () => {
        setCurrentPrescription(null);
        setViewMode('history');
    };

    const handleCreateNew = () => setViewMode('create');

    const handleViewPrescription = (presc) => {
        setCurrentPrescription(presc);
        setViewMode('view');
    };

    const handleSavePrescription = async (formData) => {
        setLoading(true);
        try {
            const payload = { ...formData, patient: selectedPatient._id };
            const res = await axios.post('https://shewale4-0.onrender.com/api/prescriptions', payload);
            toast.success('Prescription created successfully!');
            handleViewPrescription(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to save prescription.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const element = printRef.current;
        const opt = {
            margin: 0,
            filename: `${selectedPatient.name.replace(/\s+/g, '_')}_prescription.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };
        toast.loading('Generating PDF…', { id: 'pdf-toast' });
        html2pdf().set(opt).from(element).save().then(() => {
            toast.success('PDF downloaded!', { id: 'pdf-toast' });
        });
    };

    // ── Card title per mode ────────────────────────────────────────────────────
    const cardMeta = {
        search: { label: 'Step 1', title: 'Search Patient' },
        history: { label: 'Step 2', title: 'Prescription History' },
        create: { label: 'Step 3', title: 'Write New Prescription' },
        view: { label: 'Preview & Save', title: 'Prescription Preview' },
    }[viewMode] || {};

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{styles}</style>

            <div className="admin-layout rx-root">
                <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

                <main className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <AdminNavbar
                        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title="Prescription Management"
                    />

                    <div className="admin-content" style={{ padding: '32px 28px' }}>

                        {/* ── Page header ── */}
                        <div className="rx-page-header">
                            <div>
                                <p className="rx-page-eyebrow">Clinical Tools</p>
                                <h1 className="rx-page-title">Prescription Management</h1>
                                <p className="rx-page-sub">Sai Heart Care</p>
                            </div>

                            {/* Patient chip — visible once a patient is selected */}
                            {selectedPatient && (
                                <div className="rx-patient-chip">
                                    <div className="rx-patient-avatar">
                                        {selectedPatient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="rx-patient-name">{selectedPatient.name}</p>
                                        <p className="rx-patient-sub">
                                            {selectedPatient.age ? `Age ${selectedPatient.age}` : ''}
                                            {selectedPatient.age && selectedPatient.phone ? ' · ' : ''}
                                            {selectedPatient.phone || ''}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Step breadcrumb ── */}
                        <Breadcrumb viewMode={viewMode} />

                        {/* ── Main content card ── */}
                        <div className="rx-card">

                            {/* Card top bar */}
                            <div className="rx-card-topbar">
                                <div>
                                    <p className="rx-card-label">{cardMeta.label}</p>
                                    <p className="rx-card-title">{cardMeta.title}</p>
                                </div>

                                {/* Action buttons aligned to the right */}
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {viewMode === 'history' && (
                                        <button className="rx-btn-back" onClick={handleBackToSearch}>
                                            <ArrowLeft size={15} /> Back to Search
                                        </button>
                                    )}
                                    {viewMode === 'create' && (
                                        <button className="rx-btn-back" onClick={handleBackToHistory}>
                                            <ArrowLeft size={15} /> Back to History
                                        </button>
                                    )}
                                    {viewMode === 'view' && (
                                        <>
                                            <button className="rx-btn-back" onClick={handleBackToHistory}>
                                                <ArrowLeft size={15} /> Back to History
                                            </button>
                                            <button className="rx-btn-primary" onClick={handleDownloadPDF}>
                                                <Download size={15} /> Download PDF
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="rx-card-body">

                                {viewMode === 'search' && (
                                    <PatientSearch onSelectPatient={handleSelectPatient} />
                                )}

                                {viewMode === 'history' && selectedPatient && (
                                    <PatientHistory
                                        patient={selectedPatient}
                                        onBack={handleBackToSearch}
                                        onCreateNew={handleCreateNew}
                                        onViewPrescription={handleViewPrescription}
                                    />
                                )}

                                {viewMode === 'create' && selectedPatient && (
                                    <PrescriptionForm
                                        patient={selectedPatient}
                                        onBack={handleBackToHistory}
                                        onSave={handleSavePrescription}
                                        loading={loading}
                                    />
                                )}

                                {viewMode === 'view' && currentPrescription && selectedPatient && (
                                    <div className="rx-pdf-shell">
                                        <div className="rx-pdf-paper">
                                            <div ref={printRef}>
                                                <PrescriptionTemplate
                                                    prescription={currentPrescription}
                                                    patient={selectedPatient}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
};

export default Prescriptions;
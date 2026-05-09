import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { differenceInYears } from 'date-fns';
import { FileText, Plus, Calendar, User, Phone, Hash, Clock, Stethoscope, Pill } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/apiConfig';

// ─── Inline premium styles ────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ph-wrap {
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Patient info card ── */
  .ph-info-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    padding: 24px 26px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .ph-info-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1a2a4a 0%, #c8102e 100%);
  }
  .ph-info-inner {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }
  .ph-avatar {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1a2a4a, #c8102e);
    color: white;
    font-size: 22px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .ph-patient-name {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: #1a2a4a;
    font-weight: 400;
    margin-bottom: 8px;
  }
  .ph-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .ph-meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f7f8fc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 5px 11px;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
  }
  .ph-meta-pill svg { color: #9ca3af; }

  /* ── New Rx button ── */
  .ph-btn-new {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: linear-gradient(135deg, #c8102e 0%, #e11d48 100%);
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(200,16,46,0.28);
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
  }
  .ph-btn-new:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(200,16,46,0.36);
  }

  /* ── History card ── */
  .ph-history-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    overflow: hidden;
    position: relative;
  }
  .ph-history-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1a2a4a 0%, #c8102e 100%);
  }
  .ph-history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px 14px;
    border-bottom: 1px solid #f3f4f6;
  }
  .ph-history-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #c8102e;
    margin-bottom: 2px;
  }
  .ph-history-title {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    color: #1a2a4a;
    font-weight: 400;
    margin: 0;
  }
  .ph-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f0f4ff;
    color: #1a2a4a;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
  }

  /* ── Loader ── */
  .ph-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 56px 32px;
    gap: 12px;
  }
  .ph-loader-ring {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f4f6;
    border-top-color: #c8102e;
    border-radius: 50%;
    animation: ph-spin 0.75s linear infinite;
  }
  @keyframes ph-spin { to { transform: rotate(360deg); } }
  .ph-loader-text { font-size: 13px; color: #9ca3af; font-weight: 500; }

  /* ── Prescription row ── */
  .ph-rx-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #f3f4f6;
    border-left: 3px solid transparent;
    gap: 16px;
    transition: background 0.18s, border-color 0.18s;
    cursor: default;
  }
  .ph-rx-row:last-child { border-bottom: none; }
  .ph-rx-row:hover {
    background: #fafbff;
    border-left-color: #c8102e;
  }
  .ph-rx-row:hover .ph-view-btn { opacity: 1; transform: translateX(0); }

  .ph-rx-date {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: #1a2a4a;
    margin-bottom: 5px;
  }
  .ph-rx-diag {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 5px;
    max-width: 480px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ph-rx-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .ph-rx-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 2px 8px;
    border-radius: 20px;
  }
  .ph-rx-tag-med { background: #f0f4ff; color: #1a2a4a; }

  /* ── View button ── */
  .ph-view-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #c8102e;
    background: #fff1f2;
    border: 1px solid #fecdd3;
    padding: 7px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.18s, opacity 0.2s, transform 0.2s;
    opacity: 0.7;
    transform: translateX(4px);
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
    border: none;
  }
  .ph-view-btn:hover { background: #ffe4e6; }

  /* ── Empty state ── */
  .ph-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 32px;
    text-align: center;
  }
  .ph-empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: #f0f4ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .ph-empty-title {
    font-size: 15px;
    font-weight: 700;
    color: #1a2a4a;
    margin-bottom: 4px;
  }
  .ph-empty-sub {
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .ph-empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: linear-gradient(135deg, #1a2a4a, #243556);
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(26,42,74,0.22);
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .ph-empty-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(26,42,74,0.3);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
const PatientHistory = ({ patient, onBack, onCreateNew, onViewPrescription }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const calculatedAge = patient.dob
        ? differenceInYears(new Date(), new Date(patient.dob))
        : null;

    useEffect(() => {
        if (!patient._id) return;
        const fetch = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/prescriptions/patient/${patient._id}`);
                setPrescriptions(res.data.data);
            } catch (err) {
                console.error('Error fetching patient history', err);
                toast.error('Failed to load prescription history');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [patient._id]);

    return (
        <>
            <style>{styles}</style>

            <div className="ph-wrap">

                {/* ── Patient info card ── */}
                <div className="ph-info-card">
                    <div className="ph-info-inner">
                        {/* Avatar */}
                        <div className="ph-avatar">
                            {patient.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="ph-patient-name">{patient.name}</p>
                            <div className="ph-meta-row">
                                {calculatedAge !== null && (
                                    <span className="ph-meta-pill">
                                        <User size={12} /> Age {calculatedAge}
                                    </span>
                                )}
                                {patient.gender && (
                                    <span className="ph-meta-pill">
                                        <User size={12} /> {patient.gender}
                                    </span>
                                )}
                                {patient.phone && (
                                    <span className="ph-meta-pill">
                                        <Phone size={12} /> {patient.phone}
                                    </span>
                                )}
                                {patient.uhid && (
                                    <span className="ph-meta-pill">
                                        <Hash size={12} /> {patient.uhid}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* New Rx CTA */}
                        <button className="ph-btn-new" onClick={onCreateNew}>
                            <Plus size={15} /> New Prescription
                        </button>
                    </div>
                </div>

                {/* ── Prescription history card ── */}
                <div className="ph-history-card">
                    <div className="ph-history-header">
                        <div>
                            <p className="ph-history-label">Medical Records</p>
                            <p className="ph-history-title">Prescription History</p>
                        </div>
                        <span className="ph-count-badge">
                            <FileText size={12} />
                            {prescriptions.length} record{prescriptions.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Loader */}
                    {loading ? (
                        <div className="ph-loader">
                            <div className="ph-loader-ring" />
                            <p className="ph-loader-text">Loading prescription history…</p>
                        </div>
                    ) : prescriptions.length > 0 ? (
                        <div>
                            {prescriptions.map((presc) => (
                                <div key={presc._id} className="ph-rx-row">
                                    {/* Left: info */}
                                    <div style={{ minWidth: 0 }}>
                                        <p className="ph-rx-date">
                                            <Calendar size={13} color="#c8102e" />
                                            {new Date(presc.date).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                            })}
                                        </p>
                                        <p className="ph-rx-diag">
                                            {presc.diagnosis || 'No specific diagnosis listed'}
                                        </p>
                                        <div className="ph-rx-tags">
                                            <span className="ph-rx-tag ph-rx-tag-med">
                                                <Pill size={9} />
                                                {presc.medications?.length || 0} Medication{presc.medications?.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: view button */}
                                    <button
                                        className="ph-view-btn"
                                        onClick={() => onViewPrescription(presc)}
                                    >
                                        <FileText size={13} /> View / Print
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="ph-empty">
                            <div className="ph-empty-icon">
                                <Stethoscope size={26} color="#1a2a4a" />
                            </div>
                            <p className="ph-empty-title">No prescriptions yet</p>
                            <p className="ph-empty-sub">
                                This patient has no prescription records.<br />
                                Create the first one to get started.
                            </p>
                            <button className="ph-empty-btn" onClick={onCreateNew}>
                                <Plus size={15} /> Write First Prescription
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default PatientHistory;
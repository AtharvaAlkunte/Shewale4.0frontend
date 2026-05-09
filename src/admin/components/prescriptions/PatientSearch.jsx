import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, UserX, Users } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
// ─── Inline premium styles ────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── Search box ── */
  .ps-wrap {
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 4px;
  }

  .ps-search-row {
    position: relative;
    max-width: 640px;
  }
  .ps-search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #9ca3af;
    transition: color 0.2s;
  }
  .ps-search-icon.active { color: #c8102e; }

  .ps-input {
    width: 100%;
    padding: 14px 48px 14px 48px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #1a2a4a;
    background: #fafafa;
    outline: none;
    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
    box-sizing: border-box;
  }
  .ps-input::placeholder { color: #9ca3af; font-weight: 400; }
  .ps-input:focus {
    border-color: #c8102e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(200,16,46,0.08);
  }

  /* ── Spinner ── */
  .ps-spinner-wrap {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
  .ps-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #f3f4f6;
    border-top-color: #c8102e;
    border-radius: 50%;
    animation: ps-spin 0.7s linear infinite;
  }
  @keyframes ps-spin { to { transform: rotate(360deg); } }

  /* ── Results dropdown ── */
  .ps-results {
    max-width: 640px;
    margin-top: 6px;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
    animation: ps-drop 0.2s cubic-bezier(.22,1,.36,1);
  }
  @keyframes ps-drop {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Result header ── */
  .ps-results-header {
    padding: 10px 16px;
    background: #f9fafb;
    border-bottom: 1px solid #f3f4f6;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #9ca3af;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── Result row ── */
  .ps-result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.16s;
    gap: 12px;
  }
  .ps-result-row:last-child { border-bottom: none; }
  .ps-result-row:hover { background: #fafbff; }
  .ps-result-row:hover .ps-arrow-btn { opacity: 1; transform: scale(1); }

  /* ── Patient avatar ── */
  .ps-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #1a2a4a, #c8102e);
    color: white;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ps-patient-name {
    font-size: 14px;
    font-weight: 700;
    color: #1a2a4a;
    margin-bottom: 4px;
    transition: color 0.16s;
  }
  .ps-result-row:hover .ps-patient-name { color: #c8102e; }

  .ps-meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .ps-meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 500;
    color: #6b7280;
  }
  .ps-meta-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Arrow button ── */
  .ps-arrow-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #1a2a4a, #243556);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    opacity: 0;
    transform: scale(0.85);
    transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 3px 10px rgba(26,42,74,0.22);
  }
  .ps-arrow-btn:hover {
    background: linear-gradient(135deg, #c8102e, #e11d48);
    box-shadow: 0 4px 14px rgba(200,16,46,0.3);
  }

  /* ── Empty state ── */
  .ps-empty {
    max-width: 640px;
    margin-top: 6px;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    padding: 28px 24px;
    text-align: center;
    animation: ps-drop 0.2s cubic-bezier(.22,1,.36,1);
  }
  .ps-empty-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #fff1f2;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
  }
  .ps-empty-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a2a4a;
    margin-bottom: 4px;
  }
  .ps-empty-sub {
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.6;
  }

  /* ── Hint text ── */
  .ps-hint {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ps-hint-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #d1d5db;
    flex-shrink: 0;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
const PatientSearch = ({ onSelectPatient }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            if (query.trim().length < 2) { setResults([]); return; }
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/api/patients/search?query=${query}`);
                setResults(res.data.data);
            } catch (err) {
                console.error('Error searching patients:', err);
            } finally {
                setLoading(false);
            }
        };

        const t = setTimeout(fetchPatients, 300);
        return () => clearTimeout(t);
    }, [query]);

    const handleSelect = (patient) => {
        onSelectPatient(patient);
        setQuery('');
        setResults([]);
    };

    const showResults = results.length > 0;
    const showEmpty = query.trim().length >= 2 && !loading && results.length === 0;

    return (
        <>
            <style>{styles}</style>

            <div className="ps-wrap">

                {/* Search input */}
                <div className="ps-search-row">
                    <Search
                        size={18}
                        className={`ps-search-icon${query ? ' active' : ''}`}
                    />

                    <input
                        type="text"
                        className="ps-input"
                        placeholder="Search by Name, Phone, or UHID (min 2 chars)…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoComplete="off"
                    />

                    {loading && (
                        <div className="ps-spinner-wrap">
                            <div className="ps-spinner" />
                        </div>
                    )}
                </div>

                {/* Hint */}
                {!query && (
                    <p className="ps-hint">
                        <span className="ps-hint-dot" />
                        Type at least 2 characters to search patient records
                    </p>
                )}

                {/* Results */}
                {showResults && (
                    <div className="ps-results">
                        <div className="ps-results-header">
                            <Users size={11} />
                            {results.length} patient{results.length !== 1 ? 's' : ''} found
                        </div>

                        {results.map((patient) => (
                            <div
                                key={patient._id}
                                className="ps-result-row"
                                onClick={() => handleSelect(patient)}
                            >
                                {/* Left: avatar + info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                                    <div className="ps-avatar">
                                        {patient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p className="ps-patient-name">{patient.name}</p>
                                        <div className="ps-meta">
                                            <span className="ps-meta-pill">
                                                <span className="ps-meta-dot" style={{ background: '#16a34a' }} />
                                                {patient.phone || 'No phone'}
                                            </span>
                                            <span className="ps-meta-pill">
                                                <span className="ps-meta-dot" style={{ background: '#7c3aed' }} />
                                                {patient.uhid || 'No UHID'}
                                            </span>
                                            {patient.age && (
                                                <span className="ps-meta-pill">
                                                    <span className="ps-meta-dot" style={{ background: '#c8102e' }} />
                                                    Age {patient.age}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: arrow button */}
                                <button className="ps-arrow-btn" tabIndex={-1} aria-hidden>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {showEmpty && (
                    <div className="ps-empty">
                        <div className="ps-empty-icon">
                            <UserX size={22} color="#c8102e" />
                        </div>
                        <p className="ps-empty-title">No patients found for "{query}"</p>
                        <p className="ps-empty-sub">
                            Double-check the spelling, or register a new patient<br />
                            through the Patient Registry.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default PatientSearch;
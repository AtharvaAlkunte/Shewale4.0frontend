import React, { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, Pill, FlaskConical, HeartPulse, CalendarDays, ClipboardList, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// ─── Inline premium styles ────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pf-wrap {
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Section card ── */
  .pf-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    overflow: hidden;
    margin-bottom: 20px;
    position: relative;
  }
  .pf-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--card-accent, linear-gradient(90deg, #1a2a4a, #c8102e));
  }
  .pf-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px 14px;
    border-bottom: 1px solid #f3f4f6;
    gap: 10px;
  }
  .pf-card-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .pf-card-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .pf-card-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #c8102e;
    margin-bottom: 2px;
  }
  .pf-card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 17px;
    color: #1a2a4a;
    font-weight: 400;
    margin: 0;
  }
  .pf-card-body {
    padding: 20px 22px;
  }

  /* ── Label & Input ── */
  .pf-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
  .pf-input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    color: #1a2a4a;
    background: #fafafa;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .pf-input::placeholder { color: #b0b7c3; font-weight: 400; }
  .pf-input:focus {
    border-color: #c8102e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(200,16,46,0.08);
  }
  .pf-textarea {
    resize: vertical;
    min-height: 88px;
    line-height: 1.6;
  }

  /* ── Grid ── */
  .pf-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 768px) {
    .pf-grid-2 { grid-template-columns: 1fr; }
  }
  .pf-field { margin-bottom: 16px; }
  .pf-field:last-child { margin-bottom: 0; }

  /* ── Add button (small) ── */
  .pf-btn-add-sm {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: #1a2a4a;
    background: #f0f4ff;
    border: 1px solid #e0e7ff;
    padding: 5px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.18s;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .pf-btn-add-sm:hover { background: #e0e7ff; }

  /* ── Add medication button ── */
  .pf-btn-add-med {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #1a2a4a;
    background: #f0f4ff;
    border: 1.5px solid #e0e7ff;
    padding: 8px 16px;
    border-radius: 9px;
    cursor: pointer;
    transition: background 0.18s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .pf-btn-add-med:hover { background: #e0e7ff; transform: translateY(-1px); }

  /* ── Save button ── */
  .pf-btn-save {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #c8102e 0%, #e11d48 100%);
    color: white;
    padding: 11px 24px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 4px 14px rgba(200,16,46,0.28);
    font-family: 'DM Sans', sans-serif;
  }
  .pf-btn-save:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(200,16,46,0.36);
  }
  .pf-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Delete button ── */
  .pf-btn-del {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #fff1f2;
    color: #c8102e;
    border: none;
    cursor: pointer;
    transition: background 0.18s;
    flex-shrink: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .pf-btn-del:hover:not(:disabled) { background: #ffe4e6; }
  .pf-btn-del:disabled { color: #d1d5db; background: #f9fafb; cursor: not-allowed; }

  /* ── Medications table ── */
  .pf-med-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .pf-med-table th {
    padding: 10px 12px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9ca3af;
    background: #f9fafb;
    border-bottom: 1.5px solid #f3f4f6;
    white-space: nowrap;
  }
  .pf-med-table td {
    padding: 10px 10px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: top;
  }
  .pf-med-table tbody tr:last-child td { border-bottom: none; }
  .pf-med-table tbody tr:hover td { background: #fafbff; }

  .pf-cell-input {
    width: 100%;
    padding: 8px 10px;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #1a2a4a;
    background: #fafafa;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    resize: vertical;
  }
  .pf-cell-input::placeholder { color: #b0b7c3; font-size: 12px; }
  .pf-cell-input:focus {
    border-color: #c8102e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(200,16,46,0.08);
  }

  /* ── Advice row ── */
  .pf-advice-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .pf-advice-num {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: linear-gradient(135deg, #1a2a4a, #c8102e);
    color: white;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ── Form submit strip ── */
  .pf-submit-strip {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
  }

  /* ── Spinner inside save ── */
  .pf-save-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: pf-spin 0.7s linear infinite;
  }
  @keyframes pf-spin { to { transform: rotate(360deg); } }

  /* ── AutoComplete Dropdown — now rendered as fixed portal ── */
  .pf-autocomplete-dropdown {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.14);
    max-height: 260px;
    overflow-y: auto;
  }
  .pf-suggestion-item {
    padding: 10px 14px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background 0.15s;
  }
  .pf-suggestion-item:last-child {
    border-bottom: none;
  }
  .pf-suggestion-item:hover {
    background: #f9fafb;
  }
  .pf-suggestion-title {
    font-weight: 600;
    color: #1a2a4a;
    font-size: 13.5px;
    margin-bottom: 2px;
  }
  .pf-suggestion-sub {
    font-size: 11.5px;
    color: #6b7280;
  }
  .pf-suggestion-add {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #c8102e;
    font-weight: 600;
    font-size: 13px;
    padding: 12px 14px;
    cursor: pointer;
    background: #fff1f2;
    transition: background 0.15s;
  }
  .pf-suggestion-add:hover {
    background: #ffe4e6;
  }

  /* ── Modal Overlay ── */
  .pf-modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(17, 24, 39, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
  }
  .pf-modal-content {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    overflow: hidden;
  }
  .pf-modal-header {
    padding: 18px 24px;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pf-modal-title {
    font-weight: 600;
    font-size: 18px;
    color: #1a2a4a;
    margin: 0;
    font-family: 'DM Serif Display', serif;
  }
  .pf-modal-close {
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    transition: color 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pf-modal-close:hover {
    color: #4b5563;
  }
  .pf-modal-body {
    padding: 24px;
  }
  .pf-modal-footer {
    padding: 16px 24px;
    background: #f9fafb;
    border-top: 1px solid #f3f4f6;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  .pf-btn-cancel {
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 600;
    color: #4b5563;
    background: #fff;
    border: 1.5px solid #d1d5db;
    cursor: pointer;
    transition: all 0.15s;
  }
  .pf-btn-cancel:hover {
    background: #f3f4f6;
  }
`;

// ─── Section Card wrapper ─────────────────────────────────────────────────────
const SectionCard = ({ label, title, icon: Icon, iconBg, iconColor, accent, action, children }) => (
    <div className="pf-card" style={{ '--card-accent': accent || 'linear-gradient(90deg,#1a2a4a,#c8102e)' }}>
        <div className="pf-card-header">
            <div className="pf-card-header-left">
                <div className="pf-card-icon" style={{ background: iconBg }}>
                    <Icon size={16} color={iconColor} />
                </div>
                <div>
                    <p className="pf-card-label">{label}</p>
                    <p className="pf-card-title">{title}</p>
                </div>
            </div>
            {action && action}
        </div>
        <div className="pf-card-body">{children}</div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PrescriptionForm = ({ patient, onBack, onSave, loading }) => {
    const [formData, setFormData] = useState({
        vitals: { bodyWeight: patient.weight || '' },
        notes: '',
        diagnosis: '',
        medications: [{ name: '', frequency: '', duration: '', remarks: '' }],
        investigations: '',
        advice: [''],
        followUpDate: '',
    });

    // ── Autocomplete State ──
    const [activeSearchIndex, setActiveSearchIndex] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMedicineQuery, setNewMedicineQuery] = useState('');
    const [newMedForm, setNewMedForm] = useState({
        genericName: '',
        shortName: '',
        brands: '',
        category: '',
        commonDoses: ''
    });
    const [savingMed, setSavingMed] = useState(false);

    // ── FIX: track dropdown position for fixed positioning ──
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    const searchTimeoutRef = useRef(null);
    // ── FIX: refs array for each medication textarea ──
    const inputRefs = useRef([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // ── FIX: also close on scroll since dropdown is fixed ──
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActiveSearchIndex(null);
            }
        };
        const handleScroll = (e) => {
            if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
                return;
            }
            setActiveSearchIndex(null);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, []);

    const fetchSuggestions = async (query) => {
        if (!query || query.trim().length === 0) {
            setSuggestions([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await fetch(`/api/medicines/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.success) {
                setSuggestions(data.data);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Failed to fetch medicines", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleCreateMedicine = async (e) => {
        e.preventDefault();
        if (!newMedForm.genericName) {
            toast.error("Generic name is required");
            return;
        }
        setSavingMed(true);
        try {
            const res = await fetch('/api/medicines/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newMedForm,
                    brands: newMedForm.brands ? newMedForm.brands.split(',').map(b => b.trim()) : [],
                    commonDoses: newMedForm.commonDoses ? newMedForm.commonDoses.split(',').map(d => d.trim()) : []
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Medicine added successfully");

                if (activeSearchIndex !== null) {
                    const meds = [...formData.medications];
                    let doseStr = data.data.commonDoses && data.data.commonDoses.length > 0 ? data.data.commonDoses[0] : '';
                    meds[activeSearchIndex].name = `${data.data.genericName} ${data.data.shortName ? `(${data.data.shortName})` : ''} ${doseStr ? `- ${doseStr}` : ''}`.trim();
                    setFormData(prev => ({ ...prev, medications: meds }));
                }

                setShowAddModal(false);
                setActiveSearchIndex(null);
            } else {
                toast.error(data.error || "Failed to add medicine");
            }
        } catch (error) {
            console.error("Add medicine error:", error);
            toast.error("An error occurred while adding medicine");
        } finally {
            setSavingMed(false);
        }
    };

    const handleMedicineSelect = (medicine, index) => {
        const meds = [...formData.medications];
        let doseStr = medicine.commonDoses && medicine.commonDoses.length > 0 ? medicine.commonDoses[0] : '';
        meds[index].name = `${medicine.genericName} ${medicine.shortName ? `(${medicine.shortName})` : ''} ${doseStr ? `- ${doseStr}` : ''}`.trim();
        setFormData(prev => ({ ...prev, medications: meds }));
        setActiveSearchIndex(null);
    };

    // ── FIX: helper to compute and store dropdown position ──
    const updateDropdownPos = (index) => {
        const el = inputRefs.current[index];
        if (el) {
            const rect = el.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            });
        }
    };

    // ── Handlers ──
    const set = (field, value) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const setNested = (field, subfield, value) =>
        setFormData((prev) => ({ ...prev, [field]: { ...prev[field], [subfield]: value } }));

    const handleMedChange = (index, field, value) => {
        const meds = [...formData.medications];
        meds[index][field] = value;
        set('medications', meds);

        if (field === 'name') {
            // ── FIX: update position before showing dropdown ──
            updateDropdownPos(index);
            setActiveSearchIndex(index);
            setNewMedicineQuery(value);

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                fetchSuggestions(value);
            }, 300);
        }
    };

    const addMed = () => set('medications', [...formData.medications, { name: '', frequency: '', duration: '', remarks: '' }]);
    const removeMed = (i) => set('medications', formData.medications.filter((_, idx) => idx !== i));

    const handleAdviceChange = (i, value) => {
        const a = [...formData.advice];
        a[i] = value;
        set('advice', a);
    };
    const addAdvice = () => set('advice', [...formData.advice, '']);
    const removeAdvice = (i) => set('advice', formData.advice.filter((_, idx) => idx !== i));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    // ── Render ──
    return (
        <>
            <style>{styles}</style>

            <form onSubmit={handleSubmit} className="pf-wrap">

                {/* ── Two-column top row ── */}
                <div className="pf-grid-2">

                    {/* Clinical Details */}
                    <SectionCard
                        label="Step 1"
                        title="Clinical Details"
                        icon={HeartPulse}
                        iconBg="#fff1f2"
                        iconColor="#c8102e"
                        accent="linear-gradient(90deg,#c8102e,#e11d48)"
                    >
                        <div className="pf-field">
                            <label className="pf-label">Body Weight (kg)</label>
                            <input
                                type="text"
                                className="pf-input"
                                placeholder="e.g. 68"
                                value={formData.vitals.bodyWeight}
                                onChange={(e) => setNested('vitals', 'bodyWeight', e.target.value)}
                            />
                        </div>

                        <div className="pf-field">
                            <label className="pf-label">Clinical Notes (BP, Heart Rate, etc.)</label>
                            <textarea
                                className="pf-input pf-textarea"
                                placeholder={`Heart Rate (BPM): 80\nBlood Pressure (mmHg): 130/80\nSpO2 (%): 98`}
                                value={formData.notes}
                                onChange={(e) => set('notes', e.target.value)}
                            />
                        </div>

                        <div className="pf-field">
                            <label className="pf-label">Diagnosis</label>
                            <input
                                type="text"
                                className="pf-input"
                                placeholder="e.g. Acute MI, Coronary Artery Disease"
                                value={formData.diagnosis}
                                onChange={(e) => set('diagnosis', e.target.value)}
                            />
                        </div>
                    </SectionCard>

                    {/* Tests & Follow-up */}
                    <SectionCard
                        label="Step 2"
                        title="Tests & Follow-up"
                        icon={FlaskConical}
                        iconBg="#f0fdf4"
                        iconColor="#16a34a"
                        accent="linear-gradient(90deg,#16a34a,#22c55e)"
                    >
                        <div className="pf-field">
                            <label className="pf-label">Investigations Advised</label>
                            <textarea
                                className="pf-input pf-textarea"
                                placeholder="e.g. CBC, Urea, Creatinine, Lipid Profile, ECG, Echo"
                                value={formData.investigations}
                                onChange={(e) => set('investigations', e.target.value)}
                            />
                        </div>

                        <div className="pf-field">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <label className="pf-label" style={{ margin: 0 }}>Patient Advice</label>
                                <button type="button" className="pf-btn-add-sm" onClick={addAdvice}>
                                    <Plus size={12} /> Add Point
                                </button>
                            </div>
                            {formData.advice.map((adv, i) => (
                                <div key={i} className="pf-advice-row">
                                    <div className="pf-advice-num">{i + 1}</div>
                                    <input
                                        type="text"
                                        className="pf-input"
                                        style={{ marginBottom: 0 }}
                                        placeholder="e.g. Avoid salty and oily food"
                                        value={adv}
                                        onChange={(e) => handleAdviceChange(i, e.target.value)}
                                    />
                                    {formData.advice.length > 1 && (
                                        <button type="button" className="pf-btn-del" onClick={() => removeAdvice(i)}>
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pf-field">
                            <label className="pf-label">Follow-up Date</label>
                            <input
                                type="date"
                                className="pf-input"
                                value={formData.followUpDate}
                                onChange={(e) => set('followUpDate', e.target.value)}
                            />
                        </div>
                    </SectionCard>
                </div>

                {/* ── Medications ── */}
                <SectionCard
                    label="Step 3"
                    title="Medications"
                    icon={Pill}
                    iconBg="#f0f4ff"
                    iconColor="#1a2a4a"
                    accent="linear-gradient(90deg,#1a2a4a,#243556)"
                    action={
                        <button type="button" className="pf-btn-add-med" onClick={addMed}>
                            <Plus size={15} /> Add Medication
                        </button>
                    }
                >
                    {/* ── FIX: removed overflow:auto wrapper — let table overflow naturally ── */}
                    <div style={{ overflowX: 'visible' }}>
                        <table className="pf-med-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '35%' }}>Medicine Name &amp; Dose</th>
                                    <th style={{ width: '15%' }}>Frequency</th>
                                    <th style={{ width: '15%' }}>Duration</th>
                                    <th>Remarks / Instructions</th>
                                    <th style={{ width: 52, textAlign: 'center' }}>Del</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.medications.map((med, i) => (
                                    <tr key={i}>
                                        <td>
                                            {/* ── FIX: no relative wrapper needed; dropdown is now fixed ── */}
                                            <textarea
                                                className="pf-cell-input"
                                                style={{ minHeight: 56 }}
                                                placeholder="e.g. Tab. Aspirin 75 mg"
                                                value={med.name}
                                                // ── FIX: store ref for each row ──
                                                ref={el => inputRefs.current[i] = el}
                                                onChange={(e) => handleMedChange(i, 'name', e.target.value)}
                                                onFocus={() => {
                                                    if (med.name) {
                                                        updateDropdownPos(i);
                                                        setActiveSearchIndex(i);
                                                        fetchSuggestions(med.name);
                                                    }
                                                }}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="pf-cell-input"
                                                placeholder="e.g. 1-0-1"
                                                value={med.frequency}
                                                onChange={(e) => handleMedChange(i, 'frequency', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="pf-cell-input"
                                                placeholder="e.g. 30 Days"
                                                value={med.duration}
                                                onChange={(e) => handleMedChange(i, 'duration', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="pf-cell-input"
                                                placeholder="e.g. Take after meals at night"
                                                value={med.remarks}
                                                onChange={(e) => handleMedChange(i, 'remarks', e.target.value)}
                                            />
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <button
                                                type="button"
                                                className="pf-btn-del"
                                                style={{ margin: '0 auto' }}
                                                onClick={() => removeMed(i)}
                                                disabled={formData.medications.length === 1}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>

                {/* ── Submit ── */}
                <div className="pf-submit-strip">
                    <button type="submit" className="pf-btn-save" disabled={loading}>
                        {loading ? (
                            <>
                                <div className="pf-save-spinner" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Save size={16} /> Save &amp; Preview
                            </>
                        )}
                    </button>
                </div>

            </form>

            {/* ── FIX: Dropdown rendered as a fixed portal — completely outside table/card DOM ── */}
            {activeSearchIndex !== null && (
                <div
                    ref={dropdownRef}
                    className="pf-autocomplete-dropdown"
                    style={{
                        position: 'fixed',
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width,
                        zIndex: 99999,
                    }}
                >
                    {isSearching ? (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                            <Loader2 size={18} style={{ margin: '0 auto 8px', display: 'block' }} />
                            <span style={{ fontSize: '13px' }}>Searching medicines...</span>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            {suggestions.map((sug) => (
                                <div
                                    key={sug._id}
                                    className="pf-suggestion-item"
                                    onMouseDown={(e) => {
                                        // use onMouseDown so it fires before onBlur
                                        e.preventDefault();
                                        handleMedicineSelect(sug, activeSearchIndex);
                                    }}
                                >
                                    <div className="pf-suggestion-title">
                                        {sug.genericName} {sug.shortName && `(${sug.shortName})`}
                                    </div>
                                    <div className="pf-suggestion-sub">
                                        {sug.commonDoses?.length > 0 && <span>Doses: {sug.commonDoses.join(', ')} • </span>}
                                        {sug.brands?.length > 0 && <span>Brands: {sug.brands.join(', ')}</span>}
                                    </div>
                                </div>
                            ))}
                            <div
                                className="pf-suggestion-add"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setNewMedForm(prev => ({ ...prev, genericName: newMedicineQuery }));
                                    setShowAddModal(true);
                                    setActiveSearchIndex(null);
                                }}
                            >
                                <Plus size={16} /> Add new medicine: "{newMedicineQuery}"
                            </div>
                        </>
                    ) : newMedicineQuery.trim().length > 0 ? (
                        <div className="pf-suggestion-item" style={{ cursor: 'default' }}>
                            <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>No matches found.</div>
                            <div
                                className="pf-suggestion-add"
                                style={{ borderRadius: '6px' }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setNewMedForm(prev => ({ ...prev, genericName: newMedicineQuery }));
                                    setShowAddModal(true);
                                    setActiveSearchIndex(null);
                                }}
                            >
                                <Plus size={16} /> Add new medicine: "{newMedicineQuery}"
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* ── Add Medicine Modal ── */}
            {showAddModal && (
                <div className="pf-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="pf-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="pf-modal-header">
                            <h3 className="pf-modal-title">Add New Medicine</h3>
                            <button type="button" className="pf-modal-close" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="pf-modal-body">
                            <div className="pf-grid-2">
                                <div className="pf-field">
                                    <label className="pf-label">Generic Name *</label>
                                    <input
                                        type="text"
                                        className="pf-input"
                                        value={newMedForm.genericName}
                                        onChange={(e) => setNewMedForm({ ...newMedForm, genericName: e.target.value })}
                                        placeholder="e.g. Paracetamol"
                                        autoFocus
                                    />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">Short Name</label>
                                    <input
                                        type="text"
                                        className="pf-input"
                                        value={newMedForm.shortName}
                                        onChange={(e) => setNewMedForm({ ...newMedForm, shortName: e.target.value })}
                                        placeholder="e.g. PCM"
                                    />
                                </div>
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Brands (Comma separated)</label>
                                <input
                                    type="text"
                                    className="pf-input"
                                    value={newMedForm.brands}
                                    onChange={(e) => setNewMedForm({ ...newMedForm, brands: e.target.value })}
                                    placeholder="e.g. Crocin, Calpol, Dolo"
                                />
                            </div>
                            <div className="pf-grid-2">
                                <div className="pf-field">
                                    <label className="pf-label">Category</label>
                                    <input
                                        type="text"
                                        className="pf-input"
                                        value={newMedForm.category}
                                        onChange={(e) => setNewMedForm({ ...newMedForm, category: e.target.value })}
                                        placeholder="e.g. Analgesic, Antipyretic"
                                    />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">Common Doses (Comma separated)</label>
                                    <input
                                        type="text"
                                        className="pf-input"
                                        value={newMedForm.commonDoses}
                                        onChange={(e) => setNewMedForm({ ...newMedForm, commonDoses: e.target.value })}
                                        placeholder="e.g. 500 mg, 650 mg"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pf-modal-footer">
                            <button type="button" className="pf-btn-cancel" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button type="button" className="pf-btn-save" onClick={handleCreateMedicine} disabled={savingMed}>
                                {savingMed ? 'Saving...' : 'Save Medicine'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PrescriptionForm;
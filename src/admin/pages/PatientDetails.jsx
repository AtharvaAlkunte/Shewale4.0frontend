import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//ID
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap');

  :root {
    --crimson: #C8102E;
    --crimson-dark: #9B0C22;
    --bg-main: #F4F7FA;
    --white: #FFFFFF;
    --text-main: #1A202C;
    --text-muted: #64748B;
    --border-subtle: rgba(0, 0, 0, 0.06);
    --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  }

  .details-root {
    min-height: 100vh;
    background: var(--bg-main);
    font-family: 'Inter', sans-serif;
    color: var(--text-main);
    padding: 40px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 24px;
    transition: color 0.2s;
    cursor: pointer;
  }

  .back-link:hover { color: var(--crimson); }

  /* ── Header Card ── */
  .profile-card {
    background: var(--white);
    border-radius: 16px;
    padding: 32px;
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    gap: 32px;
    margin-bottom: 32px;
    border-left: 6px solid var(--crimson);
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
    background: #F1F5F9;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Rajdhani', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--crimson);
    border: 1px solid var(--border-subtle);
  }

  .profile-info h1 {
    font-family: 'Rajdhani', sans-serif;
    font-size: 2.2rem;
    margin: 0;
    line-height: 1.1;
  }

  .profile-meta {
    display: flex;
    gap: 24px;
    margin-top: 10px;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .meta-item b { color: var(--text-main); margin-right: 4px; }

  /* ── Dashboard Grid ── */
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 32px;
  }

  .content-panel {
    background: var(--white);
    border-radius: 16px;
    padding: 28px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border-subtle);
  }

  .panel-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--crimson);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* ── Form Styling ── */
  .form-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .styled-input, .styled-textarea {
    width: 100%;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: var(--text-main);
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
    margin-bottom: 20px;
  }

  .styled-input:focus, .styled-textarea:focus {
    border-color: var(--crimson);
    background: white;
    box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.05);
  }

  .btn-save {
    background: var(--crimson);
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 8px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-save:hover {
    background: var(--crimson-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(200,16,46,0.2);
  }

  @media (max-width: 900px) {
    .details-grid { grid-template-columns: 1fr; }
    .profile-card { flex-direction: column; text-align: center; }
  }
`;

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ currentPrescription: '', lastVisited: '' });

  const fetchPatient = async () => {
    try {
      const res = await fetch(`https://shewale4-0.onrender.com/api/patients/${id}`);
      const data = await res.json();
      setPatient(data.data);
      setForm({
        currentPrescription: data.data.currentPrescription || '',
        lastVisited: data.data.lastVisited ? data.data.lastVisited.split('T')[0] : ''
      });
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchPatient(); }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      await fetch(`https://shewale4-0.onrender.com/api/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      alert('Medical records updated successfully.');
      fetchPatient();
    } catch (e) { alert('Update failed'); }
  };

  if (!patient) return <div className="details-root">Loading clinical data...</div>;

  const initials = patient.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="details-root">
      <style>{styles}</style>

      <div className="back-link" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Patient Registry
      </div>

      {/* Profile Header */}
      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <h1>{patient.name}</h1>
          <div className="profile-meta">
            <div className="meta-item"><b>ID:</b> #{patient._id.slice(-6).toUpperCase()}</div>
            <div className="meta-item"><b>DOB:</b> {new Date(patient.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div className="meta-item"><b>Gender:</b> {patient.gender || 'Not specified'}</div>
            <div className="meta-item"><b>Phone:</b> {patient.phone || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="details-grid">
        {/* Visit History Column */}
        <div className="content-panel">
          <div className="panel-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Visit Schedule
          </div>

          <label className="form-label">Last Consultation Date</label>
          <input
            className="styled-input"
            type="date"
            name="lastVisited"
            value={form.lastVisited}
            onChange={handleChange}
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Ensure the date matches the physical check-in record.
          </p>
        </div>

        {/* Prescription Column */}
        <div className="content-panel">
          <div className="panel-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Current Prescription & Notes
          </div>

          <label className="form-label">Clinical Observations</label>
          <textarea
            className="styled-textarea"
            name="currentPrescription"
            value={form.currentPrescription}
            onChange={handleChange}
            rows="8"
            placeholder="Enter medication details, dosage, and follow-up instructions..."
          />

          <div style={{ textAlign: 'right' }}>
            <button className="btn-save" onClick={handleUpdate} style={{ marginBottom: '10px', width: '100%', justifyContent: 'center' }}>
              Update Medical Record
            </button>
            <button
              style={{
                background: '#1a365d', color: 'white', border: 'none', padding: '12px 32px',
                borderRadius: '8px', cursor: 'pointer', fontFamily: 'Rajdhani', fontWeight: '700',
                fontSize: '1rem', textTransform: 'uppercase', width: '100%', display: 'block'
              }}
              onClick={() => navigate('/admin/prescriptions', { state: { prefilledPatient: patient } })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Manage PDF Prescriptions & History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
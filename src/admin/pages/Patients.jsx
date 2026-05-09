import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap');

  :root {
    --crimson: #C8102E;
    --crimson-dark: #9B0C22;
    --crimson-glow: rgba(200, 16, 46, 0.08);
    /* Changed Colors */
    --bg-main: #F4F7FA;
    --white: #FFFFFF;
    --text-main: #1A202C;
    --text-muted: #64748B;
    --navy-light: #E2E8F0;
    --steel: #CBD5E0;
    --border-subtle: rgba(0, 0, 0, 0.06);
    --input-bg: #FFFFFF;
    --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    --card-bg: #FFFFFF;
  }

  .patients-root {
    min-height: 100vh;
    background: var(--bg-main);
    background-image: 
      radial-gradient(at 0% 0%, rgba(200,16,46,0.03) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(27,108,168,0.03) 0px, transparent 50%);
    font-family: 'Inter', sans-serif;
    color: var(--text-main);
    padding: 40px 48px;
  }

  /* ── Header ── */
  .patients-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .patients-title-group {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .patients-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(200,16,46,0.2);
    flex-shrink: 0;
  }

  .patients-icon svg {
    width: 24px;
    height: 24px;
    fill: white;
  }

  .patients-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #1A202C;
    line-height: 1;
  }

  .patients-subtitle {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 500;
    margin-top: 4px;
  }

  .patient-count-badge {
    background: white;
    border: 1px solid var(--border-subtle);
    border-radius: 999px;
    padding: 6px 18px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--crimson);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  /* ── Add Patient Panel ── */
  .add-panel {
    background: var(--card-bg);
    border: 1px solid var(--border-subtle);
    border-top: 3px solid var(--crimson);
    border-radius: 12px;
    padding: 28px 32px;
    margin-bottom: 32px;
    box-shadow: var(--shadow);
  }

  .add-panel-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--crimson);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1.5fr 1fr auto;
    gap: 14px;
    align-items: end;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .field-input,
  .field-select {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text-main);
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
  }

  .field-input:focus,
  .field-select:focus {
    border-color: var(--crimson);
    background: white;
    box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.05);
  }

  .btn-add {
    background: var(--crimson);
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    color: white;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    height: 41px;
  }

  .btn-add:hover {
    background: var(--crimson-dark);
    box-shadow: 0 4px 12px rgba(200,16,46,0.2);
  }

  /* ── Table ── */
  .table-panel {
    background: var(--card-bg);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .table-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 28px;
    background: #FCFDFF;
    border-bottom: 1px solid var(--border-subtle);
  }

  .table-toolbar-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .search-input {
    background: #F1F5F9;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 9px 14px 9px 36px;
    color: var(--text-main);
    font-size: 0.85rem;
    outline: none;
    width: 240px;
    transition: all 0.2s;
  }

  .search-input:focus {
    border-color: var(--crimson);
    background: white;
  }

  .search-input-wrap svg {
    stroke: var(--text-muted);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead tr {
    background: #F8FAFC;
  }

  th {
    padding: 14px 28px;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border-subtle);
    text-transform: uppercase;
  }

  td {
    padding: 16px 28px;
    font-size: 0.9rem;
    color: var(--text-main);
    border-bottom: 1px solid var(--border-subtle);
  }

  tbody tr:hover {
    background: #F1F5F9;
  }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: #EDF2F7;
    border: 1px solid #E2E8F0;
    color: var(--crimson);
    font-weight: 700;
  }

  .gender-pill {
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .gender-male   { background: #EBF8FF; color: #2B6CB0; }
  .gender-female { background: #FFF5F5; color: #C53030; }
  .gender-other  { background: #F7FAFC; color: #4A5568; }

  .status-dot {
    background: #38A169;
    box-shadow: 0 0 4px #38A169;
  }

  .btn-view {
    border: 1px solid #E2E8F0;
    background: white;
    color: var(--text-main);
    font-weight: 600;
  }

  .btn-view:hover {
    background: var(--crimson);
    border-color: var(--crimson);
    color: white;
  }

  .btn-delete:hover {
    background: #C53030 !important;
    color: white !important;
    border-color: #C53030 !important;
  }

  @media (max-width: 900px) {
    .patients-root { padding: 20px; }
    .form-grid { grid-template-columns: 1fr; }
  }
`;

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', dob: '', phone: '', gender: '' });

  const fetchPatients = async () => {
    try {
      const res = await fetch('https://shewale4-0.onrender.com/api/patients');
      const data = await res.json();
      setPatients(data.data || []);
    } catch (e) { console.error("Fetch error", e); }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      try {
        const res = await fetch(`https://shewale4-0.onrender.com/api/patients/${id}`, { method: 'DELETE' });
        if (res.ok) fetchPatients();
      } catch (error) {
        alert('Server error while deleting');
      }
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.gender) delete payload.gender;
    try {
      const res = await fetch('https://shewale4-0.onrender.com/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setForm({ name: '', dob: '', phone: '', gender: '' });
        fetchPatients();
      }
    } catch (error) { alert('Server error'); }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'P';

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  );

  return (
    <>
      <style>{styles}</style>
      <div className="patients-root">
        <div className="patients-header">
          <div className="patients-title-group">
            <div className="patients-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
              </svg>
            </div>
            <div>
              <div className="patients-title">Patient Registry</div>
              <div className="patients-subtitle">Sai Heart Care · Cardiology Department</div>
            </div>
          </div>
          <div className="patient-count-badge">
            {patients.length} Registered
          </div>
        </div>

        <div className="add-panel">
          <div className="add-panel-title">Register New Patient</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input className="field-input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label className="field-label">Date of Birth</label>
                <input className="field-input" name="dob" type="date" value={form.dob} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label className="field-label">Phone</label>
                <input className="field-input" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label className="field-label">Gender</label>
                <select className="field-select" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="btn-add">Add Patient</button>
            </div>
          </form>
        </div>

        <div className="table-panel">
          <div className="table-toolbar">
            <div className="table-toolbar-title">Patient Records</div>
            <div className="search-input-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input className="search-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials(p.name)}</div>
                      <span style={{ fontWeight: '600' }}>{p.name}</span>
                    </div>
                  </td>
                  <td>{new Date(p.dob).toLocaleDateString()}</td>
                  <td><span className={`gender-pill gender-${p.gender?.toLowerCase()}`}>{p.gender}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.phone || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Link to={`/admin/patients/${p._id}`} className="btn-view" style={{ padding: '6px 16px', borderRadius: '6px', textDecoration: 'none' }}>View</Link>
                      <button onClick={() => handleDelete(p._id)} className="btn-delete" style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid #FC8181', background: '#FFF5F5', color: '#C53030', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Patients;
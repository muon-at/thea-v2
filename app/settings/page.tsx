'use client';

import { useState } from 'react';

export default function Settings() {
  const [tone, setTone] = useState('professional');
  const [signature, setSignature] = useState('');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .sidebar { width: 280px; background: #1e293b; border-right: 1px solid #334155; padding: 2rem 1rem; }
        .sidebar-header { font-family: 'Instrument Serif', serif; font-size: 1.25rem; margin-bottom: 2rem; color: #f1f5f9; }
        .sidebar-nav { list-style: none; }
        .sidebar-item { margin-bottom: 0.5rem; }
        .sidebar-link { display: block; padding: 0.75rem 1rem; border-radius: 6px; color: #cbd5e1; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
        .sidebar-link:hover { background: #334155; color: #f1f5f9; }
        .sidebar-link.active { background: #10b981; color: white; }
        .main { flex: 1; padding: 2rem; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #334155; }
        .header-title { font-family: 'Instrument Serif', serif; font-size: 2rem; color: #f1f5f9; }
        .settings-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; max-width: 600px; }
        .settings-group { margin-bottom: 2rem; }
        .settings-label { display: block; font-weight: 600; margin-bottom: 0.75rem; color: #f1f5f9; }
        .settings-description { display: block; font-size: 0.9rem; color: #94a3b8; margin-bottom: 0.75rem; }
        .form-input { width: 100%; padding: 0.75rem; border: 1px solid #334155; background: #0f172a; color: #f1f5f9; border-radius: 6px; font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .form-input:focus { outline: none; border-color: #10b981; }
        .form-select { width: 100%; padding: 0.75rem; border: 1px solid #334155; background: #0f172a; color: #f1f5f9; border-radius: 6px; font-family: 'DM Sans', sans-serif; }
        .form-select:focus { outline: none; border-color: #10b981; }
        .btn-save { padding: 0.75rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .btn-save:hover { background: #059669; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-header">Thea</div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <button className="sidebar-link">📊 Oversikt</button>
          </li>
          <li className="sidebar-item">
            <button className="sidebar-link">📧 E-poster</button>
          </li>
          <li className="sidebar-item">
            <button className="sidebar-link">📈 Analytics</button>
          </li>
          <li className="sidebar-item">
            <button className="sidebar-link">⚙️ Integrasjoner</button>
          </li>
          <li className="sidebar-item">
            <button className="sidebar-link active">🔧 Innstillinger</button>
          </li>
        </ul>
      </aside>

      <main className="main">
        <div className="header">
          <h1 className="header-title">Innstillinger</h1>
        </div>

        <div className="settings-card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Agent Konfigurering</h2>
          
          <div className="settings-group">
            <label className="settings-label">Tone</label>
            <span className="settings-description">Hvordan skal agenten snakke?</span>
            <select
              className="form-select"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="professional">Profesjonell</option>
              <option value="friendly">Vennlig</option>
              <option value="casual">Uformell</option>
              <option value="formal">Formell</option>
            </select>
          </div>

          <div className="settings-group">
            <label className="settings-label">E-postsignatur</label>
            <span className="settings-description">Din signatur for alle e-poster</span>
            <textarea
              className="form-input"
              placeholder="f.eks. Best regards,&#10;Your Name"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              style={{ minHeight: '100px', fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          <button className="btn-save" onClick={() => alert('Innstillinger lagret')}>
            Lagre innstillinger
          </button>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function Settings() {
  const [agentName, setAgentName] = useState('Thea');
  const [language, setLanguage] = useState('no');
  const [tone, setTone] = useState('professional');

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
        .main { flex: 1; padding: 2rem; overflow-y: auto; max-width: 900px; }
        .header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #334155; }
        .header-title { font-family: 'Instrument Serif', serif; font-size: 2rem; color: #f1f5f9; }
        .section { margin-bottom: 2rem; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; }
        .section-title { font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem; color: #f1f5f9; }
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: #cbd5e1; font-size: 0.9rem; }
        .form-input, .form-select { width: 100%; padding: 0.75rem 1rem; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #f1f5f9; font-family: 'DM Sans', sans-serif; }
        .form-input:focus, .form-select:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
        .form-checkbox { margin-right: 0.75rem; }
        .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .btn-primary { background: #10b981; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #059669; }
        .btn-secondary { background: transparent; color: #cbd5e1; padding: 0.75rem 1.5rem; border: 1px solid #334155; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { border-color: #10b981; color: #10b981; }
        .button-group { display: flex; gap: 1rem; }
        @media (max-width: 768px) {
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #334155; }
          .main { padding: 1rem; }
        }
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
          <li className="sidebar-item">
            <button className="sidebar-link">👤 Konto</button>
          </li>
        </ul>
      </aside>

      <main className="main">
        <div className="header">
          <h1 className="header-title">Innstillinger</h1>
        </div>

        <div className="section">
          <div className="section-title">Agent-konfigurasjon</div>
          <div className="form-group">
            <label className="form-label">Agentens navn</label>
            <input 
              type="text" 
              className="form-input" 
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Navn på agenten"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Språk</label>
              <select 
                className="form-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="no">Norsk</option>
                <option value="en">English</option>
                <option value="sv">Svenska</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tone</label>
              <select 
                className="form-select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Profesjonell</option>
                <option value="friendly">Vennlig</option>
                <option value="casual">Uformell</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Personlig instruksjon</label>
            <textarea 
              className="form-input" 
              placeholder="Fortell agenten spesiell instruksjoner..."
              style={{ minHeight: '120px', resize: 'vertical' } as any}
              defaultValue="Du er en kundeserviceagent som svarer på e-poster fra bedriftens kunder."
            />
          </div>
          <div className="button-group">
            <button className="btn-primary">Lagre endringer</button>
            <button className="btn-secondary">Nullstill</button>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Varslinger</div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-checkbox" defaultChecked />
              Varsle meg når e-poster eskaleres
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-checkbox" defaultChecked />
              Daglig sammendrag av aktivitet
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-checkbox" />
              Varsler ved agentfeil
            </label>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Sikkerhet</div>
          <div className="form-group">
            <label className="form-label">API-nøkkel</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="password" 
                className="form-input" 
                value="••••••••••••••••••••••••••"
                readOnly
                style={{ flex: 1 }}
              />
              <button className="btn-secondary">Kopier</button>
            </div>
          </div>
          <div className="form-group">
            <button className="btn-secondary">Generer ny nøkkel</button>
          </div>
        </div>
      </main>
    </div>
  );
}

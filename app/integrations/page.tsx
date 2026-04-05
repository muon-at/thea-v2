'use client';

import { useState } from 'react';

export default function Integrations() {
  const [connected, setConnected] = useState<Record<string, boolean>>({
    gmail: true,
    outlook: false,
    slack: true,
  });

  const integrations = [
    { id: 'gmail', name: 'Gmail', icon: '📧', desc: 'E-poststøtte med Gmail', connected: true },
    { id: 'outlook', name: 'Outlook', icon: '📧', desc: 'E-poststøtte med Microsoft Outlook', connected: false },
    { id: 'imap', name: 'IMAP/SMTP', icon: '📧', desc: 'Generisk e-postkonto', connected: false },
    { id: 'slack', name: 'Slack', icon: '💬', desc: 'Få varsler i Slack-kanaler', connected: true },
    { id: 'zapier', name: 'Zapier', icon: '⚡', desc: 'Koble til 5000+ apper', connected: false },
    { id: 'airtable', name: 'Airtable', icon: '📊', desc: 'Sync data til Airtable', connected: false },
  ];

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
        .filters { display: flex; gap: 1rem; margin-bottom: 2rem; overflow-x: auto; }
        .filter-btn { padding: 0.75rem 1.5rem; border: 1px solid #334155; background: transparent; color: #cbd5e1; border-radius: 6px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-btn.active { border-color: #10b981; color: #10b981; }
        .filter-btn:hover { border-color: #10b981; color: #10b981; }
        .integrations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        .integration-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; transition: all 0.2s; }
        .integration-card:hover { border-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1); }
        .integration-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .integration-name { font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem; color: #f1f5f9; }
        .integration-desc { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5; }
        .integration-status { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .badge-connected { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .badge-disconnected { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }
        .integration-button { width: 100%; padding: 0.75rem; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-connect { background: #10b981; color: white; }
        .btn-connect:hover { background: #059669; }
        .btn-disconnect { background: transparent; color: #ef4444; border: 1px solid #ef4444; }
        .btn-disconnect:hover { background: rgba(239, 68, 68, 0.1); }
        @media (max-width: 768px) {
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #334155; }
          .integrations-grid { grid-template-columns: 1fr; }
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
            <button className="sidebar-link active">⚙️ Integrasjoner</button>
          </li>
          <li className="sidebar-item">
            <button className="sidebar-link">🔧 Innstillinger</button>
          </li>
          <li className="sidebar-item">
            <button className="sidebar-link">👤 Konto</button>
          </li>
        </ul>
      </aside>

      <main className="main">
        <div className="header">
          <h1 className="header-title">Integrasjoner</h1>
        </div>

        <div className="filters">
          <button className="filter-btn active">Alle</button>
          <button className="filter-btn">📧 E-post</button>
          <button className="filter-btn">💬 Kommunikasjon</button>
          <button className="filter-btn">📊 Data</button>
          <button className="filter-btn">⚡ Automatisering</button>
        </div>

        <div className="integrations-grid">
          {integrations.map((int) => (
            <div key={int.id} className="integration-card">
              <div className="integration-icon">{int.icon}</div>
              <div className="integration-name">{int.name}</div>
              <div className="integration-desc">{int.desc}</div>
              <div className="integration-status">
                <span className={`status-badge ${int.connected ? 'badge-connected' : 'badge-disconnected'}`}>
                  {int.connected ? '✓ Koblet' : 'Ikke koblet'}
                </span>
              </div>
              <button 
                className={`integration-button ${int.connected ? 'btn-disconnect' : 'btn-connect'}`}
                onClick={() => setConnected({ ...connected, [int.id]: !connected[int.id] })}
              >
                {int.connected ? 'Koble fra' : 'Koble til'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

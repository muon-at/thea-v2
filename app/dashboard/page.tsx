'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

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
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; }
        .stat-label { color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .stat-value { font-family: 'Instrument Serif', serif; font-size: 2rem; color: #10b981; font-weight: 600; }
        .empty-state { background: #1e293b; border: 1px dashed #334155; border-radius: 8px; padding: 3rem; text-align: center; color: #94a3b8; }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-header">Thea</div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <button className={`sidebar-link ${selectedTab === 'overview' ? 'active' : ''}`} onClick={() => setSelectedTab('overview')}>
              📊 Oversikt
            </button>
          </li>
          <li className="sidebar-item">
            <button className={`sidebar-link ${selectedTab === 'emails' ? 'active' : ''}`} onClick={() => setSelectedTab('emails')}>
              📧 E-poster
            </button>
          </li>
          <li className="sidebar-item">
            <button className={`sidebar-link ${selectedTab === 'analytics' ? 'active' : ''}`} onClick={() => setSelectedTab('analytics')}>
              📈 Analytics
            </button>
          </li>
          <li className="sidebar-item">
            <button className={`sidebar-link ${selectedTab === 'integrations' ? 'active' : ''}`} onClick={() => setSelectedTab('integrations')}>
              ⚙️ Integrasjoner
            </button>
          </li>
          <li className="sidebar-item">
            <button className={`sidebar-link ${selectedTab === 'settings' ? 'active' : ''}`} onClick={() => setSelectedTab('settings')}>
              🔧 Innstillinger
            </button>
          </li>
        </ul>
      </aside>

      <main className="main">
        <div className="header">
          <h1 className="header-title">Dashboard</h1>
        </div>

        {selectedTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">E-poster i dag</div>
                <div className="stat-value">0</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Claude API utgifter</div>
                <div className="stat-value">$0.00</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Tokens brukt</div>
                <div className="stat-value">0</div>
              </div>
            </div>

            <div className="empty-state">
              <div className="empty-icon">📧</div>
              <h3>Ingen e-poster ennå</h3>
              <p>Koble til Gmail eller Outlook for å komme i gang</p>
            </div>
          </>
        )}

        {selectedTab === 'emails' && (
          <div className="empty-state">
            <div className="empty-icon">📧</div>
            <h3>Ingen e-poster</h3>
            <p>Koble til en e-postkonto for å se dine e-poster her</p>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="empty-state">
            <div className="empty-icon">📈</div>
            <h3>Ingen data ennå</h3>
            <p>Analytics vil vises når du starter å bruke systemet</p>
          </div>
        )}

        {selectedTab === 'integrations' && (
          <div className="empty-state">
            <div className="empty-icon">⚙️</div>
            <h3>Gå til Integrasjoner</h3>
            <p>Åpne Integrasjoner-siden for å koble til Gmail eller Outlook</p>
          </div>
        )}

        {selectedTab === 'settings' && (
          <div className="empty-state">
            <div className="empty-icon">🔧</div>
            <h3>Innstillinger</h3>
            <p>Gå til Innstillinger-siden for å konfigurere agenten din</p>
          </div>
        )}
      </main>
    </div>
  );
}

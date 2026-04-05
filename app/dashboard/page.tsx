'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .sidebar {
          width: 280px;
          background: #1e293b;
          border-right: 1px solid #334155;
          padding: 2rem 1rem;
        }
        
        .sidebar-header {
          font-family: 'Instrument Serif', serif;
          font-size: 1.25rem;
          margin-bottom: 2rem;
          color: #f1f5f9;
        }
        
        .sidebar-nav {
          list-style: none;
        }
        
        .sidebar-item {
          margin-bottom: 0.5rem;
        }
        
        .sidebar-link {
          display: block;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        
        .sidebar-link:hover {
          background: #334155;
          color: #f1f5f9;
        }
        
        .sidebar-link.active {
          background: #10b981;
          color: white;
        }
        
        .main {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #334155;
        }
        
        .header-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem;
          color: #f1f5f9;
        }
        
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        
        .btn-primary {
          background: #10b981;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .btn-primary:hover {
          background: #059669;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 1.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .stat-card:hover {
          border-color: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
        }
        
        .stat-label {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 0.5rem;
        }
        
        .stat-trend {
          color: #10b981;
          font-size: 0.875rem;
        }
        
        .panel {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .panel-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: #f1f5f9;
        }
        
        .activity-item {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #334155;
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-title {
          color: #f1f5f9;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        
        .activity-desc {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .activity-time {
          color: #64748b;
          font-size: 0.875rem;
        }
        
        .email-list {
          list-style: none;
        }
        
        .email-item {
          padding: 1rem;
          border-bottom: 1px solid #334155;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .email-item:hover {
          background: rgba(16, 185, 129, 0.05);
        }
        
        .email-from {
          color: #f1f5f9;
          font-weight: 500;
        }
        
        .email-subject {
          color: #cbd5e1;
          font-size: 0.95rem;
          margin: 0.25rem 0;
        }
        
        .email-preview {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .badge-resolved {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        
        .badge-pending {
          background: rgba(251, 146, 60, 0.2);
          color: #fb923c;
        }
        
        .badge-escalated {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            padding: 1rem;
            border-right: none;
            border-bottom: 1px solid #334155;
          }
          
          .sidebar-nav {
            display: flex;
            gap: 0.5rem;
            overflow-x: auto;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">Thea</div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <button
              className={`sidebar-link ${selectedTab === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedTab('overview')}
            >
              📊 Oversikt
            </button>
          </li>
          <li className="sidebar-item">
            <button
              className={`sidebar-link ${selectedTab === 'emails' ? 'active' : ''}`}
              onClick={() => setSelectedTab('emails')}
            >
              📧 E-poster
            </button>
          </li>
          <li className="sidebar-item">
            <button
              className={`sidebar-link ${selectedTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setSelectedTab('analytics')}
            >
              📈 Analytics
            </button>
          </li>
          <li className="sidebar-item">
            <button
              className={`sidebar-link ${selectedTab === 'integrations' ? 'active' : ''}`}
              onClick={() => setSelectedTab('integrations')}
            >
              ⚙️ Integrasjoner
            </button>
          </li>
          <li className="sidebar-item">
            <button
              className={`sidebar-link ${selectedTab === 'settings' ? 'active' : ''}`}
              onClick={() => setSelectedTab('settings')}
            >
              🔧 Innstillinger
            </button>
          </li>
          <li className="sidebar-item">
            <button
              className={`sidebar-link ${selectedTab === 'account' ? 'active' : ''}`}
              onClick={() => setSelectedTab('account')}
            >
              👤 Konto
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main">
        {selectedTab === 'overview' && (
          <>
            <div className="header">
              <h1 className="header-title">Oversikt</h1>
              <div className="header-actions">
                <button className="btn-primary">Innstillinger</button>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">E-poster løst i dag</div>
                <div className="stat-value">24</div>
                <div className="stat-trend">↑ 12% fra i går</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Gjennomsnittlig responstid</div>
                <div className="stat-value">1,2m</div>
                <div className="stat-trend">↑ 8% faster</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Kundtilfredshet</div>
                <div className="stat-value">4.8/5</div>
                <div className="stat-trend">↑ 0.2 poeng</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Automation rate</div>
                <div className="stat-value">94%</div>
                <div className="stat-trend">↑ Stabil</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              <div className="panel">
                <div className="panel-title">Nylig aktivitet</div>
                <div className="activity-item">
                  <div className="activity-avatar">KL</div>
                  <div className="activity-content">
                    <div className="activity-title">Kari Larsen</div>
                    <div className="activity-desc">Spørsmål om garantien</div>
                    <div className="activity-time">2 min siden</div>
                  </div>
                  <span className="badge badge-resolved">Løst</span>
                </div>
                <div className="activity-item">
                  <div className="activity-avatar" style={{ background: '#fb923c' }}>OB</div>
                  <div className="activity-content">
                    <div className="activity-title">Ole Berg</div>
                    <div className="activity-desc">Fraktkostnad Sverige</div>
                    <div className="activity-time">15 min siden</div>
                  </div>
                  <span className="badge badge-resolved">Løst</span>
                </div>
                <div className="activity-item">
                  <div className="activity-avatar" style={{ background: '#ef4444' }}>MH</div>
                  <div className="activity-content">
                    <div className="activity-title">Maria Holm</div>
                    <div className="activity-desc">Teknisk feil med app</div>
                    <div className="activity-time">42 min siden</div>
                  </div>
                  <span className="badge badge-escalated">Eskalert</span>
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">Kommende oppgaver</div>
                <div className="activity-item">
                  <div className="activity-avatar" style={{ background: '#64748b' }}>1</div>
                  <div className="activity-content">
                    <div className="activity-title">Besvar tilbakemeldinger</div>
                    <div className="activity-desc">Integrer feedback fra sist uke</div>
                    <div className="activity-time">I dag</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-avatar" style={{ background: '#64748b' }}>2</div>
                  <div className="activity-content">
                    <div className="activity-title">Oppdater produktbeskrivelser</div>
                    <div className="activity-desc">Legg til nye varianter</div>
                    <div className="activity-time">I morgen</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-avatar" style={{ background: '#64748b' }}>3</div>
                  <div className="activity-content">
                    <div className="activity-title">Gjennomgang av policy</div>
                    <div className="activity-desc">Samordne med team</div>
                    <div className="activity-time">I uke</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'emails' && (
          <>
            <div className="header">
              <h1 className="header-title">E-poster</h1>
            </div>
            <div className="panel">
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Søk i e-poster..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#334155',
                    border: '1px solid #475569',
                    color: '#f1f5f9',
                    borderRadius: '6px',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                />
              </div>
              <ul className="email-list">
                <li className="email-item">
                  <div>
                    <div className="email-from">Kari Larsen</div>
                    <div className="email-subject">Spørsmål om returpolicy</div>
                    <div className="email-preview">Kan jeg returnere produktet innen 30 dager?</div>
                  </div>
                  <span className="badge badge-resolved">Løst</span>
                </li>
                <li className="email-item">
                  <div>
                    <div className="email-from">Ole Berg</div>
                    <div className="email-subject">Fraktkostnad til Sverige</div>
                    <div className="email-preview">Hvor mye koster leveringen til Sverige?</div>
                  </div>
                  <span className="badge badge-resolved">Løst</span>
                </li>
                <li className="email-item">
                  <div>
                    <div className="email-from">Maria Holm</div>
                    <div className="email-subject">Teknisk feil med app</div>
                    <div className="email-preview">Jeg får feilmelding når jeg prøver å logge inn</div>
                  </div>
                  <span className="badge badge-escalated">Eskalert</span>
                </li>
              </ul>
            </div>
          </>
        )}

        {selectedTab === 'analytics' && (
          <>
            <div className="header">
              <h1 className="header-title">Analytics</h1>
            </div>
            <div className="panel">
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                📊 Analytics dashboard kommer snart
              </div>
            </div>
          </>
        )}

        {selectedTab === 'integrations' && (
          <>
            <div className="header">
              <h1 className="header-title">Integrasjoner</h1>
            </div>
            <div className="panel">
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                ⚙️ Integrasjoner kommer snart
              </div>
            </div>
          </>
        )}

        {selectedTab === 'settings' && (
          <>
            <div className="header">
              <h1 className="header-title">Innstillinger</h1>
            </div>
            <div className="panel">
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                🔧 Innstillinger kommer snart
              </div>
            </div>
          </>
        )}

        {selectedTab === 'account' && (
          <>
            <div className="header">
              <h1 className="header-title">Konto</h1>
            </div>
            <div className="panel">
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                👤 Kontoinformasjon kommer snart
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

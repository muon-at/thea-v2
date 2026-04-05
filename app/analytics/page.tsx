'use client';

import { useState } from 'react';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d');

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
        .date-selector { display: flex; gap: 0.5rem; }
        .date-btn { padding: 0.5rem 1rem; border: 1px solid #334155; background: transparent; color: #cbd5e1; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .date-btn.active { background: #10b981; color: white; border-color: #10b981; }
        .date-btn:hover { border-color: #10b981; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: #1e293b; border: 1px solid #334155; padding: 1.5rem; border-radius: 8px; }
        .stat-label { color: #94a3b8; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .stat-value { font-size: 2.5rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.5rem; }
        .stat-trend { color: #10b981; font-size: 0.875rem; }
        .chart-panel { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; }
        .chart-title { font-weight: 600; margin-bottom: 1.5rem; color: #f1f5f9; }
        .chart-placeholder { height: 300px; background: #0f172a; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #64748b; }
        .table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .table th { text-align: left; padding: 1rem; border-bottom: 1px solid #334155; color: #cbd5e1; font-weight: 500; }
        .table td { padding: 1rem; border-bottom: 1px solid #334155; color: #cbd5e1; }
        .table tr:hover { background: rgba(16, 185, 129, 0.05); }
        .bar { height: 40px; background: #10b981; border-radius: 4px; margin: 0.5rem 0; position: relative; display: flex; align-items: center; }
        .bar-label { position: absolute; left: 1rem; color: white; font-weight: 500; font-size: 0.85rem; }
        @media (max-width: 768px) {
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #334155; }
          .header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .stats-grid { grid-template-columns: 1fr; }
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
            <button className="sidebar-link active">📈 Analytics</button>
          </li>
          <li className="sidebar-item">
            <button className="sidebar-link">⚙️ Integrasjoner</button>
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
          <h1 className="header-title">Analytics</h1>
          <div className="date-selector">
            <button 
              className={`date-btn ${dateRange === '7d' ? 'active' : ''}`}
              onClick={() => setDateRange('7d')}
            >
              7d
            </button>
            <button 
              className={`date-btn ${dateRange === '30d' ? 'active' : ''}`}
              onClick={() => setDateRange('30d')}
            >
              30d
            </button>
            <button 
              className={`date-btn ${dateRange === '90d' ? 'active' : ''}`}
              onClick={() => setDateRange('90d')}
            >
              90d
            </button>
            <button 
              className={`date-btn ${dateRange === '1y' ? 'active' : ''}`}
              onClick={() => setDateRange('1y')}
            >
              1y
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Gjennomsnittlig responstid</div>
            <div className="stat-value">1,2m</div>
            <div className="stat-trend">↓ 15% bedre</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Tilfredshet</div>
            <div className="stat-value">4,8/5</div>
            <div className="stat-trend">↑ +0,3 poeng</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">E-poster håndtert</div>
            <div className="stat-value">2.847</div>
            <div className="stat-trend">↑ 24% mer</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Automatisk løst</div>
            <div className="stat-value">94%</div>
            <div className="stat-trend">↑ Stabil høy</div>
          </div>
        </div>

        <div className="chart-panel">
          <div className="chart-title">Responstid (siste 30 dager)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
            {[85, 72, 68, 92, 75, 60, 88, 70].map((val, i) => (
              <div key={i}>
                <div className="bar" style={{ width: (val / 100) * 100 + '%' }}>
                  <span className="bar-label">{val}%</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Dag {i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-panel">
          <div className="chart-title">Top 5 Kategorier</div>
          <table className="table">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Antall</th>
                <th>% av total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Returspørsmål</td>
                <td>892</td>
                <td>31%</td>
              </tr>
              <tr>
                <td>Frakt og levering</td>
                <td>743</td>
                <td>26%</td>
              </tr>
              <tr>
                <td>Produktinfo</td>
                <td>654</td>
                <td>23%</td>
              </tr>
              <tr>
                <td>Fakturering</td>
                <td>378</td>
                <td>13%</td>
              </tr>
              <tr>
                <td>Annet</td>
                <td>180</td>
                <td>7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

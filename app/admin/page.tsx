'use client';

import { useState, useEffect } from 'react';
import { getCompanies, getTotalStats, createCompany } from '@/lib/admin/actions';

export default function AdminDashboard() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', email: '', tier: 'free' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const companiesData = await getCompanies();
      setCompanies(companiesData || []);

      const totalStats = await getTotalStats();
      setStats(totalStats);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompany(newCompany.name, newCompany.email, newCompany.tier as any);
      setNewCompany({ name: '', email: '', tier: 'free' });
      setShowAddForm(false);
      loadData();
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: '#f1f5f9' }}>Laster...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif", padding: '2rem' }}>
      <style>{`
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #334155; }
        .admin-title { font-family: 'Instrument Serif', serif; font-size: 2rem; color: #f1f5f9; }
        .btn-primary { padding: 0.75rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .btn-primary:hover { background: #059669; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; }
        .stat-label { color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .stat-value { font-family: 'Instrument Serif', serif; font-size: 2rem; color: #10b981; font-weight: 600; }
        .stat-subtext { color: #64748b; font-size: 0.85rem; margin-top: 0.5rem; }
        .form-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; }
        .form-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 2rem; max-width: 500px; width: 90%; }
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #f1f5f9; }
        .form-input { width: 100%; padding: 0.75rem; border: 1px solid #334155; background: #0f172a; color: #f1f5f9; border-radius: 6px; font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .form-input:focus { outline: none; border-color: #10b981; }
        .companies-table { width: 100%; border-collapse: collapse; margin-top: 2rem; }
        .companies-table th { background: #1e293b; padding: 1rem; text-align: left; border-bottom: 1px solid #334155; font-weight: 600; }
        .companies-table td { padding: 1rem; border-bottom: 1px solid #334155; }
        .companies-table tr:hover { background: #1e293b; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .badge-free { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }
        .badge-pro { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .badge-enterprise { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
        .cost-high { color: #ef4444; }
        .cost-normal { color: #10b981; }
        .btn-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #cbd5e1; cursor: pointer; font-size: 1.5rem; }
      `}</style>

      <div className="admin-header">
        <h1 className="admin-title">🔧 Admin Dashboard</h1>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          + Legg til bedrift
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Bedrifter</div>
          <div className="stat-value">{stats?.totalCompanies || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Utgifter I Dag (Claude)</div>
          <div className="stat-value">${stats?.today?.total?.toFixed(2) || '0.00'}</div>
          <div className="stat-subtext">Real-time tracking</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Månedsutgifter</div>
          <div className="stat-value">${stats?.month?.total?.toFixed(2) || '0.00'}</div>
          <div className="stat-subtext">Gjennomsnitt: ${stats?.month?.average?.toFixed(2) || '0.00'}/bedrift</div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Bedrifter & Agents</h2>
      
      <table className="companies-table">
        <thead>
          <tr>
            <th>Bedrift</th>
            <th>Agent ID</th>
            <th>Tier</th>
            <th>Månedsbudsjett</th>
            <th>Brukt i dag</th>
            <th>Måned Brukt</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>
                <div style={{ fontWeight: 600 }}>{company.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{company.email}</div>
              </td>
              <td style={{ fontSize: '0.9rem', color: '#64748b', fontFamily: 'monospace' }}>
                {company.agents?.[0]?.agent_id || 'N/A'}
              </td>
              <td>
                <span className={`status-badge badge-${company.subscription_tier}`}>
                  {company.subscription_tier?.toUpperCase()}
                </span>
              </td>
              <td>${company.monthly_budget?.toFixed(2) || '0.00'}</td>
              <td>${company.daily_cost_summary?.[0]?.total_cost?.toFixed(4) || '0.00'}</td>
              <td className={company.current_month_spend > company.monthly_budget * 0.8 ? 'cost-high' : 'cost-normal'}>
                ${company.current_month_spend?.toFixed(2) || '0.00'}
              </td>
              <td>
                {company.current_month_spend > company.monthly_budget ? (
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>⚠️ Over Budget</span>
                ) : (
                  <span style={{ color: '#10b981' }}>✓ OK</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddForm && (
        <div className="form-overlay">
          <div className="form-card">
            <button className="btn-close" onClick={() => setShowAddForm(false)}>×</button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Legg til ny bedrift</h2>
            
            <form onSubmit={handleAddCompany}>
              <div className="form-group">
                <label className="form-label">Bedriftsnavn</label>
                <input
                  className="form-input"
                  type="text"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="f.eks. Acme Corp"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-postadresse</label>
                <input
                  className="form-input"
                  type="email"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                  placeholder="admin@acme.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Abonnementsnivå</label>
                <select
                  className="form-input"
                  value={newCompany.tier}
                  onChange={(e) => setNewCompany({ ...newCompany, tier: e.target.value })}
                >
                  <option value="free">Free - $100/måned</option>
                  <option value="pro">Pro - $500/måned</option>
                  <option value="enterprise">Enterprise - $1000/måned</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Opprett bedrift & agent
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

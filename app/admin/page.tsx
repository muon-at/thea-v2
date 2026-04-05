'use client'

import { useState, useEffect } from 'react'

// Mock data
const mockCompanies = [
  {
    id: '1',
    name: 'Acme Corp',
    logo: 'AC',
    color: '#b8ff57',
    plan: 'Premium',
    status: 'active',
    apiCostMonth: 156.78,
    emailsToday: 45,
    agents: 1,
    responseTime: 2.3,
    satisfaction: 95,
  },
  {
    id: '2',
    name: 'Tech Startup',
    logo: 'TS',
    color: '#4d9eff',
    plan: 'Free',
    status: 'active',
    apiCostMonth: 87.45,
    emailsToday: 23,
    agents: 1,
    responseTime: 1.8,
    satisfaction: 88,
  },
]

const totalCostMonth = mockCompanies.reduce((a, c) => a + c.apiCostMonth, 0)
const totalEmailsToday = mockCompanies.reduce((a, c) => a + c.emailsToday, 0)
const avgSatisfaction = Math.round(mockCompanies.reduce((a, c) => a + c.satisfaction, 0) / mockCompanies.length)

export default function AdminOverview() {
  const [companies, setCompanies] = useState(mockCompanies)

  return (
    <div className="p-6 space-y-6">
      {/* TOP STATS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total API-kost / mnd', value: `${totalCostMonth.toFixed(2)} kr`, sub: '+12% fra forrige mnd', color: '#b8ff57', icon: '◎' },
          { label: 'Eposter behandlet i dag', value: totalEmailsToday, sub: `${totalEmailsToday} løst av AI (100%)`, color: '#4d9eff', icon: '✉' },
          { label: 'Aktive bedrifter', value: companies.filter(c => c.status === 'active').length, sub: `${companies.length} total`, color: '#f472b6', icon: '⬡' },
          { label: 'Kundestilfredshet', value: `${avgSatisfaction}%`, sub: 'Snitt alle bedrifter', color: '#a78bfa', icon: '◉' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0f0f1a] border border-white/[0.06] rounded-xl p-5 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/30 font-medium tracking-wide uppercase">{stat.label}</span>
              <span className="text-base" style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-1" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[11px] text-white/30 font-mono">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* COMPANIES TABLE */}
      <div className="bg-[#0f0f1a] border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Bedrifter – denne måneden</h3>
          <span className="text-[10px] text-white/30 font-mono border border-white/10 px-2 py-1 rounded-md">Sorter: API-kost ↓</span>
        </div>
        <div className="space-y-2">
          {[...companies].sort((a, b) => b.apiCostMonth - a.apiCostMonth).map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors group cursor-pointer">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-black flex-shrink-0" style={{ background: c.color }}>{c.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate">{c.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${c.status === 'active' ? 'bg-[#b8ff57]/10 text-[#b8ff57]' : 'bg-[#a78bfa]/10 text-[#a78bfa]'}`}>
                    {c.plan.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-white/30 font-mono">{c.emailsToday} eposter i dag</span>
                  <span className="text-[10px] text-white/30 font-mono">{c.agents} agent</span>
                  <span className="text-[10px] text-white/30 font-mono">{c.responseTime}s snitt</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold" style={{ color: c.color }}>{c.apiCostMonth.toFixed(2)} kr</div>
                <div className="text-[10px] text-white/30 font-mono">denne mnd</div>
              </div>
              {/* Cost bar */}
              <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(c.apiCostMonth / 200) * 100}%`, background: c.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

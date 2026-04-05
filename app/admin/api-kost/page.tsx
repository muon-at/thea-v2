'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data - will be replaced with real Supabase data
const mockCompanies = [
  {
    id: '1',
    name: 'Acme Corp',
    tier: 'Premium',
    monthlyBudget: 500,
    spentToday: 12.45,
    spentMonth: 156.78,
    costPerEmail: 0.042,
    agentsActive: 1,
    emailsToday: 45,
    responseTime: 2.3,
    status: 'active'
  },
  {
    id: '2',
    name: 'Tech Startup',
    tier: 'Free',
    monthlyBudget: 100,
    spentToday: 5.23,
    spentMonth: 87.45,
    costPerEmail: 0.048,
    agentsActive: 1,
    emailsToday: 23,
    responseTime: 1.8,
    status: 'active'
  },
]

export default function ApiKostPage() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  const totalMonthSpent = mockCompanies.reduce((sum, c) => sum + c.spentMonth, 0)
  const selectedData = selectedCompany ? mockCompanies.find(c => c.id === selectedCompany) : null

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#e8e5dc] bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-[#0a0a0f] mb-1">API Kostnader</h1>
          <p className="text-sm text-[#6b6760]">Claude API · April 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#f5f2ec] rounded-xl p-6 border border-[#e8e5dc]">
            <p className="text-xs font-medium text-[#6b6760] uppercase tracking-wide mb-2">Total denne måned</p>
            <p className="text-3xl font-bold text-[#0a0a0f]">{totalMonthSpent.toFixed(2)} kr</p>
          </div>
          <div className="bg-[#f5f2ec] rounded-xl p-6 border border-[#e8e5dc]">
            <p className="text-xs font-medium text-[#6b6760] uppercase tracking-wide mb-2">Bedrifter</p>
            <p className="text-3xl font-bold text-[#0a0a0f]">{mockCompanies.length}</p>
          </div>
          <div className="bg-[#f5f2ec] rounded-xl p-6 border border-[#e8e5dc]">
            <p className="text-xs font-medium text-[#6b6760] uppercase tracking-wide mb-2">Snitt per bedrift</p>
            <p className="text-3xl font-bold text-[#0a0a0f]">{(totalMonthSpent / mockCompanies.length).toFixed(2)} kr</p>
          </div>
          <div className="bg-[#f5f2ec] rounded-xl p-6 border border-[#e8e5dc]">
            <p className="text-xs font-medium text-[#6b6760] uppercase tracking-wide mb-2">Aktive agenter</p>
            <p className="text-3xl font-bold text-[#0a0a0f]">{mockCompanies.reduce((sum, c) => sum + c.agentsActive, 0)}</p>
          </div>
        </div>

        {/* Grid Layout: Companies List + Detail View */}
        <div className="grid grid-cols-3 gap-6">
          {/* Companies List */}
          <div className="col-span-1 bg-white rounded-xl border border-[#e8e5dc]">
            <div className="px-6 py-4 border-b border-[#e8e5dc]">
              <h2 className="text-lg font-bold text-[#0a0a0f]">Bedrifter</h2>
            </div>
            <div className="divide-y divide-[#e8e5dc]">
              {mockCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id)}
                  className={`w-full text-left px-6 py-4 transition-colors ${
                    selectedCompany === company.id
                      ? 'bg-[#7a9e87]/10 border-l-4 border-[#7a9e87]'
                      : 'hover:bg-[#f5f2ec]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#0a0a0f]">{company.name}</h3>
                    <span className="text-xs font-medium bg-[#7a9e87]/10 text-[#7a9e87] px-2 py-1 rounded">{company.tier}</span>
                  </div>
                  <p className="text-sm font-bold text-[#7a9e87]">{company.spentMonth.toFixed(2)} kr</p>
                  <p className="text-xs text-[#6b6760]">denne måned</p>
                </button>
              ))}
            </div>
          </div>

          {/* Detail View */}
          {selectedData && (
            <div className="col-span-2 space-y-6">
              {/* Company Header */}
              <div className="bg-white rounded-xl border border-[#e8e5dc] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0a0a0f]">{selectedData.name}</h2>
                    <p className="text-sm text-[#6b6760] mt-1">{selectedData.tier} Plan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6b6760] uppercase tracking-wide mb-1">Status</p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-[#0a0a0f]">Active</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#f5f2ec] rounded-lg p-4">
                    <p className="text-xs font-medium text-[#6b6760] mb-2">Brukt denne måned</p>
                    <p className="text-2xl font-bold text-[#0a0a0f]">{selectedData.spentMonth.toFixed(2)} kr</p>
                    <p className="text-xs text-[#6b6760] mt-2">av {selectedData.monthlyBudget} kr budget</p>
                  </div>
                  <div className="bg-[#f5f2ec] rounded-lg p-4">
                    <p className="text-xs font-medium text-[#6b6760] mb-2">Brukt i dag</p>
                    <p className="text-2xl font-bold text-[#0a0a0f]">{selectedData.spentToday.toFixed(2)} kr</p>
                    <p className="text-xs text-[#6b6760] mt-2">{selectedData.emailsToday} e-poster</p>
                  </div>
                  <div className="bg-[#f5f2ec] rounded-lg p-4">
                    <p className="text-xs font-medium text-[#6b6760] mb-2">Pris per e-post</p>
                    <p className="text-2xl font-bold text-[#0a0a0f]">{selectedData.costPerEmail.toFixed(3)} kr</p>
                    <p className="text-xs text-[#6b6760] mt-2">snitt</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#6b6760]">Budsjett brukt</span>
                    <span className="text-xs font-bold text-[#7a9e87]">{Math.round((selectedData.spentMonth / selectedData.monthlyBudget) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#e8e5dc] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7a9e87] rounded-full transition-all"
                      style={{ width: `${Math.min((selectedData.spentMonth / selectedData.monthlyBudget) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Details Table */}
              <div className="bg-white rounded-xl border border-[#e8e5dc] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#e8e5dc]">
                  <h3 className="font-semibold text-[#0a0a0f]">Detaljer</h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b6760]">Agenter aktive</span>
                    <span className="font-semibold text-[#0a0a0f]">{selectedData.agentsActive}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b6760]">E-poster i dag</span>
                    <span className="font-semibold text-[#0a0a0f]">{selectedData.emailsToday}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b6760]">Responsetime</span>
                    <span className="font-semibold text-[#0a0a0f]">{selectedData.responseTime}s</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

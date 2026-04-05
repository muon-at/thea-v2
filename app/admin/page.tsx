'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from './components/AdminSidebar'

export default function AdminDashboard() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/admin/companies', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch companies')
        }
        
        const data = await response.json()
        setCompanies(data.companies || [])
      } catch (error) {
        console.error('Error fetching companies:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCompanies()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="border-b border-[#e8e5dc] bg-white sticky top-0 z-10">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-[#0a0a0f] mb-1">Oversikt</h1>
            <p className="text-sm text-[#6b6760]">Bedriftadministrasjon og system oversikt</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#f5f2ec] rounded-xl p-6 border border-[#e8e5dc]">
              <p className="text-xs font-medium text-[#6b6760] uppercase tracking-wide mb-2">Total bedrifter</p>
              <p className="text-3xl font-bold text-[#0a0a0f]">{companies.length}</p>
            </div>
            <div className="bg-[#f5f2ec] rounded-xl p-6 border border-[#e8e5dc]">
              <p className="text-xs font-medium text-[#6b6760] uppercase tracking-wide mb-2">Aktive agenter</p>
              <p className="text-3xl font-bold text-[#0a0a0f]">{companies.length}</p>
            </div>
            <div className="bg-[#f5f2ec] rounded-xl p-6 border border-[#e8e5dc]">
              <p className="text-xs font-medium text-[#6b6760] uppercase tracking-wide mb-2">Total budsjett</p>
              <p className="text-3xl font-bold text-[#0a0a0f]">${companies.reduce((sum: number, c: any) => sum + (c.monthly_budget || 0), 0)}</p>
            </div>
            <div className="bg-[#f5f2ec] rounded-xl p-6 border border-[#e8e5dc]">
              <p className="text-xs font-medium text-[#6b6760] uppercase tracking-wide mb-2">Premium tier</p>
              <p className="text-3xl font-bold text-[#0a0a0f]">{companies.filter((c: any) => c.subscription_tier === 'premium').length}</p>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="bg-white rounded-xl border border-[#e8e5dc] overflow-hidden">
            <div className="px-8 py-6 border-b border-[#e8e5dc]">
              <h2 className="text-xl font-bold text-[#0a0a0f]">Bedrifter</h2>
            </div>
            <div className="divide-y divide-[#e8e5dc]">
              {companies.length > 0 ? (
                companies.map((company: any) => (
                  <div key={company.id} className="px-8 py-4 hover:bg-[#f5f2ec] transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[#0a0a0f]">{company.name}</h3>
                        <p className="text-sm text-[#6b6760] mt-1">{company.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium bg-[#7a9e87]/10 text-[#7a9e87] px-3 py-1 rounded-lg">{company.subscription_tier}</span>
                        <p className="text-sm font-semibold text-[#0a0a0f] mt-2">${company.monthly_budget}/month</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-12 text-center">
                  <p className="text-[#6b6760]">Ingen bedrifter ennå</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

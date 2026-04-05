'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Oversikt', icon: '◈' },
  { href: '/admin/bedrifter', label: 'Bedrifter', icon: '⬡', badge: 5 },
  { href: '/admin/agenter', label: 'Agenter', icon: '⬢', badge: 10 },
  { href: '/admin/api-kost', label: 'API Kostnader', icon: '◎' },
  { href: '/admin/aktivitet', label: 'Aktivitet', icon: '◉' },
  { href: '/admin/innstillinger', label: 'Innstillinger', icon: '◌' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] flex-shrink-0 h-screen border-r border-white/[0.06] bg-[#0a0a14] flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#b8ff57] flex items-center justify-center text-black font-bold text-sm">T</div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">THEA</div>
            <div className="text-[10px] text-white/30 font-mono">Admin Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-[#b8ff57]/10 text-[#b8ff57] border border-[#b8ff57]/20'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="font-medium tracking-tight flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#b8ff57]/20 text-[#b8ff57]' : 'bg-white/[0.06] text-white/30'
                }`}>{item.badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-3">
        {/* API Status */}
        <div className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b8ff57] animate-pulse" />
            <span className="text-[10px] font-mono text-[#b8ff57]">Claude API</span>
          </div>
          <div className="text-[11px] text-white/40">244.23 kr brukt denne mnd</div>
        </div>
        {/* User */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b8ff57] to-[#4d9eff] flex items-center justify-center text-[10px] font-bold text-black">S</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Sebastian</div>
            <div className="text-[10px] text-white/30 truncate">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

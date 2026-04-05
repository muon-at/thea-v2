'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Oversikt', icon: '◈' },
  { href: '/admin/bedrifter', label: 'Bedrifter', icon: '⬡' },
  { href: '/admin/agenter', label: 'Agenter', icon: '⬢' },
  { href: '/admin/api-kost', label: 'API Kost', icon: '◎' },
  { href: '/admin/aktivitet', label: 'Aktivitet', icon: '◉' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 h-screen border-r border-[#e8e5dc] bg-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-[#e8e5dc]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#7a9e87] flex items-center justify-center text-white font-bold text-lg">T</div>
          <div>
            <div className="text-base font-bold tracking-tight text-[#0a0a0f]">THEA</div>
            <div className="text-xs text-[#6b6760] font-medium">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#7a9e87]/10 text-[#7a9e87] border border-[#7a9e87]/20'
                  : 'text-[#6b6760] hover:text-[#0a0a0f] hover:bg-[#f5f2ec] border border-transparent'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Info */}
      <div className="px-4 py-6 border-t border-[#e8e5dc] space-y-4">
        <div className="px-4 py-3 rounded-lg bg-[#f5f2ec] border border-[#e8e5dc]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#7a9e87]" />
            <span className="text-xs font-medium text-[#7a9e87]">Claude API</span>
          </div>
          <div className="text-xs text-[#6b6760]">Real-time active</div>
        </div>
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7a9e87] to-[#5a9db5] flex items-center justify-center text-xs font-bold text-white">S</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#0a0a0f]">Sebastian</div>
            <div className="text-xs text-[#6b6760]">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

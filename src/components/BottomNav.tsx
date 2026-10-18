import React from 'react'
import { Link } from '../lib/router'
import { useRouter } from '../lib/routerContext'

import { useSavedPlaces } from '../lib/storage'
import { Compass, Landmark, Building2, Calendar, Bookmark } from 'lucide-react'

export const BottomNav: React.FC = () => {
  const { path } = useRouter()
  const { count } = useSavedPlaces()

  const navItems = [
    { label: 'Explore', href: '/', icon: Compass, active: path === '/' },
    { label: 'Delhi', href: '/delhi', icon: Landmark, active: path === '/delhi', color: '#8C2D19' },
    { label: 'Jaipur', href: '/jaipur', icon: Building2, active: path === '/jaipur', color: '#C85A32' },
    { label: 'Planner', href: '/planner', icon: Calendar, active: path === '/planner' },
    { label: 'Saved', href: '/saved', icon: Bookmark, active: path === '/saved', badge: count },
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DFD3] pb-safe"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
                item.active ? 'text-[#8C2D19] font-semibold' : 'text-[#645C55] hover:text-[#201C1A]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 bg-[#8C2D19] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

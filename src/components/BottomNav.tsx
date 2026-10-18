import React, { useState } from 'react'
import { Link } from '../lib/router'
import { useRouter } from '../lib/routerContext'
import { useSavedPlaces } from '../lib/storage'
import { useAppData } from '../lib/dataStore'
import { Compass, MapPin, Calendar, Bookmark, X, Shield } from 'lucide-react'

export const BottomNav: React.FC = () => {
  const { path } = useRouter()
  const { count } = useSavedPlaces()
  const { cities } = useAppData()
  const [citiesModalOpen, setCitiesModalOpen] = useState(false)

  const cityList = Object.values(cities)
  const isCityActive = cityList.some((c) => path === `/${c.id}`)
  const isAdmin = path === '/admin'

  const cityColors: Record<string, string> = {
    jaipur: '#C85A32',
    udaipur: '#1B4965',
    manali: '#1E4620',
    varanasi: '#9B2226',
    mussoorie: '#2E4057',
    delhi: '#8C2D19',
  }

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DFD3] pb-safe"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
              path === '/' ? 'text-[#8C2D19] font-semibold' : 'text-[#645C55] hover:text-[#201C1A]'
            }`}
          >
            <Compass className={`w-5 h-5 ${path === '/' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-1 tracking-tight">Explore</span>
          </Link>

          <button
            onClick={() => setCitiesModalOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
              isCityActive ? 'text-[#8C2D19] font-semibold' : 'text-[#645C55] hover:text-[#201C1A]'
            }`}
          >
            <MapPin className={`w-5 h-5 ${isCityActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-1 tracking-tight">Cities</span>
          </button>

          <Link
            to="/planner"
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
              path === '/planner' ? 'text-[#8C2D19] font-semibold' : 'text-[#645C55] hover:text-[#201C1A]'
            }`}
          >
            <Calendar className={`w-5 h-5 ${path === '/planner' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-1 tracking-tight">Plan</span>
          </Link>

          <Link
            to="/saved"
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
              path === '/saved' ? 'text-[#8C2D19] font-semibold' : 'text-[#645C55] hover:text-[#201C1A]'
            }`}
          >
            <div className="relative">
              <Bookmark className={`w-5 h-5 ${path === '/saved' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {count > 0 && (
                <span className="absolute -top-1 -right-2.5 bg-[#8C2D19] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Saved</span>
          </Link>

          <Link
            to="/admin"
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
              isAdmin ? 'text-[#8C2D19] font-semibold' : 'text-[#645C55] hover:text-[#201C1A]'
            }`}
          >
            <Shield className={`w-5 h-5 ${isAdmin ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-1 tracking-tight">Admin</span>
          </Link>
        </div>
      </nav>

      {/* Quick Destination Sheet Modal on Mobile */}
      {citiesModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-3 animate-in fade-in"
          onClick={() => setCitiesModalOpen(false)}
        >
          <div
            className="bg-[#FAF7F2] rounded-3xl p-5 border border-[#E8DFD3] shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19] block">
                  Select Destination
                </span>
                <h3 className="font-editorial text-lg font-bold text-[#201C1A]">
                  Curated Indian Cities
                </h3>
              </div>
              <button
                onClick={() => setCitiesModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE8DD] text-[#645C55]"
                aria-label="Close cities drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {cityList.map((c) => {
                const active = path === `/${c.id}`
                const color = cityColors[c.id] || '#8C2D19'
                return (
                  <Link
                    key={c.id}
                    to={`/${c.id}`}
                    onClick={() => setCitiesModalOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      active
                        ? 'text-white shadow-xs'
                        : 'bg-white border border-[#E5DACB] text-[#201C1A] hover:bg-[#F2ECE1]'
                    }`}
                    style={{ backgroundColor: active ? color : undefined }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.heroImage}
                        alt={c.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold">{c.name}</span>
                          {c.hindiName && (
                            <span className={`text-xs ${active ? 'text-white/80' : 'text-[#8A8177]'}`}>
                              ({c.hindiName})
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] block ${active ? 'text-white/80' : 'text-[#7D736A]'}`}>
                          Guide: {c.persona?.name || 'Local Guide'}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

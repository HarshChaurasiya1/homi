import React, { useState } from 'react'
import { Link } from '../lib/router'
import { useRouter } from '../lib/routerContext'
import { useSavedPlaces } from '../lib/storage'
import { Compass, MapPin, Calendar, Bookmark, X } from 'lucide-react'

export const BottomNav: React.FC = () => {
  const { path } = useRouter()
  const { count } = useSavedPlaces()
  const [citiesModalOpen, setCitiesModalOpen] = useState(false)

  const citiesList = [
    { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', color: '#C85A32', highlight: 'Pink City' },
    { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', color: '#1B4965', highlight: 'City of Lakes' },
    { id: 'manali', name: 'Manali', state: 'Himachal', color: '#1E4620', highlight: 'Alpine Pines' },
    { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', color: '#9B2226', highlight: 'Ganga Ghats' },
    { id: 'mussoorie', name: 'Mussoorie', state: 'Uttarakhand', color: '#2E4057', highlight: 'Queen of Hills' },
  ]

  const isCityActive = citiesList.some((c) => path === `/${c.id}`)

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DFD3] pb-safe"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
              path === '/' ? 'text-[#8C2D19] font-semibold' : 'text-[#645C55] hover:text-[#201C1A]'
            }`}
          >
            <Compass className={`w-5 h-5 ${path === '/' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] mt-1 tracking-tight">Explore</span>
          </Link>

          <button
            onClick={() => setCitiesModalOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
              isCityActive ? 'text-[#8C2D19] font-semibold' : 'text-[#645C55] hover:text-[#201C1A]'
            }`}
          >
            <MapPin className={`w-5 h-5 ${isCityActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] mt-1 tracking-tight">5 Cities</span>
          </button>

          <Link
            to="/planner"
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
              path === '/planner' ? 'text-[#8C2D19] font-semibold' : 'text-[#645C55] hover:text-[#201C1A]'
            }`}
          >
            <Calendar className={`w-5 h-5 ${path === '/planner' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] mt-1 tracking-tight">Planner</span>
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
            <span className="text-[11px] mt-1 tracking-tight">Saved</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Cities Quick Sheet */}
      {citiesModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setCitiesModalOpen(false)}
        >
          <div
            className="bg-[#FAF7F2] border-t sm:border border-[#E5DACB] rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 animate-in slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#201C1A]">Choose City Guide</h3>
                <span className="text-xs text-[#7A7167]">5 Pilot Indian Destinations</span>
              </div>
              <button
                onClick={() => setCitiesModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE8DD] text-[#645C55]"
                aria-label="Close cities modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 py-1">
              {citiesList.map((city) => {
                const active = path === `/${city.id}`
                return (
                  <Link
                    key={city.id}
                    to={`/${city.id}`}
                    onClick={() => setCitiesModalOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      active ? 'text-white shadow-xs' : 'bg-white hover:bg-[#F2ECE1] text-[#201C1A] border border-[#E8DFD3]'
                    }`}
                    style={{ backgroundColor: active ? city.color : undefined }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: active ? '#FFFFFF' : city.color }}
                      ></span>
                      <div>
                        <span className="font-bold text-sm block">{city.name}</span>
                        <span className={`text-[11px] block ${active ? 'text-white/80' : 'text-[#7D736A]'}`}>{city.state}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${active ? 'bg-white/20 text-white' : 'bg-[#F5EFE6] text-[#6E645A]'}`}>
                      {city.highlight}
                    </span>
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

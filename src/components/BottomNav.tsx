import React, { useState } from 'react'
import { Link } from '../lib/router'
import { useRouter } from '../lib/routerContext'
import { useSavedPlaces, useActiveCity } from '../lib/storage'
import { useAppData } from '../lib/dataStore'
import {
  Compass,
  Calendar,
  Bookmark,
  MapPin,
  User,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

export const BottomNav: React.FC = () => {
  const { path, navigate } = useRouter()
  const { count } = useSavedPlaces()
  const { cities } = useAppData()
  const [activeCityId, setActiveCityId] = useActiveCity()
  const [citiesModalOpen, setCitiesModalOpen] = useState(false)

  const activeCity = activeCityId ? cities[activeCityId.toLowerCase()] : null
  const cityList = Object.values(cities)

  const handleSelectCity = (id: string) => {
    setActiveCityId(id)
    setCitiesModalOpen(false)
    navigate(`/${id}`)
  }

  const handleClearCity = () => {
    setActiveCityId(null)
    setCitiesModalOpen(false)
    navigate('/')
  }

  return (
    <>
      {/* Floating Bottom Navigation Bar: Sticks at bottom of mobile-app-shell */}
      <nav
        className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-xl px-2 py-1.5"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-14 w-full items-center">
          {/* 1. Explore / Home */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 transition-all rounded-2xl min-h-[44px] ${
              path === '/' ? 'text-indigo-600 font-bold bg-indigo-50/80 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className={`w-5 h-5 ${path === '/' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Explore</span>
          </Link>

          {/* 2. Destination Cities modal */}
          <button
            type="button"
            onClick={() => setCitiesModalOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition-all rounded-2xl min-h-[44px] cursor-pointer ${
              activeCity ? 'text-indigo-600 font-bold bg-indigo-50/80' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className={`w-5 h-5 ${activeCity ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[55px] font-medium">
              {activeCity ? activeCity.name : 'Cities'}
            </span>
          </button>

          {/* 3. 1-by-1 Minimalist Planner */}
          <Link
            to="/planner"
            className={`flex flex-col items-center justify-center py-1 transition-all rounded-2xl min-h-[44px] ${
              path === '/planner' ? 'text-indigo-600 font-bold bg-indigo-50/80 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className={`w-5 h-5 ${path === '/planner' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Plan</span>
          </Link>

          {/* 4. Saved Places & Trips */}
          <Link
            to="/saved"
            className={`flex flex-col items-center justify-center py-1 transition-all rounded-2xl min-h-[44px] ${
              path === '/saved' ? 'text-indigo-600 font-bold bg-indigo-50/80 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Bookmark className={`w-5 h-5 ${path === '/saved' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {count > 0 && (
                <span className="absolute -top-1 -right-2 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {count}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Saved</span>
          </Link>

          {/* 5. Account & Profile */}
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center py-1 transition-all rounded-2xl min-h-[44px] ${
              path === '/profile' ? 'text-indigo-600 font-bold bg-indigo-50/80 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className={`w-5 h-5 ${path === '/profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Account</span>
          </Link>
        </div>
      </nav>

      {/* Modern Clean City Selector Sheet / Modal */}
      {citiesModalOpen && (
        <div
          onClick={() => setCitiesModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Explore Destinations</h3>
              </div>
              <button
                type="button"
                onClick={() => setCitiesModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeCity && (
              <button
                type="button"
                onClick={handleClearCity}
                className="w-full py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Clear Destination Filter (All India)</span>
              </button>
            )}

            <div className="space-y-2">
              {cityList.map((city) => {
                const isSelected = activeCity?.id === city.id
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleSelectCity(city.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        <img
                          src={city.heroImage}
                          alt={city.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">{city.name}</span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                          {city.tagline}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

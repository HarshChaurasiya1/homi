import React, { useState } from 'react'
import { Link } from '../lib/router'
import { useRouter } from '../lib/routerContext'
import { BRAND } from '../config/brand'
import { useSavedPlaces } from '../lib/storage'
import { Bookmark, Calendar, Menu, X, Heart } from 'lucide-react'

export const Header: React.FC = () => {
  const { path } = useRouter()
  const { count } = useSavedPlaces()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  const isPlanner = path === '/planner'
  const isSaved = path === '/saved'
  const isHome = path === '/'

  const citiesList = [
    { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', color: '#C85A32', highlight: 'Pink City' },
    { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', color: '#1B4965', highlight: 'City of Lakes' },
    { id: 'manali', name: 'Manali', state: 'Himachal', color: '#1E4620', highlight: 'Himalayan Pines' },
    { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', color: '#9B2226', highlight: 'Ganga Ghats' },
    { id: 'mussoorie', name: 'Mussoorie', state: 'Uttarakhand', color: '#2E4057', highlight: 'Queen of Hills' },
  ]

  const activeCity = citiesList.find((c) => path === `/${c.id}`)

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD3] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Wordmark & Tagline */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group flex items-baseline gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C2D19] rounded-md px-1"
            aria-label={`${BRAND.name} Home - ${BRAND.tagline}`}
          >
            <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#201C1A] group-hover:text-[#8C2D19] transition-colors">
              {BRAND.name}
            </span>
            <span className="hidden md:inline-block text-xs uppercase tracking-wider font-medium text-[#645C55] pl-2 border-l border-[#D5C9BC]">
              {BRAND.tagline}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2" aria-label="Main Navigation">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors ${
              isHome
                ? 'bg-[#201C1A] text-white shadow-xs'
                : 'text-[#48423E] hover:text-[#201C1A] hover:bg-[#EFE8DD]'
            }`}
          >
            Discover
          </Link>

          {/* 5 City Pills directly in header */}
          {citiesList.map((city) => {
            const active = path === `/${city.id}`
            return (
              <Link
                key={city.id}
                to={`/${city.id}`}
                className={`px-2.5 lg:px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  active
                    ? 'text-white shadow-xs font-semibold'
                    : 'text-[#48423E] hover:text-[#201C1A] hover:bg-[#EFE8DD]'
                }`}
                style={{ backgroundColor: active ? city.color : undefined }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: active ? '#FFFFFF' : city.color }}
                ></span>
                <span>{city.name}</span>
              </Link>
            )
          })}

          <div className="h-4 w-px bg-[#D5C9BC] mx-1"></div>

          <Link
            to="/planner"
            className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isPlanner
                ? 'bg-[#201C1A] text-white shadow-xs'
                : 'text-[#48423E] hover:text-[#201C1A] hover:bg-[#EFE8DD]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Planner</span>
          </Link>

          <Link
            to="/saved"
            className={`relative px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isSaved
                ? 'bg-[#8C2D19] text-white shadow-xs'
                : 'text-[#48423E] hover:text-[#8C2D19] hover:bg-[#F5EBE6]'
            }`}
            aria-label={`Saved Places (${count})`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved</span>
            {count > 0 && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                  isSaved ? 'bg-white text-[#8C2D19]' : 'bg-[#8C2D19] text-white'
                }`}
              >
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Action Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {activeCity && (
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-xs"
              style={{ backgroundColor: activeCity.color }}
            >
              {activeCity.name}
            </span>
          )}

          <Link
            to="/saved"
            className="relative p-2 text-[#48423E] hover:text-[#8C2D19] transition-colors rounded-full hover:bg-[#EFE8DD]"
            aria-label={`Saved Places (${count})`}
          >
            <Heart className={`w-5 h-5 ${count > 0 ? 'fill-[#8C2D19] text-[#8C2D19]' : ''}`} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8C2D19] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#48423E] hover:text-[#201C1A] rounded-lg hover:bg-[#EFE8DD] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C2D19]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DFD3] bg-[#FAF7F2] px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
              isHome ? 'bg-[#201C1A] text-white' : 'text-[#48423E] hover:bg-[#EFE8DD]'
            }`}
          >
            Discover All Destinations
          </Link>

          <div className="pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#8A8177] px-3">
            5 Pilot Cities
          </div>

          <div className="space-y-1 pl-1">
            {citiesList.map((c) => {
              const active = path === `/${c.id}`
              return (
                <Link
                  key={c.id}
                  to={`/${c.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active ? 'text-white' : 'text-[#201C1A] hover:bg-[#F2ECE1]'
                  }`}
                  style={{ backgroundColor: active ? c.color : undefined }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: active ? '#FFFFFF' : c.color }}
                    ></span>
                    <span>{c.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-[#EFE8DC] text-[#6E645A]'}`}>
                    {c.highlight}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="pt-2 border-t border-[#E8DFD3] space-y-1">
            <Link
              to="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-medium ${
                isPlanner ? 'bg-[#201C1A] text-white' : 'text-[#48423E] hover:bg-[#EFE8DD]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Itinerary & Budget Planner</span>
            </Link>

            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium ${
                isSaved ? 'bg-[#8C2D19] text-white' : 'text-[#48423E] hover:bg-[#EFE8DD]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span>Saved Places</span>
              </div>
              {count > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-[#8C2D19] text-white rounded-full">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

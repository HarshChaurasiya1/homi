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

  const isDelhi = path === '/delhi'
  const isJaipur = path === '/jaipur'
  const isPlanner = path === '/planner'
  const isSaved = path === '/saved'
  const isHome = path === '/'

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
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isHome
                ? 'bg-[#201C1A] text-white'
                : 'text-[#48423E] hover:text-[#201C1A] hover:bg-[#EFE8DD]'
            }`}
          >
            Discover
          </Link>

          <Link
            to="/delhi"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isDelhi
                ? 'bg-[#8C2D19] text-white'
                : 'text-[#48423E] hover:text-[#8C2D19] hover:bg-[#F5EBE6]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C2D19]/60"></span>
            Delhi
          </Link>

          <Link
            to="/jaipur"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isJaipur
                ? 'bg-[#C85A32] text-white'
                : 'text-[#48423E] hover:text-[#C85A32] hover:bg-[#FBECE6]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]/60"></span>
            Jaipur
          </Link>

          <Link
            to="/planner"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isPlanner
                ? 'bg-[#201C1A] text-white'
                : 'text-[#48423E] hover:text-[#201C1A] hover:bg-[#EFE8DD]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Trip Planner
          </Link>

          <Link
            to="/saved"
            className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isSaved
                ? 'bg-[#8C2D19] text-white'
                : 'text-[#48423E] hover:text-[#8C2D19] hover:bg-[#F5EBE6]'
            }`}
            aria-label={`Saved Places (${count})`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved</span>
            {count > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full ${
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
        <div className="md:hidden border-t border-[#E8DFD3] bg-[#FAF7F2] px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isHome ? 'bg-[#201C1A] text-white' : 'text-[#48423E] hover:bg-[#EFE8DD]'
            }`}
          >
            Discover All
          </Link>
          <Link
            to="/delhi"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
              isDelhi ? 'bg-[#8C2D19] text-white' : 'text-[#8C2D19] hover:bg-[#F5EBE6]'
            }`}
          >
            <span>Delhi City Discovery</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">Mughal & Capital</span>
          </Link>
          <Link
            to="/jaipur"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
              isJaipur ? 'bg-[#C85A32] text-white' : 'text-[#C85A32] hover:bg-[#FBECE6]'
            }`}
          >
            <span>Jaipur City Discovery</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">The Pink City</span>
          </Link>
          <Link
            to="/planner"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium ${
              isPlanner ? 'bg-[#201C1A] text-white' : 'text-[#48423E] hover:bg-[#EFE8DD]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Itinerary & Budget Planner</span>
          </Link>
          <Link
            to="/saved"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
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
      )}
    </header>
  )
}

import React, { useState } from 'react'
import { Link } from '../lib/router'
import { useRouter } from '../lib/routerContext'
import { BRAND } from '../config/brand'
import { useSavedPlaces, useActiveCity } from '../lib/storage'
import { useAppData } from '../lib/dataStore'
import { useProfile } from '../lib/profileStore'
import { ProfileModal } from './ProfileModal'
import {
  Bookmark,
  Calendar,
  Menu,
  X,
  Heart,
  Shield,
  Compass,
  RotateCcw,
  User,
  Lock,
} from 'lucide-react'

export const Header: React.FC = () => {
  const { path, navigate } = useRouter()
  const { count } = useSavedPlaces()
  const { cities } = useAppData()
  const { profile, hasProfile, isUnlocked } = useProfile()
  const [activeCityId, setActiveCityId] = useActiveCity()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const isAdmin = path === '/admin'
  const isPlanner = path === '/planner'
  const isSaved = path === '/saved'
  const isHome = path === '/'

  // Determine effective active city from route or storage
  const routeCityId = path.startsWith('/') && path.length > 1 ? path.slice(1).toLowerCase() : null
  const currentCityKey = (routeCityId && cities[routeCityId] ? routeCityId : activeCityId)?.toLowerCase() || null
  const activeCity = currentCityKey ? cities[currentCityKey] : null

  // Color mapping fallback
  const cityColors: Record<string, string> = {
    jaipur: '#C85A32',
    udaipur: '#1B4965',
    manali: '#1E4620',
    varanasi: '#9B2226',
    mussoorie: '#2E4057',
    delhi: '#8C2D19',
  }

  const handleClearCity = () => {
    setActiveCityId(null)
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD3] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Wordmark & Mode Tagline */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => {
              if (activeCity) {
                // Return to clean discovery
              }
            }}
            className="group flex items-baseline gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C2D19] rounded-md px-1"
            aria-label={`${BRAND.name} Home - ${BRAND.tagline}`}
          >
            <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#201C1A] group-hover:text-[#8C2D19] transition-colors">
              {BRAND.name}
            </span>
            <span className="hidden lg:inline-block text-xs uppercase tracking-wider font-medium text-[#645C55] pl-2 border-l border-[#D5C9BC]">
              {BRAND.tagline}
            </span>
          </Link>

          {/* Board Badge / Mode Indicator */}
          <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors bg-[#F5EFE6] border-[#E5DACB] text-[#8C2D19]">
            {isAdmin ? (
              <span className="flex items-center gap-1 text-[#8C2D19]">
                <Shield className="w-3 h-3" />
                <span>Admin Studio</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#554D45]">
                <Compass className="w-3 h-3 text-[#8C2D19]" />
                <span>{activeCity ? `${activeCity.name} Board` : 'User Board'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2" aria-label="Main Navigation">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors ${
              isHome && !activeCity
                ? 'bg-[#201C1A] text-white shadow-xs'
                : 'text-[#48423E] hover:text-[#201C1A] hover:bg-[#EFE8DD]'
            }`}
          >
            Home
          </Link>

          {/* =========================================================================
              IF A CITY IS SELECTED: ONLY SHOW THAT CITY (NEVER SHOW OTHER CITIES)
             ========================================================================= */}
          {activeCity ? (
            <div className="flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-full bg-[#F5EFE6] border border-[#E5DACB]">
              <Link
                to={`/${activeCity.id}`}
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs flex items-center gap-1.5"
                style={{ backgroundColor: cityColors[activeCity.id] || '#8C2D19' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>{activeCity.name}</span>
                <span className="text-[10px] text-white/80 font-normal">
                  ({activeCity.persona?.name?.split(' ')[1] || 'Host'})
                </span>
              </Link>

              <button
                type="button"
                onClick={handleClearCity}
                className="text-[11px] font-semibold text-[#8C8276] hover:text-[#8C2D19] transition-colors flex items-center gap-1 pr-1"
                title="Choose a different destination"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Change City</span>
              </button>
            </div>
          ) : (
            /* If no city selected yet, show clean minimal destination picker */
            <span className="text-xs text-[#8A8177] px-2 italic">
              Select destination below
            </span>
          )}

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
            <span>Itinerary</span>
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

          {/* LOCAL DATABASE PROFILE / SAVE PROGRESS BUTTON */}
          <button
            type="button"
            onClick={() => setProfileModalOpen(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              hasProfile
                ? isUnlocked
                  ? 'bg-[#FAF5ED] text-[#8C2D19] border-[#ECD7CE] hover:bg-[#F2ECE1]'
                  : 'bg-[#FAF7F2] text-[#7A7167] border-[#DDD3C5] hover:bg-[#EAE2D5]'
                : 'bg-[#8C2D19] text-white border-[#8C2D19] hover:bg-[#722312] shadow-xs'
            }`}
            title={
              hasProfile
                ? isUnlocked
                  ? `${profile?.name}'s Local Profile (Active)`
                  : 'Profile Locked with Password'
                : 'Save your progress in local database'
            }
          >
            {hasProfile ? (
              <>
                <span>{profile?.avatarEmoji || '👤'}</span>
                <span className="max-w-[80px] truncate">{profile?.name}</span>
                {isUnlocked ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ) : (
                  <Lock className="w-3 h-3 text-[#7A7167]" />
                )}
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Save Progress</span>
              </>
            )}
          </button>

          {/* ADMIN BOARD TOGGLE BUTTON */}
          <Link
            to={isAdmin ? '/' : '/admin'}
            className={`ml-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isAdmin
                ? 'bg-[#8C2D19] text-white border-[#8C2D19] shadow-xs'
                : 'bg-white border-[#D5C9BC] text-[#201C1A] hover:bg-[#201C1A] hover:text-white hover:border-[#201C1A]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Exit Admin' : 'Admin'}</span>
          </Link>
        </nav>

        {/* Mobile Action Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {activeCity ? (
            <div className="flex items-center gap-1.5">
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-xs"
                style={{ backgroundColor: cityColors[activeCity.id] || '#8C2D19' }}
              >
                {activeCity.name}
              </span>
              <button
                onClick={handleClearCity}
                className="p-1 rounded-lg text-[#7A7167] hover:text-[#8C2D19]"
                aria-label="Change city"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}

          {/* Mobile Profile Trigger */}
          <button
            type="button"
            onClick={() => setProfileModalOpen(true)}
            className="p-1.5 rounded-lg text-xs font-bold border border-[#E5DACB] bg-white flex items-center justify-center text-[#201C1A] hover:bg-[#FAF7F2]"
            aria-label="User Profile & Progress"
            title="Profile & Progress"
          >
            {hasProfile ? (
              <span className="text-sm">{profile?.avatarEmoji}</span>
            ) : (
              <User className="w-4 h-4 text-[#8C2D19]" />
            )}
          </button>

          <Link
            to="/admin"
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border ${
              isAdmin ? 'bg-[#8C2D19] text-white border-[#8C2D19]' : 'bg-white border-[#E5DACB] text-[#201C1A]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
          </Link>

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
        <div className="md:hidden border-t border-[#E8DFD3] bg-[#FAF7F2] px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in fade-in">
          {activeCity ? (
            <div className="p-3 rounded-2xl bg-white border border-[#E5DACB] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19] block">
                  Active Destination:
                </span>
                <span className="text-sm font-bold text-[#201C1A]">{activeCity.name}</span>
                <span className="text-xs text-[#7A7167] block">Host: {activeCity.persona?.name}</span>
              </div>
              <button
                onClick={handleClearCity}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5DACB] text-xs font-semibold text-[#8C2D19] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Switch City</span>
              </button>
            </div>
          ) : null}

          <div className="space-y-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                setProfileModalOpen(true)
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-[#FAF5ED] text-[#8C2D19] border border-[#ECD7CE]"
            >
              <div className="flex items-center gap-2">
                <span>{profile?.avatarEmoji || '👤'}</span>
                <span>
                  {hasProfile
                    ? isUnlocked
                      ? `${profile?.name}'s Profile`
                      : 'Unlock Profile'
                    : 'Save Progress & Profile'}
                </span>
              </div>
              {hasProfile && !isUnlocked && <Lock className="w-3.5 h-3.5" />}
            </button>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                isHome ? 'bg-[#201C1A] text-white' : 'text-[#48423E] hover:bg-[#EFE8DD]'
              }`}
            >
              Home & Discover
            </Link>

            <Link
              to="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
                isPlanner ? 'bg-[#201C1A] text-white' : 'text-[#48423E] hover:bg-[#EFE8DD]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Trip Itinerary</span>
            </Link>

            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium ${
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

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-[#8C2D19] bg-[#F5EFE6]`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Board & Studio</span>
            </Link>
          </div>
        </div>
      )}

      {/* Local Database Profile & Password Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onToast={(msg) => {
          setToastMsg(msg)
          setTimeout(() => setToastMsg(null), 3000)
        }}
      />

      {/* Header Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-4 z-50 bg-[#201C1A] text-white text-xs px-4 py-2.5 rounded-xl shadow-lg animate-in fade-in flex items-center gap-2">
          <span>{toastMsg}</span>
        </div>
      )}
    </header>
  )
}

import React, { useState } from 'react'
import { Link } from '../lib/router'
import { useRouter } from '../lib/routerContext'
import { BRAND } from '../config/brand'
import { useSavedPlaces, useActiveCity } from '../lib/storage'
import { useAppData } from '../lib/dataStore'
import { useProfile } from '../lib/profileStore'
import { ProfileModal } from './ProfileModal'
import { HomiBrandLogo } from './HomiBrandLogo'
import { LocalGuideAndEmergencyHub } from './LocalGuideAndEmergencyHub'
import {
  Bookmark,
  Calendar,
  Shield,
  RotateCcw,
  Lock,
  Flame,
  CheckCircle2,
  ShieldAlert,
  BookOpen,
} from 'lucide-react'

interface HeaderProps {
  onToast?: (msg: string) => void
}

export const Header: React.FC<HeaderProps> = ({ onToast }) => {
  const { path, navigate } = useRouter()
  const { count } = useSavedPlaces()
  const { cities } = useAppData()
  const { profile, hasProfile, isUnlocked } = useProfile()
  const [activeCityId, setActiveCityId] = useActiveCity()
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [safetyHubOpen, setSafetyHubOpen] = useState(false)

  const isAdmin = path === '/admin'
  const isPlanner = path === '/planner'
  const isSaved = path === '/saved'

  // Determine effective active city from route or storage
  const routeCityId = path.startsWith('/') && path.length > 1 ? path.slice(1).toLowerCase() : null
  const currentCityKey = (routeCityId && cities[routeCityId] ? routeCityId : activeCityId)?.toLowerCase() || null
  const activeCity = currentCityKey ? cities[currentCityKey] : null

  const handleClearCity = () => {
    setActiveCityId(null)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-colors">
      <div className="w-full px-4 h-15 flex items-center justify-between">
        {/* Brand Logo & Flame Streak */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/"
            className="group flex items-center focus:outline-none rounded-xl"
            aria-label={`${BRAND.name} Home`}
          >
            <HomiBrandLogo size="md" />
          </Link>

          {/* Duolingo/MMT Gamified Flame Streak from uploaded UI Kit */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold shadow-2xs">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>5d</span>
          </div>

          {/* Active City Pill if exploring a specific destination */}
          {activeCity && (
            <div className="hidden sm:flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>{activeCity.name}</span>
              <button
                type="button"
                onClick={handleClearCity}
                className="p-0.5 rounded-full hover:bg-indigo-100 text-indigo-400 hover:text-indigo-700 transition-colors cursor-pointer"
                title="Switch city"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Right Navigation & Profile Avatar */}
        <div className="flex items-center gap-2">
          {/* 24x7 Local Guide & Emergency SOS Hub */}
          <button
            type="button"
            onClick={() => setSafetyHubOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Assigned Local Guide, Police & Emergency SOS"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-tight">SOS</span>
          </button>

          {/* Quick Itinerary Link */}
          <Link
            to="/planner"
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isPlanner
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plan</span>
          </Link>

          {/* Saved Places */}
          <Link
            to="/saved"
            className={`relative px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isSaved
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {count > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Profile Button */}
          <button
            type="button"
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            title="Your Profile & Settings"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              {hasProfile && profile?.name ? profile.name[0].toUpperCase() : '👤'}
            </div>
            {hasProfile && (
              <span className="hidden sm:inline truncate max-w-[80px]">{profile?.name}</span>
            )}
            {isUnlocked ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            ) : hasProfile ? (
              <Lock className="w-3 h-3 text-slate-400" />
            ) : null}
          </button>

          {/* About & System Docs */}
          <Link
            to="/about"
            className={`p-1.5 rounded-full transition-colors ${
              path === '/about'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="About HOMI & System Documentation"
          >
            <BookOpen className="w-4 h-4" />
          </Link>

          {/* Admin link */}
          <Link
            to={isAdmin ? '/' : '/admin'}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isAdmin ? 'Exit Admin' : 'Admin'}
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {profileModalOpen && (
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          onToast={onToast || (() => {})}
        />
      )}

      {safetyHubOpen && (
        <LocalGuideAndEmergencyHub
          cityId={currentCityKey || 'varanasi'}
          isOpen={safetyHubOpen}
          onClose={() => setSafetyHubOpen(false)}
          onToast={onToast}
        />
      )}
    </header>
  )
}

import React, { useState } from 'react'
import { useProfile } from '../lib/profileStore'
import {
  Lock,
  User,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react'

interface OpeningAuthGateProps {
  onDismiss?: () => void
}

export const OpeningAuthGate: React.FC<OpeningAuthGateProps> = ({ onDismiss }) => {
  const { profile, hasProfile, isUnlocked, unlock, createProfile } = useProfile()
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(hasProfile ? 'login' : 'signup')
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const isDismissed = sessionStorage.getItem('homi_auth_session_gate') === 'true'
    return !isDismissed
  })

  // Form states
  const [name, setName] = useState('')
  const [homeCity, setHomeCity] = useState('Varanasi')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null
  if (hasProfile && isUnlocked) return null

  const handleDismissGuest = () => {
    sessionStorage.setItem('homi_auth_session_gate', 'true')
    setIsOpen(false)
    if (onDismiss) onDismiss()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!password.trim()) {
      setErrorMsg('Please enter your password.')
      return
    }

    setLoading(true)
    try {
      const ok = await unlock(password)
      if (ok) {
        sessionStorage.setItem('homi_auth_session_gate', 'true')
        setIsOpen(false)
        if (onDismiss) onDismiss()
      } else {
        setErrorMsg('Incorrect password. Please try again or continue as guest.')
      }
    } catch {
      setErrorMsg('Unable to unlock profile. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!name.trim()) {
      setErrorMsg('Please enter your name.')
      return
    }
    if (password.length < 4) {
      setErrorMsg('Password should be at least 4 characters long.')
      return
    }

    setLoading(true)
    try {
      await createProfile({
        name,
        homeCity: homeCity || 'Varanasi',
        travelStyle: 'moderate',
        vibe: 'friends',
        avatarEmoji: '🎒',
        password,
      })
      sessionStorage.setItem('homi_auth_session_gate', 'true')
      setIsOpen(false)
      if (onDismiss) onDismiss()
    } catch {
      setErrorMsg('Failed to create account. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemoFill = () => {
    if (authMode === 'signup') {
      setName('Harsh Chaurasiya')
      setHomeCity('Varanasi')
      setPassword('homi123')
    } else {
      setPassword('homi123')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1B4B]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-100 flex flex-col items-center text-center">
        {/* Animated Friendly Mascot Drop/Flame (Inspired by uploaded UI Kit) */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-300/50">
            <svg
              className="w-14 h-14"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cute Water Drop / Flame mascot */}
              <path
                d="M50 12C50 12 24 45 24 64C24 78.3594 35.6406 90 50 90C64.3594 90 76 78.3594 76 64C76 45 50 12 50 12Z"
                fill="url(#mascotGrad)"
              />
              {/* Big friendly cartoon eyes */}
              <circle cx="42" cy="60" r="5" fill="#1E1B4B" />
              <circle cx="43.5" cy="58.5" r="1.8" fill="#FFFFFF" />
              <circle cx="58" cy="60" r="5" fill="#1E1B4B" />
              <circle cx="59.5" cy="58.5" r="1.8" fill="#FFFFFF" />
              {/* Cute smiling mouth */}
              <path
                d="M45 70C47 73 53 73 55 70"
                stroke="#1E1B4B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Rosy cheeks */}
              <ellipse cx="37" cy="66" rx="3" ry="1.5" fill="#F472B6" opacity="0.6" />
              <ellipse cx="63" cy="66" rx="3" ry="1.5" fill="#F472B6" opacity="0.6" />
              <defs>
                <linearGradient id="mascotGrad" x1="50" y1="12" x2="50" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A78BFA" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-[#1E1B4B] text-[10px] font-extrabold flex items-center gap-0.5 shadow-xs">
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>HOMI</span>
          </div>
        </div>

        {/* Title & Simple Value */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {hasProfile && authMode === 'login' ? `Welcome Back, ${profile?.name}!` : 'Welcome to HOMI'}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Your simple, real-world Indian travel companion.
        </p>

        {/* Modern Segmented Control Pills (Weekly/Monthly style from image) */}
        <div className="w-full grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mt-5 mb-5 border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login')
              setErrorMsg('')
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              authMode === 'login'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup')
              setErrorMsg('')
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              authMode === 'signup'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="w-full mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left flex items-start gap-2">
            <span className="font-bold">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={authMode === 'login' ? handleLogin : handleSignup} className="w-full space-y-3">
          {authMode === 'signup' && (
            <>
              {/* Full Name */}
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Home City */}
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Home City (e.g. Varanasi, Delhi, Mumbai)"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </>
          )}

          {/* Password */}
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={authMode === 'signup' ? 'Create a Password (min 4 chars)' : 'Enter Your Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Big Solid Action Button (Matching Continue button from screenshot) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Please wait...</span>
            ) : (
              <>
                <span>{authMode === 'login' ? 'Log In to HOMI' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fill Helper */}
        <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-indigo-600 hover:underline font-semibold"
          >
            Auto-fill demo credentials
          </button>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Private</span>
          </span>
        </div>

        {/* Discreet "Continue as Guest" link */}
        <div className="mt-4 pt-3 border-t border-slate-100 w-full text-center">
          <button
            type="button"
            onClick={handleDismissGuest}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
          >
            <span>Skip and explore as Guest</span>
            <span className="text-[10px]">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

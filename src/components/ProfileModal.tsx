import React, { useState } from 'react'
import { useProfile } from '../lib/profileStore'
import { useSavedPlaces, useActiveCity } from '../lib/storage'
import {
  Lock,
  Unlock,
  ShieldCheck,
  X,
  Sparkles,
  Download,
  Trash2,
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onToast: (msg: string) => void
  defaultAction?: 'create' | 'view'
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const {
    profile,
    hasProfile,
    isUnlocked,
    savedTrips,
    createProfile,
    unlock,
    lock,
    deleteTrip,
    clearAll,
    exportBackup,
    updateProfile,
  } = useProfile()

  const { count: savedPlacesCount } = useSavedPlaces()
  const [activeCityId] = useActiveCity()

  // Form states for creating/editing profile
  const [name, setName] = useState('')
  const [homeCity, setHomeCity] = useState('')
  const [travelStyle, setTravelStyle] = useState<'budget' | 'moderate' | 'premium'>('moderate')
  const [vibe, setVibe] = useState<'solo' | 'friends' | 'family' | 'couple'>('friends')
  const [avatarEmoji, setAvatarEmoji] = useState('🎒')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Unlock state
  const [unlockPassword, setUnlockPassword] = useState('')
  const [unlockError, setUnlockError] = useState('')

  // Edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [editPassword, setEditPassword] = useState('')

  if (!isOpen) return null

  // Handle new profile creation
  const handleCreateProfile = async (e: React.FormEvent) => {
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

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-check.')
      return
    }

    setIsSubmitting(true)
    try {
      await createProfile({
        name,
        homeCity,
        travelStyle,
        vibe,
        avatarEmoji,
        password,
      })
      onToast(`Welcome, ${name}! Your local profile is created and progress saved.`)
      setPassword('')
      setConfirmPassword('')
      setIsSubmitting(false)
    } catch {
      setErrorMsg('Failed to save profile on local device. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Handle unlock
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setUnlockError('')
    if (!unlockPassword) {
      setUnlockError('Please enter your password.')
      return
    }

    const success = await unlock(unlockPassword)
    if (success) {
      setUnlockPassword('')
      onToast('Profile unlocked successfully!')
    } else {
      setUnlockError('Incorrect password. Please try again.')
    }
  }

  // Handle export backup
  const handleExportBackup = () => {
    const jsonStr = exportBackup()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `homi-local-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    onToast('Exported local database backup file (.json)!')
  }

  // Handle update profile
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.')
      return
    }

    if (editPassword && editPassword.length < 4) {
      setErrorMsg('New password must be at least 4 characters.')
      return
    }

    await updateProfile(
      {
        name,
        homeCity,
        travelStyle,
        vibe,
        avatarEmoji,
      },
      editPassword || undefined
    )

    setIsEditing(false)
    setEditPassword('')
    onToast('Updated profile details on local device.')
  }

  const avatarOptions = ['🎒', '🪔', '🏰', '🚤', '🏔️', '☕', '🌲', '👑', '🍛']

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E5DACB] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="sticky top-0 bg-[#FAF7F2] border-b border-[#E8DFD3] p-5 sm:p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8C2D19] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {profile?.avatarEmoji || '👤'}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19] block">
                Local Database & Privacy
              </span>
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#201C1A]">
                {hasProfile ? (isUnlocked ? `${profile?.name}'s Profile` : 'Unlock Your Profile') : 'Create Your Local Profile'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFE8DD] text-[#7A7167] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* =========================================================================
              VIEW 1: NO PROFILE YET -> ASK BASIC INFO & SET PASSWORD
             ========================================================================= */}
          {!hasProfile && (
            <form onSubmit={handleCreateProfile} className="space-y-6">
              {/* Privacy Notice Banner */}
              <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#ECD7CE] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#8C2D19] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#554D45] space-y-1">
                  <span className="font-bold text-[#201C1A] block">
                    100% Offline & Private on this Laptop
                  </span>
                  <p>
                    Your profile and trip progress are saved in your local database. Set a password so only you can access or modify your trips.
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Avatar Emoji Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A7167] block">
                  Choose Your Explorer Avatar
                </label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatarEmoji(emoji)}
                      className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                        avatarEmoji === emoji
                          ? 'bg-[#8C2D19] text-white shadow-xs scale-108'
                          : 'bg-[#FAF7F2] border border-[#E5DACB] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Home City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7167] block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C9BC] bg-white text-sm text-[#201C1A] placeholder-[#8A8177] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30 focus:border-[#8C2D19]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7167] block">
                    Your Home City
                  </label>
                  <input
                    type="text"
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    placeholder="e.g. Mumbai, Bengaluru"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C9BC] bg-white text-sm text-[#201C1A] placeholder-[#8A8177] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30 focus:border-[#8C2D19]"
                  />
                </div>
              </div>

              {/* Travel Vibe Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A7167] block">
                  Favorite Travel Vibe
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'solo', label: '🎒 Solo' },
                    { id: 'friends', label: '🎉 Friends' },
                    { id: 'family', label: '👨‍👩‍👧‍👦 Family' },
                    { id: 'couple', label: '💖 Couple' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVibe(v.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                        vibe === v.id
                          ? 'bg-[#201C1A] text-white shadow-xs'
                          : 'bg-[#FAF7F2] border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Style */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A7167] block">
                  Preferred Budget Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'budget', label: '🪙 Pocket' },
                    { id: 'moderate', label: '☕ Cozy' },
                    { id: 'premium', label: '👑 Luxury' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setTravelStyle(tier.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                        travelStyle === tier.id
                          ? 'bg-[#8C2D19] text-white shadow-xs'
                          : 'bg-[#FAF7F2] border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Section */}
              <div className="p-4 rounded-2xl bg-[#FCF8F5] border border-[#ECD7CE] space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#8C2D19]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
                    Set Your Local Password
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7167]">
                  Protect your saved itineraries and travel progress on this browser. Minimum 4 characters.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-2 rounded-xl border border-[#D5C9BC] bg-white text-sm text-[#201C1A] placeholder-[#8A8177] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-4 py-2 rounded-xl border border-[#D5C9BC] bg-white text-sm text-[#201C1A] placeholder-[#8A8177] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-medium text-[#7A7167] hover:text-[#201C1A] flex items-center gap-1.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide password' : 'Show password'}</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#8C2D19] text-white text-sm font-bold hover:bg-[#722312] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#E67E22]" />
                <span>Save Profile on Local Device</span>
              </button>
            </form>
          )}

          {/* =========================================================================
              VIEW 2: PROFILE EXISTS BUT LOCKED -> ENTER PASSWORD
             ========================================================================= */}
          {hasProfile && !isUnlocked && (
            <form onSubmit={handleUnlock} className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FAF5ED] border border-[#ECD7CE] flex items-center justify-center mx-auto text-3xl shadow-sm">
                🔒
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-2xl font-bold text-[#201C1A]">
                  Welcome Back, {profile?.name}!
                </h3>
                <p className="text-xs text-[#7A7167]">
                  Your travel progress is locked on this device. Enter your password to view and manage your trips.
                </p>
              </div>

              {unlockError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 max-w-sm mx-auto">
                  {unlockError}
                </div>
              )}

              <div className="max-w-sm mx-auto space-y-3">
                <input
                  type="password"
                  required
                  autoFocus
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-[#D5C9BC] bg-white text-center text-sm text-[#201C1A] placeholder-[#8A8177] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30"
                />

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#8C2D19] text-white text-sm font-bold hover:bg-[#722312] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock My Travel Progress</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              VIEW 3: PROFILE UNLOCKED -> DASHBOARD & SAVED PROGRESS
             ========================================================================= */}
          {hasProfile && isUnlocked && !isEditing && (
            <div className="space-y-6">
              {/* User Bio Card */}
              <div className="p-5 rounded-3xl bg-[#FAF7F2] border border-[#E5DACB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-[#8C2D19] text-white flex items-center justify-center text-3xl shadow-xs">
                    {profile?.avatarEmoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                        {profile?.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Active Local
                      </span>
                    </div>
                    <p className="text-xs text-[#7A7167]">
                      Home: {profile?.homeCity} • Vibe: <span className="capitalize">{profile?.vibe}</span>
                    </p>
                    <p className="text-[10px] text-[#8C8276] mt-0.5">
                      Last progress saved: {new Date(profile?.lastSavedAt || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setName(profile?.name || '')
                      setHomeCity(profile?.homeCity || '')
                      setTravelStyle(profile?.travelStyle || 'moderate')
                      setVibe(profile?.vibe || 'friends')
                      setAvatarEmoji(profile?.avatarEmoji || '🎒')
                      setIsEditing(true)
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#DDD3C5] text-xs font-semibold text-[#554D45] hover:bg-[#F2ECE1]"
                  >
                    Edit Info
                  </button>
                  <button
                    onClick={() => {
                      lock()
                      onToast('Locked profile with password.')
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#201C1A] text-white text-xs font-bold hover:bg-black flex items-center gap-1"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock</span>
                  </button>
                </div>
              </div>

              {/* Progress Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5DACB]">
                  <span className="text-[10px] uppercase font-bold text-[#8C2D19] block">
                    Saved Trips
                  </span>
                  <span className="font-editorial text-2xl font-bold text-[#201C1A]">
                    {savedTrips.length}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5DACB]">
                  <span className="text-[10px] uppercase font-bold text-[#8C2D19] block">
                    Saved Places
                  </span>
                  <span className="font-editorial text-2xl font-bold text-[#201C1A]">
                    {savedPlacesCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5DACB]">
                  <span className="text-[10px] uppercase font-bold text-[#8C2D19] block">
                    Active City
                  </span>
                  <span className="font-editorial text-base font-bold text-[#201C1A] capitalize truncate block">
                    {activeCityId || 'All'}
                  </span>
                </div>
              </div>

              {/* Saved Trips List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Your Saved Trip Boards ({savedTrips.length})</span>
                  </span>
                  <button
                    onClick={handleExportBackup}
                    className="text-xs font-bold text-[#8C2D19] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Backup Database (.json)</span>
                  </button>
                </div>

                {savedTrips.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] text-center space-y-2">
                    <p className="text-xs text-[#7A7167]">
                      No custom trip boards saved yet.
                    </p>
                    <p className="text-[11px] text-[#8C8276]">
                      Answer the 3 questions on the home page and tap <strong>"Save Trip to Profile"</strong>!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto">
                    {savedTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-editorial text-sm font-bold text-[#201C1A]">
                            {trip.title}
                          </h4>
                          <span className="text-[11px] text-[#7A7167] block">
                            {trip.days} Days • ₹{trip.totalRupees.toLocaleString('en-IN')} total • {trip.budgetTier}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              deleteTrip(trip.id)
                              onToast(`Removed trip "${trip.title}".`)
                            }}
                            className="p-1.5 rounded-lg text-[#8C8276] hover:text-red-700 hover:bg-white"
                            title="Delete saved trip"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Danger Zone: Reset Local Profile */}
              <div className="pt-4 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-[#7A7167]">
                <span>Progress stored in this browser</span>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your local profile and reset saved progress?')) {
                      clearAll()
                      onToast('Local profile and progress deleted.')
                      onClose()
                    }
                  }}
                  className="text-red-700 hover:underline cursor-pointer"
                >
                  Reset Local Profile
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 4: EDIT PROFILE DETAILS
             ========================================================================= */}
          {hasProfile && isUnlocked && isEditing && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <h3 className="font-editorial text-lg font-bold text-[#201C1A]">
                Edit Profile Details
              </h3>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-xs text-red-700">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7A7167]">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C9BC]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7A7167]">Home City</label>
                <input
                  type="text"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C9BC]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7A7167]">Change Password (optional)</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C9BC]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#665D54]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#722312]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

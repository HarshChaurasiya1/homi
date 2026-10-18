import React, { useState } from 'react'
import { useProfile } from '../lib/profileStore'
import { useSavedPlaces, useActiveCity } from '../lib/storage'
import { Link } from '../lib/router'
import {
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  Download,
  Trash2,
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'

export const ProfilePage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
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

  // New profile state
  const [name, setName] = useState('')
  const [homeCity, setHomeCity] = useState('')
  const [travelStyle, setTravelStyle] = useState<'budget' | 'moderate' | 'premium'>('moderate')
  const [vibe, setVibe] = useState<'solo' | 'friends' | 'family' | 'couple'>('friends')
  const [avatarEmoji, setAvatarEmoji] = useState('🎒')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Unlock state
  const [unlockPassword, setUnlockPassword] = useState('')
  const [unlockError, setUnlockError] = useState('')

  // Edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editPassword, setEditPassword] = useState('')

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim()) {
      setErrorMsg('Please enter your name.')
      return
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    try {
      await createProfile({
        name,
        homeCity,
        travelStyle,
        vibe,
        avatarEmoji,
        password,
      })
      onSaveToast(`Welcome, ${name}! Your local profile is active and secured.`)
      setPassword('')
      setConfirmPassword('')
    } catch {
      setErrorMsg('Could not save profile locally.')
    }
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setUnlockError('')
    const ok = await unlock(unlockPassword)
    if (ok) {
      setUnlockPassword('')
      onSaveToast('Profile unlocked!')
    } else {
      setUnlockError('Incorrect password.')
    }
  }

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
    onSaveToast('Downloaded local database backup file (.json).')
  }

  const avatarOptions = ['🎒', '🪔', '🏰', '🚤', '🏔️', '☕', '🌲', '👑', '🍛']

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Page Header */}
      <section className="bg-white border-b border-[#E8DFD3] pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C2D19]" />
            <span>Local Database Profile & Password Protection</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#201C1A]">
            Your Private Travel Profile
          </h1>

          <p className="text-sm sm:text-base text-[#645C55] max-w-2xl mx-auto leading-relaxed">
            All your trips, customized adventure boards, and favorite spots are saved safely on your local browser. Set a password to keep your travel plans private.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        {/* VIEW 1: CREATE PROFILE */}
        {!hasProfile && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DACB] shadow-sm space-y-6">
            <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#ECD7CE] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#8C2D19] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#554D45] space-y-1">
                <span className="font-bold text-[#201C1A] block">
                  100% Offline & Private on this Laptop
                </span>
                <p>
                  No external server or database tracking. Set your basic travel preferences and a local password to lock your progress.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateProfile} className="space-y-6">
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
                      className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7167] block">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-[#D5C9BC] bg-white text-sm text-[#201C1A] placeholder-[#8A8177] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30"
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
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    className="w-full px-4 py-3 rounded-xl border border-[#D5C9BC] bg-white text-sm text-[#201C1A] placeholder-[#8A8177] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A7167] block">
                  Primary Travel Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'solo', label: '🎒 Solo Explorer' },
                    { id: 'friends', label: '🎉 Friends Gang' },
                    { id: 'family', label: '👨‍👩‍👧‍👦 Family & Kids' },
                    { id: 'couple', label: '💖 Couples Romance' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVibe(v.id as any)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
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

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A7167] block">
                  Budget Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'budget', label: '🪙 Pocket-Friendly (~₹1.4k)' },
                    { id: 'moderate', label: '☕ Cozy Comfort (~₹3.8k)' },
                    { id: 'premium', label: '👑 Royal Luxury (~₹9.8k)' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setTravelStyle(tier.id as any)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
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

              {/* Password Box */}
              <div className="p-5 rounded-2xl bg-[#FCF8F5] border border-[#ECD7CE] space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#8C2D19]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
                    Set Local Device Password
                  </span>
                </div>
                <p className="text-xs text-[#7A7167]">
                  This password locks your saved trips on this browser so no one else using this laptop can tamper with your itineraries.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 4 chars)"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C9BC] bg-white text-sm"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C9BC] bg-white text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#7A7167] hover:text-[#201C1A] flex items-center gap-1.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide password' : 'Show password'}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#8C2D19] text-white text-sm font-bold hover:bg-[#722312] transition-all flex items-center justify-center gap-2 shadow-md hover:scale-101 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E67E22]" />
                <span>Create Profile & Save Progress Locally</span>
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: PROFILE LOCKED */}
        {hasProfile && !isUnlocked && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DACB] shadow-sm text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-[#FAF5ED] border border-[#ECD7CE] flex items-center justify-center mx-auto text-4xl shadow-xs">
              🔒
            </div>

            <div className="space-y-1">
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                Unlock {profile?.name}'s Profile
              </h2>
              <p className="text-xs text-[#7A7167]">
                Enter your local password to unlock your saved trips and adventure boards.
              </p>
            </div>

            {unlockError && (
              <div className="p-3 rounded-xl bg-red-50 text-xs text-red-700">
                {unlockError}
              </div>
            )}

            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                type="password"
                required
                autoFocus
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-[#D5C9BC] bg-white text-center text-sm"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#8C2D19] text-white text-sm font-bold hover:bg-[#722312] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Profile</span>
              </button>
            </form>
          </div>
        )}

        {/* VIEW 3: PROFILE UNLOCKED */}
        {hasProfile && isUnlocked && !isEditing && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#8C2D19] text-white flex items-center justify-center text-3xl shadow-sm">
                  {profile?.avatarEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                      {profile?.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Local Active
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7167] mt-0.5">
                    From <strong>{profile?.homeCity}</strong> • Travel Vibe: <span className="capitalize">{profile?.vibe}</span>
                  </p>
                  <p className="text-[11px] text-[#8C8276] mt-0.5">
                    Member since: {new Date(profile?.createdAt || '').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setName(profile?.name || '')
                    setHomeCity(profile?.homeCity || '')
                    setTravelStyle(profile?.travelStyle || 'moderate')
                    setVibe(profile?.vibe || 'friends')
                    setAvatarEmoji(profile?.avatarEmoji || '🎒')
                    setIsEditing(true)
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD3C5] text-xs font-semibold text-[#554D45] hover:bg-[#F2ECE1]"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    lock()
                    onSaveToast('Locked profile with password.')
                  }}
                  className="px-4 py-2 rounded-xl bg-[#201C1A] text-white text-xs font-bold hover:bg-black flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Profile</span>
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-3xl bg-white border border-[#E5DACB]">
                <span className="text-xs uppercase font-bold text-[#8C2D19] block">
                  Saved Trips
                </span>
                <span className="font-editorial text-3xl font-bold text-[#201C1A] block mt-1">
                  {savedTrips.length}
                </span>
              </div>
              <div className="p-4 rounded-3xl bg-white border border-[#E5DACB]">
                <span className="text-xs uppercase font-bold text-[#8C2D19] block">
                  Bookmarked Places
                </span>
                <span className="font-editorial text-3xl font-bold text-[#201C1A] block mt-1">
                  {savedPlacesCount}
                </span>
              </div>
              <div className="p-4 rounded-3xl bg-white border border-[#E5DACB]">
                <span className="text-xs uppercase font-bold text-[#8C2D19] block">
                  Current Destination
                </span>
                <span className="font-editorial text-xl font-bold text-[#201C1A] capitalize truncate block mt-2">
                  {activeCityId || 'None (Global)'}
                </span>
              </div>
            </div>

            {/* Saved Trips Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8C2D19]" />
                  <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                    Saved Trips in Local Database ({savedTrips.length})
                  </h3>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="text-xs font-bold text-[#8C2D19] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Database Backup (.json)</span>
                </button>
              </div>

              {savedTrips.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#FAF7F2] text-center space-y-2">
                  <p className="text-xs text-[#7A7167]">No trips saved yet.</p>
                  <Link
                    to="/"
                    className="inline-block mt-2 px-4 py-2 rounded-xl bg-[#8C2D19] text-white text-xs font-bold"
                  >
                    Build an Adventure Board
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-editorial text-base font-bold text-[#201C1A]">
                            {trip.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#EAE2D5] text-[10px] font-bold uppercase text-[#554D45]">
                            {trip.budgetTier}
                          </span>
                        </div>
                        <p className="text-xs text-[#7A7167]">
                          {trip.days} Days • Total: ₹{trip.totalRupees.toLocaleString('en-IN')} • Saved on {new Date(trip.savedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/${trip.destination}`}
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#DDD3C5] text-xs font-semibold text-[#201C1A] hover:bg-[#201C1A] hover:text-white"
                        >
                          Explore City
                        </Link>
                        <button
                          onClick={() => {
                            deleteTrip(trip.id)
                            onSaveToast(`Deleted trip "${trip.title}".`)
                          }}
                          className="p-2 rounded-lg text-[#8C8276] hover:text-red-700 hover:bg-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            <div className="flex items-center justify-between text-xs text-[#7A7167] px-2">
              <span>Saved offline in browser localStorage</span>
              <button
                onClick={() => {
                  if (window.confirm('Delete local profile and wipe all saved progress?')) {
                    clearAll()
                    onSaveToast('Local profile deleted.')
                  }
                }}
                className="text-red-700 hover:underline cursor-pointer"
              >
                Delete Profile
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: EDIT PROFILE */}
        {hasProfile && isUnlocked && isEditing && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
              Edit Profile Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#7A7167]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C9BC]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#7A7167]">Home City</label>
                <input
                  type="text"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C9BC]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#7A7167]">Update Password (optional)</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Leave empty to keep current password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C9BC]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#665D54]"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await updateProfile(
                      { name, homeCity, travelStyle, vibe, avatarEmoji },
                      editPassword || undefined
                    )
                    setIsEditing(false)
                    setEditPassword('')
                    onSaveToast('Updated profile details.')
                  }}
                  className="px-5 py-2 rounded-xl bg-[#8C2D19] text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Local Database Profile & Progress Store for HOMI
 * Stores user profile, password hash, saved trips, and progress 100% locally on device.
 */

import { useState, useEffect } from 'react'

export interface UserProfile {
  id: string
  name: string
  homeCity: string
  travelStyle: 'budget' | 'moderate' | 'premium'
  vibe: 'solo' | 'friends' | 'family' | 'couple'
  avatarEmoji: string
  passwordHash: string
  salt: string
  createdAt: string
  lastSavedAt: string
}

export interface SavedTripProgress {
  id: string
  destination: string
  cityName: string
  days: number
  budgetTier: string
  vibe: string
  totalRupees: number
  savedAt: string
  title: string
  notes?: string
}

const PROFILE_KEY = 'homi_local_profile_v1'
const SESSION_UNLOCKED_KEY = 'homi_session_unlocked_v1'
const SAVED_TRIPS_KEY = 'homi_saved_trips_v1'
const PROFILE_SYNC_EVENT = 'homi_profile_sync'

// Simple memory fallback if storage is blocked
let memoryStorage: Record<string, string> = {}

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const test = '__homi_test_profile__'
    window.localStorage.setItem(test, '1')
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

function getItem(key: string): string | null {
  if (isStorageAvailable()) {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return memoryStorage[key] || null
    }
  }
  return memoryStorage[key] || null
}

function setItem(key: string, value: string): void {
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      memoryStorage[key] = value
    }
  } else {
    memoryStorage[key] = value
  }
}

function removeItem(key: string): void {
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      delete memoryStorage[key]
    }
  } else {
    delete memoryStorage[key]
  }
}

function dispatchSync(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROFILE_SYNC_EVENT))
  }
}

/**
 * Secure local password hasher using Web Crypto SHA-256 with salt
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const normalized = (password.trim() + ':' + salt)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const enc = new TextEncoder()
      const data = enc.encode(normalized)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    } catch {
      // Fallback below
    }
  }
  // Deterministic fallback hash for environments without SubtleCrypto
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return 'fb_' + Math.abs(hash).toString(16)
}

/**
 * Read current profile from local database
 */
export function getLocalProfile(): UserProfile | null {
  const raw = getItem(PROFILE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

/**
 * Check if the current session is unlocked with password
 */
export function isProfileUnlocked(): boolean {
  const profile = getLocalProfile()
  if (!profile) return true // No password set yet
  return getItem(SESSION_UNLOCKED_KEY) === 'true'
}

/**
 * Create a new user profile with password in local database
 */
export async function createLocalProfile(data: {
  name: string
  homeCity: string
  travelStyle: 'budget' | 'moderate' | 'premium'
  vibe: 'solo' | 'friends' | 'family' | 'couple'
  avatarEmoji?: string
  password: string
}): Promise<UserProfile> {
  const salt = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
  const passwordHash = await hashPassword(data.password, salt)

  const profile: UserProfile = {
    id: 'user_' + Date.now().toString(36),
    name: data.name.trim(),
    homeCity: data.homeCity.trim() || 'India',
    travelStyle: data.travelStyle,
    vibe: data.vibe,
    avatarEmoji: data.avatarEmoji || '🎒',
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
  }

  setItem(PROFILE_KEY, JSON.stringify(profile))
  setItem(SESSION_UNLOCKED_KEY, 'true')
  dispatchSync()
  return profile
}

/**
 * Unlock profile by verifying password
 */
export async function unlockLocalProfile(password: string): Promise<boolean> {
  const profile = getLocalProfile()
  if (!profile) return true
  const computedHash = await hashPassword(password, profile.salt)
  if (computedHash === profile.passwordHash) {
    setItem(SESSION_UNLOCKED_KEY, 'true')
    dispatchSync()
    return true
  }
  return false
}

/**
 * Lock session (requires password to unlock progress)
 */
export function lockLocalProfile(): void {
  removeItem(SESSION_UNLOCKED_KEY)
  dispatchSync()
}

/**
 * Update existing profile info
 */
export async function updateLocalProfile(
  updates: Partial<Omit<UserProfile, 'id' | 'passwordHash' | 'salt' | 'createdAt'>>,
  newPassword?: string
): Promise<UserProfile | null> {
  const profile = getLocalProfile()
  if (!profile) return null

  let passwordHash = profile.passwordHash
  let salt = profile.salt

  if (newPassword && newPassword.trim().length >= 4) {
    salt = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    passwordHash = await hashPassword(newPassword, salt)
  }

  const updated: UserProfile = {
    ...profile,
    ...updates,
    passwordHash,
    salt,
    lastSavedAt: new Date().toISOString(),
  }

  setItem(PROFILE_KEY, JSON.stringify(updated))
  dispatchSync()
  return updated
}

/**
 * Save trip progress under the local user profile
 */
export function saveTripProgress(trip: {
  destination: string
  cityName: string
  days: number
  budgetTier: string
  vibe: string
  totalRupees: number
  title?: string
  notes?: string
}): SavedTripProgress {
  const currentTrips = getSavedTrips()
  const newTrip: SavedTripProgress = {
    id: 'trip_' + Date.now().toString(36),
    destination: trip.destination,
    cityName: trip.cityName,
    days: trip.days,
    budgetTier: trip.budgetTier,
    vibe: trip.vibe,
    totalRupees: trip.totalRupees,
    title: trip.title || `${trip.cityName} ${trip.days}-Day Adventure`,
    notes: trip.notes,
    savedAt: new Date().toISOString(),
  }

  const updated = [newTrip, ...currentTrips.filter((t) => t.destination !== trip.destination)]
  setItem(SAVED_TRIPS_KEY, JSON.stringify(updated))

  // Touch profile lastSavedAt
  const profile = getLocalProfile()
  if (profile) {
    profile.lastSavedAt = new Date().toISOString()
    setItem(PROFILE_KEY, JSON.stringify(profile))
  }

  dispatchSync()
  return newTrip
}

/**
 * Get all saved trips from local database
 */
export function getSavedTrips(): SavedTripProgress[] {
  const raw = getItem(SAVED_TRIPS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Delete a saved trip from local database
 */
export function deleteSavedTrip(id: string): void {
  const currentTrips = getSavedTrips()
  const updated = currentTrips.filter((t) => t.id !== id)
  setItem(SAVED_TRIPS_KEY, JSON.stringify(updated))
  dispatchSync()
}

/**
 * Clear local database completely
 */
export function clearLocalDatabase(): void {
  removeItem(PROFILE_KEY)
  removeItem(SESSION_UNLOCKED_KEY)
  removeItem(SAVED_TRIPS_KEY)
  dispatchSync()
}

/**
 * Export local database backup as JSON string
 */
export function exportLocalDatabaseBackup(): string {
  const profile = getLocalProfile()
  const trips = getSavedTrips()
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      trips,
    },
    null,
    2
  )
}

/**
 * React hook to reactively subscribe to profile and saved progress
 */
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() => getLocalProfile())
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => isProfileUnlocked())
  const [savedTrips, setSavedTrips] = useState<SavedTripProgress[]>(() => getSavedTrips())

  useEffect(() => {
    function handleSync() {
      setProfile(getLocalProfile())
      setIsUnlocked(isProfileUnlocked())
      setSavedTrips(getSavedTrips())
    }

    window.addEventListener(PROFILE_SYNC_EVENT, handleSync)
    window.addEventListener('storage', handleSync)

    return () => {
      window.removeEventListener(PROFILE_SYNC_EVENT, handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  return {
    profile,
    isUnlocked,
    savedTrips,
    hasProfile: !!profile,
    unlock: unlockLocalProfile,
    lock: lockLocalProfile,
    createProfile: createLocalProfile,
    updateProfile: updateLocalProfile,
    saveTrip: saveTripProgress,
    deleteTrip: deleteSavedTrip,
    clearAll: clearLocalDatabase,
    exportBackup: exportLocalDatabaseBackup,
  }
}

/**
 * Safe LocalStorage layer for HOMI
 * Handles bookmarks, saved itineraries, and user preferences with fallbacks.
 */

import { useState, useEffect } from 'react'

const SAVED_PLACES_KEY = 'homi_saved_places_v1'
const PLANNER_DRAFT_KEY = 'homi_planner_draft_v1'

// Custom event to sync across tabs/components
const STORAGE_SYNC_EVENT = 'homi_storage_change'

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const testKey = '__homi_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

// In-memory fallback if localStorage is blocked by user privacy settings
let memoryStorage: Record<string, string> = {}

export function getSavedPlaceIds(): string[] {
  if (isStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(SAVED_PLACES_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  try {
    const raw = memoryStorage[SAVED_PLACES_KEY]
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePlaceId(id: string): boolean {
  const current = getSavedPlaceIds()
  if (current.includes(id)) return false
  const updated = [...current, id]
  
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated))
    } catch {
      memoryStorage[SAVED_PLACES_KEY] = JSON.stringify(updated)
    }
  } else {
    memoryStorage[SAVED_PLACES_KEY] = JSON.stringify(updated)
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_SYNC_EVENT, { detail: { key: SAVED_PLACES_KEY, data: updated } }))
  }
  return true
}

export function removeSavedPlaceId(id: string): boolean {
  const current = getSavedPlaceIds()
  const updated = current.filter((item) => item !== id)
  
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated))
    } catch {
      memoryStorage[SAVED_PLACES_KEY] = JSON.stringify(updated)
    }
  } else {
    memoryStorage[SAVED_PLACES_KEY] = JSON.stringify(updated)
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_SYNC_EVENT, { detail: { key: SAVED_PLACES_KEY, data: updated } }))
  }
  return true
}

export function toggleSavePlaceId(id: string): boolean {
  const current = getSavedPlaceIds()
  if (current.includes(id)) {
    removeSavedPlaceId(id)
    return false
  } else {
    savePlaceId(id)
    return true
  }
}

export function useSavedPlaces() {
  const [savedIds, setSavedIds] = useState<string[]>(() => getSavedPlaceIds())

  useEffect(() => {
    function handleChange(e: Event) {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.key === SAVED_PLACES_KEY) {
        setSavedIds(customEvent.detail.data || getSavedPlaceIds())
      }
    }

    window.addEventListener(STORAGE_SYNC_EVENT, handleChange)
    window.addEventListener('storage', handleChange)

    return () => {
      window.removeEventListener(STORAGE_SYNC_EVENT, handleChange)
      window.removeEventListener('storage', handleChange)
    }
  }, [])

  return {
    savedIds,
    isSaved: (id: string) => savedIds.includes(id),
    toggleSave: (id: string) => toggleSavePlaceId(id),
    removeSave: (id: string) => removeSavedPlaceId(id),
    count: savedIds.length,
  }
}

export function savePlannerDraft(draft: unknown): void {
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(PLANNER_DRAFT_KEY, JSON.stringify(draft))
    } catch {
      // Ignored
    }
  }
}

export function getPlannerDraft<T>(): T | null {
  if (isStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(PLANNER_DRAFT_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }
  return null
}

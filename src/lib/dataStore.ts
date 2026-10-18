/**
 * HOMI Dynamic Reactive Data Store
 * Powers both User Board and Admin Board.
 * Automatically synchronizes changes via localStorage and window events.
 */

import { useState, useEffect, useCallback } from 'react'
import type { CityInfo, Place, LocalDish } from '../data/types'
import { CITIES as SEED_CITIES } from '../data/cities'
import { PLACES as SEED_PLACES } from '../data/places'
import { LOCAL_DISHES as SEED_DISHES } from '../data/dishes'

const CITIES_STORAGE_KEY = 'homi_custom_cities_v2'
const PLACES_STORAGE_KEY = 'homi_custom_places_v2'
const DISHES_STORAGE_KEY = 'homi_custom_dishes_v2'
export const DATASTORE_CHANGE_EVENT = 'homi_datastore_updated'

function safeLocalStorageGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeLocalStorageSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('LocalStorage write error:', err)
  }
}

function notifyDataStoreChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATASTORE_CHANGE_EVENT))
  }
}

// In-memory cache
let cachedCities: Record<string, CityInfo> | null = null
let cachedPlaces: Place[] | null = null
let cachedDishes: LocalDish[] | null = null

export function getCities(): Record<string, CityInfo> {
  if (cachedCities) return cachedCities
  const stored = safeLocalStorageGet<Record<string, CityInfo> | null>(CITIES_STORAGE_KEY, null)
  if (stored && Object.keys(stored).length > 0) {
    cachedCities = stored
    return stored
  }
  // Deep copy seed cities so mutations do not dirty reference
  cachedCities = JSON.parse(JSON.stringify(SEED_CITIES))
  return cachedCities!
}

export function getCity(id: string): CityInfo | undefined {
  const all = getCities()
  return all[id.toLowerCase()]
}

export function getPlaces(): Place[] {
  if (cachedPlaces) return cachedPlaces
  const stored = safeLocalStorageGet<Place[] | null>(PLACES_STORAGE_KEY, null)
  if (stored && stored.length > 0) {
    cachedPlaces = stored
    return stored
  }
  cachedPlaces = JSON.parse(JSON.stringify(SEED_PLACES))
  return cachedPlaces!
}

export function getDishes(): LocalDish[] {
  if (cachedDishes) return cachedDishes
  const stored = safeLocalStorageGet<LocalDish[] | null>(DISHES_STORAGE_KEY, null)
  if (stored && stored.length > 0) {
    cachedDishes = stored
    return stored
  }
  cachedDishes = JSON.parse(JSON.stringify(SEED_DISHES))
  return cachedDishes!
}

// Admin Mutators
export function saveCities(cities: Record<string, CityInfo>): void {
  cachedCities = cities
  safeLocalStorageSet(CITIES_STORAGE_KEY, cities)
  notifyDataStoreChange()
}

export function addCity(city: CityInfo): void {
  const current = { ...getCities() }
  const cityKey = city.id.toLowerCase()
  current[cityKey] = city
  saveCities(current)
}

export function updateCity(cityId: string, updates: Partial<CityInfo>): void {
  const current = { ...getCities() }
  const key = cityId.toLowerCase()
  if (current[key]) {
    current[key] = { ...current[key], ...updates }
    saveCities(current)
  }
}

export function deleteCity(cityId: string): void {
  const current = { ...getCities() }
  const key = cityId.toLowerCase()
  delete current[key]
  saveCities(current)
}

export function savePlaces(places: Place[]): void {
  cachedPlaces = places
  safeLocalStorageSet(PLACES_STORAGE_KEY, places)
  notifyDataStoreChange()
}

export function addPlace(place: Place): void {
  const current = [...getPlaces()]
  // Prevent duplicate ID or slug
  const filtered = current.filter((p) => p.id !== place.id && p.slug !== place.slug)
  filtered.push(place)
  savePlaces(filtered)
}

export function updatePlace(placeId: string, updates: Partial<Place>): void {
  const current = getPlaces().map((p) => (p.id === placeId ? { ...p, ...updates } : p))
  savePlaces(current)
}

export function deletePlace(placeId: string): void {
  const current = getPlaces().filter((p) => p.id !== placeId)
  savePlaces(current)
}

export function saveDishes(dishes: LocalDish[]): void {
  cachedDishes = dishes
  safeLocalStorageSet(DISHES_STORAGE_KEY, dishes)
  notifyDataStoreChange()
}

export function addDish(dish: LocalDish): void {
  const current = [...getDishes()]
  const filtered = current.filter((d) => d.id !== dish.id)
  filtered.push(dish)
  saveDishes(filtered)
}

export function updateDish(dishId: string, updates: Partial<LocalDish>): void {
  const current = getDishes().map((d) => (d.id === dishId ? { ...d, ...updates } : d))
  saveDishes(current)
}

export function deleteDish(dishId: string): void {
  const current = getDishes().filter((d) => d.id !== dishId)
  saveDishes(current)
}

export function resetToFactoryDefaults(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CITIES_STORAGE_KEY)
    window.localStorage.removeItem(PLACES_STORAGE_KEY)
    window.localStorage.removeItem(DISHES_STORAGE_KEY)
  }
  cachedCities = null
  cachedPlaces = null
  cachedDishes = null
  notifyDataStoreChange()
}

export function exportFullDatabase(): string {
  const payload = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    cities: getCities(),
    places: getPlaces(),
    dishes: getDishes(),
  }
  return JSON.stringify(payload, null, 2)
}

export function importFullDatabase(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString)
    if (parsed.cities && parsed.places && parsed.dishes) {
      saveCities(parsed.cities)
      savePlaces(parsed.places)
      saveDishes(parsed.dishes)
      return true
    }
    return false
  } catch {
    return false
  }
}

/**
 * React Hook for real-time reactivity in components
 */
export function useAppData() {
  const [, setTick] = useState(0)

  const reload = useCallback(() => {
    cachedCities = null
    cachedPlaces = null
    cachedDishes = null
    setTick((t) => t + 1)
  }, [])

  useEffect(() => {
    window.addEventListener(DATASTORE_CHANGE_EVENT, reload)
    window.addEventListener('storage', reload)
    return () => {
      window.removeEventListener(DATASTORE_CHANGE_EVENT, reload)
      window.removeEventListener('storage', reload)
    }
  }, [reload])

  return {
    cities: getCities(),
    places: getPlaces(),
    dishes: getDishes(),
    refresh: reload,
  }
}

import React, { useState, useRef, useEffect } from 'react'
import { PLACES } from '../data/places'
import { LOCAL_DISHES } from '../data/dishes'
import { useRouter } from '../lib/routerContext'

import { Search, MapPin, Utensils, X, ArrowRight } from 'lucide-react'

export const SearchBar: React.FC<{ placeholder?: string; autoFocus?: boolean }> = ({
  placeholder = 'Search Jaipur, Udaipur, Manali, Varanasi, Mussoorie, Amer Fort, Pichola, Siddu...',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { navigate } = useRouter()

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const trimmed = query.trim().toLowerCase()

  // Matching Cities
  const matchingCities = [
    { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', href: '/jaipur' },
    { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', href: '/udaipur' },
    { id: 'manali', name: 'Manali', state: 'Himachal Pradesh', href: '/manali' },
    { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', href: '/varanasi' },
    { id: 'mussoorie', name: 'Mussoorie', state: 'Uttarakhand', href: '/mussoorie' },
  ].filter(
    (c) =>
      trimmed.length > 0 &&
      (c.name.toLowerCase().includes(trimmed) || c.state.toLowerCase().includes(trimmed))
  )


  // Matching Places
  const matchingPlaces =
    trimmed.length > 0
      ? PLACES.filter(
          (p) =>
            p.name.toLowerCase().includes(trimmed) ||
            p.shortDescription.toLowerCase().includes(trimmed) ||
            p.address.toLowerCase().includes(trimmed) ||
            p.tags.some((t) => t.toLowerCase().includes(trimmed)) ||
            (p.hindiName && p.hindiName.includes(trimmed))
        ).slice(0, 6)
      : []

  // Matching Foods
  const matchingFoods =
    trimmed.length > 0
      ? LOCAL_DISHES.filter(
          (d) =>
            d.name.toLowerCase().includes(trimmed) ||
            d.description.toLowerCase().includes(trimmed) ||
            d.iconicSpotName.toLowerCase().includes(trimmed) ||
            d.spotNeighborhood.toLowerCase().includes(trimmed)
        ).slice(0, 4)
      : []

  const hasResults =
    matchingCities.length > 0 || matchingPlaces.length > 0 || matchingFoods.length > 0

  const handleSelect = (url: string) => {
    navigate(url)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <label htmlFor="homi-search-input" className="sr-only">
          Search cities, attractions, and local food
        </label>
        <div className="absolute left-4 pointer-events-none text-[#7D736A]">
          <Search className="w-5 h-5" />
        </div>
        <input
          id="homi-search-input"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-10 py-3.5 sm:py-4 bg-white border border-[#DDD3C5] focus:border-[#8C2D19] rounded-2xl shadow-sm text-[#201C1A] text-sm sm:text-base placeholder-[#8A8177] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/20 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 p-1 text-[#8A8177] hover:text-[#201C1A] rounded-full"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Instant Search Results Dropdown */}
      {isOpen && trimmed.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E5DACB] rounded-2xl shadow-xl overflow-hidden z-50 max-h-[75vh] overflow-y-auto">
          {!hasResults ? (
            <div className="p-6 text-center text-[#7D736A]">
              <p className="text-sm font-medium">No direct match for “{query}”</p>
              <p className="text-xs mt-1 text-[#9D9388]">
                Try searching for “Delhi”, “Jaipur”, “Amer Fort”, “Stepwell”, or “Kachori”.
              </p>
            </div>
          ) : (
            <div className="py-2 divide-y divide-[#F2ECE1]">
              {/* Cities */}
              {matchingCities.length > 0 && (
                <div className="px-3 py-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A8177] px-2 mb-1">
                    Destination Cities
                  </div>
                  {matchingCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelect(city.href)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F9F6F0] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#8C2D19]" />
                        <span className="text-sm font-semibold text-[#201C1A] group-hover:text-[#8C2D19]">
                          {city.name}
                        </span>
                        <span className="text-xs text-[#7D736A]">{city.state}</span>
                      </div>
                      <span className="text-xs text-[#8C2D19] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Places */}
              {matchingPlaces.length > 0 && (
                <div className="px-3 py-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A8177] px-2 mb-1">
                    Attractions & Experiences ({matchingPlaces.length})
                  </div>
                  {matchingPlaces.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => handleSelect(`/places/${place.slug}`)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#F9F6F0] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={place.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <div className="text-sm font-semibold text-[#201C1A] group-hover:text-[#8C2D19]">
                            {place.name}
                          </div>
                          <div className="text-xs text-[#7D736A] line-clamp-1">
                            {place.cityId === 'delhi' ? 'Delhi' : 'Jaipur'} • {place.shortDescription}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#F2ECE1] text-[#6E665E] font-medium capitalize flex-shrink-0 ml-2">
                        {place.category.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Food */}
              {matchingFoods.length > 0 && (
                <div className="px-3 py-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A8177] px-2 mb-1">
                    Local Food & Dishes
                  </div>
                  {matchingFoods.map((dish) => (
                    <button
                      key={dish.id}
                      onClick={() => handleSelect(`/${dish.cityId}`)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F9F6F0] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Utensils className="w-4 h-4 text-[#D97706]" />
                        <div>
                          <span className="text-sm font-medium text-[#201C1A] group-hover:text-[#8C2D19]">
                            {dish.name}
                          </span>
                          <span className="text-xs text-[#7D736A] block">
                            At {dish.iconicSpotName} ({dish.cityId === 'delhi' ? 'Delhi' : 'Jaipur'}) • ₹{dish.approxPriceInr}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

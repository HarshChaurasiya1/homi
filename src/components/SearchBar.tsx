import React, { useState, useRef, useEffect } from 'react'
import { useAppData } from '../lib/dataStore'
import { useRouter } from '../lib/routerContext'
import { Search, MapPin, Utensils, X, ArrowRight } from 'lucide-react'

export const SearchBar: React.FC<{ placeholder?: string; autoFocus?: boolean }> = ({
  placeholder = 'Search destinations, places, dishes, or local companions...',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { navigate } = useRouter()
  const { cities, places, dishes } = useAppData()

  const cityList = Object.values(cities)

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
  const matchingCities =
    trimmed.length > 0
      ? cityList
          .filter(
            (c) =>
              c.name.toLowerCase().includes(trimmed) ||
              c.state.toLowerCase().includes(trimmed) ||
              (c.hindiName && c.hindiName.includes(trimmed)) ||
              (c.persona?.name && c.persona.name.toLowerCase().includes(trimmed))
          )
          .slice(0, 4)
      : []

  // Matching Places
  const matchingPlaces =
    trimmed.length > 0
      ? places
          .filter(
            (p) =>
              p.name.toLowerCase().includes(trimmed) ||
              p.shortDescription.toLowerCase().includes(trimmed) ||
              p.address.toLowerCase().includes(trimmed) ||
              p.tags.some((t) => t.toLowerCase().includes(trimmed)) ||
              (p.hindiName && p.hindiName.includes(trimmed))
          )
          .slice(0, 6)
      : []

  // Matching Foods
  const matchingFoods =
    trimmed.length > 0
      ? dishes
          .filter(
            (d) =>
              d.name.toLowerCase().includes(trimmed) ||
              d.description.toLowerCase().includes(trimmed) ||
              d.iconicSpotName.toLowerCase().includes(trimmed) ||
              d.spotNeighborhood.toLowerCase().includes(trimmed)
          )
          .slice(0, 4)
      : []

  const totalResults = matchingCities.length + matchingPlaces.length + matchingFoods.length

  const handleSelect = (url: string) => {
    setIsOpen(false)
    setQuery('')
    navigate(url)
  }

  return (
    <div ref={containerRef} className="relative w-full text-left">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8C2D19]">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-[#D5C9BC] rounded-2xl text-sm sm:text-base text-[#201C1A] placeholder-[#8A8177] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30 focus:border-[#8C2D19] transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A8177] hover:text-[#201C1A]"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && trimmed.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5DACB] rounded-2xl shadow-xl z-50 max-h-[75vh] overflow-y-auto overflow-x-hidden divide-y divide-[#F2ECE1]">
          {totalResults === 0 ? (
            <div className="p-6 text-center text-xs text-[#8A8177]">
              No places or regional dishes found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <>
              {/* City Results */}
              {matchingCities.length > 0 && (
                <div className="p-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19] px-3 py-1 block">
                    Destinations
                  </span>
                  {matchingCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelect(`/${city.id}`)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#8C2D19] flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-[#201C1A] group-hover:text-[#8C2D19]">
                            {city.name} ({city.hindiName || city.state})
                          </div>
                          <span className="text-xs text-[#7A7167]">
                            Companion: {city.persona?.name || 'Local Guide'}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8A8177] group-hover:text-[#8C2D19] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              )}

              {/* Places Results */}
              {matchingPlaces.length > 0 && (
                <div className="p-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19] px-3 py-1 block">
                    Curated Places & Monuments
                  </span>
                  {matchingPlaces.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => handleSelect(`/places/${place.slug}`)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="text-sm font-semibold text-[#201C1A] group-hover:text-[#8C2D19]">
                            {place.name}
                          </div>
                          <span className="text-xs text-[#7A7167]">
                            {place.cityId.toUpperCase()} • {place.shortDescription.slice(0, 50)}...
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8A8177] group-hover:text-[#8C2D19] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              )}

              {/* Food Results */}
              {matchingFoods.length > 0 && (
                <div className="p-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] px-3 py-1 block">
                    Local Food & Legendary Spots
                  </span>
                  {matchingFoods.map((dish) => (
                    <button
                      key={dish.id}
                      onClick={() => handleSelect(`/${dish.cityId}`)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Utensils className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-[#201C1A]">
                            {dish.name}
                          </div>
                          <span className="text-xs text-[#7A7167]">
                            {dish.cityId.toUpperCase()} • {dish.iconicSpotName} (₹{dish.approxPriceInr})
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8A8177] group-hover:text-[#D97706] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

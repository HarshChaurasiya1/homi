import React from 'react'
import { useAppData } from '../lib/dataStore'
import { useSavedPlaces } from '../lib/storage'
import { PlaceCard } from '../components/PlaceCard'
import { Link } from '../lib/router'
import { Bookmark, Heart, Calendar, ArrowRight } from 'lucide-react'

export const SavedPlacesPage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  const { savedIds, count } = useSavedPlaces()
  const { places, cities } = useAppData()

  const cityList = Object.values(cities)
  const savedPlaces = places.filter((p) => savedIds.includes(p.id))

  const cityColors: Record<string, string> = {
    jaipur: '#C85A32',
    udaipur: '#1B4965',
    manali: '#1E4620',
    varanasi: '#9B2226',
    mussoorie: '#2E4057',
    delhi: '#8C2D19',
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Header */}
      <section className="bg-white border-b border-[#E8DFD3] pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C2D19] mb-1">
              <Bookmark className="w-3.5 h-3.5 fill-[#8C2D19]" />
              <span>Personal Collection</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
              Saved Places & Bookmarks
            </h1>
            <p className="text-xs sm:text-sm text-[#645C55] mt-1">
              Stored privately in your browser. No account or login required.
            </p>
          </div>

          {count > 0 && (
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#201C1A] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-colors shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Generate Itinerary with Saved ({count})</span>
            </Link>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {count === 0 ? (
          /* Thoughtful Empty State */
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#E5DACB] text-center max-w-xl mx-auto shadow-xs my-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F5EFE6] text-[#8C2D19] flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>

            <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
              Your bookmark collection is empty
            </h2>

            <p className="text-xs sm:text-sm text-[#665D54] leading-relaxed max-w-md mx-auto">
              As you browse Jaipur, Udaipur, Manali, Varanasi, or Mussoorie, tap the bookmark icon on any attraction or neighborhood to keep it handy.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {cityList.slice(0, 5).map((city) => (
                <Link
                  key={city.id}
                  to={`/${city.id}`}
                  className="px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-xs transition-transform hover:scale-103"
                  style={{ backgroundColor: cityColors[city.id] || '#201C1A' }}
                >
                  Explore {city.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {cityList.map((city) => {
              const citySaved = savedPlaces.filter((p) => p.cityId.toLowerCase() === city.id.toLowerCase())
              if (citySaved.length === 0) return null
              const color = cityColors[city.id] || '#8C2D19'

              return (
                <section key={city.id}>
                  <div className="flex items-center justify-between mb-4 border-b border-[#EAE1D5] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                      <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#201C1A]">
                        {city.name} Saved Places ({citySaved.length})
                      </h2>
                    </div>
                    <Link
                      to={`/${city.id}`}
                      className="text-xs font-semibold hover:underline flex items-center gap-1"
                      style={{ color }}
                    >
                      <span>Browse all {city.name}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {citySaved.map((place) => (
                      <PlaceCard key={place.id} place={place} onSaveToast={onSaveToast} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

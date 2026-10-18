import React from 'react'
import { PLACES } from '../data/places'
import { useSavedPlaces } from '../lib/storage'
import { PlaceCard } from '../components/PlaceCard'
import { Link } from '../lib/router'
import { Bookmark, Heart, Calendar } from 'lucide-react'


export const SavedPlacesPage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  const { savedIds, count } = useSavedPlaces()

  const savedPlaces = PLACES.filter((p) => savedIds.includes(p.id))
  const delhiSaved = savedPlaces.filter((p) => p.cityId === 'delhi')
  const jaipurSaved = savedPlaces.filter((p) => p.cityId === 'jaipur')

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
              <span>Generate Itinerary with Saved</span>
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
              As you browse Delhi and Jaipur, tap the bookmark icon on any attraction or neighborhood to keep it handy for your upcoming trip.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/delhi"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8C2D19] text-white text-xs sm:text-sm font-semibold hover:bg-[#722312] transition-colors"
              >
                Explore Delhi (10 places)
              </Link>
              <Link
                to="/jaipur"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C85A32] text-white text-xs sm:text-sm font-semibold hover:bg-[#AB4B27] transition-colors"
              >
                Explore Jaipur (10 places)
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Delhi Saved Group */}
            {delhiSaved.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4 border-b border-[#EAE1D5] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8C2D19]"></span>
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#201C1A]">
                      Delhi Saved Places ({delhiSaved.length})
                    </h2>
                  </div>
                  <Link to="/delhi" className="text-xs font-semibold text-[#8C2D19] hover:underline">
                    Browse all Delhi
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {delhiSaved.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onSaveToast={onSaveToast}
                      themeColor="#8C2D19"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Jaipur Saved Group */}
            {jaipurSaved.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4 border-b border-[#EAE1D5] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C85A32]"></span>
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#201C1A]">
                      Jaipur Saved Places ({jaipurSaved.length})
                    </h2>
                  </div>
                  <Link to="/jaipur" className="text-xs font-semibold text-[#C85A32] hover:underline">
                    Browse all Jaipur
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jaipurSaved.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onSaveToast={onSaveToast}
                      themeColor="#C85A32"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

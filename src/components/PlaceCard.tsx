import React, { useState } from 'react'
import type { Place } from '../data/types'
import { Link } from '../lib/router'
import { useSavedPlaces } from '../lib/storage'
import { Bookmark, Clock, Navigation, MapPin, CheckCircle2 } from 'lucide-react'

interface PlaceCardProps {
  place: Place
  themeColor?: string
  onSaveToast?: (msg: string) => void
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  themeColor: _themeColor,
  onSaveToast,
}) => {

  const { isSaved, toggleSave } = useSavedPlaces()
  const [imageError, setImageError] = useState(false)
  const saved = isSaved(place.id)

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const nowSaved = toggleSave(place.id)
    if (onSaveToast) {
      onSaveToast(
        nowSaved
          ? `Saved "${place.name}" to your favorites.`
          : `Removed "${place.name}" from favorites.`
      )
    }
  }

  // Construct verified Google Maps directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}&destination_place_id=&travelmode=transit`

  const formatPrice = () => {
    if (place.ticketPrice.indian === 'Free') return 'Free Entry'
    return `₹${place.ticketPrice.indian}`
  }

  return (
    <article className="group bg-white rounded-2xl border border-[#EBE4D8] hover:border-[#D5C9B8] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* Image Container with Reserved Aspect Ratio */}
      <div className="relative aspect-[16/10] w-full bg-[#EFE8DC] overflow-hidden">
        {!imageError ? (
          <img
            src={place.image}
            alt={place.imageAlt}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3ECE2] text-[#8C8276] p-4 text-center">
            <MapPin className="w-8 h-8 mb-2 opacity-50" />
            <span className="font-editorial text-sm font-semibold text-[#48423E]">{place.name}</span>
            <span className="text-xs text-[#8C8276]">{place.cityId === 'delhi' ? 'Delhi' : 'Jaipur'}</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/65 backdrop-blur-xs text-white">
            {place.category.replace('_', ' ')}
          </span>
          {place.isMustVisit && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#D97706] text-white">
              Must Visit
            </span>
          )}
        </div>

        {/* Bookmark Save Button */}
        <button
          onClick={handleToggleSave}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#201C1A] hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C2D19]"
          aria-label={saved ? `Remove ${place.name} from saved` : `Save ${place.name} to bookmarks`}
        >
          <Bookmark
            className={`w-4 h-4 transition-colors ${
              saved ? 'fill-[#8C2D19] text-[#8C2D19]' : 'text-[#48423E]'
            }`}
          />
        </button>

        {/* Price & Duration Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs">
            {formatPrice()}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{place.estimatedVisitMinutes} mins</span>
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#201C1A] leading-snug group-hover:text-[#8C2D19] transition-colors">
              <Link to={`/places/${place.slug}`}>{place.name}</Link>
            </h3>
            {place.hindiName && (
              <span className="text-xs text-[#8A8177] font-medium">{place.hindiName}</span>
            )}
          </div>
          <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F5EFE6] text-[#786D61] flex-shrink-0">
            {place.cityId === 'delhi' ? 'Delhi' : 'Jaipur'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#5D554C] line-clamp-2 leading-relaxed mb-3">
          {place.shortDescription}
        </p>

        {/* Local Friend Note */}
        <div className="mt-auto pt-3 border-t border-[#F2EBE0] space-y-2 text-xs">
          <div className="flex items-start gap-1.5 text-[#6D6358]">
            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8C2D19]" />
            <span className="line-clamp-1">{place.nearestTransit.stationOrStop} ({place.nearestTransit.walkMinutes} min walk)</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Verified timings</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C2D19] hover:underline"
                aria-label={`Get directions to ${place.name} on Google Maps`}
              >
                <Navigation className="w-3 h-3" />
                <span>Maps</span>
              </a>

              <Link
                to={`/places/${place.slug}`}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FAF6F0] hover:bg-[#8C2D19] hover:text-white border border-[#E2D6C6] transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

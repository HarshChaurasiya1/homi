import React, { useState } from 'react'
import { useAppData } from '../lib/dataStore'
import { Link } from '../lib/router'
import { useSavedPlaces } from '../lib/storage'
import {
  MapPin,
  Clock,
  Ticket,
  Calendar,
  Navigation,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Users,
  Compass,
} from 'lucide-react'

interface PlaceDetailPageProps {
  slug: string
  onSaveToast: (msg: string) => void
}

export const PlaceDetailPage: React.FC<PlaceDetailPageProps> = ({ slug, onSaveToast }) => {
  const { isSaved, toggleSave } = useSavedPlaces()
  const { places } = useAppData()
  const [imageError, setImageError] = useState(false)

  const place = places.find((p) => p.slug === slug)

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-editorial text-3xl font-bold text-[#201C1A]">Place Not Found</h1>
        <p className="text-sm text-stone-600 mt-2">
          We couldn't locate this specific attraction in our curated catalog.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-[#201C1A] text-white text-sm font-semibold hover:bg-black transition-colors"
        >
          Back to Discover
        </Link>
      </div>
    )
  }

  const isDelhi = place.cityId === 'delhi'
  const primaryColor = isDelhi ? '#8C2D19' : '#C85A32'
  const saved = isSaved(place.id)


  const handleToggleSave = () => {
    const nowSaved = toggleSave(place.id)
    onSaveToast(
      nowSaved
        ? `Added "${place.name}" to your saved places.`
        : `Removed "${place.name}" from saved places.`
    )
  }

  // Google Maps verified direct directions link
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}&destination_place_id=&travelmode=transit`

  const formatTicket = () => {
    if (place.ticketPrice.indian === 'Free') {
      return (
        <div>
          <span className="text-emerald-700 font-bold text-lg">Free Entry</span>
          {place.ticketPrice.foreigner !== 'Free' && (
            <span className="text-xs text-[#7A7167] block">
              (₹{place.ticketPrice.foreigner} for international visitors)
            </span>
          )}
        </div>
      )
    }
    return (
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-[#201C1A]">₹{place.ticketPrice.indian}</span>
          <span className="text-xs text-[#7A7167]">Indian nationals</span>
        </div>
        <div className="text-xs text-[#7A7167]">
          Foreign nationals: <strong className="text-[#201C1A]">₹{place.ticketPrice.foreigner}</strong>
          {place.ticketPrice.student !== undefined && (
            <span> • Student ID: ₹{place.ticketPrice.student}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDelhi ? 'theme-delhi bg-[#F9F6F0]' : 'theme-jaipur bg-[#FCF7F4]'} pb-20`}>
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-[#E5DACB] bg-white/70 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#7D736A]">
            <Link to="/" className="hover:text-[#201C1A]">Home</Link>
            <span>/</span>
            <Link to={`/${place.cityId}`} className="hover:text-[#201C1A] capitalize font-medium">
              {place.cityId}
            </Link>
            <span>/</span>
            <span className="text-[#201C1A] font-semibold truncate max-w-[180px] sm:max-w-none">
              {place.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                saved
                  ? 'bg-[#8C2D19] text-white'
                  : 'bg-white border border-[#DDD3C5] text-[#201C1A] hover:bg-[#F5EFE6]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
              <span>{saved ? 'Saved' : 'Save Place'}</span>
            </button>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#201C1A] text-white hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Get Directions</span>
              <span className="sm:hidden">Maps</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Image with Reserved Aspect Ratio */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden border border-[#E5DACB] shadow-sm bg-[#EFE8DC]">
              {!imageError ? (
                <img
                  src={place.image}
                  alt={place.imageAlt}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3ECE2] text-[#8C8276] p-4 text-center">
                  <MapPin className="w-12 h-12 mb-2 opacity-50" />
                  <span className="font-editorial text-lg font-semibold text-[#48423E]">{place.name}</span>
                </div>
              )}

              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur-xs text-white">
                  {place.category.replace('_', ' ')}
                </span>
                {place.isMustVisit && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D97706] text-white">
                    Must Visit
                  </span>
                )}
              </div>
            </div>

            {/* Title & Introduction */}
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                  {place.name}
                </h1>
                {place.hindiName && (
                  <span className="font-editorial text-xl text-[#8C8276] font-medium">
                    ({place.hindiName})
                  </span>
                )}
              </div>

              <p className="font-editorial text-lg text-[#4A423B] mt-2 italic">
                {place.shortDescription}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {place.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs bg-white border border-[#E5DACB] text-[#6E645A]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Why It's Worth Visiting (Local Friend Perspective) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5DACB] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                <Compass className="w-4 h-4" />
                <span>Why It’s Worth Visiting</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#201C1A] leading-relaxed">
                “{place.whyWorthVisiting}”
              </p>
            </div>

            {/* Comprehensive Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                Historical & Cultural Context
              </h2>
              <p className="text-sm sm:text-base text-[#48423E] leading-relaxed">
                {place.description}
              </p>
            </div>

            {/* Practical Visitor Tips */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-4">
              <h2 className="font-editorial text-xl font-bold text-[#201C1A] flex items-center gap-2">
                <span>Local Tips for Visitors</span>
              </h2>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#48423E]">
                {place.visitorTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C2D19] mt-2 flex-shrink-0"></span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Public Transport & How to Reach */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-4">
              <h2 className="font-editorial text-xl font-bold text-[#201C1A]">
                How to Reach via Public Transport
              </h2>

              <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EFE7DA] space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-[#201C1A] font-bold">
                  <MapPin className="w-4 h-4 text-[#8C2D19]" />
                  <span>Nearest Station: {place.nearestTransit.stationOrStop}</span>
                </div>

                <div className="text-[#645C55] space-y-1 pl-6">
                  {place.nearestTransit.lineOrRoute && (
                    <p>Line / Route: <strong className="text-[#201C1A]">{place.nearestTransit.lineOrRoute}</strong></p>
                  )}
                  {place.nearestTransit.exitGate && (
                    <p>Exit Gate: <strong className="text-[#201C1A]">{place.nearestTransit.exitGate}</strong></p>
                  )}
                  <p>Estimated walk: <strong className="text-[#201C1A]">{place.nearestTransit.walkMinutes} minutes</strong></p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5D554C] leading-relaxed">
                {place.transportNotes}
              </p>

              <div className="pt-2">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#201C1A] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Route in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Practical Info Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E5DACB] shadow-xs space-y-5 sticky top-20">
              <h2 className="font-editorial text-lg font-bold text-[#201C1A] border-b border-[#F2ECE1] pb-3">
                Practical Travel Facts
              </h2>

              {/* Opening Hours */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#8C8276] font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Opening Hours</span>
                </div>
                <p className="text-sm font-bold text-[#201C1A]">{place.openingHours}</p>
                {place.closedDays && (
                  <p className="text-xs text-[#A83824] font-medium">{place.closedDays}</p>
                )}
              </div>

              {/* Ticket Price */}
              <div className="space-y-1 pt-2 border-t border-[#F2ECE1]">
                <div className="flex items-center gap-1.5 text-xs text-[#8C8276] font-medium">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Entry Fee / Tariffs</span>
                </div>
                {formatTicket()}
                {place.ticketPrice.note && (
                  <p className="text-[11px] text-[#7A7167] mt-1 leading-snug">
                    {place.ticketPrice.note}
                  </p>
                )}
              </div>

              {/* Duration & Best Time */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F2ECE1] text-xs">
                <div>
                  <span className="text-[#8C8276] block">Visit Duration</span>
                  <strong className="text-[#201C1A]">{place.estimatedVisitMinutes} Minutes</strong>
                </div>
                <div>
                  <span className="text-[#8C8276] block">Best Window</span>
                  <strong className="text-[#201C1A]">{place.bestTimeToVisit}</strong>
                </div>
              </div>

              {/* Suitable For */}
              <div className="space-y-1 pt-2 border-t border-[#F2ECE1]">
                <div className="flex items-center gap-1.5 text-xs text-[#8C8276] font-medium">
                  <Users className="w-3.5 h-3.5" />
                  <span>Recommended For</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {place.visitorSuitability.map((suit) => (
                    <span
                      key={suit}
                      className="px-2 py-0.5 rounded text-[11px] bg-[#F5EFE6] text-[#6E645A] font-medium"
                    >
                      {suit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exact Address */}
              <div className="space-y-1 pt-2 border-t border-[#F2ECE1]">
                <span className="text-xs text-[#8C8276] font-medium block">Exact Address</span>
                <p className="text-xs text-[#48423E] leading-relaxed">{place.address}</p>
              </div>

              {/* Source Verification Badge */}
              <div className="p-3 rounded-xl bg-[#F9F7F3] border border-[#EBE4D8] text-[11px] text-[#6D6358] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Verified Information</span>
                </div>
                <p>
                  Cross-referenced on <strong>{place.lastVerifiedAt}</strong> via official records.
                </p>
                <a
                  href={place.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8C2D19] hover:underline flex items-center gap-1 pt-0.5"
                >
                  <span>Official Authority Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  to="/planner"
                  className="w-full py-3 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Include in Trip Itinerary</span>
                </Link>

                <button
                  onClick={handleToggleSave}
                  className="w-full py-2.5 rounded-xl bg-white border border-[#DDD3C5] hover:bg-[#F9F6F0] text-[#201C1A] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#8C2D19] text-[#8C2D19]' : ''}`} />
                  <span>{saved ? 'Saved in Favourites' : 'Save to Favourites'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import {
  CITY_HOTELS,
  type HotelRecommendation,
  type HotelTier,
} from '../data/hotels'
import {
  Building2,
  MapPin,
  Star,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Search,
  Sparkles,
  Lock,
  Compass,
} from 'lucide-react'

const EMPTY_HOTELS: HotelRecommendation[] = []

interface CityHotelRecommendationsProps {
  cityId: string
  cityName?: string
}

export const CityHotelRecommendations: React.FC<CityHotelRecommendationsProps> = ({
  cityId,
  cityName,
}) => {
  const normKey = cityId.toLowerCase().trim()
  const allHotels = CITY_HOTELS[normKey] || EMPTY_HOTELS
  const displayName = cityName || cityId.charAt(0).toUpperCase() + cityId.slice(1)

  const [selectedTier, setSelectedTier] = useState<HotelTier | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const tierFilters = [
    { id: 'all', label: `All Stays (${allHotels.length})` },
    { id: 'backpacker', label: '🎒 Backpacker Hostels (₹650–₹1,200)' },
    { id: 'boutique', label: '🏰 Boutique & Heritage Havelis (₹3,800–₹12,500)' },
    { id: 'luxury', label: '👑 Luxury Palaces & Resorts (₹12,000+)' },
  ]

  const filteredHotels = useMemo(() => {
    return allHotels.filter((hotel) => {
      const matchesTier = selectedTier === 'all' || hotel.tier === selectedTier
      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesTier

      const matchesSearch =
        hotel.name.toLowerCase().includes(query) ||
        hotel.neighborhood.toLowerCase().includes(query) ||
        hotel.proximity.toLowerCase().includes(query) ||
        hotel.groundTruth.toLowerCase().includes(query) ||
        hotel.highlights.some((h) => h.toLowerCase().includes(query)) ||
        hotel.amenities.some((a) => a.toLowerCase().includes(query))

      return matchesTier && matchesSearch
    })
  }, [allHotels, selectedTier, searchQuery])

  if (allHotels.length === 0) {
    return null
  }

  return (
    <section id="vetted-stays" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
            <Building2 className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Vetted Accommodation • Trustable Booking Engine</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A]">
            Where to Stay in {displayName}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7167] mt-1 max-w-2xl leading-relaxed">
            Curated across backpacker social hostels, family-run heritage havelis, and 5-star mountain/palace sanctuaries.
            Every property includes verified neighborhood logistics, ground truths, direct phone contacts, and trustable booking links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Verified Stays</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[11px] font-bold text-[#9A3412] hidden sm:flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Zero Booking Markup</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Tier Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tierFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTier(tab.id as HotelTier | 'all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedTier === tab.id
                  ? 'bg-[#9A3412] text-white shadow-xs'
                  : 'bg-[#FAF7F2] border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <Search className="w-4 h-4 text-[#8C2D19]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pool, haveli, wifi, riverfront..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5DACB] bg-[#FAF7F2] text-xs focus:outline-none focus:ring-2 focus:ring-[#9A3412] focus:bg-white transition-all text-[#201C1A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHotels.map((hotel) => {
          return (
            <div
              key={hotel.id}
              className="rounded-2xl border border-[#EFE7DC] bg-[#FAF7F2] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              {/* Hotel Image with Badges */}
              <div className="relative h-56 sm:h-64 overflow-hidden group">
                <img
                  src={hotel.photo}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30"></div>

                {/* Top tier and rating */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 text-white font-bold backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#D97706]" />
                    <span>{hotel.tierLabel}</span>
                  </span>

                  <div className="flex items-center gap-1.5 bg-white/95 px-2.5 py-1 rounded-full shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-xs text-[#201C1A]">{hotel.rating}</span>
                    <span className="text-[10px] text-stone-500">({hotel.reviewsCount}+ reviews)</span>
                  </div>
                </div>

                {/* Bottom title & neighborhood */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-white/90 font-medium mb-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                    <span className="truncate">{hotel.neighborhood}</span>
                  </div>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold leading-snug line-clamp-1">
                    {hotel.name}
                  </h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                    {hotel.proximity}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                {/* Highlights List */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A3412] block">
                    Curated Highlights
                  </span>
                  <ul className="space-y-1 text-xs text-[#443E38]">
                    {hotel.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hotel.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-[#E5DACB] text-[10px] font-medium text-[#554D45]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Local Ground Truth */}
                <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Local Companion Tip:</strong> {hotel.groundTruth}
                  </p>
                </div>

                {/* Pricing & Trustable Booking Buttons */}
                <div className="pt-3 border-t border-[#EFE7DC] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Typical Tariff</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-editorial text-xl font-bold text-[#201C1A]">
                          {hotel.pricePerNight}
                        </span>
                        <span className="text-xs text-stone-500 font-normal">/ night</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#7A7167] font-medium bg-stone-100 px-2 py-0.5 rounded-full">
                      {hotel.priceRange}
                    </span>
                  </div>

                  {/* Trustable Booking Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {/* Official Website */}
                    <a
                      href={hotel.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#9A3412] hover:bg-[#802A0E] text-white text-xs font-bold transition-colors shadow-2xs group"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Official Direct Site</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>

                    {/* Booking.com */}
                    <a
                      href={hotel.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition-colors shadow-2xs group"
                    >
                      <Compass className="w-3.5 h-3.5 text-blue-600" />
                      <span>Book on Booking.com</span>
                      <ExternalLink className="w-3 h-3 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                  {/* Direct Phone / Contact */}
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 px-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>Direct Front Desk:</span>
                    </span>
                    <a
                      href={`tel:${hotel.phone}`}
                      className="font-bold text-[#9A3412] hover:underline"
                    >
                      {hotel.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredHotels.length === 0 && (
        <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-[#EFE7DC]">
          <p className="text-sm font-semibold text-[#554D45]">
            No accommodations found matching "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedTier('all')
            }}
            className="mt-3 px-4 py-1.5 rounded-xl bg-[#9A3412] text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  )
}

import React, { useState } from 'react'
import { BRAND } from '../config/brand'
import { useAppData } from '../lib/dataStore'
import { SearchBar } from '../components/SearchBar'
import { PlaceCard } from '../components/PlaceCard'
import { ThemeMotif, type MotifVariant } from '../components/ThemeMotif'
import { Link } from '../lib/router'
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Utensils,
  Calendar,
  Camera,
  Shield,
} from 'lucide-react'

export const HomePage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  const { cities, places, dishes } = useAppData()
  const [selectedFoodCity, setSelectedFoodCity] = useState<string>('all')

  const cityCards = Object.values(cities)

  // Curated highlight places
  const popularExperiences = places.filter((p) => p.isMustVisit).slice(0, 6)

  // Curated dishes filtered by city or all
  const filteredDishes =
    selectedFoodCity === 'all'
      ? dishes.slice(0, 6)
      : dishes.filter((d) => d.cityId.toLowerCase() === selectedFoodCity.toLowerCase())

  const cityMotifs: Record<string, MotifVariant> = {
    jaipur: 'jharokha-scallop',
    udaipur: 'mewar-arch-lake',
    manali: 'himalayan-pine',
    varanasi: 'ganga-diya-ghat',
    mussoorie: 'misty-pine-ridge',
    delhi: 'mughal-arch',
  }

  const cityColorBadges: Record<string, string> = {
    jaipur: '#C85A32',
    udaipur: '#1B4965',
    manali: '#1E4620',
    varanasi: '#9B2226',
    mussoorie: '#2E4057',
    delhi: '#8C2D19',
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-8 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Subtle decorative architectural background accents */}
        <div className="absolute top-4 left-6 hidden lg:block opacity-25 pointer-events-none animate-float">
          <ThemeMotif type="jharokha-scallop" width={72} height={72} />
        </div>
        <div className="absolute top-4 right-6 hidden lg:block opacity-25 pointer-events-none animate-float" style={{ animationDelay: '1.5s' }}>
          <ThemeMotif type="mewar-arch-lake" width={72} height={72} />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE8DC] border border-[#DDD3C5] text-xs font-semibold uppercase tracking-wider text-[#732919] mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#8C2D19]" />
          <span>User Board • Curated Local Companions</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#201C1A] tracking-tight max-w-3xl mx-auto leading-[1.12]">
          {BRAND.tagline}
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#5D554C] max-w-2xl mx-auto leading-relaxed">
          {BRAND.subtagline}
        </p>

        {/* Prominent Search Bar */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
          <SearchBar />
          {/* Quick Filter City Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-[#8C8276] font-medium mr-1">Direct explore:</span>
            {cityCards.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                to={`/${c.id}`}
                className="px-3 py-1 rounded-full bg-white border border-[#E5DACB] text-[#48423E] hover:text-[#201C1A] hover:border-[#8C2D19] transition-all hover:scale-103 shadow-2xs"
              >
                <span className="font-semibold">{c.name}</span>
                <span className="text-[10px] text-[#8C8276] ml-1.5 hidden sm:inline">
                  • {c.tasteOfCity?.signatureDish?.split(' ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2-STEP USER BOARD QUICK PLANNER BANNER
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#201C1A] to-[#38312D] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#E5DACB]">
              <Calendar className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>User Board • Instant Itinerary Engine</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Tell us 2 things & your budget. Your city friend plans the rest.
            </h2>
            <p className="text-xs sm:text-sm text-[#D5C9BC] leading-relaxed">
              No endless research. Pick your city, days, and budget to get an authentic day-by-day itinerary curated with local slang and itemized expenses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              to="/planner"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#C85A32] text-white text-sm font-bold hover:bg-[#B34B25] transition-all flex items-center justify-center gap-2 shadow-sm text-center whitespace-nowrap"
            >
              <span>Try 2-Step Trip Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/admin"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center whitespace-nowrap"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations & Cities Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
              Curated Destinations & Local Companions
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
              Every City Has Its Own Soul & Authentic Host
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E645A] max-w-md">
            Explore with Jaipur's <em>Bhaisaab</em>, Udaipur's <em>Banna Sa</em>, Manali's <em>Pahadi Dost</em>, Varanasi's <em>Banarasi Bhaiya</em>, and Mussoorie's <em>Hillside Storyteller</em>.
          </p>
        </div>

        {/* City Cards Grid with Photos and PNG Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cityCards.map((city, idx) => {
            const motif = cityMotifs[city.id] || 'jharokha-scallop'
            const badgeColor = cityColorBadges[city.id] || '#8C2D19'
            const persona = city.persona

            return (
              <div
                key={city.id}
                className="group relative rounded-3xl overflow-hidden border border-[#E5DACB] bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Header Image with Aspect Ratio and Floating Motif */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D5]">
                  <img
                    src={city.heroImage}
                    alt={city.heroImageAlt}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    loading={idx < 2 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

                  {/* Top State Badge & Floating Cultural Motif */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xs"
                      style={{ backgroundColor: badgeColor }}
                    >
                      {city.state}
                    </span>

                    <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white animate-float">
                      <ThemeMotif type={motif} width={24} height={24} className="text-white" />
                    </div>
                  </div>

                  {/* Photo count indicator */}
                  <div className="absolute top-14 right-4 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-xs">
                    <Camera className="w-3 h-3" />
                    <span>{city.galleryPhotos?.length || 1} photos</span>
                  </div>

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-editorial text-2xl font-bold">{city.name}</h3>
                      {city.hindiName && (
                        <span className="text-sm font-medium text-stone-200">({city.hindiName})</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-200 mt-0.5 line-clamp-1 italic">
                      “{city.tagline}”
                    </p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4">
                  {/* Authentic Companion Callout Box */}
                  <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#8C2D19] flex-shrink-0 animate-float">
                      <img
                        src={persona?.avatarImage || city.heroImage}
                        alt={persona?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#201C1A]">{persona?.name || 'Local Guide'}</span>
                        <ShieldCheck className="w-3 h-3 text-[#8C2D19]" />
                      </div>
                      <span className="text-[11px] text-[#7A7167] block line-clamp-1 italic">
                        "{persona?.greeting || city.tagline}"
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#554D45] leading-relaxed line-clamp-2">
                    {city.heroDescription}
                  </p>

                  {/* Taste of this City Highlight Box */}
                  <div className="p-3.5 rounded-2xl bg-[#FBF7F2] border border-[#EFE7DC] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: badgeColor }}>
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Taste of {city.name}:</span>
                    </div>
                    <p className="text-xs font-semibold text-[#201C1A]">
                      {city.tasteOfCity?.signatureDish}
                    </p>
                    <p className="text-[11px] text-[#7A7167]">
                      Famous spot: <strong>{city.tasteOfCity?.famousEatery}</strong>
                    </p>
                  </div>

                  {/* Action Link */}
                  <Link
                    to={`/${city.id}`}
                    className="w-full py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-95 shadow-xs"
                    style={{ backgroundColor: badgeColor }}
                  >
                    <span>Explore with {persona?.name?.split(' ')[1] || city.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* "Taste of Every City" Signature Culinary Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 bg-[#F5EFE6] rounded-3xl p-6 sm:p-10 border border-[#E5DACB]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
              <Utensils className="w-3.5 h-3.5" />
              <span>Culinary Soul</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A]">
              Taste Every City Like a Local
            </h2>
            <p className="text-xs sm:text-sm text-[#665D54] mt-1">
              From dew-condensed Malaiyo in Varanasi to warm cinnamon apple pies in Landour and Rawat Pyaaz Kachoris in Jaipur.
            </p>
          </div>

          {/* City Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedFoodCity('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedFoodCity === 'all'
                  ? 'bg-[#201C1A] text-white'
                  : 'bg-white text-[#5D554C] hover:bg-[#EAE2D5]'
              }`}
            >
              All Dishes
            </button>
            {cityCards.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedFoodCity(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedFoodCity === c.id
                    ? 'text-white'
                    : 'bg-white text-[#5D554C] hover:bg-[#EAE2D5]'
                }`}
                style={{ backgroundColor: selectedFoodCity === c.id ? (cityColorBadges[c.id] || '#8C2D19') : undefined }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E5DACB] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover hover:scale-104 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                  {dish.cityId} • {dish.type}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                  ₹{dish.approxPriceInr}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#201C1A]">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-[#5D554C] mt-1 leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] text-xs text-[#7A7167] space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Spot: <strong className="text-[#201C1A]">{dish.iconicSpotName}</strong></span>
                    <span className="text-[11px] text-[#8C8276]">({dish.spotNeighborhood})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Popular Heritage Experiences */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
              Signature Landmarks
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
              Essential Heritage & Vistas
            </h2>
          </div>
          <Link
            to="/planner"
            className="text-xs sm:text-sm font-semibold text-[#8C2D19] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Plan these into an itinerary</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularExperiences.map((place) => (
            <PlaceCard key={place.id} place={place} onSaveToast={onSaveToast} />
          ))}
        </div>
      </section>
    </div>
  )
}

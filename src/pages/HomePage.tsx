import React, { useState } from 'react'
import { BRAND } from '../config/brand'
import { CITIES } from '../data/cities'
import { PLACES } from '../data/places'
import { LOCAL_DISHES } from '../data/dishes'
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
  Compass,
} from 'lucide-react'


export const HomePage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  const [selectedFoodCity, setSelectedFoodCity] = useState<'all' | 'jaipur' | 'udaipur' | 'manali' | 'varanasi' | 'mussoorie'>('all')

  // The 5 selected pilot cities in order
  const fiveCityIds = ['jaipur', 'udaipur', 'manali', 'varanasi', 'mussoorie'] as const
  const cityCards = fiveCityIds.map((id) => CITIES[id]).filter(Boolean)

  // Curated highlight places (1-2 from each of the 5 cities)
  const popularExperiences = PLACES.filter((p) => p.isMustVisit).slice(0, 6)

  // Curated dishes filtered by city or all
  const filteredDishes =
    selectedFoodCity === 'all'
      ? LOCAL_DISHES.slice(0, 6)
      : LOCAL_DISHES.filter((d) => d.cityId === selectedFoodCity)

  const cityMotifs: Record<string, MotifVariant> = {
    jaipur: 'jharokha-scallop',
    udaipur: 'mewar-arch-lake',
    manali: 'himalayan-pine',
    varanasi: 'ganga-diya-ghat',
    mussoorie: 'misty-pine-ridge',
  }

  const cityColorBadges: Record<string, string> = {
    jaipur: '#C85A32',
    udaipur: '#1B4965',
    manali: '#1E4620',
    varanasi: '#9B2226',
    mussoorie: '#2E4057',
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
          <span>The 5 Curated Indian Chapters</span>
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
            {cityCards.map((c) => (
              <Link
                key={c.id}
                to={`/${c.id}`}
                className="px-3 py-1 rounded-full bg-white border border-[#E5DACB] text-[#48423E] hover:text-[#201C1A] hover:border-[#8C2D19] transition-all hover:scale-103 shadow-2xs"
              >
                <span className="font-semibold">{c.name}</span>
                <span className="text-[10px] text-[#8C8276] ml-1.5 hidden sm:inline">
                  • {c.tasteOfCity.signatureDish.split(' ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The 5 Selected Cities Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
              Curated Destinations
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
              Five Cities, Five Distinct Souls
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E645A] max-w-md">
            Each destination has its own authentic rhythm, architectural motif, and regional culinary institution.
          </p>
        </div>

        {/* 5 City Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cityCards.map((city, idx) => {
            const motif = cityMotifs[city.id] || 'jharokha-scallop'
            const badgeColor = cityColorBadges[city.id] || '#8C2D19'

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
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading={idx < 2 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

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

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-editorial text-2xl font-bold">{city.name}</h3>
                      <span className="text-sm font-medium text-stone-200">({city.hindiName})</span>
                    </div>
                    <p className="text-xs text-stone-200 mt-0.5 line-clamp-1 italic">
                      “{city.tagline}”
                    </p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4">
                  <p className="text-xs sm:text-sm text-[#554D45] leading-relaxed line-clamp-2">
                    {city.heroDescription}
                  </p>

                  {/* Taste of this City Highlight Box */}
                  <div className="p-3.5 rounded-2xl bg-[#FBF7F2] border border-[#EFE7DC] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: badgeColor }}>
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Taste of {city.name}:</span>
                    </div>
                    <p className="text-xs font-semibold text-[#201C1A]">
                      {city.tasteOfCity.signatureDish}
                    </p>
                    <p className="text-[11px] text-[#7A7167]">
                      Famous spot: <strong>{city.tasteOfCity.famousEatery}</strong>
                    </p>
                  </div>

                  {/* Facts pill */}
                  <div className="flex items-center justify-between text-xs text-[#7A7167] pt-1">
                    <span>Stay: <strong className="text-[#201C1A]">{city.idealDays} Days</strong></span>
                    <span>Best: <strong className="text-[#201C1A]">{city.bestSeason.split('(')[0].trim()}</strong></span>
                  </div>

                  {/* Action Link */}
                  <Link
                    to={`/${city.id}`}
                    className="w-full py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-95 shadow-xs"
                    style={{ backgroundColor: badgeColor }}
                  >
                    <span>Explore {city.name} Guide</span>
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
              From dew-condensed Malaiyo in Varanasi to warm cinnamon apple pies in Landour.
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
                onClick={() => setSelectedFoodCity(c.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedFoodCity === c.id
                    ? 'text-white'
                    : 'bg-white text-[#5D554C] hover:bg-[#EAE2D5]'
                }`}
                style={{
                  backgroundColor: selectedFoodCity === c.id ? cityColorBadges[c.id] : undefined,
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => {
            const badgeColor = cityColorBadges[dish.cityId] || '#8C2D19'
            const cityName = dish.cityId.charAt(0).toUpperCase() + dish.cityId.slice(1)

            return (
              <div
                key={dish.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DFD3] shadow-xs flex flex-col justify-between hover:border-[#D5C9BC] transition-all hover:scale-101"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: badgeColor }}
                    >
                      {cityName}
                    </span>
                    <span className="text-xs font-semibold text-[#201C1A]">
                      ₹{dish.approxPriceInr} approx
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-[#201C1A] leading-snug">
                    {dish.name}
                  </h3>
                  {dish.hindiName && (
                    <span className="text-xs text-[#8C8276] font-medium block mb-2">
                      {dish.hindiName}
                    </span>
                  )}

                  <p className="text-xs text-[#5D554C] leading-relaxed mb-3">
                    {dish.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] text-xs">
                  <span className="text-[#8C8276] block">Iconic Institution:</span>
                  <span className="font-semibold text-[#201C1A]">{dish.iconicSpotName}</span>
                  <span className="text-[#786F66] block text-[11px]">{dish.spotNeighborhood}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Popular Experiences Section across 5 Cities */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
              Curated Highlights
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
              Top Experiences in the 5 Cities
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {cityCards.map((c) => (
              <Link
                key={c.id}
                to={`/${c.id}`}
                className="hover:underline"
                style={{ color: cityColorBadges[c.id] }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularExperiences.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onSaveToast={onSaveToast}
              themeColor={cityColorBadges[place.cityId] || '#8C2D19'}
            />
          ))}
        </div>
      </section>

      {/* The HOMI Confidence Promise */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
            The HOMI Promise
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
            Built for thoughtful travelers
          </h2>
          <p className="text-xs sm:text-sm text-[#665D54] mt-2">
            No sponsored placements, no algorithmic bias, no bloated pages. Just verified local guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FBECE6] text-[#C85A32] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#201C1A] mb-2">
              Verified Tariffs & Timings
            </h3>
            <p className="text-xs sm:text-sm text-[#5D554C] leading-relaxed">
              Monument entry tickets, boat cruise slots, and opening hours cross-referenced with official archaeological & state tourism authorities.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E7F2F8] text-[#1B4965] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#201C1A] mb-2">
              Geographic Common Sense
            </h3>
            <p className="text-xs sm:text-sm text-[#5D554C] leading-relaxed">
              Itineraries cluster places logically by neighborhood so you never waste hours battling traffic between hills, ghats, or forts.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E6EFE6] text-[#1E4620] flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#201C1A] mb-2">
              Honest Rupee Budgets
            </h3>
            <p className="text-xs sm:text-sm text-[#5D554C] leading-relaxed">
              Transparent accommodation and dining formulas distinguish room-level expenses from per-person tariffs with zero hidden math.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-[#201C1A] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold">
              Plan your 5-city Indian adventure
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-lg">
              Generate a realistic day-by-day starter itinerary for Jaipur, Udaipur, Manali, Varanasi, or Mussoorie in seconds.
            </p>
          </div>
          <Link
            to="/planner"
            className="px-6 py-3 rounded-xl bg-white text-[#201C1A] text-sm font-bold hover:bg-[#F2ECE1] transition-colors whitespace-nowrap"
          >
            Launch Trip Planner
          </Link>
        </div>
      </section>
    </div>
  )
}

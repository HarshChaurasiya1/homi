import React, { useState } from 'react'
import type { CityId, PlaceCategory } from '../data/types'
import { CITIES } from '../data/cities'
import { PLACES } from '../data/places'
import { LOCAL_DISHES } from '../data/dishes'
import { PlaceCard } from '../components/PlaceCard'
import { ThemeMotif } from '../components/ThemeMotif'
import { Link } from '../lib/router'
import { Calendar, Info, ArrowRight } from 'lucide-react'


interface CityPageProps {
  cityId: CityId
  onSaveToast: (msg: string) => void
}

export const CityPage: React.FC<CityPageProps> = ({ cityId, onSaveToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all')

  const city = CITIES[cityId]
  if (!city) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-editorial text-2xl font-bold">City Not Found</h1>
        <p className="text-sm text-stone-600 mt-2">The requested city is not yet in our pilot catalog.</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm">
          Return Home
        </Link>
      </div>
    )
  }

  const isDelhi = cityId === 'delhi'
  const primaryColor = isDelhi ? '#8C2D19' : '#C85A32'
  const secondaryColor = isDelhi ? '#D97706' : '#E67E22'
  const cityBgClass = isDelhi ? 'theme-delhi bg-[#F9F6F0]' : 'theme-jaipur bg-[#FCF7F4]'
  const motifType = isDelhi ? 'mughal-arch' : 'jharokha-scallop'

  // Filter places for this city
  const cityPlaces = PLACES.filter((p) => p.cityId === cityId)
  const filteredPlaces =
    selectedCategory === 'all'
      ? cityPlaces
      : cityPlaces.filter((p) => p.category === selectedCategory)

  // Filter local food for this city
  const cityDishes = LOCAL_DISHES.filter((d) => d.cityId === cityId)

  const categories: Array<{ id: PlaceCategory | 'all'; label: string }> = [
    { id: 'all', label: `All Places (${cityPlaces.length})` },
    { id: 'heritage', label: 'Heritage & Monuments' },
    { id: 'neighborhood', label: 'Bazaars & Quarters' },
    { id: 'hidden_gem', label: 'Hidden Gems & Stepwells' },
    { id: 'sunset', label: 'Scenic & Sunset' },
    { id: 'shopping', label: 'Artisans & Crafts' },
  ]

  return (
    <div className={`min-h-screen ${cityBgClass} transition-colors pb-16`}>
      {/* City Hero Banner with Bespoke Architectural Art Direction */}
      <section className="relative border-b border-[#E5DACB] overflow-hidden">
        {/* Subtle Background Watermark Motifs */}
        <div className="absolute right-4 top-8 hidden lg:block opacity-15 pointer-events-none">
          <ThemeMotif type={motifType} width={160} height={160} />
        </div>
        <div className="absolute left-6 bottom-4 hidden lg:block opacity-10 pointer-events-none">
          <ThemeMotif type={motifType} width={100} height={100} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#7D736A] mb-4">
            <Link to="/" className="hover:text-[#201C1A]">Home</Link>
            <span>/</span>
            <span className="text-[#201C1A] font-semibold">{city.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xs" style={{ backgroundColor: primaryColor }}>
                <span>{city.state}</span>
              </div>

              <div className="flex items-baseline gap-3">
                <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#201C1A] tracking-tight">
                  {city.name}
                </h1>
                <span className="font-editorial text-2xl sm:text-3xl font-medium text-[#8C8276]">
                  {city.hindiName}
                </span>
              </div>

              <p className="font-editorial text-lg sm:text-xl text-[#3A332C] italic">
                “{city.tagline}”
              </p>

              <p className="text-sm sm:text-base text-[#554D45] leading-relaxed max-w-2xl">
                {city.heroDescription}
              </p>

              {/* Curator Local Friend Note */}
              <div className="p-4 rounded-2xl bg-white/80 border border-[#E8DFD3] shadow-xs text-xs sm:text-sm text-[#48423E] flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                <div>
                  <span className="font-bold text-[#201C1A] block">Curator Note for {city.name}:</span>
                  <span className="leading-relaxed">{city.curatorNote}</span>
                </div>
              </div>
            </div>

            {/* Quick City Facts Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E5DACB] shadow-sm space-y-4">
              <h2 className="font-editorial text-lg font-bold text-[#201C1A] border-b border-[#F2ECE1] pb-2">
                Essential Planning Facts
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-[#8C8276] font-medium block">Best Time to Visit</span>
                  <span className="font-bold text-[#201C1A]">{city.bestSeason}</span>
                </div>

                <div>
                  <span className="text-[#8C8276] font-medium block">Recommended Duration</span>
                  <span className="font-bold text-[#201C1A]">{city.idealDays} Days</span>
                </div>

                <div>
                  <span className="text-[#8C8276] font-medium block">Transit Strategy</span>
                  <span className="text-[#48423E] leading-relaxed block mt-0.5">{city.transportTip}</span>
                </div>

                <div>
                  <span className="text-[#8C8276] font-medium block">Local Etiquette & Respect</span>
                  <span className="text-[#48423E] leading-relaxed block mt-0.5">{city.localEtiquetteTip}</span>
                </div>
              </div>

              <Link
                to="/planner"
                className="w-full py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-95"
                style={{ backgroundColor: primaryColor }}
              >
                <Calendar className="w-4 h-4" />
                <span>Build {city.name} Itinerary</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
            Curated Places & Experiences
          </h2>
          <span className="text-xs text-[#7D736A]">
            Showing {filteredPlaces.length} of {cityPlaces.length}
          </span>
        </div>

        {/* Scrollable category pills on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'text-white shadow-xs'
                    : 'bg-white text-[#5D554C] hover:bg-[#EFE8DD] border border-[#E5DACB]'
                }`}
                style={{ backgroundColor: active ? primaryColor : undefined }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onSaveToast={onSaveToast}
              themeColor={primaryColor}
            />
          ))}
        </div>
      </section>

      {/* Suggested Starter Itinerary for this City */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                Suggested Walk
              </span>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                The Signature {city.name} Day Trail
              </h2>
            </div>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold hover:underline"
              style={{ color: primaryColor }}
            >
              <span>Customize in Trip Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isDelhi ? (
              <>
                <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EFE7DA] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#8C2D19]">
                    <span>MORNING (7:30 AM)</span>
                    <span>1.5 Hours</span>
                  </div>
                  <h3 className="font-editorial text-base font-bold text-[#201C1A]">
                    Humayun’s Tomb & Gardens
                  </h3>
                  <p className="text-xs text-[#5D554C]">
                    Catch the soft morning sun over red sandstone before tour buses arrive. Entry: ₹40.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EFE7DA] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#8C2D19]">
                    <span>AFTERNOON (11:30 AM)</span>
                    <span>2 Hours</span>
                  </div>
                  <h3 className="font-editorial text-base font-bold text-[#201C1A]">
                    Sunder Nursery & Lunch
                  </h3>
                  <p className="text-xs text-[#5D554C]">
                    Walk through Mughal canals into FAB Cafe for lake-view millet salads and fresh kokum coolers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EFE7DA] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#8C2D19]">
                    <span>EVENING (4:00 PM)</span>
                    <span>2.5 Hours</span>
                  </div>
                  <h3 className="font-editorial text-base font-bold text-[#201C1A]">
                    Lodhi Art Murals & Dinner
                  </h3>
                  <p className="text-xs text-[#5D554C]">
                    Open-air street art walk followed by regional Indian dinner at Cafe Lota or Khanna Market.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-[#FCF7F4] border border-[#F0DFD8] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#C85A32]">
                    <span>MORNING (8:00 AM)</span>
                    <span>1.5 Hours</span>
                  </div>
                  <h3 className="font-editorial text-base font-bold text-[#201C1A]">
                    Hawa Mahal Rooftop Chai
                  </h3>
                  <p className="text-xs text-[#5D554C]">
                    Watch the early sun illuminate 953 jharokhas from Wind View Cafe. Entry: ₹50.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCF7F4] border border-[#F0DFD8] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#C85A32]">
                    <span>AFTERNOON (11:00 AM)</span>
                    <span>2.5 Hours</span>
                  </div>
                  <h3 className="font-editorial text-base font-bold text-[#201C1A]">
                    Amer Fort & Stepwell
                  </h3>
                  <p className="text-xs text-[#5D554C]">
                    Explore the Sheesh Mahal mirror palace and walk to ancient Panna Meena Stepwell.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCF7F4] border border-[#F0DFD8] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#C85A32]">
                    <span>SUNSET (4:30 PM)</span>
                    <span>2 Hours</span>
                  </div>
                  <h3 className="font-editorial text-base font-bold text-[#201C1A]">
                    Nahargarh Fort Ridge
                  </h3>
                  <p className="text-xs text-[#5D554C]">
                    Watch the sun dip behind the Aravalli hills with panoramic views of the entire Pink City.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Local Dishes Section for this City */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: secondaryColor }}>
            Local Palate
          </span>
          <h2 className="font-editorial text-2xl font-bold text-[#201C1A] mt-1">
            Iconic Dishes in {city.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#665D54]">
            Don't leave without tasting these culinary institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cityDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl p-4 border border-[#E8DFD3] shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-[#201C1A] block">
                  {dish.name}
                </span>
                {dish.hindiName && (
                  <span className="text-[11px] text-[#8C8276] block mb-1">
                    {dish.hindiName}
                  </span>
                )}
                <p className="text-xs text-[#5D554C] line-clamp-3 mt-1 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#F2ECE1] text-[11px]">
                <span className="text-[#8C8276] block">Famous at:</span>
                <span className="font-semibold text-[#201C1A]">{dish.iconicSpotName}</span>
                <span className="text-[#D97706] font-bold block mt-0.5">₹{dish.approxPriceInr} approx</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

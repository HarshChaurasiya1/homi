import React, { useState } from 'react'
import type { CityId, PlaceCategory } from '../data/types'
import { CITIES } from '../data/cities'
import { PLACES } from '../data/places'
import { LOCAL_DISHES } from '../data/dishes'
import { PlaceCard } from '../components/PlaceCard'
import { Link } from '../lib/router'
import { ThemeMotif, type MotifVariant } from '../components/ThemeMotif'
import { Calendar, Info, ArrowRight, Utensils } from 'lucide-react'




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
        <p className="text-sm text-stone-600 mt-2">The requested city is not in our 5 pilot destinations.</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm">
          Return Home
        </Link>
      </div>
    )
  }

  const cityStyles: Record<string, {
    primary: string
    secondary: string
    bgClass: string
    motif: MotifVariant
  }> = {
    jaipur: {
      primary: '#C85A32',
      secondary: '#E67E22',
      bgClass: 'theme-jaipur bg-[#FCF7F4]',
      motif: 'jharokha-scallop',
    },
    udaipur: {
      primary: '#1B4965',
      secondary: '#C99700',
      bgClass: 'theme-udaipur bg-[#F4F8FA]',
      motif: 'mewar-arch-lake',
    },
    manali: {
      primary: '#1E4620',
      secondary: '#D4821E',
      bgClass: 'theme-manali bg-[#F4F7F4]',
      motif: 'himalayan-pine',
    },
    varanasi: {
      primary: '#9B2226',
      secondary: '#D97706',
      bgClass: 'theme-varanasi bg-[#FBF6EE]',
      motif: 'ganga-diya-ghat',
    },
    mussoorie: {
      primary: '#2E4057',
      secondary: '#D08C51',
      bgClass: 'theme-mussoorie bg-[#F6F7F9]',
      motif: 'misty-pine-ridge',
    },
    delhi: {
      primary: '#8C2D19',
      secondary: '#D97706',
      bgClass: 'theme-delhi bg-[#F9F6F0]',
      motif: 'mughal-arch',
    },
  }

  const currentStyle = cityStyles[cityId] || cityStyles.jaipur
  const primaryColor = currentStyle.primary
  const secondaryColor = currentStyle.secondary
  const cityBgClass = currentStyle.bgClass
  const motifType = currentStyle.motif

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
    { id: 'neighborhood', label: 'Bazaars & Trails' },
    { id: 'hidden_gem', label: 'Hidden Gems' },
    { id: 'sunset', label: 'Scenic & Sunset' },
  ]

  // Signature Day Trail data per city
  const signatureDayTrails: Record<string, {
    morning: { time: string; title: string; desc: string }
    afternoon: { time: string; title: string; desc: string }
    evening: { time: string; title: string; desc: string }
  }> = {
    jaipur: {
      morning: { time: '8:00 AM', title: 'Hawa Mahal Rooftop Chai', desc: 'Watch golden sunrise light illuminate 953 jharokhas from Wind View Cafe. Entry: ₹50.' },
      afternoon: { time: '11:00 AM', title: 'Amer Fort & Sheesh Mahal', desc: 'Explore the Rajput mirror palace and wander down to ancient Panna Meena Stepwell.' },
      evening: { time: '4:30 PM', title: 'Nahargarh Fort Ridge', desc: 'Watch sunset dip behind the Aravalli hills with panoramic views of the entire Pink City.' },
    },
    udaipur: {
      morning: { time: '9:00 AM', title: 'City Palace Granite Halls', desc: 'Witness the Mor Chowk glass peacocks and Zenana Mahal overlooking Lake Pichola. Entry: ₹300.' },
      afternoon: { time: '12:30 PM', title: 'Gangaur Ghat & Folk Arts', desc: 'Wander lakeside havelis, browse miniature paintings, and enjoy authentic Dal Baati lunch.' },
      evening: { time: '4:45 PM', title: 'Lake Pichola Sunset Cruise', desc: 'Take a serene wooden boat toward Jag Mandir Island as the white palaces turn golden.' },
    },
    manali: {
      morning: { time: '8:30 AM', title: 'Hadimba Pagoda Temple', desc: 'Breathe crisp pine mist among giant centuries-old deodars. Free public entrance.' },
      afternoon: { time: '11:30 AM', title: 'Old Manali Bohemian Trail', desc: 'Cross the river bridge for woodfired river cafes, Himachali Siddu, and apple orchards.' },
      evening: { time: '3:30 PM', title: 'Jogini Falls & Vashisht Spring', desc: 'Hike through pine forests to cascading mountain waterfalls and natural hot baths.' },
    },
    varanasi: {
      morning: { time: '5:30 AM', title: 'Subah-e-Banaras Dawn Boat', desc: 'Glide quietly on a hand-rowed boat from Assi Ghat past 84 stone palaces in morning mist.' },
      afternoon: { time: '11:30 AM', title: 'Kashi Vishwanath Corridor', desc: 'Walk the restored riverfront corridor to the historic Jyotirlinga and taste Tamatar Chaat.' },
      evening: { time: '5:30 PM', title: 'Grand Evening Ganga Aarti', desc: 'Witness seven priests adoration of the sacred river with brass lamps, bells, and conches.' },
    },
    mussoorie: {
      morning: { time: '8:30 AM', title: 'Landour Lal Tibba Loop', desc: 'Walk under towering deodars from Char Dukan to Lal Tibba; breakfast at Landour Bakehouse.' },
      afternoon: { time: '12:30 PM', title: 'Happy Valley Tibetan Trail', desc: 'Spin prayer wheels at the Buddhist temple where the Dalai Lama first resided in 1959.' },
      evening: { time: '3:45 PM', title: 'George Everest Sunset Peak', desc: 'Climb the scenic prayer-flag ridge for 360-degree views of the Doon Valley and snow peaks.' },
    },
    delhi: {
      morning: { time: '7:30 AM', title: 'Humayun’s Tomb & Gardens', desc: 'Catch morning sun over red sandstone before tour buses arrive. Entry: ₹40.' },
      afternoon: { time: '11:30 AM', title: 'Sunder Nursery & Lunch', desc: 'Walk through Mughal canals into FAB Cafe for lake-view salads and fresh kokum coolers.' },
      evening: { time: '4:00 PM', title: 'Lodhi Art Murals & Dinner', desc: 'Open-air street art walk followed by regional Indian dinner at Cafe Lota or Khanna Market.' },
    },
  }

  const trail = signatureDayTrails[cityId] || signatureDayTrails.jaipur

  return (
    <div className={`min-h-screen ${cityBgClass} transition-colors pb-16`}>
      {/* City Hero Banner with Bespoke Architectural Art Direction */}
      <section className="relative border-b border-[#E5DACB] overflow-hidden">
        {/* Subtle Background Watermark Motifs with CSS Animation */}
        <div className="absolute right-6 top-8 hidden lg:block opacity-20 pointer-events-none animate-float">
          <ThemeMotif type={motifType} width={160} height={160} />
        </div>
        <div className="absolute left-6 bottom-4 hidden lg:block opacity-15 pointer-events-none animate-float" style={{ animationDelay: '2s' }}>
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xs" style={{ backgroundColor: primaryColor }}>
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

              {/* Dedicated "Taste of this City" Box */}
              <div className="p-4 rounded-2xl bg-white/90 border border-[#E8DFD3] shadow-xs text-xs sm:text-sm text-[#48423E] flex items-start gap-3">
                <Utensils className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                <div>
                  <span className="font-bold text-[#201C1A] block">Taste of {city.name}:</span>
                  <span className="font-semibold block text-[#201C1A]">{city.tasteOfCity.signatureDish}</span>
                  <span className="text-[#7A7167] text-xs leading-relaxed block mt-0.5">
                    Institution: <strong>{city.tasteOfCity.famousEatery}</strong> • Notes: {city.tasteOfCity.headline}
                  </span>
                </div>
              </div>

              {/* Curator Local Friend Note */}
              <div className="p-4 rounded-2xl bg-white/70 border border-[#E8DFD3] shadow-2xs text-xs sm:text-sm text-[#48423E] flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                <div>
                  <span className="font-bold text-[#201C1A] block">Curator Note for {city.name}:</span>
                  <span className="leading-relaxed text-[#5D554C]">{city.curatorNote}</span>
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
                  <span className="text-[#8C8276] font-medium block">Recommended Stay</span>
                  <span className="font-bold text-[#201C1A]">{city.idealDays} Days</span>
                </div>

                <div>
                  <span className="text-[#8C8276] font-medium block">Transit Strategy</span>
                  <span className="text-[#48423E] leading-relaxed block mt-0.5">{city.transportTip}</span>
                </div>

                <div>
                  <span className="text-[#8C8276] font-medium block">Local Etiquette & Sanctity</span>
                  <span className="text-[#48423E] leading-relaxed block mt-0.5">{city.localEtiquetteTip}</span>
                </div>
              </div>

              <Link
                to="/planner"
                className="w-full py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-95 shadow-xs"
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

      {/* Suggested Signature Day Trail for this City */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                Suggested Walk
              </span>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                The Signature 1-Day {city.name} Trail
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
            <div className="p-4 rounded-2xl border space-y-2 bg-white/70" style={{ borderColor: primaryColor + '30' }}>
              <div className="flex items-center justify-between text-xs font-bold" style={{ color: primaryColor }}>
                <span>MORNING ({trail.morning.time})</span>
                <span>Stop 1</span>
              </div>
              <h3 className="font-editorial text-base font-bold text-[#201C1A]">
                {trail.morning.title}
              </h3>
              <p className="text-xs text-[#5D554C] leading-relaxed">
                {trail.morning.desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl border space-y-2 bg-white/70" style={{ borderColor: primaryColor + '30' }}>
              <div className="flex items-center justify-between text-xs font-bold" style={{ color: primaryColor }}>
                <span>AFTERNOON ({trail.afternoon.time})</span>
                <span>Stop 2</span>
              </div>
              <h3 className="font-editorial text-base font-bold text-[#201C1A]">
                {trail.afternoon.title}
              </h3>
              <p className="text-xs text-[#5D554C] leading-relaxed">
                {trail.afternoon.desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl border space-y-2 bg-white/70" style={{ borderColor: primaryColor + '30' }}>
              <div className="flex items-center justify-between text-xs font-bold" style={{ color: primaryColor }}>
                <span>SUNSET / EVENING ({trail.evening.time})</span>
                <span>Stop 3</span>
              </div>
              <h3 className="font-editorial text-base font-bold text-[#201C1A]">
                {trail.evening.title}
              </h3>
              <p className="text-xs text-[#5D554C] leading-relaxed">
                {trail.evening.desc}
              </p>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

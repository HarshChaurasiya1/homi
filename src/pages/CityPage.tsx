import React, { useState, useEffect } from 'react'
import type { CityId, PlaceCategory } from '../data/types'
import { useAppData } from '../lib/dataStore'
import { getRedditPicksForCity } from '../data/redditPicks'
import { PlaceCard } from '../components/PlaceCard'
import { Link } from '../lib/router'
import { useActiveCity } from '../lib/storage'
import { ThemeMotif, type MotifVariant } from '../components/ThemeMotif'
import {
  Calendar,
  ArrowRight,
  Utensils,
  Camera,
  ShieldCheck,
  Quote,
  Sun,
  Coffee,
  MessageSquare,
} from 'lucide-react'

interface CityPageProps {
  cityId: CityId
  onSaveToast: (msg: string) => void
}

export const CityPage: React.FC<CityPageProps> = ({ cityId, onSaveToast }) => {
  const { cities, places, dishes } = useAppData()
  const [, setActiveCityId] = useActiveCity()
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all')
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null)
  const redditSpots = getRedditPicksForCity(cityId)

  useEffect(() => {
    setActiveCityId(cityId)
  }, [cityId, setActiveCityId])

  const city = cities[cityId.toLowerCase()]
  if (!city) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-editorial text-2xl font-bold">City Not Found</h1>
        <p className="text-sm text-stone-600 mt-2">The requested city was not found in our database.</p>
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

  const currentStyle = cityStyles[cityId.toLowerCase()] || {
    primary: '#8C2D19',
    secondary: '#D97706',
    bgClass: 'bg-[#FAF7F2]',
    motif: 'jharokha-scallop' as MotifVariant,
  }

  const primaryColor = currentStyle.primary
  const secondaryColor = currentStyle.secondary
  const cityBgClass = currentStyle.bgClass
  const motifType = currentStyle.motif

  // Filter places for this city
  const cityPlaces = places.filter((p) => p.cityId.toLowerCase() === cityId.toLowerCase())
  const filteredPlaces =
    selectedCategory === 'all'
      ? cityPlaces
      : cityPlaces.filter((p) => p.category === selectedCategory)

  // Filter local food for this city
  const cityDishes = dishes.filter((d) => d.cityId.toLowerCase() === cityId.toLowerCase())
  const persona = city.persona

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
      afternoon: { time: '12:00 PM', title: 'Old Manali River Trail', desc: 'Stroll apple orchard footpaths, cross wooden bridges, and savor fresh pan-seared river trout.' },
      evening: { time: '3:30 PM', title: 'Jogini Waterfalls & Vashisht', desc: 'A scenic 3 km cedar forest trek culminating at sacred cascading waters.' },
    },
    varanasi: {
      morning: { time: '5:30 AM', title: 'Subah-e-Banaras Boat Ride', desc: 'Watch mist rise off the holy Ganga at Assi Ghat amidst early morning bells and chants.' },
      afternoon: { time: '11:30 AM', title: 'Vishwanath Golden Corridor', desc: 'Walk sacred stone alleys, discover hidden step shrines, and taste authentic Tamatar Chaat.' },
      evening: { time: '5:45 PM', title: 'Dashashwamedh Grand Aarti', desc: 'Witness seven Vedic priests hoist blazing brass lamps over the river in celestial sync.' },
    },
    mussoorie: {
      morning: { time: '8:30 AM', title: 'Landour Deodar Loop', desc: 'Walk under 150-year-old pines from Char Dukan to Lal Tibba viewpoint. Pure morning silence.' },
      afternoon: { time: '12:30 PM', title: 'Tibetan Happy Valley', desc: 'Discover ancient prayer wheels, quiet monasteries, and freshly steamed mountain Tingmo.' },
      evening: { time: '4:00 PM', title: 'George Everest Sunset Ridge', desc: 'Hike to the historic surveyor mansion for 360-degree views of snow peaks and valley lights.' },
    },
    delhi: {
      morning: { time: '8:00 AM', title: 'Humayuns Tomb Gardens', desc: 'Serene Mughal geometry and red sandstone dome in morning golden light.' },
      afternoon: { time: '12:00 PM', title: 'Qutub Minar Complex', desc: 'Marvel at 12th century fluted calligraphy and the rustless Iron Pillar.' },
      evening: { time: '4:30 PM', title: 'Old Delhi Street Food Trail', desc: 'Sita Ram Chole Bhature, Jama Masjid kebabs, and hot winter jalebis.' },
    },
  }

  const trail = signatureDayTrails[cityId.toLowerCase()] || signatureDayTrails.jaipur

  return (
    <div className={`min-h-screen ${cityBgClass} pb-20 transition-colors`}>
      {/* City Hero Banner */}
      <section className="relative h-[420px] sm:h-[500px] w-full overflow-hidden bg-stone-900">
        <img
          src={city.heroImage}
          alt={city.heroImageAlt}
          className="w-full h-full object-cover opacity-85"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        {/* Floating Cultural Motif Badge */}
        <div className="absolute top-6 right-6 hidden sm:block p-3 rounded-2xl bg-white/15 backdrop-blur-md text-white animate-float">
          <ThemeMotif type={motifType} width={40} height={40} className="text-white" />
        </div>

        <div className="absolute bottom-8 left-0 right-0 max-w-6xl mx-auto px-4 sm:px-6 text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: secondaryColor }}
            ></span>
            <span>{city.state}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              {city.name}
            </h1>
            {city.hindiName && (
              <span className="text-xl sm:text-2xl font-light text-stone-200">
                ({city.hindiName})
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base text-stone-200 max-w-2xl font-medium leading-relaxed italic">
            “{city.tagline}”
          </p>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-200">
            <span className="bg-black/40 px-3 py-1 rounded-lg backdrop-blur-xs">
              Ideal stay: <strong>{city.idealDays} Days</strong>
            </span>
            <span className="bg-black/40 px-3 py-1 rounded-lg backdrop-blur-xs">
              Best season: <strong>{city.bestSeason.split('(')[0].trim()}</strong>
            </span>
            <span className="bg-black/40 px-3 py-1 rounded-lg backdrop-blur-xs">
              Curator: <strong>{persona?.name || 'Local Guide'}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* =========================================================================
            AUTHENTIC LOCAL COMPANION WELCOME & DIALECT TONE
           ========================================================================= */}
        {persona && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#F2ECE1] pb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#8C2D19] shadow-sm animate-float flex-shrink-0">
                    <img
                      src={persona.avatarImage || city.heroImage}
                      alt={persona.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#8C2D19] text-white text-[8px] font-bold uppercase tracking-wider">
                    {persona.badge || 'Host'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-editorial text-2xl font-bold text-[#201C1A]">
                      {persona.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-[#8C2D19]" />
                  </div>
                  <p className="text-xs text-[#7A7167] font-medium">{persona.title}</p>
                </div>
              </div>

              <Link
                to="/planner"
                className="px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-opacity hover:opacity-95 self-start md:self-auto"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Plan 2-Step Trip with {persona.name.split(' ')[1] || persona.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FCF8F5] border border-[#ECD7CE] space-y-1.5 relative">
                <Quote className="w-4 h-4 text-[#8C2D19]/40 absolute top-3 right-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19] block">
                  Local Voice & Apnapan:
                </span>
                <p className="text-sm font-semibold text-[#201C1A] italic leading-relaxed">
                  "{persona.greeting}"
                </p>
                <p className="text-xs text-[#554D45] leading-relaxed">
                  {persona.dialectQuote}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#E7D8C4] text-[#735A28] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B2226] block">
                  {persona.name}'s Insider Tip:
                </span>
                <p className="text-xs text-[#523B17] font-medium leading-relaxed">
                  {persona.localTip}
                </p>
                <div className="pt-2 text-[11px] text-[#7A7167]">
                  Etiquette: {city.localEtiquetteTip}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            REDDIT & DISCORD COMMUNITY TRAVELER PICKS FOR THIS CITY
           ========================================================================= */}
        {redditSpots.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F2ECE1] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Real Traveler Voted • Reddit & Discord Consensus</span>
                </div>
                <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                  Best Cafes, Sunsets & Hangouts in {city.name}
                </h2>
              </div>
              <span className="text-xs text-[#7A7167]">
                Community verified by r/{city.id} travelers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {redditSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="rounded-2xl overflow-hidden border border-[#EFE7DC] bg-[#FAF7F2] flex flex-col justify-between photo-card-zoom"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={spot.photo} alt={spot.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs">
                      {spot.type === 'sunset' ? <Sun className="w-3 h-3 text-amber-400" /> : <Coffee className="w-3 h-3 text-sky-300" />}
                      <span>{spot.tag}</span>
                    </span>
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <span className="text-[10px] text-white/80 block">{spot.neighborhood}</span>
                      <h4 className="font-editorial text-sm font-bold leading-tight">{spot.title}</h4>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between text-xs">
                    <p className="text-[11px] text-[#554D45] italic leading-relaxed">
                      {spot.redditQuote}
                    </p>
                    <div className="pt-2 border-t border-[#EFE7DC] text-[11px] font-semibold text-[#8C2D19]">
                      {spot.bestTimeOrOrder}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            MAX PHOTOS GALLERY SHOWCASE FOR THIS CITY
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE1] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C2D19] mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Curated Photo Collection</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                Vistas & Atmosphere of {city.name}
              </h2>
            </div>
            <span className="text-xs text-[#7A7167]">
              {city.galleryPhotos?.length || 6} High-Resolution Photos • Tap to Expand
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {city.galleryPhotos?.map((photoUrl, pIdx) => (
              <div
                key={pIdx}
                onClick={() => setActivePhotoUrl(photoUrl)}
                className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer photo-card-zoom border border-[#EFE7DC]"
              >
                <img
                  src={photoUrl}
                  alt={`${city.name} photo ${pIdx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-2.5 py-1 rounded-lg bg-white/90 text-[10px] font-bold text-[#201C1A] shadow-xs">
                    View Full
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            "TASTE OF THE CITY" REGIONAL CULINARY SHOWCASE
           ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE1] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
                <Utensils className="w-3.5 h-3.5" />
                <span>Culinary Identity</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                The Taste of {city.name}
              </h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF5ED] text-[#8C2D19] self-start sm:self-auto">
              Authentic Local Institutions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* City Taste Profile Box */}
            <div className="p-5 rounded-2xl bg-[#FCF8F5] border border-[#ECD7CE] space-y-3">
              <h3 className="font-bold text-sm text-[#8C2D19] uppercase tracking-wider">
                Flavor Palette
              </h3>
              <p className="font-editorial text-lg font-bold text-[#201C1A]">
                {city.tasteOfCity?.headline}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {city.tasteOfCity?.flavors?.map((fl, fIdx) => (
                  <span
                    key={fIdx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-[#8C2D19] border border-[#ECD7CE]"
                  >
                    {fl}
                  </span>
                ))}
              </div>
              <div className="pt-2 text-xs text-[#7A7167]">
                Famous institution: <strong className="text-[#201C1A]">{city.tasteOfCity?.famousEatery}</strong>
              </div>
            </div>

            {/* Individual Dishes for this city */}
            {cityDishes.map((dish) => (
              <div
                key={dish.id}
                className="rounded-2xl overflow-hidden border border-[#EFE7DC] bg-[#FAF7F2] flex flex-col justify-between"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase">
                    {dish.type}
                  </div>
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                    ₹{dish.approxPriceInr}
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-editorial text-base font-bold text-[#201C1A]">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-[#5D554C] mt-0.5 line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#EFE7DC] text-[11px] text-[#7A7167]">
                    Spot: <strong>{dish.iconicSpotName}</strong> ({dish.spotNeighborhood})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SIGNATURE 1-DAY WALKING TRAIL
           ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE1] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C2D19] mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Paced Day Trail</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                {persona?.name}'s Signature 1-Day Flow
              </h2>
            </div>
            <Link
              to="/planner"
              className="text-xs font-bold text-[#8C2D19] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Customize for 2-5 days</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19]">
                Morning ({trail.morning.time})
              </span>
              <h4 className="font-editorial text-base font-bold text-[#201C1A]">{trail.morning.title}</h4>
              <p className="text-xs text-[#5D554C] leading-relaxed">{trail.morning.desc}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19]">
                Afternoon ({trail.afternoon.time})
              </span>
              <h4 className="font-editorial text-base font-bold text-[#201C1A]">{trail.afternoon.title}</h4>
              <p className="text-xs text-[#5D554C] leading-relaxed">{trail.afternoon.desc}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19]">
                Evening ({trail.evening.time})
              </span>
              <h4 className="font-editorial text-base font-bold text-[#201C1A]">{trail.evening.title}</h4>
              <p className="text-xs text-[#5D554C] leading-relaxed">{trail.evening.desc}</p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CURATED PLACES GRID WITH CATEGORY FILTERS
           ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A]">
                Curated Places & Experiences
              </h2>
              <p className="text-xs sm:text-sm text-[#6E645A]">
                Monuments, ancient stepwells, ghats, and neighborhood trails.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedCategory === cat.id
                      ? 'text-white shadow-xs'
                      : 'bg-white border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                  }`}
                  style={{ backgroundColor: selectedCategory === cat.id ? primaryColor : undefined }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} onSaveToast={onSaveToast} />
            ))}
          </div>
        </section>
      </div>

      {/* Lightbox Preview Modal */}
      {activePhotoUrl && (
        <div
          onClick={() => setActivePhotoUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={activePhotoUrl}
              alt="Enlarged destination view"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setActivePhotoUrl(null)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-bold hover:bg-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

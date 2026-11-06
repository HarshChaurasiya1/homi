import React, { useState } from 'react'
import { useRouter } from '../lib/routerContext'
import { useAppData } from '../lib/dataStore'
import { useActiveCity, useSavedPlaces } from '../lib/storage'
import {
  Hotel,
  Car,
  Compass,
  Utensils,
  MapPin,
  Calendar,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  Sun,
  Trophy,
  Heart,
  Clock,
  Coins,
  ChevronRight,
} from 'lucide-react'

interface MMTHomeInterfaceProps {
  onSaveToast: (msg: string) => void
}

export const MMTHomeInterface: React.FC<MMTHomeInterfaceProps> = ({ onSaveToast }) => {
  const { navigate } = useRouter()
  const { places } = useAppData()
  const [activeCityId, setActiveCityId] = useActiveCity()
  const { isSaved, toggleSave } = useSavedPlaces()

  // Selected Service Tab (Like MakeMyTrip: Stays, Cabs, Boats, Food, Tours)
  const [activeService, setActiveService] = useState<'all' | 'stays' | 'cabs' | 'boats' | 'food' | 'tours'>('all')

  // Search card inputs
  const currentCity = activeCityId ? activeCityId.toLowerCase() : 'varanasi'
  const [selectedCity, setSelectedCity] = useState<string>(currentCity)
  const [travelDate, setTravelDate] = useState<string>('2026-11-08')
  const [travellers, setTravellers] = useState<'1' | '2' | '4' | 'family'>('2')
  const [budgetTier, setBudgetTier] = useState<'backpacker' | 'moderate' | 'luxury'>('moderate')

  // Leaderboard Tab (From Screenshot: Weekly, Monthly, All Time)
  const [leaderboardTab, setLeaderboardTab] = useState<'weekly' | 'monthly' | 'allTime'>('weekly')

  const availableCities = [
    { id: 'varanasi', name: 'Varanasi', tag: 'Ghats & Moksha', sunrise: '6:12 AM' },
    { id: 'jaipur', name: 'Jaipur', tag: 'Pink City Palaces', sunrise: '6:44 AM' },
    { id: 'delhi', name: 'Delhi', tag: 'Mughal & Metro', sunrise: '6:39 AM' },
    { id: 'udaipur', name: 'Udaipur', tag: 'Lakes & Havelis', sunrise: '6:49 AM' },
    { id: 'manali', name: 'Manali', tag: 'Pine Peaks & Snow', sunrise: '6:42 AM' },
    { id: 'mussoorie', name: 'Mussoorie', tag: 'Queen of Hills', sunrise: '6:37 AM' },
  ]

  const activeCityMeta = availableCities.find((c) => c.id === selectedCity) || availableCities[0]

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId)
    setActiveCityId(cityId)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/${selectedCity}`)
  }

  // Filtered simple cards based on active service
  const cityPlaces = places.filter((p) => p.cityId.toLowerCase() === selectedCity)

  // Top community leaderboard items
  const leaderboardItems = [
    {
      rank: 1,
      title: 'Subah-e-Banaras Dawn Wooden Boat',
      neighborhood: 'Assi to Manikarnika Ghat',
      votes: '984 Traveler Votes',
      photo: '/assets/cities/varanasi/sunrise-and-sunset/subah-e-banaras-classical-recital.webp',
      badge: '🏆 #1 Top Rated',
      route: '/varanasi',
    },
    {
      rank: 2,
      title: 'Ram Bhandar Urad Dal Kachori & Jalebi',
      neighborhood: 'Thatheri Bazaar, Chowk',
      votes: '918 Traveler Votes',
      photo: '/assets/cities/varanasi/food-and-sweets/rambhandar-kachori-sabzi-jalebi.webp',
      badge: '🥈 #2 Breakfast',
      route: '/varanasi',
    },
    {
      rank: 3,
      title: 'Kashi Vishwanath Corridor Riverfront',
      neighborhood: 'Lalita Ghat Ganga Dwar',
      votes: '872 Traveler Votes',
      photo: '/assets/cities/varanasi/temples-and-heritage/vishwanath-corridor-courtyard.webp',
      badge: '🥉 #3 Spiritual',
      route: '/varanasi',
    },
    {
      rank: 4,
      title: 'Fiery Desi Ghee Tamatar Chaat',
      neighborhood: 'Kashi Chaat Bhandar, Godowlia',
      votes: '790 Votes',
      photo: '/assets/cities/varanasi/food-and-sweets/tamatar-chaat-desi-ghee-spiced.webp',
      badge: 'Food Star',
      route: '/varanasi',
    },
    {
      rank: 5,
      title: 'Legendary Banarasi Magahi Meetha Paan',
      neighborhood: 'Keshav Tambool, Lanka BHU',
      votes: '730 Votes',
      photo: '/assets/cities/varanasi/food-and-sweets/banarasi-meetha-paan-gulkand.webp',
      badge: 'Dessert Icon',
      route: '/varanasi',
    },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* =========================================================================
          MAKEMYTRIP-STYLE TOP SERVICE SELECTOR (Clean rounded icons with active purple pill)
         ========================================================================= */}
      <section className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-slate-100 max-w-4xl mx-auto">
        <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
          <button
            onClick={() => setActiveService('all')}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
              activeService === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-[10px] sm:text-xs font-bold">All</span>
          </button>

          <button
            onClick={() => setActiveService('stays')}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
              activeService === 'stays'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Hotel className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-[10px] sm:text-xs font-bold">Stays</span>
          </button>

          <button
            onClick={() => setActiveService('cabs')}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
              activeService === 'cabs'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Car className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-[10px] sm:text-xs font-bold">Cabs</span>
          </button>

          <button
            onClick={() => setActiveService('boats')}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
              activeService === 'boats'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-[10px] sm:text-xs font-bold">Ghats</span>
          </button>

          <button
            onClick={() => setActiveService('food')}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
              activeService === 'food'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Utensils className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-[10px] sm:text-xs font-bold">Food</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          MAKEMYTRIP MAIN SEARCH & PLANNING CARD (Clean, Modern, Simple)
         ========================================================================= */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg shadow-indigo-100/50 border border-indigo-50 max-w-4xl mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Real-World Travel Engine</span>
            </span>
            <span className="text-xs text-slate-400">• Zero Hallucinations</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Tomorrow's Sunrise: <strong>{activeCityMeta.sunrise}</strong></span>
          </div>
        </div>

        {/* 4 Clean Search Rows */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Destination City */}
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-all">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-600" />
                <span>Destination City</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
              >
                {availableCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.tag})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Travel Date */}
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-all">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-600" />
                <span>Travel Date</span>
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 text-xs sm:text-sm focus:outline-none cursor-pointer"
              />
            </div>

            {/* 3. Travellers & Vibe */}
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-all">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-indigo-600" />
                <span>Travellers</span>
              </label>
              <select
                value={travellers}
                onChange={(e) => setTravellers(e.target.value as any)}
                className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
              >
                <option value="1">1 Person (Solo Explorer)</option>
                <option value="2">2 Persons (Couple / Friends)</option>
                <option value="4">4 Persons (Small Group)</option>
                <option value="family">Family (Parents & Kids)</option>
              </select>
            </div>

            {/* 4. Budget Tier */}
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-all">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                <Coins className="w-3 h-3 text-emerald-600" />
                <span>Budget Tier</span>
              </label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value as any)}
                className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
              >
                <option value="backpacker">Backpacker (₹1.5k / day)</option>
                <option value="moderate">Comfortable (₹3.5k / day)</option>
                <option value="luxury">Heritage Luxury (₹8k+ / day)</option>
              </select>
            </div>
          </div>

          {/* Large Solid Action Button (MakeMyTrip style CTA) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:flex-grow py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-extrabold shadow-lg shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH {selectedCity.toUpperCase()} EXPERIENCES & TIMINGS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/planner')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Custom Itinerary</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </form>
      </section>

      {/* =========================================================================
          COMMUNITY LEADERBOARD PODIUM (Directly inspired by the attached design image!)
         ========================================================================= */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 mb-1">
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Traveler Leaderboard • Top Rated Spots</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Most Loved Spots in {activeCityMeta.name}
            </h3>
          </div>

          {/* Segmented Pill Tabs from reference screenshot */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setLeaderboardTab('weekly')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                leaderboardTab === 'weekly'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setLeaderboardTab('monthly')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                leaderboardTab === 'monthly'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setLeaderboardTab('allTime')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                leaderboardTab === 'allTime'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* The 1st, 2nd, 3rd Podium Display (Exact Layout from Reference Image) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
          {/* #2 Rank (Left podium) */}
          <div
            onClick={() => navigate(leaderboardItems[1].route)}
            className="flex flex-col items-center text-center cursor-pointer group"
          >
            <div className="relative mb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src={leaderboardItems[1].photo}
                  alt={leaderboardItems[1].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-300 text-slate-800 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                2
              </span>
            </div>
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 line-clamp-1">
              {leaderboardItems[1].title}
            </h4>
            <span className="text-[10px] text-slate-500 font-medium">
              {leaderboardItems[1].votes}
            </span>
            <div className="w-full h-16 sm:h-20 bg-slate-100 rounded-t-2xl mt-2 flex items-center justify-center font-black text-slate-400 text-xl">
              2
            </div>
          </div>

          {/* #1 Rank (Center tallest podium) */}
          <div
            onClick={() => navigate(leaderboardItems[0].route)}
            className="flex flex-col items-center text-center cursor-pointer group"
          >
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-md group-hover:scale-105 transition-transform ring-4 ring-amber-100">
                <img
                  src={leaderboardItems[0].photo}
                  alt={leaderboardItems[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-900 text-xs font-black flex items-center justify-center shadow-sm">
                1
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1">
              {leaderboardItems[0].title}
            </h4>
            <span className="text-[10px] text-indigo-600 font-bold">
              {leaderboardItems[0].votes}
            </span>
            <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-indigo-100 to-indigo-50 rounded-t-2xl mt-2 flex items-center justify-center font-black text-indigo-600 text-2xl border-t-2 border-indigo-200">
              1
            </div>
          </div>

          {/* #3 Rank (Right podium) */}
          <div
            onClick={() => navigate(leaderboardItems[2].route)}
            className="flex flex-col items-center text-center cursor-pointer group"
          >
            <div className="relative mb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-600 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src={leaderboardItems[2].photo}
                  alt={leaderboardItems[2].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                3
              </span>
            </div>
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 line-clamp-1">
              {leaderboardItems[2].title}
            </h4>
            <span className="text-[10px] text-slate-500 font-medium">
              {leaderboardItems[2].votes}
            </span>
            <div className="w-full h-12 sm:h-16 bg-slate-100 rounded-t-2xl mt-2 flex items-center justify-center font-black text-slate-400 text-xl">
              3
            </div>
          </div>
        </div>

        {/* Lower ranks list (Rank 4, 5 like in screenshot) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          {leaderboardItems.slice(3).map((item) => (
            <div
              key={item.rank}
              onClick={() => navigate(item.route)}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-black text-slate-400 text-sm">
                  {item.rank}
                </span>
                <img
                  src={item.photo}
                  alt={item.title}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                  <span className="text-[10px] text-slate-400">{item.neighborhood}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600">{item.votes}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          TRENDING REAL-WORLD EXPERIENCES (Ultra-Clean, Card-based, No Extra Clutter)
         ========================================================================= */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Trending in {activeCityMeta.name}
            </h3>
            <p className="text-xs text-slate-500">Verified timings, tariffs, and access.</p>
          </div>
          <button
            onClick={() => navigate(`/${selectedCity}`)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All ({cityPlaces.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cityPlaces.slice(0, 4).map((place) => {
            const saved = isSaved(place.id)

            return (
              <div
                key={place.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div
                  className="relative h-40 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/places/${place.slug}`)}
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{place.estimatedVisitMinutes}m</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSave(place.id)
                      onSaveToast(saved ? `Removed ${place.name}` : `Saved ${place.name} to favorites!`)
                    }}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-xs transition-colors ${
                      saved ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-black/70'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      {place.category}
                    </span>
                    <h4
                      onClick={() => navigate(`/places/${place.slug}`)}
                      className="font-bold text-sm text-slate-900 leading-snug line-clamp-1 hover:text-indigo-600 transition-colors cursor-pointer mt-0.5"
                    >
                      {place.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {place.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">
                      {typeof place.ticketPrice.indian === 'number'
                        ? `₹${place.ticketPrice.indian}`
                        : place.ticketPrice.indian}
                    </span>
                    <button
                      onClick={() => navigate(`/places/${place.slug}`)}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* =========================================================================
          MAKEMYTRIP TRANSIT FARE ESTIMATOR CARD (Door-to-door cab vs auto vs rickshaw)
         ========================================================================= */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 sm:p-6 border border-indigo-100 max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/80 pb-3">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              Varanasi Transit & Cab Fare Estimator
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-white/80 px-2.5 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
            Live Rate Card
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">
              E-Rickshaw (Shared / Private)
            </span>
            <div className="text-base font-extrabold text-slate-900">₹80 – ₹140</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Cantt Station to Godowlia Crossing (Navigates pedestrian zones best).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">
              Auto Rickshaw
            </span>
            <div className="text-base font-extrabold text-slate-900">₹150 – ₹220</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Pre-negotiated rate. Drops at Godowlia police barricade.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">
              AC Cab (Ola / Uber / Chauffeur)
            </span>
            <div className="text-base font-extrabold text-slate-900">₹280 – ₹420</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Drops at Maidagin or Church Crossing; final 400m walk into ghats.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

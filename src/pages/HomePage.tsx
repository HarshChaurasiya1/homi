import React, { useState } from 'react'
import { BRAND } from '../config/brand'
import { CITIES } from '../data/cities'
import { PLACES } from '../data/places'
import { LOCAL_DISHES } from '../data/dishes'
import { SearchBar } from '../components/SearchBar'
import { PlaceCard } from '../components/PlaceCard'
import { ThemeMotif } from '../components/ThemeMotif'
import { Link } from '../lib/router'
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Utensils,
  Calendar,
} from 'lucide-react'


export const HomePage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  const [selectedFoodCity, setSelectedFoodCity] = useState<'all' | 'delhi' | 'jaipur'>('all')

  const delhiCity = CITIES.delhi
  const jaipurCity = CITIES.jaipur

  // Curated highlight places (3 Delhi, 3 Jaipur)
  const popularExperiences = PLACES.filter((p) => p.isMustVisit).slice(0, 6)

  // Curated dishes
  const filteredDishes =
    selectedFoodCity === 'all'
      ? LOCAL_DISHES.slice(0, 6)
      : LOCAL_DISHES.filter((d) => d.cityId === selectedFoodCity)

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-8 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Subtle decorative architectural background accents */}
        <div className="absolute top-2 left-6 hidden lg:block opacity-30 pointer-events-none">
          <ThemeMotif type="mughal-arch" width={72} height={72} />
        </div>
        <div className="absolute top-2 right-6 hidden lg:block opacity-30 pointer-events-none">
          <ThemeMotif type="jharokha-scallop" width={72} height={72} />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE8DC] border border-[#DDD3C5] text-xs font-semibold uppercase tracking-wider text-[#732919] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#8C2D19]" />
          <span>India Travel Discovery • V1 Pilot</span>
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
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-[#7A7167]">
            <span className="font-medium">Try searching:</span>
            <Link
              to="/delhi"
              className="hover:text-[#8C2D19] underline underline-offset-2 decoration-[#D5C9BC]"
            >
              Old Delhi Food Walk
            </Link>
            <span>•</span>
            <Link
              to="/jaipur"
              className="hover:text-[#C85A32] underline underline-offset-2 decoration-[#D5C9BC]"
            >
              Amer Fort Sunset
            </Link>
            <span>•</span>
            <Link
              to="/places/qutub-minar"
              className="hover:text-[#8C2D19] underline underline-offset-2 decoration-[#D5C9BC]"
            >
              Qutub Minar
            </Link>
          </div>
        </div>
      </section>

      {/* Pilot Destination City Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
              Featured Destinations
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
              Choose your pilot city
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E645A] max-w-md">
            Each city has its own distinct heritage palette, verified transit guidance, and local friend notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Delhi City Card */}
          <div className="group relative rounded-3xl overflow-hidden border border-[#E5DACB] bg-[#F9F6F0] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D5]">
              <img
                src={delhiCity.heroImage}
                alt={delhiCity.heroImageAlt}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8C2D19] text-white shadow-xs">
                  National Capital
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold">Delhi</h3>
                  <span className="text-sm font-medium text-stone-200">({delhiCity.hindiName})</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-1">
                  {delhiCity.tagline}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
              <div className="space-y-3 mb-6">
                <p className="text-xs sm:text-sm text-[#554D45] leading-relaxed">
                  {delhiCity.heroDescription}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EFE7DC]">
                    <span className="text-[#8C8276] block font-medium">Ideal Stay</span>
                    <span className="font-bold text-[#201C1A]">3 Days • Metro Connected</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EFE7DC]">
                    <span className="text-[#8C8276] block font-medium">Best Season</span>
                    <span className="font-bold text-[#201C1A]">October to March</span>
                  </div>
                </div>
              </div>

              <Link
                to="/delhi"
                className="w-full py-3 px-4 rounded-xl bg-[#8C2D19] text-white text-sm font-semibold hover:bg-[#722312] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Explore Delhi Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Jaipur City Card */}
          <div className="group relative rounded-3xl overflow-hidden border border-[#ECD7CE] bg-[#FCF7F4] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#ECE0D9]">
              <img
                src={jaipurCity.heroImage}
                alt={jaipurCity.heroImageAlt}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C85A32] text-white shadow-xs">
                  The Pink City
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold">Jaipur</h3>
                  <span className="text-sm font-medium text-stone-200">({jaipurCity.hindiName})</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-1">
                  {jaipurCity.tagline}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
              <div className="space-y-3 mb-6">
                <p className="text-xs sm:text-sm text-[#554D45] leading-relaxed">
                  {jaipurCity.heroDescription}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-[#F2E5DF]">
                    <span className="text-[#8C8276] block font-medium">Ideal Stay</span>
                    <span className="font-bold text-[#201C1A]">2–3 Days • Forts & Bazaars</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#F2E5DF]">
                    <span className="text-[#8C8276] block font-medium">Best Season</span>
                    <span className="font-bold text-[#201C1A]">October to March</span>
                  </div>
                </div>
              </div>

              <Link
                to="/jaipur"
                className="w-full py-3 px-4 rounded-xl bg-[#C85A32] text-white text-sm font-semibold hover:bg-[#AB4B27] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Explore Jaipur Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Experiences Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
              Curated Highlights
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
              Popular Local Experiences
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
            <Link to="/delhi" className="text-[#8C2D19] hover:underline">
              All Delhi ({PLACES.filter((p) => p.cityId === 'delhi').length})
            </Link>
            <span>•</span>
            <Link to="/jaipur" className="text-[#C85A32] hover:underline">
              All Jaipur ({PLACES.filter((p) => p.cityId === 'jaipur').length})
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularExperiences.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onSaveToast={onSaveToast}
              themeColor={place.cityId === 'delhi' ? '#8C2D19' : '#C85A32'}
            />
          ))}
        </div>
      </section>

      {/* Local Food Discovery Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 bg-[#F5EFE6] rounded-3xl p-6 sm:p-10 border border-[#E5DACB]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
              <Utensils className="w-3.5 h-3.5" />
              <span>Iconic Culinary Trails</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A]">
              Taste each city like a local
            </h2>
            <p className="text-xs sm:text-sm text-[#665D54] mt-1">
              Legendary stalls and haveli kitchens passed down through generations.
            </p>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => setSelectedFoodCity('delhi')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedFoodCity === 'delhi'
                  ? 'bg-[#8C2D19] text-white'
                  : 'bg-white text-[#8C2D19] hover:bg-[#F5EBE6]'
              }`}
            >
              Delhi Flavors
            </button>
            <button
              onClick={() => setSelectedFoodCity('jaipur')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedFoodCity === 'jaipur'
                  ? 'bg-[#C85A32] text-white'
                  : 'bg-white text-[#C85A32] hover:bg-[#FBECE6]'
              }`}
            >
              Jaipur Flavors
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DFD3] shadow-xs flex flex-col justify-between hover:border-[#D5C9BC] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      dish.cityId === 'delhi'
                        ? 'bg-[#F5EBE6] text-[#8C2D19]'
                        : 'bg-[#FBECE6] text-[#C85A32]'
                    }`}
                  >
                    {dish.cityId === 'delhi' ? 'Delhi' : 'Jaipur'}
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
                <span className="text-[#8C8276] block">Iconic Spot:</span>
                <span className="font-semibold text-[#201C1A]">{dish.iconicSpotName}</span>
                <span className="text-[#786F66] block text-[11px]">{dish.spotNeighborhood}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How HOMI Helps Users Travel Confidently */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
            The HOMI Difference
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
            How HOMI helps you travel confidently
          </h2>
          <p className="text-xs sm:text-sm text-[#665D54] mt-2">
            No sponsored rankings, no generic tourist traps, no bloated client-side scripts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#8C2D19] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#201C1A] mb-2">
              Verified Timings & Tariffs
            </h3>
            <p className="text-xs sm:text-sm text-[#5D554C] leading-relaxed">
              Ticket prices and opening hours are manually cross-referenced against official ASI, DTTDC, and Rajasthan Tourism records.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FBECE6] text-[#C85A32] flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#201C1A] mb-2">
              Public Transit First
            </h3>
            <p className="text-xs sm:text-sm text-[#5D554C] leading-relaxed">
              Every destination highlights the exact nearest Delhi or Jaipur Metro station, line color, and exit gate number for effortless navigation.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#201C1A] flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#201C1A] mb-2">
              Transparent Trip Budgeting
            </h3>
            <p className="text-xs sm:text-sm text-[#5D554C] leading-relaxed">
              Our deterministic itinerary engine calculates realistic Indian Rupee expenses with distinct room and per-person breakdowns.
            </p>
          </div>
        </div>

        {/* CTA Banner to Planner */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-[#201C1A] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold">
              Ready to map your days?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-lg">
              Generate a realistic day-by-day starter plan for Delhi or Jaipur in 10 seconds.
            </p>
          </div>
          <Link
            to="/planner"
            className="px-6 py-3 rounded-xl bg-white text-[#201C1A] text-sm font-bold hover:bg-[#F2ECE1] transition-colors whitespace-nowrap"
          >
            Open Trip Planner
          </Link>
        </div>
      </section>
    </div>
  )
}

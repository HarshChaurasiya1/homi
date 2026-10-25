import React, { useState } from 'react'
import { BRAND } from '../config/brand'
import { useAppData } from '../lib/dataStore'
import { useActiveCity } from '../lib/storage'
import { SearchBar } from '../components/SearchBar'
import { PlaceCard } from '../components/PlaceCard'
import { ThemeMotif, type MotifVariant } from '../components/ThemeMotif'
import { InteractiveTripBuilder } from '../components/InteractiveTripBuilder'
import { CityEditionHero } from '../components/CityEditionHero'
import { CityTripFlowchart } from '../components/CityTripFlowchart'
import { Link } from '../lib/router'
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Utensils,
  Camera,
  RotateCcw,
} from 'lucide-react'

export const HomePage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  const { cities, places, dishes } = useAppData()
  const [activeCityId, setActiveCityId] = useActiveCity()
  const [selectedFoodCity, setSelectedFoodCity] = useState<string>('all')
  const [selectedEditionId, setSelectedEditionId] = useState<string>('jaipur')

  const currentEdition = activeCityId ? activeCityId.toLowerCase() : selectedEditionId

  const handleScrollToFlowchart = () => {
    const el = document.getElementById('city-flowchart-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const cityCards = Object.values(cities)
  const activeCity = activeCityId ? cities[activeCityId.toLowerCase()] : null

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

  // Active city exclusive recommendations (Zero cross-city clutter)
  const activeCityDishes = activeCity
    ? dishes.filter((d) => d.cityId.toLowerCase() === activeCity.id.toLowerCase())
    : []

  const activeCityPlaces = activeCity
    ? places.filter((p) => p.cityId.toLowerCase() === activeCity.id.toLowerCase())
    : []

  // Global curated highlight places (when no city selected)
  const popularExperiences = places.filter((p) => p.isMustVisit).slice(0, 6)

  // Global curated dishes (when no city selected)
  const filteredDishes =
    selectedFoodCity === 'all'
      ? dishes.slice(0, 6)
      : dishes.filter((d) => d.cityId.toLowerCase() === selectedFoodCity.toLowerCase())

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* =========================================================================
          FEATURED CITY EDITION SHOWCASE (Clean Theme inspired by Reference Image)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <CityEditionHero
          currentCityId={currentEdition}
          onSelectCity={
            activeCityId
              ? undefined
              : (cityId) => setSelectedEditionId(cityId)
          }
          onExploreFlowchart={handleScrollToFlowchart}
        />
      </section>

      {/* =========================================================================
          INTERACTIVE CITY TRIP FLOWCHART (Step-by-Step Flow for User)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <CityTripFlowchart cityId={currentEdition} />
      </section>

      {/* =========================================================================
          HERO SECTION: DYNAMICALLY SWITCHES BETWEEN GLOBAL & SINGLE-CITY ISOLATION
         ========================================================================= */}
      <section className="relative pt-10 sm:pt-14 pb-4 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Subtle decorative architectural background accents */}
        <div className="absolute top-4 left-6 hidden lg:block opacity-25 pointer-events-none animate-float">
          <ThemeMotif
            type={activeCity ? (cityMotifs[activeCity.id] || 'jharokha-scallop') : 'jharokha-scallop'}
            width={72}
            height={72}
          />
        </div>
        <div
          className="absolute top-4 right-6 hidden lg:block opacity-25 pointer-events-none animate-float"
          style={{ animationDelay: '1.5s' }}
        >
          <ThemeMotif
            type={activeCity ? (cityMotifs[activeCity.id] || 'mewar-arch-lake') : 'mewar-arch-lake'}
            width={72}
            height={72}
          />
        </div>

        {activeCity ? (
          /* =========================================================================
             ACTIVE CITY SELECTED: ZERO CLUTTER, EXCLUSIVELY FOCUSED ON ACTIVE CITY
             ========================================================================= */
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5ED] border border-[#ECD7CE] text-xs font-bold text-[#8C2D19] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Active Destination: {activeCity.name}</span>
              <span className="text-[#8A8177] font-normal">• Host: {activeCity.persona?.name || 'Local Guide'}</span>
              <button
                onClick={() => setActiveCityId(null)}
                className="ml-2 text-[11px] underline text-[#7A7167] hover:text-[#8C2D19] font-medium flex items-center gap-1 cursor-pointer"
                title="Choose a different destination"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Switch City</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3">
              <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#201C1A] tracking-tight">
                {activeCity.name}
              </h1>
              {activeCity.hindiName && (
                <span className="font-editorial text-2xl sm:text-3xl font-light text-[#8C2D19]">
                  ({activeCity.hindiName})
                </span>
              )}
            </div>

            <p className="font-editorial text-lg sm:text-xl text-[#7D736A] italic max-w-2xl mx-auto">
              “{activeCity.tagline}”
            </p>

            <p className="mt-2 text-xs sm:text-sm text-[#5D554C] max-w-xl mx-auto leading-relaxed">
              {activeCity.heroDescription}
            </p>

            <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder={`Search places, ghats, or food in ${activeCity.name}...`} />
            </div>
          </div>
        ) : (
          /* =========================================================================
             NO CITY SELECTED YET: CLEAN GLOBAL DISCOVERY LANDING
             ========================================================================= */
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE8DC] border border-[#DDD3C5] text-xs font-semibold uppercase tracking-wider text-[#732919] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#8C2D19]" />
              <span>User Board • Instant Interactive Companion</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#201C1A] tracking-tight max-w-3xl mx-auto leading-[1.12]">
              {BRAND.tagline}
            </h1>

            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#5D554C] max-w-2xl mx-auto leading-relaxed">
              {BRAND.subtagline}
            </p>

            <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          INTERACTIVE 1-BY-1 TRIP BUILDER & ADVENTURE BOARD
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <InteractiveTripBuilder
          onSaveToast={onSaveToast}
          initialCityId={activeCity ? activeCity.id : undefined}
        />
      </section>

      {/* =========================================================================
          IF ACTIVE CITY IS SELECTED: SHOW EXCLUSIVE ACTIVE CITY CONTENT ONLY!
          USER NEVER SEES BUTTONS OR CARDS OF OTHER CITIES.
         ========================================================================= */}
      {activeCity ? (
        <>
          {/* Active City's Exclusive Culinary Soul */}
          {activeCityDishes.length > 0 && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 bg-[#F5EFE6] rounded-3xl p-6 sm:p-10 border border-[#E5DACB]">
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Culinary Soul • {activeCity.name}</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A]">
                  Taste {activeCity.name} Like a Local
                </h2>
                <p className="text-xs sm:text-sm text-[#665D54] mt-1">
                  Verified street specialties and legendary secret spots curated by {activeCity.persona?.name || 'locals'}.
                </p>
              </div>

              {/* Grid of Dishes for THIS ACTIVE CITY ONLY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCityDishes.map((dish) => (
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
                        {dish.type}
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
          )}

          {/* Active City's Must-Visit Landmarks */}
          {activeCityPlaces.length > 0 && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
                    Signature Landmarks • {activeCity.name}
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
                    Must-Visit Heritage & Vistas
                  </h2>
                </div>
                <Link
                  to={`/${activeCity.id}`}
                  className="text-xs sm:text-sm font-semibold text-[#8C2D19] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Explore full {activeCity.name} destination guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCityPlaces.slice(0, 6).map((place) => (
                  <PlaceCard key={place.id} place={place} onSaveToast={onSaveToast} />
                ))}
              </div>
            </section>
          )}

          {/* Switch Destination Clean Card */}
          <section className="max-w-md mx-auto px-4 text-center">
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E5DACB] space-y-3">
              <p className="text-xs text-[#7A7167]">
                Currently exploring <strong>{activeCity.name}</strong> exclusively.
              </p>
              <button
                onClick={() => setActiveCityId(null)}
                className="px-5 py-2.5 rounded-2xl bg-white border border-[#D5C9BC] text-xs font-bold text-[#201C1A] hover:bg-[#201C1A] hover:text-white transition-all shadow-2xs inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Explore Other Indian Cities</span>
              </button>
            </div>
          </section>
        </>
      ) : (
        /* =========================================================================
           IF NO CITY IS ACTIVE: SHOW GLOBAL 5-DESTINATION SELECTION & FOOD TASTING
           ========================================================================= */
        <>
          {/* Destinations & Cities Showcase */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
                  Curated Destinations & Local Companions
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
                  Five Indian Souls, Each Guided by a Local Friend
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

                      {/* Action Link: sets active city and opens discovery */}
                      <button
                        type="button"
                        onClick={() => setActiveCityId(city.id)}
                        className="w-full py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-95 shadow-xs cursor-pointer"
                        style={{ backgroundColor: badgeColor }}
                      >
                        <span>Explore with {persona?.name?.split(' ')[1] || city.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
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
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
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
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
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
        </>
      )}
    </div>
  )
}

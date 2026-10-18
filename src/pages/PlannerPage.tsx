import React, { useState } from 'react'
import type {
  PlannerInputs,
  DestinationChoice,
  BudgetTier,
  GeneratedItinerary,
} from '../lib/plannerEngine'
import { generateItinerary, formatInr } from '../lib/plannerEngine'
import { getPlannerDraft, savePlannerDraft, useSavedPlaces } from '../lib/storage'
import { useAppData } from '../lib/dataStore'
import { Link } from '../lib/router'
import {
  Wallet,
  Utensils,
  Navigation,
  Bookmark,
  Info,
  Calendar,
  Camera,
  Quote,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react'

export const PlannerPage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  const { isSaved, toggleSave } = useSavedPlaces()
  const { cities } = useAppData()

  const cityList = Object.values(cities)

  // Default state: 2 simple things (destination, days) + budgetTier
  const defaultInputs: PlannerInputs = {
    destination: 'jaipur',
    days: 3,
    travellers: 2,
    budgetTier: 'moderate',
    interests: ['heritage', 'food'],
    nationality: 'indian',
  }

  const [inputs, setInputs] = useState<PlannerInputs>(() => {
    const draft = getPlannerDraft<PlannerInputs>()
    return draft || defaultInputs
  })

  const [itinerary, setItinerary] = useState<GeneratedItinerary>(() => {
    return generateItinerary(inputs)
  })

  // Selected photo for gallery preview modal
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null)

  // Re-run whenever 2 simple things or budget changes
  const handleSimpleChange = (
    destination: DestinationChoice,
    days: number,
    budgetTier: BudgetTier
  ) => {
    const updated: PlannerInputs = {
      ...inputs,
      destination,
      days,
      budgetTier,
    }
    setInputs(updated)
    const newPlan = generateItinerary(updated)
    setItinerary(newPlan)
    savePlannerDraft(updated)
  }

  const budget = itinerary.budget
  const currentCity = cities[inputs.destination.toLowerCase()] || cities.jaipur || cityList[0]
  const persona = itinerary.persona || currentCity?.persona

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Editorial Header */}
      <section className="bg-white border-b border-[#E8DFD3] pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
            <Calendar className="w-3.5 h-3.5" />
            <span>User Board • 2-Step Simple Discovery</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#201C1A]">
            Curated by Your Authentic Local Companion
          </h1>

          <p className="text-sm sm:text-base text-[#645C55] max-w-2xl mx-auto leading-relaxed">
            Just pick your city, trip days, and daily budget. Your local friend (like Jaipur's <em>Bhaisaab</em> or Varanasi's <em>Banarasi Bhaiya</em>) crafts your personalized itinerary with verified rupee expenses.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* =========================================================================
            USER BOARD SIMPLIFIED INPUT CARD: ASK SIMPLE 2 THINGS + BUDGET
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE1] pb-4">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                Customize in 2 Simple Steps
              </h2>
              <p className="text-xs text-[#7D736A]">
                No complex forms. Select your destination, duration, and budget.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
              ✓ Instant Real-Time Plan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* THING 1: Destination City */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C2D19] block">
                1. Where are you traveling?
              </label>
              <div className="grid grid-cols-1 gap-2">
                {cityList.map((city) => {
                  const isSelected = inputs.destination.toLowerCase() === city.id.toLowerCase()
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSimpleChange(city.id, inputs.days, inputs.budgetTier)}
                      className={`p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-3 border ${
                        isSelected
                          ? 'bg-[#201C1A] text-white border-[#201C1A] shadow-xs'
                          : 'bg-[#F9F7F3] border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={city.heroImage}
                          alt={city.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold block">{city.name}</span>
                            {city.hindiName && (
                              <span className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-[#8A8177]'}`}>
                                {city.hindiName}
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] block ${isSelected ? 'text-white/80' : 'text-[#7A7167]'}`}>
                            Guide: {city.persona?.name || 'Local Companion'}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#E67E22] flex-shrink-0 animate-ping"></span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* THING 2: Number of Days */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C2D19] block">
                2. How many days?
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { days: 2, label: '2 Days • Weekend Escape', sub: 'Signature landmarks, morning tea & sunsets' },
                  { days: 3, label: '3 Days • Classic Discovery', sub: 'Recommended balance of heritage, food & leisure' },
                  { days: 4, label: '4 Days • Immersive Cultural', sub: 'Deep dive into hidden stepwells, alleys & craft' },
                  { days: 5, label: '5 Days • Slow Mountain / Royal', sub: 'Relaxed pacing, photography & surrounding hills' },
                ].map((d) => {
                  const isSelected = inputs.days === d.days
                  return (
                    <button
                      key={d.days}
                      type="button"
                      onClick={() => handleSimpleChange(inputs.destination, d.days, inputs.budgetTier)}
                      className={`p-3 rounded-2xl text-left transition-all border ${
                        isSelected
                          ? 'bg-[#8C2D19] text-white border-[#8C2D19] shadow-xs'
                          : 'bg-[#F9F7F3] border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      <span className="text-xs font-bold block">{d.label}</span>
                      <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#7D736A]'}`}>
                        {d.sub}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* BUDGET: Budget Style */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C2D19] block">
                3. Trip Budget Style
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: 'budget',
                    title: '₹ Pocket-Friendly',
                    rate: 'Hostels, Street Chaat, Shared E-autos',
                    room: '~₹1.4k/night',
                  },
                  {
                    id: 'moderate',
                    title: '₹₹ Comfortable Haveli',
                    rate: 'Heritage Haveli, Rooftop Cafes, App Cabs',
                    room: '~₹3.8k/night',
                  },
                  {
                    id: 'premium',
                    title: '₹₹₹ Shahi / Palace Luxury',
                    rate: 'Royal Palace Suites, AC Chauffeur, Fine Dining',
                    room: '~₹9.8k/night',
                  },
                ].map((tier) => {
                  const isSelected = inputs.budgetTier === tier.id
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleSimpleChange(inputs.destination, inputs.days, tier.id as BudgetTier)}
                      className={`p-3 rounded-2xl text-left transition-all border ${
                        isSelected
                          ? 'bg-[#201C1A] text-white border-[#201C1A] shadow-xs'
                          : 'bg-[#F9F7F3] border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      <span className="text-xs font-bold block">{tier.title}</span>
                      <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#7D736A]'}`}>
                        {tier.rate}
                      </span>
                      <span className={`text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#EAE0D2] text-[#8C2D19]'}`}>
                        {tier.room}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            AUTHENTIC LOCAL COMPANION HERO CARD (JAIPUR BHAISAAB / BANNA SA / ETC.)
           ========================================================================= */}
        {persona && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#E5DACB] shadow-md relative overflow-hidden">
            {/* Cultural background pattern & glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E67E22]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#8C2D19] shadow-sm animate-float flex-shrink-0">
                    <img
                      src={persona.avatarImage || currentCity?.heroImage}
                      alt={persona.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[#8C2D19] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs animate-glow">
                    {persona.badge || 'Local Guide'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-2xl font-bold text-[#201C1A]">
                      {persona.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-[#8C2D19]" />
                  </div>
                  <p className="text-xs font-medium text-[#7D736A]">
                    {persona.title}
                  </p>
                  <p className="text-xs text-[#8C2D19] font-bold flex items-center gap-1">
                    <span>Curator for {currentCity?.name} ({inputs.days} Days Itinerary)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <Link
                  to={`/${currentCity?.id}`}
                  className="px-4 py-2 rounded-xl bg-[#F5EFE6] text-[#8C2D19] text-xs font-bold hover:bg-[#EAE0D2] transition-colors flex items-center gap-1"
                >
                  <span>Explore {currentCity?.name} City Guide</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Dialect Voice & Authentic Quote */}
            <div className="mt-6 pt-6 border-t border-[#F2ECE1] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FCF8F5] border border-[#ECD7CE] space-y-1.5 relative">
                <Quote className="w-4 h-4 text-[#8C2D19]/40 absolute top-3 right-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19] block">
                  Authentic Dialect Welcome:
                </span>
                <p className="font-medium text-[#201C1A] text-sm leading-relaxed italic">
                  "{persona.greeting}"
                </p>
                <p className="text-xs text-[#554D45] leading-relaxed">
                  {persona.dialectQuote}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#E7D8C4] space-y-1.5 text-[#735A28]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B2226] block">
                  {persona.name}'s Secret Insider Tip:
                </span>
                <p className="text-xs text-[#523B17] leading-relaxed font-medium">
                  {persona.localTip}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#7A7167]">
                  <span>Pacing: <strong>Geographically Clustered</strong></span>
                  <span>Signature Food: <strong>{currentCity?.tasteOfCity?.signatureDish}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TRANSPARENT ITEMISED RUPEE BUDGET CARD
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
                <Wallet className="w-4 h-4" />
                <span>Honest Itemized Rupee Budget</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-1">
                {formatInr(budget.grandTotal)}
                <span className="text-sm font-normal text-[#645C55] ml-2">
                  ({formatInr(budget.perPersonTotal)} / person)
                </span>
              </h3>
            </div>

            <div className="text-xs text-[#7A7167] bg-[#F9F6F0] p-2.5 rounded-xl border border-[#EFE7DC] self-start sm:self-auto">
              <span>{inputs.travellers} Person(s) • {inputs.days} Day(s) • {budget.roomCount} Room(s)</span>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#201C1A] block">Accommodation ({budget.nights} Nights)</span>
                <span className="text-xs text-[#7D736A]">{budget.accommodationDescription}</span>
              </div>
              <span className="font-bold text-[#201C1A] whitespace-nowrap ml-3">
                {formatInr(budget.accommodationTotal)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#201C1A] block">Food & Cultural Tastings</span>
                <span className="text-xs text-[#7D736A]">{budget.foodDescription}</span>
              </div>
              <span className="font-bold text-[#201C1A] whitespace-nowrap ml-3">
                {formatInr(budget.foodTotal)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#201C1A] block">Local City Transit</span>
                <span className="text-xs text-[#7D736A]">{budget.transportDescription}</span>
              </div>
              <span className="font-bold text-[#201C1A] whitespace-nowrap ml-3">
                {formatInr(budget.transportTotal)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#201C1A] block">Verified Monument Tariffs</span>
                <span className="text-xs text-[#7D736A]">{budget.ticketsDescription}</span>
              </div>
              <span className="font-bold text-[#201C1A] whitespace-nowrap ml-3">
                {formatInr(budget.ticketsTotal)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#F9F7F3] border border-[#EBE3D7] text-xs text-[#6E645A] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#8C2D19]" />
              <span>Incidental buffer (8% for tea & shoe tokens): <strong>{formatInr(budget.bufferTotal)}</strong></span>
            </div>
            <span className="text-[#8C2D19] font-semibold text-[11px]">No hidden commissions</span>
          </div>
        </div>

        {/* =========================================================================
            DAY-BY-DAY ITINERARY WITH PHOTOS AND LOCAL COMPANION SIGN-OFF
           ========================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5DACB] pb-3">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                Day-by-Day Schedule Planned by {persona?.name}
              </h2>
              <p className="text-xs text-[#7D736A]">
                Ordered with geographic common sense to avoid back-and-forth travel.
              </p>
            </div>
            <span className="text-xs font-bold text-[#8C2D19] px-3 py-1 rounded-full bg-[#F5EFE6]">
              {itinerary.days.length} Days Itinerary
            </span>
          </div>

          <div className="space-y-8">
            {itinerary.days.map((day) => (
              <div
                key={day.dayNumber}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-6"
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F2ECE1] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#201C1A] text-white text-xs font-bold flex items-center justify-center">
                      {day.dayNumber}
                    </span>
                    <div>
                      <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#201C1A]">
                        Day {day.dayNumber}: {day.themeTitle}
                      </h3>
                      <span className="text-xs text-[#7D736A] block">
                        Area: {day.geographicArea}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F5EFE6] text-[#8C2D19] self-start sm:self-auto">
                    {day.cityName}
                  </span>
                </div>

                <p className="text-xs text-[#6E645A] italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EFE7DC]">
                  💡 <strong>{persona?.name}'s Note:</strong> {day.dayNotes}
                </p>

                {/* Day Stops with Photos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {day.stops.map((stop, sIdx) => {
                    const place = stop.place
                    const saved = isSaved(place.id)

                    return (
                      <div
                        key={sIdx}
                        className="rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] hover:border-[#DDD0BE] transition-all flex flex-col justify-between overflow-hidden photo-card-zoom"
                      >
                        <div className="relative h-36 overflow-hidden">
                          <img
                            src={place.image}
                            alt={place.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                            {stop.slot}
                          </div>

                          <button
                            onClick={() => {
                              const nowSaved = toggleSave(place.id)
                              onSaveToast(
                                nowSaved
                                  ? `Saved "${place.name}"`
                                  : `Removed "${place.name}"`
                              )
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#201C1A] shadow-xs"
                            aria-label={`Save ${place.name}`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#8C2D19] text-[#8C2D19]' : ''}`} />
                          </button>
                        </div>

                        <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-[#8C2D19] font-bold">
                              <span>{stop.timingNote}</span>
                              {stop.ticketCostInr > 0 ? (
                                <span>₹{stop.ticketCostInr} tariff</span>
                              ) : (
                                <span className="text-emerald-700">Free entry</span>
                              )}
                            </div>

                            <h4 className="font-editorial text-base font-bold text-[#201C1A] hover:text-[#8C2D19] transition-colors mt-1">
                              <Link to={`/places/${place.slug}`}>{place.name}</Link>
                            </h4>

                            <p className="text-xs text-[#5D554C] mt-1 line-clamp-2">
                              {place.shortDescription}
                            </p>
                          </div>

                          {/* Meal recommendation */}
                          {stop.curatorMealSuggestion && (
                            <div className="pt-2 border-t border-[#EFE7DC] flex items-start gap-1.5 text-xs text-[#735A28]">
                              <Utensils className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#D97706]" />
                              <span className="line-clamp-2">{stop.curatorMealSuggestion}</span>
                            </div>
                          )}

                          {/* Transit and Maps */}
                          <div className="pt-2 border-t border-[#EFE7DC] flex items-center justify-between text-[11px] text-[#8C8276]">
                            <span className="line-clamp-1 truncate max-w-[150px]">
                              {place.nearestTransit.stationOrStop}
                            </span>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#8C2D19] font-bold hover:underline flex items-center gap-1"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Map</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            MAX PHOTOS SHOWCASE & VISUAL CITY GALLERY
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE1] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C2D19] mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Visual Photo Gallery • {currentCity?.name}</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                The Atmosphere of {currentCity?.name}
              </h2>
            </div>
            <span className="text-xs text-[#7A7167]">
              {currentCity?.galleryPhotos?.length || 6} Curated High-Res Photos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {currentCity?.galleryPhotos?.map((photoUrl, pIdx) => (
              <div
                key={pIdx}
                onClick={() => setActivePhotoUrl(photoUrl)}
                className="group relative h-36 rounded-2xl overflow-hidden cursor-pointer photo-card-zoom border border-[#EFE7DC]"
              >
                <img
                  src={photoUrl}
                  alt={`${currentCity.name} visual ${pIdx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-2 py-1 rounded-lg bg-white/90 text-[10px] font-bold text-[#201C1A]">
                    Enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PHOTO LIGHTBOX MODAL
         ========================================================================= */}
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

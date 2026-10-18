import React, { useState } from 'react'
import type {
  PlannerInputs,
  DestinationChoice,
  BudgetTier,
  TravelInterest,
  GeneratedItinerary,
} from '../lib/plannerEngine'
import { generateItinerary, formatInr } from '../lib/plannerEngine'
import { getPlannerDraft, savePlannerDraft, useSavedPlaces } from '../lib/storage'
import { Link } from '../lib/router'
import {
  Wallet,
  Clock,
  Utensils,
  Sparkles,
  Navigation,
  Bookmark,
  Info,
} from 'lucide-react'

export const PlannerPage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {

  const { isSaved, toggleSave } = useSavedPlaces()

  // Default state or restore from saved draft
  const defaultInputs: PlannerInputs = {
    destination: 'delhi',
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

  // Whenever inputs change, recalculate itinerary and persist draft
  const handleInputChange = <K extends keyof PlannerInputs>(key: K, value: PlannerInputs[K]) => {
    const updated = { ...inputs, [key]: value }
    setInputs(updated)
    const newPlan = generateItinerary(updated)
    setItinerary(newPlan)
    savePlannerDraft(updated)
  }

  const toggleInterest = (interest: TravelInterest) => {
    const exists = inputs.interests.includes(interest)
    const updated = exists
      ? inputs.interests.filter((i) => i !== interest)
      : [...inputs.interests, interest]
    // Keep at least one interest
    if (updated.length > 0) {
      handleInputChange('interests', updated)
    }
  }

  const budget = itinerary.budget

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Planner Header */}
      <section className="bg-white border-b border-[#E8DFD3] pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] text-xs font-bold uppercase tracking-wider text-[#8C2D19] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deterministic Rules-Based Travel Engine</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#201C1A]">
            Curate Your Indian City Journey
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#645C55] leading-relaxed">
            Personalize your destination, pacing, and group size. We organize places by geographic logic and provide honest, itemized rupee expense estimates.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Form Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E8DFD3] shadow-xs space-y-6 sticky top-20">
              <h2 className="font-editorial text-xl font-bold text-[#201C1A] border-b border-[#F2ECE1] pb-3 flex items-center justify-between">
                <span>Trip Preferences</span>
                <span className="text-xs font-normal text-[#8A8177]">Instant Updates</span>
              </h2>

              {/* 1. Destination */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7D736A] block">
                  1. Destination City
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'delhi', label: 'Delhi' },
                    { id: 'jaipur', label: 'Jaipur' },
                    { id: 'both', label: 'Delhi + Jaipur' },
                  ].map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => handleInputChange('destination', dest.id as DestinationChoice)}
                      className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        inputs.destination === dest.id
                          ? 'bg-[#201C1A] text-white shadow-xs'
                          : 'bg-[#F9F7F3] border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {dest.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Number of Days & Travellers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="planner-days" className="text-xs font-bold uppercase tracking-wider text-[#7D736A] block">
                    Duration
                  </label>
                  <select
                    id="planner-days"
                    value={inputs.days}
                    onChange={(e) => handleInputChange('days', Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm font-medium text-[#201C1A] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30"
                  >
                    <option value={1}>1 Day (Express)</option>
                    <option value={2}>2 Days (Weekend)</option>
                    <option value={3}>3 Days (Recommended)</option>
                    <option value={4}>4 Days (In-depth)</option>
                    <option value={5}>5 Days (Slow Travel)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="planner-travellers" className="text-xs font-bold uppercase tracking-wider text-[#7D736A] block">
                    Travellers
                  </label>
                  <select
                    id="planner-travellers"
                    value={inputs.travellers}
                    onChange={(e) => handleInputChange('travellers', Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm font-medium text-[#201C1A] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30"
                  >
                    <option value={1}>1 Solo Explorer (1 Room)</option>
                    <option value={2}>2 Travellers (1 Room)</option>
                    <option value={3}>3 Travellers (2 Rooms)</option>
                    <option value={4}>4 Travellers (2 Rooms)</option>
                    <option value={5}>5 Travellers (3 Rooms)</option>
                    <option value={6}>6 Travellers (3 Rooms)</option>
                  </select>
                </div>
              </div>

              {/* 3. Budget Tier */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7D736A] block">
                  Budget Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'budget', label: 'Backpacker', sub: '₹1.2k room' },
                    { id: 'moderate', label: 'Comfortable', sub: '₹3.5k room' },
                    { id: 'premium', label: 'Heritage Luxury', sub: '₹9.5k room' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleInputChange('budgetTier', tier.id as BudgetTier)}
                      className={`p-2.5 rounded-xl text-left transition-all border ${
                        inputs.budgetTier === tier.id
                          ? 'bg-[#F5EFE6] border-[#8C2D19] text-[#8C2D19] shadow-xs'
                          : 'bg-[#F9F7F3] border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      <span className="text-xs font-bold block">{tier.label}</span>
                      <span className="text-[11px] text-[#7A7167] block">{tier.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Visitor Nationality (Ticket calculation tariff) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7D736A] block">
                  Monument Tariff Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('nationality', 'indian')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      inputs.nationality === 'indian'
                        ? 'bg-[#201C1A] text-white border-[#201C1A]'
                        : 'bg-[#F9F7F3] border-[#E5DACB] text-[#554D45]'
                    }`}
                  >
                    Indian Citizen (₹40–₹100)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('nationality', 'foreigner')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      inputs.nationality === 'foreigner'
                        ? 'bg-[#201C1A] text-white border-[#201C1A]'
                        : 'bg-[#F9F7F3] border-[#E5DACB] text-[#554D45]'
                    }`}
                  >
                    International (₹200–₹600)
                  </button>
                </div>
              </div>

              {/* 5. Travel Style / Interests */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7D736A] block">
                  Interests & Pacing
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'heritage', label: 'Heritage & History' },
                    { id: 'food', label: 'Culinary & Chaat' },
                    { id: 'photography', label: 'Architecture & Photos' },
                    { id: 'shopping', label: 'Textiles & Bazaars' },
                    { id: 'hidden_gem', label: 'Stepwells & Hidden Gems' },
                    { id: 'relaxed', label: 'Slow Travel' },
                  ].map((interest) => {
                    const active = inputs.interests.includes(interest.id as TravelInterest)
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id as TravelInterest)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          active
                            ? 'bg-[#8C2D19] text-white'
                            : 'bg-[#F9F7F3] border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        {interest.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Results Column (Itinerary & Budget Breakdown) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Transparent Budget Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
                    <Wallet className="w-4 h-4" />
                    <span>Honest Trip Budget Estimate</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-[#201C1A] mt-1">
                    {formatInr(budget.grandTotal)}
                    <span className="text-sm font-normal text-[#645C55] ml-2">
                      ({formatInr(budget.perPersonTotal)} / person)
                    </span>
                  </h3>
                </div>

                <div className="text-xs text-[#7A7167] bg-[#F9F6F0] p-2.5 rounded-xl border border-[#EFE7DC]">
                  <span>{inputs.travellers} Person(s) • {inputs.days} Day(s) • {budget.roomCount} Room(s)</span>
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#F5EFE6]">
                  <div>
                    <span className="font-semibold text-[#201C1A] block">Accommodation</span>
                    <span className="text-xs text-[#7D736A]">{budget.accommodationDescription}</span>
                  </div>
                  <span className="font-bold text-[#201C1A] whitespace-nowrap">
                    {formatInr(budget.accommodationTotal)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#F5EFE6]">
                  <div>
                    <span className="font-semibold text-[#201C1A] block">Food & Dining</span>
                    <span className="text-xs text-[#7D736A]">{budget.foodDescription}</span>
                  </div>
                  <span className="font-bold text-[#201C1A] whitespace-nowrap">
                    {formatInr(budget.foodTotal)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#F5EFE6]">
                  <div>
                    <span className="font-semibold text-[#201C1A] block">Local Transport</span>
                    <span className="text-xs text-[#7D736A]">{budget.transportDescription}</span>
                  </div>
                  <span className="font-bold text-[#201C1A] whitespace-nowrap">
                    {formatInr(budget.transportTotal)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#F5EFE6]">
                  <div>
                    <span className="font-semibold text-[#201C1A] block">Attraction Tickets</span>
                    <span className="text-xs text-[#7D736A]">{budget.ticketsDescription}</span>
                  </div>
                  <span className="font-bold text-[#201C1A] whitespace-nowrap">
                    {formatInr(budget.ticketsTotal)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#F5EFE6]">
                  <div>
                    <span className="font-semibold text-[#201C1A] block">Incidental Buffer (8%)</span>
                    <span className="text-xs text-[#7D736A]">{budget.bufferDescription}</span>
                  </div>
                  <span className="font-bold text-[#201C1A] whitespace-nowrap">
                    {formatInr(budget.bufferTotal)}
                  </span>
                </div>
              </div>

              {/* Assumptions & Exclusions Accordion/Note */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#F9F7F3] border border-[#EBE3D7] text-xs text-[#6E645A] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#201C1A]">
                  <Info className="w-3.5 h-3.5 text-[#8C2D19]" />
                  <span>Budget Notes & Assumptions:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {budget.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                  <li className="text-[#8C2D19]">
                    Excludes interstate flights/trains and personal jewelry or handicraft shopping.
                  </li>
                </ul>
              </div>
            </div>

            {/* Day-by-Day Itinerary Plans */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                  Day-by-Day Starter Schedule
                </h2>
                <span className="text-xs text-[#8C8276]">
                  {itinerary.days.length} Days Planned
                </span>
              </div>

              {itinerary.days.map((day) => (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-3xl p-6 border border-[#E5DACB] shadow-xs space-y-5"
                >
                  {/* Day Header */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F2ECE1] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-[#201C1A] text-white text-xs font-bold flex items-center justify-center">
                        {day.dayNumber}
                      </span>
                      <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                        Day {day.dayNumber}: {day.themeTitle}
                      </h3>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded bg-[#F5EFE6] text-[#8C2D19] self-start sm:self-auto">
                      {day.cityName} • {day.geographicArea}
                    </span>
                  </div>

                  <p className="text-xs text-[#6E645A] italic">
                    Tip: {day.dayNotes}
                  </p>

                  {/* Day Stops (Morning, Afternoon, Evening) */}
                  <div className="space-y-4">
                    {day.stops.map((stop, sIdx) => {
                      const place = stop.place
                      const saved = isSaved(place.id)

                      return (
                        <div
                          key={sIdx}
                          className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] hover:border-[#DDD0BE] transition-all space-y-2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                            <span className="font-bold uppercase tracking-wider text-[#8C2D19]">
                              {stop.slot} ({stop.timingNote})
                            </span>
                            <span className="text-[#8C8276] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{stop.suggestedDurationMinutes} mins duration</span>
                              {stop.ticketCostInr > 0 && (
                                <span>• ₹{stop.ticketCostInr} ticket</span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-editorial text-base font-bold text-[#201C1A] hover:text-[#8C2D19] transition-colors">
                                <Link to={`/places/${place.slug}`}>{place.name}</Link>
                              </h4>
                              <p className="text-xs text-[#5D554C] mt-0.5">
                                {place.shortDescription}
                              </p>
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
                              className="p-2 rounded-full hover:bg-white text-[#5D554C] hover:text-[#8C2D19] transition-colors flex-shrink-0"
                              aria-label={`Save ${place.name}`}
                            >
                              <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#8C2D19] text-[#8C2D19]' : ''}`} />
                            </button>
                          </div>

                          {/* Meal Recommendation */}
                          {stop.curatorMealSuggestion && (
                            <div className="pt-2 border-t border-[#EFE7DC] flex items-start gap-1.5 text-xs text-[#735A28]">
                              <Utensils className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#D97706]" />
                              <span>{stop.curatorMealSuggestion}</span>
                            </div>
                          )}

                          {/* Quick Maps Link */}
                          <div className="pt-1 flex items-center justify-between text-xs text-[#8C8276]">
                            <span className="line-clamp-1">Transit: {place.nearestTransit.stationOrStop}</span>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#8C2D19] font-semibold hover:underline flex items-center gap-1"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Maps</span>
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

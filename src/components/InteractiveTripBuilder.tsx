import React, { useState, useMemo } from 'react'
import { useAppData } from '../lib/dataStore'
import { generateItinerary, formatInr } from '../lib/plannerEngine'
import type { PlannerInputs, BudgetTier, GeneratedItinerary } from '../lib/plannerEngine'
import {
  calculateIntercityTransit,
  POPULAR_ORIGIN_CITIES,
  type TransitOption,
  type IntercityTransitComparison,
} from '../services/travel-engine/intercityTransitEngine'
import { getPlannerDraft, savePlannerDraft, useActiveCity } from '../lib/storage'
import { useProfile } from '../lib/profileStore'
import { ProfileModal } from './ProfileModal'
import { TravelEmblem } from './TravelEmblem'
import { type MotifVariant } from './ThemeMotif'
import { HomiBrandLogo } from './HomiBrandLogo'
import { CityTripFlowchart } from './CityTripFlowchart'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wallet,
  Share2,
  Check,
  RotateCcw,
  Navigation,
  ShieldCheck,
  Save,
  Car,
  Train,
  Bus,
  Plane,
  MapPin,
  Clock,
  ExternalLink,
  Users,
  Search,
  Calendar,
} from 'lucide-react'

interface InteractiveTripBuilderProps {
  onSaveToast: (msg: string) => void
  initialCityId?: string
}

export const InteractiveTripBuilder: React.FC<InteractiveTripBuilderProps> = ({
  onSaveToast,
  initialCityId,
}) => {
  const { cities } = useAppData()
  const { hasProfile, saveTrip } = useProfile()
  const [, setActiveCityId] = useActiveCity()
  const cityList = Object.values(cities)

  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [tripSavedSuccess, setTripSavedSuccess] = useState(false)

  // Step state: 1 (Origin), 2 (Destination), 3 (Transit Options), 4 (Group/Vibe), 5 (Days), 6 (Budget), 7 (Generating), 8 (Board)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isGenerating, setIsGenerating] = useState(false)

  // User selections
  const [selectedOrigin, setSelectedOrigin] = useState<string>('Delhi NCR')
  const [customOriginInput, setCustomOriginInput] = useState<string>('')
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return initialCityId || 'jaipur'
  })
  const [selectedTransit, setSelectedTransit] = useState<TransitOption | null>(null)
  const [selectedDays, setSelectedDays] = useState<number>(3)
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('moderate')
  const [selectedVibe, setSelectedVibe] = useState<string>('friends')

  // Board views
  const [copiedLink, setCopiedLink] = useState(false)
  const [itineraryViewMode, setItineraryViewMode] = useState<'cards' | 'flowchart'>('cards')

  // Calculate live multi-modal intercity transit options
  const transitComparison: IntercityTransitComparison = useMemo(() => {
    const origin = customOriginInput.trim() || selectedOrigin || 'Delhi NCR'
    return calculateIntercityTransit(origin, selectedCityId)
  }, [customOriginInput, selectedOrigin, selectedCityId])

  // Destination data
  const currentCityKey = selectedCityId.toLowerCase()
  const currentCity = cities[currentCityKey] || cities.jaipur || cityList[0]
  const persona = currentCity?.persona

  // Itinerary state
  const [itinerary, setItinerary] = useState<GeneratedItinerary>(() => {
    const draft = getPlannerDraft<PlannerInputs>()
    return generateItinerary({
      destination: draft?.destination || initialCityId || 'jaipur',
      origin: 'Delhi NCR',
      days: draft?.days || 3,
      travellers: draft?.travellers || 2,
      budgetTier: draft?.budgetTier || 'moderate',
      interests: ['heritage', 'food'],
      nationality: 'indian',
    })
  })

  // Handle final generation
  const handleBuildTrip = () => {
    setIsGenerating(true)
    setCurrentStep(7)

    const transitToUse = selectedTransit || transitComparison.recommendedOption

    setTimeout(() => {
      const inputs: PlannerInputs = {
        destination: selectedCityId,
        origin: customOriginInput.trim() || selectedOrigin,
        chosenTransit: transitToUse,
        days: selectedDays,
        travellers: selectedVibe === 'solo' ? 1 : selectedVibe === 'couple' ? 2 : 3,
        budgetTier: selectedBudget,
        interests: ['heritage', 'food', 'photography'],
        nationality: 'indian',
      }
      const newPlan = generateItinerary(inputs)
      setItinerary(newPlan)
      savePlannerDraft(inputs)
      setIsGenerating(false)
      setCurrentStep(8)
    }, 900)
  }

  // Save current trip board directly into local profile database
  const handleSaveToProfile = () => {
    if (!hasProfile) {
      setProfileModalOpen(true)
      return
    }
    saveTrip({
      destination: currentCityKey,
      cityName: currentCity.name,
      days: selectedDays,
      budgetTier: selectedBudget,
      vibe: selectedVibe,
      totalRupees: itinerary.budget.grandTotal,
      title: `${currentCity.name} ${selectedDays}-Day Adventure Board`,
    })
    setTripSavedSuccess(true)
    setTimeout(() => setTripSavedSuccess(false), 2500)
    onSaveToast(`Saved ${currentCity.name} trip board to your local profile!`)
  }

  // City options with authentic architectural motifs and verified local companions
  const funCityOptions: Array<{
    id: string
    name: string
    hindi: string
    motif: MotifVariant
    badge: string
    vibeTag: string
    companion: string
    photo: string
  }> = [
    {
      id: 'jaipur',
      name: 'Jaipur',
      hindi: 'जयपुर',
      motif: 'jharokha-scallop',
      badge: 'Pink Forts & Royal Sweets',
      vibeTag: 'Heritage & Havelis',
      companion: 'Aapke Bhaisaab',
      photo: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'varanasi',
      name: 'Varanasi',
      hindi: 'वाराणसी',
      motif: 'ganga-diya-ghat',
      badge: 'Holy Ghats & Magic Evening Aarti',
      vibeTag: 'Ancient Riverfront',
      companion: 'Banarasi Bhaiya',
      photo: '/assets/cities/varanasi/ghats/dashashwamedh-evening-aarti-wide.webp',
    },
    {
      id: 'udaipur',
      name: 'Udaipur',
      hindi: 'उदयपुर',
      motif: 'mewar-arch-lake',
      badge: 'Lakes, Boats & Palaces',
      vibeTag: 'Mewari Serenity',
      companion: 'Aapke Banna Sa',
      photo: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'manali',
      name: 'Manali',
      hindi: 'मनाली',
      motif: 'himalayan-pine',
      badge: 'Snow Peaks & River Cafes',
      vibeTag: 'Himalayan Ridge',
      companion: 'Aapka Pahadi Dost',
      photo: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'mussoorie',
      name: 'Mussoorie',
      hindi: 'मसूरी',
      motif: 'misty-pine-ridge',
      badge: 'Misty Pines & Mountain Ridge',
      vibeTag: 'Colonial Hilltop',
      companion: 'Hillside Storyteller',
      photo: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'delhi',
      name: 'Delhi NCR',
      hindi: 'दिल्ली',
      motif: 'mughal-arch',
      badge: 'Capital Heritage & Midnight Chaat',
      vibeTag: 'Dilli Ka Dil',
      companion: 'Dilliwala Dost',
      photo: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    },
  ]

  const isWizardActive = currentStep <= 6

  return (
    <div className="w-full">
      {/* =========================================================================
          MINIMALIST 1-QUESTION-PER-SCREEN WIZARD (DISTRACTION-FREE & CLEAN)
         ========================================================================= */}
      {isWizardActive && (
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DACB] shadow-lg space-y-8 relative overflow-hidden transition-all duration-300">
            {/* Minimal Top Header Bar: Step Tracker & Back Button */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#8C2D19] uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="p-1.5 -ml-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Back to previous question"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-[11px] font-semibold lowercase">back</span>
                    </button>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Question {currentStep} of 6</span>
                  </span>
                </div>
                <span className="text-stone-400 font-medium">
                  {currentStep === 1 && 'Starting Point'}
                  {currentStep === 2 && 'Destination'}
                  {currentStep === 3 && 'Transit Options'}
                  {currentStep === 4 && 'Group Vibe'}
                  {currentStep === 5 && 'Trip Duration'}
                  {currentStep === 6 && 'Budget Style'}
                </span>
              </div>

              {/* Minimal Line Progress Bar */}
              <div className="w-full h-1.5 bg-[#F2ECE1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8C2D19] to-[#E67E22] transition-all duration-400 rounded-full"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* =========================================================================
                QUESTION 1: WHERE ARE YOU STARTING FROM?
               ========================================================================= */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="text-center space-y-2 max-w-lg mx-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Step 1: Your Origin City</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                    Where are you starting from?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#665D54]">
                    We'll check direct trains, Volvo buses, flights, and expressways from your city to find the best way to reach.
                  </p>
                </div>

                {/* Instant Search / Custom City Input */}
                <div className="relative max-w-md mx-auto">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customOriginInput}
                    onChange={(e) => setCustomOriginInput(e.target.value)}
                    placeholder="Type city (e.g. Pune, Lucknow, Delhi, Surat)..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E5DACB] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#8C2D19] focus:bg-white text-[#201C1A] transition-all"
                  />
                  {customOriginInput && (
                    <button
                      type="button"
                      onClick={() => setCustomOriginInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick 1-Tap Popular City Pills */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block text-center">
                    Or select a major starting hub:
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {POPULAR_ORIGIN_CITIES.map((city) => {
                      const isSelected =
                        !customOriginInput && selectedOrigin.toLowerCase() === city.name.toLowerCase()
                      return (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => {
                            setSelectedOrigin(city.name)
                            setCustomOriginInput('')
                            setCurrentStep(2)
                          }}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#8C2D19] text-white shadow-sm ring-2 ring-[#8C2D19]/30'
                              : 'bg-[#FAF7F2] border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1] hover:border-stone-400'
                          }`}
                        >
                          {city.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (customOriginInput.trim()) {
                        setSelectedOrigin(customOriginInput.trim())
                      }
                      setCurrentStep(2)
                    }}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#8C2D19] hover:bg-[#722312] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Destination</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                QUESTION 2: WHERE DO YOU WANT TO GO?
               ========================================================================= */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="text-center space-y-2 max-w-lg mx-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] inline-flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Step 2: Dream Escape</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                    Where do you want to explore?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#665D54]">
                    Traveling from <strong>{customOriginInput || selectedOrigin}</strong>. Tap your destination:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {funCityOptions.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => {
                        setSelectedCityId(city.id)
                        setActiveCityId(city.id)
                        setCurrentStep(3)
                      }}
                      className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all cursor-pointer p-3 flex items-center gap-3.5 ${
                        selectedCityId === city.id
                          ? 'border-[#8C2D19] bg-[#FCF8F5] ring-2 ring-[#8C2D19]/20 shadow-md'
                          : 'border-[#E5DACB] hover:border-[#8C2D19] bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 relative">
                        <img
                          src={city.photo}
                          alt={city.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-0.5 flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-editorial text-lg font-bold text-[#201C1A] truncate">
                            {city.name}
                          </span>
                          <span className="text-[10px] font-bold text-[#8C2D19] px-2 py-0.5 rounded-full bg-[#FAF5ED]">
                            {city.hindi}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6E645A] truncate">{city.badge}</p>
                        <span className="text-[10px] text-stone-400 font-medium block">
                          Local Guide: {city.companion}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                QUESTION 3: HOW WOULD YOU LIKE TO REACH? (TRANSIT COMPARISON)
               ========================================================================= */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="text-center space-y-2 max-w-lg mx-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] inline-flex items-center gap-1">
                    <Train className="w-3.5 h-3.5" />
                    <span>Step 3: Intercity Transit Options</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                    How would you like to reach {currentCity?.name}?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#665D54]">
                    Route from <strong>{customOriginInput || selectedOrigin}</strong> to <strong>{currentCity?.name}</strong> (~{transitComparison.distanceKm} km).
                  </p>
                </div>

                {/* Homi Recommended Callout Banner */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-amber-700 block">
                      ★ HOMI Recommended Option:
                    </span>
                    <p className="text-xs leading-relaxed font-medium">
                      {transitComparison.bestChoiceSummary}
                    </p>
                  </div>
                </div>

                {/* 4 Multi-Modal Transit Choice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {transitComparison.options.map((opt) => {
                    const isSelected = selectedTransit?.mode === opt.mode || (!selectedTransit && opt.isRecommended)

                    return (
                      <button
                        key={opt.mode}
                        type="button"
                        onClick={() => {
                          setSelectedTransit(opt)
                          setCurrentStep(4)
                        }}
                        className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                          isSelected
                            ? 'border-[#8C2D19] bg-[#FCF8F5] ring-2 ring-[#8C2D19]/20 shadow-md'
                            : 'border-[#E5DACB] hover:border-stone-400 bg-[#FAF7F2]'
                        }`}
                      >
                        {/* Recommendation badge */}
                        {opt.isRecommended && (
                          <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>Best Choice</span>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-white border border-[#E5DACB] flex items-center justify-center text-[#8C2D19] shadow-2xs">
                                {opt.mode === 'train' && <Train className="w-4 h-4" />}
                                {opt.mode === 'bus' && <Bus className="w-4 h-4" />}
                                {opt.mode === 'flight' && <Plane className="w-4 h-4" />}
                                {opt.mode === 'taxi' && <Car className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="font-bold text-sm text-[#201C1A] block">{opt.title}</span>
                                <span className="text-[10px] text-stone-500 block truncate max-w-[140px]">{opt.subTitle}</span>
                              </div>
                            </div>

                            <span className="text-xs font-bold text-[#8C2D19] px-2 py-0.5 rounded-lg bg-[#FAF5ED]">
                              {opt.priceFormatted}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-600 pt-1 border-t border-stone-200/60">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                              <span className="truncate">{opt.durationFormatted}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                              <span className="truncate">{opt.departurePoint.split('(')[0].trim()}</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">
                            {opt.highlights[0]}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                          <span className="text-stone-400 font-medium">Tap to select</span>
                          <span className="font-bold text-[#8C2D19] flex items-center gap-0.5">
                            <span>Select Mode</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* API Status Note */}
                <div className="text-center pt-2">
                  <p className="text-[10px] text-stone-400">
                    Live transit engine calibrated with IRCTC schedules, express bus fares, and highway speeds.
                  </p>
                </div>
              </div>
            )}

            {/* =========================================================================
                QUESTION 4: WHO IS JOINING YOU? (GROUP VIBE)
               ========================================================================= */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="text-center space-y-2 max-w-lg mx-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Step 4: Your Travel Companions</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                    Who is traveling with you?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#665D54]">
                    We tailor room configurations, walking pace, and cafe choices to your squad.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      id: 'solo',
                      emblem: 'solo-wanderer' as const,
                      title: 'Solo Explorer (1 Person)',
                      desc: 'Deep immersion, photography, flexible walking pace, and quiet rooftop corners.',
                    },
                    {
                      id: 'couple',
                      emblem: 'couple-romance' as const,
                      title: 'Couple Romance (2 Persons)',
                      desc: 'Sunset boat rides, candlelit haveli dinners, and scenic heritage strolls.',
                    },
                    {
                      id: 'friends',
                      emblem: 'friends-gang' as const,
                      title: 'Squad / Friends (3+ Persons)',
                      desc: 'Street food marathons, lively mountain cafes, night markets, and fun stays.',
                    },
                    {
                      id: 'family',
                      emblem: 'family-kids' as const,
                      title: 'Family with Kids / Elders',
                      desc: 'Comfortable private transit, minimal stairs, verified food hygiene, and sacred darshans.',
                    },
                  ].map((vibe) => (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => {
                        setSelectedVibe(vibe.id)
                        setCurrentStep(5)
                      }}
                      className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        selectedVibe === vibe.id
                          ? 'border-[#8C2D19] bg-[#FCF8F5] ring-2 ring-[#8C2D19]/20 shadow-md'
                          : 'border-[#E5DACB] hover:border-[#8C2D19] bg-[#FAF7F2]'
                      }`}
                    >
                      <TravelEmblem type={vibe.emblem} size="md" className="shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-editorial text-base font-bold text-[#201C1A] block">
                          {vibe.title}
                        </span>
                        <p className="text-[11px] text-stone-600 leading-relaxed">{vibe.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                QUESTION 5: HOW MANY DAYS WILL YOU STAY?
               ========================================================================= */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="text-center space-y-2 max-w-lg mx-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Step 5: Trip Duration</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                    How many days do you have?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#665D54]">
                    Select your available vacation window for {currentCity?.name}:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      days: 1,
                      emblem: 'express-1day' as const,
                      badge: 'Express Sprint',
                      title: '1 Day • Fast Express',
                      desc: 'Packed sprint covering top 3 monuments and famous regional street food spots.',
                    },
                    {
                      days: 2,
                      emblem: 'weekend-2day' as const,
                      badge: 'Weekend Escape',
                      title: '2 Days • Weekend Getaway',
                      desc: 'Most popular! Top forts, sunrise chai, sunset ridges, and historic bazaar walks.',
                    },
                    {
                      days: 3,
                      emblem: 'classic-3day' as const,
                      badge: 'Recommended',
                      title: '3 Days • Classic Perfection',
                      desc: 'Recommended! River boats, hidden stepwells, artisan weavers, and relaxed evenings.',
                    },
                    {
                      days: 4,
                      emblem: 'explorer-4day' as const,
                      badge: 'Deep Explorer',
                      title: '4+ Days • Slow Discovery',
                      desc: 'Immersive exploration, photography trails, outstation day excursions, and offbeat spots.',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => {
                        setSelectedDays(opt.days)
                        setCurrentStep(6)
                      }}
                      className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        selectedDays === opt.days
                          ? 'border-[#8C2D19] bg-[#FCF8F5] ring-2 ring-[#8C2D19]/20 shadow-md'
                          : 'border-[#E5DACB] hover:border-[#8C2D19] bg-[#FAF7F2]'
                      }`}
                    >
                      <TravelEmblem type={opt.emblem} size="md" className="shrink-0 mt-0.5" />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-editorial text-base font-bold text-[#201C1A] block">
                            {opt.title}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF5ED] text-[#8C2D19]">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                QUESTION 6: WHAT IS YOUR BUDGET STYLE?
               ========================================================================= */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="text-center space-y-2 max-w-lg mx-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] inline-flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Step 6: Budget Tier</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                    What is your daily budget style?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#665D54]">
                    We calculate honest, transparent rupee amounts with zero hidden extras.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {[
                    {
                      id: 'budget',
                      emblem: 'budget-tier' as const,
                      title: 'Pocket-Friendly',
                      desc: 'Clean hostels, street chaats, shared e-rickshaws',
                      rate: '~₹1.4k / room',
                    },
                    {
                      id: 'moderate',
                      emblem: 'moderate-tier' as const,
                      title: 'Cozy & Comfortable',
                      desc: 'Heritage havelis, rooftop cafes, comfortable app cabs',
                      rate: '~₹3.8k / room',
                    },
                    {
                      id: 'premium',
                      emblem: 'premium-tier' as const,
                      title: 'Royal Luxury',
                      desc: '5-star palaces, private chauffeur, fine dining',
                      rate: '~₹9.8k / room',
                    },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => {
                        setSelectedBudget(tier.id as BudgetTier)
                        handleBuildTrip()
                      }}
                      className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        selectedBudget === tier.id
                          ? 'border-[#8C2D19] bg-[#FCF8F5] ring-2 ring-[#8C2D19]/20 shadow-md'
                          : 'border-[#E5DACB] hover:border-[#8C2D19] bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="space-y-2">
                        <TravelEmblem type={tier.emblem} size="sm" />
                        <span className="font-editorial text-base font-bold text-[#201C1A] block">
                          {tier.title}
                        </span>
                        <p className="text-[11px] text-stone-600 leading-relaxed">{tier.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#8C2D19] px-2 py-0.5 rounded-full bg-[#FAF5ED] self-start">
                        {tier.rate}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleBuildTrip}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#8C2D19] hover:bg-[#722312] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate My Complete Itinerary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 7: ANIMATED GENERATING TRANSITION
         ========================================================================= */}
      {isGenerating && (
        <div className="max-w-md mx-auto py-16 px-4">
          <div className="bg-white rounded-3xl p-10 text-center border border-[#E5DACB] shadow-xl space-y-6 animate-pulse">
            <div className="w-20 h-20 rounded-2xl bg-[#F5EFE6] text-[#8C2D19] flex items-center justify-center mx-auto border border-[#E5DACB] shadow-xs">
              <HomiBrandLogo size="lg" markOnly />
            </div>
            <div className="space-y-2">
              <h3 className="font-editorial text-2xl font-bold text-[#201C1A]">
                {persona?.name || 'Your Local Friend'} is setting up your board...
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Checking train schedules from {customOriginInput || selectedOrigin}, reserving boat slots, and calculating honest rupee expenses for {currentCity?.name}.
              </p>
            </div>
            <div className="w-24 h-1.5 bg-[#8C2D19] rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 8: THE COMPLETE PERSONALIZED ITINERARY BOARD
         ========================================================================= */}
      {currentStep === 8 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 animate-in fade-in duration-400">
          {/* Top Quick Actions Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5DACB] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs sm:text-sm font-bold text-[#201C1A]">
                Route: <strong>{customOriginInput || selectedOrigin}</strong> → <strong>{currentCity?.name}</strong> • {selectedDays} Days • {selectedBudget.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToProfile}
                className="px-3.5 py-1.5 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#722312] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {tripSavedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                <span>{tripSavedSuccess ? 'Saved to Profile!' : 'Save Trip'}</span>
              </button>

              <button
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5DACB] text-xs font-semibold text-[#554D45] hover:bg-[#F2ECE1] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Plan Again</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  setCopiedLink(true)
                  setTimeout(() => setCopiedLink(false), 2000)
                  onSaveToast('Copied trip link to share with your friends!')
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#201C1A] text-white text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              INTERCITY BOARDING PASS (JOURNEY TICKET)
             ========================================================================= */}
          {itinerary.chosenTransit && (
            <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-stone-700">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                    {itinerary.chosenTransit.mode === 'train' && <Train className="w-3.5 h-3.5" />}
                    {itinerary.chosenTransit.mode === 'bus' && <Bus className="w-3.5 h-3.5" />}
                    {itinerary.chosenTransit.mode === 'flight' && <Plane className="w-3.5 h-3.5" />}
                    {itinerary.chosenTransit.mode === 'taxi' && <Car className="w-3.5 h-3.5" />}
                    <span>Recommended Transit • {itinerary.chosenTransit.title}</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
                      {customOriginInput || selectedOrigin}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-amber-300">
                      {currentCity?.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                    <strong>Service:</strong> {itinerary.chosenTransit.operatorOrTrain} • <strong>Departs:</strong> {itinerary.chosenTransit.departurePoint} • <strong>Arrives:</strong> {itinerary.chosenTransit.arrivalPoint}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
                  <div>
                    <span className="text-[10px] text-stone-300 uppercase tracking-wider block font-bold">
                      Duration & Fare
                    </span>
                    <strong className="text-lg font-bold text-white block">
                      {itinerary.chosenTransit.durationFormatted}
                    </strong>
                    <span className="text-xs text-amber-300 font-bold">
                      {itinerary.chosenTransit.priceFormatted}
                    </span>
                  </div>

                  {itinerary.chosenTransit.directBookingUrl && (
                    <a
                      href={itinerary.chosenTransit.directBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Book on Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 1. HOST COMPANION WELCOME HERO */}
          {persona && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#E5DACB] shadow-md relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#F2ECE1] pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-[#8C2D19] shadow-sm animate-float flex-shrink-0">
                    <img
                      src={persona.avatarImage || currentCity?.heroImage}
                      alt={persona.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-editorial text-2xl font-bold text-[#201C1A]">
                        {persona.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-[#8C2D19]" />
                    </div>
                    <p className="text-xs text-[#7A7167] font-medium">{persona.title}</p>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#FAF5ED] text-[#8C2D19] text-[10px] font-bold">
                      Verified Local Companion • {currentCity?.name}
                    </span>
                  </div>
                </div>

                <div className="text-right self-start md:self-auto">
                  <span className="text-xs text-[#7D736A] block">Total Estimated Cost:</span>
                  <span className="font-editorial text-2xl font-bold text-[#8C2D19]">
                    {formatInr(itinerary.budget.grandTotal)}
                  </span>
                  <span className="text-[11px] text-[#6E645A] block">
                    ({formatInr(itinerary.budget.perPersonTotal)} / person)
                  </span>
                </div>
              </div>

              {/* Dialect Voice Note */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FCF8F5] border border-[#ECD7CE] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2D19] block">
                    Local Apnapan & Welcome:
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
                    {persona.name}'s Golden Rule:
                  </span>
                  <p className="text-xs text-[#523B17] font-medium leading-relaxed">
                    {persona.localTip}
                  </p>
                  <div className="pt-2 text-[11px] text-[#7A7167]">
                    Must-eat dish: <strong>{currentCity?.tasteOfCity?.signatureDish}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW SWITCHER: CARDS vs FLOWCHART */}
          <div className="flex items-center justify-between border-b border-[#E5DACB] pb-4">
            <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
              Day-by-Day Journey Flow
            </h2>

            <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setItineraryViewMode('cards')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  itineraryViewMode === 'cards'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Detailed Stops
              </button>
              <button
                type="button"
                onClick={() => setItineraryViewMode('flowchart')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  itineraryViewMode === 'flowchart'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Visual Flowchart
              </button>
            </div>
          </div>

          {/* 3. VISUAL FLOWCHART OR DAY-BY-DAY CARDS */}
          {itineraryViewMode === 'flowchart' ? (
            <CityTripFlowchart cityId={currentCityKey} />
          ) : (
            <div className="space-y-8">
              {itinerary.days.map((day) => (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-6"
                >
                  <div className="border-b border-[#F2ECE1] pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block">
                      Day {day.dayNumber} of {selectedDays}
                    </span>
                    <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#201C1A]">
                      {day.themeTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {day.stops.map((stop, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[#EFE7DC] bg-[#FAF7F2] p-4 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#8C2D19] border border-[#E5DACB] inline-block">
                            {stop.slot.toUpperCase()} • {stop.timingNote}
                          </span>
                          <h4 className="font-editorial text-base font-bold text-[#201C1A]">
                            {stop.place.name}
                          </h4>
                          <p className="text-xs text-stone-600 line-clamp-3">
                            {stop.place.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#EFE7DC] text-[11px] text-stone-500 flex items-center justify-between">
                          <span>Verified Entry: ₹{stop.ticketCostInr}</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              stop.place.name + ' ' + currentCity?.name
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#8C2D19] hover:underline flex items-center gap-0.5"
                          >
                            <span>Map ↗</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. HONEST BUDGET BREAKDOWN */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
              Honest Itemized Budget Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DACB]">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Accommodation</span>
                <strong className="text-base text-stone-900">{formatInr(itinerary.budget.accommodationTotal)}</strong>
                <p className="text-[10px] text-stone-500 mt-0.5">{itinerary.budget.accommodationDescription}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DACB]">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Meals & Street Food</span>
                <strong className="text-base text-stone-900">{formatInr(itinerary.budget.foodTotal)}</strong>
                <p className="text-[10px] text-stone-500 mt-0.5">{itinerary.budget.foodDescription}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DACB]">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Local Transit</span>
                <strong className="text-base text-stone-900">{formatInr(itinerary.budget.transportTotal)}</strong>
                <p className="text-[10px] text-stone-500 mt-0.5">{itinerary.budget.transportDescription}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DACB]">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Monuments & Tickets</span>
                <strong className="text-base text-stone-900">{formatInr(itinerary.budget.ticketsTotal)}</strong>
                <p className="text-[10px] text-stone-500 mt-0.5">{itinerary.budget.ticketsDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileModalOpen && (
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          onToast={onSaveToast}
        />
      )}
    </div>
  )
}

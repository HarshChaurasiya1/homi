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
import { LocalGuideAndEmergencyHub } from './LocalGuideAndEmergencyHub'
import { getSafetyDirectoryForCity } from '../data/emergencyContacts'
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
  PhoneCall,
  MessageCircle,
  ShieldAlert,
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
  const { profile, hasProfile, saveTrip } = useProfile()
  const [, setActiveCityId] = useActiveCity()
  const cityList = Object.values(cities)

  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [safetyModalOpen, setSafetyModalOpen] = useState(false)
  const [tripSavedSuccess, setTripSavedSuccess] = useState(false)

  // Step state: 1 (Origin), 2 (Destination), 3 (Transit Options), 4 (Group/Vibe), 5 (Days), 6 (Budget), 7 (Generating), 8 (Board)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isGenerating, setIsGenerating] = useState(false)

  // User selections - Defaulted to Jhansi origin & Varanasi destination for authentic regional traveler experience
  const [selectedOrigin, setSelectedOrigin] = useState<string>(() => profile?.homeCity || 'Jhansi')
  const [customOriginInput, setCustomOriginInput] = useState<string>('')
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return initialCityId || 'varanasi'
  })
  const [selectedTransit, setSelectedTransit] = useState<TransitOption | null>(null)
  const [selectedDays, setSelectedDays] = useState<number>(2)
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('moderate')
  const [selectedVibe, setSelectedVibe] = useState<string>('friends')

  // Board views
  const [copiedLink, setCopiedLink] = useState(false)
  const [itineraryViewMode, setItineraryViewMode] = useState<'cards' | 'flowchart'>('cards')

  // Calculate live multi-modal intercity transit options
  const transitComparison: IntercityTransitComparison = useMemo(() => {
    const origin = customOriginInput.trim() || selectedOrigin || 'Jhansi'
    return calculateIntercityTransit(origin, selectedCityId)
  }, [customOriginInput, selectedOrigin, selectedCityId])

  // Destination data
  const currentCityKey = selectedCityId.toLowerCase()
  const currentCity = cities[currentCityKey] || cities.varanasi || cities.jaipur || cityList[0]
  const persona = currentCity?.persona

  // Itinerary state
  const [itinerary, setItinerary] = useState<GeneratedItinerary>(() => {
    const draft = getPlannerDraft<PlannerInputs>()
    return generateItinerary({
      destination: draft?.destination || initialCityId || 'varanasi',
      origin: profile?.homeCity || 'Jhansi',
      days: draft?.days || 2,
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
      id: 'varanasi',
      name: 'Varanasi',
      hindi: 'वाराणसी',
      motif: 'ganga-diya-ghat',
      badge: 'Holy Ghats, Subah Boat & Evening Aarti',
      vibeTag: 'Ancient Riverfront & Moksha',
      companion: 'Banarasi Bhaiya',
      photo: '/assets/cities/varanasi/ghats/dashashwamedh-evening-aarti-wide.webp',
    },
    {
      id: 'jaipur',
      name: 'Jaipur',
      hindi: 'जयपुर',
      motif: 'jharokha-scallop',
      badge: 'Pink Forts & Royal Palaces',
      vibeTag: 'Heritage & Havelis',
      companion: 'Aapke Bhaisaab',
      photo: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
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
      id: 'delhi',
      name: 'Delhi NCR',
      hindi: 'दिल्ली',
      motif: 'mughal-arch',
      badge: 'Capital Heritage & Midnight Chaat',
      vibeTag: 'Dilli Ka Dil',
      companion: 'Dilliwala Dost',
      photo: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
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
  ]

  const isWizardActive = currentStep <= 6

  return (
    <div className="w-full">
      {/* =========================================================================
          MINIMALIST 1-QUESTION-PER-SCREEN WIZARD (DISTRACTION-FREE & CLEAN)
         ========================================================================= */}
      {isWizardActive && (
        <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-xl space-y-6 relative overflow-hidden transition-all duration-300">
            {/* Minimal Top Header Bar: Step Tracker & Back Button */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Back to previous question"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-[11px] font-semibold lowercase">back</span>
                    </button>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Question {currentStep} of 6</span>
                  </span>
                </div>
                <span className="text-slate-400 font-medium text-[11px]">
                  {currentStep === 1 && 'Starting Point'}
                  {currentStep === 2 && 'Destination'}
                  {currentStep === 3 && 'Transit Options'}
                  {currentStep === 4 && 'Group Vibe'}
                  {currentStep === 5 && 'Trip Duration'}
                  {currentStep === 6 && 'Budget Style'}
                </span>
              </div>

              {/* Minimal Line Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-400 rounded-full"
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
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Step 1: Your Origin City</span>
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Where are you starting from?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    We'll check direct trains, Volvo buses, flights, and expressways from your city to find the best way to reach.
                  </p>
                </div>

                {/* Instant Search / Custom City Input */}
                <div className="relative max-w-md mx-auto">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customOriginInput}
                    onChange={(e) => setCustomOriginInput(e.target.value)}
                    placeholder="Type city (e.g. Jhansi, Kanpur, Lucknow, Delhi)..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-900 transition-all"
                  />
                  {customOriginInput && (
                    <button
                      type="button"
                      onClick={() => setCustomOriginInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick 1-Tap Popular City Pills */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                    Or select a starting hub:
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
                          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          {city.name === 'Jhansi' ? '📍 Jhansi' : city.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (customOriginInput.trim()) {
                        setSelectedOrigin(customOriginInput.trim())
                      }
                      setCurrentStep(2)
                    }}
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 inline-flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Step 2: Dream Escape</span>
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Where do you want to explore?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
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
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200 shadow-md'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                        <img
                          src={city.photo}
                          alt={city.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-0.5 flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-editorial text-base font-bold text-slate-900 truncate">
                            {city.name}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-700 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                            {city.hindi}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate">{city.badge}</p>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Guide: {city.companion}
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
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 inline-flex items-center gap-1">
                    <Train className="w-3.5 h-3.5" />
                    <span>Step 3: Intercity Transit Options</span>
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900">
                    How to reach {currentCity?.name}?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Route from <strong>{customOriginInput || selectedOrigin}</strong> to <strong>{currentCity?.name}</strong> (~{transitComparison.distanceKm} km).
                  </p>
                </div>

                {/* Homi Recommended Callout Banner */}
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-3 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-700 block">
                      ★ HOMI Recommended Option:
                    </span>
                    <p className="text-xs leading-relaxed font-semibold">
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
                            ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
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
                              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                                {opt.mode === 'train' && <Train className="w-4 h-4" />}
                                {opt.mode === 'bus' && <Bus className="w-4 h-4" />}
                                {opt.mode === 'flight' && <Plane className="w-4 h-4" />}
                                {opt.mode === 'taxi' && <Car className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="font-bold text-sm text-slate-900 block">{opt.title}</span>
                                <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">{opt.subTitle}</span>
                              </div>
                            </div>

                            <span className="text-xs font-bold text-indigo-600 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100">
                              {opt.priceFormatted}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{opt.durationFormatted}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{opt.departurePoint.split('(')[0].trim()}</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                            {opt.highlights[0]}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-medium">Tap to select</span>
                          <span className="font-bold text-indigo-600 flex items-center gap-0.5">
                            <span>Select Mode</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* API Status Note */}
                <div className="text-center pt-1">
                  <p className="text-[10px] text-slate-400">
                    Calibrated with IRCTC schedules (Bundelkhand/Vande Bharat Express), State RTC sleeper buses & expressways.
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
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Step 4: Your Travel Companions</span>
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Who is traveling with you?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
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
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200 shadow-md'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <TravelEmblem type={vibe.emblem} size="md" className="shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-editorial text-base font-bold text-slate-900 block">
                          {vibe.title}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{vibe.desc}</p>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Step 5: Trip Duration</span>
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900">
                    How many days do you have?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
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
                      badge: 'Weekend Getaway',
                      title: '2 Days • Weekend Escape',
                      desc: 'Most popular! Top forts, sunrise boat/chai, sunset ridges, and historic bazaar walks.',
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
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200 shadow-md'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <TravelEmblem type={opt.emblem} size="md" className="shrink-0 mt-0.5" />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-editorial text-base font-bold text-slate-900 block">
                            {opt.title}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{opt.desc}</p>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 inline-flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Step 6: Budget Tier</span>
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900">
                    What is your daily budget style?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
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
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200 shadow-md'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <TravelEmblem type={tier.emblem} size="sm" />
                        <span className="font-editorial text-base font-bold text-slate-900 block">
                          {tier.title}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{tier.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 self-start">
                        {tier.rate}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleBuildTrip}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
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
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-2xl space-y-6 animate-pulse">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
              <HomiBrandLogo size="lg" markOnly />
            </div>
            <div className="space-y-2">
              <h3 className="font-editorial text-2xl font-extrabold text-slate-900">
                {persona?.name || 'Your Local Friend'} is setting up your board...
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Checking train schedules from {customOriginInput || selectedOrigin}, reserving boat slots, and calculating honest rupee expenses for {currentCity?.name}.
              </p>
            </div>
            <div className="w-24 h-1.5 bg-indigo-600 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 8: THE COMPLETE PERSONALIZED ITINERARY BOARD
         ========================================================================= */}
      {currentStep === 8 && (
        <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-8 animate-in fade-in duration-400">
          {/* Top Quick Actions Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                Route: <strong>{customOriginInput || selectedOrigin}</strong> → <strong>{currentCity?.name}</strong> • {selectedDays} Days • {selectedBudget.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToProfile}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-200 cursor-pointer"
              >
                {tripSavedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                <span>{tripSavedSuccess ? 'Saved to Profile!' : 'Save Trip'}</span>
              </button>

              <button
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
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
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Quick Switch to Other Cities */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-600">
              Want to see another destination from {customOriginInput || selectedOrigin}?
            </span>
            <div className="flex flex-wrap gap-1.5">
              {funCityOptions
                .filter((c) => c.id !== currentCityKey)
                .map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCityId(c.id)
                      setActiveCityId(c.id)
                      setCurrentStep(3)
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-800 text-[11px] font-bold transition-all shadow-2xs"
                  >
                    {c.name}
                  </button>
                ))}
            </div>
          </div>

          {/* =========================================================================
              INTERCITY BOARDING PASS (JOURNEY TICKET)
             ========================================================================= */}
          {itinerary.chosenTransit && (
            <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
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
                    <ArrowRight className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-amber-300">
                      {currentCity?.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    <strong>Service:</strong> {itinerary.chosenTransit.operatorOrTrain} • <strong>Departs:</strong> {itinerary.chosenTransit.departurePoint} • <strong>Arrives:</strong> {itinerary.chosenTransit.arrivalPoint}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">
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
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Book on Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 1. ASSIGNED LOCAL COMPANION & EMERGENCY SAFETY HUB */}
          {persona && (() => {
            const safetyDir = getSafetyDirectoryForCity(currentCityKey)
            const guide = safetyDir.assignedGuide
            const guideWhatsapp = `https://wa.me/${guide.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Namaste ${guide.name}! I am currently following my ${currentCity?.name} itinerary on the HOMI app and need quick guidance.`
            )}`

            return (
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-md relative overflow-hidden space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-600 shadow-sm flex-shrink-0 relative">
                      <img
                        src={guide.avatarImage || persona.avatarImage || currentCity?.heroImage}
                        alt={guide.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900">
                          {guide.name}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{guide.title}</p>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                        {guide.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right self-start md:self-auto">
                    <span className="text-xs text-slate-500 block">Total Estimated Cost:</span>
                    <span className="font-editorial text-2xl font-bold text-indigo-600">
                      {formatInr(itinerary.budget.grandTotal)}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      ({formatInr(itinerary.budget.perPersonTotal)} / person)
                    </span>
                  </div>
                </div>

                {/* Direct Action Calling & WhatsApp Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <a
                    href={`tel:${guide.phone}`}
                    className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Guide ({guide.phone})</span>
                  </a>

                  <a
                    href={guideWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Guidance</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSafetyModalOpen(true)}
                    className="py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                    <span>Police & SOS Directory (112)</span>
                  </button>
                </div>

                {/* Dialect Voice Note & Local Tip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                      Local Apnapan & Welcome:
                    </span>
                    <p className="text-sm font-semibold text-slate-900 italic leading-relaxed">
                      "{persona.greeting}"
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {persona.dialectQuote}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-950 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      {persona.name}'s Golden Rule:
                    </span>
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      {persona.localTip}
                    </p>
                    <div className="pt-1.5 text-[11px] text-slate-600">
                      Neighborhood: <strong>{guide.neighborhood}</strong> • Spoken: {guide.languages.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* VIEW SWITCHER: CARDS vs FLOWCHART */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900">
              Day-by-Day Journey Flow
            </h2>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setItineraryViewMode('cards')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  itineraryViewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Detailed Stops
              </button>
              <button
                type="button"
                onClick={() => setItineraryViewMode('flowchart')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  itineraryViewMode === 'flowchart'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
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
            <div className="space-y-6">
              {itinerary.days.map((day) => (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-xs space-y-5"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                      Day {day.dayNumber} of {selectedDays}
                    </span>
                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900">
                      {day.themeTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {day.stops.map((stop, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-indigo-600 border border-slate-200 inline-block shadow-2xs">
                            {stop.slot.toUpperCase()} • {stop.timingNote}
                          </span>
                          <h4 className="font-editorial text-base font-bold text-slate-900">
                            {stop.place.name}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-3">
                            {stop.place.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>Verified Entry: ₹{stop.ticketCostInr}</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              stop.place.name + ' ' + currentCity?.name
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
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
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900">
              Honest Itemized Budget Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Accommodation</span>
                <strong className="text-base text-slate-900">{formatInr(itinerary.budget.accommodationTotal)}</strong>
                <p className="text-[10px] text-slate-500 mt-0.5">{itinerary.budget.accommodationDescription}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Meals & Street Food</span>
                <strong className="text-base text-slate-900">{formatInr(itinerary.budget.foodTotal)}</strong>
                <p className="text-[10px] text-slate-500 mt-0.5">{itinerary.budget.foodDescription}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Local Transit</span>
                <strong className="text-base text-slate-900">{formatInr(itinerary.budget.transportTotal)}</strong>
                <p className="text-[10px] text-slate-500 mt-0.5">{itinerary.budget.transportDescription}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Monuments & Tickets</span>
                <strong className="text-base text-slate-900">{formatInr(itinerary.budget.ticketsTotal)}</strong>
                <p className="text-[10px] text-slate-500 mt-0.5">{itinerary.budget.ticketsDescription}</p>
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

      {/* Local Guide & Emergency Safety Hub Modal */}
      {safetyModalOpen && (
        <LocalGuideAndEmergencyHub
          cityId={currentCityKey}
          isOpen={safetyModalOpen}
          onClose={() => setSafetyModalOpen(false)}
          onToast={onSaveToast}
        />
      )}
    </div>
  )
}

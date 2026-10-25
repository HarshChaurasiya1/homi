import React, { useState } from 'react'
import { useAppData } from '../lib/dataStore'
import { getRedditPicksForCity } from '../data/redditPicks'
import { generateItinerary, formatInr } from '../lib/plannerEngine'
import type { PlannerInputs, BudgetTier, GeneratedItinerary } from '../lib/plannerEngine'
import { useSavedPlaces, getPlannerDraft, savePlannerDraft, useActiveCity } from '../lib/storage'
import { useProfile } from '../lib/profileStore'
import { ProfileModal } from './ProfileModal'
import { Link } from '../lib/router'
import { TravelEmblem } from './TravelEmblem'
import { ThemeMotif, type MotifVariant } from './ThemeMotif'
import { HomiBrandLogo } from './HomiBrandLogo'
import { GeminiTripPersonalizer } from './GeminiTripPersonalizer'
import { StreetViewVisualGuide } from './StreetViewVisualGuide'
import { CityTripFlowchart } from './CityTripFlowchart'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wallet,
  Utensils,
  Camera,
  Sun,
  Coffee,
  Bookmark,
  Share2,
  Check,
  RotateCcw,
  Navigation,
  ShieldCheck,
  MessageSquare,
  Save,
  Building,
  Car,
  Ticket,
  Info,
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
  const { isSaved, toggleSave } = useSavedPlaces()
  const { hasProfile, isUnlocked, saveTrip } = useProfile()
  const [activeCityId, setActiveCityId] = useActiveCity()
  const cityList = Object.values(cities)

  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [tripSavedSuccess, setTripSavedSuccess] = useState(false)

  const effectiveCityId = initialCityId || activeCityId || null

  // Wizard Step: 1 (City), 2 (Days), 3 (Budget & Vibe), 4 (Generating), 5 (Board Generated)
  const [currentStep, setCurrentStep] = useState<number>(() => {
    return effectiveCityId ? 2 : 1
  })
  const [isGenerating, setIsGenerating] = useState(false)

  // User selections
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return effectiveCityId || 'jaipur'
  })
  const [selectedDays, setSelectedDays] = useState<number>(3)
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('moderate')
  const [selectedVibe, setSelectedVibe] = useState<string>('friends')

  // Lightbox photo
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [itineraryViewMode, setItineraryViewMode] = useState<'cards' | 'flowchart'>('cards')

  // Selected city key derived directly
  const currentCityKey = (initialCityId || activeCityId || selectedCityId || 'jaipur').toLowerCase()
  const currentCity = cities[currentCityKey] || cities.jaipur || cityList[0]
  const persona = currentCity?.persona
  const redditSpots = getRedditPicksForCity(currentCityKey)

  // Itinerary state
  const [itinerary, setItinerary] = useState<GeneratedItinerary>(() => {
    const draft = getPlannerDraft<PlannerInputs>()
    return generateItinerary({
      destination: draft?.destination || effectiveCityId || 'jaipur',
      days: draft?.days || 3,
      travellers: draft?.travellers || 2,
      budgetTier: draft?.budgetTier || 'moderate',
      interests: ['heritage', 'food'],
      nationality: 'indian',
    })
  })

  // Filter reddit spots by type
  const sunsetSpots = redditSpots.filter((s) => s.type === 'sunset')
  const cafeSpots = redditSpots.filter((s) => s.type === 'cafe')
  const foodSpots = redditSpots.filter((s) => s.type === 'food')

  // Generate trip on confirmation or step 3 completion
  const handleBuildTrip = (cityId: string, days: number, budgetTier: BudgetTier) => {
    setIsGenerating(true)
    setCurrentStep(4)

    setTimeout(() => {
      const inputs: PlannerInputs = {
        destination: cityId,
        days,
        travellers: selectedVibe === 'solo' ? 1 : 2,
        budgetTier,
        interests: ['heritage', 'food', 'photography'],
        nationality: 'indian',
      }
      const newPlan = generateItinerary(inputs)
      setItinerary(newPlan)
      savePlannerDraft(inputs)
      setIsGenerating(false)
      setCurrentStep(5)
    }, 700)
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
      id: 'varanasi',
      name: 'Varanasi',
      hindi: 'वाराणसी',
      motif: 'ganga-diya-ghat',
      badge: 'Holy Ghats & Magic Evening Aarti',
      vibeTag: 'Ancient Crescent Riverfront',
      companion: 'Banarasi Bhaiya',
      photo: '/assets/cities/varanasi/ghats/dashashwamedh-evening-aarti-wide.webp',
    },
    {
      id: 'mussoorie',
      name: 'Mussoorie',
      hindi: 'मसूरी',
      motif: 'misty-pine-ridge',
      badge: 'Misty Pines & Mountain Ridge',
      vibeTag: 'Colonial Hilltop Clouds',
      companion: 'Hillside Storyteller',
      photo: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80',
    },
  ]

  // Any extra admin-added custom cities
  const extraCities = cityList.filter(
    (c) => !funCityOptions.some((f) => f.id.toLowerCase() === c.id.toLowerCase())
  )

  return (
    <div className="w-full space-y-8">
      {/* =========================================================================
          INTERACTIVE 1-BY-1 QUESTION WIZARD (KID-FRIENDLY & EFFORTLESS)
         ========================================================================= */}
      {currentStep <= 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#E5DACB] shadow-lg max-w-4xl mx-auto space-y-8 relative overflow-hidden transition-all duration-300">
          {/* Subtle background glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#E67E22]/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Google Gemini Travel Brain: Card Selection Engine */}
          <GeminiTripPersonalizer
            cityId={currentCityKey}
            cityName={currentCity?.name || 'Varanasi'}
            onApplyRecommendation={({ days, budgetTier, vibe }) => {
              setSelectedDays(days)
              setSelectedBudget(budgetTier)
              setSelectedVibe(vibe)
              setCurrentStep(3)
              onSaveToast(`Gemini customized ${days} Days & ${budgetTier} tier for you!`)
            }}
          />

          {/* Step Progress Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#8C2D19] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>Question {currentStep} of 3</span>
              </span>
              <span className="text-[#8A8177]">
                {currentStep === 1 && 'Where to?'}
                {currentStep === 2 && 'How many days?'}
                {currentStep === 3 && 'Budget style'}
              </span>
            </div>

            <div className="w-full h-2.5 bg-[#F2ECE1] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8C2D19] to-[#E67E22] transition-all duration-500 rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* QUESTION 1: WHERE DO YOU WANT TO GO? */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2 max-w-lg mx-auto">
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                  Where do you want to explore?
                </h2>
                <p className="text-xs sm:text-sm text-[#665D54]">
                  Tap your favorite destination. Your local friend will guide you there!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {funCityOptions.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      setSelectedCityId(city.id)
                      setActiveCityId(city.id)
                      setCurrentStep(2)
                    }}
                    className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all photo-card-zoom cursor-pointer ${
                      selectedCityId === city.id
                        ? 'border-[#8C2D19] ring-2 ring-[#8C2D19]/30 shadow-md'
                        : 'border-[#E5DACB] hover:border-[#8C2D19]'
                    }`}
                  >
                    <div className="h-32 w-full relative overflow-hidden bg-stone-100">
                      <img
                        src={city.photo}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-400"
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-xl bg-black/50 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-xs">
                        <ThemeMotif type={city.motif} width={16} height={16} className="text-amber-300" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{city.name}</span>
                      </div>
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[#201C1A]">
                        {city.vibeTag}
                      </span>
                      <div className="absolute bottom-2 left-3 text-white">
                        <span className="font-editorial text-xl font-bold block">{city.name}</span>
                        <span className="text-[10px] text-white/80">{city.hindi}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white space-y-1">
                      <p className="text-xs font-semibold text-[#201C1A]">{city.badge}</p>
                      <p className="text-[11px] text-[#8C2D19] font-medium flex items-center gap-1">
                        <span>Host: {city.companion}</span>
                      </p>
                    </div>
                  </button>
                ))}

                {/* Extra Admin Cities */}
                {extraCities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      setSelectedCityId(city.id)
                      setActiveCityId(city.id)
                      setCurrentStep(2)
                    }}
                    className="group relative rounded-2xl overflow-hidden border-2 border-[#E5DACB] hover:border-[#8C2D19] text-left transition-all photo-card-zoom cursor-pointer"
                  >
                    <div className="h-32 w-full relative overflow-hidden bg-stone-100">
                      <img
                        src={city.heroImage}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-400"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>
                      <div className="absolute bottom-2 left-3 text-white">
                        <span className="font-editorial text-xl font-bold block">{city.name}</span>
                        <span className="text-[10px] text-white/80">{city.state}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-xs font-semibold text-[#201C1A] truncate">{city.tagline}</p>
                      <p className="text-[11px] text-[#8C2D19] font-medium">Host: {city.persona?.name || 'Local Guide'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 2: HOW MANY DAYS ARE YOU STAYING? */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2 max-w-lg mx-auto">
                <span className="px-3 py-1 rounded-full bg-[#FAF5ED] text-[#8C2D19] text-xs font-bold uppercase tracking-wider inline-block">
                  Destination: {currentCity?.name}
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                  How long is your vacation?
                </h2>
                <p className="text-xs sm:text-sm text-[#665D54]">
                  Pick your trip length. We organize every day so you never rush or get stuck in traffic!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    days: 1,
                    emblem: 'express-1day' as const,
                    badge: 'Dawn to Dusk',
                    title: '1 Day • Express Blitz',
                    sub: 'See the absolute best signature highlight, enjoy hot morning chai, and catch the sunset.',
                  },
                  {
                    days: 2,
                    emblem: 'weekend-2day' as const,
                    badge: 'Weekend Immersion',
                    title: '2 Days • Weekend Getaway',
                    sub: 'Most popular! Top forts, iconic cafes, sunset viewpoints, and famous food alleys.',
                  },
                  {
                    days: 3,
                    emblem: 'classic-3day' as const,
                    badge: 'Recommended',
                    title: '3 Days • Perfect Classic Trip',
                    sub: 'Recommended! Heritage, peaceful dawn boat/treks, hidden stepwells, and relaxed shopping.',
                  },
                  {
                    days: 4,
                    emblem: 'explorer-4day' as const,
                    badge: 'Deep Explorer',
                    title: '4+ Days • Slow Explorer',
                    sub: 'Deep dive into local culture, photography, surrounding hilltops, and offbeat trails.',
                  },
                ].map((opt) => (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => {
                      setSelectedDays(opt.days)
                      setCurrentStep(3)
                    }}
                    className={`group p-5 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-start gap-4 ${
                      selectedDays === opt.days
                        ? 'border-[#8C2D19] bg-[#FCF8F5] ring-2 ring-[#8C2D19]/20 shadow-md'
                        : 'border-[#E5DACB] hover:border-[#8C2D19] bg-[#FAF7F2]'
                    }`}
                  >
                    <TravelEmblem type={opt.emblem} size="lg" className="mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-editorial text-lg font-bold text-[#201C1A] block">
                          {opt.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#8C2D19]">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#5D554C] leading-relaxed">{opt.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCityId(null)
                    setCurrentStep(1)
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#645C55] hover:text-[#201C1A] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Change Destination</span>
                </button>
              </div>
            </div>
          )}

          {/* QUESTION 3: BUDGET STYLE & VIBE */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2 max-w-lg mx-auto">
                <span className="px-3 py-1 rounded-full bg-[#FAF5ED] text-[#8C2D19] text-xs font-bold uppercase tracking-wider inline-block">
                  {currentCity?.name} • {selectedDays} Days
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#201C1A]">
                  What's your daily budget style?
                </h2>
                <p className="text-xs sm:text-sm text-[#665D54]">
                  We calculate honest, itemized rupee costs so there are no surprise charges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'budget',
                    emblem: 'budget-tier' as const,
                    title: 'Pocket-Friendly',
                    desc: 'Clean hostels, street chaat dhabas, shared e-rickshaws',
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
                    desc: 'Shahi palaces, private AC chauffeur, 5-star fine dining',
                    rate: '~₹9.8k / room',
                  },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedBudget(tier.id as BudgetTier)}
                    className={`p-5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      selectedBudget === tier.id
                        ? 'border-[#8C2D19] bg-[#FCF8F5] ring-2 ring-[#8C2D19]/20 shadow-xs'
                        : 'border-[#E5DACB] hover:border-[#8C2D19] bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="space-y-2">
                      <TravelEmblem type={tier.emblem} size="md" />
                      <span className="font-editorial text-lg font-bold text-[#201C1A] block">
                        {tier.title}
                      </span>
                      <p className="text-xs text-[#5D554C] leading-relaxed">{tier.desc}</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#8C2D19] px-2.5 py-0.5 rounded-full bg-[#F5EFE6] self-start">
                      {tier.rate}
                    </span>
                  </button>
                ))}
              </div>

              {/* Who is traveling */}
              <div className="pt-4 border-t border-[#F2ECE1] space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7D736A] block text-center">
                  Who is coming along?
                </label>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {[
                    { id: 'solo', emblem: 'solo-wanderer' as const },
                    { id: 'friends', emblem: 'friends-gang' as const },
                    { id: 'family', emblem: 'family-kids' as const },
                    { id: 'couple', emblem: 'couple-romance' as const },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVibe(v.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedVibe === v.id
                          ? 'bg-[#201C1A] text-white shadow-xs'
                          : 'bg-[#FAF7F2] border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      <TravelEmblem type={v.emblem} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE1]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#645C55] hover:text-[#201C1A] flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBuildTrip(currentCityKey, selectedDays, selectedBudget)}
                  className="px-8 py-3.5 rounded-2xl bg-[#8C2D19] text-white text-sm font-bold hover:bg-[#722312] transition-all flex items-center gap-2 shadow-md hover:scale-102"
                >
                  <Sparkles className="w-4 h-4 text-[#E67E22]" />
                  <span>Build My Adventure Board</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          ANIMATED GENERATING TRANSITION (STEP 4)
         ========================================================================= */}
      {isGenerating && (
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-[#E5DACB] shadow-lg space-y-6 animate-pulse">
          <div className="w-20 h-20 rounded-2xl bg-[#F5EFE6] text-[#8C2D19] flex items-center justify-center mx-auto border border-[#E5DACB] shadow-xs">
            <HomiBrandLogo size="lg" markOnly />
          </div>
          <div className="space-y-2">
            <h3 className="font-editorial text-2xl font-bold text-[#201C1A]">
              {persona?.name || 'Your Local Friend'} is setting up your board...
            </h3>
            <p className="text-xs text-[#645C55] leading-relaxed">
              Curating Reddit-favorite cafes, secret sunset ridges, authentic street chaats, and calculating exact rupee costs for {currentCity?.name}.
            </p>
          </div>
          <div className="w-32 h-1.5 bg-[#8C2D19] rounded-full mx-auto animate-pulse"></div>
        </div>
      )}

      {/* =========================================================================
          THE FULL ADVENTURE BOARD (STEP 5)
         ========================================================================= */}
      {currentStep === 5 && (
        <div className="space-y-10 animate-in fade-in duration-500">
          {/* Top Quick Actions Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5DACB] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs sm:text-sm font-bold text-[#201C1A]">
                Customized for: <strong>{currentCity?.name}</strong> • {selectedDays} Days • {selectedBudget.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToProfile}
                className="px-3.5 py-1.5 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#722312] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Save this trip to your private local profile"
              >
                {tripSavedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                <span>{tripSavedSuccess ? 'Saved to Local DB!' : 'Save Trip Progress'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveCityId(null)
                  setCurrentStep(1)
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5DACB] text-xs font-semibold text-[#554D45] hover:bg-[#F2ECE1] transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change Destination</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  setCopiedLink(true)
                  setTimeout(() => setCopiedLink(false), 2000)
                  onSaveToast('Copied trip link to share with your travel buddies!')
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#201C1A] text-white text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Share Trip'}</span>
              </button>
            </div>
          </div>

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

          {/* 2. REDDIT & DISCORD TRAVELERS' FAVORITE PICKS (SUNSETS, CAFES, STREET FOOD) */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E5DACB] pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Real Traveler Voted • Reddit & Discord Consensus</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A] mt-0.5">
                  The Best Cafes, Sunsets & Food in {currentCity?.name}
                </h2>
              </div>
              <span className="text-xs text-[#7A7167]">
                Sourced from r/{currentCity?.id} & r/solotravelindia
              </span>
            </div>

            {/* Grid of Reddit Community Favorites */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sunset Spot */}
              {sunsetSpots.slice(0, 1).map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E5DACB] shadow-xs flex flex-col justify-between photo-card-zoom"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={spot.photo} alt={spot.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#E67E22] text-white text-[10px] font-bold flex items-center gap-1">
                      <Sun className="w-3 h-3" />
                      <span>{spot.tag}</span>
                    </span>
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <span className="text-[10px] font-semibold text-white/80 block">{spot.neighborhood}</span>
                      <h4 className="font-editorial text-base font-bold leading-tight">{spot.title}</h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between text-xs">
                    <p className="text-[11px] text-[#554D45] italic leading-relaxed">
                      {spot.redditQuote}
                    </p>
                    <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-[11px] text-[#8C2D19] font-bold">
                      <span>Timing: {spot.bestTimeOrOrder}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Reddit Favorite Cafes */}
              {cafeSpots.slice(0, 2).map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E5DACB] shadow-xs flex flex-col justify-between photo-card-zoom"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={spot.photo} alt={spot.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#1B4965] text-white text-[10px] font-bold flex items-center gap-1">
                      <Coffee className="w-3 h-3" />
                      <span>{spot.tag}</span>
                    </span>
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <span className="text-[10px] font-semibold text-white/80 block">{spot.neighborhood}</span>
                      <h4 className="font-editorial text-base font-bold leading-tight">{spot.title}</h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between text-xs">
                    <p className="text-[11px] text-[#554D45] italic leading-relaxed">
                      {spot.redditQuote}
                    </p>
                    <div className="pt-2 border-t border-[#F2ECE1] space-y-0.5 text-[11px]">
                      <span className="font-bold text-[#201C1A] block">{spot.bestTimeOrOrder}</span>
                      <span className="text-[#8C8276]">{spot.priceOrEntry}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Legendary Food Spot */}
              {foodSpots.slice(0, 1).map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E5DACB] shadow-xs flex flex-col justify-between photo-card-zoom"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={spot.photo} alt={spot.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#8C2D19] text-white text-[10px] font-bold flex items-center gap-1">
                      <Utensils className="w-3 h-3" />
                      <span>{spot.tag}</span>
                    </span>
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <span className="text-[10px] font-semibold text-white/80 block">{spot.neighborhood}</span>
                      <h4 className="font-editorial text-base font-bold leading-tight">{spot.title}</h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between text-xs">
                    <p className="text-[11px] text-[#554D45] italic leading-relaxed">
                      {spot.redditQuote}
                    </p>
                    <div className="pt-2 border-t border-[#F2ECE1] space-y-0.5 text-[11px]">
                      <span className="font-bold text-[#201C1A] block">{spot.bestTimeOrOrder}</span>
                      <span className="text-emerald-700 font-bold">{spot.priceOrEntry}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. DAY-BY-DAY VISUAL ITINERARY SCHEDULE */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5DACB] pb-3 gap-3">
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                  Day-by-Day Schedule Curated by {persona?.name}
                </h2>
                <p className="text-xs text-[#7D736A]">
                  Organized by geographic proximity so you never backtrack across the city.
                </p>
              </div>

              {/* View Switcher: Cards vs Connected Flowchart */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="p-1 bg-[#F1F5F9] rounded-2xl flex items-center gap-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setItineraryViewMode('cards')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      itineraryViewMode === 'cards'
                        ? 'bg-white text-[#0F172A] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Cards View
                  </button>

                  <button
                    type="button"
                    onClick={() => setItineraryViewMode('flowchart')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      itineraryViewMode === 'flowchart'
                        ? 'bg-[#3B82F6] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <span>Flowchart View</span>
                  </button>
                </div>

                <span className="text-xs font-bold text-[#8C2D19] px-3 py-1 rounded-full bg-[#FAF5ED]">
                  {itinerary.days.length} Days Planned
                </span>
              </div>
            </div>

            {itineraryViewMode === 'flowchart' ? (
              <CityTripFlowchart cityId={currentCityKey} />
            ) : (
              <div className="space-y-6">
              {itinerary.days.map((day) => (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F2ECE1] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#201C1A] text-white text-xs font-bold flex items-center justify-center">
                        {day.dayNumber}
                      </span>
                      <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#201C1A]">
                        Day {day.dayNumber}: {day.themeTitle}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF5ED] text-[#8C2D19] self-start sm:self-auto">
                      Area: {day.geographicArea}
                    </span>
                  </div>

                  <p className="text-xs text-[#6E645A] italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EFE7DC] flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#8C2D19] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-[#201C1A] not-italic">{persona?.name}'s Tip:</strong> {day.dayNotes}</span>
                  </p>

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
                                  nowSaved ? `Saved "${place.name}"` : `Removed "${place.name}"`
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
                                  <span className="text-emerald-700">Free</span>
                                )}
                              </div>

                              <h4 className="font-editorial text-base font-bold text-[#201C1A] hover:text-[#8C2D19] transition-colors mt-1">
                                <Link to={`/places/${place.slug}`}>{place.name}</Link>
                              </h4>

                              <p className="text-xs text-[#5D554C] mt-1 line-clamp-2">
                                {place.shortDescription}
                              </p>
                            </div>

                            {stop.curatorMealSuggestion && (
                              <div className="pt-2 border-t border-[#EFE7DC] flex items-start gap-1.5 text-xs text-[#735A28]">
                                <Utensils className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#D97706]" />
                                <span className="line-clamp-2">{stop.curatorMealSuggestion}</span>
                              </div>
                            )}

                            <div className="pt-2 border-t border-[#EFE7DC] flex items-center justify-between text-[11px] text-[#8C8276]">
                              <span className="truncate max-w-[150px]">{place.nearestTransit.stationOrStop}</span>
                              <a
                                href={`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=17/${place.latitude}/${place.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8C2D19] font-bold hover:underline flex items-center gap-1"
                                title="View on OpenStreetMap"
                              >
                                <Navigation className="w-3 h-3" />
                                <span>OSM Map</span>
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
          )}
          </div>

          {/* Real-World Street View Visual Landmark Navigator */}
          <div className="space-y-4">
            <StreetViewVisualGuide initialRouteId="dashashwamedh_ghat" />
          </div>

          {/* 4. KID-SIMPLE RUPEE BUDGET CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
                  <Wallet className="w-4 h-4" />
                  <span>Kid-Simple Honest Rupee Budget</span>
                </div>
                <h3 className="font-editorial text-3xl font-bold text-[#201C1A] mt-1">
                  {formatInr(itinerary.budget.grandTotal)}
                  <span className="text-sm font-normal text-[#645C55] ml-2">
                    ({formatInr(itinerary.budget.perPersonTotal)} per person)
                  </span>
                </h3>
              </div>

              <div className="text-xs text-[#7A7167] bg-[#F9F6F0] p-2.5 rounded-xl border border-[#EFE7DC] self-start sm:self-auto">
                <span>{selectedDays} Days • {itinerary.budget.roomCount} Room(s) • {selectedBudget.toUpperCase()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC]">
                <span className="text-[#8A8177] flex items-center gap-1.5 text-[11px] font-semibold">
                  <Building className="w-3.5 h-3.5 text-[#8C2D19]" />
                  <span>Stay ({itinerary.budget.nights} Nights)</span>
                </span>
                <span className="font-bold text-base text-[#201C1A] block mt-1">
                  {formatInr(itinerary.budget.accommodationTotal)}
                </span>
                <span className="text-[10px] text-[#7A7167]">{itinerary.budget.accommodationDescription}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC]">
                <span className="text-[#8A8177] flex items-center gap-1.5 text-[11px] font-semibold">
                  <Utensils className="w-3.5 h-3.5 text-[#8C2D19]" />
                  <span>Food & Dining</span>
                </span>
                <span className="font-bold text-base text-[#201C1A] block mt-1">
                  {formatInr(itinerary.budget.foodTotal)}
                </span>
                <span className="text-[10px] text-[#7A7167]">{itinerary.budget.foodDescription}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC]">
                <span className="text-[#8A8177] flex items-center gap-1.5 text-[11px] font-semibold">
                  <Car className="w-3.5 h-3.5 text-[#8C2D19]" />
                  <span>City Cabs & Autos</span>
                </span>
                <span className="font-bold text-base text-[#201C1A] block mt-1">
                  {formatInr(itinerary.budget.transportTotal)}
                </span>
                <span className="text-[10px] text-[#7A7167]">{itinerary.budget.transportDescription}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC]">
                <span className="text-[#8A8177] flex items-center gap-1.5 text-[11px] font-semibold">
                  <Ticket className="w-3.5 h-3.5 text-[#8C2D19]" />
                  <span>Monument Tariffs</span>
                </span>
                <span className="font-bold text-base text-[#201C1A] block mt-1">
                  {formatInr(itinerary.budget.ticketsTotal)}
                </span>
                <span className="text-[10px] text-[#7A7167]">Official ASI verified tariffs</span>
              </div>
            </div>
          </div>

          {/* 5. VISUAL CITY GALLERY LIGHTBOX */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#8C2D19]" />
                <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                  Photo Gallery of {currentCity?.name}
                </h3>
              </div>
              <span className="text-xs text-[#8A8177]">Tap any photo to zoom</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {currentCity?.galleryPhotos?.map((pUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhotoUrl(pUrl)}
                  className="group relative h-32 rounded-2xl overflow-hidden cursor-pointer photo-card-zoom border border-[#EFE7DC]"
                >
                  <img
                    src={pUrl}
                    alt={`${currentCity.name} gallery ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-2 py-0.5 rounded-lg bg-white/90 text-[10px] font-bold text-[#201C1A]">
                      Zoom
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. LOCAL DATABASE SAVE PROGRESS CALLOUT CARD */}
          <div className="bg-[#FAF5ED] rounded-3xl p-6 sm:p-8 border-2 border-[#ECD7CE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8C2D19] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                    Save This Trip on Your Local Database
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    100% Offline
                  </span>
                </div>
                <p className="text-xs text-[#554D45] max-w-xl leading-relaxed">
                  {hasProfile
                    ? `Save this ${currentCity?.name} itinerary under your local profile (${isUnlocked ? 'Active' : 'Password Protected'}). Retrieve, tweak, or export it anytime on this laptop.`
                    : 'Set up your local profile with a password to save this trip board on your laptop. No cloud accounts, zero tracking.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={handleSaveToProfile}
                className="px-6 py-3 rounded-2xl bg-[#8C2D19] text-white text-xs sm:text-sm font-bold hover:bg-[#722312] transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:scale-102"
              >
                {tripSavedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>
                  {tripSavedSuccess
                    ? 'Saved to Local DB!'
                    : hasProfile
                      ? 'Save Trip Progress'
                      : 'Set Password & Save'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhotoUrl && (
        <div
          onClick={() => setActivePhotoUrl(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={activePhotoUrl}
              alt="Enlarged photo"
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

      {/* Profile & Password Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onToast={onSaveToast}
      />
    </div>
  )
}

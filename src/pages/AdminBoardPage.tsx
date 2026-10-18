import React, { useState } from 'react'
import {
  useAppData,
  addCity,
  updateCity,
  deleteCity,
  addPlace,
  updatePlace,
  deletePlace,
  addDish,
  updateDish,
  deleteDish,
  resetToFactoryDefaults,
  exportFullDatabase,
  importFullDatabase,
} from '../lib/dataStore'
import type { CityInfo, Place, LocalDish, CityPersona } from '../data/types'
import { Link } from '../lib/router'
import {
  Compass,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Download,
  Upload,
  Utensils,
  UserCheck,
  Sparkles,
  ExternalLink,
  Camera,
} from 'lucide-react'

export const AdminBoardPage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  const { cities, places, dishes } = useAppData()
  const [activeTab, setActiveTab] = useState<'cities' | 'places' | 'dishes' | 'personas' | 'backup'>('cities')

  // City Modal State
  const [editingCity, setEditingCity] = useState<CityInfo | null>(null)
  const [isCityModalOpen, setIsCityModalOpen] = useState(false)

  // Place Modal State
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false)

  // Dish Modal State
  const [editingDish, setEditingDish] = useState<LocalDish | null>(null)
  const [isDishModalOpen, setIsDishModalOpen] = useState(false)

  // Filter selection
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all')

  // Import JSON input
  const [importJsonText, setImportJsonText] = useState('')

  const cityList = Object.values(cities)

  // Total photo count calculation
  const totalPhotos =
    cityList.reduce((acc, c) => acc + (c.galleryPhotos?.length || 1), 0) +
    places.length +
    dishes.length

  // Handlers for City Form
  const handleSaveCity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const rawGallery = (formData.get('galleryPhotos') as string) || ''
    const gallery = rawGallery
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const persona: CityPersona = {
      name: (formData.get('personaName') as string) || 'Aapka Local Guide',
      title: (formData.get('personaTitle') as string) || 'Local Companion & Culture Guide',
      badge: (formData.get('personaBadge') as string) || 'Local Pride',
      avatarImage: (formData.get('personaAvatar') as string) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      greeting: (formData.get('personaGreeting') as string) || 'Khamma Ghani! Main hoon aapka city companion.',
      dialectQuote: (formData.get('personaQuote') as string) || 'City ko dil se mehsoos kijiye!',
      localTip: (formData.get('personaTip') as string) || 'Subah jaldi niklein aur local street food ka anand lein.',
    }

    const cityData: CityInfo = {
      id: ((formData.get('id') as string) || 'new-city').toLowerCase().replace(/\s+/g, '-'),
      name: (formData.get('name') as string) || 'New City',
      hindiName: (formData.get('hindiName') as string) || '',
      state: (formData.get('state') as string) || '',
      tagline: (formData.get('tagline') as string) || '',
      heroDescription: (formData.get('heroDescription') as string) || '',
      curatorNote: (formData.get('curatorNote') as string) || '',
      bestSeason: (formData.get('bestSeason') as string) || '',
      idealDays: Number(formData.get('idealDays')) || 3,
      vibeSummary: (formData.get('vibeSummary') as string) || '',
      localEtiquetteTip: (formData.get('localEtiquetteTip') as string) || '',
      transportTip: (formData.get('transportTip') as string) || '',
      heroImage: (formData.get('heroImage') as string) || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: `${formData.get('name')} landscape vista`,
      themeClass: `theme-${((formData.get('id') as string) || 'jaipur').toLowerCase()}`,
      galleryPhotos: gallery.length > 0 ? gallery : [
        (formData.get('heroImage') as string) || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      ],
      persona,
      tasteOfCity: {
        headline: (formData.get('tasteHeadline') as string) || 'Local Flavors & Chaat',
        flavors: ((formData.get('tasteFlavors') as string) || 'Desi Ghee, Spices, Cardamom').split(',').map((s) => s.trim()),
        signatureDish: (formData.get('tasteSignature') as string) || 'Famous Local Thali',
        famousEatery: (formData.get('tasteEatery') as string) || 'Historic Bazaars',
      },
    }

    if (editingCity) {
      updateCity(editingCity.id, cityData)
      onSaveToast(`Updated city "${cityData.name}"`)
    } else {
      addCity(cityData)
      onSaveToast(`Created new destination "${cityData.name}"`)
    }

    setIsCityModalOpen(false)
    setEditingCity(null)
  }

  // Handlers for Place Form
  const handleSavePlace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const rawIndian = formData.get('ticketIndian') as string
    const rawForeigner = formData.get('ticketForeigner') as string

    const placeData: Place = {
      id: editingPlace?.id || `place-${Date.now()}`,
      slug: (formData.get('slug') as string) || `place-${Date.now()}`,
      cityId: (formData.get('cityId') as string) || 'jaipur',
      category: (formData.get('category') as any) || 'heritage',
      name: (formData.get('name') as string) || 'Historic Monument',
      hindiName: (formData.get('hindiName') as string) || '',
      shortDescription: (formData.get('shortDescription') as string) || '',
      whyWorthVisiting: (formData.get('whyWorthVisiting') as string) || '',
      description: (formData.get('description') as string) || '',
      address: (formData.get('address') as string) || '',
      latitude: Number(formData.get('latitude')) || 26.9124,
      longitude: Number(formData.get('longitude')) || 75.7873,
      image: (formData.get('image') as string) || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      imageAlt: (formData.get('name') as string) || '',
      openingHours: (formData.get('openingHours') as string) || '9:00 AM – 5:00 PM',
      closedDays: (formData.get('closedDays') as string) || 'Open all days',
      ticketPrice: {
        indian: rawIndian === 'Free' ? 'Free' : Number(rawIndian) || 50,
        foreigner: rawForeigner === 'Free' ? 'Free' : Number(rawForeigner) || 200,
      },
      currency: 'INR',
      estimatedVisitMinutes: Number(formData.get('durationMinutes')) || 90,
      bestTimeToVisit: (formData.get('bestTime') as string) || 'Morning 9:00 AM',
      visitorSuitability: ['Solo', 'Family', 'Photography'],
      transportNotes: (formData.get('transportNotes') as string) || 'Easily accessible via local e-rickshaw or taxi.',
      nearestTransit: {
        stationOrStop: (formData.get('nearestTransit') as string) || 'City Center Auto Stand',
        walkMinutes: 5,
        mode: 'walk',
      },
      visitorTips: [
        (formData.get('visitorTip') as string) || 'Carry drinking water and wear comfortable shoes.',
      ],
      sourceUrl: 'https://tourism.gov.in',
      lastVerifiedAt: 'Verified today',
      verificationStatus: 'verified',
      isMustVisit: formData.get('isMustVisit') === 'on',
      tags: ((formData.get('tags') as string) || 'Heritage, Culture').split(',').map((s) => s.trim()),
    }

    if (editingPlace) {
      updatePlace(editingPlace.id, placeData)
      onSaveToast(`Updated place "${placeData.name}"`)
    } else {
      addPlace(placeData)
      onSaveToast(`Added new place "${placeData.name}"`)
    }

    setIsPlaceModalOpen(false)
    setEditingPlace(null)
  }

  // Handlers for Dish Form
  const handleSaveDish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const dishData: LocalDish = {
      id: editingDish?.id || `dish-${Date.now()}`,
      cityId: (formData.get('cityId') as string) || 'jaipur',
      name: (formData.get('name') as string) || 'Local Delicacy',
      hindiName: (formData.get('hindiName') as string) || '',
      type: (formData.get('type') as any) || 'snack',
      description: (formData.get('description') as string) || '',
      originStory: (formData.get('originStory') as string) || '',
      iconicSpotName: (formData.get('iconicSpotName') as string) || '',
      spotNeighborhood: (formData.get('spotNeighborhood') as string) || '',
      approxPriceInr: Number(formData.get('approxPriceInr')) || 80,
      image: (formData.get('image') as string) || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    }

    if (editingDish) {
      updateDish(editingDish.id, dishData)
      onSaveToast(`Updated dish "${dishData.name}"`)
    } else {
      addDish(dishData)
      onSaveToast(`Added culinary item "${dishData.name}"`)
    }

    setIsDishModalOpen(false)
    setEditingDish(null)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Top Admin Banner */}
      <section className="bg-[#201C1A] text-white pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#E5DACB] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>Full Customization CMS • Admin Board</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
              HOMI Experience Studio & Board
            </h1>
            <p className="mt-2 text-sm text-[#D5C9BC] max-w-2xl">
              Add new cities, customize authentic local companion personas (like Jaipur's Bhaisaab), manage monuments, food spots, photos, and live itineraries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-white text-[#201C1A] text-xs sm:text-sm font-bold hover:bg-[#F2ECE1] transition-all flex items-center gap-2 shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Switch to User Board</span>
            </Link>

            <button
              onClick={() => {
                if (window.confirm('Reset all cities, places, and dishes back to factory defaults?')) {
                  resetToFactoryDefaults()
                  onSaveToast('Restored default factory seed data')
                }
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Quickbar */}
      <div className="bg-[#F2ECE1] border-b border-[#E5DACB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[#554D45]">
          <div className="flex items-center gap-6">
            <span>🏛️ <strong className="text-[#201C1A]">{cityList.length}</strong> Destinations</span>
            <span>📍 <strong className="text-[#201C1A]">{places.length}</strong> Curated Places</span>
            <span>🍛 <strong className="text-[#201C1A]">{dishes.length}</strong> Local Dishes</span>
            <span>📸 <strong className="text-[#201C1A]">{totalPhotos}+</strong> City Photos</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-800 font-bold">Live Synchronized to User Board</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-2 border-b border-[#E5DACB] pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'cities', label: '1. Destinations & Cities', count: cityList.length },
            { id: 'personas', label: '2. Authentic Cultural Personas', count: cityList.length },
            { id: 'places', label: '3. Places & Monuments', count: places.length },
            { id: 'dishes', label: '4. Taste & Dishes', count: dishes.length },
            { id: 'backup', label: '5. JSON Backup & Restore', count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#201C1A] text-white shadow-xs'
                  : 'text-[#645C55] hover:text-[#201C1A] hover:bg-[#EFE8DD]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#E5DACB] text-[#554D45]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ---------------- TAB 1: DESTINATIONS & CITIES ---------------- */}
        {activeTab === 'cities' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">Active Destinations</h2>
                <p className="text-xs text-[#6E645A]">
                  Manage existing cities or add brand new Indian destinations with custom palettes, photos, and local personas.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCity(null)
                  setIsCityModalOpen(true)
                }}
                className="px-4 py-2.5 rounded-xl bg-[#8C2D19] text-white text-xs sm:text-sm font-bold hover:bg-[#722312] transition-colors flex items-center gap-2 shadow-xs self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New City</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityList.map((city) => (
                <div
                  key={city.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E5DACB] shadow-xs flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={city.heroImage}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#201C1A]">
                      {city.state}
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>{city.galleryPhotos?.length || 1} photos</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-editorial text-2xl font-bold">{city.name}</h3>
                        {city.hindiName && (
                          <span className="text-sm text-white/80 font-normal">{city.hindiName}</span>
                        )}
                      </div>
                      <p className="text-xs text-white/80 line-clamp-1">{city.tagline}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                    <div className="space-y-2 text-xs text-[#554D45]">
                      <div className="p-2.5 rounded-xl bg-[#F9F6F0] border border-[#EFE7DC] flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#8C2D19] flex-shrink-0" />
                        <div>
                          <strong className="text-[#201C1A] block">{city.persona?.name || 'Local Companion'}</strong>
                          <span className="text-[11px] text-[#7A7167] line-clamp-1">{city.persona?.greeting || city.tagline}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#7A7167]">
                        <span>Ideal: <strong>{city.idealDays} Days</strong></span>
                        <span>Taste: <strong>{city.tasteOfCity?.signatureDish}</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-2">
                      <Link
                        to={`/${city.id}`}
                        className="text-xs font-semibold text-[#8C2D19] hover:underline flex items-center gap-1"
                      >
                        <span>View Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingCity(city)
                            setIsCityModalOpen(true)
                          }}
                          className="p-2 rounded-lg bg-[#F5EFE6] text-[#201C1A] hover:bg-[#EAE0D2] transition-colors text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${city.name}" from your active board?`)) {
                              deleteCity(city.id)
                              onSaveToast(`Deleted city "${city.name}"`)
                            }
                          }}
                          className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          aria-label={`Delete ${city.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: AUTHENTIC CULTURAL PERSONAS ---------------- */}
        {activeTab === 'personas' && (
          <div className="pt-6 space-y-6">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">Authentic Cultural Companions</h2>
              <p className="text-xs text-[#6E645A]">
                Each Indian destination has its own authentic local companion who welcomes travelers, shares local idioms, and personally signs off itineraries (e.g. Jaipur's Bhaisaab, Udaipur's Banna Sa, Varanasi's Banarasi Bhaiya).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cityList.map((city) => {
                const persona = city.persona
                return (
                  <div
                    key={city.id}
                    className="bg-white rounded-3xl p-6 border border-[#E5DACB] shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-[#F2ECE1] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#8C2D19] flex-shrink-0">
                          <img
                            src={persona?.avatarImage || city.heroImage}
                            alt={persona?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="inline-block px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#8C2D19] text-[10px] font-bold uppercase tracking-wider mb-1">
                            {city.name} • {persona?.badge || 'Local Guide'}
                          </div>
                          <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                            {persona?.name}
                          </h3>
                          <span className="text-xs text-[#6E645A] block">{persona?.title}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditingCity(city)
                          setIsCityModalOpen(true)
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#F5EFE6] text-[#201C1A] text-xs font-bold hover:bg-[#EAE0D2] transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Customize Voice</span>
                      </button>
                    </div>

                    {/* Greeting Preview */}
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl bg-[#FBF8F3] border border-[#EFE7DC] space-y-1">
                        <strong className="text-[#8C2D19] block uppercase tracking-wider text-[10px]">
                          Dialect Welcome Greeting:
                        </strong>
                        <p className="text-[#201C1A] italic font-medium leading-relaxed">
                          "{persona?.greeting}"
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#F9F7F3] border border-[#EBE3D7] space-y-1">
                        <strong className="text-[#201C1A] block uppercase tracking-wider text-[10px]">
                          Cultural Philosophy & Quote:
                        </strong>
                        <p className="text-[#554D45] leading-relaxed">
                          "{persona?.dialectQuote}"
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBDCC5] text-[#7A5A1B] space-y-0.5">
                        <strong className="block font-bold text-[11px]">
                          Insider Tip:
                        </strong>
                        <p className="text-[11px] leading-relaxed">{persona?.localTip}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: PLACES & MONUMENTS ---------------- */}
        {activeTab === 'places' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">Monuments & Curated Places</h2>
                <p className="text-xs text-[#6E645A]">
                  Add verified attractions, stepwells, ghats, and hidden havelis for any city.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedCityFilter}
                  onChange={(e) => setSelectedCityFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-white border border-[#E5DACB] text-xs font-semibold text-[#201C1A]"
                >
                  <option value="all">All Cities ({places.length})</option>
                  {cityList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setEditingPlace(null)
                    setIsPlaceModalOpen(true)
                  }}
                  className="px-4 py-2 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#722312] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Place</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places
                .filter((p) => selectedCityFilter === 'all' || p.cityId.toLowerCase() === selectedCityFilter.toLowerCase())
                .map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E5DACB] shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                        {place.cityId} • {place.category}
                      </div>
                      {place.isMustVisit && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#8C2D19] text-white text-[10px] font-bold">
                          Must Visit
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-editorial text-lg font-bold text-[#201C1A]">{place.name}</h3>
                        <p className="text-xs text-[#645C55] line-clamp-2 mt-1">{place.shortDescription}</p>
                      </div>

                      <div className="pt-2 border-t border-[#F2ECE1] space-y-1 text-[11px] text-[#7A7167]">
                        <div className="flex items-center justify-between">
                          <span>Tariff: <strong>₹{place.ticketPrice.indian}</strong> (Indian)</span>
                          <span>Time: <strong>{place.estimatedVisitMinutes} mins</strong></span>
                        </div>
                        <div className="truncate">Transit: {place.nearestTransit.stationOrStop}</div>
                      </div>

                      <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                        <Link
                          to={`/places/${place.slug}`}
                          className="text-xs font-semibold text-[#8C2D19] hover:underline"
                        >
                          View Detail
                        </Link>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingPlace(place)
                              setIsPlaceModalOpen(true)
                            }}
                            className="p-1.5 rounded-lg bg-[#F5EFE6] text-[#201C1A] hover:bg-[#EAE0D2] text-xs font-bold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete place "${place.name}"?`)) {
                                deletePlace(place.id)
                                onSaveToast(`Deleted place "${place.name}"`)
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: TASTE & DISHES ---------------- */}
        {activeTab === 'dishes' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">Taste of Every City (Culinary)</h2>
                <p className="text-xs text-[#6E645A]">
                  Manage iconic street foods, sweets, thalis, and legendary eateries with street prices.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedCityFilter}
                  onChange={(e) => setSelectedCityFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-white border border-[#E5DACB] text-xs font-semibold text-[#201C1A]"
                >
                  <option value="all">All Cities ({dishes.length})</option>
                  {cityList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setEditingDish(null)
                    setIsDishModalOpen(true)
                  }}
                  className="px-4 py-2 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#722312] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dish</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes
                .filter((d) => selectedCityFilter === 'all' || d.cityId.toLowerCase() === selectedCityFilter.toLowerCase())
                .map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E5DACB] shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider">
                        {dish.cityId} • {dish.type}
                      </div>
                      <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                        ₹{dish.approxPriceInr}
                      </div>
                    </div>

                    <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-editorial text-base font-bold text-[#201C1A]">{dish.name}</h3>
                        <p className="text-xs text-[#645C55] line-clamp-2 mt-1">{dish.description}</p>
                      </div>

                      <div className="pt-2 border-t border-[#F2ECE1] text-[11px] text-[#7A7167]">
                        <span>Iconic Spot: <strong>{dish.iconicSpotName}</strong> ({dish.spotNeighborhood})</span>
                      </div>

                      <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingDish(dish)
                            setIsDishModalOpen(true)
                          }}
                          className="p-1.5 rounded-lg bg-[#F5EFE6] text-[#201C1A] hover:bg-[#EAE0D2] text-xs font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete dish "${dish.name}"?`)) {
                              deleteDish(dish.id)
                              onSaveToast(`Deleted dish "${dish.name}"`)
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 5: JSON BACKUP & RESTORE ---------------- */}
        {activeTab === 'backup' && (
          <div className="pt-6 space-y-6 max-w-3xl">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">Export & Restore Database</h2>
              <p className="text-xs text-[#6E645A]">
                Backup all your customized destinations, monuments, personas, and food spots, or restore a JSON snapshot.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E5DACB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#201C1A]">Download Live Database Snapshot</h3>
                  <p className="text-xs text-[#7A7167]">Export current live database including all custom cities.</p>
                </div>
                <button
                  onClick={() => {
                    const json = exportFullDatabase()
                    navigator.clipboard.writeText(json)
                    onSaveToast('Copied full JSON database to clipboard!')
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#201C1A] text-white text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#F2ECE1] space-y-3">
                <h3 className="font-bold text-sm text-[#201C1A]">Import JSON Snapshot</h3>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste JSON configuration here..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DACB] text-xs font-mono text-[#201C1A] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]/30"
                ></textarea>

                <button
                  onClick={() => {
                    if (!importJsonText.trim()) return
                    const success = importFullDatabase(importJsonText)
                    if (success) {
                      onSaveToast('Successfully imported database snapshot!')
                      setImportJsonText('')
                    } else {
                      alert('Invalid JSON structure. Please check the format.')
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#722312] transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore Database</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- MODAL: ADD / EDIT CITY ---------------- */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                {editingCity ? `Edit Destination: ${editingCity.name}` : 'Add New Indian City'}
              </h2>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="text-xs font-bold text-[#8C8276] hover:text-[#201C1A]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveCity} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#7D736A] block mb-1">
                    City ID (slug)
                  </label>
                  <input
                    name="id"
                    required
                    defaultValue={editingCity?.id || ''}
                    placeholder="e.g. goa, agra, amritsar"
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm text-[#201C1A]"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#7D736A] block mb-1">
                    City Name
                  </label>
                  <input
                    name="name"
                    required
                    defaultValue={editingCity?.name || ''}
                    placeholder="e.g. Goa"
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm text-[#201C1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#7D736A] block mb-1">
                    Hindi Name
                  </label>
                  <input
                    name="hindiName"
                    defaultValue={editingCity?.hindiName || ''}
                    placeholder="e.g. गोवा"
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm text-[#201C1A]"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#7D736A] block mb-1">
                    State
                  </label>
                  <input
                    name="state"
                    required
                    defaultValue={editingCity?.state || ''}
                    placeholder="e.g. Goa, Uttar Pradesh"
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm text-[#201C1A]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#7D736A] block mb-1">
                  Tagline
                </label>
                <input
                  name="tagline"
                  required
                  defaultValue={editingCity?.tagline || ''}
                  placeholder="e.g. Shimmering beaches, Portuguese churches, and spice plantations."
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm text-[#201C1A]"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#7D736A] block mb-1">
                  Hero Image URL
                </label>
                <input
                  name="heroImage"
                  required
                  defaultValue={editingCity?.heroImage || ''}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm text-[#201C1A]"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#7D736A] block mb-1">
                  City Photo Gallery URLs (one per line)
                </label>
                <textarea
                  name="galleryPhotos"
                  rows={3}
                  defaultValue={editingCity?.galleryPhotos?.join('\n') || ''}
                  placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs font-mono text-[#201C1A]"
                ></textarea>
              </div>

              {/* Persona Section */}
              <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EFE7DC] space-y-3">
                <h4 className="font-bold text-[#8C2D19] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Authentic Cultural Companion Voice</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#7D736A] block mb-0.5">Persona Name</label>
                    <input
                      name="personaName"
                      required
                      defaultValue={editingCity?.persona?.name || 'Aapke Bhaisaab'}
                      placeholder="e.g. Aapke Bhaisaab, Aapke Banna Sa"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-[#E5DACB] text-xs text-[#201C1A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7D736A] block mb-0.5">Title / Badge</label>
                    <input
                      name="personaTitle"
                      defaultValue={editingCity?.persona?.title || 'Local Companion & Culture Guide'}
                      placeholder="e.g. Pink City Elder Brother & Dost"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-[#E5DACB] text-xs text-[#201C1A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#7D736A] block mb-0.5">Dialect Greeting</label>
                  <input
                    name="personaGreeting"
                    required
                    defaultValue={editingCity?.persona?.greeting || 'Khamma Ghani! Main hoon aapka city companion.'}
                    placeholder="e.g. Khamma Ghani Hukum! Main hoon aapka Jaipur wala Bhaisaab."
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-[#E5DACB] text-xs text-[#201C1A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#7D736A] block mb-0.5">Authentic Cultural Quote</label>
                  <input
                    name="personaQuote"
                    defaultValue={editingCity?.persona?.dialectQuote || 'City ko kisi guide book se nahi, apnepan se dekha jata hai!'}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-[#E5DACB] text-xs text-[#201C1A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#7D736A] block mb-0.5">Local Insider Tip</label>
                  <input
                    name="personaTip"
                    defaultValue={editingCity?.persona?.localTip || 'Subah jaldi niklein aur local street food ka anand lein.'}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-[#E5DACB] text-xs text-[#201C1A]"
                  />
                </div>
              </div>

              {/* Taste Section */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE7DC] space-y-3">
                <h4 className="font-bold text-[#201C1A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#D97706]" />
                  <span>Taste of the City</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#7D736A] block mb-0.5">Signature Dish</label>
                    <input
                      name="tasteSignature"
                      defaultValue={editingCity?.tasteOfCity?.signatureDish || ''}
                      placeholder="e.g. Goan Fish Curry Thali"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-[#E5DACB] text-xs text-[#201C1A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7D736A] block mb-0.5">Famous Eatery</label>
                    <input
                      name="tasteEatery"
                      defaultValue={editingCity?.tasteOfCity?.famousEatery || ''}
                      placeholder="e.g. Vinayak & Ritz Classic"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-[#E5DACB] text-xs text-[#201C1A]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2ECE1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCityModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5DACB] text-xs font-semibold text-[#554D45]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#722312] shadow-xs"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ADD / EDIT PLACE ---------------- */}
      {isPlaceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                {editingPlace ? `Edit Place: ${editingPlace.name}` : 'Add New Curated Place'}
              </h2>
              <button
                onClick={() => setIsPlaceModalOpen(false)}
                className="text-xs font-bold text-[#8C8276] hover:text-[#201C1A]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSavePlace} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#7D736A] block mb-1">City</label>
                  <select
                    name="cityId"
                    defaultValue={editingPlace?.cityId || 'jaipur'}
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs font-semibold text-[#201C1A]"
                  >
                    {cityList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#7D736A] block mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingPlace?.category || 'heritage'}
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs font-semibold text-[#201C1A]"
                  >
                    <option value="heritage">Heritage & Monument</option>
                    <option value="food">Food & Culinary Spot</option>
                    <option value="sunset">Sunset & Scenic View</option>
                    <option value="neighborhood">Neighborhood & Bazaars</option>
                    <option value="hidden_gem">Hidden Gem & Stepwell</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#7D736A] block mb-1">Place Name</label>
                <input
                  name="name"
                  required
                  defaultValue={editingPlace?.name || ''}
                  placeholder="e.g. Hawa Mahal"
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm text-[#201C1A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#7D736A] block mb-1">URL Slug</label>
                <input
                  name="slug"
                  required
                  defaultValue={editingPlace?.slug || ''}
                  placeholder="e.g. hawa-mahal"
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs text-[#201C1A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#7D736A] block mb-1">Photo Image URL</label>
                <input
                  name="image"
                  required
                  defaultValue={editingPlace?.image || ''}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs text-[#201C1A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#7D736A] block mb-1">Short Description</label>
                <textarea
                  name="shortDescription"
                  rows={2}
                  defaultValue={editingPlace?.shortDescription || ''}
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs text-[#201C1A]"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#7D736A] block mb-1">Indian Ticket (₹)</label>
                  <input
                    name="ticketIndian"
                    defaultValue={editingPlace?.ticketPrice.indian ?? 50}
                    placeholder="e.g. 50 or Free"
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs text-[#201C1A]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#7D736A] block mb-1">Duration (minutes)</label>
                  <input
                    name="durationMinutes"
                    type="number"
                    defaultValue={editingPlace?.estimatedVisitMinutes || 90}
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs text-[#201C1A]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isMustVisit"
                  id="mustVisit"
                  defaultChecked={editingPlace?.isMustVisit ?? true}
                  className="w-4 h-4 text-[#8C2D19] rounded"
                />
                <label htmlFor="mustVisit" className="font-bold text-[#201C1A]">
                  Mark as Must-Visit Signature Landmark
                </label>
              </div>

              <div className="pt-4 border-t border-[#F2ECE1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5DACB] text-xs font-semibold text-[#554D45]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#722312] shadow-xs"
                >
                  Save Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ADD / EDIT DISH ---------------- */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
              <h2 className="font-editorial text-2xl font-bold text-[#201C1A]">
                {editingDish ? `Edit Dish: ${editingDish.name}` : 'Add Local Authentic Dish'}
              </h2>
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="text-xs font-bold text-[#8C8276] hover:text-[#201C1A]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#7D736A] block mb-1">City</label>
                  <select
                    name="cityId"
                    defaultValue={editingDish?.cityId || 'jaipur'}
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs font-semibold text-[#201C1A]"
                  >
                    {cityList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#7D736A] block mb-1">Diet Type</label>
                  <select
                    name="type"
                    defaultValue={editingDish?.type || 'snack'}
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs font-semibold text-[#201C1A]"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="snack">Street Snack</option>
                    <option value="sweet">Mithai / Sweet</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#7D736A] block mb-1">Dish Name</label>
                <input
                  name="name"
                  required
                  defaultValue={editingDish?.name || ''}
                  placeholder="e.g. Rawat Pyaaz Kachori"
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-sm text-[#201C1A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#7D736A] block mb-1">Photo Image URL</label>
                <input
                  name="image"
                  required
                  defaultValue={editingDish?.image || ''}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs text-[#201C1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#7D736A] block mb-1">Iconic Spot Name</label>
                  <input
                    name="iconicSpotName"
                    required
                    defaultValue={editingDish?.iconicSpotName || ''}
                    placeholder="e.g. Rawat Mishthan Bhandar"
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs text-[#201C1A]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#7D736A] block mb-1">Approx Street Price (₹)</label>
                  <input
                    name="approxPriceInr"
                    type="number"
                    defaultValue={editingDish?.approxPriceInr || 50}
                    className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs text-[#201C1A]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#7D736A] block mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingDish?.description || ''}
                  className="w-full py-2 px-3 rounded-xl bg-[#F9F7F3] border border-[#E5DACB] text-xs text-[#201C1A]"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-[#F2ECE1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5DACB] text-xs font-semibold text-[#554D45]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#722312] shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

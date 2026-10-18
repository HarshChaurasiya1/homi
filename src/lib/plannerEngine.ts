/**
 * HOMI Deterministic Itinerary & Honest Budget Calculation Engine
 * Rule-based, testable, and transparent for all cities with authentic local companion personas.
 */

import { getPlaces, getCity } from './dataStore'
import type { Place, CityId, CityPersona } from '../data/types'

export type DestinationChoice = 'jaipur' | 'udaipur' | 'manali' | 'varanasi' | 'mussoorie' | 'delhi' | string
export type BudgetTier = 'budget' | 'moderate' | 'premium'
export type TravelInterest = 
  | 'heritage'
  | 'food'
  | 'photography'
  | 'shopping'
  | 'hidden_gem'
  | 'relaxed'

export interface PlannerInputs {
  destination: DestinationChoice
  days: number
  travellers: number
  budgetTier: BudgetTier
  interests: TravelInterest[]
  nationality: 'indian' | 'foreigner'
}

export interface ItineraryStop {
  place: Place
  slot: 'morning' | 'afternoon' | 'evening'
  timingNote: string
  suggestedDurationMinutes: number
  curatorMealSuggestion?: string
  ticketCostInr: number
}

export interface DayPlan {
  dayNumber: number
  cityId: CityId
  cityName: string
  themeTitle: string
  geographicArea: string
  stops: ItineraryStop[]
  dayNotes: string
}

export interface BudgetBreakdown {
  currency: 'INR'
  travellerCount: number
  dayCount: number
  roomCount: number
  nights: number
  
  // Line items
  accommodationTotal: number
  accommodationPerNight: number
  accommodationDescription: string
  
  foodTotal: number
  foodPerPersonPerDay: number
  foodDescription: string
  
  transportTotal: number
  transportDescription: string
  
  ticketsTotal: number
  ticketsVerifiedCount: number
  ticketsDescription: string
  
  bufferTotal: number
  bufferDescription: string
  
  // Totals
  grandTotal: number
  perPersonTotal: number
  assumptions: string[]
  exclusions: string[]
}

export interface GeneratedItinerary {
  inputs: PlannerInputs
  days: DayPlan[]
  budget: BudgetBreakdown
  persona: CityPersona
  generatedAt: string
}

export const BUDGET_RATES = {
  accommodationPerRoomPerNight: {
    budget: 1400, // Clean guesthouse / backpacker mountain hostel
    moderate: 3800, // Charming heritage haveli / mountain valley resort
    premium: 9800, // Luxury palace, boutique lakefront, or 5-star mountain chalet
  },
  foodPerPersonPerDay: {
    budget: 450, // Street food icons, chaat, siddu, kachori, local dhabas
    moderate: 1100, // Lakeside haveli dining, Landour bakehouses, rooftop cafes
    premium: 2400, // Royal Mewari thalis, fine-dining havelis, craft cuisine
  },
  transportPerGroupPerDay: {
    budget: 300, // Public e-rickshaws, shared autos, walking trails
    moderate: 950, // Dedicated city autos, app-cabs, mountain taxis
    premium: 2400, // Private dedicated AC chauffeur-driven sedan / hill SUV
  },
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateBudget(
  inputs: PlannerInputs,
  itineraryPlaces: Place[]
): BudgetBreakdown {
  const { days, travellers, budgetTier, nationality } = inputs
  const nights = Math.max(1, days - 1)
  const roomCount = Math.ceil(travellers / 2) // 2 persons per double room

  // Accommodation (Group level: rooms * nights * roomRate)
  const roomRate = BUDGET_RATES.accommodationPerRoomPerNight[budgetTier]
  const accommodationTotal = roomCount * nights * roomRate
  const accommodationDescription = `${roomCount} room(s) × ${nights} night(s) @ ${formatInr(roomRate)}/room/night`

  // Food (Per person level: travellers * days * foodRate)
  const foodRate = BUDGET_RATES.foodPerPersonPerDay[budgetTier]
  const foodTotal = travellers * days * foodRate
  const foodDescription = `${travellers} traveller(s) × ${days} day(s) @ ${formatInr(foodRate)}/day`

  // Transport
  let transportTotal = 0
  let transportDescription = ''
  if (budgetTier === 'budget') {
    transportTotal = travellers * days * BUDGET_RATES.transportPerGroupPerDay.budget
    transportDescription = `Local e-rickshaws, shared mountain autos & walking routes for ${travellers} person(s)`
  } else if (budgetTier === 'moderate') {
    transportTotal = days * BUDGET_RATES.transportPerGroupPerDay.moderate
    transportDescription = `App-cabs, dedicated autos & local hill taxis for group`
  } else {
    transportTotal = days * BUDGET_RATES.transportPerGroupPerDay.premium
    transportDescription = `Dedicated private chauffeur-driven vehicle for all days`
  }

  // Attraction Tickets & Boat rides (Actual sum of curated monuments)
  let ticketsTotal = 0
  let ticketsVerifiedCount = 0
  itineraryPlaces.forEach((place) => {
    const cost = nationality === 'indian' ? place.ticketPrice.indian : place.ticketPrice.foreigner
    if (typeof cost === 'number') {
      ticketsTotal += cost * travellers
      ticketsVerifiedCount++
    }
  })
  const ticketsDescription = `Official monument and boat tariffs for ${travellers} ${nationality === 'indian' ? 'Indian national(s)' : 'international guest(s)'} across ${itineraryPlaces.length} scheduled stops`

  // Buffer (8% for water, chai stops, shoes checking, local guide tipping)
  const subtotal = accommodationTotal + foodTotal + transportTotal + ticketsTotal
  const bufferTotal = Math.round(subtotal * 0.08)
  const bufferDescription = 'Incidental allowance (8%): bottled water, kulhad chai, temple shoe tokens, and boat tips'

  const grandTotal = subtotal + bufferTotal
  const perPersonTotal = Math.round(grandTotal / travellers)

  const assumptions = [
    `Accommodation is based on ${roomCount} double-occupancy room(s) for ${travellers} guest(s).`,
    `Food estimates cover 3 daily regional meals plus afternoon tea and authentic street food tastings.`,
    `Ticket prices reflect official Archaeological Survey of India (ASI) and State Tourism tariffs.`,
  ]

  const exclusions = [
    'Interstate travel (flights, intercity trains, or transfers between cities).',
    'Personal shopping, handicraft purchases, textiles, jewelry, and high-value souvenirs.',
    'Alcoholic beverages and optional temple puja offerings where applicable.',
  ]

  return {
    currency: 'INR',
    travellerCount: travellers,
    dayCount: days,
    roomCount,
    nights,
    accommodationTotal,
    accommodationPerNight: roomRate,
    accommodationDescription,
    foodTotal,
    foodPerPersonPerDay: foodRate,
    foodDescription,
    transportTotal,
    transportDescription,
    ticketsTotal,
    ticketsVerifiedCount,
    ticketsDescription,
    bufferTotal,
    bufferDescription,
    grandTotal,
    perPersonTotal,
    assumptions,
    exclusions,
  }
}

export function generateItinerary(inputs: PlannerInputs): GeneratedItinerary {
  const { destination, days, nationality } = inputs
  const dayPlans: DayPlan[] = []
  const allScheduledPlaces: Place[] = []

  const allPlaces = getPlaces()
  const destCity = getCity(destination) || getCity('jaipur')

  // Default / fallback persona if missing
  const persona: CityPersona = destCity?.persona || {
    name: `Aapka ${destCity?.name || 'Local'} Companion`,
    title: `Local Friend & Culture Guide of ${destCity?.name || 'India'}`,
    badge: 'Local Guide',
    avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    greeting: `Namaste! Main hoon aapka ${destCity?.name} companion.`,
    dialectQuote: `Humari shaan aur culture ko dil se mehsoos kijiye. Maine aapke liye khas plan banaya hai!`,
    localTip: `Local Tip: Subah jaldi niklein aur local street food ka anand lein.`,
  }

  // City-specific thematic clusters
  const cityClusters: Record<string, Array<{
    themeTitle: string
    geographicArea: string
    dayNotes: string
    morning: { slug: string; timing: string; mealNote: string }
    afternoon: { slug: string; timing: string; mealNote: string }
    evening: { slug: string; timing: string; mealNote: string }
  }>> = {
    jaipur: [
      {
        themeTitle: 'The Heart of the Pink City (Aapke Bhaisaab Special)',
        geographicArea: 'Walled City (Badi Chaupar & Forts)',
        dayNotes: 'Arrive early at Hawa Mahal to catch soft sunrise light reflecting on the jharokhas.',
        morning: {
          slug: 'hawa-mahal',
          timing: '8:00 AM – 9:30 AM',
          mealNote: 'Breakfast: Steaming Pyaaz Kachori and sweet lassi at Rawat Mishthan Bhandar.',
        },
        afternoon: {
          slug: 'amer-fort',
          timing: '10:30 AM – 1:30 PM',
          mealNote: 'Lunch: Traditional Mewari Thali with pure desi ghee.',
        },
        evening: {
          slug: 'nahargarh-fort',
          timing: '4:00 PM – 6:30 PM (Sunset over the Pink City)',
          mealNote: 'Dinner: Sunset tea and snacks at Padao terrace overlooking the city lights.',
        },
      },
    ],

    udaipur: [
      {
        themeTitle: 'Palaces, Lake Pichola & Evening Folk Lights (Banna Sa Plan)',
        geographicArea: 'Old City & Lakefront Ghats',
        dayNotes: 'Lake Pichola sunset boat ride is best booked for the 5:00 PM golden hour departure.',
        morning: {
          slug: 'city-palace-udaipur',
          timing: '9:00 AM – 11:30 AM',
          mealNote: 'Breakfast: Fresh Mirchi Vada and hot jalebis at Jagdish Chowk.',
        },
        afternoon: {
          slug: 'bagore-ki-haveli-gangaur-ghat',
          timing: '12:30 PM – 3:30 PM',
          mealNote: 'Lunch: Authentic Dal Baati Churma at Krishna Dal Bati Restro.',
        },
        evening: {
          slug: 'lake-pichola-and-jag-mandir',
          timing: '4:45 PM – 7:30 PM',
          mealNote: 'Dinner: Romantic lakeside dinner at Ambrai with views of illuminated City Palace.',
        },
      },
    ],

    manali: [
      {
        themeTitle: 'Sacred Deodars, Bohemian Trails & Waterfalls (Pahadi Bro Vibe)',
        geographicArea: 'Old Manali & Vashisht Ridges',
        dayNotes: 'Wear walking shoes for the pine needle trails of Dhungri forest and Old Manali.',
        morning: {
          slug: 'hadimba-devi-temple',
          timing: '8:30 AM – 10:30 AM',
          mealNote: 'Breakfast: Hot Himachali Siddu with pure ghee and walnut chutney.',
        },
        afternoon: {
          slug: 'old-manali-village-and-cafes',
          timing: '11:30 AM – 2:30 PM',
          mealNote: 'Lunch: Pan-seared Himalayan trout fish & apple cider at Cafe 1947 by the river.',
        },
        evening: {
          slug: 'jogini-waterfalls-vashisht-trek',
          timing: '3:30 PM – 6:30 PM',
          mealNote: 'Evening Chai: Fresh mountain cookies and hot seabuckthorn tea at Dylan’s.',
        },
      },
    ],

    varanasi: [
      {
        themeTitle: 'The Sacred Crescent: Dawn to Grand Evening Aarti (Banarasi Bhaiya Plan)',
        geographicArea: 'Ancient Ghats & Kashi Vishwanath Corridor',
        dayNotes: 'Wake early for the 5:30 AM dawn boat ride from Assi Ghat to witness morning prayers.',
        morning: {
          slug: 'subah-e-banaras-boat-ride',
          timing: '5:30 AM – 8:00 AM',
          mealNote: 'Breakfast: Winter Malaiyo foam cloud and hot chana kachori at Thatheri Bazaar.',
        },
        afternoon: {
          slug: 'kashi-vishwanath-temple-corridor',
          timing: '11:00 AM – 1:30 PM',
          mealNote: 'Lunch: Kashi Tamatar Chaat in an earthen kulhad followed by sweet Banarasi Paan.',
        },
        evening: {
          slug: 'dashashwamedh-ghat-ganga-aarti',
          timing: '5:30 PM – 7:30 PM',
          mealNote: 'Dinner: Piping hot ginger kulhad chai and Rabdi at Dashashwamedh Ghat.',
        },
      },
    ],

    mussoorie: [
      {
        themeTitle: 'Misty Landour Pines & Himalayan Sunsets (Hillside Storyteller)',
        geographicArea: 'Landour Cantt & George Everest Ridge',
        dayNotes: 'Landour is best explored on foot under giant deodar trees away from Mall Road traffic.',
        morning: {
          slug: 'landour-lal-tibba-and-char-dukan',
          timing: '8:30 AM – 11:30 AM',
          mealNote: 'Breakfast: Char Dukan butter bun omelette and warm Landour apple pie.',
        },
        afternoon: {
          slug: 'happy-valley-tibetan-monastery',
          timing: '12:30 PM – 2:30 PM',
          mealNote: 'Lunch: Steamed Tibetan Tingmo with garlicky mountain greens at Kalsang.',
        },
        evening: {
          slug: 'george-everest-house-and-peak',
          timing: '3:45 PM – 6:30 PM',
          mealNote: 'Dinner: Sunset tea on the mountain ridge and sticky toffee pudding at Rokeby Manor.',
        },
      },
    ],

    delhi: [
      {
        themeTitle: 'Mughal Splendors & Sufi Trails (Dilli Dilwala Trail)',
        geographicArea: 'Old Delhi & Nizamuddin',
        dayNotes: 'Start early in Chandni Chowk before the market opens for peaceful heritage walks.',
        morning: {
          slug: 'humayuns-tomb',
          timing: '8:00 AM – 10:30 AM',
          mealNote: 'Breakfast: Hot Bedmi Puri and Nagori Halwa in Old Delhi.',
        },
        afternoon: {
          slug: 'qutub-minar',
          timing: '12:00 PM – 2:30 PM',
          mealNote: 'Lunch: Sita Ram Diwan Chand Chole Bhature.',
        },
        evening: {
          slug: 'chandni-chowk-and-dariba-kalan',
          timing: '4:00 PM – 7:00 PM',
          mealNote: 'Dinner: Karim’s Jama Masjid mutton seekh & roomali roti.',
        },
      },
    ],
  }

  const targetCityId = (destination || 'jaipur').toLowerCase()
  const clusters = cityClusters[targetCityId]

  const getTicketRate = (p: Place): number => {
    const fee = nationality === 'indian' ? p.ticketPrice.indian : p.ticketPrice.foreigner
    return typeof fee === 'number' ? fee : 0
  }

  // If curated clusters exist for this city
  if (clusters && clusters.length > 0) {
    for (let i = 0; i < days; i++) {
      const dayNumber = i + 1
      const cluster = clusters[i % clusters.length]
      const cityName = destCity?.name || (targetCityId.charAt(0).toUpperCase() + targetCityId.slice(1))

      const morningPlace = allPlaces.find((p) => p.slug === cluster.morning.slug) || allPlaces[0]
      const afternoonPlace = allPlaces.find((p) => p.slug === cluster.afternoon.slug) || allPlaces[1]
      const eveningPlace = allPlaces.find((p) => p.slug === cluster.evening.slug) || allPlaces[2]

      allScheduledPlaces.push(morningPlace, afternoonPlace, eveningPlace)

      const stops: ItineraryStop[] = [
        {
          place: morningPlace,
          slot: 'morning',
          timingNote: cluster.morning.timing,
          suggestedDurationMinutes: morningPlace.estimatedVisitMinutes,
          curatorMealSuggestion: cluster.morning.mealNote,
          ticketCostInr: getTicketRate(morningPlace),
        },
        {
          place: afternoonPlace,
          slot: 'afternoon',
          timingNote: cluster.afternoon.timing,
          suggestedDurationMinutes: afternoonPlace.estimatedVisitMinutes,
          curatorMealSuggestion: cluster.afternoon.mealNote,
          ticketCostInr: getTicketRate(afternoonPlace),
        },
        {
          place: eveningPlace,
          slot: 'evening',
          timingNote: cluster.evening.timing,
          suggestedDurationMinutes: eveningPlace.estimatedVisitMinutes,
          curatorMealSuggestion: cluster.evening.mealNote,
          ticketCostInr: getTicketRate(eveningPlace),
        },
      ]

      dayPlans.push({
        dayNumber,
        cityId: targetCityId as CityId,
        cityName,
        themeTitle: cluster.themeTitle,
        geographicArea: cluster.geographicArea,
        stops,
        dayNotes: cluster.dayNotes,
      })
    }
  } else {
    // Dynamic city planner fallback for custom admin cities or other destinations
    const cityPlaces = allPlaces.filter((p) => p.cityId.toLowerCase() === targetCityId)
    const pool = cityPlaces.length >= 3 ? cityPlaces : allPlaces
    const cityName = destCity?.name || targetCityId

    for (let i = 0; i < days; i++) {
      const dayNumber = i + 1
      const p1 = pool[(i * 3) % pool.length]
      const p2 = pool[(i * 3 + 1) % pool.length]
      const p3 = pool[(i * 3 + 2) % pool.length]

      allScheduledPlaces.push(p1, p2, p3)

      const stops: ItineraryStop[] = [
        {
          place: p1,
          slot: 'morning',
          timingNote: '8:30 AM – 11:00 AM',
          suggestedDurationMinutes: p1.estimatedVisitMinutes,
          curatorMealSuggestion: `Morning special: Local authentic breakfast near ${p1.name}`,
          ticketCostInr: getTicketRate(p1),
        },
        {
          place: p2,
          slot: 'afternoon',
          timingNote: '12:30 PM – 3:30 PM',
          suggestedDurationMinutes: p2.estimatedVisitMinutes,
          curatorMealSuggestion: `Lunch: Regional authentic flavors recommended by ${persona.name}`,
          ticketCostInr: getTicketRate(p2),
        },
        {
          place: p3,
          slot: 'evening',
          timingNote: '4:30 PM – 7:00 PM',
          suggestedDurationMinutes: p3.estimatedVisitMinutes,
          curatorMealSuggestion: `Evening: Sunset tea and street snacks near ${p3.name}`,
          ticketCostInr: getTicketRate(p3),
        },
      ]

      dayPlans.push({
        dayNumber,
        cityId: targetCityId as CityId,
        cityName,
        themeTitle: `Day ${dayNumber}: Highlights & Hidden Corners with ${persona.name}`,
        geographicArea: p1.address || cityName,
        stops,
        dayNotes: `${persona.name} suggests visiting early to enjoy the best local atmosphere.`,
      })
    }
  }

  const budget = calculateBudget(inputs, allScheduledPlaces)

  return {
    inputs,
    days: dayPlans,
    budget,
    persona,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * HOMI Deterministic Itinerary & Honest Budget Calculation Engine
 * Rule-based, testable, and transparent.
 */

import { PLACES } from '../data/places'
import type { Place } from '../data/types'


export type DestinationChoice = 'delhi' | 'jaipur' | 'both'
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
  cityId: 'delhi' | 'jaipur'
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
  generatedAt: string
}

export const BUDGET_RATES = {
  accommodationPerRoomPerNight: {
    budget: 1200, // Clean guesthouse / backpacker private room
    moderate: 3500, // Charming heritage haveli / boutique hotel
    premium: 9500, // Luxury palace or 5-star heritage property
  },
  foodPerPersonPerDay: {
    budget: 450, // Street food icons, paranthas, kachoris, dhabas
    moderate: 1100, // Cafe Lota, rooftop haveli dinners, thalis
    premium: 2400, // Fine dining, royal multicourse thalis, heritage dining
  },
  transportPerGroupPerDay: {
    budget: 250, // Per person Metro + e-rickshaws
    moderate: 850, // Dedicated city autos and app cabs (Ola/Uber)
    premium: 2200, // Private AC sedan with dedicated chauffeur
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

  // Transport (Calculated realistically based on group size & tier)
  let transportTotal = 0
  let transportDescription = ''
  if (budgetTier === 'budget') {
    transportTotal = travellers * days * BUDGET_RATES.transportPerGroupPerDay.budget
    transportDescription = `Metro Smart Cards + shared battery rickshaws for ${travellers} person(s)`
  } else if (budgetTier === 'moderate') {
    transportTotal = days * BUDGET_RATES.transportPerGroupPerDay.moderate
    transportDescription = `App-cabs (Ola/Uber) & dedicated auto-rickshaws for group`
  } else {
    transportTotal = days * BUDGET_RATES.transportPerGroupPerDay.premium
    transportDescription = `Private dedicated air-conditioned chauffeur-driven sedan for all days`
  }

  // Attraction Tickets (Actual sum of curated monuments)
  let ticketsTotal = 0
  let ticketsVerifiedCount = 0
  itineraryPlaces.forEach((place) => {
    const cost = nationality === 'indian' ? place.ticketPrice.indian : place.ticketPrice.foreigner
    if (typeof cost === 'number') {
      ticketsTotal += cost * travellers
      ticketsVerifiedCount++
    }
  })
  const ticketsDescription = `Official monument entry fees for ${travellers} ${nationality === 'indian' ? 'Indian national(s)' : 'international guest(s)'} across ${itineraryPlaces.length} curated stops`

  // Buffer (10% for water, incidental chai, tips, footwear tokens)
  const subtotal = accommodationTotal + foodTotal + transportTotal + ticketsTotal
  const bufferTotal = Math.round(subtotal * 0.08)
  const bufferDescription = 'Incidental allowance (8%): bottled water, chai stops, temple shoe checks, and small tips'

  const grandTotal = subtotal + bufferTotal
  const perPersonTotal = Math.round(grandTotal / travellers)

  const assumptions = [
    `Accommodation is based on ${roomCount} double-occupancy room(s) for ${travellers} guest(s).`,
    `Food estimates cover 3 daily meals plus afternoon tea and street tasting sessions.`,
    `Ticket prices reflect official Archaeological Survey of India (ASI) and Rajasthan Tourism verified tariffs as of current records.`,
  ]

  const exclusions = [
    'Interstate travel (flights, long-distance trains, or intercity transfers between Delhi and Jaipur).',
    'Personal shopping, textile purchases, jewelry, and high-value souvenirs.',
    'Alcoholic beverages and optional monument camera fees where applicable.',
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

  // Helper to fetch place by slug
  const getPlace = (slug: string): Place => {
    const found = PLACES.find((p) => p.slug === slug)
    if (!found) throw new Error(`Place slug not found: ${slug}`)
    return found
  }

  // Pre-curated, geographically logical clusters for Delhi
  const delhiClusters = [
    {
      themeTitle: 'The Mughal Epicenter: Old Delhi & Shahjahanabad',
      geographicArea: 'Old Delhi / Chandni Chowk Corridor',
      dayNotes:
        'Start early before the midday rush. Wear slip-on shoes for temple and mosque etiquette.',
      morning: {
        slug: 'chandni-chowk-old-delhi',
        timing: '8:30 AM – 10:30 AM',
        mealNote: 'Breakfast: Crispy Paranthas at Paranthe Wali Gali or Jalebi at Dariba corner.',
      },
      afternoon: {
        slug: 'jama-masjid',
        timing: '11:00 AM – 1:00 PM',
        mealNote: 'Lunch: Authentic slow-cooked Biryani or Shahi Tukda at Matia Mahal lane.',
      },
      evening: {
        slug: 'red-fort-lal-qila',
        timing: '3:00 PM – 5:30 PM',
        mealNote: 'Evening Chai: Traditional cardamom chai near Lal Qila metro.',
      },
    },
    {
      themeTitle: 'Mughal Splendor & Heritage Gardens',
      geographicArea: 'Nizamuddin & Lodhi Heritage Belt',
      dayNotes:
        'Walk through the world-class restoration corridor from Humayun’s Tomb into Sunder Nursery.',
      morning: {
        slug: 'humayuns-tomb',
        timing: '7:30 AM – 9:30 AM (Soft morning light)',
        mealNote: 'Morning refreshment: Cold-pressed fresh cane juice near entrance gate.',
      },
      afternoon: {
        slug: 'sunder-nursery',
        timing: '10:00 AM – 1:00 PM',
        mealNote: 'Lunch: Wholesome farm bowls & kokum cooler at FAB Cafe by the lake.',
      },
      evening: {
        slug: 'lodhi-art-district-gardens',
        timing: '3:30 PM – 6:30 PM',
        mealNote: 'Dinner: Contemporary regional Indian small plates at Cafe Lota or Khanna Market.',
      },
    },
    {
      themeTitle: 'Sultanate Heights & Hidden Stepwells',
      geographicArea: 'Mehrauli & Central Delhi',
      dayNotes:
        'Witness architectural transitions from 14th-century stepwells to towering Sultanate minarets.',
      morning: {
        slug: 'agrasen-ki-baoli',
        timing: '9:00 AM – 10:30 AM',
        mealNote: 'Coffee: Filter coffee at Indian Coffee House, Mohan Singh Place.',
      },
      afternoon: {
        slug: 'national-crafts-museum',
        timing: '11:30 AM – 2:30 PM',
        mealNote: 'Lunch: Palak patta chaat and apple jalebi at Cafe Lota inside museum.',
      },
      evening: {
        slug: 'qutub-minar',
        timing: '4:00 PM – 7:30 PM (Stay for night illuminations)',
        mealNote: 'Dinner: Mehrauli village rooftop cafe overlooking Qutub Minar.',
      },
    },
    {
      themeTitle: 'Tibetan Sanctuary & Riverside Calm',
      geographicArea: 'North Delhi / Yamuna Banks',
      dayNotes:
        'Escape modern traffic into pedestrian Buddhist alleyways with prayer wheels and Himalayan cuisine.',
      morning: {
        slug: 'majnu-ka-tilla-little-tibet',
        timing: '10:30 AM – 2:30 PM',
        mealNote: 'Lunch: Spicy Laphing, Thukpa, and blueberry cheesecake at AMA Cafe.',
      },
      afternoon: {
        slug: 'agrasen-ki-baoli',
        timing: '3:30 PM – 5:00 PM',
        mealNote: 'Snack: Wenger’s bakery patties in Connaught Place.',
      },
      evening: {
        slug: 'humayuns-tomb',
        timing: '5:30 PM – 7:00 PM',
        mealNote: 'Dinner: Pandara Road Butter Chicken & Daal Makhani.',
      },
    },
  ]

  // Pre-curated, geographically logical clusters for Jaipur
  const jaipurClusters = [
    {
      themeTitle: 'The Heart of the Pink City',
      geographicArea: 'Walled City (Badi Chaupar & City Palace)',
      dayNotes:
        'The morning sun illuminates the Hawa Mahal facade directly from the east. Arrive early for photos.',
      morning: {
        slug: 'hawa-mahal',
        timing: '8:00 AM – 9:45 AM (Golden sunrise angle)',
        mealNote: 'Morning Chai: Masala chai on Wind View Cafe rooftop opposite Hawa Mahal.',
      },
      afternoon: {
        slug: 'city-palace-jaipur',
        timing: '10:30 AM – 1:30 PM',
        mealNote: 'Lunch: Authentic Rajasthani Dal Baati Churma at Laxmi Mishthan Bhandar (LMB).',
      },
      evening: {
        slug: 'johari-and-bapu-bazaars',
        timing: '3:30 PM – 7:00 PM',
        mealNote: 'Snacks: Pandit Kulfi and crisp pyaaz kachoris.',
      },
    },
    {
      themeTitle: 'Royal Rajput Fortresses & Sunset Heights',
      geographicArea: 'Amer Village & Aravalli Ridges',
      dayNotes:
        'Combine Amer Fort and the Panna Meena Stepwell before heading up to Nahargarh for sunset.',
      morning: {
        slug: 'amer-fort',
        timing: '8:00 AM – 11:30 AM',
        mealNote: 'Snack: Fresh buttermilk & kachoris in historic Amer town.',
      },
      afternoon: {
        slug: 'panna-meena-ka-kund',
        timing: '12:00 PM – 1:30 PM',
        mealNote: 'Lunch: Organic haveli salads and herbal tea at Anokhi Cafe.',
      },
      evening: {
        slug: 'nahargarh-fort',
        timing: '3:30 PM – 6:45 PM (Sunset over the Pink City)',
        mealNote: 'Dinner: Sunset refreshments at Padao terrace overlooking Jaipur valley.',
      },
    },
    {
      themeTitle: 'Craft Heritage, Museums & Artisan Gates',
      geographicArea: 'Amer Crafts & Southern Cultural Belt',
      dayNotes:
        'Witness master block printers at work and marvel at Indo-Saracenic royal museum treasures.',
      morning: {
        slug: 'patrika-gate-jawahar-circle',
        timing: '7:30 AM – 9:00 AM (Quiet photography light)',
        mealNote: 'Breakfast: Steaming Pyaaz Kachori and Mawa Kachori at Rawat Mishthan Bhandar.',
      },
      afternoon: {
        slug: 'anokhi-museum-hand-printing',
        timing: '10:30 AM – 1:00 PM',
        mealNote: 'Lunch: Traditional Gatte ki Sabzi and Bajra Roti at Masala Chowk.',
      },
      evening: {
        slug: 'albert-hall-museum',
        timing: '3:30 PM – 6:30 PM (Stunning illuminated night view)',
        mealNote: 'Dinner: Handi Restaurant for signature Laal Maas or rich Dal Tadka.',
      },
    },
  ]

  // Decide how to distribute days based on destination
  interface ScheduledCluster {
    cityId: 'delhi' | 'jaipur'
    cluster: (typeof delhiClusters)[0]
  }

  const plannedSequence: ScheduledCluster[] = []

  if (destination === 'delhi') {
    for (let i = 0; i < days; i++) {
      const cluster = delhiClusters[i % delhiClusters.length]
      plannedSequence.push({ cityId: 'delhi', cluster })
    }
  } else if (destination === 'jaipur') {
    for (let i = 0; i < days; i++) {
      const cluster = jaipurClusters[i % jaipurClusters.length]
      plannedSequence.push({ cityId: 'jaipur', cluster })
    }
  } else {
    // Both cities
    // e.g. 2 days -> 1 Delhi, 1 Jaipur; 3 days -> 2 Delhi, 1 Jaipur; 4 days -> 2 Delhi, 2 Jaipur; 5 days -> 3 Delhi, 2 Jaipur
    const delhiDays = Math.ceil(days / 2)
    const jaipurDays = days - delhiDays

    for (let i = 0; i < delhiDays; i++) {
      plannedSequence.push({ cityId: 'delhi', cluster: delhiClusters[i % delhiClusters.length] })
    }
    for (let i = 0; i < jaipurDays; i++) {
      plannedSequence.push({ cityId: 'jaipur', cluster: jaipurClusters[i % jaipurClusters.length] })
    }
  }

  // Build the day plans
  plannedSequence.forEach((item, index) => {
    const dayNumber = index + 1
    const cityName = item.cityId === 'delhi' ? 'Delhi' : 'Jaipur'
    const cluster = item.cluster

    const morningPlace = getPlace(cluster.morning.slug)
    const afternoonPlace = getPlace(cluster.afternoon.slug)
    const eveningPlace = getPlace(cluster.evening.slug)

    allScheduledPlaces.push(morningPlace, afternoonPlace, eveningPlace)

    const getTicketRate = (p: Place): number => {
      const fee = nationality === 'indian' ? p.ticketPrice.indian : p.ticketPrice.foreigner
      return typeof fee === 'number' ? fee : 0
    }

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
      cityId: item.cityId,
      cityName,
      themeTitle: cluster.themeTitle,
      geographicArea: cluster.geographicArea,
      stops,
      dayNotes: cluster.dayNotes,
    })
  })

  const budget = calculateBudget(inputs, allScheduledPlaces)

  return {
    inputs,
    days: dayPlans,
    budget,
    generatedAt: new Date().toISOString(),
  }
}

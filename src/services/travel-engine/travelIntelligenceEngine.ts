/**
 * Master Travel Intelligence Engine for Varanasi
 * Synthesizes astronomical timing, weather intelligence, pedestrian gateways,
 * transport pricing, restaurant operating hours, and hotel logistics into an actionable execution itinerary.
 */

import { calculateSolarTiming, type SolarTiming } from './astronomyService'
import { getWeatherForecast, type WeatherConditionSummary } from './weatherService'
import { VARANASI_HOTEL_HUBS, type HotelHub } from './hotelLogisticsService'
import { computeDoorToDoorRoute, type DoorToDoorRoute } from './routingService'
import { calculateLegTransportQuotes, calculateGangaBoatQuote } from './transportPricingService'
import { checkDiningFeasibility, type DiningFeasibilityResult } from './restaurantTimingService'
import { validateRealWorldItinerary, type ValidationReport } from './itineraryValidator'

export interface ItineraryTimeStep {
  id: string
  stepNumber: number
  title: string
  category: 'transit' | 'sightseeing' | 'dining' | 'cultural_ritual' | 'activity_boat' | 'rest'
  startTime: string
  endTime: string
  durationMinutes: number
  locationName: string
  locationCoordinates: [number, number]
  routeDetails?: DoorToDoorRoute
  diningDetails?: DiningFeasibilityResult
  costInr: number
  costPerPersonInr: number
  costAllocationBasis: 'PER_VEHICLE' | 'PER_PASSENGER' | 'FREE'
  costCategory: 'transport' | 'activity_boat' | 'food' | 'tickets' | 'none'
  reliabilityStatus: 'LIVE_DATA' | 'MATHEMATICALLY_VERIFIED' | 'SOURCE_BASED_ESTIMATE' | 'INDICATIVE_ESTIMATE'
  operationalNotes: string
  practicalTips: string[]
}

export interface RealWorldTravelPlan {
  cityId: 'varanasi'
  cityName: string
  travelDate: string
  travelerCount: number
  hotel: HotelHub
  budgetTier: 'budget' | 'moderate' | 'premium'
  solar: SolarTiming
  weather: WeatherConditionSummary
  steps: ItineraryTimeStep[]
  budgetSummary: {
    transportTotal: number
    activitiesTotal: number
    foodTotal: number
    ticketsTotal: number
    accommodationTotal: number
    contingencyTotal: number
    grandTotal: number
    perPersonTotal: number
    travelerCount: number
    currency: 'INR'
  }
  validationReport: ValidationReport
  generationTimestamp: string
}

function parseTimeToMin(timeStr: string): number {
  const parts = timeStr.split(':')
  if (parts.length < 2) return 0
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
}

function formatMinToTime(minutes: number): string {
  let m = minutes % 1440
  if (m < 0) m += 1440
  const h = Math.floor(m / 60)
  const min = Math.floor(m % 60)
  return `${h < 10 ? '0' : ''}${h}:${min < 10 ? '0' : ''}${min}`
}

export async function generateRealWorldVaranasiPlan(params: {
  travelDate: string // YYYY-MM-DD
  hotelId?: string
  travelerCount?: number
  budgetTier?: 'budget' | 'moderate' | 'premium'
  includeHotelCostInTotal?: boolean
}): Promise<RealWorldTravelPlan> {
  const travelDate = params.travelDate || new Date().toISOString().split('T')[0]
  const hotelId = params.hotelId || 'taj_cantonment'
  const travelers = Math.max(1, params.travelerCount || 2)
  const budgetTier = params.budgetTier || 'moderate'
  const includeHotel = params.includeHotelCostInTotal ?? false

  const hotel = VARANASI_HOTEL_HUBS[hotelId] || VARANASI_HOTEL_HUBS.taj_cantonment
  const solar = calculateSolarTiming(travelDate, 25.3176, 82.9739)
  const targetMonth = parseInt(travelDate.split('-')[1], 10) || 10
  const weather = await getWeatherForecast(travelDate, 6, 25.3176, 82.9739)

  const steps: ItineraryTimeStep[] = []
  let stepCounter = 1

  // ===========================================================================
  // STEP 1: Hotel Departure -> Assi Ghat Dawn Boat Jetty
  // Target arrival: 25 minutes before astronomical sunrise (at Civil Dawn)
  // ===========================================================================
  const sunriseMin = parseTimeToMin(solar.sunrise)
  const targetArrivalAtAssiMin = sunriseMin - 25

  const routeToAssi = computeDoorToDoorRoute(
    hotel.name,
    hotel.latitude,
    hotel.longitude,
    'varanasi-subah-e-banaras-boat',
    'Assi Ghat Boat Jetty',
    25.2885,
    83.0065,
    hotel.category === 'budget_homestay' ? 'walk' : 'drive_cab',
    5 // early morning 5:00 AM hour
  )

  const hotelDepartureMin = targetArrivalAtAssiMin - routeToAssi.totalDurationMinutes
  const depTimeStr = formatMinToTime(hotelDepartureMin)
  const arrAssiTimeStr = formatMinToTime(targetArrivalAtAssiMin)

  const quotesAssi = calculateLegTransportQuotes(
    routeToAssi.totalDistanceKm,
    travelers,
    5,
    hotel.name,
    'Assi Ghat'
  )

  const step1Cost = routeToAssi.primaryMode === 'walk' ? 0 : quotesAssi.recommendedOption.estimatedFareInr
  const step1PerPerson = routeToAssi.primaryMode === 'walk' ? 0 : Math.round(step1Cost / travelers)

  steps.push({
    id: 'step-hotel-to-assi',
    stepNumber: stepCounter++,
    title: `Hotel Departure to Assi Ghat (${routeToAssi.primaryMode === 'walk' ? 'Morning Walk' : 'Cab Transfer'})`,
    category: 'transit',
    startTime: depTimeStr,
    endTime: arrAssiTimeStr,
    durationMinutes: routeToAssi.totalDurationMinutes,
    locationName: 'Assi Ghat Jetty',
    locationCoordinates: [25.2885, 83.0065],
    routeDetails: routeToAssi,
    costInr: step1Cost,
    costPerPersonInr: step1PerPerson,
    costAllocationBasis: routeToAssi.primaryMode === 'walk' ? 'FREE' : 'PER_VEHICLE',
    costCategory: 'transport',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: `Depart ${hotel.name} at ${depTimeStr} sharp. Arriving at Assi Ghat during Civil Dawn (${solar.civilDawn}) allows 25 minutes to board your boat comfortably before the sun breaches the horizon at ${solar.sunrise}.`,
    practicalTips: [
      routeToAssi.trafficNote,
      `Weather outlook: ${weather.conditionLabel}, ${weather.temperatureC}°C, sunrise visibility rated ${weather.sunriseVisibility}.`,
    ],
  })

  // ===========================================================================
  // STEP 2: Subah-e-Banaras Dawn Wooden Boat Cruise (Assi to Manikarnika & Return)
  // 90 minutes on the Ganga
  // ===========================================================================
  const boatStartMin = targetArrivalAtAssiMin + 5 // 5 mins to step into boat
  const boatEndMin = boatStartMin + 90
  const boatQuote = calculateGangaBoatQuote(travelers, budgetTier === 'premium')

  steps.push({
    id: 'step-boat-cruise',
    stepNumber: stepCounter++,
    title: 'Subah-e-Banaras Morning Hand-Rowed Boat Cruise',
    category: 'activity_boat',
    startTime: formatMinToTime(boatStartMin),
    endTime: formatMinToTime(boatEndMin),
    durationMinutes: 90,
    locationName: 'River Ganga Crescent (Assi to Manikarnika)',
    locationCoordinates: [25.2980, 83.0100],
    costInr: boatQuote.estimatedFareInr,
    costPerPersonInr: boatQuote.perPersonShareInr,
    costAllocationBasis: boatQuote.pricingBasis,
    costCategory: 'activity_boat',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: `Glides past Harishchandra, Kedar, and Dashashwamedh Ghats as the morning sun paints the stone palaces at ${solar.sunrise}. Oars slice the tranquil waters with morning Shehnai ragas floating across from Assi amphitheater.`,
    practicalTips: [
      'Choose a hand-rowed wooden bajra boat over a noisy diesel motorboat to experience authentic stillness.',
      'Strict etiquette: Photography of cremation pyres at Manikarnika Ghat is prohibited out of reverence.',
    ],
  })

  // ===========================================================================
  // STEP 3: Authentic Morning Breakfast at Assi Ghat / Thatheri Bazaar
  // Pizzeria Vaatika Cafe (opens 8:30 AM) or Ram Bhandar (opens 7:00 AM)
  // ===========================================================================
  const breakfastArrivalMin = boatEndMin + 10 // 10 mins walk from jetty
  const breakfastDepartureMin = breakfastArrivalMin + 45
  const breakfastArrStr = formatMinToTime(breakfastArrivalMin)

  // Operating Hours Logic:
  // If breakfast is before 08:30 AM, schedule Ram Bhandar in Thatheri Bazaar (opens 7:00 AM).
  // If breakfast is 08:30 AM or later, schedule Pizzeria Vaatika Cafe (opens 8:30 AM).
  const chosenBreakfastId = breakfastArrivalMin < 8 * 60 + 30 ? 'ram_bhandar' : 'vaatika_cafe'
  const diningFeasibility = checkDiningFeasibility(chosenBreakfastId, breakfastArrStr, targetMonth, 45)
  const isRamBhandar = chosenBreakfastId === 'ram_bhandar'
  const breakfastCostPerPerson = isRamBhandar ? 70 : 250
  const breakfastTotalCost = breakfastCostPerPerson * travelers

  steps.push({
    id: 'step-breakfast',
    stepNumber: stepCounter++,
    title: isRamBhandar
      ? 'Morning Breakfast at Ram Bhandar (Kachori-Sabzi & Jalebi)'
      : 'Riverfront Breakfast at Pizzeria Vaatika Cafe',
    category: 'dining',
    startTime: breakfastArrStr,
    endTime: formatMinToTime(breakfastDepartureMin),
    durationMinutes: 45,
    locationName: isRamBhandar
      ? 'Ram Bhandar (Thatheri Bazaar, Chowk)'
      : 'Pizzeria Vaatika Cafe (Assi Ghat)',
    locationCoordinates: isRamBhandar ? [25.3125, 83.0118] : [25.2890, 83.0062],
    diningDetails: diningFeasibility,
    costInr: breakfastTotalCost,
    costPerPersonInr: breakfastCostPerPerson,
    costAllocationBasis: 'PER_PASSENGER',
    costCategory: 'food',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: isRamBhandar
      ? `Step off the morning boat and enjoy Kashi's sacred dawn breakfast. ${diningFeasibility.explanation}`
      : `Sit on the open-air riverfront garden patio overlooking Assi Ghat steps. ${diningFeasibility.explanation}`,
    practicalTips: isRamBhandar
      ? [
          'Order: Crispy urad dal kachoris crushed over fiery hing potato curry and piping hot golden jalebis.',
          'Eat standing alongside Banaras locals at this historic 200-year-old morning confectionery.',
        ]
      : [
          'Order: Freshly baked warm apple pie with vanilla ice cream and hot adrak (ginger) honey lemon tea.',
          'Clean washrooms available for travelers after the boat cruise.',
        ],
  })

  // ===========================================================================
  // STEP 4: Kashi Vishwanath Golden Temple & Corridor Darshan
  // Transfer to Godowlia & walk through restored sandstone promenade
  // ===========================================================================
  const templeTransferStartMin = breakfastDepartureMin + 5
  const templeTransferEndMin = templeTransferStartMin + 20 // 20 mins auto/e-rickshaw to Godowlia + 5 min walk
  const templeDarshanEndMin = templeTransferEndMin + 75 // 75 mins inside corridor

  const autoQuoteGodowlia = calculateLegTransportQuotes(3.2, travelers, 9, 'Assi Ghat', 'Godowlia Chowk')
  const autoFareGodowlia = autoQuoteGodowlia.recommendedOption.estimatedFareInr
  const autoPerPerson = autoQuoteGodowlia.recommendedOption.perPersonShareInr

  steps.push({
    id: 'step-transfer-to-temple',
    stepNumber: stepCounter++,
    title: 'E-Rickshaw Transfer to Godowlia Chowk & Walk to Corridor',
    category: 'transit',
    startTime: formatMinToTime(templeTransferStartMin),
    endTime: formatMinToTime(templeTransferEndMin),
    durationMinutes: 20,
    locationName: 'Godowlia Crossing to Kashi Vishwanath Gate 4',
    locationCoordinates: [25.3090, 83.0068],
    costInr: autoFareGodowlia,
    costPerPersonInr: autoPerPerson,
    costAllocationBasis: 'PER_VEHICLE',
    costCategory: 'transport',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: 'Take a short battery e-rickshaw up the riverfront road to Godowlia Chowk, then walk 350 meters down the pedestrian corridor to Gate 4.',
    practicalTips: [
      'Electric rickshaws are whisper-quiet and drop passengers right at the police barricades.',
    ],
  })

  steps.push({
    id: 'step-kashi-vishwanath-darshan',
    stepNumber: stepCounter++,
    title: 'Kashi Vishwanath Jyotirlinga & Grand Riverfront Corridor',
    category: 'sightseeing',
    startTime: formatMinToTime(templeTransferEndMin),
    endTime: formatMinToTime(templeDarshanEndMin),
    durationMinutes: 75,
    locationName: 'Shri Kashi Vishwanath Temple Complex',
    locationCoordinates: [25.3109, 83.0107],
    costInr: 0, // Free general darshan
    costPerPersonInr: 0,
    costAllocationBasis: 'FREE',
    costCategory: 'tickets',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: 'Worship at the 1780 golden-spire Jyotirlinga rebuilt by Maharani Ahilyabai Holkar. Explore the newly restored 5 lakh sq ft sandstone corridor opening directly to Lalita Ghat.',
    practicalTips: [
      'Mandatory rule: Mobile phones, smart watches, cameras, and leather belts/wallets are strictly prohibited. Free secure biometric locker available at Gate 4 entrance.',
      'Carry government photo ID (Aadhaar or Passport) for security checkpoints.',
    ],
  })

  // ===========================================================================
  // STEP 5: Old City Lanes, Blue Lassi & Handloom Silk Weavers
  // 11:30 AM – 1:00 PM
  // ===========================================================================
  const silkWalkStartMin = templeDarshanEndMin + 10
  const silkWalkEndMin = silkWalkStartMin + 70
  const lassiCostTotal = 90 * travelers

  steps.push({
    id: 'step-old-city-silk-and-lassi',
    stepNumber: stepCounter++,
    title: 'Old Banaras Galis, Silk Handlooms & Blue Lassi Treat',
    category: 'cultural_ritual',
    startTime: formatMinToTime(silkWalkStartMin),
    endTime: formatMinToTime(silkWalkEndMin),
    durationMinutes: 70,
    locationName: 'Kachori Gali to Bangali Tola',
    locationCoordinates: [25.3102, 83.0125],
    costInr: lassiCostTotal,
    costPerPersonInr: 90,
    costAllocationBasis: 'PER_PASSENGER',
    costCategory: 'food',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: 'Navigate the cool, shaded stone alleys of Bangali Tola. Watch generational Muslim artisans handcraft pure silk Banarasi sarees on traditional wooden pit looms, then enjoy hand-churned lassi in earthen cups.',
    practicalTips: [
      'Look for the official Silk Mark / GI (Geographical Indication) tag if purchasing authentic Banarasi silk.',
      'Order the signature Pomegranate-Rabri Lassi at Blue Lassi Shop.',
    ],
  })

  // ===========================================================================
  // STEP 6: Afternoon Rest / Hotel Rejuvenation Break
  // Avoid midday peak sun and recharge before the evening Aarti
  // ===========================================================================
  const restStartMin = silkWalkEndMin + 20
  const restEndMin = 16 * 60 + 30 // Rest until 4:30 PM

  const quotesBackToHotel = calculateLegTransportQuotes(routeToAssi.totalDistanceKm, travelers, 13, 'Godowlia', hotel.name)
  const returnFare = routeToAssi.primaryMode === 'walk' ? 0 : quotesBackToHotel.recommendedOption.estimatedFareInr
  const returnPerPerson = routeToAssi.primaryMode === 'walk' ? 0 : Math.round(returnFare / travelers)

  steps.push({
    id: 'step-afternoon-rest',
    stepNumber: stepCounter++,
    title: 'Afternoon Rest, Lunch & Rejuvenation at Hotel',
    category: 'rest',
    startTime: formatMinToTime(restStartMin),
    endTime: formatMinToTime(restEndMin),
    durationMinutes: restEndMin - restStartMin,
    locationName: hotel.name,
    locationCoordinates: [hotel.latitude, hotel.longitude],
    costInr: returnFare,
    costPerPersonInr: returnPerPerson,
    costAllocationBasis: routeToAssi.primaryMode === 'walk' ? 'FREE' : 'PER_VEHICLE',
    costCategory: 'transport',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: `Return to ${hotel.name} to avoid the intense midday sun and crowd peaks. Relax, review morning photographs, and recharge before the evening ceremony.`,
    practicalTips: [
      'Varanasi is best experienced in two distinct pulses: sacred dawn and cosmic dusk.',
    ],
  })

  // ===========================================================================
  // STEP 7: Evening Grand Ganga Aarti at Dashashwamedh Ghat
  // Time set precisely by Civil Dusk (when camphor lamps are ignited)
  // ===========================================================================
  const duskMin = parseTimeToMin(solar.civilDusk)
  // Arrive 45 mins before dusk to secure seats on ghat steps or boat
  const aartiArrivalMin = duskMin - 40
  const aartiEndMin = duskMin + 45

  const transferToAartiStartMin = aartiArrivalMin - routeToAssi.totalDurationMinutes
  const aartiTransferQuotes = calculateLegTransportQuotes(routeToAssi.totalDistanceKm, travelers, 17, hotel.name, 'Godowlia Chowk')
  const aartiCabFare = routeToAssi.primaryMode === 'walk' ? 0 : aartiTransferQuotes.recommendedOption.estimatedFareInr
  const aartiCabPerPerson = routeToAssi.primaryMode === 'walk' ? 0 : Math.round(aartiCabFare / travelers)

  steps.push({
    id: 'step-transfer-to-aarti',
    stepNumber: stepCounter++,
    title: 'Evening Transfer to Dashashwamedh Ghat for Ganga Aarti',
    category: 'transit',
    startTime: formatMinToTime(transferToAartiStartMin),
    endTime: formatMinToTime(aartiArrivalMin),
    durationMinutes: routeToAssi.totalDurationMinutes,
    locationName: 'Godowlia to Dashashwamedh Ghat Steps',
    locationCoordinates: [25.3075, 83.0104],
    costInr: aartiCabFare,
    costPerPersonInr: aartiCabPerPerson,
    costAllocationBasis: routeToAssi.primaryMode === 'walk' ? 'FREE' : 'PER_VEHICLE',
    costCategory: 'transport',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: `Depart ${hotel.name} by ${formatMinToTime(transferToAartiStartMin)}. Arriving at 17:10 hrs ensures front-row step seating or boarding an anchored riverboat before the 18:00 hrs Maha Aarti.`,
    practicalTips: [
      'Buy small flower diyas (₹20) made of dry leaves and marigolds from local children to release onto the river.',
      'Optional boat seating directly in front of the seven priests costs ₹150–₹200 per seat.',
    ],
  })

  steps.push({
    id: 'step-ganga-aarti-ceremony',
    stepNumber: stepCounter++,
    title: 'Cosmic Grand Ganga Aarti Ceremony',
    category: 'cultural_ritual',
    startTime: formatMinToTime(aartiArrivalMin),
    endTime: formatMinToTime(aartiEndMin),
    durationMinutes: aartiEndMin - aartiArrivalMin,
    locationName: 'Dashashwamedh Ghat Riverfront Platforms',
    locationCoordinates: [25.3075, 83.0104],
    costInr: 20 * travelers, // Flower diyas
    costPerPersonInr: 20,
    costAllocationBasis: 'PER_PASSENGER',
    costCategory: 'activity_boat',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: `Witness seven Vedic priests in saffron silk lift massive multi-tier brass lamps in rhythmic synchronization. Swirling incense smoke, blowing conch shells, and thousands of floating lights illuminate the night river.`,
    practicalTips: [
      'Free public spiritual ceremony. No entry ticket required.',
      'Keep your shoes in your backpack rather than leaving them unattended on the steps.',
    ],
  })

  // ===========================================================================
  // STEP 8: Street Food Dinner at Kashi Chaat Bhandar & Banarasi Paan
  // ===========================================================================
  const dinnerStartMin = aartiEndMin + 15
  const dinnerEndMin = dinnerStartMin + 45
  const dinnerFeasibility = checkDiningFeasibility('kashi_chaat_bhandar', formatMinToTime(dinnerStartMin), targetMonth, 45)

  const dinnerCostPerPerson = 120 // Tamatar Chaat + Dahi Golgappa + Keshav Meetha Paan
  const dinnerTotalCost = dinnerCostPerPerson * travelers

  steps.push({
    id: 'step-dinner-street-food',
    stepNumber: stepCounter++,
    title: 'Dinner at Kashi Chaat Bhandar & Legendary Banarasi Meetha Paan',
    category: 'dining',
    startTime: formatMinToTime(dinnerStartMin),
    endTime: formatMinToTime(dinnerEndMin),
    durationMinutes: 45,
    locationName: 'Godowlia Crossing Food Lane',
    locationCoordinates: [25.3088, 83.0072],
    diningDetails: dinnerFeasibility,
    costInr: dinnerTotalCost,
    costPerPersonInr: dinnerCostPerPerson,
    costAllocationBasis: 'PER_PASSENGER',
    costCategory: 'food',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: `Walk 300 meters from the ghat steps to Godowlia Crossing. ${dinnerFeasibility.explanation}`,
    practicalTips: [
      'Must-order: Fiery Desi Ghee Tamatar Chaat served bubbling hot in a clay shikora.',
      'Finish your culinary evening with a silver-foiled Meetha Paan at Keshav Tambool Bhandar.',
    ],
  })

  // ===========================================================================
  // STEP 9: Night Return to Hotel
  // ===========================================================================
  const nightReturnStartMin = dinnerEndMin + 5
  const nightReturnEndMin = nightReturnStartMin + routeToAssi.totalDurationMinutes

  const nightQuotes = calculateLegTransportQuotes(routeToAssi.totalDistanceKm, travelers, 20, 'Godowlia', hotel.name)
  const nightReturnFare = routeToAssi.primaryMode === 'walk' ? 0 : nightQuotes.recommendedOption.estimatedFareInr
  const nightReturnPerPerson = routeToAssi.primaryMode === 'walk' ? 0 : Math.round(nightReturnFare / travelers)

  steps.push({
    id: 'step-night-return-hotel',
    stepNumber: stepCounter++,
    title: `Night Return to ${hotel.name}`,
    category: 'transit',
    startTime: formatMinToTime(nightReturnStartMin),
    endTime: formatMinToTime(nightReturnEndMin),
    durationMinutes: routeToAssi.totalDurationMinutes,
    locationName: hotel.name,
    locationCoordinates: [hotel.latitude, hotel.longitude],
    costInr: nightReturnFare,
    costPerPersonInr: nightReturnPerPerson,
    costAllocationBasis: routeToAssi.primaryMode === 'walk' ? 'FREE' : 'PER_VEHICLE',
    costCategory: 'transport',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    operationalNotes: `Board pre-arranged cab or hailing auto at Godowlia taxi queue. Return to ${hotel.name} for a restful night.`,
    practicalTips: [
      'Confirm the driver knows your hotel gate entrance to avoid drop-off confusion on outer boulevards.',
    ],
  })

  // ===========================================================================
  // BUDGET RECONCILIATION & TOTALS
  // ===========================================================================
  let transportTotal = 0
  let activitiesTotal = 0
  let foodTotal = 0
  let ticketsTotal = 0

  for (const s of steps) {
    if (s.costCategory === 'transport') transportTotal += s.costInr
    if (s.costCategory === 'activity_boat') activitiesTotal += s.costInr
    if (s.costCategory === 'food') foodTotal += s.costInr
    if (s.costCategory === 'tickets') ticketsTotal += s.costInr
  }

  // Room cost: Math.ceil(travelers / 2) double rooms
  const roomCount = Math.ceil(travelers / 2)
  const roomRateMedian = Math.round((hotel.indicativeNightlyRateInr[0] + hotel.indicativeNightlyRateInr[1]) / 2)
  const accommodationTotal = includeHotel ? roomCount * roomRateMedian : 0

  // 10% contingency buffer for miscellaneous offerings, tea, tips
  const subtotal = transportTotal + activitiesTotal + foodTotal + ticketsTotal + accommodationTotal
  const contingencyTotal = Math.round(subtotal * 0.1)
  const grandTotal = subtotal + contingencyTotal
  const perPersonTotal = Math.round(grandTotal / travelers)

  const budgetSummary = {
    transportTotal,
    activitiesTotal,
    foodTotal,
    ticketsTotal,
    accommodationTotal,
    contingencyTotal,
    grandTotal,
    perPersonTotal,
    travelerCount: travelers,
    currency: 'INR' as const,
  }

  // Validate plan with Itinerary Validator
  const validationInput = steps.map((s) => ({
    id: s.id,
    title: s.title,
    startTime: s.startTime,
    endTime: s.endTime,
    venueOpensAtMinute: s.diningDetails?.restaurant.opensAtMinute,
    venueClosesAtMinute: s.diningDetails?.restaurant.closesAtMinute,
    isMealStop: s.category === 'dining',
  }))

  const validationReport = validateRealWorldItinerary(validationInput, budgetSummary)

  return {
    cityId: 'varanasi',
    cityName: 'Varanasi',
    travelDate,
    travelerCount: travelers,
    hotel,
    budgetTier,
    solar,
    weather,
    steps,
    budgetSummary,
    validationReport,
    generationTimestamp: new Date().toISOString(),
  }
}

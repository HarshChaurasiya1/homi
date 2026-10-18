/**
 * Hotel Logistics & Accommodation Impact Analysis Service
 * Evaluates the real-world operational impact of hotel location on itinerary execution.
 * Compares morning departure alarms, travel durations, cab expenses, and walking requirements.
 */

import { computeDoorToDoorRoute } from './routingService'
import { calculateLegTransportQuotes } from './transportPricingService'

export interface HotelHub {
  id: string
  name: string
  category: 'luxury_cantonment' | 'heritage_riverfront' | 'boutique_haveli' | 'budget_homestay' | 'airport_transit'
  neighborhood: string
  address: string
  latitude: number
  longitude: number
  indicativeNightlyRateInr: [number, number]
  luggageAccessibility: 'DIRECT_PORCH' | 'BOAT_ACCESS_ONLY' | 'PEDESTRIAN_ALLEY_WALK'
  logisticsSummary: string
  recommendationVerdict: string
}

export interface HotelSunriseImpactComparison {
  hotel: HotelHub
  targetDate: string
  sunriseTime: string
  recommendedArrivalTime: string
  requiredDepartureTime: string
  drivingMinutes: number
  walkingMinutes: number
  totalEnRouteMinutes: number
  estimatedCabFareInr: number
  perPersonCabShareInr: number
  requiresCab: boolean
  wakeUpAlarmRecommendation: string
  practicalProsAndCons: string[]
}

export const VARANASI_HOTEL_HUBS: Record<string, HotelHub> = {
  taj_cantonment: {
    id: 'taj_cantonment',
    name: 'Taj Ganges / Radisson (Cantonment Green Hub)',
    category: 'luxury_cantonment',
    neighborhood: 'Varanasi Cantonment',
    address: 'Nadesar Palace Grounds, Varanasi 221002',
    latitude: 25.3345,
    longitude: 82.9815,
    indicativeNightlyRateInr: [9000, 16000],
    luggageAccessibility: 'DIRECT_PORCH',
    logisticsSummary: 'Spacious landscaped campus outside the congestion; direct vehicle access to airport highway.',
    recommendationVerdict: 'Ideal for luxury comfort, business travelers, and families who prefer tranquil nights away from old-city noise.',
  },
  assi_ghat_homestay: {
    id: 'assi_ghat_homestay',
    name: 'Assi Ghat Riverfront Homestay / Guesthouse',
    category: 'budget_homestay',
    neighborhood: 'Assi Ghat',
    address: 'Near Assi Ghat Square, Varanasi 221005',
    latitude: 25.2895,
    longitude: 83.0045,
    indicativeNightlyRateInr: [2200, 4200],
    luggageAccessibility: 'PEDESTRIAN_ALLEY_WALK',
    logisticsSummary: 'Steps away from the dawn boat jetty; zero cab travel needed for sunrise activities.',
    recommendationVerdict: 'Best for sunrise enthusiasts, photographers, and travelers who want to wake up and immediately step onto the ghats.',
  },
  suryauday_haveli: {
    id: 'suryauday_haveli',
    name: 'Amritara Suryauday Haveli (Shivala Ghat)',
    category: 'boutique_haveli',
    neighborhood: 'Shivala Ghat',
    address: 'B 4/256, Shivala Ghat, Varanasi 221001',
    latitude: 25.2950,
    longitude: 83.0068,
    indicativeNightlyRateInr: [7500, 13000],
    luggageAccessibility: 'PEDESTRIAN_ALLEY_WALK',
    logisticsSummary: 'Heritage riverfront haveli with direct views; 300m walk from Shivala vehicle barrier.',
    recommendationVerdict: 'Exceptional balance of authentic haveli character, morning river breezes, and manageable walking distance.',
  },
  brijrama_palace: {
    id: 'brijrama_palace',
    name: 'BrijRama Palace (Darbhanga Ghat)',
    category: 'heritage_riverfront',
    neighborhood: 'Darbhanga Ghat',
    address: 'Munshi Ghat, Darbhanga Ghat, Varanasi 221001',
    latitude: 25.3055,
    longitude: 83.0102,
    indicativeNightlyRateInr: [18000, 32000],
    luggageAccessibility: 'BOAT_ACCESS_ONLY',
    logisticsSummary: '1812 royal sandstone palace; guest luggage and arrivals handled by hotel private boat.',
    recommendationVerdict: 'Unparalleled historical grandeur right on the river, but requires boat transfers for all arrivals and departures.',
  },
  airport_highway_hotel: {
    id: 'airport_highway_hotel',
    name: 'Airport Transit Hotel (Babatpur Highway)',
    category: 'airport_transit',
    neighborhood: 'Babatpur Airport Corridor',
    address: 'Varanasi-Jaunpur Road, Babatpur 221006',
    latitude: 25.4485,
    longitude: 82.8580,
    indicativeNightlyRateInr: [3500, 6000],
    luggageAccessibility: 'DIRECT_PORCH',
    logisticsSummary: 'Near airport terminal; 26+ km away from ancient stone ghats.',
    recommendationVerdict: 'Convenient only for late night flight arrivals; unpractical for early morning sunrise activities.',
  },
}

/**
 * Compares the exact operational impact of choosing Hotel A vs Hotel B for a sunrise boat experience.
 */
export function compareHotelSunriseLogistics(
  hotelId: string,
  targetDate: string,
  sunriseTimeStr: string,
  travelerCount: number = 2,
  destVenue = {
    id: 'varanasi-subah-e-banaras-boat',
    name: 'Assi Ghat Boat Jetty',
    lat: 25.2885,
    lng: 83.0065,
  }
): HotelSunriseImpactComparison {
  const hotel = VARANASI_HOTEL_HUBS[hotelId] || VARANASI_HOTEL_HUBS.taj_cantonment

  // Compute door-to-door route
  const route = computeDoorToDoorRoute(
    hotel.name,
    hotel.latitude,
    hotel.longitude,
    destVenue.id,
    destVenue.name,
    destVenue.lat,
    destVenue.lng,
    'drive_cab',
    5 // 5:00 AM departure hour
  )

  const drivingMinutes = route.vehicleLeg ? route.vehicleLeg.durationMinutes : 0
  const walkingMinutes = route.walkingLeg ? route.walkingLeg.durationMinutes : route.totalDurationMinutes
  const totalEnRoute = drivingMinutes + walkingMinutes

  // Calculate required departure time:
  // Target arrival is 25 minutes before sunrise at Assi Ghat
  const sunriseParts = sunriseTimeStr.split(':')
  const sunriseMin = parseInt(sunriseParts[0], 10) * 60 + parseInt(sunriseParts[1], 10)
  const targetArrivalMin = sunriseMin - 25
  const departureMin = targetArrivalMin - totalEnRoute

  const depH = Math.floor(departureMin / 60)
  const depM = departureMin % 60
  const depTimeStr = `${depH < 10 ? '0' : ''}${depH}:${depM < 10 ? '0' : ''}${depM}`

  const arrH = Math.floor(targetArrivalMin / 60)
  const arrM = targetArrivalMin % 60
  const arrTimeStr = `${arrH < 10 ? '0' : ''}${arrH}:${arrM < 10 ? '0' : ''}${arrM}`

  // Calculate cab fare if vehicle required
  const quotes = calculateLegTransportQuotes(route.totalDistanceKm, travelerCount, 5, hotel.name, destVenue.name)
  const cabQuote = quotes.allOptions.find((o) => o.modeId === 'cab_hatchback')
  const estimatedCabFare = drivingMinutes > 0 && cabQuote ? cabQuote.estimatedFareInr : 0
  const perPersonCab = travelerCount > 0 ? Math.round(estimatedCabFare / travelerCount) : 0

  // Practical pros & cons
  const prosCons: string[] = []
  if (drivingMinutes === 0) {
    prosCons.push(`Zero cab cost: Steps away on foot (${walkingMinutes} mins walk).`)
    prosCons.push(`More sleep: Depart at ${depTimeStr} instead of before 5:00 AM.`)
  } else {
    prosCons.push(`Requires cab ride: ~${drivingMinutes} mins drive under early morning traffic.`)
    prosCons.push(`Estimated round-trip cab expense: ~₹${estimatedCabFare * 2} for group.`)
    prosCons.push(`Earlier alarm: Must leave hotel by ${depTimeStr} sharp.`)
  }

  if (hotel.luggageAccessibility === 'BOAT_ACCESS_ONLY') {
    prosCons.push('Note: Requires pre-arranged boat transfers with hotel desk for luggage arrival.')
  } else if (hotel.luggageAccessibility === 'PEDESTRIAN_ALLEY_WALK') {
    prosCons.push('Note: Last 100–300 meters is pedestrian alleyway; porter assistance recommended for heavy suitcases.')
  }

  return {
    hotel,
    targetDate,
    sunriseTime: sunriseTimeStr,
    recommendedArrivalTime: arrTimeStr,
    requiredDepartureTime: depTimeStr,
    drivingMinutes,
    walkingMinutes,
    totalEnRouteMinutes: totalEnRoute,
    estimatedCabFareInr: estimatedCabFare,
    perPersonCabShareInr: perPersonCab,
    requiresCab: drivingMinutes > 0,
    wakeUpAlarmRecommendation: `Set alarm for ${depH < 10 ? '0' : ''}${Math.max(3, depH - 1)}:${depM < 10 ? '0' : ''}${depM} AM (allows 45 mins to get ready).`,
    practicalProsAndCons: prosCons,
  }
}

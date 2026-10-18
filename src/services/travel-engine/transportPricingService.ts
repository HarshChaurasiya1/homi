/**
 * Transport Pricing and Local Fare Estimation Engine
 * Calculates source-based transport tariffs for Varanasi (Cabs, Autos, E-Rickshaws, Boats, Walking).
 * Supports group allocation, transparent tariff breakdowns, and explicit reliability statuses.
 */

export type PricingStatus =
  | 'LIVE_PROVIDER_QUOTE'
  | 'SOURCE_BASED_ESTIMATE'
  | 'INDICATIVE_ESTIMATE'
  | 'UNAVAILABLE'

export interface TransportOptionQuote {
  modeId: 'cab_hatchback' | 'cab_sedan' | 'auto_rickshaw' | 'e_rickshaw_shared' | 'wooden_boat_shared' | 'wooden_boat_private' | 'walking'
  modeLabel: string
  vehicleType: 'Hatchback Cab' | 'Sedan Cab' | 'Auto-Rickshaw' | 'Shared E-Rickshaw' | 'Shared Wooden Boat' | 'Private Wooden Boat' | 'Walking'
  estimatedFareInr: number
  fareRangeInr: [number, number]
  perPersonShareInr: number
  pricingBasis: 'PER_VEHICLE' | 'PER_PASSENGER'
  reliabilityStatus: PricingStatus
  tariffFormula: string
  excludedExtrasNotes: string
  availabilityNote: string
}

export interface LegTransportComparison {
  distanceKm: number
  travelerCount: number
  departureHour: number
  pickupName: string
  dropoffName: string
  recommendedOption: TransportOptionQuote
  allOptions: TransportOptionQuote[]
  quoteTimestamp: string
}

/**
 * Calculates comparative transport options for a specific leg distance and group size.
 */
export function calculateLegTransportQuotes(
  distanceKm: number,
  travelerCount: number = 1,
  departureHour: number = 6,
  pickupName: string = 'Hotel',
  dropoffName: string = 'Destination'
): LegTransportComparison {
  const safeDistKm = Math.max(0.5, distanceKm)
  const safeTravelers = Math.max(1, travelerCount)
  const isDawnPeak = departureHour >= 5 && departureHour <= 7
  const isEveningPeak = departureHour >= 18 && departureHour <= 21

  const options: TransportOptionQuote[] = []

  // 1. Walking (Always ₹0)
  if (safeDistKm <= 2.5) {
    options.push({
      modeId: 'walking',
      modeLabel: 'Walking on Foot',
      vehicleType: 'Walking',
      estimatedFareInr: 0,
      fareRangeInr: [0, 0],
      perPersonShareInr: 0,
      pricingBasis: 'PER_PASSENGER',
      reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
      tariffFormula: 'Zero monetary cost. Healthy & scenic through local galis.',
      excludedExtrasNotes: 'None.',
      availabilityNote: 'Best for narrow old-city pedestrian lanes and distances under 1.5 km.',
    })
  }

  // 2. Auto-Rickshaw (UP RTA Official Metered Tariff Model)
  // Base fare: ₹25 for first 1.5 km, ₹10/km thereafter. +25% night/dawn buffer (10 PM - 6 AM).
  const autoNightFactor = isDawnPeak ? 1.25 : 1.0
  const autoBaseDist = 1.5
  const autoExtraDist = Math.max(0, safeDistKm - autoBaseDist)
  const rawAutoFare = (25 + autoExtraDist * 10.5) * autoNightFactor
  const autoRoundedFare = Math.round(Math.max(40, rawAutoFare) / 10) * 10
  const autoMinFare = Math.max(30, autoRoundedFare - 15)
  const autoMaxFare = autoRoundedFare + 25

  // 1 auto holds up to 3 adult passengers. If travelers > 3, multiple autos needed.
  const autosNeeded = Math.ceil(safeTravelers / 3)
  const totalAutoFare = autoRoundedFare * autosNeeded
  const perPersonAuto = Math.round(totalAutoFare / safeTravelers)

  options.push({
    modeId: 'auto_rickshaw',
    modeLabel: autosNeeded > 1 ? `Auto-Rickshaw (${autosNeeded} Autos)` : 'Auto-Rickshaw (Metered / Negotiated)',
    vehicleType: 'Auto-Rickshaw',
    estimatedFareInr: totalAutoFare,
    fareRangeInr: [autoMinFare * autosNeeded, autoMaxFare * autosNeeded],
    perPersonShareInr: perPersonAuto,
    pricingBasis: 'PER_VEHICLE',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    tariffFormula: `UP RTA Tariff: Base ₹25 (1.5 km) + ₹10.50/km${isDawnPeak ? ' + 25% early morning buffer' : ''}.`,
    excludedExtrasNotes: 'Luggage charges (₹10/heavy bag) and waiting time not included.',
    availabilityNote: 'Ubiquitous at street corners, Godowlia, Assi, and railway stations.',
  })

  // 3. Shared E-Rickshaw (Short arterial hops)
  if (safeDistKm <= 6.0) {
    // E-rickshaws charge flat ₹10–₹20 per person per 2–3 km sector
    const sectors = Math.ceil(safeDistKm / 2.5)
    const perPersonERickshaw = Math.min(30, Math.max(10, sectors * 10))
    const totalERickshaw = perPersonERickshaw * safeTravelers

    options.push({
      modeId: 'e_rickshaw_shared',
      modeLabel: 'Shared Battery E-Rickshaw',
      vehicleType: 'Shared E-Rickshaw',
      estimatedFareInr: totalERickshaw,
      fareRangeInr: [totalERickshaw, totalERickshaw + safeTravelers * 10],
      perPersonShareInr: perPersonERickshaw,
      pricingBasis: 'PER_PASSENGER',
      reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
      tariffFormula: 'Flat arterial route tariff: ₹10 – ₹20 per passenger per zone.',
      excludedExtrasNotes: 'Fixed route arterial hopping; no door-to-door detour.',
      availabilityNote: 'Eco-friendly and silent on main Godowlia-Lanka and Station corridors.',
    })
  }

  // 4. Cab Hatchback (e.g. WagonR / Indica / Swift)
  // Base: ₹120 (first 3 km) + ₹14/km + traffic surge if peak
  const cabBaseDist = 3.0
  const cabExtraDist = Math.max(0, safeDistKm - cabBaseDist)
  const surgeMultiplier = isDawnPeak ? 1.15 : isEveningPeak ? 1.2 : 1.0
  const rawCabFare = (120 + cabExtraDist * 15.0) * surgeMultiplier
  const cabRoundedFare = Math.round(Math.max(120, rawCabFare) / 10) * 10
  const cabMinFare = Math.max(100, cabRoundedFare - 20)
  const cabMaxFare = cabRoundedFare + 40

  // 1 hatchback holds up to 4 passengers
  const cabsNeeded = Math.ceil(safeTravelers / 4)
  const totalCabFare = cabRoundedFare * cabsNeeded
  const perPersonCab = Math.round(totalCabFare / safeTravelers)

  options.push({
    modeId: 'cab_hatchback',
    modeLabel: cabsNeeded > 1 ? `AC Hatchback Cab (${cabsNeeded} Cabs)` : 'AC Hatchback Cab (Private Taxi)',
    vehicleType: 'Hatchback Cab',
    estimatedFareInr: totalCabFare,
    fareRangeInr: [cabMinFare * cabsNeeded, cabMaxFare * cabsNeeded],
    perPersonShareInr: perPersonCab,
    pricingBasis: 'PER_VEHICLE',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    tariffFormula: `Base ₹120 (3 km) + ₹15/km${isDawnPeak ? ' + 15% dawn departure surge' : ''}.`,
    excludedExtrasNotes: 'Excludes parking fees (₹30–₹50 at railway station/airports) and state toll.',
    availabilityNote: 'Bookable via local travel desks or app pickup at hotel porch.',
  })

  // 5. Sedan Cab (e.g. Dzire / Etios)
  if (safeTravelers >= 3 || safeDistKm >= 8.0) {
    const rawSedanFare = (150 + cabExtraDist * 18.0) * surgeMultiplier
    const sedanRounded = Math.round(Math.max(150, rawSedanFare) / 10) * 10
    const totalSedan = sedanRounded * cabsNeeded

    options.push({
      modeId: 'cab_sedan',
      modeLabel: cabsNeeded > 1 ? `AC Sedan Cab (${cabsNeeded} Sedans)` : 'AC Sedan Cab (Premium Comfort)',
      vehicleType: 'Sedan Cab',
      estimatedFareInr: totalSedan,
      fareRangeInr: [totalSedan - 30 * cabsNeeded, totalSedan + 50 * cabsNeeded],
      perPersonShareInr: Math.round(totalSedan / safeTravelers),
      pricingBasis: 'PER_VEHICLE',
      reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
      tariffFormula: 'Base ₹150 (3 km) + ₹18/km + peak surge multiplier.',
      excludedExtrasNotes: 'Airport parking and toll taxes excluded.',
      availabilityNote: 'Extra boot space for family luggage and intercity transfers.',
    })
  }

  // Determine recommended option:
  // - If walking < 1.0 km -> Walking
  // - If distance <= 3 km and travelers <= 3 -> Auto-Rickshaw
  // - If distance > 3 km or travelers > 3 -> Cab Hatchback
  let recommended = options[0]
  if (safeDistKm <= 0.9 && options.some((o) => o.modeId === 'walking')) {
    recommended = options.find((o) => o.modeId === 'walking')!
  } else if (safeDistKm <= 3.5 && safeTravelers <= 3) {
    recommended = options.find((o) => o.modeId === 'auto_rickshaw') || options[0]
  } else {
    recommended = options.find((o) => o.modeId === 'cab_hatchback') || options[0]
  }

  return {
    distanceKm: safeDistKm,
    travelerCount: safeTravelers,
    departureHour,
    pickupName,
    dropoffName,
    recommendedOption: recommended,
    allOptions: options,
    quoteTimestamp: new Date().toISOString(),
  }
}

/**
 * Calculates standard boat tariffs on the Ganga (Subah-e-Banaras morning boat).
 */
export function calculateGangaBoatQuote(
  travelerCount: number = 1,
  isPrivatePreferred: boolean = false
): TransportOptionQuote {
  const travelers = Math.max(1, travelerCount)

  if (isPrivatePreferred || travelers >= 4) {
    // Private wooden rowboat: ₹800 – ₹1,200 total per boat for 90-min cruise (seats up to 6–8)
    const privateBoatFare = 1000
    return {
      modeId: 'wooden_boat_private',
      modeLabel: 'Private Hand-Rowed Bajra Wooden Boat',
      vehicleType: 'Private Wooden Boat',
      estimatedFareInr: privateBoatFare,
      fareRangeInr: [800, 1200],
      perPersonShareInr: Math.round(privateBoatFare / travelers),
      pricingBasis: 'PER_VEHICLE',
      reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
      tariffFormula: 'Flat 90-minute private rowboat charter (Assi to Manikarnika & return).',
      excludedExtrasNotes: 'Boatman tip (₹50–₹100 optional) and flower diyas (₹20) not included.',
      availabilityNote: 'Book at Assi Ghat jetty between 5:15 AM and 6:00 AM directly with boatmen.',
    }
  }

  // Shared boat seat: ₹200 per passenger
  const sharedFarePerHead = 200
  const totalShared = sharedFarePerHead * travelers
  return {
    modeId: 'wooden_boat_shared',
    modeLabel: 'Shared Wooden Rowboat Seat',
    vehicleType: 'Shared Wooden Boat',
    estimatedFareInr: totalShared,
    fareRangeInr: [150 * travelers, 250 * travelers],
    perPersonShareInr: sharedFarePerHead,
    pricingBasis: 'PER_PASSENGER',
    reliabilityStatus: 'SOURCE_BASED_ESTIMATE',
    tariffFormula: 'Standard shared boat tariff: ₹150 – ₹250 per seat.',
    excludedExtrasNotes: 'Floating earthen diya optional (₹20).',
    availabilityNote: 'Available on dawn departure queues at Assi Ghat.',
  }
}

/**
 * Comprehensive Scenario Verification Tests for HOMI Real-World Travel Intelligence Engine
 * Tests Scenarios A through H as specified in product requirements.
 */

import { calculateSolarTiming, calculateSunriseDeparturePlan } from '../services/travel-engine/astronomyService'
import { getWeatherForecast } from '../services/travel-engine/weatherService'
import { computeDoorToDoorRoute } from '../services/travel-engine/routingService'
import { calculateLegTransportQuotes, calculateGangaBoatQuote } from '../services/travel-engine/transportPricingService'
import { checkDiningFeasibility } from '../services/travel-engine/restaurantTimingService'
import { compareHotelSunriseLogistics } from '../services/travel-engine/hotelLogisticsService'
import { generateRealWorldVaranasiPlan } from '../services/travel-engine/travelIntelligenceEngine'
import { validateRealWorldItinerary } from '../services/travel-engine/itineraryValidator'

export async function runTravelEngineTests(): Promise<{ passed: number; failed: number; errors: string[] }> {
  const errors: string[] = []
  let passed = 0
  let failed = 0

  function assert(condition: boolean, message: string) {
    if (condition) {
      passed++
    } else {
      failed++
      errors.push(message)
    }
  }

  console.log('--- Running Real-World Travel Intelligence Scenario Tests ---')

  // ===========================================================================
  // SCENARIO A: Sunrise Visit with Exact Date, Solar Timing & Departure Calculation
  // ===========================================================================
  try {
    const travelDate = '2026-10-18'
    const solar = calculateSolarTiming(travelDate, 25.3176, 82.9739)

    // NOAA equations verification for Varanasi in mid-October
    assert(solar.sunrise.startsWith('05:5') || solar.sunrise.startsWith('06:0'), `Astronomical sunrise for mid-October Varanasi should be ~05:55-06:00 AM (got ${solar.sunrise})`)
    assert(solar.civilDawn < solar.sunrise, `Civil Dawn (${solar.civilDawn}) must occur before Sunrise (${solar.sunrise})`)
    assert(solar.civilDusk > solar.sunset, `Civil Dusk (${solar.civilDusk}) must occur after Sunset (${solar.sunset})`)
    assert(solar.daylightDurationMinutes > 600 && solar.daylightDurationMinutes < 800, `Daylight duration should be ~11-12 hours in October (got ${solar.daylightDurationMinutes} mins)`)

    // Departure plan for Cantonment Hotel (20 min drive + 2 min walk)
    const departurePlan = calculateSunriseDeparturePlan(travelDate, 'boat_assi', 20, 2)
    assert(departurePlan.recommendedArrivalTime < departurePlan.sunriseTime, 'Arrival time must precede sunrise')
    assert(departurePlan.recommendedHotelDepartureTime < departurePlan.recommendedArrivalTime, 'Hotel departure must precede arrival at jetty')
    assert(departurePlan.minutesBeforeSunriseOnArrival === 25, 'Boat experience requires 25-minute arrival buffer')
  } catch (err: unknown) {
    failed++
    errors.push(`Scenario A threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // ===========================================================================
  // SCENARIO B: Late Restaurant Arrival & Near-Closing Risk Handling
  // ===========================================================================
  try {
    // Ram Bhandar closes at 11:30 AM. Arriving at 11:15 AM (within 30 min kitchen last-order buffer)
    const nearClosing = checkDiningFeasibility('ram_bhandar', '11:15', 10, 30)
    assert(nearClosing.status === 'NEAR_CLOSING_RISK', `Arriving 15 mins before closing should trigger NEAR_CLOSING_RISK (got ${nearClosing.status})`)
    assert(nearClosing.recommendedAlternative !== null, 'Engine must recommend an open alternative when dining is at risk')

    // Arriving at Ram Bhandar at 12:45 PM (Already closed)
    const alreadyClosed = checkDiningFeasibility('ram_bhandar', '12:45', 10, 30)
    assert(alreadyClosed.status === 'CLOSED_AT_ARRIVAL', `Arriving at 12:45 PM should report CLOSED_AT_ARRIVAL (got ${alreadyClosed.status})`)
    assert(alreadyClosed.recommendedAlternative?.id === 'kashi_chaat_bhandar', 'Alternative should recommend open evening dining')

    // Arriving at Pizzeria Vaatika Cafe at 09:00 AM (Comfortably open)
    const feasibleBreakfast = checkDiningFeasibility('vaatika_cafe', '09:00', 10, 45)
    assert(feasibleBreakfast.status === 'OPEN_AND_FEASIBLE', `09:00 AM at Vaatika should be OPEN_AND_FEASIBLE (got ${feasibleBreakfast.status})`)
    assert(feasibleBreakfast.recommendedAlternative === null, 'Feasible dining needs no alternative')
  } catch (err: unknown) {
    failed++
    errors.push(`Scenario B threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // ===========================================================================
  // SCENARIO C: Unavailable Live Cab Quote & Transparent Tariff Model
  // ===========================================================================
  try {
    const distKm = 7.5
    const quotes = calculateLegTransportQuotes(distKm, 2, 6, 'Cantonment', 'Godowlia')

    // Verify status is SOURCE_BASED_ESTIMATE, not fabricated live API quote
    assert(quotes.recommendedOption.reliabilityStatus === 'SOURCE_BASED_ESTIMATE', 'Tariff must declare SOURCE_BASED_ESTIMATE')
    assert(quotes.recommendedOption.tariffFormula.includes('Base ₹'), 'Tariff formula must be explicitly documented')
    assert(quotes.recommendedOption.estimatedFareInr > 0, 'Estimated fare must be calculated')
    assert(quotes.recommendedOption.fareRangeInr[0] < quotes.recommendedOption.fareRangeInr[1], 'Fare range must show low and high bounds')

    // Verify auto-rickshaw UP RTA tariff calculation
    const autoOpt = quotes.allOptions.find((o) => o.modeId === 'auto_rickshaw')
    assert(autoOpt !== undefined, 'Auto-rickshaw option must be present')
    assert(autoOpt!.tariffFormula.includes('UP RTA Tariff'), 'Auto must cite UP RTA Tariff')
  } catch (err: unknown) {
    failed++
    errors.push(`Scenario C threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // ===========================================================================
  // SCENARIO D: Weather Forecast & Sunrise Visibility Risk Flagging
  // ===========================================================================
  try {
    const weather = await getWeatherForecast('2026-10-18', 6, 25.3176, 82.9739)
    assert(weather.temperatureC > 0 && weather.temperatureC < 50, `Valid temperature returned (got ${weather.temperatureC}°C)`)
    assert(weather.cloudCoverPercent >= 0 && weather.cloudCoverPercent <= 100, 'Cloud cover must be between 0 and 100%')
    assert(
      weather.sunriseVisibility === 'OPTIMAL' ||
        weather.sunriseVisibility === 'MODERATE' ||
        weather.sunriseVisibility === 'MIST_OR_FOG' ||
        weather.sunriseVisibility === 'OVERCAST',
      `Sunrise visibility must have valid category (got ${weather.sunriseVisibility})`
    )
    assert(weather.sunriseAdvice.length > 10, 'Actionable sunrise advice must be provided')
    assert(weather.status === 'LIVE_FORECAST' || weather.status === 'SEASONAL_CLIMATE_MODEL', 'Status must declare forecast origin')
  } catch (err: unknown) {
    failed++
    errors.push(`Scenario D threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // ===========================================================================
  // SCENARIO E: Impossible Itinerary Rejection by Validation Engine
  // ===========================================================================
  try {
    // Construct an impossible schedule: overlapping times + activity after venue closed
    const impossibleSteps = [
      { id: 'step-1', title: 'Activity 1', startTime: '09:00', endTime: '10:00' },
      { id: 'step-2', title: 'Colliding Activity', startTime: '09:30', endTime: '10:30' }, // Overlaps by 30 mins!
      {
        id: 'step-3',
        title: 'Late Breakfast at Ram Bhandar',
        startTime: '13:00', // Arrives at 1:00 PM (780 min)
        endTime: '13:45',
        venueOpensAtMinute: 7 * 60, // Opens 7:00 AM (420 min)
        venueClosesAtMinute: 11 * 60 + 30, // Closes 11:30 AM (690 min)
      },
    ]

    const budgetMismatched = {
      transportTotal: 300,
      activitiesTotal: 500,
      foodTotal: 400,
      ticketsTotal: 0,
      contingencyTotal: 120,
      grandTotal: 9999, // Intentional mismatch! (Sum is 1320)
      perPersonTotal: 4999,
      travelerCount: 2,
    }

    const validation = validateRealWorldItinerary(impossibleSteps, budgetMismatched)
    assert(validation.isPlanValid === false, 'Validator must reject impossible plan')
    assert(validation.criticalErrors.length >= 2, `Validator must flag all critical errors (got ${validation.criticalErrors.length})`)
    assert(validation.temporalContinuityVerified === false, 'Temporal continuity must be flagged false')
    assert(validation.operatingHoursVerified === false, 'Operating hours must be flagged false')
    assert(validation.budgetIntegrityVerified === false, 'Budget integrity must be flagged false')
  } catch (err: unknown) {
    failed++
    errors.push(`Scenario E threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // ===========================================================================
  // SCENARIO F: Pedestrian Lane Segmentation & Vehicle Restriction Model
  // ===========================================================================
  try {
    // From Cantonment hotel to Dashashwamedh Ghat
    const route = computeDoorToDoorRoute(
      'Taj Ganges',
      25.3345,
      82.9815,
      'varanasi-dashashwamedh-ghat',
      'Dashashwamedh Ghat',
      25.3075,
      83.0104,
      'drive_cab',
      5
    )

    assert(route.pedestrianApproach.isVehicleRestrictedZone === true, 'Dashashwamedh Ghat must be detected as vehicle-restricted zone')
    assert(route.vehicleLeg !== null, 'Vehicle leg to gateway must exist')
    assert(route.walkingLeg !== null, 'Walking leg from gateway to ghat must exist')
    assert(route.pedestrianApproach.dropOffGatewayName.includes('Godowlia'), 'Drop-off must be Godowlia Chowk')
    assert(route.walkingLeg!.isPedestrianOnly === true, 'Final approach must be flagged pedestrian only')
    assert(route.pedestrianApproach.vehicleAccessWarning !== null, 'Vehicle warning must be explicit')
  } catch (err: unknown) {
    failed++
    errors.push(`Scenario F threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // ===========================================================================
  // SCENARIO G: Multi-Person Budget Allocation (Shared Vehicle vs Individual Food)
  // ===========================================================================
  try {
    const soloQuotes = calculateLegTransportQuotes(10.0, 1, 6, 'Hotel', 'Destination')
    const quadQuotes = calculateLegTransportQuotes(10.0, 4, 6, 'Hotel', 'Destination')

    const soloCabFare = soloQuotes.allOptions.find((o) => o.modeId === 'cab_hatchback')!.estimatedFareInr
    const quadCabFare = quadQuotes.allOptions.find((o) => o.modeId === 'cab_hatchback')!.estimatedFareInr
    const quadPerPersonShare = quadQuotes.allOptions.find((o) => o.modeId === 'cab_hatchback')!.perPersonShareInr

    // 1 cab holds up to 4 passengers, so total cab fare should be identical!
    assert(soloCabFare === quadCabFare, `Total cab fare for 1 vehicle should be identical whether 1 or 4 passengers ride (solo: ₹${soloCabFare}, quad: ₹${quadCabFare})`)
    // Per-person share for 4 people should be 1/4th of total fare
    assert(quadPerPersonShare === Math.round(quadCabFare / 4), `Per-person share for group of 4 must be 1/4th of cab fare (got ₹${quadPerPersonShare})`)

    // Private rowboat test: ₹1000 for boat regardless of whether 1 or 4 people
    const privateBoat = calculateGangaBoatQuote(4, true)
    assert(privateBoat.estimatedFareInr === 1000, 'Private boat fare is ₹1000')
    assert(privateBoat.perPersonShareInr === 250, 'Private boat per person share for 4 people is ₹250')
  } catch (err: unknown) {
    failed++
    errors.push(`Scenario G threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // ===========================================================================
  // SCENARIO H: Hotel Logistics Comparison Impact
  // ===========================================================================
  try {
    const cantonmentLogistics = compareHotelSunriseLogistics('taj_cantonment', '2026-10-18', '05:57', 2)
    const assiLogistics = compareHotelSunriseLogistics('assi_ghat_homestay', '2026-10-18', '05:57', 2)

    assert(cantonmentLogistics.requiresCab === true, 'Cantonment hotel must require cab')
    assert(assiLogistics.requiresCab === false, 'Assi Ghat homestay does not require cab')
    assert(cantonmentLogistics.requiredDepartureTime < assiLogistics.requiredDepartureTime, 'Cantonment guest must depart earlier than Assi guest')
    assert(cantonmentLogistics.estimatedCabFareInr > 0, 'Cantonment must incur cab fare')
    assert(assiLogistics.estimatedCabFareInr === 0, 'Assi guest incurs ₹0 cab fare')
  } catch (err: unknown) {
    failed++
    errors.push(`Scenario H threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // ===========================================================================
  // COMPLETE END-TO-END ITINERARY GENERATION AND RECONCILIATION
  // ===========================================================================
  try {
    const fullPlan = await generateRealWorldVaranasiPlan({
      travelDate: '2026-10-18',
      hotelId: 'taj_cantonment',
      travelerCount: 2,
      budgetTier: 'moderate',
      includeHotelCostInTotal: false,
    })

    assert(fullPlan.steps.length >= 8, `Full plan should have 8+ sequential steps (got ${fullPlan.steps.length})`)
    assert(fullPlan.validationReport.isPlanValid === true, `Validation report must pass for generated plan (errors: ${fullPlan.validationReport.criticalErrors.join(', ')})`)
    assert(fullPlan.budgetSummary.grandTotal > 0, 'Grand total must be calculated')
    assert(fullPlan.budgetSummary.perPersonTotal === Math.round(fullPlan.budgetSummary.grandTotal / 2), 'Per-person total must equal half of grand total for 2 travelers')
  } catch (err: unknown) {
    failed++
    errors.push(`End-to-End Plan test threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  return { passed, failed, errors }
}

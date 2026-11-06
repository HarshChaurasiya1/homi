import {
  getTrainsForRoute,
  calculateReturnTransit,
} from '../data/trainRoutes.ts'

export function runTrainRoutesTests() {
  console.log('--- Running Return Transit Engine & Train Minutiae Tests ---')
  let passed = 0
  let failed = 0
  const errors: string[] = []

  function assert(condition: boolean, msg: string) {
    if (condition) {
      passed++
    } else {
      failed++
      errors.push(msg)
      console.error(`  FAIL: ${msg}`)
    }
  }

  // 1. Test Jhansi <-> Varanasi Route
  const bsbToJhansiReturnTrains = getTrainsForRoute('varanasi', 'jhansi', 'return')
  assert(bsbToJhansiReturnTrains.length >= 3, 'Must have at least 3 return trains from Varanasi to Jhansi')

  // Check one and only recommended train
  const recommendedVaranasiReturns = bsbToJhansiReturnTrains.filter((t) => t.isRecommended)
  assert(
    recommendedVaranasiReturns.length === 1,
    `Must have one and only one recommended return train (found ${recommendedVaranasiReturns.length})`
  )

  const recTrain = recommendedVaranasiReturns[0]
  assert(recTrain?.trainNumber === '11108', 'Recommended return train from Varanasi must be #11108 Bundelkhand Express')
  assert(recTrain?.departureTime === '16:30', 'Train 11108 must depart at 16:30')
  assert(recTrain?.arrivalTime.includes('05:35'), 'Train 11108 must arrive at 05:35 AM')
  assert(recTrain?.fromStationCode === 'BSB', 'Departure station code must be BSB')
  assert(recTrain?.toStationCode === 'VGLJ', 'Arrival station code must be VGLJ')

  // Fares check: General & Sleeper real price
  const genFare = recTrain?.classes.find((c) => c.classCode === 'GEN' || c.classCode === '2S')
  const slFare = recTrain?.classes.find((c) => c.classCode === 'SL')
  const acFare = recTrain?.classes.find((c) => c.classCode === '3A')

  assert(Boolean(genFare && genFare.fareInr === 175), 'Train 11108 General fare must be ₹175')
  assert(Boolean(slFare && slFare.fareInr === 325), 'Train 11108 Sleeper fare must be ₹325')
  assert(Boolean(acFare && acFare.fareInr === 880), 'Train 11108 3AC fare must be ₹880')

  // Halts, punctuality, pantry
  assert(Array.isArray(recTrain?.keyHalts) && recTrain.keyHalts.length >= 8, 'Must have at least 8 key route halts')
  assert(Boolean(recTrain?.punctualityScore && recTrain.punctualityScore >= 80), 'Punctuality score must be >= 80%')
  assert(Boolean(recTrain?.cleanlinessScore && recTrain.cleanlinessScore >= 4.0), 'Cleanliness score must be >= 4.0')
  assert(Boolean(recTrain?.pantry && recTrain.pantry.includes('Pantry Car')), 'Must specify pantry car status')

  // 2. Test calculateReturnTransit for Varanasi
  const returnComparison = calculateReturnTransit('varanasi', 'Jhansi')
  assert(returnComparison.recommendedMode === 'train', 'Recommended mode for Varanasi to Jhansi return must be train')
  assert(returnComparison.recommendedTrain.trainNumber === '11108', 'Return comparison recommended train must be #11108')
  assert(returnComparison.bus.fareInr === 750, 'Return bus fare must be calibrated')
  assert(returnComparison.taxi.tollEstimatedInr > 0, 'Return taxi must calculate tolls')

  // 3. Test other routes
  const routesToTest = ['jaipur', 'delhi', 'udaipur', 'mussoorie']
  for (const city of routesToTest) {
    const transit = calculateReturnTransit(city, 'Jhansi')
    assert(Boolean(transit.destinationCityName), `Return transit for ${city} has destination name`)
    assert(transit.trains.length >= 1, `Return transit for ${city} has at least 1 direct train`)

    const recs = transit.trains.filter((t) => t.isRecommended)
    assert(recs.length === 1, `Route to ${city} has one and only one recommended return train`)

    for (const t of transit.trains) {
      assert(Boolean(t.trainNumber && t.trainName), `Train in ${city} has number and name`)
      assert(t.classes.length >= 2, `Train #${t.trainNumber} has class fare breakdown`)
      assert(t.classes.some((c) => c.fareInr > 0), `Train #${t.trainNumber} has non-zero fare`)
      assert(Boolean(t.departureTime && t.arrivalTime), `Train #${t.trainNumber} has timetable`)
      assert(t.keyHalts.length >= 3, `Train #${t.trainNumber} has intermediate halts`)
    }
  }

  // 4. Test Outbound Jhansi -> Jaipur
  const outboundJaipur = getTrainsForRoute('jhansi', 'jaipur', 'outbound')
  assert(outboundJaipur.length >= 1, 'Must have outbound trains for Jhansi to Jaipur')
  assert(outboundJaipur[0].trainNumber === '19665', 'Outbound train to Jaipur must be #19665 Khajuraho Express')

  return { passed, failed, errors }
}

import { getGeminiPersonalizedCardSelection } from '../services/geminiTravelBrain.ts'
import { STREET_VIEW_ROUTES } from '../data/streetViewRoutes.ts'
import { buildOsmMapUrl, buildOsmDirectionsUrl, buildOsm3DUrl, computeDoorToDoorRoute } from '../services/travel-engine/routingService.ts'

export async function runTravelBrainAndStreetViewTests(): Promise<{ passed: number; failed: number; errors: string[] }> {
  console.log('--- Running Gemini Travel Brain & OpenStreetMap (OSM) 3D Tests ---')
  let passed = 0
  let failed = 0
  const errors: string[] = []

  const assert = (condition: boolean, msg: string) => {
    if (condition) {
      passed++
    } else {
      failed++
      errors.push(msg)
      console.error(`  FAIL: ${msg}`)
    }
  }

  // Test 1: Gemini Card Selection Deterministic & Prompt Analysis
  try {
    const recommendation = await getGeminiPersonalizedCardSelection({
      cityId: 'varanasi',
      cityName: 'Varanasi',
      travelerDescription: 'College friends looking for food and sunset viewpoints',
      vibe: 'friends',
      budget: 'budget',
    })

    assert(recommendation.recommendedDays >= 1 && recommendation.recommendedDays <= 4, 'Valid days recommendation')
    assert(
      recommendation.recommendedBudgetTier === 'budget' ||
        recommendation.recommendedBudgetTier === 'moderate' ||
        recommendation.recommendedBudgetTier === 'premium',
      'Valid budget tier'
    )
    assert(recommendation.highlightedSpotNames.length > 0, 'Includes highlighted spots')
    assert(recommendation.localFriendGreeting.length > 0, 'Includes authentic local greeting')
    assert(recommendation.localAdviceText.length > 0, 'Includes local advice')
  } catch (err: unknown) {
    failed++
    errors.push(`Gemini recommendation threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // Test 2: OpenStreetMap (OSM) Route Data Structure & 3D Links
  const route = STREET_VIEW_ROUTES.dashashwamedh_ghat
  assert(route !== undefined, 'Dashashwamedh Ghat route exists')
  assert(route.cityId === 'varanasi', 'Belongs to Varanasi')
  assert(route.steps.length >= 3, 'Contains multi-step landmark navigation')

  // Verify OpenStreetMap 3D and Embed URLs
  assert(route.osmMapUrl.includes('openstreetmap.org'), 'Valid OSM map URL')
  assert(route.osm3DUrl.includes('f4map.com') || route.osm3DUrl.includes('osm'), 'Valid OSM 3D URL')
  assert(route.osmDirectionsUrl.includes('fossgis_osrm_foot'), 'Valid OSRM foot directions URL')
  assert(route.osmEmbedUrl.includes('openstreetmap.org/export/embed'), 'Valid OSM embed URL')

  // First step must be vehicular drop-off
  assert(route.steps[0].action === 'dropoff', 'Step 1 is drop-off')
  assert(route.steps[0].instructionHinglish.includes('Godowlia'), 'Godowlia drop-off mentioned')

  // Last step must be arrival
  assert(route.steps[route.steps.length - 1].action === 'arrival', 'Last step is arrival')
  assert(route.steps[route.steps.length - 1].instructionHinglish.includes('Dashashwamedh'), 'Arrival at Ghat')

  // All steps must have valid overlay coordinates
  for (const step of route.steps) {
    assert(step.overlayXPercent >= 0 && step.overlayXPercent <= 100, 'Valid overlay X%')
    assert(step.overlayYPercent >= 0 && step.overlayYPercent <= 100, 'Valid overlay Y%')
    assert(step.streetViewHeading >= 0 && step.streetViewHeading <= 360, 'Valid heading')
  }

  // Test 3: Assi Ghat and Kashi Vishwanath Route Coverage with OSM
  const assiRoute = STREET_VIEW_ROUTES.assi_ghat
  assert(assiRoute.totalWalkingMeters > 0, 'Assi walking distance defined')
  assert(assiRoute.osmMapUrl.includes('openstreetmap.org'), 'Assi has OSM map URL')
  assert(assiRoute.steps.some((s) => s.visualLandmark.toLowerCase().includes('vaatika')), 'Mentions Vaatika Cafe')

  const vishwanathRoute = STREET_VIEW_ROUTES.kashi_vishwanath
  assert(vishwanathRoute.totalWalkingMeters > 0, 'Vishwanath walking distance defined')
  assert(vishwanathRoute.osm3DUrl.includes('f4map.com'), 'Vishwanath has OSM 3D URL')
  assert(vishwanathRoute.steps.some((s) => s.visualLandmark.toLowerCase().includes('maidagin')), 'Mentions Maidagin')

  const manikarnikaRoute = STREET_VIEW_ROUTES.manikarnika_ghat
  assert(manikarnikaRoute !== undefined, 'Manikarnika Ghat route exists')
  assert(manikarnikaRoute.osmDirectionsUrl.includes('fossgis_osrm_foot'), 'Manikarnika has OSRM directions')

  // Test 4: OSM Routing Service Helpers
  const testOsmMap = buildOsmMapUrl(25.3075, 83.0097)
  assert(testOsmMap.includes('openstreetmap.org/?mlat=25.3075'), 'buildOsmMapUrl generates valid URL')

  const testOsmDirections = buildOsmDirectionsUrl(25.309, 83.006, 25.3075, 83.0097, 'walking')
  assert(testOsmDirections.includes('fossgis_osrm_foot'), 'buildOsmDirectionsUrl generates foot directions')

  const testOsm3D = buildOsm3DUrl(25.3075, 83.0097)
  assert(testOsm3D.includes('f4map.com'), 'buildOsm3DUrl generates 3D URL')

  const doorToDoor = computeDoorToDoorRoute(
    'BrijRama Palace',
    25.306,
    83.011,
    'dashashwamedh_ghat',
    'Dashashwamedh Ghat',
    25.3075,
    83.0097,
    'walk'
  )
  assert(doorToDoor.osmMapUrl !== undefined && doorToDoor.osmMapUrl.includes('openstreetmap.org'), 'DoorToDoorRoute has OSM map URL')
  assert(doorToDoor.osm3DUrl !== undefined && doorToDoor.osm3DUrl.includes('f4map.com'), 'DoorToDoorRoute has OSM 3D URL')

  return { passed, failed, errors }
}

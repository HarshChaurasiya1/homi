import { getGeminiPersonalizedCardSelection } from '../services/geminiTravelBrain.ts'
import { STREET_VIEW_ROUTES } from '../data/streetViewRoutes.ts'

export async function runTravelBrainAndStreetViewTests(): Promise<{ passed: number; failed: number; errors: string[] }> {
  console.log('--- Running Gemini Travel Brain & Street View Route Tests ---')
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

  // Test 2: Street View Verified Route Data Structure
  const route = STREET_VIEW_ROUTES.dashashwamedh_ghat
  assert(route !== undefined, 'Dashashwamedh Ghat route exists')
  assert(route.cityId === 'varanasi', 'Belongs to Varanasi')
  assert(route.steps.length >= 3, 'Contains multi-step landmark navigation')

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

  // Test 3: Assi Ghat and Kashi Vishwanath Route Coverage
  const assiRoute = STREET_VIEW_ROUTES.assi_ghat
  assert(assiRoute.totalWalkingMeters > 0, 'Assi walking distance defined')
  assert(assiRoute.steps.some((s) => s.visualLandmark.toLowerCase().includes('vaatika')), 'Mentions Vaatika Cafe')

  const vishwanathRoute = STREET_VIEW_ROUTES.kashi_vishwanath
  assert(vishwanathRoute.totalWalkingMeters > 0, 'Vishwanath walking distance defined')
  assert(vishwanathRoute.steps.some((s) => s.visualLandmark.toLowerCase().includes('maidagin')), 'Mentions Maidagin')

  return { passed, failed, errors }
}

/**
 * Unit verification tests for HOMI Planner & Budget Engine (5 Cities)
 */

import { generateItinerary } from '../lib/plannerEngine'
import type { PlannerInputs } from '../lib/plannerEngine'
import { PLACES } from '../data/places'

export function runPlannerTests(): { passed: number; failed: number; errors: string[] } {
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

  // Test 1: Solo traveler Jaipur 2 days budget tier
  try {
    const soloInputs: PlannerInputs = {
      destination: 'jaipur',
      days: 2,
      travellers: 1,
      budgetTier: 'budget',
      interests: ['heritage'],
      nationality: 'indian',
    }
    const soloPlan = generateItinerary(soloInputs)
    assert(soloPlan.days.length === 2, 'Should generate exactly 2 days for 2-day request')
    assert(soloPlan.budget.roomCount === 1, 'Solo traveler should need 1 room')
    assert(soloPlan.budget.nights === 1, '2-day trip should calculate 1 night')
    assert(soloPlan.budget.perPersonTotal === soloPlan.budget.grandTotal, 'Solo traveler total should equal per-person total')
  } catch (err: unknown) {
    failed++
    errors.push(`Solo test threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // Test 2: Family of 4 Udaipur 3 days moderate tier
  try {
    const familyInputs: PlannerInputs = {
      destination: 'udaipur',
      days: 3,
      travellers: 4,
      budgetTier: 'moderate',
      interests: ['heritage', 'food'],
      nationality: 'indian',
    }
    const familyPlan = generateItinerary(familyInputs)
    assert(familyPlan.days.length === 3, 'Should generate 3 days for 3-day request')
    assert(familyPlan.budget.roomCount === 2, '4 travelers should need 2 double rooms')
    assert(familyPlan.budget.nights === 2, '3-day trip should calculate 2 nights')
    assert(familyPlan.budget.grandTotal > 0, 'Grand total should be greater than zero')
    assert(
      familyPlan.budget.grandTotal === familyPlan.budget.accommodationTotal +
        familyPlan.budget.foodTotal +
        familyPlan.budget.transportTotal +
        familyPlan.budget.ticketsTotal +
        familyPlan.budget.bufferTotal,
      'Grand total should exactly equal the sum of line items'
    )
  } catch (err: unknown) {
    failed++
    errors.push(`Family test threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // Test 3: Group of 3 travelers in Manali (odd number, premium)
  try {
    const oddInputs: PlannerInputs = {
      destination: 'manali',
      days: 4,
      travellers: 3,
      budgetTier: 'premium',
      interests: ['heritage', 'photography'],
      nationality: 'foreigner',
    }
    const oddPlan = generateItinerary(oddInputs)
    assert(oddPlan.budget.roomCount === 2, '3 travelers should round up to 2 double rooms')
    assert(oddPlan.days.length === 4, 'Should generate 4 days for Manali')
  } catch (err: unknown) {
    failed++
    errors.push(`Manali odd group test threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // Test 4: Varanasi and Mussoorie itineraries
  try {
    const varanasiPlan = generateItinerary({
      destination: 'varanasi',
      days: 2,
      travellers: 2,
      budgetTier: 'budget',
      interests: ['heritage', 'food'],
      nationality: 'indian',
    })
    assert(varanasiPlan.days.length === 2, 'Should generate 2 days for Varanasi')

    const mussooriePlan = generateItinerary({
      destination: 'mussoorie',
      days: 3,
      travellers: 2,
      budgetTier: 'moderate',
      interests: ['hidden_gem'],
      nationality: 'indian',
    })
    assert(mussooriePlan.days.length === 3, 'Should generate 3 days for Mussoorie')
  } catch (err: unknown) {
    failed++
    errors.push(`Varanasi/Mussoorie test threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  // Test 5: Verify all curated places have valid coordinates, official source, and verified timestamp
  try {
    assert(PLACES.length >= 15, `Should have at least 15 curated places, found ${PLACES.length}`)
    PLACES.forEach((p) => {
      assert(p.latitude > 20 && p.latitude < 35, `Valid latitude for ${p.name}: ${p.latitude}`)
      assert(p.longitude > 70 && p.longitude < 85, `Valid longitude for ${p.name}: ${p.longitude}`)
      assert(p.name.length > 0, `Place should have a name: ${p.id}`)
      assert(p.sourceUrl.startsWith('http'), `Place ${p.name} must have a valid source URL: ${p.sourceUrl}`)
      assert(p.lastVerifiedAt.length > 0, `Place ${p.name} must have a verified date`)
    })
  } catch (err: unknown) {
    failed++
    errors.push(`Places audit threw: ${err instanceof Error ? err.message : String(err)}`)
  }

  return { passed, failed, errors }
}

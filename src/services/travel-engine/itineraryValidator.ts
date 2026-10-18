/**
 * Real-World Itinerary Validation Engine
 * Enforces temporal consistency, physical feasibility, operating-hours adherence, and mathematical cost integrity.
 * Rejects impossible plans (e.g., visits during closed hours, travel duration collisions, negative time).
 */

export interface ItineraryStepValidation {
  stepId: string
  stepTitle: string
  startTime: string
  endTime: string
  isValid: boolean
  issues: string[]
}

export interface ValidationReport {
  isPlanValid: boolean
  criticalErrors: string[]
  advisoryWarnings: string[]
  stepValidations: ItineraryStepValidation[]
  budgetIntegrityVerified: boolean
  temporalContinuityVerified: boolean
  operatingHoursVerified: boolean
}

function parseTimeToMin(timeStr: string): number {
  const parts = timeStr.split(':')
  if (parts.length < 2) return 0
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
}

export function validateRealWorldItinerary(
  steps: Array<{
    id: string
    title: string
    startTime: string
    endTime: string
    venueOpensAtMinute?: number
    venueClosesAtMinute?: number
    isMealStop?: boolean
  }>,
  budgetSummary: {
    transportTotal: number
    activitiesTotal: number
    foodTotal: number
    ticketsTotal: number
    contingencyTotal: number
    grandTotal: number
    perPersonTotal: number
    travelerCount: number
  }
): ValidationReport {
  const criticalErrors: string[] = []
  const advisoryWarnings: string[] = []
  const stepValidations: ItineraryStepValidation[] = []

  let temporalContinuity = true
  let operatingHoursValid = true
  let lastEndMinute = -1

  // 1. Chronological & Overlap Validation
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const stepIssues: string[] = []
    const startMin = parseTimeToMin(step.startTime)
    const endMin = parseTimeToMin(step.endTime)

    // Check duration validity
    if (endMin <= startMin) {
      stepIssues.push(`End time (${step.endTime}) is earlier than or equal to start time (${step.startTime}). Negative/zero duration is invalid.`)
      criticalErrors.push(`Step ${i + 1} "${step.title}": Invalid time progression.`)
      temporalContinuity = false
    }

    // Check chronological continuity
    if (lastEndMinute > -1 && startMin < lastEndMinute) {
      const overlapMinutes = lastEndMinute - startMin
      stepIssues.push(`Overlaps with previous activity by ${overlapMinutes} minutes. Physical collision detected.`)
      criticalErrors.push(`Step ${i + 1} "${step.title}": Starts at ${step.startTime} before previous activity finishes at ${lastEndMinute} min.`)
      temporalContinuity = false
    }

    // Check operating hours if defined
    if (step.venueOpensAtMinute !== undefined && step.venueClosesAtMinute !== undefined) {
      if (startMin < step.venueOpensAtMinute) {
        stepIssues.push(`Arrival at ${step.startTime} occurs before venue opening at ${Math.floor(step.venueOpensAtMinute / 60)}:${step.venueOpensAtMinute % 60}.`)
        criticalErrors.push(`Step ${i + 1} "${step.title}": Venue is closed upon arrival.`)
        operatingHoursValid = false
      } else if (startMin >= step.venueClosesAtMinute) {
        stepIssues.push(`Arrival at ${step.startTime} occurs after venue closing at ${Math.floor(step.venueClosesAtMinute / 60)}:${step.venueClosesAtMinute % 60}.`)
        criticalErrors.push(`Step ${i + 1} "${step.title}": Scheduled after venue has closed.`)
        operatingHoursValid = false
      } else if (endMin > step.venueClosesAtMinute) {
        stepIssues.push(`Activity concludes after venue closing time.`)
        advisoryWarnings.push(`Step ${i + 1} "${step.title}": May be rushed as visit extends past official closing.`)
      }
    }

    stepValidations.push({
      stepId: step.id,
      stepTitle: step.title,
      startTime: step.startTime,
      endTime: step.endTime,
      isValid: stepIssues.length === 0,
      issues: stepIssues,
    })

    lastEndMinute = endMin
  }

  // 2. Budget Reconciliation Verification
  const expectedSum =
    budgetSummary.transportTotal +
    budgetSummary.activitiesTotal +
    budgetSummary.foodTotal +
    budgetSummary.ticketsTotal +
    budgetSummary.contingencyTotal

  const budgetDifference = Math.abs(budgetSummary.grandTotal - expectedSum)
  const budgetIntegrity = budgetDifference < 2 // allow rounding tolerance of ₹1-2

  if (!budgetIntegrity) {
    criticalErrors.push(
      `Budget math reconciliation failed: Grand total (₹${budgetSummary.grandTotal}) does not match sum of line items (₹${expectedSum}).`
    )
  }

  const expectedPerPerson = Math.round(budgetSummary.grandTotal / Math.max(1, budgetSummary.travelerCount))
  if (Math.abs(budgetSummary.perPersonTotal - expectedPerPerson) > 2) {
    advisoryWarnings.push(
      `Per-person total (₹${budgetSummary.perPersonTotal}) diverges from group average (₹${expectedPerPerson}).`
    )
  }

  const isPlanValid = criticalErrors.length === 0

  return {
    isPlanValid,
    criticalErrors,
    advisoryWarnings,
    stepValidations,
    budgetIntegrityVerified: budgetIntegrity,
    temporalContinuityVerified: temporalContinuity,
    operatingHoursVerified: operatingHoursValid,
  }
}

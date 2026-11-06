import {
  LICENSED_LENDING_PARTNERS,
  LOAN_TENURE_OPTIONS,
  calculateLoanEmi,
  EMERGENCY_LOAN_KYC_CHECKLIST,
} from '../data/emergencyLoan.ts'

export function runEmergencyLoanTests() {
  console.log('--- Running Emergency Travel Loan & RBI Partner Tests ---')
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

  // 1. Licensed Lending Partners Integrity
  assert(
    LICENSED_LENDING_PARTNERS.length >= 4,
    `Expected at least 4 licensed partners, found ${LICENSED_LENDING_PARTNERS.length}`
  )

  LICENSED_LENDING_PARTNERS.forEach((partner) => {
    assert(
      partner.id.length > 0 && partner.name.length > 0,
      `Partner ${partner.id} has valid name`
    )
    assert(
      partner.rbiRegistrationNumber.length > 0,
      `Partner ${partner.name} must have RBI registration number or license`
    )
    assert(
      partner.grievanceOfficerEmail.includes('@'),
      `Partner ${partner.name} must provide a valid grievance officer email`
    )
    assert(
      partner.minAmount >= 5000 && partner.maxAmount <= 50000,
      `Partner ${partner.name} amount limits should be between ₹5,000 and ₹50,000`
    )
    assert(
      partner.turnaroundTime.length > 0,
      `Partner ${partner.name} must have a turnaround time specified`
    )
  })

  // 2. Axio 0% No-Cost EMI Partner Check
  const axio = LICENSED_LENDING_PARTNERS.find((p) => p.id === 'axio')
  assert(!!axio, 'Axio partner should be registered')
  assert(
    axio?.entityType === 'RBI Registered NBFC',
    'Axio must be an RBI Registered NBFC'
  )
  assert(
    axio?.rbiRegistrationNumber === 'B-05.05602',
    'Axio must have official RBI Registration B-05.05602'
  )

  // 3. IDFC FIRST Bank Partner Check
  const idfc = LICENSED_LENDING_PARTNERS.find((p) => p.id === 'idfc-first')
  assert(!!idfc, 'IDFC FIRST Bank partner should be registered')
  assert(
    idfc?.entityType === 'RBI Scheduled Commercial Bank',
    'IDFC FIRST Bank must be an RBI Scheduled Commercial Bank'
  )

  // 4. CASHe (Bhanix Finance) Partner Check
  const cashe = LICENSED_LENDING_PARTNERS.find((p) => p.id === 'cashe-bhanix')
  assert(!!cashe, 'CASHe Bhanix partner should be registered')
  assert(
    cashe?.rbiRegistrationNumber === '13.00221',
    'CASHe must have official RBI Registration 13.00221'
  )

  // 5. KreditBee (KrazyBee) Partner Check
  const kreditBee = LICENSED_LENDING_PARTNERS.find((p) => p.id === 'krazybee')
  assert(!!kreditBee, 'KreditBee KrazyBee partner should be registered')
  assert(
    kreditBee?.rbiRegistrationNumber === 'N-02.00288',
    'KreditBee must have official RBI Registration N-02.00288'
  )

  // 6. 3-Month 0% No-Cost EMI Calculation
  const noCostResult = calculateLoanEmi(15000, 3, 0)
  assert(
    noCostResult.principalAmount === 15000,
    `Expected principal 15000, got ${noCostResult.principalAmount}`
  )
  assert(
    noCostResult.isNoCostEmi === true,
    'Expected 3-month tenure to be 0% No-Cost EMI'
  )
  assert(
    noCostResult.monthlyEmi === 5000,
    `Expected ₹5,000/mo for ₹15,000 / 3, got ${noCostResult.monthlyEmi}`
  )
  assert(
    noCostResult.totalInterestPayable === 0,
    `Expected ₹0 interest on No-Cost EMI, got ${noCostResult.totalInterestPayable}`
  )
  assert(
    noCostResult.processingFee === 0,
    `Expected ₹0 processing fee for emergency travel line, got ${noCostResult.processingFee}`
  )
  assert(
    noCostResult.netDisbursedAmount === 15000,
    `Expected 100% net disbursed ₹15,000, got ${noCostResult.netDisbursedAmount}`
  )

  // 7. 6-Month Reducing Balance EMI Calculation
  const sixMonthResult = calculateLoanEmi(15000, 6, 14.0)
  assert(
    sixMonthResult.monthlyEmi > 2500 && sixMonthResult.monthlyEmi < 2700,
    `Expected 6-month EMI ~₹2,600, got ${sixMonthResult.monthlyEmi}`
  )
  assert(
    sixMonthResult.totalInterestPayable > 500 && sixMonthResult.totalInterestPayable < 800,
    `Expected 6-month interest between ₹500 and ₹800, got ${sixMonthResult.totalInterestPayable}`
  )
  assert(
    sixMonthResult.totalRepaymentAmount === sixMonthResult.monthlyEmi * 6,
    'Total repayment should equal monthly EMI * 6'
  )

  // 8. Amount Boundary Clamping (Min ₹5,000 and Max ₹50,000)
  const clampedMin = calculateLoanEmi(2000, 3, 0)
  assert(
    clampedMin.principalAmount === 5000,
    `Expected under-range amount 2000 to be clamped to 5000, got ${clampedMin.principalAmount}`
  )

  const clampedMax = calculateLoanEmi(99999, 3, 0)
  assert(
    clampedMax.principalAmount === 50000,
    `Expected over-range amount 99999 to be clamped to 50000, got ${clampedMax.principalAmount}`
  )

  // 9. KYC Checklist Verification
  assert(
    EMERGENCY_LOAN_KYC_CHECKLIST.length >= 4,
    `Expected 4 KYC checklist items, got ${EMERGENCY_LOAN_KYC_CHECKLIST.length}`
  )
  const panItem = EMERGENCY_LOAN_KYC_CHECKLIST.find((i) => i.title.includes('PAN'))
  assert(!!panItem, 'PAN Card validation must be in KYC checklist')

  const aadhaarItem = EMERGENCY_LOAN_KYC_CHECKLIST.find((i) => i.title.includes('Aadhaar'))
  assert(!!aadhaarItem, 'Aadhaar DigiLocker validation must be in KYC checklist')

  // 10. Loan Tenure Options Verification
  assert(
    LOAN_TENURE_OPTIONS.length === 4,
    `Expected 4 tenure options, got ${LOAN_TENURE_OPTIONS.length}`
  )
  const threeMo = LOAN_TENURE_OPTIONS.find((t) => t.months === 3)
  assert(threeMo?.isNoCostEmi === true, '3-month tenure must be 0% No-Cost EMI')

  console.log(`  Passed: ${passed}, Failed: ${failed}`)
  return { passed, failed, errors }
}

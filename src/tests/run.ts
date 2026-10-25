import { runPlannerTests } from './plannerEngine.test.ts'
import { runProfileStoreTests } from './profileStore.test.ts'
import { runTravelEngineTests } from './travelEngine.test.ts'
import { runTravelBrainAndStreetViewTests } from './travelBrainAndStreetView.test.ts'
import { runFlowchartTests } from './flowchart.test.ts'

async function main() {
  console.log('=== RUNNING HOMI AUTOMATED TESTS ===')
  const plannerResults = runPlannerTests()
  const profileResults = await runProfileStoreTests()
  const travelEngineResults = await runTravelEngineTests()
  const travelBrainResults = await runTravelBrainAndStreetViewTests()
  const flowchartResults = runFlowchartTests()

  const totalPassed =
    plannerResults.passed +
    profileResults.passed +
    travelEngineResults.passed +
    travelBrainResults.passed +
    flowchartResults.passed

  const totalFailed =
    plannerResults.failed +
    profileResults.failed +
    travelEngineResults.failed +
    travelBrainResults.failed +
    flowchartResults.failed

  const allErrors = [
    ...plannerResults.errors,
    ...profileResults.errors,
    ...travelEngineResults.errors,
    ...travelBrainResults.errors,
    ...flowchartResults.errors,
  ]

  console.log(`\n=================================`)
  console.log(`Total Passed: ${totalPassed}`)
  console.log(`Total Failed: ${totalFailed}`)
  console.log(`=================================`)

  if (totalFailed > 0) {
    console.error('Test failures:', allErrors)
    process.exit(1)
  } else {
    console.log('All tests passed successfully!')
    process.exit(0)
  }
}

main().catch((err) => {
  console.error('Runner error:', err)
  process.exit(1)
})

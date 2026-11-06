import { runPlannerTests } from './plannerEngine.test.ts'
import { runProfileStoreTests } from './profileStore.test.ts'
import { runTravelEngineTests } from './travelEngine.test.ts'
import { runTravelBrainAndStreetViewTests } from './travelBrainAndStreetView.test.ts'
import { runFlowchartTests } from './flowchart.test.ts'
import { runEmergencyDirectoryTests } from './emergencyDirectory.test.ts'
import { runCityVideoIntelTests } from './cityVideoIntel.test.ts'
import { runHotelsTests } from './hotels.test.ts'

async function main() {
  console.log('=== RUNNING HOMI AUTOMATED TESTS ===')
  const plannerResults = runPlannerTests()
  const profileResults = await runProfileStoreTests()
  const travelEngineResults = await runTravelEngineTests()
  const travelBrainResults = await runTravelBrainAndStreetViewTests()
  const flowchartResults = runFlowchartTests()
  const emergencyResults = runEmergencyDirectoryTests()
  const videoIntelResults = runCityVideoIntelTests()
  const hotelsResults = runHotelsTests()

  const totalPassed =
    plannerResults.passed +
    profileResults.passed +
    travelEngineResults.passed +
    travelBrainResults.passed +
    flowchartResults.passed +
    emergencyResults.passed +
    videoIntelResults.passed +
    hotelsResults.passed

  const totalFailed =
    plannerResults.failed +
    profileResults.failed +
    travelEngineResults.failed +
    travelBrainResults.failed +
    flowchartResults.failed +
    emergencyResults.failed +
    videoIntelResults.failed +
    hotelsResults.failed

  const allErrors = [
    ...plannerResults.errors,
    ...profileResults.errors,
    ...travelEngineResults.errors,
    ...travelBrainResults.errors,
    ...flowchartResults.errors,
    ...emergencyResults.errors,
    ...videoIntelResults.errors,
    ...hotelsResults.errors,
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

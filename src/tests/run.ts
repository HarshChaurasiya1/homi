import { runPlannerTests } from './plannerEngine.test.ts'


console.log('=== RUNNING HOMI AUTOMATED TESTS ===')
const results = runPlannerTests()

console.log(`Passed: ${results.passed}`)
console.log(`Failed: ${results.failed}`)

if (results.failed > 0) {
  console.error('Test failures:', results.errors)
  process.exit(1)
} else {
  console.log('All tests passed successfully!')
  process.exit(0)
}

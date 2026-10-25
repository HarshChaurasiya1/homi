import { CITY_FLOWCHARTS } from '../data/flowcharts.ts'

export function runFlowchartTests(): { passed: number; failed: number; errors: string[] } {
  console.log('--- Running Interactive City Flowchart Tests ---')
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

  // Test 1: Flowchart cities coverage
  const cities = ['jaipur', 'varanasi', 'udaipur', 'manali', 'mussoorie']
  for (const c of cities) {
    const chart = CITY_FLOWCHARTS[c]
    assert(chart !== undefined, `Flowchart exists for ${c}`)
    assert(chart.nodes.length >= 3, `${c} has at least 3 connected nodes`)
    assert(chart.heroImage.length > 0, `${c} has hero image`)
    assert(chart.editionTitle.toLowerCase().includes(c), `${c} has edition title`)
    assert(chart.startingGateway.length > 0, `${c} has starting gateway`)
  }

  // Test 2: Node sequence and transit integrity for Jaipur Edition
  const jaipur = CITY_FLOWCHARTS.jaipur
  assert(jaipur.nodes[0].stepNumber === 1, 'Jaipur starts at step 1')
  assert(jaipur.nodes[0].title.includes('Hawa Mahal'), 'Jaipur node 1 is Hawa Mahal')
  assert(jaipur.nodes[0].transitToNext !== undefined, 'Node 1 has transit connection')
  assert((jaipur.nodes[0].transitToNext?.durationMinutes ?? 0) > 0, 'Transit duration is positive')

  // Coordinates check
  for (const node of jaipur.nodes) {
    assert(node.osmCoordinates[0] > 20 && node.osmCoordinates[0] < 35, `Valid latitude for ${node.title}`)
    assert(node.osmCoordinates[1] > 70 && node.osmCoordinates[1] < 90, `Valid longitude for ${node.title}`)
    assert(node.localProTip.length > 10, `Helpful pro tip on ${node.title}`)
    assert(node.timeRange.length > 0, `Time range defined on ${node.title}`)
  }

  // Test 3: Decision Branching
  assert(jaipur.branchDecision !== undefined, 'Jaipur has decision branch')
  assert((jaipur.branchDecision?.branchA.nodes.length ?? 0) > 0, 'Branch A has nodes')
  assert((jaipur.branchDecision?.branchB.nodes.length ?? 0) > 0, 'Branch B has nodes')

  const varanasi = CITY_FLOWCHARTS.varanasi
  assert(varanasi.nodes.some((n) => n.title.includes('Assi Ghat')), 'Varanasi includes Assi Ghat')
  assert(varanasi.nodes.some((n) => n.title.includes('Dashashwamedh')), 'Varanasi includes Dashashwamedh Aarti')

  return { passed, failed, errors }
}

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CITY_LOCAL_VIDEO_INTEL } from '../data/cityVideoIntel.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.resolve(__dirname, '../../public')

export function runCityVideoIntelTests() {
  console.log('--- Running City Video Intelligence & YouTube Media Tests ---')
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

  const expectedCities = ['varanasi', 'jaipur', 'udaipur', 'manali', 'mussoorie', 'delhi']

  for (const city of expectedCities) {
    const list = CITY_LOCAL_VIDEO_INTEL[city]
    assert(Boolean(list && list.length > 0), `City '${city}' must have video intel entries`)

    if (!list) continue

    const seenIds = new Set<string>()
    const seenPhotos = new Set<string>()

    for (const item of list) {
      assert(Boolean(item.id && !seenIds.has(item.id)), `Item in '${city}' has unique id '${item.id}'`)
      seenIds.add(item.id)

      assert(Boolean(item.title && item.title.trim().length > 5), `Item '${item.id}' has title`)
      assert(Boolean(item.creator && item.channel), `Item '${item.id}' has creator and channel`)
      assert(Boolean(item.location && item.bestTime && item.approxCost), `Item '${item.id}' has location, time, cost`)
      assert(Boolean(item.groundTruth && item.groundTruth.length > 10), `Item '${item.id}' has ground truth`)
      assert(Array.isArray(item.videoInsights) && item.videoInsights.length >= 2, `Item '${item.id}' has >= 2 video insights`)
      assert(Boolean(item.photo), `Item '${item.id}' has photo`)

      if (item.photo && item.photo.startsWith('/assets/')) {
        const fullDiskPath = path.join(publicDir, item.photo.replace(/^\//, ''))
        const exists = fs.existsSync(fullDiskPath)
        assert(exists, `Local screenshot on disk exists for '${item.id}': ${item.photo}`)
        assert(!seenPhotos.has(item.photo), `Photo not duplicate in '${city}': ${item.photo}`)
        seenPhotos.add(item.photo)
      }

      if (item.videoId) {
        assert(Boolean(item.videoUrl && item.videoUrl.includes(item.videoId)), `Item '${item.id}' videoUrl matches videoId`)
      }
    }
  }

  return { passed, failed, errors }
}

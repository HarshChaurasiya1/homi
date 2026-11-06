import fs from 'node:fs'
import path from 'node:path'

const queries = [
  { id: 'vid-01', query: 'visa2explore varanasi ep 1' },
  { id: 'vid-02', query: 'monkey magic varanasi moksha bhawan' },
  { id: 'vid-03', query: 'delhi food walks banaras kachori ram bhandar' },
  { id: 'vid-04', query: 'veggie paaji varanasi street food tamatar chaat' },
  { id: 'vid-05', query: 'curly tales varanasi kashi vishwanath corridor' },
  { id: 'vid-06', query: 'tanya khanijow varanasi saree weavers' },
  { id: 'vid-07', query: 'kritika goel varanasi travel vlog' },
  { id: 'vid-08', query: 'india eat mania varanasi paan blue lassi' },
  { id: 'vid-09', query: 'manikarnika ghat documentary burning ghat' },
  { id: 'vid-10', query: 'bunkar varanasi sari weavers business insider' },
  { id: 'vid-11', query: 'varanasi 84 ghats walking tour 4k' },
  { id: 'vid-12', query: 'visa2explore varanasi sarnath' },
  { id: 'vid-13', query: 'varanasi boat ride price negotiation' },
  { id: 'vid-14', query: 'ramnagar fort lassi shiv prasad varanasi' },
  { id: 'vid-15', query: 'kashi vishwanath dham corridor locker rules' },
  { id: 'vid-16', query: 'kaal bhairav mandir varanasi kotwal' },
  { id: 'vid-17', query: 'thatheri bazaar varanasi brass' },
  { id: 'vid-18', query: 'the traveling desi varanasi ganga aarti' },
  { id: 'vid-19', query: 'varanasi sand bank sunset boat walk' },
  { id: 'vid-20', query: 'lakshmi chai wale malai toast varanasi street food' },
]

const outputDir = path.resolve('D:/homi/public/assets/cities/varanasi/youtube-screens')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function searchYouTubeVideo(q) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })
  const text = await res.text()
  const match = text.match(/watch\?v=([a-zA-Z0-9_-]{11})/)
  if (match) {
    return match[1]
  }
  return null
}

async function getVideoTitle(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })
    const text = await res.text()
    const match = text.match(/<title>(.*?)<\/title>/)
    if (match) {
      return match[1].replace(' - YouTube', '').trim()
    }
  } catch {}
  return 'Varanasi Local Walkthrough'
}

async function downloadBestImage(videoId, destFile) {
  const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  let res = await fetch(maxResUrl)
  if (!res.ok || res.status === 404) {
    res = await fetch(hqUrl)
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch image for ${videoId}: ${res.status}`)
  }

  const arrayBuffer = await res.arrayBuffer()
  fs.writeFileSync(destFile, Buffer.from(arrayBuffer))
}

async function run() {
  console.log('Fetching 20 real YouTube video screenshots...')
  const results = []

  for (let i = 0; i < queries.length; i++) {
    const item = queries[i]
    console.log(`[${i + 1}/20] Searching: "${item.query}"...`)
    let videoId = await searchYouTubeVideo(item.query)
    if (!videoId) {
      console.warn(`No video found for ${item.query}, using fallback...`)
      videoId = 'c0Dzxr6zWz4'
    }

    const title = await getVideoTitle(videoId)
    const filename = `${item.id}-${videoId}.jpg`
    const destPath = path.join(outputDir, filename)

    try {
      await downloadBestImage(videoId, destPath)
      const stats = fs.statSync(destPath)
      console.log(`  ✓ Saved ${filename} (${Math.round(stats.size / 1024)} KB) - "${title.slice(0, 50)}..."`)

      results.push({
        id: item.id,
        videoId,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        photoPath: `/assets/cities/varanasi/youtube-screens/${filename}`,
        videoTitle: title,
      })
    } catch (err) {
      console.error(`  ✗ Error downloading ${videoId}:`, err.message)
    }

    // brief pause
    await new Promise((r) => setTimeout(r, 400))
  }

  const resultJsonPath = path.resolve('D:/homi/scripts/youtube_results.json')
  fs.writeFileSync(resultJsonPath, JSON.stringify(results, null, 2))
  console.log(`\nSuccessfully downloaded ${results.length} real YouTube video screenshots!`)
}

run().catch(console.error)

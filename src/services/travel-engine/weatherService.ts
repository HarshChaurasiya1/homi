/**
 * Real-World Weather Intelligence Engine for Varanasi and Indian Destinations
 * Integrates Open-Meteo Weather Forecast API with seasonal climatological fallbacks.
 * Calculates sunrise visibility feasibility, river boat safety conditions, and walking comfort.
 */

export interface WeatherConditionSummary {
  date: string
  timeSlot: string
  temperatureC: number
  feelsLikeC: number
  cloudCoverPercent: number
  visibilityMeters: number
  precipitationProbability: number
  windSpeedKmh: number
  conditionLabel: string
  sunriseVisibility: 'OPTIMAL' | 'MODERATE' | 'MIST_OR_FOG' | 'OVERCAST'
  sunriseAdvice: string
  riverBoatCondition: 'CALM_WATERS' | 'CAUTION_ADVISED'
  riverBoatAdvice: string
  walkingComfort: 'COMFORTABLE' | 'HOT_SUN' | 'RAIN_GEAR_RECOMMENDED'
  status: 'LIVE_FORECAST' | 'SEASONAL_CLIMATE_MODEL'
  source: string
  lastCheckedAt: string
}

const VARANASI_SEASONAL_CLIMATE: Record<
  number,
  {
    avgTemp: number
    cloudCover: number
    visibility: number
    precipProb: number
    windSpeed: number
    condition: string
  }
> = {
  1: { avgTemp: 16, cloudCover: 35, visibility: 2200, precipProb: 10, windSpeed: 7, condition: 'Chilly winter with morning river mist' },
  2: { avgTemp: 20, cloudCover: 25, visibility: 3800, precipProb: 8, windSpeed: 9, condition: 'Pleasant crisp mornings and clear skies' },
  3: { avgTemp: 26, cloudCover: 20, visibility: 5000, precipProb: 5, windSpeed: 10, condition: 'Warm sunny weather and clear dawns' },
  4: { avgTemp: 32, cloudCover: 15, visibility: 6000, precipProb: 5, windSpeed: 12, condition: 'Hot dry afternoons and clear golden dawns' },
  5: { avgTemp: 36, cloudCover: 18, visibility: 5500, precipProb: 12, windSpeed: 14, condition: 'Intense summer heat; early mornings best' },
  6: { avgTemp: 34, cloudCover: 55, visibility: 4500, precipProb: 40, windSpeed: 15, condition: 'Pre-monsoon humidity and cloud build-up' },
  7: { avgTemp: 30, cloudCover: 75, visibility: 3500, precipProb: 70, windSpeed: 14, condition: 'Active monsoon rains; high river water levels' },
  8: { avgTemp: 29, cloudCover: 80, visibility: 3800, precipProb: 75, windSpeed: 13, condition: 'Heavy monsoon; boat cruises may be restricted' },
  9: { avgTemp: 29, cloudCover: 55, visibility: 4500, precipProb: 45, windSpeed: 11, condition: 'Late monsoon showers; receding river levels' },
  10: { avgTemp: 27, cloudCover: 20, visibility: 4800, precipProb: 15, windSpeed: 8, condition: 'Pleasant autumn breeze and crisp morning dawns' },
  11: { avgTemp: 22, cloudCover: 15, visibility: 3200, precipProb: 5, windSpeed: 7, condition: 'Cool serene mornings; Dev Deepawali festival season' },
  12: { avgTemp: 17, cloudCover: 30, visibility: 1800, precipProb: 5, windSpeed: 6, condition: 'Chilly winter dawn fog with ethereal river mist' },
}

interface OpenMeteoHourlyResponse {
  hourly?: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    cloudcover: number[]
    visibility: number[]
    windspeed_10m: number[]
  }
}

// In-memory cache to respect API rate limits (3-hour cache TTL)
const weatherCache = new Map<string, { summary: WeatherConditionSummary; expiresAt: number }>()

export async function getWeatherForecast(
  dateInput: Date | string = new Date(),
  targetHour: number = 6, // 6:00 AM dawn default
  lat: number = 25.3176,
  lng: number = 82.9739
): Promise<WeatherConditionSummary> {
  const d = typeof dateInput === 'string' ? new Date(`${dateInput.split('T')[0]}T12:00:00Z`) : dateInput
  const dateStr = d.toISOString().split('T')[0]
  const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}_${dateStr}_${targetHour}`

  const now = Date.now()
  const cached = weatherCache.get(cacheKey)
  if (cached && cached.expiresAt > now) {
    return cached.summary
  }

  // Attempt live Open-Meteo forecast API call
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,precipitation_probability,cloudcover,visibility,windspeed_10m&timezone=Asia%2FKolkata`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data: OpenMeteoHourlyResponse = await res.json()
      if (data.hourly && data.hourly.time && data.hourly.time.length > 0) {
        // Find matching time slot: YYYY-MM-DDTHH:00
        const targetIsoPrefix = `${dateStr}T${targetHour < 10 ? '0' : ''}${targetHour}:00`
        let matchIdx = data.hourly.time.findIndex((t) => t.startsWith(targetIsoPrefix))
        if (matchIdx === -1) matchIdx = 0 // Nearest slot

        const temp = Math.round(data.hourly.temperature_2m[matchIdx] ?? 24)
        const precip = Math.round(data.hourly.precipitation_probability[matchIdx] ?? 10)
        const cloud = Math.round(data.hourly.cloudcover[matchIdx] ?? 25)
        const vis = Math.round(data.hourly.visibility[matchIdx] ?? 4000)
        const wind = Math.round(data.hourly.windspeed_10m[matchIdx] ?? 8)

        const summary = buildSummary(dateStr, targetHour, temp, cloud, vis, precip, wind, 'LIVE_FORECAST', 'Open-Meteo European/GFS Numerical Forecast')
        weatherCache.set(cacheKey, { summary, expiresAt: now + 3 * 60 * 60 * 1000 })
        return summary
      }
    }
  } catch {
    // Graceful fallback to seasonal model
  }

  // Fallback: Seasonal Climatological Model
  const month = d.getUTCMonth() + 1
  const seasonal = VARANASI_SEASONAL_CLIMATE[month] || VARANASI_SEASONAL_CLIMATE[10]

  const fallbackSummary = buildSummary(
    dateStr,
    targetHour,
    seasonal.avgTemp,
    seasonal.cloudCover,
    seasonal.visibility,
    seasonal.precipProb,
    seasonal.windSpeed,
    'SEASONAL_CLIMATE_MODEL',
    `Varanasi Climatological Index (${seasonal.condition})`
  )

  weatherCache.set(cacheKey, { summary: fallbackSummary, expiresAt: now + 60 * 60 * 1000 })
  return fallbackSummary
}

function buildSummary(
  dateStr: string,
  hour: number,
  temp: number,
  cloud: number,
  visibility: number,
  precip: number,
  wind: number,
  status: 'LIVE_FORECAST' | 'SEASONAL_CLIMATE_MODEL',
  source: string
): WeatherConditionSummary {
  let sunriseVisibility: 'OPTIMAL' | 'MODERATE' | 'MIST_OR_FOG' | 'OVERCAST' = 'OPTIMAL'
  let sunriseAdvice = 'Crisp, clear skies expected. Golden sunrise rays reflecting on ancient stone facades will be vibrant.'

  if (visibility < 1500) {
    sunriseVisibility = 'MIST_OR_FOG'
    sunriseAdvice = 'Winter morning mist or river fog anticipated. Direct sunrise will be diffused; atmospheric silhouette photography recommended.'
  } else if (cloud > 75) {
    sunriseVisibility = 'OVERCAST'
    sunriseAdvice = 'Heavy cloud coverage forecasted. Direct sunrise disc will be obscured; soft ambient daylight expected.'
  } else if (cloud > 40) {
    sunriseVisibility = 'MODERATE'
    sunriseAdvice = 'Partly cloudy morning. Expect dramatic broken light beams across the eastern horizon.'
  }

  let riverBoatCondition: 'CALM_WATERS' | 'CAUTION_ADVISED' = 'CALM_WATERS'
  let riverBoatAdvice = 'River Ganga waters are calm. Hand-rowed wooden bajra boats can safely glide along the crescent.'

  if (wind > 25 || precip > 60) {
    riverBoatCondition = 'CAUTION_ADVISED'
    riverBoatAdvice = 'Breezy river chop or rainfall predicted. Check with local boatmen at Assi Jetty before boarding.'
  }

  let walkingComfort: 'COMFORTABLE' | 'HOT_SUN' | 'RAIN_GEAR_RECOMMENDED' = 'COMFORTABLE'
  if (precip > 50) {
    walkingComfort = 'RAIN_GEAR_RECOMMENDED'
  } else if (temp > 35) {
    walkingComfort = 'HOT_SUN'
  }

  return {
    date: dateStr,
    timeSlot: `${hour < 10 ? '0' : ''}${hour}:00 hrs`,
    temperatureC: temp,
    feelsLikeC: temp + (cloud > 50 ? 1 : -1),
    cloudCoverPercent: cloud,
    visibilityMeters: visibility,
    precipitationProbability: precip,
    windSpeedKmh: wind,
    conditionLabel: cloud < 25 ? 'Clear Skies' : cloud < 65 ? 'Partly Cloudy' : 'Overcast',
    sunriseVisibility,
    sunriseAdvice,
    riverBoatCondition,
    riverBoatAdvice,
    walkingComfort,
    status,
    source,
    lastCheckedAt: new Date().toISOString(),
  }
}

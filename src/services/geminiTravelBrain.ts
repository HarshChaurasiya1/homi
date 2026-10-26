/**
 * Gemini Travel Brain Service
 * Powered by Google Gemini API (gemini-flash-latest)
 * Provides AI-driven card selection, personalized itinerary tailoring,
 * and authentic local guide advice in the city's authentic persona.
 */

export interface GeminiCardSelectionRecommendation {
  recommendedDays: 1 | 2 | 3 | 4
  recommendedDaysReason: string
  recommendedBudgetTier: 'budget' | 'moderate' | 'premium'
  recommendedBudgetReason: string
  recommendedVibe: 'solo' | 'friends' | 'family' | 'couple'
  highlightedSpotNames: string[]
  localFriendGreeting: string
  localAdviceText: string
}

export interface LandmarkNavigationStep {
  stepNumber: number
  instructionHinglish: string
  instructionEnglish: string
  visualLandmark: string
  action: 'dropoff' | 'straight' | 'turn_left' | 'turn_right' | 'arrival'
  distanceMeters: number
  streetViewHeading: number // 0-360 degrees
  streetViewPitch: number
  overlayXPercent: number // 0-100% position on panorama
  overlayYPercent: number // 0-100% position on panorama
}

export interface VisualStreetRoute {
  destinationId: string
  destinationName: string
  cityId: string
  vehicularDropOffName: string
  totalWalkingMeters: number
  approxWalkMinutes: number
  panoramaImageUrl: string
  osmMapUrl: string
  osm3DUrl: string
  osmDirectionsUrl: string
  osmEmbedUrl: string
  googleStreetViewPanoramaUrl?: string
  latitude: number
  longitude: number
  steps: LandmarkNavigationStep[]
}

function getGeminiApiKey(): string {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process?.env?.VITE_GEMINI_API_KEY) {
      return process.env.VITE_GEMINI_API_KEY
    }
  } catch {
    // ignore
  }
  return ''
}

const GEMINI_MODEL = 'gemini-flash-latest'

/**
 * Call Google Gemini API to analyze traveler prompt and recommend card selections
 */
export async function getGeminiPersonalizedCardSelection(params: {
  cityId: string
  cityName: string
  travelerDescription?: string
  vibe?: string
  budget?: string
  days?: number
}): Promise<GeminiCardSelectionRecommendation> {
  const apiKey = getGeminiApiKey()

  if (!apiKey) {
    return getLocalDeterministicCardSelection(params)
  }

  const prompt = `You are the local travel friend and cultural companion for ${params.cityName}, India.
A traveler is planning their visit.
Traveler input/vibe: "${params.travelerDescription || params.vibe || 'classic exploration'}"
Budget style preference: "${params.budget || 'moderate'}"
Tentative days: ${params.days || 3}

Analyze their needs and return a JSON object with:
1. "recommendedDays": integer (1, 2, 3, or 4)
2. "recommendedDaysReason": brief 1-sentence explanation of why this duration is optimal.
3. "recommendedBudgetTier": one of "budget", "moderate", or "premium".
4. "recommendedBudgetReason": brief 1-sentence reason.
5. "recommendedVibe": one of "solo", "friends", "family", "couple".
6. "highlightedSpotNames": array of 3 iconic spot names in ${params.cityName} that best match this traveler.
7. "localFriendGreeting": warm, authentic greeting in the local dialect/apnapan (e.g. Banarasi bhaiya or Jaipur bhaisaab).
8. "localAdviceText": 2-sentence practical advice on how to pace their days without rushing or getting stuck in traffic.

Return ONLY raw valid JSON without markdown fences.`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
        },
      }),
    })

    if (!response.ok) {
      console.warn('Gemini API call returned status:', response.status)
      return getLocalDeterministicCardSelection(params)
    }

    const data = await response.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleanJson)

    return {
      recommendedDays: parsed.recommendedDays || 3,
      recommendedDaysReason: parsed.recommendedDaysReason || 'Optimal pace to experience signature heritage and peaceful mornings.',
      recommendedBudgetTier: parsed.recommendedBudgetTier || 'moderate',
      recommendedBudgetReason: parsed.recommendedBudgetReason || 'Balanced comfort with authentic heritage havelis and local dhabas.',
      recommendedVibe: parsed.recommendedVibe || 'friends',
      highlightedSpotNames: Array.isArray(parsed.highlightedSpotNames) ? parsed.highlightedSpotNames : ['Dashashwamedh Ghat', 'Assi Ghat', 'Vishwanath Corridor'],
      localFriendGreeting: parsed.localFriendGreeting || 'Pranam! Apka swagat hai hamare shahar mein.',
      localAdviceText: parsed.localAdviceText || 'Morning dawn starts early here; always take a boat before 6:30 AM to beat midday heat.',
    }
  } catch (err) {
    console.warn('Gemini Card Selection fallback activated:', err)
    return getLocalDeterministicCardSelection(params)
  }
}

/**
 * Ask Gemini API in real time as the local city companion
 */
export async function askGeminiLocalCompanion(params: {
  question: string
  cityName: string
  companionName: string
}): Promise<string> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    return `Bhaiya, ${params.cityName} mein subah jaldi nikalna sabse achha rehta hai! Bhid se bachoge aur sabse sundar nazare milenge.`
  }

  const prompt = `You are ${params.companionName}, a warm, knowledgeable local friend living in ${params.cityName}, India.
A traveler asks you: "${params.question}"
Reply directly to them in friendly Hinglish (natural mix of Hindi and English like spoken in India).
Give honest, hyper-practical local advice with landmarks and food spots.
Keep your response under 70 words so it is quick to read on mobile.`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 300,
        },
      }),
    })

    if (!response.ok) {
      return `Bhaiya, ${params.cityName} mein aate hi pehle subah ki chai aur kachori pakdo! Uske baad shahar ghumne ka asli maza aayega.`
    }

    const data = await response.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Aap bilkul befikra hokar aaiye, hamare shahar mein har mod par apnapan milega!'
  } catch {
    return `Bhaiya, ${params.cityName} mein subah jaldi nikalna sabse achha rehta hai! Bhid se bachoge aur sabse sundar nazare milenge.`
  }
}

/**
 * Deterministic local fallback when Gemini API key is missing or offline
 */
function getLocalDeterministicCardSelection(params: {
  cityId: string
  cityName: string
  travelerDescription?: string
  vibe?: string
  budget?: string
  days?: number
}): GeminiCardSelectionRecommendation {
  const city = params.cityId.toLowerCase()
  const isVaranasi = city === 'varanasi'

  return {
    recommendedDays: (params.days as 1 | 2 | 3 | 4) || 3,
    recommendedDaysReason: isVaranasi
      ? '3 days lets you witness both Assi dawn aarti and Dashashwamedh evening aarti without exhaustion.'
      : '3 days is the golden standard to see all major forts, local stepwells, and iconic sweet shops.',
    recommendedBudgetTier: (params.budget as 'budget' | 'moderate' | 'premium') || 'moderate',
    recommendedBudgetReason: 'Heritage havelis, rooftop riverfront cafes, and reliable city transport.',
    recommendedVibe: (params.vibe as 'solo' | 'friends' | 'family' | 'couple') || 'friends',
    highlightedSpotNames: isVaranasi
      ? ['Dashashwamedh Ghat', 'Assi Ghat Sunrise', 'Ram Bhandar Kachori']
      : ['Hawa Mahal Rooftop', 'Amer Fort Sheesh Mahal', 'Laxmi Mishthan Bhandar'],
    localFriendGreeting: isVaranasi
      ? 'Har Har Mahadev! Banaras aane ka sabse pyara faisla liya aapne.'
      : 'Khamma Ghani! Aapke Jaipur aane ki poori taiyari hai.',
    localAdviceText: isVaranasi
      ? 'Cabs Godowlia par rukengi, wahan se Dashashwamedh seedha paidal rasta hai. Subah 5:30 baje nav lene se ganga par asli shanti milti hai.'
      : 'Amer Fort subah 9 baje pahunche taaki dhoop se bach sakein, aur shaam Nahargarh par sunset dekhein.',
  }
}

// Homi Bhai Travel Companion Aliases
export type HomiBhaiCardSelectionRecommendation = GeminiCardSelectionRecommendation
export const getHomiBhaiPersonalizedCardSelection = getGeminiPersonalizedCardSelection
export const askHomiBhaiLocalCompanion = askGeminiLocalCompanion

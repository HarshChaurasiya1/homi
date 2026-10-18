/**
 * HOMI Data Types
 * Strict schema for cities, places, food experiences, and itineraries.
 */

export type CityId = 'jaipur' | 'udaipur' | 'manali' | 'varanasi' | 'mussoorie' | 'delhi' | (string & {})

export type PlaceCategory = 
  | 'heritage'
  | 'food'
  | 'neighborhood'
  | 'hidden_gem'
  | 'shopping'
  | 'sunset'

export type VerificationStatus = 'verified' | 'indicative' | 'unverified'

export interface NearestTransit {
  stationOrStop: string
  lineOrRoute?: string
  exitGate?: string
  walkMinutes: number
  mode: 'metro' | 'auto' | 'bus' | 'walk'
}

export interface TicketPrice {
  indian: number | 'Free'
  foreigner: number | 'Free'
  student?: number
  cameraFee?: number
  note?: string
}

export interface Place {
  id: string
  slug: string
  cityId: CityId
  category: PlaceCategory
  name: string
  hindiName?: string
  shortDescription: string
  whyWorthVisiting: string
  description: string
  address: string
  latitude: number
  longitude: number
  image: string
  imageAlt: string
  openingHours: string
  closedDays?: string
  ticketPrice: TicketPrice
  currency: 'INR'
  estimatedVisitMinutes: number
  bestTimeToVisit: string
  visitorSuitability: string[]
  transportNotes: string
  nearestTransit: NearestTransit
  visitorTips: string[]
  sourceUrl: string
  lastVerifiedAt: string
  verificationStatus: VerificationStatus
  isMustVisit: boolean
  tags: string[]
}

export interface LocalDish {
  id: string
  cityId: CityId
  name: string
  hindiName?: string
  type: 'veg' | 'non-veg' | 'sweet' | 'snack'
  description: string
  originStory: string
  iconicSpotName: string
  spotNeighborhood: string
  approxPriceInr: number
  image: string
}

export interface CityPersona {
  name: string
  title: string
  badge: string
  avatarImage: string
  greeting: string
  dialectQuote: string
  localTip: string
}

export interface RedditFavoriteSpot {
  id: string
  cityId: CityId
  type: 'sunset' | 'cafe' | 'food' | 'secret_gem'
  title: string
  neighborhood: string
  photo: string
  bestTimeOrOrder: string
  redditQuote: string
  priceOrEntry: string
  tag: string
}

export interface CityInfo {
  id: CityId
  name: string
  hindiName: string
  state: string
  tagline: string
  heroDescription: string
  curatorNote: string
  bestSeason: string
  idealDays: number
  vibeSummary: string
  localEtiquetteTip: string
  transportTip: string
  heroImage: string
  heroImageAlt: string
  themeClass: string
  galleryPhotos: string[]
  persona: CityPersona
  redditPicks?: RedditFavoriteSpot[]
  tasteOfCity: {
    headline: string
    flavors: string[]
    signatureDish: string
    famousEatery: string
  }
}


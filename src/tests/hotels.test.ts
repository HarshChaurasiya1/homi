import { CITY_HOTELS, getHotelsByCity } from '../data/hotels.ts'

export function runHotelsTests() {
  console.log('--- Running Verified Hotels & Trustable Booking Links Tests ---')
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
    const hotels = CITY_HOTELS[city]
    assert(Boolean(hotels && hotels.length >= 3), `City '${city}' must have at least 3 vetted hotels`)

    if (!hotels) continue

    const tiersFound = new Set<string>()
    const seenIds = new Set<string>()

    for (const h of hotels) {
      assert(!seenIds.has(h.id), `Hotel ID '${h.id}' is unique`)
      seenIds.add(h.id)

      assert(Boolean(h.name && h.name.trim().length > 5), `Hotel '${h.id}' has a descriptive name`)
      assert(Boolean(h.neighborhood && h.neighborhood.trim().length > 2), `Hotel '${h.id}' has a neighborhood`)
      assert(Boolean(h.proximity && h.proximity.trim().length > 5), `Hotel '${h.id}' has proximity details`)
      assert(h.rating >= 4.0 && h.rating <= 5.0, `Hotel '${h.id}' rating is between 4.0 and 5.0 (${h.rating})`)
      assert(h.reviewsCount > 500, `Hotel '${h.id}' has substantial reviews (${h.reviewsCount})`)
      assert(Boolean(h.pricePerNight && h.priceRange), `Hotel '${h.id}' has price breakdown`)
      assert(Boolean(h.groundTruth && h.groundTruth.length >= 15), `Hotel '${h.id}' has honest local ground truth`)
      assert(Array.isArray(h.highlights) && h.highlights.length >= 2, `Hotel '${h.id}' has >= 2 highlights`)
      assert(Array.isArray(h.amenities) && h.amenities.length >= 3, `Hotel '${h.id}' has >= 3 amenities`)

      // Trustable Links
      assert(
        Boolean(h.officialWebsite && h.officialWebsite.startsWith('https://')),
        `Hotel '${h.id}' has secure official website: ${h.officialWebsite}`
      )
      assert(
        Boolean(h.bookingUrl && h.bookingUrl.startsWith('https://www.booking.com/')),
        `Hotel '${h.id}' has trusted Booking.com link: ${h.bookingUrl}`
      )
      assert(
        Boolean(h.phone && h.phone.startsWith('+91')),
        `Hotel '${h.id}' has direct Indian phone contact: ${h.phone}`
      )

      tiersFound.add(h.tier)
    }

    assert(tiersFound.has('backpacker'), `City '${city}' has backpacker/hostel option`)
    assert(tiersFound.has('boutique') || tiersFound.has('luxury'), `City '${city}' has boutique/luxury option`)

    // Test getHotelsByCity helper
    const allForCity = getHotelsByCity(city)
    assert(allForCity.length === hotels.length, `getHotelsByCity('${city}') returns full list`)

    const backpackers = getHotelsByCity(city, 'backpacker')
    assert(
      backpackers.every((h) => h.tier === 'backpacker'),
      `getHotelsByCity('${city}', 'backpacker') filters correctly`
    )
  }

  return { passed, failed, errors }
}

import {
  CITY_SAFETY_DIRECTORIES,
  NATIONAL_EMERGENCY_HELPLINES,
  getSafetyDirectoryForCity,
} from '../data/emergencyContacts'

export function runEmergencyDirectoryTests(): { passed: number; failed: number; errors: string[] } {
  console.log('--- Running Assigned Local Guide & Emergency Directory Tests ---')
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

  // Test 1: All 6 core cities have safety directories
  const requiredCities = ['varanasi', 'jaipur', 'udaipur', 'manali', 'delhi', 'mussoorie']
  for (const cityId of requiredCities) {
    const dir = CITY_SAFETY_DIRECTORIES[cityId]
    assert(Boolean(dir), `Directory exists for ${cityId}`)
    assert(dir.cityId === cityId, `Directory cityId matches for ${cityId}`)
    assert(dir.cityName.length > 0, `Directory cityName populated for ${cityId}`)
  }

  // Test 2: Verified assigned guide with phone, WhatsApp, and bio for all cities
  const directories = Object.values(CITY_SAFETY_DIRECTORIES)
  for (const dir of directories) {
    const guide = dir.assignedGuide
    assert(guide.name.length > 3, `${dir.cityName} guide has real name`)
    assert(guide.phone.startsWith('+91'), `${dir.cityName} guide has +91 phone number`)
    assert(guide.phone.length === 13, `${dir.cityName} guide has valid 10-digit mobile (+91)`)
    assert(guide.whatsapp.startsWith('+91'), `${dir.cityName} guide has valid WhatsApp number`)
    assert(guide.languages.length >= 2, `${dir.cityName} guide speaks multiple languages`)
    assert(guide.neighborhood.length > 0, `${dir.cityName} guide has localized neighborhood`)
    assert(guide.bio.length > 20, `${dir.cityName} guide has comprehensive guidance bio`)
    assert(guide.availableHours.length > 0, `${dir.cityName} guide has stated active hours`)
  }

  // Test 3: Varanasi police stations and tourist booth
  const varanasiDir = getSafetyDirectoryForCity('varanasi')
  assert(varanasiDir.policeStations.length >= 4, 'Varanasi has at least 4 police stations recorded')

  const dashashwamedh = varanasiDir.policeStations.find((p) => p.name.includes('Dashashwamedh'))
  assert(Boolean(dashashwamedh), 'Dashashwamedh Police Station exists')
  assert(Boolean(dashashwamedh?.isTouristSpecialist), 'Dashashwamedh is marked as tourist specialist')
  assert(Boolean(dashashwamedh?.phone.length && dashashwamedh.phone.length > 6), 'Dashashwamedh has direct phone number')

  const chowk = varanasiDir.policeStations.find((p) => p.name.includes('Chowk'))
  assert(Boolean(chowk), 'Chowk Kashi Vishwanath Police Station exists')

  const bhelupur = varanasiDir.policeStations.find((p) => p.name.includes('Bhelupur'))
  assert(Boolean(bhelupur), 'Bhelupur Assi Ghat Police Station exists')

  const canttRailway = varanasiDir.policeStations.find((p) => p.name.includes('Railway'))
  assert(Boolean(canttRailway), 'Varanasi Cantt GRP Railway Police exists')

  // Test 4: Official portals verification
  assert(varanasiDir.officialPortals.length >= 4, 'Varanasi has at least 4 official portals')
  const kashiTrust = varanasiDir.officialPortals.find((p) => p.title.includes('Kashi Vishwanath'))
  assert(Boolean(kashiTrust), 'Kashi Vishwanath Trust portal exists')
  assert(Boolean(kashiTrust?.url.startsWith('https://shrikashivishwanath.org')), 'Kashi Vishwanath URL is official HTTPS')

  const upTourism = varanasiDir.officialPortals.find((p) => p.title.includes('Uttar Pradesh Tourism'))
  assert(Boolean(upTourism), 'UP Tourism portal exists')
  assert(Boolean(upTourism?.url.startsWith('https://uptourism.gov.in')), 'UP Tourism URL is official HTTPS')

  const irctc = varanasiDir.officialPortals.find((p) => p.title.includes('IRCTC'))
  assert(Boolean(irctc), 'IRCTC Rail portal exists')

  // Test 5: National helplines coverage
  const codes = NATIONAL_EMERGENCY_HELPLINES.map((h) => h.code)
  assert(codes.includes('112'), '112 All-in-one emergency helpline present')
  assert(codes.includes('1363'), '1363 National Tourist Helpline present')
  assert(codes.includes('139'), '139 Rail Madad present')
  assert(codes.includes('1090'), '1090 Women Power Line present')
  assert(codes.includes('108'), '108 Ambulance present')
  assert(codes.includes('1033'), '1033 Highway Helpline present')

  // Test 6: Fallback safety directory
  const fallback = getSafetyDirectoryForCity('unknown_city_test')
  assert(fallback.cityId === 'varanasi', 'Fallback defaults to Varanasi directory')
  assert(fallback.assignedGuide.name.includes('Shivam Mishra'), 'Fallback assigned guide is Pandit Shivam Mishra')

  return { passed, failed, errors }
}

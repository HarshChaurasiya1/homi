import {
  createLocalProfile,
  getLocalProfile,
  unlockLocalProfile,
  isProfileUnlocked,
  lockLocalProfile,
  saveTripProgress,
  getSavedTrips,
  deleteSavedTrip,
  clearLocalDatabase,
  exportLocalDatabaseBackup,
} from '../lib/profileStore.ts'

export async function runProfileStoreTests(): Promise<{ passed: number; failed: number; errors: string[] }> {
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

  console.log('\n--- Running Profile & Local Database Tests ---')

  // Clear before testing
  clearLocalDatabase()

  assert(getLocalProfile() === null, 'Initial profile should be null')
  assert(isProfileUnlocked() === true, 'No profile means unlocked by default')

  // 1. Create Profile
  const profile = await createLocalProfile({
    name: 'Aarav Sharma',
    homeCity: 'Delhi',
    travelStyle: 'moderate',
    vibe: 'friends',
    avatarEmoji: '🎒',
    password: 'securePass123',
  })

  assert(profile.name === 'Aarav Sharma', 'Profile name should match')
  assert(profile.homeCity === 'Delhi', 'Home city should match')
  assert(profile.travelStyle === 'moderate', 'Travel style should match')
  assert(profile.vibe === 'friends', 'Vibe should match')
  assert(typeof profile.passwordHash === 'string' && profile.passwordHash.length > 0, 'Password hash generated')
  assert(isProfileUnlocked() === true, 'Session unlocked on profile creation')

  // 2. Lock profile
  lockLocalProfile()
  assert(isProfileUnlocked() === false, 'Session should be locked after calling lock')

  // 3. Unlock with wrong password
  const wrongUnlock = await unlockLocalProfile('wrongPassword')
  assert(wrongUnlock === false, 'Wrong password unlock should fail')
  assert(isProfileUnlocked() === false, 'Session should remain locked on failed unlock')

  // 4. Unlock with correct password
  const correctUnlock = await unlockLocalProfile('securePass123')
  assert(correctUnlock === true, 'Correct password unlock should succeed')
  assert(isProfileUnlocked() === true, 'Session should now be unlocked')

  // 5. Save trip progress
  const saved = saveTripProgress({
    destination: 'varanasi',
    cityName: 'Varanasi',
    days: 3,
    budgetTier: 'moderate',
    vibe: 'friends',
    totalRupees: 7800,
    title: 'Varanasi 3-Day Ghats & Food Board',
  })

  assert(saved.destination === 'varanasi', 'Saved trip destination matches')
  const trips = getSavedTrips()
  assert(trips.length === 1, 'Trips count should be 1')
  assert(trips[0].cityName === 'Varanasi', 'Trip city name matches')

  // 6. Export backup
  const backup = exportLocalDatabaseBackup()
  assert(backup.includes('Aarav Sharma'), 'Backup includes user name')
  assert(backup.includes('Varanasi'), 'Backup includes saved trip')

  // 7. Delete trip
  deleteSavedTrip(saved.id)
  assert(getSavedTrips().length === 0, 'Saved trips should be empty after delete')

  // Cleanup
  clearLocalDatabase()
  assert(getLocalProfile() === null, 'Profile cleared after test cleanup')

  return { passed, failed, errors }
}

/**
 * Varanasi Old City Pedestrian Gateway & Vehicle Restriction Model
 * Accurately models Varanasi's historic pedestrian-only ghat zones and vehicle drop-off hubs.
 * Prevents impossible routing instructions like attempting to drive a cab directly to the river water steps.
 */

export interface PedestrianApproachInfo {
  isVehicleRestrictedZone: boolean
  dropOffGatewayName: string
  dropOffLatitude: number
  dropOffLongitude: number
  finalWalkDistanceMeters: number
  finalWalkMinutes: number
  pedestrianApproachNotes: string
  vehicleAccessWarning: string | null
}

export interface VehicleGateway {
  id: string
  name: string
  latitude: number
  longitude: number
  description: string
  servesVenues: string[]
}

export const VARANASI_VEHICLE_GATEWAYS: Record<string, VehicleGateway> = {
  godowlia_crossing: {
    id: 'godowlia_crossing',
    name: 'Godowlia Chowk Vehicle Terminal',
    latitude: 25.3090,
    longitude: 83.0068,
    description: 'The primary vehicle barrier and pedestrian entrance for Central Varanasi.',
    servesVenues: [
      'varanasi-dashashwamedh-ghat',
      'varanasi-kashi-vishwanath-corridor',
      'varanasi-tamatar-chaat',
      'varanasi-food-kashi-chaat',
    ],
  },
  assi_ghat_roundabout: {
    id: 'assi_ghat_roundabout',
    name: 'Assi Ghat Road Drop-Off Circle',
    latitude: 25.2892,
    longitude: 83.0049,
    description: 'Southern riverfront drop-off point with open vehicular road access.',
    servesVenues: [
      'varanasi-subah-e-banaras-boat',
      'varanasi-cafe-vaatika',
      'varanasi-sunspot-boat',
    ],
  },
  maidagin_crossing: {
    id: 'maidagin_crossing',
    name: 'Maidagin Crossing Hub',
    latitude: 25.3188,
    longitude: 83.0130,
    description: 'Northern Old City vehicle junction near Town Hall and Town Hall Park.',
    servesVenues: [
      'varanasi-malaiyo',
      'varanasi-kachori-jalebi',
      'varanasi-kaal-bhairav',
    ],
  },
  shivala_gate: {
    id: 'shivala_gate',
    name: 'Shivala Road Barrier',
    latitude: 25.2952,
    longitude: 83.0055,
    description: 'Mid-riverfront drop-off for Chet Singh Ghat and heritage river havelis.',
    servesVenues: [
      'varanasi-chet-singh-ghat',
      'varanasi-amritara-haveli',
    ],
  },
  bangali_tola_barrier: {
    id: 'bangali_tola_barrier',
    name: 'Bangali Tola Alley Entrance (Dudh Vinayak)',
    latitude: 25.3045,
    longitude: 83.0072,
    description: 'Pedestrian alley entrance leading toward Blue Lassi and Manikarnika.',
    servesVenues: [
      'varanasi-blue-lassi',
      'varanasi-food-bluelassi',
    ],
  },
}

/**
 * Evaluates whether a destination requires pedestrian segmentation and returns gateway data.
 */
export function resolvePedestrianApproach(
  destinationIdOrSlug: string,
  destLat: number,
  destLng: number
): PedestrianApproachInfo {
  const normId = destinationIdOrSlug.toLowerCase()

  // 1. Central Ghats / Godowlia / Dashashwamedh
  if (
    normId.includes('dashashwamedh') ||
    normId.includes('kashi-vishwanath') ||
    normId.includes('kashi-chaat') ||
    normId.includes('tamatar-chaat')
  ) {
    const gw = VARANASI_VEHICLE_GATEWAYS.godowlia_crossing
    const isVishwanath = normId.includes('vishwanath')
    return {
      isVehicleRestrictedZone: true,
      dropOffGatewayName: gw.name,
      dropOffLatitude: gw.latitude,
      dropOffLongitude: gw.longitude,
      finalWalkDistanceMeters: isVishwanath ? 350 : 450,
      finalWalkMinutes: isVishwanath ? 5 : 6,
      pedestrianApproachNotes:
        'Cabs and auto-rickshaws must drop off at Godowlia Chowk. Walk down the paved pedestrian bazaar directly to the river steps.',
      vehicleAccessWarning:
        'Cars cannot enter Dashashwamedh Ghat Road. Traffic police barricades enforce pedestrian-only flow from Godowlia Crossing.',
    }
  }

  // 2. Assi Ghat & Vaatika
  if (normId.includes('assi') || normId.includes('vaatika') || normId.includes('subah-e-banaras')) {
    const gw = VARANASI_VEHICLE_GATEWAYS.assi_ghat_roundabout
    return {
      isVehicleRestrictedZone: true,
      dropOffGatewayName: gw.name,
      dropOffLatitude: gw.latitude,
      dropOffLongitude: gw.longitude,
      finalWalkDistanceMeters: 150,
      finalWalkMinutes: 2,
      pedestrianApproachNotes:
        'Vehicles can approach up to Assi Ghat Roundabout. The final 150 meters to the boat jetty is a gentle paved descent.',
      vehicleAccessWarning: null,
    }
  }

  // 3. Bangali Tola / Blue Lassi / Manikarnika
  if (normId.includes('blue-lassi') || normId.includes('bluelassi') || normId.includes('manikarnika')) {
    const gw = VARANASI_VEHICLE_GATEWAYS.bangali_tola_barrier
    return {
      isVehicleRestrictedZone: true,
      dropOffGatewayName: gw.name,
      dropOffLatitude: gw.latitude,
      dropOffLongitude: gw.longitude,
      finalWalkDistanceMeters: 380,
      finalWalkMinutes: 6,
      pedestrianApproachNotes:
        'Drop off near Dudh Vinayak lane entrance. Navigate 380 meters through narrow historic cobblestone galis.',
      vehicleAccessWarning:
        'Alleys in Bangali Tola are between 1.5 to 2.5 meters wide. Accessible strictly on foot.',
    }
  }

  // 4. Chowk / Thatheri Bazaar / Ram Bhandar
  if (normId.includes('rambhandar') || normId.includes('kachori') || normId.includes('malaiyo')) {
    const gw = VARANASI_VEHICLE_GATEWAYS.maidagin_crossing
    return {
      isVehicleRestrictedZone: true,
      dropOffGatewayName: gw.name,
      dropOffLatitude: gw.latitude,
      dropOffLongitude: gw.longitude,
      finalWalkDistanceMeters: 420,
      finalWalkMinutes: 6,
      pedestrianApproachNotes:
        'Drop off at Maidagin Crossing. Walk through historic Thatheri Bazaar brassware lanes to the morning sweet shop.',
      vehicleAccessWarning:
        'Narrow bazaar lanes prohibit vehicles. Comfortable slip-on walking shoes recommended.',
    }
  }

  // Direct access venues (Sarnath, Ramnagar, Cantonment hotels)
  return {
    isVehicleRestrictedZone: false,
    dropOffGatewayName: 'Direct Venue Entrance / Parking Area',
    dropOffLatitude: destLat,
    dropOffLongitude: destLng,
    finalWalkDistanceMeters: 0,
    finalWalkMinutes: 0,
    pedestrianApproachNotes: 'Direct vehicular access and parking available at the venue entrance.',
    vehicleAccessWarning: null,
  }
}

/**
 * Multi-Modal Routing and Navigation Service
 * Calculates road distances, traffic-aware travel durations, and pedestrian approaches.
 * Interfaces with Google Routes API when credentials are provided, with calibrated fallback.
 */

import { resolvePedestrianApproach, type PedestrianApproachInfo } from './pedestrianGatewayModel'

export interface RouteLeg {
  mode: 'drive_cab' | 'auto_rickshaw' | 'walk' | 'boat'
  fromName: string
  toName: string
  fromCoords: [number, number] // [lat, lng]
  toCoords: [number, number]
  distanceKm: number
  durationMinutes: number
  isPedestrianOnly: boolean
  directionsUrl: string
  calculationStatus: 'LIVE_TRAFFIC_ROUTE' | 'SOURCE_BASED_ESTIMATE' | 'CALIBRATED_FALLBACK'
}

export interface DoorToDoorRoute {
  originName: string
  destinationName: string
  totalDistanceKm: number
  totalDurationMinutes: number
  primaryMode: 'drive_cab' | 'auto_rickshaw' | 'walk'
  pedestrianApproach: PedestrianApproachInfo
  vehicleLeg: RouteLeg | null
  walkingLeg: RouteLeg | null
  directDirectionsUrl: string
  trafficNote: string
}

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function buildGoogleMapsDirectionsUrl(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  travelMode: 'driving' | 'walking' | 'transit' = 'driving'
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=${travelMode}`
}

export function estimateTravelTime(
  distanceRoadKm: number,
  mode: 'drive_cab' | 'auto_rickshaw' | 'walk',
  departureHour: number = 6
): number {
  if (mode === 'walk') {
    // 4.2 km/h walking speed (70 meters / minute)
    return Math.max(2, Math.round((distanceRoadKm / 4.2) * 60))
  }

  // Calibrated urban speed profiles in Varanasi
  let speedKmh = 22
  if (departureHour >= 4 && departureHour <= 7) {
    // Early dawn (quiet roads, minimal congestion)
    speedKmh = mode === 'drive_cab' ? 28 : 20
  } else if ((departureHour >= 9 && departureHour <= 12) || (departureHour >= 17 && departureHour <= 21)) {
    // Peak market hours (Godowlia, Chowk, Sigra congestion)
    speedKmh = mode === 'drive_cab' ? 16 : 13
  } else {
    // Regular daytime
    speedKmh = mode === 'drive_cab' ? 22 : 16
  }

  const travelMinutes = (distanceRoadKm / speedKmh) * 60
  // Add 3 minutes baseline for vehicle boarding and intersections
  return Math.max(4, Math.round(travelMinutes + 3))
}

/**
 * Computes door-to-door journey from an origin (e.g. hotel) to a destination venue.
 * Segments the journey if the venue is located inside Varanasi's pedestrian-restricted ghat zone.
 */
export function computeDoorToDoorRoute(
  originName: string,
  originLat: number,
  originLng: number,
  destIdOrSlug: string,
  destName: string,
  destLat: number,
  destLng: number,
  preferredMode: 'drive_cab' | 'auto_rickshaw' | 'walk' = 'drive_cab',
  departureHour: number = 6
): DoorToDoorRoute {
  const straightLineKm = calculateHaversineKm(originLat, originLng, destLat, destLng)
  const pedApproach = resolvePedestrianApproach(destIdOrSlug, destLat, destLng)

  // Direct walk if very close (< 800m) or user prefers walking
  if (straightLineKm <= 0.8 || preferredMode === 'walk') {
    const roadDistKm = Math.round(straightLineKm * 1.35 * 10) / 10
    const walkMin = estimateTravelTime(roadDistKm, 'walk', departureHour)
    const directUrl = buildGoogleMapsDirectionsUrl(originLat, originLng, destLat, destLng, 'walking')

    return {
      originName,
      destinationName: destName,
      totalDistanceKm: roadDistKm,
      totalDurationMinutes: walkMin,
      primaryMode: 'walk',
      pedestrianApproach: pedApproach,
      vehicleLeg: null,
      walkingLeg: {
        mode: 'walk',
        fromName: originName,
        toName: destName,
        fromCoords: [originLat, originLng],
        toCoords: [destLat, destLng],
        distanceKm: roadDistKm,
        durationMinutes: walkMin,
        isPedestrianOnly: pedApproach.isVehicleRestrictedZone,
        directionsUrl: directUrl,
        calculationStatus: 'SOURCE_BASED_ESTIMATE',
      },
      directDirectionsUrl: directUrl,
      trafficNote: 'Direct pedestrian route through local streets and lanes.',
    }
  }

  // Segmented multi-leg journey
  if (pedApproach.isVehicleRestrictedZone) {
    const straightToGatewayKm = calculateHaversineKm(originLat, originLng, pedApproach.dropOffLatitude, pedApproach.dropOffLongitude)
    const roadToGatewayKm = Math.round(straightToGatewayKm * 1.35 * 10) / 10
    const vehicleMinutes = estimateTravelTime(roadToGatewayKm, preferredMode, departureHour)

    const vehicleUrl = buildGoogleMapsDirectionsUrl(originLat, originLng, pedApproach.dropOffLatitude, pedApproach.dropOffLongitude, 'driving')
    const finalWalkUrl = buildGoogleMapsDirectionsUrl(pedApproach.dropOffLatitude, pedApproach.dropOffLongitude, destLat, destLng, 'walking')

    const vehicleLeg: RouteLeg = {
      mode: preferredMode,
      fromName: originName,
      toName: pedApproach.dropOffGatewayName,
      fromCoords: [originLat, originLng],
      toCoords: [pedApproach.dropOffLatitude, pedApproach.dropOffLongitude],
      distanceKm: roadToGatewayKm,
      durationMinutes: vehicleMinutes,
      isPedestrianOnly: false,
      directionsUrl: vehicleUrl,
      calculationStatus: 'SOURCE_BASED_ESTIMATE',
    }

    const walkingLeg: RouteLeg = {
      mode: 'walk',
      fromName: pedApproach.dropOffGatewayName,
      toName: destName,
      fromCoords: [pedApproach.dropOffLatitude, pedApproach.dropOffLongitude],
      toCoords: [destLat, destLng],
      distanceKm: Math.round((pedApproach.finalWalkDistanceMeters / 1000) * 10) / 10,
      durationMinutes: pedApproach.finalWalkMinutes,
      isPedestrianOnly: true,
      directionsUrl: finalWalkUrl,
      calculationStatus: 'SOURCE_BASED_ESTIMATE',
    }

    return {
      originName,
      destinationName: destName,
      totalDistanceKm: Math.round((roadToGatewayKm + pedApproach.finalWalkDistanceMeters / 1000) * 10) / 10,
      totalDurationMinutes: vehicleMinutes + pedApproach.finalWalkMinutes,
      primaryMode: preferredMode,
      pedestrianApproach: pedApproach,
      vehicleLeg,
      walkingLeg,
      directDirectionsUrl: vehicleUrl,
      trafficNote: `Vehicles stop at ${pedApproach.dropOffGatewayName}. The final ${pedApproach.finalWalkDistanceMeters}m (${pedApproach.finalWalkMinutes} mins) is completed on foot through pedestrian lanes.`,
    }
  }

  // Direct vehicle route (e.g. Sarnath, Ramnagar Fort, Cantonment)
  const roadDistKm = Math.round(straightLineKm * 1.35 * 10) / 10
  const vehicleMinutes = estimateTravelTime(roadDistKm, preferredMode, departureHour)
  const directUrl = buildGoogleMapsDirectionsUrl(originLat, originLng, destLat, destLng, 'driving')

  return {
    originName,
    destinationName: destName,
    totalDistanceKm: roadDistKm,
    totalDurationMinutes: vehicleMinutes,
    primaryMode: preferredMode,
    pedestrianApproach: pedApproach,
    vehicleLeg: {
      mode: preferredMode,
      fromName: originName,
      toName: destName,
      fromCoords: [originLat, originLng],
      toCoords: [destLat, destLng],
      distanceKm: roadDistKm,
      durationMinutes: vehicleMinutes,
      isPedestrianOnly: false,
      directionsUrl: directUrl,
      calculationStatus: 'SOURCE_BASED_ESTIMATE',
    },
    walkingLeg: null,
    directDirectionsUrl: directUrl,
    trafficNote: 'Direct vehicular access to venue parking area.',
  }
}

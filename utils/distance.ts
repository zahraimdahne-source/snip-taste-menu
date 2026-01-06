// Distance calculation utility using Haversine formula
// Restaurant location: Snip Taste, Casablanca
// Updated from Google Maps: https://www.google.com/maps/place//@33.5853377,-7.5070247
// Coordinates: 33°35'07.2"N 7°30'16.0"W
export const RESTAURANT_COORDS = {
  lat: 33.5853333, // Precise latitude from Google Maps DMS
  lng: -7.5044444, // Precise longitude from Google Maps DMS
};

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lon1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lon2 - Longitude of point 2
 * @param useRoadDistance - If true, applies a multiplier to estimate road distance (default: true)
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  useRoadDistance: boolean = true
): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDistance = R * c;

  // Apply road distance multiplier for Casablanca
  // Based on actual Google Maps data: 2.17km straight-line ≈ 5-6km road distance
  // Multiplier: ~2.5x (accounts for roads, traffic patterns, city layout)
  const ROAD_DISTANCE_MULTIPLIER = 2.5;
  const distance = useRoadDistance
    ? straightLineDistance * ROAD_DISTANCE_MULTIPLIER
    : straightLineDistance;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Get suggested delivery fee tier based on distance
 * @param distance - Distance in kilometers
 * @returns Delivery fee tier: '0-2km' | '3-5km' | '5-10km' | null
 */
export function getDeliveryTier(distance: number): '0-2km' | '3-5km' | '5-10km' | null {
  if (distance <= 2) return '0-2km';
  if (distance <= 5) return '3-5km';
  if (distance <= 10) return '5-10km';
  return null; // Too far for delivery
}

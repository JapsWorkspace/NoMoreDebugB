export const JAEN_BOUNDS = {
  north: 15.42,
  south: 15.28,
  east: 121.05,
  west: 120.85,
};

export function isPointInsideJaen(lat, lng) {
  if (
    !Number.isFinite(Number(lat)) ||
    !Number.isFinite(Number(lng)) ||
    lat < JAEN_BOUNDS.south ||
    lat > JAEN_BOUNDS.north ||
    lng < JAEN_BOUNDS.west ||
    lng > JAEN_BOUNDS.east
  ) return false;

  const pointInRing = (ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (
        yi > lat !== yj > lat &&
        lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi
      ) inside = !inside;
    }
    return inside;
  };

  const pointInPolygon = (polygon) =>
    Array.isArray(polygon) &&
    pointInRing(polygon[0] || []) &&
    !polygon.slice(1).some(pointInRing);

  return (jaenGeoJSON?.features || []).some(({ geometry }) =>
    geometry?.type === "Polygon"
      ? pointInPolygon(geometry.coordinates)
      : geometry?.type === "MultiPolygon"
        ? geometry.coordinates.some(pointInPolygon)
        : false
  );
}

export function routeIsInsideJaen(route) {
  return route.geometry.coordinates.every(
    ([lng, lat]) => isPointInsideJaen(lat, lng)
  );
}
import jaenGeoJSON from "../data/jaen.json";

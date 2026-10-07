const jaenGeoJSON = require("../../screens/data/jaen.json");

function pointInRing(latitude, longitude, ring) {
  let inside = false;
  const points = Array.isArray(ring) ? ring : [];

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i] || [];
    const [xj, yj] = points[j] || [];
    const intersects =
      yi > latitude !== yj > latitude &&
      longitude < ((xj - xi) * (latitude - yi)) / ((yj - yi) || Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }

  return inside;
}

function pointInPolygon(latitude, longitude, polygon) {
  if (!Array.isArray(polygon) || !pointInRing(latitude, longitude, polygon[0])) {
    return false;
  }

  return !polygon.slice(1).some((hole) => pointInRing(latitude, longitude, hole));
}

function isPointInsideJaen(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

  return (jaenGeoJSON?.features || []).some((feature) => {
    const geometry = feature?.geometry;
    if (geometry?.type === "Polygon") {
      return pointInPolygon(lat, lng, geometry.coordinates);
    }
    if (geometry?.type === "MultiPolygon") {
      return geometry.coordinates.some((polygon) => pointInPolygon(lat, lng, polygon));
    }
    return false;
  });
}

module.exports = { isPointInsideJaen };

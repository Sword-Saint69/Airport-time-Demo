/**
 * The twenty global hubs shown on the dot-matrix world map.
 *
 * These are independent of the five cities on the LED board: the map is a
 * world view, the board is a personal departure list. Every hub carries an
 * IANA time zone so the map badge can show its live local time.
 */

export interface MapCity {
  id: string;
  name: string;
  timeZone: string;
  lat: number;
  lon: number;
}

export const MAP_CITIES: MapCity[] = [
  { id: "los-angeles", name: "Los Angeles", timeZone: "America/Los_Angeles", lat: 34.05, lon: -118.24 },
  { id: "mexico-city", name: "Mexico City", timeZone: "America/Mexico_City", lat: 19.43, lon: -99.13 },
  { id: "chicago", name: "Chicago", timeZone: "America/Chicago", lat: 41.88, lon: -87.63 },
  { id: "new-york", name: "New York", timeZone: "America/New_York", lat: 40.71, lon: -74.01 },
  { id: "sao-paulo", name: "São Paulo", timeZone: "America/Sao_Paulo", lat: -23.55, lon: -46.63 },
  { id: "buenos-aires", name: "Buenos Aires", timeZone: "America/Argentina/Buenos_Aires", lat: -34.6, lon: -58.38 },
  { id: "london", name: "London", timeZone: "Europe/London", lat: 51.51, lon: -0.13 },
  { id: "paris", name: "Paris", timeZone: "Europe/Paris", lat: 48.86, lon: 2.35 },
  { id: "moscow", name: "Moscow", timeZone: "Europe/Moscow", lat: 55.76, lon: 37.62 },
  { id: "istanbul", name: "Istanbul", timeZone: "Europe/Istanbul", lat: 41.01, lon: 28.98 },
  { id: "cairo", name: "Cairo", timeZone: "Africa/Cairo", lat: 30.04, lon: 31.24 },
  { id: "johannesburg", name: "Johannesburg", timeZone: "Africa/Johannesburg", lat: -26.2, lon: 28.05 },
  { id: "dubai", name: "Dubai", timeZone: "Asia/Dubai", lat: 25.2, lon: 55.27 },
  { id: "delhi", name: "Delhi", timeZone: "Asia/Kolkata", lat: 28.61, lon: 77.21 },
  { id: "bangkok", name: "Bangkok", timeZone: "Asia/Bangkok", lat: 13.76, lon: 100.5 },
  { id: "singapore", name: "Singapore", timeZone: "Asia/Singapore", lat: 1.35, lon: 103.82 },
  { id: "beijing", name: "Beijing", timeZone: "Asia/Shanghai", lat: 39.9, lon: 116.41 },
  { id: "tokyo", name: "Tokyo", timeZone: "Asia/Tokyo", lat: 35.68, lon: 139.69 },
  { id: "sydney", name: "Sydney", timeZone: "Australia/Sydney", lat: -33.87, lon: 151.21 },
  { id: "auckland", name: "Auckland", timeZone: "Pacific/Auckland", lat: -36.85, lon: 174.76 },
];

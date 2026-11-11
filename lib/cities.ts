/**
 * Static city catalogue.
 *
 * This data powers the World Time list, the search suggestions and the map
 * markers. Every `timeZone` is an official IANA identifier so it can be handed
 * straight to `Intl.DateTimeFormat`.
 */

export interface City {
  /** stable id, e.g. "new-york" */
  id: string;
  /** Display name, e.g. "New York" */
  name: string;
  /** Country / region label, e.g. "USA", "United Kingdom", "Puerto Rico" */
  country: string;
  /** IANA time zone, e.g. "America/New_York" */
  timeZone: string;
  /** latitude in degrees (-90..90) */
  lat: number;
  /** longitude in degrees (-180..180) */
  lon: number;
}

/** All available cities. */
export const CITIES: City[] = [
  { id: "abidjan", name: "Abidjan", country: "Ivory Coast", timeZone: "Africa/Abidjan", lat: 5.36, lon: -4.01 },
  { id: "accra", name: "Accra", country: "Ghana", timeZone: "Africa/Accra", lat: 5.56, lon: -0.2 },
  { id: "addis-ababa", name: "Addis Ababa", country: "Ethiopia", timeZone: "Africa/Addis_Ababa", lat: 9.03, lon: 38.74 },
  { id: "adelaide", name: "Adelaide", country: "Australia", timeZone: "Australia/Adelaide", lat: -34.93, lon: 138.6 },
  { id: "albuquerque", name: "Albuquerque", country: "USA", timeZone: "America/Denver", lat: 35.08, lon: -106.65 },
  { id: "alexandria", name: "Alexandria", country: "Egypt", timeZone: "Africa/Cairo", lat: 31.2, lon: 29.92 },
  { id: "algiers", name: "Algiers", country: "Algeria", timeZone: "Africa/Algiers", lat: 36.75, lon: 3.06 },
  { id: "almaty", name: "Almaty", country: "Kazakhstan", timeZone: "Asia/Almaty", lat: 43.24, lon: 76.89 },
  { id: "amman", name: "Amman", country: "Jordan", timeZone: "Asia/Amman", lat: 31.95, lon: 35.93 },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", timeZone: "Europe/Amsterdam", lat: 52.37, lon: 4.9 },
  { id: "anchorage", name: "Anchorage", country: "USA", timeZone: "America/Anchorage", lat: 61.22, lon: -149.9 },
  { id: "antananarivo", name: "Antananarivo", country: "Madagascar", timeZone: "Indian/Antananarivo", lat: -18.88, lon: 47.51 },
  { id: "apia", name: "Apia", country: "Samoa", timeZone: "Pacific/Apia", lat: -13.83, lon: -171.77 },
  { id: "asuncion", name: "Asuncion", country: "Paraguay", timeZone: "America/Asuncion", lat: -25.28, lon: -57.63 },
  { id: "athens", name: "Athens", country: "Greece", timeZone: "Europe/Athens", lat: 37.98, lon: 23.73 },
  { id: "atlanta", name: "Atlanta", country: "USA", timeZone: "America/New_York", lat: 33.75, lon: -84.39 },
  { id: "auckland", name: "Auckland", country: "New Zealand", timeZone: "Pacific/Auckland", lat: -36.85, lon: 174.76 },
  { id: "baghdad", name: "Baghdad", country: "Iraq", timeZone: "Asia/Baghdad", lat: 33.31, lon: 44.37 },
  { id: "baku", name: "Baku", country: "Azerbaijan", timeZone: "Asia/Baku", lat: 40.41, lon: 49.87 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", timeZone: "Asia/Bangkok", lat: 13.76, lon: 100.5 },
  { id: "barcelona", name: "Barcelona", country: "Spain", timeZone: "Europe/Madrid", lat: 41.39, lon: 2.17 },
  { id: "beijing", name: "Beijing", country: "China", timeZone: "Asia/Shanghai", lat: 39.9, lon: 116.41 },
  { id: "beirut", name: "Beirut", country: "Lebanon", timeZone: "Asia/Beirut", lat: 33.89, lon: 35.5 },
  { id: "belem", name: "Belem", country: "Brazil", timeZone: "America/Belem", lat: -1.46, lon: -48.5 },
  { id: "belgrade", name: "Belgrade", country: "Serbia", timeZone: "Europe/Belgrade", lat: 44.79, lon: 20.45 },
  { id: "belo-horizonte", name: "Belo Horizonte", country: "Brazil", timeZone: "America/Sao_Paulo", lat: -19.92, lon: -43.94 },
  { id: "bengaluru", name: "Bengaluru", country: "India", timeZone: "Asia/Kolkata", lat: 12.97, lon: 77.59 },
  { id: "berlin", name: "Berlin", country: "Germany", timeZone: "Europe/Berlin", lat: 52.52, lon: 13.41 },
  { id: "billings", name: "Billings", country: "USA", timeZone: "America/Denver", lat: 45.78, lon: -108.5 },
  { id: "boa-vista", name: "Boa Vista", country: "Brazil", timeZone: "America/Manaus", lat: 2.82, lon: -60.67 },
  { id: "bogota", name: "Bogota", country: "Colombia", timeZone: "America/Bogota", lat: 4.71, lon: -74.07 },
  { id: "boston", name: "Boston", country: "USA", timeZone: "America/New_York", lat: 42.36, lon: -71.06 },
  { id: "brasilia", name: "Brasilia", country: "Brazil", timeZone: "America/Sao_Paulo", lat: -15.79, lon: -47.88 },
  { id: "brazzaville", name: "Brazzaville", country: "Republic of the Congo", timeZone: "Africa/Brazzaville", lat: -4.27, lon: 15.28 },
  { id: "bridgetown", name: "Bridgetown", country: "Barbados", timeZone: "America/Barbados", lat: 13.1, lon: -59.62 },
  { id: "brisbane", name: "Brisbane", country: "Australia", timeZone: "Australia/Brisbane", lat: -27.47, lon: 153.03 },
  { id: "brussels", name: "Brussels", country: "Belgium", timeZone: "Europe/Brussels", lat: 50.85, lon: 4.35 },
  { id: "bucharest", name: "Bucharest", country: "Romania", timeZone: "Europe/Bucharest", lat: 44.43, lon: 26.1 },
  { id: "budapest", name: "Budapest", country: "Hungary", timeZone: "Europe/Budapest", lat: 47.5, lon: 19.04 },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", timeZone: "America/Argentina/Buenos_Aires", lat: -34.6, lon: -58.38 },
  { id: "calgary", name: "Calgary", country: "Canada", timeZone: "America/Edmonton", lat: 51.05, lon: -114.07 },
  { id: "campinas", name: "Campinas", country: "Brazil", timeZone: "America/Sao_Paulo", lat: -22.91, lon: -47.06 },
  { id: "canberra", name: "Canberra", country: "Australia", timeZone: "Australia/Sydney", lat: -35.28, lon: 149.13 },
  { id: "cancun", name: "Cancun", country: "Mexico", timeZone: "America/Cancun", lat: 21.16, lon: -86.85 },
  { id: "cape-town", name: "Cape Town", country: "South Africa", timeZone: "Africa/Johannesburg", lat: -33.92, lon: 18.42 },
  { id: "caracas", name: "Caracas", country: "Venezuela", timeZone: "America/Caracas", lat: 10.48, lon: -66.9 },
  { id: "casablanca", name: "Casablanca", country: "Morocco", timeZone: "Africa/Casablanca", lat: 33.57, lon: -7.59 },
  { id: "cayenne", name: "Cayenne", country: "French Guiana", timeZone: "America/Cayenne", lat: 4.92, lon: -52.33 },
  { id: "chatham-islands", name: "Chatham Islands", country: "New Zealand", timeZone: "Pacific/Chatham", lat: -43.95, lon: -176.55 },
  { id: "chennai", name: "Chennai", country: "India", timeZone: "Asia/Kolkata", lat: 13.08, lon: 80.27 },
  { id: "chicago", name: "Chicago", country: "USA", timeZone: "America/Chicago", lat: 41.88, lon: -87.63 },
  { id: "chiang-mai", name: "Chiang Mai", country: "Thailand", timeZone: "Asia/Bangkok", lat: 18.79, lon: 98.98 },
  { id: "ciudad-juarez", name: "Ciudad Juarez", country: "Mexico", timeZone: "America/Ciudad_Juarez", lat: 31.74, lon: -106.49 },
  { id: "colombo", name: "Colombo", country: "Sri Lanka", timeZone: "Asia/Colombo", lat: 6.93, lon: 79.86 },
  { id: "copenhagen", name: "Copenhagen", country: "Denmark", timeZone: "Europe/Copenhagen", lat: 55.68, lon: 12.57 },
  { id: "cuiaba", name: "Cuiaba", country: "Brazil", timeZone: "America/Cuiaba", lat: -15.6, lon: -56.1 },
  { id: "curitiba", name: "Curitiba", country: "Brazil", timeZone: "America/Sao_Paulo", lat: -25.43, lon: -49.27 },
  { id: "dakar", name: "Dakar", country: "Senegal", timeZone: "Africa/Dakar", lat: 14.72, lon: -17.47 },
  { id: "dallas", name: "Dallas", country: "USA", timeZone: "America/Chicago", lat: 32.78, lon: -96.8 },
  { id: "damascus", name: "Damascus", country: "Syria", timeZone: "Asia/Damascus", lat: 33.51, lon: 36.29 },
  { id: "dar-es-salaam", name: "Dar es Salaam", country: "Tanzania", timeZone: "Africa/Dar_es_Salaam", lat: -6.79, lon: 39.21 },
  { id: "darwin", name: "Darwin", country: "Australia", timeZone: "Australia/Darwin", lat: -12.46, lon: 130.84 },
  { id: "delhi", name: "Delhi", country: "India", timeZone: "Asia/Kolkata", lat: 28.61, lon: 77.21 },
  { id: "denver", name: "Denver", country: "USA", timeZone: "America/Denver", lat: 39.74, lon: -104.99 },
  { id: "dhaka", name: "Dhaka", country: "Bangladesh", timeZone: "Asia/Dhaka", lat: 23.81, lon: 90.41 },
  { id: "doha", name: "Doha", country: "Qatar", timeZone: "Asia/Qatar", lat: 25.29, lon: 51.53 },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", timeZone: "Asia/Dubai", lat: 25.2, lon: 55.27 },
  { id: "dublin", name: "Dublin", country: "Ireland", timeZone: "Europe/Dublin", lat: 53.35, lon: -6.26 },
  { id: "durban", name: "Durban", country: "South Africa", timeZone: "Africa/Johannesburg", lat: -29.86, lon: 31.02 },
  { id: "edinburgh", name: "Edinburgh", country: "United Kingdom", timeZone: "Europe/London", lat: 55.95, lon: -3.19 },
  { id: "edmonton", name: "Edmonton", country: "Canada", timeZone: "America/Edmonton", lat: 53.55, lon: -113.49 },
  { id: "eucla", name: "Eucla", country: "Australia", timeZone: "Australia/Eucla", lat: -31.68, lon: 128.88 },
  { id: "florianopolis", name: "Florianopolis", country: "Brazil", timeZone: "America/Sao_Paulo", lat: -27.6, lon: -48.55 },
  { id: "fortaleza", name: "Fortaleza", country: "Brazil", timeZone: "America/Fortaleza", lat: -3.73, lon: -38.53 },
  { id: "gaborone", name: "Gaborone", country: "Botswana", timeZone: "Africa/Gaborone", lat: -24.65, lon: 25.91 },
  { id: "geneva", name: "Geneva", country: "Switzerland", timeZone: "Europe/Zurich", lat: 46.21, lon: 6.14 },
  { id: "georgetown", name: "Georgetown", country: "Guyana", timeZone: "America/Guyana", lat: 6.8, lon: -58.16 },
  { id: "glasgow", name: "Glasgow", country: "United Kingdom", timeZone: "Europe/London", lat: 55.86, lon: -4.25 },
  { id: "guadalajara", name: "Guadalajara", country: "Mexico", timeZone: "America/Mexico_City", lat: 20.67, lon: -103.35 },
  { id: "guatemala-city", name: "Guatemala City", country: "Guatemala", timeZone: "America/Guatemala", lat: 14.63, lon: -90.51 },
  { id: "guayaquil", name: "Guayaquil", country: "Ecuador", timeZone: "America/Guayaquil", lat: -2.19, lon: -79.89 },
  { id: "hagatna", name: "Hagatna", country: "Guam", timeZone: "Pacific/Guam", lat: 13.47, lon: 144.75 },
  { id: "hamburg", name: "Hamburg", country: "Germany", timeZone: "Europe/Berlin", lat: 53.55, lon: 9.99 },
  { id: "hanga-roa", name: "Hanga Roa", country: "Chile", timeZone: "Pacific/Easter", lat: -27.15, lon: -109.43 },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", timeZone: "Asia/Ho_Chi_Minh", lat: 21.03, lon: 105.85 },
  { id: "harare", name: "Harare", country: "Zimbabwe", timeZone: "Africa/Harare", lat: -17.83, lon: 31.05 },
  { id: "havana", name: "Havana", country: "Cuba", timeZone: "America/Havana", lat: 23.11, lon: -82.37 },
  { id: "helsinki", name: "Helsinki", country: "Finland", timeZone: "Europe/Helsinki", lat: 60.17, lon: 24.94 },
  { id: "ho-chi-minh-city", name: "Ho Chi Minh City", country: "Vietnam", timeZone: "Asia/Ho_Chi_Minh", lat: 10.82, lon: 106.63 },
  { id: "hobart", name: "Hobart", country: "Australia", timeZone: "Australia/Hobart", lat: -42.88, lon: 147.33 },
  { id: "hong-kong", name: "Hong Kong", country: "Hong Kong", timeZone: "Asia/Hong_Kong", lat: 22.32, lon: 114.17 },
  { id: "honolulu", name: "Honolulu", country: "USA", timeZone: "Pacific/Honolulu", lat: 21.31, lon: -157.86 },
  { id: "houston", name: "Houston", country: "USA", timeZone: "America/Chicago", lat: 29.76, lon: -95.37 },
  { id: "islamabad", name: "Islamabad", country: "Pakistan", timeZone: "Asia/Karachi", lat: 33.68, lon: 73.05 },
  { id: "istanbul", name: "Istanbul", country: "Turkey", timeZone: "Europe/Istanbul", lat: 41.01, lon: 28.98 },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", timeZone: "Asia/Jakarta", lat: -6.21, lon: 106.85 },
  { id: "jeddah", name: "Jeddah", country: "Saudi Arabia", timeZone: "Asia/Riyadh", lat: 21.49, lon: 39.19 },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", timeZone: "Africa/Johannesburg", lat: -26.2, lon: 28.05 },
  { id: "kampala", name: "Kampala", country: "Uganda", timeZone: "Africa/Kampala", lat: 0.35, lon: 32.58 },
  { id: "karachi", name: "Karachi", country: "Pakistan", timeZone: "Asia/Karachi", lat: 24.86, lon: 67.01 },
  { id: "kathmandu", name: "Kathmandu", country: "Nepal", timeZone: "Asia/Kathmandu", lat: 27.72, lon: 85.32 },
  { id: "kazan", name: "Kazan", country: "Russia", timeZone: "Europe/Moscow", lat: 55.79, lon: 49.11 },
  { id: "khartoum", name: "Khartoum", country: "Sudan", timeZone: "Africa/Khartoum", lat: 15.5, lon: 32.56 },
  { id: "kigali", name: "Kigali", country: "Rwanda", timeZone: "Africa/Kigali", lat: -1.94, lon: 30.06 },
  { id: "kingston", name: "Kingston", country: "Jamaica", timeZone: "America/Jamaica", lat: 17.97, lon: -76.79 },
  { id: "kinshasa", name: "Kinshasa", country: "DR Congo", timeZone: "Africa/Kinshasa", lat: -4.32, lon: 15.31 },
  { id: "kiritimati", name: "Kiritimati", country: "Kiribati", timeZone: "Pacific/Kiritimati", lat: 1.87, lon: -157.43 },
  { id: "kolkata", name: "Kolkata", country: "India", timeZone: "Asia/Kolkata", lat: 22.57, lon: 88.36 },
  { id: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", timeZone: "Asia/Kuala_Lumpur", lat: 3.14, lon: 101.69 },
  { id: "krakow", name: "Krakow", country: "Poland", timeZone: "Europe/Warsaw", lat: 50.06, lon: 19.94 },
  { id: "kyiv", name: "Kyiv", country: "Ukraine", timeZone: "Europe/Kyiv", lat: 50.45, lon: 30.52 },
  { id: "lagos", name: "Lagos", country: "Nigeria", timeZone: "Africa/Lagos", lat: 6.52, lon: 3.38 },
  { id: "lahore", name: "Lahore", country: "Pakistan", timeZone: "Asia/Karachi", lat: 31.55, lon: 74.34 },
  { id: "la-paz", name: "La Paz", country: "Bolivia", timeZone: "America/La_Paz", lat: -16.5, lon: -68.15 },
  { id: "libreville", name: "Libreville", country: "Gabon", timeZone: "Africa/Libreville", lat: 0.42, lon: 9.47 },
  { id: "lima", name: "Lima", country: "Peru", timeZone: "America/Lima", lat: -12.05, lon: -77.04 },
  { id: "lisbon", name: "Lisbon", country: "Portugal", timeZone: "Europe/Lisbon", lat: 38.72, lon: -9.14 },
  { id: "london", name: "London", country: "United Kingdom", timeZone: "Europe/London", lat: 51.51, lon: -0.13 },
  { id: "longyearbyen", name: "Longyearbyen", country: "Svalbard", timeZone: "Arctic/Longyearbyen", lat: 78.22, lon: 15.65 },
  { id: "lord-howe-island", name: "Lord Howe Island", country: "Australia", timeZone: "Australia/Lord_Howe", lat: -31.55, lon: 159.08 },
  { id: "los-angeles", name: "Los Angeles", country: "USA", timeZone: "America/Los_Angeles", lat: 34.05, lon: -118.24 },
  { id: "luanda", name: "Luanda", country: "Angola", timeZone: "Africa/Luanda", lat: -8.84, lon: 13.23 },
  { id: "lusaka", name: "Lusaka", country: "Zambia", timeZone: "Africa/Lusaka", lat: -15.39, lon: 28.32 },
  { id: "luxembourg", name: "Luxembourg", country: "Luxembourg", timeZone: "Europe/Luxembourg", lat: 49.61, lon: 6.13 },
  { id: "madrid", name: "Madrid", country: "Spain", timeZone: "Europe/Madrid", lat: 40.42, lon: -3.7 },
  { id: "managua", name: "Managua", country: "Nicaragua", timeZone: "America/Managua", lat: 12.12, lon: -86.25 },
  { id: "manaus", name: "Manaus", country: "Brazil", timeZone: "America/Manaus", lat: -3.12, lon: -60.02 },
  { id: "manila", name: "Manila", country: "Philippines", timeZone: "Asia/Manila", lat: 14.6, lon: 120.98 },
  { id: "maputo", name: "Maputo", country: "Mozambique", timeZone: "Africa/Maputo", lat: -25.97, lon: 32.57 },
  { id: "maseru", name: "Maseru", country: "Lesotho", timeZone: "Africa/Maseru", lat: -29.31, lon: 27.48 },
  { id: "mcmurdo-station", name: "McMurdo Station", country: "Antarctica", timeZone: "Antarctica/McMurdo", lat: -77.85, lon: 166.67 },
  { id: "melbourne", name: "Melbourne", country: "Australia", timeZone: "Australia/Melbourne", lat: -37.81, lon: 144.96 },
  { id: "mexico-city", name: "Mexico City", country: "Mexico", timeZone: "America/Mexico_City", lat: 19.43, lon: -99.13 },
  { id: "miami", name: "Miami", country: "USA", timeZone: "America/New_York", lat: 25.76, lon: -80.19 },
  { id: "milan", name: "Milan", country: "Italy", timeZone: "Europe/Rome", lat: 45.46, lon: 9.19 },
  { id: "minsk", name: "Minsk", country: "Belarus", timeZone: "Europe/Minsk", lat: 53.9, lon: 27.57 },
  { id: "monrovia", name: "Monrovia", country: "Liberia", timeZone: "Africa/Monrovia", lat: 6.31, lon: -10.8 },
  { id: "montevideo", name: "Montevideo", country: "Uruguay", timeZone: "America/Montevideo", lat: -34.9, lon: -56.16 },
  { id: "montreal", name: "Montreal", country: "Canada", timeZone: "America/Toronto", lat: 45.5, lon: -73.57 },
  { id: "moscow", name: "Moscow", country: "Russia", timeZone: "Europe/Moscow", lat: 55.76, lon: 37.62 },
  { id: "mumbai", name: "Mumbai", country: "India", timeZone: "Asia/Kolkata", lat: 19.08, lon: 72.88 },
  { id: "munich", name: "Munich", country: "Germany", timeZone: "Europe/Berlin", lat: 48.14, lon: 11.58 },
  { id: "muscat", name: "Muscat", country: "Oman", timeZone: "Asia/Muscat", lat: 23.59, lon: 58.41 },
  { id: "nairobi", name: "Nairobi", country: "Kenya", timeZone: "Africa/Nairobi", lat: -1.29, lon: 36.82 },
  { id: "nassau", name: "Nassau", country: "Bahamas", timeZone: "America/Nassau", lat: 25.04, lon: -77.36 },
  { id: "new-york", name: "New York", country: "USA", timeZone: "America/New_York", lat: 40.71, lon: -74.01 },
  { id: "nice", name: "Nice", country: "France", timeZone: "Europe/Paris", lat: 43.7, lon: 7.27 },
  { id: "nicosia", name: "Nicosia", country: "Cyprus", timeZone: "Asia/Nicosia", lat: 35.17, lon: 33.36 },
  { id: "novosibirsk", name: "Novosibirsk", country: "Russia", timeZone: "Asia/Novosibirsk", lat: 55.01, lon: 82.94 },
  { id: "nuku-alofa", name: "Nuku'alofa", country: "Tonga", timeZone: "Pacific/Tongatapu", lat: -21.14, lon: -175.2 },
  { id: "nuuk", name: "Nuuk", country: "Greenland", timeZone: "America/Nuuk", lat: 64.18, lon: -51.72 },
  { id: "osaka", name: "Osaka", country: "Japan", timeZone: "Asia/Tokyo", lat: 34.69, lon: 135.5 },
  { id: "oslo", name: "Oslo", country: "Norway", timeZone: "Europe/Oslo", lat: 59.91, lon: 10.75 },
  { id: "ottawa", name: "Ottawa", country: "Canada", timeZone: "America/Toronto", lat: 45.42, lon: -75.7 },
  { id: "pago-pago", name: "Pago Pago", country: "American Samoa", timeZone: "Pacific/Pago_Pago", lat: -14.28, lon: -170.7 },
  { id: "papeete", name: "Papeete", country: "French Polynesia", timeZone: "Pacific/Tahiti", lat: -17.53, lon: -149.57 },
  { id: "panama-city", name: "Panama City", country: "Panama", timeZone: "America/Panama", lat: 8.98, lon: -79.52 },
  { id: "paramaribo", name: "Paramaribo", country: "Suriname", timeZone: "America/Paramaribo", lat: 5.85, lon: -55.2 },
  { id: "paris", name: "Paris", country: "France", timeZone: "Europe/Paris", lat: 48.86, lon: 2.35 },
  { id: "perth", name: "Perth", country: "Australia", timeZone: "Australia/Perth", lat: -31.95, lon: 115.86 },
  { id: "phnom-penh", name: "Phnom Penh", country: "Cambodia", timeZone: "Asia/Phnom_Penh", lat: 11.56, lon: 104.93 },
  { id: "phoenix", name: "Phoenix", country: "USA", timeZone: "America/Phoenix", lat: 33.45, lon: -112.07 },
  { id: "port-au-prince", name: "Port-au-Prince", country: "Haiti", timeZone: "America/Port-au-Prince", lat: 18.55, lon: -72.33 },
  { id: "port-louis", name: "Port Louis", country: "Mauritius", timeZone: "Indian/Mauritius", lat: -20.16, lon: 57.5 },
  { id: "port-moresby", name: "Port Moresby", country: "Papua New Guinea", timeZone: "Pacific/Port_Moresby", lat: -9.44, lon: 147.18 },
  { id: "port-of-spain", name: "Port of Spain", country: "Trinidad and Tobago", timeZone: "America/Port_of_Spain", lat: 10.65, lon: -61.51 },
  { id: "porto-alegre", name: "Porto Alegre", country: "Brazil", timeZone: "America/Sao_Paulo", lat: -30.03, lon: -51.23 },
  { id: "praia", name: "Praia", country: "Cape Verde", timeZone: "Atlantic/Cape_Verde", lat: 14.92, lon: -23.51 },
  { id: "prague", name: "Prague", country: "Czechia", timeZone: "Europe/Prague", lat: 50.08, lon: 14.44 },
  { id: "pretoria", name: "Pretoria", country: "South Africa", timeZone: "Africa/Johannesburg", lat: -25.75, lon: 28.19 },
  { id: "puebla", name: "Puebla", country: "Mexico", timeZone: "America/Mexico_City", lat: 19.04, lon: -98.21 },
  { id: "punta-arenas", name: "Punta Arenas", country: "Chile", timeZone: "America/Punta_Arenas", lat: -53.16, lon: -70.91 },
  { id: "quebec-city", name: "Quebec City", country: "Canada", timeZone: "America/Toronto", lat: 46.81, lon: -71.21 },
  { id: "quito", name: "Quito", country: "Ecuador", timeZone: "America/Guayaquil", lat: -0.18, lon: -78.47 },
  { id: "rarotonga", name: "Rarotonga", country: "Cook Islands", timeZone: "Pacific/Rarotonga", lat: -21.21, lon: -159.78 },
  { id: "recife", name: "Recife", country: "Brazil", timeZone: "America/Recife", lat: -8.05, lon: -34.88 },
  { id: "reykjavik", name: "Reykjavik", country: "Iceland", timeZone: "Atlantic/Reykjavik", lat: 64.15, lon: -21.94 },
  { id: "riga", name: "Riga", country: "Latvia", timeZone: "Europe/Riga", lat: 56.95, lon: 24.11 },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", timeZone: "Asia/Riyadh", lat: 24.71, lon: 46.68 },
  { id: "rome", name: "Rome", country: "Italy", timeZone: "Europe/Rome", lat: 41.9, lon: 12.5 },
  { id: "salvador", name: "Salvador", country: "Brazil", timeZone: "America/Bahia", lat: -12.97, lon: -38.5 },
  { id: "samara", name: "Samara", country: "Russia", timeZone: "Europe/Samara", lat: 53.2, lon: 50.1 },
  { id: "san-francisco", name: "San Francisco", country: "USA", timeZone: "America/Los_Angeles", lat: 37.77, lon: -122.42 },
  { id: "san-juan", name: "San Juan", country: "Puerto Rico", timeZone: "America/Puerto_Rico", lat: 18.47, lon: -66.11 },
  { id: "san-salvador", name: "San Salvador", country: "El Salvador", timeZone: "America/El_Salvador", lat: 13.69, lon: -89.19 },
  { id: "santiago", name: "Santiago", country: "Chile", timeZone: "America/Santiago", lat: -33.45, lon: -70.67 },
  { id: "santo-domingo", name: "Santo Domingo", country: "Dominican Republic", timeZone: "America/Santo_Domingo", lat: 18.49, lon: -69.93 },
  { id: "sao-paulo", name: "São Paulo", country: "Brazil", timeZone: "America/Sao_Paulo", lat: -23.55, lon: -46.63 },
  { id: "scoresbysund", name: "Scoresbysund", country: "Greenland", timeZone: "America/Scoresbysund", lat: 70.48, lon: -22.0 },
  { id: "seattle", name: "Seattle", country: "USA", timeZone: "America/Los_Angeles", lat: 47.61, lon: -122.33 },
  { id: "seoul", name: "Seoul", country: "South Korea", timeZone: "Asia/Seoul", lat: 37.57, lon: 126.98 },
  { id: "shanghai", name: "Shanghai", country: "China", timeZone: "Asia/Shanghai", lat: 31.23, lon: 121.47 },
  { id: "singapore", name: "Singapore", country: "Singapore", timeZone: "Asia/Singapore", lat: 1.35, lon: 103.82 },
  { id: "sofia", name: "Sofia", country: "Bulgaria", timeZone: "Europe/Sofia", lat: 42.7, lon: 23.32 },
  { id: "st-johns", name: "St John's", country: "Canada", timeZone: "America/St_Johns", lat: 47.56, lon: -52.71 },
  { id: "st-petersburg", name: "St Petersburg", country: "Russia", timeZone: "Europe/Moscow", lat: 59.93, lon: 30.34 },
  { id: "stockholm", name: "Stockholm", country: "Sweden", timeZone: "Europe/Stockholm", lat: 59.33, lon: 18.07 },
  { id: "suva", name: "Suva", country: "Fiji", timeZone: "Pacific/Fiji", lat: -18.14, lon: 178.44 },
  { id: "sydney", name: "Sydney", country: "Australia", timeZone: "Australia/Sydney", lat: -33.87, lon: 151.21 },
  { id: "taiohae", name: "Taiohae", country: "French Polynesia", timeZone: "Pacific/Marquesas", lat: -8.91, lon: -140.1 },
  { id: "taipei", name: "Taipei", country: "Taiwan", timeZone: "Asia/Taipei", lat: 25.03, lon: 121.57 },
  { id: "tallinn", name: "Tallinn", country: "Estonia", timeZone: "Europe/Tallinn", lat: 59.44, lon: 24.75 },
  { id: "tashkent", name: "Tashkent", country: "Uzbekistan", timeZone: "Asia/Tashkent", lat: 41.3, lon: 69.24 },
  { id: "tbilisi", name: "Tbilisi", country: "Georgia", timeZone: "Asia/Tbilisi", lat: 41.72, lon: 44.79 },
  { id: "tehran", name: "Tehran", country: "Iran", timeZone: "Asia/Tehran", lat: 35.69, lon: 51.39 },
  { id: "tel-aviv", name: "Tel Aviv", country: "Israel", timeZone: "Asia/Jerusalem", lat: 32.09, lon: 34.78 },
  { id: "tepic", name: "Tepic", country: "Mexico", timeZone: "America/Mexico_City", lat: 21.5, lon: -104.89 },
  { id: "thimphu", name: "Thimphu", country: "Bhutan", timeZone: "Asia/Thimphu", lat: 27.47, lon: 89.64 },
  { id: "tokyo", name: "Tokyo", country: "Japan", timeZone: "Asia/Tokyo", lat: 35.68, lon: 139.69 },
  { id: "toronto", name: "Toronto", country: "Canada", timeZone: "America/Toronto", lat: 43.65, lon: -79.38 },
  { id: "tripoli", name: "Tripoli", country: "Libya", timeZone: "Africa/Tripoli", lat: 32.89, lon: 13.19 },
  { id: "tunis", name: "Tunis", country: "Tunisia", timeZone: "Africa/Tunis", lat: 36.81, lon: 10.18 },
  { id: "ulaanbaatar", name: "Ulaanbaatar", country: "Mongolia", timeZone: "Asia/Ulaanbaatar", lat: 47.89, lon: 106.91 },
  { id: "valencia", name: "Valencia", country: "Venezuela", timeZone: "America/Caracas", lat: 10.16, lon: -68.01 },
  { id: "vancouver", name: "Vancouver", country: "Canada", timeZone: "America/Vancouver", lat: 49.28, lon: -123.12 },
  { id: "victoria", name: "Victoria", country: "Seychelles", timeZone: "Indian/Mahe", lat: -4.62, lon: 55.45 },
  { id: "vienna", name: "Vienna", country: "Austria", timeZone: "Europe/Vienna", lat: 48.21, lon: 16.37 },
  { id: "vladivostok", name: "Vladivostok", country: "Russia", timeZone: "Asia/Vladivostok", lat: 43.12, lon: 131.89 },
  { id: "warsaw", name: "Warsaw", country: "Poland", timeZone: "Europe/Warsaw", lat: 52.23, lon: 21.01 },
  { id: "wellington", name: "Wellington", country: "New Zealand", timeZone: "Pacific/Auckland", lat: -41.29, lon: 174.78 },
  { id: "windhoek", name: "Windhoek", country: "Namibia", timeZone: "Africa/Windhoek", lat: -22.56, lon: 17.08 },
  { id: "winnipeg", name: "Winnipeg", country: "Canada", timeZone: "America/Winnipeg", lat: 49.9, lon: -97.14 },
  { id: "yangon", name: "Yangon", country: "Myanmar", timeZone: "Asia/Yangon", lat: 16.87, lon: 96.2 },
  { id: "yekaterinburg", name: "Yekaterinburg", country: "Russia", timeZone: "Asia/Yekaterinburg", lat: 56.84, lon: 60.61 },
  { id: "yerevan", name: "Yerevan", country: "Armenia", timeZone: "Asia/Yerevan", lat: 40.18, lon: 44.51 },
  { id: "zagreb", name: "Zagreb", country: "Croatia", timeZone: "Europe/Zagreb", lat: 45.81, lon: 15.98 },
  { id: "zurich", name: "Zurich", country: "Switzerland", timeZone: "Europe/Zurich", lat: 47.38, lon: 8.54 },
];

// Keep the catalogue alphabetical (case- and accent-insensitive) so the list and
// the search suggestions read in a stable, predictable order.
const COLLATOR = new Intl.Collator("en", { sensitivity: "base", numeric: true });

CITIES.sort((a, b) => COLLATOR.compare(a.name, b.name));

/** The five cities shown by default in the World Time list, in this exact order. */
export const DEFAULT_CITIES: string[] = [
  "los-angeles",
  "new-york",
  "london",
  "dubai",
  "tokyo",
];

const CITY_BY_ID = new Map<string, City>(CITIES.map((city) => [city.id, city]));

/** Look up a city by id. Returns undefined if not found. */
export function getCity(id: string): City | undefined {
  return CITY_BY_ID.get(id);
}

/**
 * Strip diacritics and lowercase, so "sao" finds "São Paulo" and
 * "zurich" finds "Zürich".
 */
function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/**
 * Case-insensitive, accent-insensitive search over city name + country.
 * Returns matches sorted so that names starting with the query come first,
 * then other name matches, then country matches.
 */
export function searchCities(query: string, limit?: number): City[] {
  const needle = fold(query.trim());

  const prefixMatches: City[] = [];
  const nameMatches: City[] = [];
  const countryMatches: City[] = [];

  if (needle.length > 0) {
    for (const city of CITIES) {
      const name = fold(city.name);
      const country = fold(city.country);

      if (name.startsWith(needle)) {
        prefixMatches.push(city);
      } else if (name.includes(needle)) {
        nameMatches.push(city);
      } else if (country.includes(needle)) {
        countryMatches.push(city);
      }
    }
  } else {
    prefixMatches.push(...CITIES);
  }

  const results = [...prefixMatches, ...nameMatches, ...countryMatches];

  return typeof limit === "number" && limit >= 0 ? results.slice(0, limit) : results;
}

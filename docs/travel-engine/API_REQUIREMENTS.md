# HOMI — TRAVEL INTELLIGENCE ENGINE: API REQUIREMENTS & FEASIBILITY AUDIT
*Document Reference: HOMI-TE-API-REQ-V1.0*  
*Target Geography: Varanasi (Kashi), Uttar Pradesh, India (Timezone: Asia/Kolkata, Lat: 25.3176° N, Lng: 82.9739° E)*

---

## 1. AUDIT SUMMARY & INTEGRATION STRATEGY

To elevate HOMI from an informational city guide to a **real-world travel execution planner**, the platform requires specialized intelligence covering:
1. Exact astronomical solar timing (dawn, sunrise, sunset, dusk) computed for specific calendar travel dates.
2. Real-time and forecasted outdoor weather conditions (cloud cover, fog/visibility, rain) affecting sunrise photography and walking comfort.
3. Multi-modal door-to-door routing distinguishing road travel from pedestrian-only medieval lane approaches.
4. Source-based transport cost calculation (cabs, auto-rickshaws, e-rickshaws, wooden bajra boats) with transparent reliability indicators.
5. Operating hours validation and kitchen closure buffers for local eateries.
6. Hotel geographic logistics comparing morning departure times, cab fares, and walking requirements.

### Integration Hierarchy & Classification

| Service Domain | Primary Provider | Integration Mode | Priority | Key Dependency |
| :--- | :--- | :--- | :--- | :--- |
| **Astronomical Solar Engine** | NOAA Standard Algorithm (Jean Meeus) | In-Engine TypeScript Service | **Required** | None (100% Offline / Local Math) |
| **Pedestrian Lane Gateway Model** | Varanasi Urban Geo-Fencing Engine | In-Engine TypeScript Model | **Required** | None (Curated Local Knowledge) |
| **Transport Fare Calculation** | UP RTA Official Tariff & Rate Model | In-Engine Tariff Engine | **Required** | Source-backed tariffs |
| **Itinerary Timeline & Validation** | HOMI Time-Chain Validator | In-Engine Core Service | **Required** | None (Deterministic logic) |
| **Weather & Visibility Forecast** | Open-Meteo Weather Forecast API | HTTP Client with Fallback | **Recommended** | Free open API (No key needed) |
| **Turn-by-Turn Routing** | Google Maps Platform Routes API | Server/Client HTTP Service | **Recommended** | `VITE_GOOGLE_ROUTES_API_KEY` |
| **Places & Operating Hours** | Google Places API (New) | Server/Client HTTP Service | **Recommended** | `VITE_GOOGLE_PLACES_API_KEY` |
| **Ride-Hailing Live APIs** | Uber / Ola Rides API | Commercial Partner Program | **Restricted** | Enterprise Partnership Approval |
| **Live Hotel Inventory** | Amadeus / Booking.com API | Commercial Partner Program | **Optional** | Partner Affiliate Credentials |

---

## 2. DETAILED API RESEARCH & TECHNICAL EVALUATIONS

---

### API 1: Local Astronomical Solar Engine (NOAA Solar Calculation Method)
- **1. Provider & Official Name**: National Oceanic and Atmospheric Administration (NOAA) / Jean Meeus Astronomical Algorithms (implemented in `src/services/astronomyService.ts`).
- **2. Exact Capability Needed**: Calculate exact astronomical dawn, nautical dawn, civil dawn, solar sunrise, solar transit (noon), solar sunset, and dusk for any given calendar date and geographic coordinate in the `Asia/Kolkata` time zone.
- **3. Official Documentation URL**: `https://gml.noaa.gov/grad/solcalc/solareqns.PDF`
- **4. Returned Data**: ISO timestamps and formatted local times (`HH:mm`) for all solar twilight and elevation phases, solar elevation angle, and golden hour intervals.
- **5. Coverage & Limitations in India**: 100% global precision within ±1 minute. Does not require network access; fully operational offline.
- **6. Account / Key Required**: None. Self-contained mathematical library.
- **7. Usage & Billing**: 100% Free, zero runtime cost.
- **8. Rate Limits & Attribution**: Unlimited calls. Attribution: NOAA Solar Calculator algorithms.
- **9. Caching & Storage**: Deterministic; calculations can be stored indefinitely or cached in memory per date/city.
- **10. Integration Architecture**: Client-side TypeScript calculation module.
- **11. Environment Variable**: None required.
- **12. Verification Test**: Test with Varanasi coordinates (`25.3176, 82.9739`) for Winter Solstice, Summer Solstice, and Equinox against US Naval Observatory (USNO) reference tables.
- **Classification**: **Required**.

---

### API 2: Open-Meteo Weather Forecast API
- **1. Provider & Official Name**: Open-Meteo GmbH — Weather Forecast API.
- **2. Exact Capability Needed**: Hourly and daily weather forecast data: temperature, apparent temperature, precipitation probability, rain millimeters, cloud cover percentage, visibility in meters, and wind speed for Varanasi.
- **3. Official Documentation URL**: `https://open-meteo.com/en/docs`
- **4. Returned Data**: JSON payload containing `hourly.time`, `hourly.cloudcover`, `hourly.visibility`, `hourly.precipitation_probability`, `hourly.temperature_2m`, and `hourly.weathercode`.
- **5. Coverage & Limitations in India**: Excellent coverage via high-resolution GFS (Global Forecast System) and ECMWF (European Centre for Medium-Range Weather Forecasts) numerical weather models covering South Asia. Accurate up to 7–14 days in advance. Beyond 14 days, seasonal historical averages are used.
- **6. Account / Key Required**: No API key required for non-commercial and moderate use (up to 10,000 requests/day). Commercial paid tier available for enterprise SLA.
- **7. Usage & Billing**: Free tier ($0) for standard applications.
- **8. Rate Limits & Attribution**: Max 10,000 calls/day. Attribution required: "Weather data by Open-Meteo.com (CC BY 4.0)".
- **9. Caching & Storage**: Caching allowed. HOMI caches weather responses for 3 hours per coordinate to prevent redundant requests.
- **10. Integration Architecture**: Client-side HTTP client with defensive timeout (5s) and automatic fallback to seasonal climate profiles.
- **11. Environment Variable**: `VITE_OPEN_METEO_API_URL` (Defaults to `https://api.open-meteo.com/v1/forecast`).
- **12. Verification Test**: HTTP GET request to `https://api.open-meteo.com/v1/forecast?latitude=25.3176&longitude=82.9739&hourly=temperature_2m,cloudcover,visibility,precipitation_probability&timezone=Asia%2FKolkata`.
- **Classification**: **Recommended**.

---

### API 3: Google Maps Platform Routes API
- **1. Provider & Official Name**: Google Cloud Platform — Routes API (New).
- **2. Exact Capability Needed**: Computing multi-modal route distance, duration in traffic, turn-by-turn road polyline, walking route distance, two-wheeler mode, and distance matrix comparison across multiple origins/destinations.
- **3. Official Documentation URL**: `https://developers.google.com/maps/documentation/routes`
- **4. Returned Data**: `routes[].distanceMeters`, `routes[].duration`, `routes[].staticDuration`, `routes[].polyline.encodedPolyline`, `routes[].legs[].steps`.
- **5. Coverage & Limitations in India**: Best-in-class Indian road network and live traffic data. Major limitation in Varanasi: motorized vehicles cannot physically enter Godowlia, Dashashwamedh, or Manikarnika pedestrian zones; standard driving directions attempt to route cars down 1.2-meter wide stone alleys. HOMI solves this by segmenting routes at verified vehicle drop-off hubs.
- **6. Account / Key Required**: Google Cloud account with active billing; Routes API enabled in Google Cloud Console.
- **7. Usage & Billing**: 
  - Routes: Compute Routes (Basic): $5.00 per 1,000 requests.
  - Routes: Compute Routes (Advanced - Traffic aware): $10.00 per 1,000 requests.
  - Google Cloud provides a $200 monthly free tier credit (~20,000 advanced route calls).
- **8. Rate Limits & Attribution**: Standard QPS limit 600 requests/minute. Attribution: Google Maps logo required when displaying route polylines.
- **9. Caching & Storage**: Google Maps Platform terms prohibit caching lat/lng coordinates or route polylines for more than 30 consecutive calendar days. Temporary session caching for routing results is permitted.
- **10. Integration Architecture**: Proxied through client service with field masking (`X-Goog-FieldMask: routes.duration,routes.distanceMeters`) to minimize payload and cost.
- **11. Environment Variable**: `VITE_GOOGLE_ROUTES_API_KEY`.
- **12. Verification Test**: POST request to `https://routes.googleapis.com/directions/v2:computeRoutes` with origin hotel and destination drop-off point.
- **Fallback**: Haversine distance with calibrated road winding factor (1.35x for Varanasi outer roads, 1.6x for pedestrian alleys) and speed calibration (20 km/h urban cab, 12 km/h auto-rickshaw, 4.2 km/h walking).
- **Classification**: **Recommended**.

---

### API 4: Google Places API (New)
- **1. Provider & Official Name**: Google Cloud Platform — Places API (New).
- **2. Exact Capability Needed**: Place ID resolution, live opening hours (`regularOpeningHours`, `currentOpeningHours`), price level, and business status (`OPERATIONAL`, `CLOSED_TEMPORARILY`).
- **3. Official Documentation URL**: `https://developers.google.com/maps/documentation/places/web-service`
- **4. Returned Data**: `places[].displayName`, `places[].regularOpeningHours.periods`, `places[].currentOpeningHours.openNow`, `places[].formattedAddress`, `places[].location`.
- **5. Coverage & Limitations in India**: Extensive coverage across restaurants, temples, and shops in Varanasi. Limitations: smaller street food stalls (e.g. roadside Malaiyo vendors in Chaukhamba) often lack official Google Places records or have community-edited hours that do not reflect seasonal morning dew schedules (6:00 AM – 9:30 AM).
- **6. Account / Key Required**: Google Cloud Billing account; Places API (New) enabled.
- **7. Usage & Billing**:
  - Place Details (Basic): $17.00 per 1,000 requests.
  - Place Details (Enterprise with Opening Hours): $25.00 per 1,000 requests.
- **8. Rate Limits & Attribution**: Standard Google QPS limits. Must show "Powered by Google" attribution when place details are shown.
- **9. Caching & Storage**: Google Places Terms prohibit storing Place Details (except `place_id`) indefinitely. Temporary in-memory session caching permitted.
- **10. Integration Architecture**: Fetch only requested fields via `X-Goog-FieldMask: id,displayName,currentOpeningHours,regularOpeningHours`.
- **11. Environment Variable**: `VITE_GOOGLE_PLACES_API_KEY`.
- **12. Verification Test**: GET request for `places/ChIJ-b5uPzHhjjkRVYn5Y5s8Z_0` (Kashi Vishwanath).
- **Classification**: **Recommended**.

---

### API 5: Ride-Hailing Live Pricing APIs (Uber / Ola)
- **1. Provider & Official Name**: Uber Rides API / Ola Cabs Developer API.
- **2. Exact Capability Evaluated**: Real-time upfront ride price estimates (`/v1.2/estimates/price`) and product categories (UberGo, UberAuto, Ola Mini).
- **3. Official Documentation URL**: `https://developer.uber.com/docs/riders/references/api/v1.2/estimates-price-get`
- **4. Returned Data**: `estimate`, `low_estimate`, `high_estimate`, `currency_code`, `duration`.
- **5. Coverage & Limitations in India**: Both Uber and Ola operate cab and auto fleets in Varanasi. **Critical Restriction**: Uber restricted third-party access to its Ride Estimates and Request APIs in recent developer platform updates. New access requires an enterprise partnership agreement and commercial approval. Furthermore, aggregator/comparison use is expressly restricted in standard terms.
- **6. Account / Key Required**: Restricted Enterprise Developer Partner Program approval.
- **7. Usage & Billing**: Subject to custom commercial partnership terms.
- **8. Rate Limits & Attribution**: Strictly gated.
- **9. Caching & Storage**: Real-time estimates expire after 2–5 minutes; caching long-term is prohibited.
- **10. Integration Architecture**: Server-side OAuth 2.0 gateway required if approved.
- **11. Environment Variable**: `UBER_CLIENT_ID`, `UBER_CLIENT_SECRET`.
- **12. Verification Test**: Partner sandbox endpoint ping.
- **HOMI Strategic Strategy**: Because public ride-hailing APIs are restricted, HOMI does **not** make misleading claims of live Uber/Ola feeds without approval. Instead, HOMI implements an authoritative **Source-Based Transport Cost Engine** based on:
  - Uttar Pradesh Regional Transport Authority (RTA Varanasi) official metered auto tariffs: Base ₹25 (first 1.5 km) + ₹10/km thereafter.
  - E-Rickshaw shared arterial route tariffs: ₹10 – ₹20 flat per zone.
  - Private Cab (Hatchback/Sedan) standard commercial tariffs: ₹120 base fare + ₹14–₹18/km + peak morning buffer.
  - Hand-rowed wooden Bajra boat tariffs: ₹150–₹250/person shared, ₹800–₹1,200 private.
  - Every quote is explicitly stamped with its status: `SOURCE_BASED_ESTIMATE` or `INDICATIVE_ESTIMATE`.
- **Classification**: **Restricted** (Enterprise Partner).

---

### API 6: Accommodation & Bed Bank APIs
- **1. Provider & Official Name**: Amadeus for Developers (Hotel Search API v3) / Booking.com Affiliate API.
- **2. Exact Capability Needed**: Date-specific room rates, available room inventory, check-in policies, and cancellation conditions.
- **3. Official Documentation URL**: `https://developers.amadeus.com/self-service/category/hotels`
- **4. Returned Data**: Hotel ID, name, coordinates, available room types, nightly rate, taxes, and amenities.
- **5. Coverage & Limitations in India**: Excellent coverage of branded 3–5 star hotels in Varanasi (Taj Ganges, BrijRama Palace, Radisson). Limited API inventory for authentic heritage havelis and family homestays along the ghats.
- **6. Account / Key Required**: Amadeus Self-Service API Key & Secret (Free tier: 2,000 monthly transactions); Booking.com Partner Programme approval.
- **7. Usage & Billing**: Amadeus self-service is free up to 2,000 calls/month, then €0.003/request.
- **8. Rate Limits & Attribution**: Standard rate limits; affiliate attribution required.
- **9. Caching & Storage**: Pricing cannot be stored longer than 24 hours.
- **10. Integration Architecture**: Server-side proxy with API secret.
- **11. Environment Variable**: `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`.
- **Classification**: **Optional** (Valuable for booking integration; baseline logistics can be calculated from verified property locations and indicative ranges).

---

## 3. SUMMARY CLASSIFICATION TABLE

| Integration | Capability | Status / Access | Key Required |
| :--- | :--- | :--- | :--- |
| **NOAA Astronomical Engine** | Sunrise/sunset/dawn/dusk for any date | **Required** | None (Built-in) |
| **Varanasi Pedestrian Lane Hub Model** | Vehicle drop-off vs walking segmentation | **Required** | None (Built-in) |
| **Transport Tariff & Cost Engine** | Transparent per-leg transport fares | **Required** | None (Built-in UP RTA Model) |
| **Itinerary Time-Chain Validator** | Chronological and opening-hour validation | **Required** | None (Built-in) |
| **Open-Meteo Weather API** | Cloud cover, visibility, rain forecast | **Recommended** | None (Open REST endpoint) |
| **Google Routes API** | Traffic-aware driving & walking routes | **Recommended** | `VITE_GOOGLE_ROUTES_API_KEY` |
| **Google Places API** | Dynamic venue hours & open status | **Recommended** | `VITE_GOOGLE_PLACES_API_KEY` |
| **Uber / Ola API** | Real-time live cab quotes | **Restricted** | Enterprise Partner Agreement |
| **Amadeus Hotel API** | Live room rates & booking inventory | **Optional** | Partner API Key & Secret |

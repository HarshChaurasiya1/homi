# HOMI — API USAGE, COST CONTROL & DATA REFRESH PLAN
*Document Reference: HOMI-TE-COST-V1.0*  
*Date: October 2026*

---

## 1. TYPICAL USER SESSION USAGE PROFILE

To prevent runaway billing and avoid degrading mobile performance, HOMI models API consumption against a **Typical Active Traveler Session**:

| User Action | Provider / Endpoint | Calls Per Session | Billable Cost (Per 1k calls) | Session Cost Estimate | Caching Strategy |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **City View & Sunrise Timing** | Local NOAA Astronomical Engine | 1–3 | $0.00 (Local) | $0.00 | Permanent in-memory calculation |
| **Weather & Visibility Check** | Open-Meteo Forecast API | 1 | $0.00 (Free Tier) | $0.00 | Cached for 3 hours per coordinate |
| **Itinerary Generation (Routes)** | Google Routes API (ComputeRoutes) | 3–5 | $5.00 / 1,000 | $0.015 – $0.025 | Cached in `sessionStorage` for 1 hour |
| **Place & Hours Verification** | Google Places API (New Details) | 2–4 | $17.00 / 1,000 | $0.034 – $0.068 | Cached in memory for active session |
| **Transport Fare Calculation** | UP RTA Local Tariff Engine | 4–6 | $0.00 (Local) | $0.00 | Instant deterministic calculation |
| **Hotel Logistics Comparison** | HOMI Geometry & Transit Engine | 1–2 | $0.00 (Local) | $0.00 | Instant deterministic calculation |
| **Total Per User Session** | — | **12–21 ops** | — | **$0.049 – $0.093** | Under Google $200 free tier |

With Google Cloud's complimentary **$200 monthly credit**, HOMI can support approximately **2,500–3,500 complete multi-day itinerary generations per month** at zero net hosting cost.

---

## 2. REFRESH INTERVALS & CACHING COMPLIANCE

| Data Domain | Storage Medium | Max Cache Duration | Compliance Justification |
| :--- | :--- | :---: | :--- |
| **Astronomical Calculations** | In-Memory (Global LRU) | Indefinite (Deterministic) | Mathematics derived from orbital mechanics; never stale. |
| **Weather Forecasts** | Local Storage / Session Cache | 3 Hours | Matches atmospheric model run updates (ECMWF/GFS cycle). |
| **Route Distance & Duration** | Session Storage (`sessionStorage`) | 1 Hour | Google Maps Terms permit temporary session caching; prevents redundant calls when user toggles tabs. |
| **Place Opening Hours** | In-Memory (React Query / Hook) | Active Session Only | Google Places Terms forbid permanent caching of place details; ensures live status is validated. |
| **Transport Tariffs** | Curated Data Files (`tariffs.ts`) | 90 Days | Government and RTA metered tariffs change infrequently; reviewed quarterly. |
| **Hotel Logistics** | Curated Data Files (`hotels.ts`) | 30 Days | Property locations, pedestrian lane accessibility, and baseline price tiers. |

---

## 3. DEFENSIVE ENGINEERING MEASURES

1. **Field Masking**:
   - Every Google Routes request includes `X-Goog-FieldMask: routes.duration,routes.distanceMeters,routes.description`. This cuts response payload by 85% compared to requesting full polylines and step maneuvers.
   - Every Places API request specifies only `id,displayName,currentOpeningHours,regularOpeningHours,priceLevel`.
2. **Debounced User Inputs**:
   - Changing departure times or dates debounces API dispatches by 400ms to eliminate intermediate requests while typing.
3. **Session Rate Limiter**:
   - Caps live routing API calls to a maximum of 25 calls per user per day. Once the threshold is reached, HOMI smoothly transitions to the calibrated local routing model with an informative badge.
4. **Graceful Network Offline Fallback**:
   - If the user loses internet connection while exploring Varanasi's ghats, all astronomical calculations, offline routing, and source-based transport tariffs remain fully operational.

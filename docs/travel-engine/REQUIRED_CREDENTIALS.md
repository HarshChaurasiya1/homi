# HOMI — REQUIRED CREDENTIALS & INTEGRATION REQUEST
*Document Reference: HOMI-TE-CRED-V1.0*  
*Date: October 2026*

This document outlines the exact credentials required for optional and recommended external integrations. 

> [!IMPORTANT]
> **Zero-Blocked Architecture**: HOMI is architected so that the entire core travel intelligence engine (astronomical sunrise/sunset timing, weather forecasting, pedestrian approach segmentation, transport fare estimation, operating-hours validation, and hotel logistics comparison) **functions immediately out of the box** using built-in deterministic algorithms and open public endpoints. 
> External API keys elevate baseline calculations to live traffic-aware routing and live business hours verification.

---

## CONSOLIDATED CREDENTIAL SPECIFICATION TABLE

| Field | 1. Google Maps Platform: Routes API | 2. Google Maps Platform: Places API (New) | 3. Open-Meteo Weather API | 4. Amadeus for Developers (Hotels) |
| :--- | :--- | :--- | :--- | :--- |
| **API / Provider** | Google Cloud — Routes API | Google Cloud — Places API (New) | Open-Meteo GmbH — Weather API | Amadeus IT Group — Hotel Search v3 |
| **Purpose** | Live traffic-aware driving duration and walking routes | Live venue opening hours & business status | Real-time weather, visibility & cloud cover | Live date-specific room rates & inventory |
| **Priority** | **Recommended** | **Recommended** | **Recommended** (No key required) | **Optional** |
| **Account Setup Link** | [Google Cloud Console](https://console.cloud.google.com/) | [Google Cloud Console](https://console.cloud.google.com/) | [Open-Meteo API](https://open-meteo.com/) (No signup required for standard tier) | [Amadeus Developer Portal](https://developers.amadeus.com/register) |
| **APIs to Enable** | `Routes API` | `Places API (New)` | Standard REST endpoint | `Hotel List API`, `Hotel Search API` |
| **Billing Requirement** | Requires Google Cloud billing account. Includes $200 monthly free credit (~20k route calls). | Shares Google Cloud billing account with Routes API. | No billing account needed up to 10k daily calls. | Free test tier provides 2,000 calls/month; billing needed for production. |
| **Key Restrictions** | Restrict to HTTP referrers (e.g. `localhost:3000/*`, `*.homi.travel/*`) and API restriction: `Routes API`. | Restrict to HTTP referrers and API restriction: `Places API (New)`. | None. | Server-side API Secret (never expose on frontend). |
| **Environment Variable** | `VITE_GOOGLE_ROUTES_API_KEY` | `VITE_GOOGLE_PLACES_API_KEY` | `VITE_OPEN_METEO_API_URL` (optional custom host) | `AMADEUS_CLIENT_ID`<br>`AMADEUS_CLIENT_SECRET` |
| **Verification Test** | Direct `curl` or automated test suite POST to `https://routes.googleapis.com/directions/v2:computeRoutes`. | Direct GET request to `https://places.googleapis.com/v1/places/ChIJ-b5uPzHhjjkRVYn5Y5s8Z_0`. | Direct GET request to `https://api.open-meteo.com/v1/forecast?latitude=25.3176&longitude=82.9739`. | OAuth token generation via `POST https://test.api.amadeus.com/v1/security/oauth2/token`. |
| **Fallback if Unavailable** | Calibrated Haversine distance with road curvature factor (1.35x outer road, 1.6x old city lane) + speed curves. Marked as `SOURCE_BASED_ESTIMATE`. | Curated verified places database with verification timestamps (`lastVerifiedAt: 2024-10-14`). Marked as `DATED_OBSERVATION`. | Built-in seasonal Varanasi climatological profile (winter mist, monsoon, summer heat). Marked as `SEASONAL_CLIMATE_MODEL`. | Verified property baseline inventory ranges and indicative nightly rates. Marked as `INDICATIVE_ESTIMATE`. |

---

## ENVIRONMENT VARIABLE CONFIGURATION TEMPLATE (`.env.example`)

Copy the template below to `.env` in the project root:

```bash
# ==============================================================================
# HOMI TRAVEL INTELLIGENCE ENGINE — ENVIRONMENT CONFIGURATION
# ==============================================================================

# Google Maps Platform (Optional/Recommended for Live Traffic & Dynamic Hours)
# Get your key at: https://console.cloud.google.com/
VITE_GOOGLE_ROUTES_API_KEY=
VITE_GOOGLE_PLACES_API_KEY=

# Open-Meteo Weather API (Optional custom endpoint; defaults to public open API)
VITE_OPEN_METEO_API_URL=https://api.open-meteo.com/v1/forecast

# Amadeus Hospitality API (Optional for Live Room Booking Inventory)
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=
```

import React from 'react'

export type TravelEmblemType =
  | 'express-1day'
  | 'weekend-2day'
  | 'classic-3day'
  | 'explorer-4day'
  | 'budget-tier'
  | 'moderate-tier'
  | 'premium-tier'
  | 'solo-wanderer'
  | 'friends-gang'
  | 'family-kids'
  | 'couple-romance'

interface TravelEmblemProps {
  type: TravelEmblemType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Authentic Handcrafted Travel Emblems
 * Replaces childish emoji placeholders with authentic Indian architectural,
 * astronomical, and cartographic insignia.
 */
export const TravelEmblem: React.FC<TravelEmblemProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  const dimensions = {
    sm: { box: 28, svg: 18 },
    md: { box: 40, svg: 24 },
    lg: { box: 52, svg: 32 },
  }[size]

  // Color schemes and SVG graphics tailored for each real concept
  switch (type) {
    // -------------------------------------------------------------------------
    // 1 DAY: DAWN HORIZON & SUNRISE TRAIL (Replaces lightning bolt ⚡)
    // -------------------------------------------------------------------------
    case 'express-1day':
      return (
        <div
          className={`inline-flex items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-105 ${className}`}
          style={{
            width: dimensions.box,
            height: dimensions.box,
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1.5px solid #FDBA74',
            boxShadow: '0 1px 3px rgba(234, 88, 12, 0.12)',
          }}
          aria-hidden="true"
        >
          <svg
            width={dimensions.svg}
            height={dimensions.svg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EA580C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Rising dawn sun */}
            <circle cx="12" cy="12" r="4" fill="#FDBA74" fillOpacity="0.4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
            {/* Speed path curve */}
            <path d="M8 15c2-1 4-1 8 0" stroke="#C2410C" strokeWidth="1.5" />
          </svg>
        </div>
      )

    // -------------------------------------------------------------------------
    // 2 DAYS: HERITAGE GATEWAY & ARCH (Replaces balloon 🎈)
    // -------------------------------------------------------------------------
    case 'weekend-2day':
      return (
        <div
          className={`inline-flex items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-105 ${className}`}
          style={{
            width: dimensions.box,
            height: dimensions.box,
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1.5px solid #93C5FD',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.12)',
          }}
          aria-hidden="true"
        >
          <svg
            width={dimensions.svg}
            height={dimensions.svg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Scalloped Indian Gateway Arch */}
            <path d="M4 21V10C4 6 7 4 12 2C17 4 20 6 20 10V21" />
            <path d="M8 21V13C8 10 10 9 12 7C14 9 16 10 16 13V21" fill="#93C5FD" fillOpacity="0.3" />
            <path d="M2 21h20" />
            <circle cx="12" cy="5" r="1" fill="#1D4ED8" />
          </svg>
        </div>
      )

    // -------------------------------------------------------------------------
    // 3 DAYS: NAVIGATIONAL COMPASS ROSE (Replaces yellow star 🌟)
    // -------------------------------------------------------------------------
    case 'classic-3day':
      return (
        <div
          className={`inline-flex items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-105 ${className}`}
          style={{
            width: dimensions.box,
            height: dimensions.box,
            background: 'linear-gradient(135deg, #FEFCE8 0%, #FEF08A 100%)',
            border: '1.5px solid #EAB308',
            boxShadow: '0 1px 4px rgba(202, 138, 4, 0.18)',
          }}
          aria-hidden="true"
        >
          <svg
            width={dimensions.svg}
            height={dimensions.svg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A16207"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Brass Astrolabe Outer Ring */}
            <circle cx="12" cy="12" r="9" />
            {/* 4 Cardinal Diamond Points */}
            <polygon
              points="12,4 14.5,12 12,20 9.5,12"
              fill="#CA8A04"
              stroke="#A16207"
              strokeWidth="1.5"
            />
            <polygon
              points="4,12 12,9.5 20,12 12,14.5"
              fill="#EAB308"
              stroke="#A16207"
              strokeWidth="1.5"
            />
            <circle cx="12" cy="12" r="2" fill="#713F12" />
          </svg>
        </div>
      )

    // -------------------------------------------------------------------------
    // 4+ DAYS: CARTOGRAPHIC SCROLL & MOUNTAIN TRAIL (Replaces emoji map 🗺️)
    // -------------------------------------------------------------------------
    case 'explorer-4day':
      return (
        <div
          className={`inline-flex items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-105 ${className}`}
          style={{
            width: dimensions.box,
            height: dimensions.box,
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            border: '1.5px solid #86EFAC',
            boxShadow: '0 1px 3px rgba(22, 163, 74, 0.12)',
          }}
          aria-hidden="true"
        >
          <svg
            width={dimensions.svg}
            height={dimensions.svg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#15803D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Unfurled parchment map */}
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" fill="#86EFAC" fillOpacity="0.25" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
            {/* Explorer Waypoint Marker */}
            <circle cx="12" cy="11" r="2" fill="#15803D" />
          </svg>
        </div>
      )

    // -------------------------------------------------------------------------
    // BUDGET TIER: HANDCRAFTED BRASS RUPEE TOKEN (Replaces coin 🪙)
    // -------------------------------------------------------------------------
    case 'budget-tier':
      return (
        <div
          className={`inline-flex items-center justify-center rounded-xl shrink-0 ${className}`}
          style={{
            width: dimensions.box,
            height: dimensions.box,
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            border: '1.5px solid #F59E0B',
          }}
          aria-hidden="true"
        >
          <svg
            width={dimensions.svg}
            height={dimensions.svg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#92400E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8 8h8" />
            <path d="M8 12h6" />
            <path d="M12 8c2.5 0 3.5 1.5 3.5 3s-1.5 3-3.5 3" />
            <path d="m11 15 4 4" />
          </svg>
        </div>
      )

    // -------------------------------------------------------------------------
    // MODERATE TIER: HERITAGE HAVELI & VERANDAH (Replaces cup ☕)
    // -------------------------------------------------------------------------
    case 'moderate-tier':
      return (
        <div
          className={`inline-flex items-center justify-center rounded-xl shrink-0 ${className}`}
          style={{
            width: dimensions.box,
            height: dimensions.box,
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1.5px solid #FB923C',
          }}
          aria-hidden="true"
        >
          <svg
            width={dimensions.svg}
            height={dimensions.svg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9A3412"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21h18" />
            <path d="M5 21V9l7-5 7 5v12" fill="#FED7AA" fillOpacity="0.4" />
            <path d="M9 21v-5a3 3 0 0 1 6 0v5" />
            <circle cx="12" cy="9" r="1.5" fill="#9A3412" />
          </svg>
        </div>
      )

    // -------------------------------------------------------------------------
    // ROYAL LUXURY TIER: SHAHI CHHATRI & CREST (Replaces crown 👑)
    // -------------------------------------------------------------------------
    case 'premium-tier':
      return (
        <div
          className={`inline-flex items-center justify-center rounded-xl shrink-0 ${className}`}
          style={{
            width: dimensions.box,
            height: dimensions.box,
            background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
            border: '1.5px solid #C084FC',
          }}
          aria-hidden="true"
        >
          <svg
            width={dimensions.svg}
            height={dimensions.svg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B21A8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" fill="#E9D5FF" fillOpacity="0.5" />
            <circle cx="12" cy="3" r="1" fill="#6B21A8" />
            <circle cx="5" cy="3" r="1" fill="#6B21A8" />
            <circle cx="19" cy="3" r="1" fill="#6B21A8" />
          </svg>
        </div>
      )

    // -------------------------------------------------------------------------
    // SOLO WANDERER (Replaces backpack 🎒)
    // -------------------------------------------------------------------------
    case 'solo-wanderer':
      return (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Solo Explorer</span>
        </span>
      )

    // -------------------------------------------------------------------------
    // FRIENDS GANG (Replaces party popper 🎉)
    // -------------------------------------------------------------------------
    case 'friends-gang':
      return (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Friends Gang</span>
        </span>
      )

    // -------------------------------------------------------------------------
    // FAMILY & KIDS (Replaces family emoji 👨‍👩‍👧‍👦)
    // -------------------------------------------------------------------------
    case 'family-kids':
      return (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M12 3 4 9v12h16V9l-8-6Z" />
            <path d="M9 14h6" />
          </svg>
          <span>Family & Kids</span>
        </span>
      )

    // -------------------------------------------------------------------------
    // COUPLE ROMANCE (Replaces sparkling heart 💖)
    // -------------------------------------------------------------------------
    case 'couple-romance':
      return (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span>Couples Romance</span>
        </span>
      )

    default:
      return null
  }
}

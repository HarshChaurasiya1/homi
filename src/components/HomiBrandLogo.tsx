import React from 'react'

interface HomiBrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  markOnly?: boolean
  className?: string
  showTagline?: boolean
}

/**
 * Authentic Brand Insignia for HOMI
 * Features an authentic Indian architectural jharokha arch framing a golden dawn sun
 * and sacred river/stone threshold, embodying "Every city feels like home."
 */
export const HomiBrandLogo: React.FC<HomiBrandLogoProps> = ({
  size = 'md',
  markOnly = false,
  className = '',
  showTagline = true,
}) => {
  const pixelDimensions = {
    sm: { icon: 28, text: 'text-xl', tagline: 'text-[9px]' },
    md: { icon: 34, text: 'text-2xl sm:text-3xl', tagline: 'text-xs' },
    lg: { icon: 44, text: 'text-3xl sm:text-4xl', tagline: 'text-sm' },
  }[size]

  const emblem = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-xs transition-transform duration-300 group-hover:scale-105 ${
        size === 'sm' ? 'w-7 h-7' : size === 'md' ? 'w-9 h-9' : 'w-11 h-11'
      }`}
      style={{
        background: 'linear-gradient(145deg, #8C2D19 0%, #6E1F0F 100%)',
        boxShadow: '0 2px 8px rgba(140, 45, 25, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
      }}
      aria-hidden="true"
    >
      <svg
        width={pixelDimensions.icon}
        height={pixelDimensions.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#FAF7F2]"
      >
        {/* Subtle background golden aura */}
        <circle cx="20" cy="18" r="10" fill="#E67E22" fillOpacity="0.25" />

        {/* Heritage Jharokha Scalloped Gateway Outer Rim */}
        <path
          d="M7 34V22C7 16 11 12 15 13C17 9 23 9 25 13C29 12 33 16 33 22V34"
          stroke="#F2ECE1"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Mehrab / Trefoil Arch Cut */}
        <path
          d="M11 34V23C11 18.5 14 15 17 16C18.5 13.5 21.5 13.5 23 16C26 15 29 18.5 29 23V34"
          stroke="#F7D08A"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Radiant Dawn Sun within Arch */}
        <circle cx="20" cy="22" r="4.2" fill="#F7D08A" />

        {/* Golden Sun Rays */}
        <line x1="20" y1="14" x2="20" y2="16" stroke="#F7D08A" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="14.5" y1="16.5" x2="16" y2="18" stroke="#F7D08A" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25.5" y1="16.5" x2="24" y2="18" stroke="#F7D08A" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="13" y1="22" x2="14.5" y2="22" stroke="#F7D08A" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="27" y1="22" x2="25.5" y2="22" stroke="#F7D08A" strokeWidth="1.2" strokeLinecap="round" />

        {/* Welcoming River & Stepped Stone Ghat Threshold */}
        <path
          d="M6 34H34"
          stroke="#F2ECE1"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10 37H30"
          stroke="#E67E22"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )

  if (markOnly) {
    return <span className={`inline-flex items-center ${className}`}>{emblem}</span>
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {emblem}
      <div className="flex flex-col">
        <span
          className={`font-editorial font-bold tracking-tight text-[#201C1A] leading-none group-hover:text-[#8C2D19] transition-colors ${pixelDimensions.text}`}
        >
          HOMI
        </span>
        {showTagline && (
          <span
            className={`font-sans uppercase tracking-widest font-semibold text-[#7D736A] leading-tight mt-0.5 ${pixelDimensions.tagline}`}
          >
            Every city feels like home
          </span>
        )}
      </div>
    </div>
  )
}

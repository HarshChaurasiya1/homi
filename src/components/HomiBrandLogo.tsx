import React from 'react'

interface HomiBrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  markOnly?: boolean
  className?: string
  showTagline?: boolean
  taglineText?: string
}

/**
 * Modern, Iconic Brand Insignia for HOMI
 * Features a modern travel gateway beacon with an energetic golden dawn sunrise / flame spark,
 * paired with bold, crisp grotesque typography and clean single-line tagline.
 */
export const HomiBrandLogo: React.FC<HomiBrandLogoProps> = ({
  size = 'md',
  markOnly = false,
  className = '',
  showTagline = true,
  taglineText = 'Travel with a Local',
}) => {
  const pixelDimensions = {
    sm: { icon: 28, text: 'text-lg', tagline: 'text-[9px]' },
    md: { icon: 34, text: 'text-xl sm:text-2xl', tagline: 'text-[10px]' },
    lg: { icon: 44, text: 'text-2xl sm:text-3xl', tagline: 'text-xs' },
  }[size]

  const emblem = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-sm shadow-indigo-300/40 transition-transform duration-300 group-hover:scale-105 ${
        size === 'sm' ? 'w-7 h-7' : size === 'md' ? 'w-9 h-9' : 'w-11 h-11'
      }`}
      style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)',
      }}
      aria-hidden="true"
    >
      {/* Subtle top-left glass highlight shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />

      <svg
        width={pixelDimensions.icon}
        height={pixelDimensions.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Outer Minimalist Gateway & Compass Arch */}
        <path
          d="M10 32V18C10 12.4772 14.4772 8 20 8C25.5228 8 30 12.4772 30 18V32"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Threshold Portal Arch */}
        <path
          d="M14.5 32V21C14.5 17.9624 16.9624 15.5 20 15.5C23.0376 15.5 25.5 17.9624 25.5 21V32"
          stroke="#DDD6FE"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glowing Golden Dawn Sun / Flame Spark */}
        <circle cx="20" cy="22" r="4.2" fill="url(#sunGlowGrad)" />

        {/* Radiant Apex Compass Beam */}
        <path
          d="M20 5.5L21.5 8L20 7L18.5 8L20 5.5Z"
          fill="#FDE047"
        />

        {/* Clean Ground Threshold Step */}
        <line
          x1="8"
          y1="32"
          x2="32"
          y2="32"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="sunGlowGrad" x1="16" y1="18" x2="24" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )

  if (markOnly) {
    return <span className={`inline-flex items-center ${className}`}>{emblem}</span>
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {emblem}
      <div className="flex flex-col justify-center leading-none">
        {/* Brand Name with Electric Accent Dot */}
        <span
          className={`font-editorial font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center leading-none ${pixelDimensions.text}`}
        >
          HOMI
          <span className="text-indigo-600 font-black">.</span>
        </span>

        {/* Well-written, single-line clean subtext that NEVER wraps into vertical clutter */}
        {showTagline && (
          <span
            className={`font-sans font-semibold text-slate-500 tracking-tight whitespace-nowrap mt-1 leading-none ${pixelDimensions.tagline}`}
          >
            {taglineText}
          </span>
        )}
      </div>
    </div>
  )
}
export default HomiBrandLogo

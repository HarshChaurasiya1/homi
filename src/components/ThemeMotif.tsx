import React from 'react'

export type MotifVariant = 
  | 'jharokha-scallop'
  | 'mewar-arch-lake'
  | 'himalayan-pine'
  | 'ganga-diya-ghat'
  | 'misty-pine-ridge'
  | 'mughal-arch'

interface MotifProps {
  type: MotifVariant
  className?: string
  width?: number
  height?: number
}

export const ThemeMotif: React.FC<MotifProps> = ({
  type,
  className = 'text-stone-300 opacity-60',
  width = 64,
  height = 64,
}) => {
  // 1. Jaipur: Jharokha Scalloped Arch
  if (type === 'jharokha-scallop') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M12 95 V55 C12 45 16 40 24 40 C28 35 34 30 42 32 C46 22 54 22 58 32 C66 30 72 35 76 40 C84 40 88 45 88 55 V95"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 95 V60 C24 50 30 46 38 48 C44 40 56 40 62 48 C70 46 76 50 76 60 V95"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        <circle cx="50" cy="18" r="3" fill="currentColor" />
      </svg>
    )
  }

  // 2. Udaipur: Lake Pichola Shimmer & Mewar Marble Arch
  if (type === 'mewar-arch-lake') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Mewari royal scalloped dome */}
        <path
          d="M16 75 V48 C16 32 32 20 50 10 C68 20 84 32 84 48 V75"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="8" r="3" fill="currentColor" />
        {/* Gentle lake ripple reflections below */}
        <path
          d="M10 82 C22 79 36 85 50 82 C64 79 78 85 90 82"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M18 90 C28 88 38 92 50 90 C62 88 72 92 82 90"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
      </svg>
    )
  }

  // 3. Manali: Snow-capped Himalayan Ridge & Deodar Pine
  if (type === 'himalayan-pine') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Mountain peak */}
        <path
          d="M15 90 L50 25 L85 90"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Snow cap chevron */}
        <path
          d="M38 46 L50 38 L62 46"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Deodar Pine silhouette */}
        <path
          d="M50 48 L42 58 H58 L50 48 Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path
          d="M50 56 L38 68 H62 L50 56 Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path
          d="M50 66 L34 80 H66 L50 66 Z"
          fill="currentColor"
          fillOpacity="0.5"
        />
        <line x1="50" y1="80" x2="50" y2="92" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }

  // 4. Varanasi: Sacred Floating Ganga Diya & Temple Bells
  if (type === 'ganga-diya-ghat') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Sacred flame */}
        <path
          d="M50 14 C46 24 40 28 40 36 C40 43 45 47 50 47 C55 47 60 43 60 36 C60 28 54 24 50 14 Z"
          fill="currentColor"
          fillOpacity="0.6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Brass earthen diya bowl */}
        <path
          d="M20 54 Q50 78 80 54 Q50 64 20 54 Z"
          fill="currentColor"
          fillOpacity="0.4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Ghat stepped water ripples */}
        <path
          d="M15 72 H85"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M25 82 H75"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M35 92 H65"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  // 5. Mussoorie: Misty Mountain Ridge & Colonial Pine Walk
  if (type === 'misty-pine-ridge') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Rolling hill contours of Landour */}
        <path
          d="M8 70 C24 52 42 62 60 48 C74 38 86 42 94 48"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M8 82 C30 68 50 78 72 66 C82 60 90 64 94 68"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        {/* Heritage colonial lantern */}
        <path
          d="M50 20 V38 M44 38 H56 L54 52 H46 L44 38 Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="18" r="3" fill="currentColor" />
        <path
          d="M47 43 H53"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    )
  }

  // Default / Mughal Arch (Delhi)
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 95 V50 C10 25 35 15 50 5 C65 15 90 25 90 50 V95"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="5" r="3" fill="currentColor" />
    </svg>
  )
}

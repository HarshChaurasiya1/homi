import React from 'react'

interface MotifProps {
  type: 'mughal-arch' | 'jharokha-scallop'
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
  if (type === 'mughal-arch') {
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
        {/* Mughal pointed keystone arch with delicate finial */}
        <path
          d="M10 95 V50 C10 25 35 15 50 5 C65 15 90 25 90 50 V95"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 95 V52 C22 34 38 25 50 16 C62 25 78 34 78 52 V95"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <circle cx="50" cy="5" r="3" fill="currentColor" />
        <path d="M50 20 V35" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }

  // Jharokha Scalloped Arch (Jaipur Rajput architectural motif)
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
      {/* 9-foiled Rajasthani cusped arch */}
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

/**
 * HOMI Design System & City Theme Definitions
 * Centralized design tokens and city-specific art direction palettes.
 */

export interface CityTheme {
  id: 'delhi' | 'jaipur'
  displayName: string
  subtitle: string
  bgPrimary: string
  bgSurface: string
  bgSubtle: string
  borderSubtle: string
  textPrimary: string
  textMuted: string
  accentPrimary: string
  accentSecondary: string
  accentSandstone: string
  tagBg: string
  tagText: string
  buttonPrimaryBg: string
  buttonPrimaryText: string
  cardBorder: string
  badgeBg: string
  badgeText: string
  motifType: 'mughal-arch' | 'jharokha-scallop'
}

export const CITY_THEMES: Record<'delhi' | 'jaipur', CityTheme> = {
  delhi: {
    id: 'delhi',
    displayName: 'Old & New Delhi',
    subtitle: 'Mughal sandstone, quiet monuments, bustling lanes, and winter chai.',
    bgPrimary: '#F9F6F0',
    bgSurface: '#FFFFFF',
    bgSubtle: '#F2ECE1',
    borderSubtle: '#E5DACB',
    textPrimary: '#221F1C',
    textMuted: '#6E665E',
    accentPrimary: '#8C2D19', // Deep Mughal terracotta red
    accentSecondary: '#D97706', // Warm marigold
    accentSandstone: '#B88E6D', // Red fort / Qutub sandstone
    tagBg: '#F5EBE6',
    tagText: '#7A2211',
    buttonPrimaryBg: '#8C2D19',
    buttonPrimaryText: '#FFFFFF',
    cardBorder: '#EFE7DA',
    badgeBg: '#F3E8DC',
    badgeText: '#662211',
    motifType: 'mughal-arch',
  },
  jaipur: {
    id: 'jaipur',
    displayName: 'The Pink City',
    subtitle: 'Dusty rose facades, ornate jharokhas, royal courtyards, and sunlit forts.',
    bgPrimary: '#FCF7F4',
    bgSurface: '#FFFFFF',
    bgSubtle: '#F7EDE7',
    borderSubtle: '#ECD7CE',
    textPrimary: '#271F1D',
    textMuted: '#716360',
    accentPrimary: '#C85A32', // Terracotta rose
    accentSecondary: '#E67E22', // Restrained saffron
    accentSandstone: '#D4A373', // Aravalli sandstone
    tagBg: '#FBECE6',
    tagText: '#9E3C1B',
    buttonPrimaryBg: '#C85A32',
    buttonPrimaryText: '#FFFFFF',
    cardBorder: '#F0DFD8',
    badgeBg: '#F9E4DB',
    badgeText: '#873216',
    motifType: 'jharokha-scallop',
  },
}

export const GLOBAL_TOKENS = {
  fontFamily: {
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  maxWidth: 'max-w-6xl',
  transition: 'transition-all duration-200 ease-out',
}

/**
 * HOMI Design System & City Theme Definitions
 * Bespoke art direction, color palettes, and cultural identities for the 5 selected pilot cities.
 */

export type SupportedCityThemeId = 'jaipur' | 'udaipur' | 'manali' | 'varanasi' | 'mussoorie' | 'delhi'

export interface CityTheme {
  id: SupportedCityThemeId
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
  motifType: 'jharokha-scallop' | 'mewar-arch-lake' | 'himalayan-pine' | 'ganga-diya-ghat' | 'misty-pine-ridge' | 'mughal-arch'
  tastePillBg: string
  tastePillText: string
}

export const CITY_THEMES: Record<string, CityTheme> = {
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
    tastePillBg: '#FDF0EA',
    tastePillText: '#A73F1C',
  },
  udaipur: {
    id: 'udaipur',
    displayName: 'The City of Lakes',
    subtitle: 'White marble palaces, shimmering Pichola waters, royal courtyards, and sunset boat rides.',
    bgPrimary: '#F4F8FA',
    bgSurface: '#FFFFFF',
    bgSubtle: '#EBF2F6',
    borderSubtle: '#D3E2EC',
    textPrimary: '#15242E',
    textMuted: '#4F6370',
    accentPrimary: '#1B4965', // Deep Mewar lake blue
    accentSecondary: '#C99700', // Sunlit royal gold
    accentSandstone: '#62B6CB', // Lake ripple azure
    tagBg: '#E7F2F8',
    tagText: '#133D55',
    buttonPrimaryBg: '#1B4965',
    buttonPrimaryText: '#FFFFFF',
    cardBorder: '#D8E5EE',
    badgeBg: '#E2EEF5',
    badgeText: '#133B51',
    motifType: 'mewar-arch-lake',
    tastePillBg: '#E8F3FA',
    tastePillText: '#134663',
  },
  manali: {
    id: 'manali',
    displayName: 'The Valley of the Gods',
    subtitle: 'Towering deodars, snowy Himalayan ridges, Beas river rapids, and woodfired mountain cafes.',
    bgPrimary: '#F4F7F4',
    bgSurface: '#FFFFFF',
    bgSubtle: '#EAF0EA',
    borderSubtle: '#D2DDD2',
    textPrimary: '#172719',
    textMuted: '#4C5F4E',
    accentPrimary: '#1E4620', // Alpine pine forest green
    accentSecondary: '#D4821E', // Cedar amber honey
    accentSandstone: '#4C7C59', // Mountain moss green
    tagBg: '#E6EFE6',
    tagText: '#1B401D',
    buttonPrimaryBg: '#1E4620',
    buttonPrimaryText: '#FFFFFF',
    cardBorder: '#D7E2D7',
    badgeBg: '#E2EBE2',
    badgeText: '#173619',
    motifType: 'himalayan-pine',
    tastePillBg: '#E7F0E7',
    tastePillText: '#19421B',
  },
  varanasi: {
    id: 'varanasi',
    displayName: 'The City of Light (Kashi)',
    subtitle: 'Ancient riverbank ghats, evening brass Ganga Aarti, labyrinthine silk galis, and timeless dawn chants.',
    bgPrimary: '#FBF6EE',
    bgSurface: '#FFFFFF',
    bgSubtle: '#F4EDE0',
    borderSubtle: '#E7D8C4',
    textPrimary: '#2B1A14',
    textMuted: '#68544C',
    accentPrimary: '#9B2226', // Sacred temple vermilion
    accentSecondary: '#D97706', // Ganga aarti brass diya flame
    accentSandstone: '#BB3E03', // River ghat brick
    tagBg: '#FCEFE8',
    tagText: '#871C1F',
    buttonPrimaryBg: '#9B2226',
    buttonPrimaryText: '#FFFFFF',
    cardBorder: '#EFE2D3',
    badgeBg: '#F8E7DC',
    badgeText: '#771518',
    motifType: 'ganga-diya-ghat',
    tastePillBg: '#FBECE5',
    tastePillText: '#8A1E21',
  },
  mussoorie: {
    id: 'mussoorie',
    displayName: 'The Queen of the Hills',
    subtitle: 'Misty deodar ridges, colonial Landour bakehouses, mountain winterline sunsets, and Tibetan trails.',
    bgPrimary: '#F6F7F9',
    bgSurface: '#FFFFFF',
    bgSubtle: '#EDEFF3',
    borderSubtle: '#D7DCE4',
    textPrimary: '#1A232E',
    textMuted: '#526070',
    accentPrimary: '#2E4057', // Landour twilight mist slate
    accentSecondary: '#D08C51', // Chestnut & warm bakery cinnamon
    accentSandstone: '#597081', // Doon valley haze
    tagBg: '#E8ECF2',
    tagText: '#233245',
    buttonPrimaryBg: '#2E4057',
    buttonPrimaryText: '#FFFFFF',
    cardBorder: '#DCE1E9',
    badgeBg: '#E3E7EF',
    badgeText: '#202D3E',
    motifType: 'misty-pine-ridge',
    tastePillBg: '#E7ECF3',
    tastePillText: '#26374C',
  },
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
    accentPrimary: '#8C2D19',
    accentSecondary: '#D97706',
    accentSandstone: '#B88E6D',
    tagBg: '#F5EBE6',
    tagText: '#7A2211',
    buttonPrimaryBg: '#8C2D19',
    buttonPrimaryText: '#FFFFFF',
    cardBorder: '#EFE7DA',
    badgeBg: '#F3E8DC',
    badgeText: '#662211',
    motifType: 'mughal-arch',
    tastePillBg: '#F7EDE7',
    tastePillText: '#7D2211',
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

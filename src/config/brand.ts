/**
 * HOMI Brand Configuration
 * Central brand settings for easy customization and global rebranding.
 */
export interface BrandConfig {
  name: string
  tagline: string
  subtagline: string
  description: string
  mission: string
  curatorNote: string
  pilotCities: Array<{ id: string; name: string; state: string }>
  footerLinks: {
    about: string
    curators: string
    howWeVerify: string
    privacy: string
    terms: string
    contact: string
  }
  contactEmail: string
  builtIn: string
}

export const BRAND: BrandConfig = {
  name: 'HOMI',
  tagline: 'Every city feels like home.',
  subtagline: 'Explore India with the depth and warmth of a knowledgeable local friend.',
  description:
    'A thoughtfully curated, lightweight Indian travel discovery platform. Authentic neighborhood walks, verified heritage secrets, street food legends, and realistic itineraries.',
  mission:
    'No tourist traps, no paid algorithmic rankings, no bloated dashboards. Just honest, verified travel guidance crafted for real explorers.',
  curatorNote:
    'All monument timings, entry tariffs, and public transport connections are verified against official tourism authorities (ASI, DMRC, RTDC) and local ground checks.',
  pilotCities: [
    { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
    { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan' },
    { id: 'manali', name: 'Manali', state: 'Himachal Pradesh' },
    { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh' },
    { id: 'mussoorie', name: 'Mussoorie', state: 'Uttarakhand' },
  ],

  footerLinks: {
    about: '/#about',
    curators: '/#curators',
    howWeVerify: '/#verification',
    privacy: '/#privacy',
    terms: '/#terms',
    contact: 'mailto:namaste@homitravel.in',
  },
  contactEmail: 'namaste@homitravel.in',
  builtIn: 'Crafted with pride in India',
}

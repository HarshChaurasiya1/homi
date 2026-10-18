import type { CityInfo } from './types'


export const CITIES: Record<string, CityInfo> = {
  delhi: {
    id: 'delhi',
    name: 'Delhi',
    hindiName: 'दिल्ली',
    state: 'National Capital Territory',
    tagline: 'Seven historical cities in one living, breathing metropolis.',
    heroDescription:
      'From red sandstone Mughal bastions and sufiana shrines to tree-lined colonial avenues and vibrant refugee bazaars, Delhi rewards travelers who look beyond the rush.',
    curatorNote:
      'Delhi is best navigated via its world-class Metro network. Early mornings (7:00 AM – 9:30 AM) are pure magic at monuments and parks before daytime crowds arrive.',
    bestSeason: 'October to March (crisp winters and blooming gardens)',
    idealDays: 3,
    vibeSummary: 'Monuments bathed in golden light, aroma of cardamom chai, lively bazaars, and quiet heritage gardens.',
    localEtiquetteTip:
      'Dress modestly when visiting mosques and gurudwaras (head coverings required at Jama Masjid and Bangla Sahib). Remove footwear outside sanctums.',
    transportTip:
      'Purchase a Delhi Metro Smart Card or use the DMRC Travel app for QR ticketing. It saves 10-20% and avoids long token queues.',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Humayuns Tomb Delhi with lush Mughal gardens and sandstone dome',
    themeClass: 'theme-delhi',
  },
  jaipur: {
    id: 'jaipur',
    name: 'Jaipur',
    hindiName: 'जयपुर',
    state: 'Rajasthan',
    tagline: 'The pink city of Rajput kings, artisans, and sunlit forts.',
    heroDescription:
      'Planned in 1727 with ancient Vastu Shastra principles, Jaipur is a city of terracotta-hued facades, ornate jharokhas, hilltop battlements, and timeless artisan traditions.',
    curatorNote:
      'Consider buying the Rajasthan Tourism Composite Ticket at your first monument (Amer or Hawa Mahal) if you plan to visit multiple state-run heritage sites.',
    bestSeason: 'October to March (pleasant sunshine, cool desert evenings)',
    idealDays: 2,
    vibeSummary: 'Dusty rose walls, brass handicrafts, swirling block prints, hot pyaaz kachoris, and hilltop sunsets.',
    localEtiquetteTip:
      'Polite bargaining is customary in Bapu and Johari Bazaars, but always maintain a warm, friendly demeanor with craftsmen.',
    transportTip:
      'The Jaipur Metro connects the railway station to Badi Chaupar (right at Hawa Mahal). For hilltop forts like Amer and Nahargarh, book a verified app-cab or day auto.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Hawa Mahal Palace of Winds in Jaipur Pink City with intricate jharokha windows',
    themeClass: 'theme-jaipur',
  },
}

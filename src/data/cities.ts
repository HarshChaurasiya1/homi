import type { CityInfo } from './types'

export const CITIES: Record<string, CityInfo> = {
  jaipur: {
    id: 'jaipur',
    name: 'Jaipur',
    hindiName: 'जयपुर',
    state: 'Rajasthan',
    tagline: 'The pink city of Rajput kings, artisans, and sunlit forts.',
    heroDescription:
      'Planned in 1727 with ancient Vastu Shastra principles, Jaipur is an open-air museum of terracotta-hued facades, ornate jharokhas, hilltop battlements, and timeless artisan traditions.',
    curatorNote:
      'Consider buying the Rajasthan Tourism Composite Ticket at your first monument (Amer or Hawa Mahal) if you plan to visit multiple state-run heritage sites.',
    bestSeason: 'October to March (pleasant sunshine, cool desert evenings)',
    idealDays: 3,
    vibeSummary: 'Dusty rose walls, brass handicrafts, swirling block prints, hot pyaaz kachoris, and hilltop sunsets.',
    localEtiquetteTip:
      'Polite bargaining is customary in Bapu and Johari Bazaars, but always maintain a warm, respectful demeanor with master craftsmen.',
    transportTip:
      'The Jaipur Metro connects the railway station to Badi Chaupar (right at Hawa Mahal). For hilltop forts like Amer and Nahargarh, book a verified app-cab or day auto.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Hawa Mahal Palace of Winds in Jaipur Pink City with intricate jharokha windows',
    themeClass: 'theme-jaipur',
    tasteOfCity: {
      headline: 'Crisp Kachoris, Royal Ghewar & Kulhad Chai',
      flavors: ['Caramelized spiced onion', 'Desi ghee rabdi', 'Cardamom saffron'],
      signatureDish: 'Rawat Pyaaz Kachori & Paneer Ghewar',
      famousEatery: 'Rawat Mishthan Bhandar & LMB Johari Bazaar',
    },
  },

  udaipur: {
    id: 'udaipur',
    name: 'Udaipur',
    hindiName: 'उदयपुर',
    state: 'Rajasthan',
    tagline: 'The romantic Venice of the East, wrapped in shimmering lakes and white marble.',
    heroDescription:
      'Founded in 1559 by Maharana Udai Singh II, Udaipur reflects pure Mewar romance. Shimmering Lake Pichola reflects white marble palaces, island pavilions, and purple Aravalli peaks bathed in twilight.',
    curatorNote:
      'Always schedule a boat ride from Rameshwar Ghat to Jag Mandir during the 5:00 PM sunset golden hour when City Palace glows like liquid gold.',
    bestSeason: 'September to March (post-monsoon lakes are full, pleasant breezy days)',
    idealDays: 3,
    vibeSummary: 'Lakeside ghat bells, quiet wooden boat ripples, miniature Mewar paintings, rooftop candlelit dining, and serene palace courtyards.',
    localEtiquetteTip:
      'Remove shoes before walking onto sacred ghat steps like Ambrai and Gangaur Ghat. Respect pilgrims performing evening prayers.',
    transportTip:
      'The old city surrounding Lake Pichola has narrow cobbled alleys where cars cannot enter. Walk or use authorized blue city e-autos.',
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Lake Pichola Udaipur with City Palace reflecting in the water at sunset',
    themeClass: 'theme-udaipur',
    tasteOfCity: {
      headline: 'Desi Ghee Dal Baati, Mewari Ker Sangri & Hari Mirch Vada',
      flavors: ['Smoky woodfired baati', 'Panchmel lentils', 'Spicy green chilli bite'],
      signatureDish: 'Traditional Mewari Thali with Churma',
      famousEatery: 'Krishna Dal Bati Restro & Ambrai by the Lake',
    },
  },

  manali: {
    id: 'manali',
    name: 'Manali',
    hindiName: 'मनाली',
    state: 'Himachal Pradesh',
    tagline: 'Snowy Himalayan summits, deodar woods, and cozy riverside trails.',
    heroDescription:
      'Perched at 2,050 meters at the northern end of the Kullu Valley, Manali blends ancient wooden pagoda temples, roaring Beas river torrents, apple orchards, and a legendary bohemian cafe trail in Old Manali.',
    curatorNote:
      'Skip the crowded Mall Road; spend your mornings walking the stone paths of Old Manali and cedar-scented trails of Hadimba Forest.',
    bestSeason: 'October to February for snow; March to June for crisp mountain escapes and blooming apple blossoms',
    idealDays: 4,
    vibeSummary: 'Crisp pine scent, woodfire smoke in frosty air, river stones, warm handknitted Kullu shawls, and quiet mountain contemplation.',
    localEtiquetteTip:
      'Do not litter on mountain trails or in the Beas riverbed. Always walk clockwise around sacred wooden deodar temple sanctums.',
    transportTip:
      'Local auto-rickshaws have fixed rate union stands. For Solang Valley, Rohtang Pass, or Sethan, hire authorized 4x4 mountain taxis.',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Snow capped Himalayan mountains in Manali with pine deodar trees',
    themeClass: 'theme-manali',
    tasteOfCity: {
      headline: 'Steaming Himachali Siddu, Mountain Trout & Wild Apple Jam',
      flavors: ['Fermented wheat bread & ghee', 'Herb-roasted trout', 'Seabuckthorn tea'],
      signatureDish: 'Himachali Siddu with pure walnut chutney & desi ghee',
      famousEatery: 'Cafe 1947 & Old Manali Village Kitchens',
    },
  },

  varanasi: {
    id: 'varanasi',
    name: 'Varanasi',
    hindiName: 'वाराणसी',
    state: 'Uttar Pradesh',
    tagline: 'The eternal City of Light where life, death, and devotion dance upon the Ganga.',
    heroDescription:
      'Mark Twain noted Varanasi is older than history, older than tradition, older even than legend. Its 84 stone ghats witness thousands of years of uninterrupted morning prayers, Sanskrit chants, and the cosmic evening Ganga Aarti.',
    curatorNote:
      'Hire a hand-rowed wooden boat at Assi Ghat at 5:30 AM for Subah-e-Banaras. The morning mist rising over ancient palaces is an unforgettable spiritual sight.',
    bestSeason: 'October to March (cool river breezes, winter morning mist, and festival aartis)',
    idealDays: 3,
    vibeSummary: 'Resonating brass bells, fragrant marigold garlands, sacred incense, boat oars slicing holy water, and timeless narrow alleys.',
    localEtiquetteTip:
      'Photography is strictly prohibited at Manikarnika and Harishchandra burning ghats out of respect for bereaved families.',
    transportTip:
      'The ancient riverside is completely pedestrian. Wear sturdy slip-on walking shoes. Electric e-rickshaws operate on outer boulevard arteries.',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Ancient stone ghats of Varanasi on river Ganges with morning boats and temples',
    themeClass: 'theme-varanasi',
    tasteOfCity: {
      headline: 'Frothy Malaiyo Cloud, Tangy Tamatar Chaat & Sweet Banarasi Paan',
      flavors: ['Dew-condensed saffron foam', 'Spicy hing tomato mash', 'Sweet gulkand paan'],
      signatureDish: 'Kashi Tamatar Chaat & Winter Malaiyo',
      famousEatery: 'Kashi Chaat Bhandar & Keshav Tambool Bhandar',
    },
  },

  mussoorie: {
    id: 'mussoorie',
    name: 'Mussoorie',
    hindiName: 'मसूरी',
    state: 'Uttarakhand',
    tagline: 'The Queen of the Hills, misty deodar ridges, and literary Landour secrets.',
    heroDescription:
      'Established in the 1820s amidst the Garhwal Himalayas, Mussoorie charms with quiet colonial stone cottages, Ruskin Bond literary lore, the famous Winterline horizon, and historic bakeries hidden under deodar canopies in Landour.',
    curatorNote:
      'Head straight up to Landour (Upper Mussoorie). The 3.5 km loop from Char Dukan around Lal Tibba offers total peace far away from the Mall Road crowd.',
    bestSeason: 'March to June for pleasant weather; November to January for crystal-clear Himalayan views and the rare atmospheric Winterline',
    idealDays: 3,
    vibeSummary: 'Misty pine ridges, freshly baked cinnamon rolls, historic tin roofs, Tibetan prayer flags, and evening valley lights below.',
    localEtiquetteTip:
      'Landour is a quiet, historic cantonment town. Keep vehicle honking to an absolute minimum and respect the quiet mountain sanctity.',
    transportTip:
      'Fly into Dehradun Jolly Grant Airport or take the Vande Bharat to Dehradun Station. Hire an authorized hill cab for the 34 km scenic climb.',
    heroImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Misty green pine hills and valley view of Mussoorie and Landour',
    themeClass: 'theme-mussoorie',
    tasteOfCity: {
      headline: 'Fresh Apple Pie, Char Dukan Butter Omelettes & Spicy Tingmo',
      flavors: ['Cinnamon & roasted walnuts', 'Amul butter crisp toast', 'Garlicky Tibetan momos'],
      signatureDish: 'Sticky Toffee Pudding & Landour Apple Crepes',
      famousEatery: 'Landour Bakehouse & Char Dukan Anil’s Cafe',
    },
  },

  delhi: {
    id: 'delhi',
    name: 'Delhi',
    hindiName: 'दिल्ली',
    state: 'National Capital Territory',
    tagline: 'Seven historical cities in one living, breathing metropolis.',
    heroDescription:
      'From red sandstone Mughal bastions and sufiana shrines to tree-lined colonial avenues and vibrant refugee bazaars, Delhi rewards travelers who look beyond the rush.',
    curatorNote:
      'Delhi is best navigated via its world-class Metro network. Early mornings (7:00 AM – 9:30 AM) are pure magic at monuments and parks.',
    bestSeason: 'October to March (crisp winters and blooming gardens)',
    idealDays: 3,
    vibeSummary: 'Monuments bathed in golden light, aroma of cardamom chai, lively bazaars, and quiet heritage gardens.',
    localEtiquetteTip:
      'Dress modestly when visiting mosques and gurudwaras (head coverings required at Jama Masjid and Bangla Sahib).',
    transportTip:
      'Purchase a Delhi Metro Smart Card or use the DMRC Travel app for QR ticketing. It saves 10-20% and avoids queues.',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Humayuns Tomb Delhi with lush Mughal gardens and sandstone dome',
    themeClass: 'theme-delhi',
    tasteOfCity: {
      headline: 'Dark Pindi Chole Bhature, Slow-cooked Nihari & Butter Chicken',
      flavors: ['Pomegranate dried anardana', 'Tandoori woodsmoke', 'Cardamom saunth'],
      signatureDish: 'Sita Ram Chole Bhature & Old Delhi Nihari',
      famousEatery: 'Sita Ram Diwan Chand & Karim’s Jama Masjid',
    },
  },
}

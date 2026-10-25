/**
 * HOMI Verified City Flowcharts
 * Real-world step-by-step visual itineraries with transit connections,
 * decision branches, local insider tips, and OpenStreetMap coordinates.
 */

export interface FlowchartNode {
  id: string
  stepNumber: number
  timeRange: string
  title: string
  subtitle: string
  description: string
  category:
    | 'dawn_sunrise'
    | 'heritage'
    | 'food_chai'
    | 'bazaar_crafts'
    | 'sunset'
    | 'evening_aarti'
    | 'night_supper'
  locationName: string
  durationMinutes: number
  costEstimateInr: number | 'Free'
  travelerSuitability: ('solo' | 'couple' | 'friends' | 'family')[]
  transitToNext?: {
    mode: 'walk' | 'rickshaw' | 'boat' | 'cab'
    modeLabel: string
    distanceMeters: number
    durationMinutes: number
    laneNote?: string
  }
  localProTip: string
  imageUrl: string
  osmCoordinates: [number, number] // [lat, lng]
  branchId?: 'main' | 'branch_a' | 'branch_b'
}

export interface CityFlowchart {
  cityId: string
  cityName: string
  editionTitle: string
  tagline: string
  heroImage: string
  heroImageAlt: string
  bestSeason: string
  idealStay: string
  startingGateway: string
  curatorName: string
  curatorBadge: string
  nodes: FlowchartNode[]
  branchDecision?: {
    decisionTime: string
    prompt: string
    branchA: {
      id: 'branch_a'
      title: string
      badge: string
      nodes: FlowchartNode[]
    }
    branchB: {
      id: 'branch_b'
      title: string
      badge: string
      nodes: FlowchartNode[]
    }
  }
}

export const CITY_FLOWCHARTS: Record<string, CityFlowchart> = {
  jaipur: {
    cityId: 'jaipur',
    cityName: 'Jaipur',
    editionTitle: 'Jaipur Edition',
    tagline: 'Terracotta arches, hilltop battlements, and steaming kulhad chai.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Hawa Mahal Palace of Winds in Jaipur Pink City with intricate jharokha windows',
    bestSeason: 'October – March (Winter Sunshine)',
    idealStay: '2 – 3 Days Exploration',
    startingGateway: 'Badi Chaupar Metro & Vehicle Barrier',
    curatorName: 'Aapke Bhaisaab',
    curatorBadge: 'Pink City Elder Brother',
    nodes: [
      {
        id: 'jp-node-1',
        stepNumber: 1,
        timeRange: '07:30 AM – 08:45 AM',
        title: 'Hawa Mahal Dawn Facade & Rooftop Tea',
        subtitle: 'Palace of Winds in morning golden glow',
        description:
          'Arrive at Badi Chaupar before the city wakes. The 953 honeycombed jharokha windows glow brilliant pink in the early morning sun.',
        category: 'dawn_sunrise',
        locationName: 'Hawa Mahal, Badi Chaupar',
        durationMinutes: 75,
        costEstimateInr: 'Free',
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'rickshaw',
          modeLabel: 'E-Rickshaw via Station Road',
          distanceMeters: 2800,
          durationMinutes: 12,
          laneNote: 'Take an e-rickshaw through Ajmeri Gate directly to Rawat.',
        },
        localProTip:
          'Bhaisaab Tip: Stand across the street on the Wind View Cafe balcony for the iconic straight-angle photo without traffic.',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [26.9239, 75.8267],
      },
      {
        id: 'jp-node-2',
        stepNumber: 2,
        timeRange: '09:00 AM – 09:45 AM',
        title: 'Rawat Mishthan Bhandar Breakfast',
        subtitle: 'World-famous authentic Pyaaz Kachori',
        description:
          'Feast on Jaipur’s legendary onion kachoris, fried crisp in pure desi ghee with sweet tamarind chutney and piping hot masala chai.',
        category: 'food_chai',
        locationName: 'Station Road, Sindhi Camp',
        durationMinutes: 45,
        costEstimateInr: 120,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'cab',
          modeLabel: 'App Cab or Auto to Amer',
          distanceMeters: 11000,
          durationMinutes: 25,
          laneNote: 'Drive past Jal Mahal lake on the scenic Amer highway.',
        },
        localProTip:
          'Order the fresh Pyaaz Kachori and a plate of warm Paneer Ghewar. Never leave Jaipur without this breakfast!',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [26.9208, 75.7979],
      },
      {
        id: 'jp-node-3',
        stepNumber: 3,
        timeRange: '10:15 AM – 01:15 PM',
        title: 'Amer Fort & Panna Meena Stepwell',
        subtitle: 'Sheesh Mahal mirrors and Rajputana ramparts',
        description:
          'Explore the magnificent yellow sandstone palace, the Hall of Mirrors where a single candle illuminates the entire ceiling, and the ancient stepwell.',
        category: 'heritage',
        locationName: 'Amer, Devisinghpura',
        durationMinutes: 180,
        costEstimateInr: 100,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'rickshaw',
          modeLabel: 'Return to Old City Chowk',
          distanceMeters: 9500,
          durationMinutes: 20,
          laneNote: 'Drop off at Sireh Deori Bazaar gate.',
        },
        localProTip:
          'Buy the Composite Monument Ticket at Amer gate to skip queues at Hawa Mahal and Jantar Mantar.',
        imageUrl: 'https://images.unsplash.com/photo-1603288967389-9e8c465a39dc?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [26.9855, 75.8513],
      },
      {
        id: 'jp-node-4',
        stepNumber: 4,
        timeRange: '05:00 PM – 06:45 PM',
        title: 'Nahargarh Fort Sunset Panorama',
        subtitle: 'Overlook the entire Pink City in twilight gold',
        description:
          'Perch on the edge of the Aravalli hills as the sun sets over Jaipur. Watch the city lights flicker to life while sipping cold drinks at Padao.',
        category: 'sunset',
        locationName: 'Nahargarh Fort Hilltop',
        durationMinutes: 105,
        costEstimateInr: 50,
        travelerSuitability: ['solo', 'couple', 'friends'],
        transitToNext: {
          mode: 'cab',
          modeLabel: 'Hill Descent to Masala Chowk',
          distanceMeters: 8000,
          durationMinutes: 22,
          laneNote: 'Wind down the paved ghat road to Ram Niwas Garden.',
        },
        localProTip:
          'Reach Nahargarh by 5:00 PM sharp to claim a prime ledge before the photography crowd arrives.',
        imageUrl: 'https://images.unsplash.com/photo-1598977123418-454555ac14c2?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [26.9378, 75.8156],
      },
      {
        id: 'jp-node-5',
        stepNumber: 5,
        timeRange: '07:15 PM – 09:00 PM',
        title: 'Masala Chowk & Bapu Bazaar Evening',
        subtitle: 'Open-air culinary courtyard and night shopping',
        description:
          'Conclude the day at Masala Chowk where Jaipur’s best street food masters serve under one courtyard. Taste golgappas, kulfi, and pyaaz pakoras.',
        category: 'night_supper',
        locationName: 'Ram Niwas Garden, C Scheme / Bapu Bazaar',
        durationMinutes: 105,
        costEstimateInr: 250,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        localProTip:
          'Entry ticket is just ₹10. Try stall #12 for authentic Dal Baati and stall #8 for rabdi falooda.',
        imageUrl: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [26.9157, 75.819],
      },
    ],
    branchDecision: {
      decisionTime: '02:00 PM – 04:30 PM (Afternoon Choice)',
      prompt: 'Do you prefer royal architectural science or artisan street shopping?',
      branchA: {
        id: 'branch_a',
        title: 'Royal Heritage & Astronomical Wonders',
        badge: 'Palaces & Science',
        nodes: [
          {
            id: 'jp-branch-a-1',
            stepNumber: 31,
            timeRange: '02:15 PM – 03:30 PM',
            title: 'City Palace Courtyard & Peacock Gate',
            subtitle: 'Pritam Niwas Chowk four seasonal arches',
            description:
              'Stroll the royal courtyards, marvel at the Mubarak Mahal textiles, and photograph the world-famous peacock doorways.',
            category: 'heritage',
            locationName: 'Jalebi Chowk, Pink City',
            durationMinutes: 75,
            costEstimateInr: 300,
            travelerSuitability: ['solo', 'couple', 'family'],
            localProTip: 'The museum holds giant silver urns that carried Gangajal to London in 1902.',
            imageUrl: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=800&q=80',
            osmCoordinates: [26.9258, 75.8237],
          },
          {
            id: 'jp-branch-a-2',
            stepNumber: 32,
            timeRange: '03:45 PM – 04:45 PM',
            title: 'Jantar Mantar UNESCO Observatory',
            subtitle: 'World’s largest stone sundial with 2-second accuracy',
            description:
              'Witness ancient Rajput geometric instruments that measure planetary orbits, local time, and zodiac positions using sunlight.',
            category: 'heritage',
            locationName: 'Opposite City Palace',
            durationMinutes: 60,
            costEstimateInr: 50,
            travelerSuitability: ['solo', 'friends', 'family'],
            localProTip: 'Look at the Brihat Samrat Yantra; you can see the shadow visibly moving in real-time!',
            imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
            osmCoordinates: [26.9248, 75.8246],
          },
        ],
      },
      branchB: {
        id: 'branch_b',
        title: 'Artisan Textile Guilds & Johari Bazaar',
        badge: 'Crafts & Jewellery',
        nodes: [
          {
            id: 'jp-branch-b-1',
            stepNumber: 31,
            timeRange: '02:15 PM – 03:45 PM',
            title: 'Johari Bazaar & Kundan Meenakari Lane',
            subtitle: 'Ancient gemstones, silver work and lac bangles',
            description:
              'Walk the arcade shops of Johari Bazaar. Watch generational jewelers set uncut polki stones and craft vibrant lac bangles.',
            category: 'bazaar_crafts',
            locationName: 'Johari Bazaar Arcade',
            durationMinutes: 90,
            costEstimateInr: 'Free',
            travelerSuitability: ['couple', 'friends', 'family'],
            localProTip: 'Stop at LMB (Laxmi Mishthan Bhandar) midway for chilled Paneer Ghewar.',
            imageUrl: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80',
            osmCoordinates: [26.9205, 75.8258],
          },
          {
            id: 'jp-branch-b-2',
            stepNumber: 32,
            timeRange: '04:00 PM – 04:45 PM',
            title: 'Bapu Bazaar Block-Print & Mojari Walk',
            subtitle: 'Natural indigo quilts and handcrafted camel leather shoes',
            description:
              'Bapu Bazaar is the heart of everyday Pink City shopping. Pick up authentic Bagru block-print cotton and colourful juttis.',
            category: 'bazaar_crafts',
            locationName: 'Bapu Bazaar Pink Arcades',
            durationMinutes: 45,
            costEstimateInr: 'Free',
            travelerSuitability: ['solo', 'friends', 'family'],
            localProTip: 'Polite bargaining of 20-30% is expected, but treat shopkeepers with warm respect.',
            imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
            osmCoordinates: [26.9189, 75.8228],
          },
        ],
      },
    },
  },

  varanasi: {
    cityId: 'varanasi',
    cityName: 'Varanasi',
    editionTitle: 'Varanasi Edition',
    tagline: 'Ancient stone ghats, sunrise boat silence, and evening Vedic fires.',
    heroImage: '/assets/cities/varanasi/ghats/dashashwamedh-evening-aarti-wide.webp',
    heroImageAlt: 'Dashashwamedh Ghat Ganga Aarti with brass lamps and riverboats in Varanasi',
    bestSeason: 'October – March (Misty Ganga Dawns)',
    idealStay: '2 – 3 Days Exploration',
    startingGateway: 'Godowlia Crossing Vehicle Barrier',
    curatorName: 'Aapke Guru Ji',
    curatorBadge: 'Kashi Ghat Elder',
    nodes: [
      {
        id: 'vn-node-1',
        stepNumber: 1,
        timeRange: '05:30 AM – 07:15 AM',
        title: 'Assi Ghat Subah-e-Banaras Boat Ride',
        subtitle: 'Watch morning mist rise off the sacred Ganga',
        description:
          'Witness dawn Vedic chants, morning yoga on the stone platform, and take a gentle wooden rowing boat as dawn light paints the 84 ghats in gold.',
        category: 'dawn_sunrise',
        locationName: 'Assi Ghat Riverfront',
        durationMinutes: 105,
        costEstimateInr: 250,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'walk',
          modeLabel: 'Pedestrian Lane Walk',
          distanceMeters: 300,
          durationMinutes: 5,
          laneNote: 'Walk directly up the Assi Ghat stairs to Pehlwan Lassi corner.',
        },
        localProTip:
          'Hire a manual wooden rowing boat, not a noisy diesel motorboat. The silence of wooden oars touching the holy Ganga is unforgettable.',
        imageUrl: '/assets/cities/varanasi/ghats/assi-ghat-morning-boats.webp',
        osmCoordinates: [25.2884, 83.0062],
      },
      {
        id: 'vn-node-2',
        stepNumber: 2,
        timeRange: '07:30 AM – 08:30 AM',
        title: 'Pehlwan Lassi & Ram Bhandar Kachori',
        subtitle: 'Clay kulhad malai lassi & asafoetida pumpkin curry',
        description:
          'Start your food trail with a thick earthenware cup of curd topped with clotted malai and rabdi, followed by piping hot round kachoris.',
        category: 'food_chai',
        locationName: 'Assi Chowk & Thatheri Bazaar',
        durationMinutes: 60,
        costEstimateInr: 90,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'rickshaw',
          modeLabel: 'E-Rickshaw to Maidagin Gate',
          distanceMeters: 3800,
          durationMinutes: 18,
          laneNote: 'Take an e-rickshaw to Maidagin for the easiest entry to the corridor.',
        },
        localProTip:
          'Ram Bhandar kachoris sell out by 10:30 AM daily. Reach early for the freshest, crispiest batch.',
        imageUrl: '/assets/cities/varanasi/food-and-sweets/ram-bhandar-kachori-jalebi.webp',
        osmCoordinates: [25.3094, 75.0062],
      },
      {
        id: 'vn-node-3',
        stepNumber: 3,
        timeRange: '09:00 AM – 11:30 AM',
        title: 'Shri Kashi Vishwanath Golden Corridor',
        subtitle: 'Ancient Jyotirlinga and Chunar sandstone promenade',
        description:
          'Walk the newly opened grand corridor connecting the sacred golden-spired Shiva shrine directly to the Ganga riverfront at Manikarnika Ghat.',
        category: 'heritage',
        locationName: 'Vishwanath Corridor Gate 4, Chowk',
        durationMinutes: 150,
        costEstimateInr: 'Free',
        travelerSuitability: ['solo', 'couple', 'family'],
        transitToNext: {
          mode: 'walk',
          modeLabel: 'Old City Alley Walk',
          distanceMeters: 450,
          durationMinutes: 7,
          laneNote: 'Wander through the shaded labyrinth of Kachori Gali.',
        },
        localProTip:
          'Phones and leather goods are not allowed inside. Use the free official digital lockers at Gate 4.',
        imageUrl: '/assets/cities/varanasi/temples-and-heritage/kashi-vishwanath-golden-spire.webp',
        osmCoordinates: [25.3109, 83.0107],
      },
      {
        id: 'vn-node-4',
        stepNumber: 4,
        timeRange: '05:30 PM – 07:15 PM',
        title: 'Dashashwamedh Ghat Grand Ganga Aarti',
        subtitle: 'Seven Vedic priests hoisting blazing brass lamps',
        description:
          'The spiritual climax of Varanasi. As dusk falls, thousands gather on steps and boats to witness synchronized Vedic chants, conch blowing, and celestial fire.',
        category: 'evening_aarti',
        locationName: 'Dashashwamedh Ghat Riverfront',
        durationMinutes: 105,
        costEstimateInr: 'Free',
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'walk',
          modeLabel: 'Walk to Godowlia Chowk',
          distanceMeters: 380,
          durationMinutes: 6,
          laneNote: 'Follow the illuminated pedestrian lane past Ram Bhandar.',
        },
        localProTip:
          'Arrive by 5:45 PM to sit on the middle stone steps, or book a boat anchored in front of the platform.',
        imageUrl: '/assets/cities/varanasi/ghats/dashashwamedh-evening-aarti-wide.webp',
        osmCoordinates: [25.3075, 83.0097],
      },
      {
        id: 'vn-node-5',
        stepNumber: 5,
        timeRange: '07:30 PM – 09:00 PM',
        title: 'Kashi Chaat Bhandar & Shreeji Malaiyo',
        subtitle: 'Sizzling Tamatar Chaat and saffron winter froth',
        description:
          'End the evening with Varanasi’s iconic sweet-sour-spicy crushed tomato chaat, palak patta chaat, and a clay cup of ethereal winter Malaiyo foam.',
        category: 'night_supper',
        locationName: 'Godowlia Crossing & Chaukhamba',
        durationMinutes: 90,
        costEstimateInr: 150,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        localProTip:
          'Order the signature hot Tamatar Chaat served in an earthen kulhad with warm desi ghee sugar syrup drizzled on top!',
        imageUrl: '/assets/cities/varanasi/food-and-sweets/kashi-chaat-bhandar-tamatar-chaat.webp',
        osmCoordinates: [25.3088, 83.0076],
      },
    ],
    branchDecision: {
      decisionTime: '12:00 PM – 03:30 PM (Afternoon Choice)',
      prompt: 'Do you want to explore ancient ghat mysteries or generational silk & brass crafts?',
      branchA: {
        id: 'branch_a',
        title: 'Manikarnika Kund & Sunken Shiva Shrines',
        badge: 'Ghat Heritage & Peace',
        nodes: [
          {
            id: 'vn-branch-a-1',
            stepNumber: 31,
            timeRange: '12:15 PM – 01:30 PM',
            title: 'Scindia Ghat & The Leaning Shiva Temple',
            subtitle: 'Ratneshwar Mahadev tilted into the river',
            description:
              'Marvel at the 19th-century temple leaning at a dramatic 9-degree angle into the Ganga waters, far steeper than the Leaning Tower of Pisa.',
            category: 'heritage',
            locationName: 'Scindia Ghat, Old Varanasi',
            durationMinutes: 75,
            costEstimateInr: 'Free',
            travelerSuitability: ['solo', 'friends', 'couple'],
            localProTip: 'Sit on the quiet stone platforms above the ghat for a contemplative river breeze.',
            imageUrl: '/assets/cities/varanasi/ghats/panchganga-ghat-river-view.webp',
            osmCoordinates: [25.3115, 83.0148],
          },
        ],
      },
      branchB: {
        id: 'branch_b',
        title: 'Thatheri Bazaar Brass Smiths & Silk Weavers',
        badge: 'Crafts & Weaving Guilds',
        nodes: [
          {
            id: 'vn-branch-b-1',
            stepNumber: 31,
            timeRange: '12:15 PM – 02:00 PM',
            title: 'Chowk Handloom Silk Weavers & Blue Lassi',
            subtitle: 'Generational Banarasi brocades and handloom jacquards',
            description:
              'Step into centuries-old weaver courtyards to see master weavers interlace pure silver zari threads with silk, then relax at the 90-year-old Blue Lassi shop.',
            category: 'bazaar_crafts',
            locationName: 'Thatheri Bazaar & Kachori Gali',
            durationMinutes: 105,
            costEstimateInr: 'Free',
            travelerSuitability: ['solo', 'couple', 'family'],
            localProTip: 'Look for the Silk Mark seal to guarantee pure Banarasi handloom rather than machine-printed nylon.',
            imageUrl: '/assets/cities/varanasi/markets-and-crafts/thatheri-bazaar-brassware.webp',
            osmCoordinates: [25.3125, 83.0105],
          },
        ],
      },
    },
  },

  udaipur: {
    cityId: 'udaipur',
    cityName: 'Udaipur',
    editionTitle: 'Udaipur Edition',
    tagline: 'Lakeside palaces, silent boat ripples, and Mewari candlelit terraces.',
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Lake Pichola Udaipur with City Palace reflecting in the water at sunset',
    bestSeason: 'September – March (Post-monsoon full lakes)',
    idealStay: '2 – 3 Days Exploration',
    startingGateway: 'Jagdish Chowk Pedestrian Arch',
    curatorName: 'Aapke Banna Sa',
    curatorBadge: 'Mewar Royal Host',
    nodes: [
      {
        id: 'ud-node-1',
        stepNumber: 1,
        timeRange: '08:30 AM – 09:45 AM',
        title: 'Jagdish Temple & Old City Morning Walk',
        subtitle: '1651 carved Mewar temple and stone incense',
        description:
          'Begin at the elevated 3-story Hindu temple carved with intricate elephant friezes, musicians, and celestial nymphs. Experience pure morning serenity.',
        category: 'heritage',
        locationName: 'Jagdish Chowk, Old City',
        durationMinutes: 75,
        costEstimateInr: 'Free',
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'walk',
          modeLabel: 'Cobbled Street Stroll',
          distanceMeters: 250,
          durationMinutes: 4,
          laneNote: 'Walk down the stone slope to the Badi Pol entrance of City Palace.',
        },
        localProTip: 'Listen to the morning bhajan bells; the temple acoustics are acoustically magnificent.',
        imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [24.5796, 73.6842],
      },
      {
        id: 'ud-node-2',
        stepNumber: 2,
        timeRange: '10:00 AM – 01:15 PM',
        title: 'City Palace Complex of Udaipur',
        subtitle: 'Granite and marble pavilions overlooking Lake Pichola',
        description:
          'Rajasthan’s largest palace complex. Marvel at Mor Chowk’s glass mosaics of 3 dancing peacocks, the Zenana Mahal, and the royal armoury.',
        category: 'heritage',
        locationName: 'City Palace, Lake Pichola',
        durationMinutes: 195,
        costEstimateInr: 400,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'boat',
          modeLabel: 'Wooden Boat to Jag Mandir',
          distanceMeters: 1400,
          durationMinutes: 15,
          laneNote: 'Board at Rameshwar Ghat inside the City Palace jetty.',
        },
        localProTip: 'Opt for the combined Palace + Boat ticket to save 25% on the ferry fare.',
        imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [24.5764, 73.6835],
      },
      {
        id: 'ud-node-3',
        stepNumber: 3,
        timeRange: '05:00 PM – 06:45 PM',
        title: 'Ambrai Ghat Sunset Over Lake Pichola',
        subtitle: 'The ultimate golden hour view in India',
        description:
          'Sit on the stepped marble ghat directly across from City Palace and Lake Palace. Watch the palace walls turn fiery orange as the sun sets behind the Aravallis.',
        category: 'sunset',
        locationName: 'Ambrai Ghat (Manjhi Mandir Ghat)',
        durationMinutes: 105,
        costEstimateInr: 'Free',
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'walk',
          modeLabel: 'Walk across Daiji Footbridge',
          distanceMeters: 500,
          durationMinutes: 8,
          laneNote: 'Cross the scenic pedestrian bridge connecting Chandpole to Lal Ghat.',
        },
        localProTip: 'Arrive by 5:15 PM with a camera. Remove shoes before stepping onto the sacred water steps.',
        imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [24.5786, 73.6796],
      },
      {
        id: 'ud-node-4',
        stepNumber: 4,
        timeRange: '07:30 PM – 09:30 PM',
        title: 'Traditional Mewari Thali at Krishna Dal Baati',
        subtitle: 'Woodfired baatis dipped in pure cow ghee',
        description:
          'Enjoy Rajasthan’s authentic rustic feast: crispy baked wheat balls crushed into panchmel dal, spicy garlic chutney, sweet churma, and butter milk.',
        category: 'night_supper',
        locationName: 'Near Jal Mahal, Gulab Bagh Road',
        durationMinutes: 120,
        costEstimateInr: 300,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        localProTip: 'It’s unlimited authentic thali. Ask the server for extra hot churma laddu with ghee.',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [24.5742, 73.6938],
      },
    ],
  },

  manali: {
    cityId: 'manali',
    cityName: 'Manali',
    editionTitle: 'Manali Edition',
    tagline: 'Cedar pine woods, tumbling glacial streams, and cozy wooden cafes.',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Snow peaked Himalayan mountains in Manali with pine deodar trees',
    bestSeason: 'October – February (Snow), May – June (Alpine blooms)',
    idealStay: '3 – 4 Days Exploration',
    startingGateway: 'Mall Road Bridge & Old Manali Gate',
    curatorName: 'Pahadi Bhaiya',
    curatorBadge: 'Himachal Mountain Host',
    nodes: [
      {
        id: 'mn-node-1',
        stepNumber: 1,
        timeRange: '08:30 AM – 10:15 AM',
        title: 'Hadimba Pagoda Temple & Deodar Woods',
        subtitle: '1553 wooden pagoda temple nestled among giant cedar trees',
        description:
          'Breathe pure mountain air among centuries-old deodars. The multi-tiered wooden shrine features carved mythological figures and tranquil forest trails.',
        category: 'heritage',
        locationName: 'Dhungri Forest, Manali',
        durationMinutes: 105,
        costEstimateInr: 'Free',
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'walk',
          modeLabel: 'Pine Forest Path to Old Manali',
          distanceMeters: 1200,
          durationMinutes: 18,
          laneNote: 'Follow the scenic pedestrian trail through apple orchards.',
        },
        localProTip: 'Walk into the deeper Dhungri woods behind the temple for pure morning mountain silence.',
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [32.2483, 77.1697],
      },
      {
        id: 'mn-node-2',
        stepNumber: 2,
        timeRange: '10:45 AM – 01:15 PM',
        title: 'Old Manali Riverside Trail & Fresh Trout Lunch',
        subtitle: 'Apple orchards, wooden bridges, and riverside cafes',
        description:
          'Cross the Manalsu river footbridge into Old Manali. Savor fresh pan-seared Himalayan river trout with lemon butter and mountain herbs.',
        category: 'food_chai',
        locationName: 'Old Manali Village & Manu Temple Road',
        durationMinutes: 150,
        costEstimateInr: 450,
        travelerSuitability: ['solo', 'couple', 'friends'],
        transitToNext: {
          mode: 'rickshaw',
          modeLabel: 'Auto to Vashisht Village',
          distanceMeters: 4500,
          durationMinutes: 20,
          laneNote: 'Cross the Beas bridge towards the hot springs.',
        },
        localProTip: 'Try Cafe 1947 or Dylan’s Toasted & Roasted for the best cinnamon cookies and river views.',
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [32.2562, 77.1752],
      },
      {
        id: 'mn-node-3',
        stepNumber: 3,
        timeRange: '02:00 PM – 05:00 PM',
        title: 'Jogini Waterfall Trek & Vashisht Hot Springs',
        subtitle: 'Cascading alpine falls with valley panoramas',
        description:
          'A gentle 3-km pine forest trail leading to a dramatic cascading waterfall. Dip feet in natural mineral hot sulfur springs in Vashisht on your return.',
        category: 'sunset',
        locationName: 'Vashisht, Upper Manali',
        durationMinutes: 180,
        costEstimateInr: 'Free',
        travelerSuitability: ['solo', 'couple', 'friends'],
        transitToNext: {
          mode: 'walk',
          modeLabel: 'Descent to Mall Road',
          distanceMeters: 3000,
          durationMinutes: 25,
          laneNote: 'Walk down to the illuminated town center.',
        },
        localProTip: 'Carry a lightweight rain jacket and refill your water bottle at mountain mountain springs.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [32.2684, 77.1953],
      },
    ],
  },

  mussoorie: {
    cityId: 'mussoorie',
    cityName: 'Mussoorie',
    editionTitle: 'Mussoorie Edition',
    tagline: 'Misty deodar ridges, colonial bookshops, and golden Himalayan sunsets.',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Misty mountain ridge of Mussoorie overlooking the Doon valley',
    bestSeason: 'March – June, September – November',
    idealStay: '2 Days Peaceful Retreat',
    startingGateway: 'Picture Palace / Library Chowk Gate',
    curatorName: 'Pahadi Didi',
    curatorBadge: 'Landour Hill Companion',
    nodes: [
      {
        id: 'ms-node-1',
        stepNumber: 1,
        timeRange: '08:00 AM – 10:30 AM',
        title: 'Char Dukan & Landour Bakehouse Trail',
        subtitle: 'Pancake breakfasts, ginger lemon tea & 150-year-old pines',
        description:
          'Escape the crowds to historic Landour. Walk along the peaceful upper loop shaded by massive deodars, enjoy fresh scones, and visit historic St. Paul’s church.',
        category: 'food_chai',
        locationName: 'Char Dukan, Upper Landour',
        durationMinutes: 150,
        costEstimateInr: 300,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'walk',
          modeLabel: 'Uphill Pine Loop Walk',
          distanceMeters: 1400,
          durationMinutes: 25,
          laneNote: 'Gentle winding trail towards the highest peak of Mussoorie.',
        },
        localProTip: 'Try the fresh apple cinnamon crepe at Landour Bakehouse alongside fresh ginger-honey tea.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [30.4578, 78.0934],
      },
      {
        id: 'ms-node-2',
        stepNumber: 2,
        timeRange: '11:00 AM – 01:00 PM',
        title: 'Lal Tibba Scenic Viewpoint',
        subtitle: 'Telescopic views of Badrinath and Kedarnath peaks',
        description:
          'The highest ridge in Mussoorie (2,275m). On clear days, high-powered binoculars reveal the eternal snows of Chaukhamba and Kedarnath.',
        category: 'heritage',
        locationName: 'Lal Tibba, Landour Cantt',
        durationMinutes: 120,
        costEstimateInr: 50,
        travelerSuitability: ['solo', 'couple', 'friends', 'family'],
        transitToNext: {
          mode: 'cab',
          modeLabel: 'Drive to George Everest Ridge',
          distanceMeters: 8500,
          durationMinutes: 30,
          laneNote: 'Scenic drive across Hathipaon ridge.',
        },
        localProTip: 'Morning light before 1:00 PM gives the crispest views before afternoon clouds gather.',
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [30.4632, 78.0978],
      },
      {
        id: 'ms-node-3',
        stepNumber: 3,
        timeRange: '04:00 PM – 06:45 PM',
        title: 'Sir George Everest House Sunset Ridge',
        subtitle: '360° panoramic views of Doon valley and snow crests',
        description:
          'Hike to the historic 1832 estate of the Surveyor General of India. Witness the famous "Winterline" sunset as the horizon glows in layers of red, violet, and orange.',
        category: 'sunset',
        locationName: 'Hathipaon, Park Estate',
        durationMinutes: 165,
        costEstimateInr: 'Free',
        travelerSuitability: ['solo', 'couple', 'friends'],
        localProTip: 'Stay until 6:30 PM to watch the lights of Dehradun valley sparkle like scattered diamonds below.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        osmCoordinates: [30.4489, 78.0267],
      },
    ],
  },
}

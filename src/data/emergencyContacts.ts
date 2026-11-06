export interface LocalPoliceStation {
  name: string
  area: string
  phone: string
  mobileOrInspector?: string
  address: string
  isTouristSpecialist?: boolean
}

export interface EmergencyHospital {
  name: string
  type: string
  phone: string
  address: string
  has24x7Emergency: boolean
}

export interface OfficialPortal {
  title: string
  category: 'temple_heritage' | 'tourism_board' | 'transit_police' | 'railways'
  url: string
  description: string
  isGovernmentOfficial: boolean
}

export interface CitySafetyDirectory {
  cityId: string
  cityName: string
  assignedGuide: {
    name: string
    title: string
    badge: string
    phone: string
    whatsapp: string
    avatarImage: string
    languages: string[]
    neighborhood: string
    bio: string
    availableHours: string
    guidingSinceYear: number
  }
  policeStations: LocalPoliceStation[]
  hospitals: EmergencyHospital[]
  officialPortals: OfficialPortal[]
}

export const NATIONAL_EMERGENCY_HELPLINES = [
  {
    code: '112',
    name: 'National All-in-One Emergency',
    description: 'Police, Fire, Ambulance integrated single emergency response.',
    category: 'police_medical',
    actionText: 'Call 112',
    isPrimary: true,
  },
  {
    code: '1363',
    name: 'National Tourist Helpline (Ministry of Tourism)',
    description: '24x7 toll-free guidance in 12 languages (Hindi, English, French, German, Japanese, etc.).',
    category: 'tourist',
    actionText: 'Call 1363',
    isPrimary: true,
  },
  {
    code: '139',
    name: 'Rail Madad (Indian Railways Security & Medical)',
    description: 'Onboard train security, medical emergency, railway police (GRP/RPF).',
    category: 'railways',
    actionText: 'Call 139',
    isPrimary: true,
  },
  {
    code: '1090',
    name: 'Women Power Helpline (UP 1090 / National 1091)',
    description: 'Dedicated 24x7 women safety, anti-harassment, and immediate police response.',
    category: 'women_safety',
    actionText: 'Call 1090',
    isPrimary: true,
  },
  {
    code: '108',
    name: 'National Ambulance Emergency Service',
    description: '24x7 government free emergency ambulance and paramedics.',
    category: 'medical',
    actionText: 'Call 108',
    isPrimary: false,
  },
  {
    code: '1033',
    name: 'National Highway Emergency (NHAI)',
    description: '24x7 highway breakdown assistance, tow crane, and road ambulance.',
    category: 'highway',
    actionText: 'Call 1033',
    isPrimary: false,
  },
]

export const CITY_SAFETY_DIRECTORIES: Record<string, CitySafetyDirectory> = {
  varanasi: {
    cityId: 'varanasi',
    cityName: 'Varanasi',
    assignedGuide: {
      name: 'Pandit Shivam Mishra ("Banarasi Bhaiya")',
      title: 'Kashi Native Heritage Companion & Ghat Chronicler',
      badge: 'Verified Kashi Companion • 14+ Yrs',
      phone: '+919454428190',
      whatsapp: '+919454428190',
      avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      languages: ['Hindi', 'Bhojpuri', 'English'],
      neighborhood: 'Assi Ghat & Chowk Gallis',
      bio: 'Born right beside Assi Ghat. If you get confused in the labyrinth of ancient Banaras gallis, lost near Manikarnika, or need fair boat rates without broker commission, call or WhatsApp me directly.',
      availableHours: '06:00 AM – 10:30 PM (Daily)',
      guidingSinceYear: 2011,
    },
    policeStations: [
      {
        name: 'Dashashwamedh Police Station',
        area: 'Dashashwamedh, Main Ghats & Godowlia',
        phone: '+915422451202',
        mobileOrInspector: '+919454404395',
        address: 'Near Dashashwamedh Crossing, Godowlia, Varanasi',
        isTouristSpecialist: true,
      },
      {
        name: 'Bhelupur Police Station',
        area: 'Assi Ghat, Southern Riverfront & Durgakund',
        phone: '+915422310352',
        mobileOrInspector: '+919454404394',
        address: 'Bhelupur Crossing, Assi Road, Varanasi',
        isTouristSpecialist: false,
      },
      {
        name: 'Chowk Police Station',
        area: 'Kashi Vishwanath Corridor, Thatheri Bazaar & Manikarnika',
        phone: '+915422402410',
        mobileOrInspector: '+919454404393',
        address: 'Chowk Kotwali, near Vishwanath Temple Gate 4, Varanasi',
        isTouristSpecialist: true,
      },
      {
        name: 'Tourist Police Assistance Booth',
        area: 'Riverfront Boardwalk at Dashashwamedh Ghat',
        phone: '+919454404410',
        address: 'Directly on Dashashwamedh Ghat Steps, Varanasi',
        isTouristSpecialist: true,
      },
      {
        name: 'Railway Police Station (GRP Cantt)',
        area: 'Varanasi Junction (BSB Cantt) Platform 1',
        phone: '+915422508200',
        mobileOrInspector: '+919454404432',
        address: 'Platform 1, Varanasi Cantt Railway Station',
        isTouristSpecialist: true,
      },
      {
        name: 'District Police Control Room Varanasi',
        area: 'Varanasi City & Rural Central Dispatch',
        phone: '+915422508080',
        address: 'Police Line, Kachehri, Varanasi',
        isTouristSpecialist: false,
      },
    ],
    hospitals: [
      {
        name: 'Sir Sunderlal Hospital (BHU Trauma Centre)',
        type: 'Premier Multi-speciality Government Hospital',
        phone: '+915422307500',
        address: 'Banaras Hindu University (BHU) Campus, Varanasi',
        has24x7Emergency: true,
      },
      {
        name: 'Heritage Hospitals (Lanka)',
        type: 'Private Super Speciality',
        phone: '+915422368888',
        address: 'Near BHU Main Gate, Lanka, Varanasi',
        has24x7Emergency: true,
      },
      {
        name: 'Shubham Hospital',
        type: 'Emergency Medical & Trauma',
        phone: '+915422504444',
        address: 'S-8/108-F, Khajuri, Maqbool Alam Road, Varanasi',
        has24x7Emergency: true,
      },
    ],
    officialPortals: [
      {
        title: 'Shri Kashi Vishwanath Temple Official Trust',
        category: 'temple_heritage',
        url: 'https://shrikashivishwanath.org/',
        description: 'Official online booking for Sugam Darshan, Mangla Aarti, and authentic Rudrabhishek rituals without middleman fees.',
        isGovernmentOfficial: true,
      },
      {
        title: 'Uttar Pradesh Tourism (UP Tourism)',
        category: 'tourism_board',
        url: 'https://uptourism.gov.in/',
        description: 'Official state tourism portal with verified heritage trails, ferry timings, and hotel directory.',
        isGovernmentOfficial: true,
      },
      {
        title: 'Varanasi Smart City Citizen Services',
        category: 'transit_police',
        url: 'https://varanasismartcity.gov.in/',
        description: 'Official municipal tracking for electric river catamarans, public parking, and heritage city services.',
        isGovernmentOfficial: true,
      },
      {
        title: 'IRCTC Official Rail Booking & PNR Tracking',
        category: 'railways',
        url: 'https://www.irctc.co.in/nget/',
        description: 'Book confirmed train berths to Varanasi Cantt (BSB) and Banaras (BSBS).',
        isGovernmentOfficial: true,
      },
      {
        title: 'ASI Monument E-Ticketing (Sarnath & Stupas)',
        category: 'temple_heritage',
        url: 'https://asi.nic.in/',
        description: 'Archaeological Survey of India official entry tickets for Sarnath excavated Buddhist ruins and Dhamek Stupa.',
        isGovernmentOfficial: true,
      },
    ],
  },

  jaipur: {
    cityId: 'jaipur',
    cityName: 'Jaipur',
    assignedGuide: {
      name: 'Vikram Singh Shekhawat ("Aapke Bhaisaab")',
      title: 'Pink City Elder Brother & Certified Rajasthan Guide',
      badge: 'Govt Certified Guide #RJ-4491 • 16+ Yrs',
      phone: '+919414033812',
      whatsapp: '+919414033812',
      avatarImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      languages: ['Hindi', 'Marwari', 'English'],
      neighborhood: 'Badi Chaupar & Amer',
      bio: 'Walled city and fort native. Call me if auto drivers overcharge you at Sindhi Camp or if you need verified gemstone and hand-block textile shopping without middleman commissions.',
      availableHours: '07:00 AM – 10:00 PM (Daily)',
      guidingSinceYear: 2009,
    },
    policeStations: [
      {
        name: 'Jaipur Tourist Police Station',
        area: 'Amer Fort Road & Heritage Environs',
        phone: '+911412672222',
        mobileOrInspector: '+919414088222',
        address: 'Near Jal Mahal, Amer Road, Jaipur',
        isTouristSpecialist: true,
      },
      {
        name: 'Manak Chowk Police Station',
        area: 'Hawa Mahal, Badi Chaupar & Jantar Mantar',
        phone: '+911412608820',
        address: 'Badi Chaupar Walled City, Jaipur',
        isTouristSpecialist: true,
      },
      {
        name: 'Kotwali Police Station',
        area: 'Johari Bazaar & Bapu Bazaar',
        phone: '+911412601200',
        address: 'Near Chhoti Chaupar, Jaipur',
        isTouristSpecialist: false,
      },
      {
        name: 'Sindhi Camp Bus Station Police Post',
        area: 'Central Inter-State Bus Terminal',
        phone: '+911412201855',
        address: 'Platform 1 Gate, Sindhi Camp, Jaipur',
        isTouristSpecialist: true,
      },
      {
        name: 'Jaipur Police Control Room',
        area: 'Jaipur Metropolitan City Central',
        phone: '+911412203333',
        address: 'Commissioner of Police Office, MI Road, Jaipur',
        isTouristSpecialist: false,
      },
    ],
    hospitals: [
      {
        name: 'SMS Hospital & Medical College (Trauma Centre)',
        type: 'Premier Government Super Speciality',
        phone: '+911412518240',
        address: 'JLN Marg, Ashok Nagar, Jaipur',
        has24x7Emergency: true,
      },
      {
        name: 'Fortis Escorts Hospital',
        type: 'Private Super Speciality',
        phone: '+911412547000',
        address: 'Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur',
        has24x7Emergency: true,
      },
    ],
    officialPortals: [
      {
        title: 'Rajasthan Tourism Development Corporation (RTDC)',
        category: 'tourism_board',
        url: 'https://tourism.rajasthan.gov.in/',
        description: 'Official booking for state-run palace properties, RTDC city day coaches, and monument composite tickets.',
        isGovernmentOfficial: true,
      },
      {
        title: 'Jaipur Metro Rail Corporation (JMRC)',
        category: 'transit_police',
        url: 'https://transport.rajasthan.gov.in/jmrc/',
        description: 'Timetables and smart card details for Pink Line connecting Railway Station to Badi Chaupar.',
        isGovernmentOfficial: true,
      },
    ],
  },

  udaipur: {
    cityId: 'udaipur',
    cityName: 'Udaipur',
    assignedGuide: {
      name: 'Bhawani Pratap Rathore ("Banna Sa")',
      title: 'Mewar Heritage Ambassador & Lakeside Companion',
      badge: 'Mewar Cultural Trust • 12+ Yrs',
      phone: '+919829077145',
      whatsapp: '+919829077145',
      avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      languages: ['Hindi', 'Mewari', 'English'],
      neighborhood: 'Lal Ghat & Jagdish Chowk',
      bio: 'Lal Ghat haveli resident. Call me for fair sunset boat slot bookings without agent markups, lake-view rooftop spots, and Kumbhalgarh taxi dispatch.',
      availableHours: '07:30 AM – 10:30 PM (Daily)',
      guidingSinceYear: 2013,
    },
    policeStations: [
      {
        name: 'Ghanta Ghar Police Station',
        area: 'City Palace, Jagdish Temple & Lal Ghat',
        phone: '+912942420330',
        address: 'Clock Tower (Ghanta Ghar), Old City, Udaipur',
        isTouristSpecialist: true,
      },
      {
        name: 'Ambamata Police Station',
        area: 'Fateh Sagar Lake & Sajjangarh Monsoon Palace',
        phone: '+912942430150',
        address: 'Near Swaroop Sagar Link Road, Udaipur',
        isTouristSpecialist: false,
      },
      {
        name: 'Udaipur Tourist Assistance Unit',
        area: 'Lake Pichola Promenade & City Palace Forecourt',
        phone: '+912942411535',
        address: 'City Palace Entrance, Udaipur',
        isTouristSpecialist: true,
      },
    ],
    hospitals: [
      {
        name: 'Maharana Bhupal Government General Hospital (MB Hospital)',
        type: 'Premier Government Hospital & Trauma',
        phone: '+912942410888',
        address: 'Hospital Road, Court Chauraha, Udaipur',
        has24x7Emergency: true,
      },
    ],
    officialPortals: [
      {
        title: 'City Palace Museum Official Mewar Trust',
        category: 'temple_heritage',
        url: 'https://www.eternalmewar.org/',
        description: 'Official entrance, Zenana Mahal, and Vintage Car Collection ticket reservations.',
        isGovernmentOfficial: false,
      },
      {
        title: 'Rajasthan Tourism Udaipur Portal',
        category: 'tourism_board',
        url: 'https://tourism.rajasthan.gov.in/udaipur.html',
        description: 'State tourism verified guide to lakes, havelis, and Shilpgram craft village.',
        isGovernmentOfficial: true,
      },
    ],
  },

  manali: {
    cityId: 'manali',
    cityName: 'Manali',
    assignedGuide: {
      name: 'Sunil Thakur ("Aapka Pahadi Dost")',
      title: 'Himachali Mountaineer & High-Altitude Valley Guide',
      badge: 'Atal Institute Certified • 10+ Yrs',
      phone: '+919816055219',
      whatsapp: '+919816055219',
      avatarImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      languages: ['Hindi', 'Pahadi', 'English'],
      neighborhood: 'Old Manali & Vashisht',
      bio: 'Atal Tunnel traffic updates, Rohtang Pass online permit guidance, Solang Valley adventure gear verification, and offbeat pine hiking trails.',
      availableHours: '06:30 AM – 09:30 PM (Daily)',
      guidingSinceYear: 2015,
    },
    policeStations: [
      {
        name: 'Manali Police Station',
        area: 'Mall Road, Old Manali & Solang Valley Highway',
        phone: '+911902252326',
        mobileOrInspector: '+919418080000',
        address: 'Near Circuit House, Manali',
        isTouristSpecialist: true,
      },
      {
        name: 'Kullu District Police Control Room',
        area: 'Kullu Valley & Bhuntar Airport Environs',
        phone: '+911902222770',
        address: 'SP Office, Dhalpur, Kullu',
        isTouristSpecialist: false,
      },
    ],
    hospitals: [
      {
        name: 'Civil Hospital Manali',
        type: 'Government General Hospital & High Altitude Trauma',
        phone: '+911902252345',
        address: 'Mall Road, near Mission Hospital, Manali',
        has24x7Emergency: true,
      },
    ],
    officialPortals: [
      {
        title: 'District Administration Kullu - Rohtang Pass Permits',
        category: 'transit_police',
        url: 'https://rohtangpermits.nic.in/',
        description: 'Mandatory official online vehicle permit portal for driving beyond Kothi to Rohtang Pass.',
        isGovernmentOfficial: true,
      },
      {
        title: 'Himachal Pradesh Tourism Development Corporation (HPTDC)',
        category: 'tourism_board',
        url: 'https://himachaltourism.gov.in/',
        description: 'Official state booking for Volvo buses, mountain cottages, and trekking circuits.',
        isGovernmentOfficial: true,
      },
    ],
  },

  delhi: {
    cityId: 'delhi',
    cityName: 'Delhi NCR',
    assignedGuide: {
      name: 'Aman Qureshi ("Dilliwala Dost")',
      title: 'Shahjahanabad Heritage & Capital Food Chronicler',
      badge: 'Purani Dilli Native • 13+ Yrs',
      phone: '+919811044290',
      whatsapp: '+919811044290',
      avatarImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=300&q=80',
      languages: ['Hindi', 'Urdu', 'English'],
      neighborhood: 'Jama Masjid & Chandni Chowk',
      bio: 'Old Delhi culinary and heritage specialist. Call if lost in the Matia Mahal gallis, needing metro token assistance, or midnight food routes.',
      availableHours: '07:00 AM – 11:00 PM (Daily)',
      guidingSinceYear: 2012,
    },
    policeStations: [
      {
        name: 'Chandni Chowk Police Station (Kotwali)',
        area: 'Red Fort, Chandni Chowk & Jama Masjid',
        phone: '+911123282433',
        address: 'Near Sis Ganj Gurudwara, Chandni Chowk, Delhi',
        isTouristSpecialist: true,
      },
      {
        name: 'Delhi Tourist Police Unit (Paharganj / NDLS)',
        area: 'New Delhi Railway Station & Connaught Place',
        phone: '+911123512345',
        address: 'Outer Circle, Connaught Place / NDLS Station, Delhi',
        isTouristSpecialist: true,
      },
      {
        name: 'Delhi Police Central Helpline',
        area: 'National Capital Territory',
        phone: '+911123010101',
        address: 'Jai Singh Road, New Delhi',
        isTouristSpecialist: false,
      },
    ],
    hospitals: [
      {
        name: 'AIIMS (All India Institute of Medical Sciences)',
        type: 'Premier Apex Government Trauma Centre',
        phone: '+911126588500',
        address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
        has24x7Emergency: true,
      },
      {
        name: 'Safdarjung Hospital',
        type: 'Government Emergency & Trauma',
        phone: '+911126165060',
        address: 'Opposite AIIMS, Ring Road, New Delhi',
        has24x7Emergency: true,
      },
    ],
    officialPortals: [
      {
        title: 'Delhi Metro Rail Corporation (DMRC)',
        category: 'transit_police',
        url: 'https://www.delhimetrorail.com/',
        description: 'Interactive metro route planner, station fare calculator, and live line status.',
        isGovernmentOfficial: true,
      },
      {
        title: 'Delhi Tourism and Transportation Development (DTTDC)',
        category: 'tourism_board',
        url: 'https://www.delhitourism.gov.in/',
        description: 'Official city sightseeing Hop-On-Hop-Off tours and Dilli Haat craft bazaars.',
        isGovernmentOfficial: true,
      },
    ],
  },

  mussoorie: {
    cityId: 'mussoorie',
    cityName: 'Mussoorie',
    assignedGuide: {
      name: 'Kailash Rawat ("Hillside Storyteller")',
      title: 'Garhwal Foothills & Landour Chronicler',
      badge: 'Landour Heritage Society • 15+ Yrs',
      phone: '+919412088314',
      whatsapp: '+919412088314',
      avatarImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=300&q=80',
      languages: ['Hindi', 'Garhwali', 'English'],
      neighborhood: 'Char Dukan & Library Chowk',
      bio: 'Landour heritage trails, George Everest sunset hikes, Dehradun-Mussoorie cab fixed rates, and misty forest walks.',
      availableHours: '07:00 AM – 09:30 PM (Daily)',
      guidingSinceYear: 2010,
    },
    policeStations: [
      {
        name: 'Mussoorie Police Station (Kotwali)',
        area: 'Mall Road, Library Chowk & Picture Palace',
        phone: '+911352632003',
        address: 'The Mall Road, Near Library Chowk, Mussoorie',
        isTouristSpecialist: true,
      },
      {
        name: 'Dehradun Police Control Room',
        area: 'Dehradun & Mussoorie Foothill Corridor',
        phone: '+911352716200',
        address: 'Police Line, Dehradun',
        isTouristSpecialist: false,
      },
    ],
    hospitals: [
      {
        name: 'St. Mary’s Cottage Hospital (Civil Hospital)',
        type: 'Government Community Hospital & Emergency',
        phone: '+911352632891',
        address: 'Spring Field, The Mall Road, Mussoorie',
        has24x7Emergency: true,
      },
      {
        name: 'Max Super Speciality Hospital (Dehradun Foothills)',
        type: 'Private Super Speciality (at foothill link)',
        phone: '+911356673000',
        address: 'Mussoorie Diversion Road, Malsi, Dehradun',
        has24x7Emergency: true,
      },
    ],
    officialPortals: [
      {
        title: 'Uttarakhand Tourism Development Board (UTDB)',
        category: 'tourism_board',
        url: 'https://uttarakhandtourism.gov.in/',
        description: 'Official portal for Garhwal mountain circuits, adventure permits, and homestays.',
        isGovernmentOfficial: true,
      },
    ],
  },
}

export function getSafetyDirectoryForCity(cityId: string): CitySafetyDirectory {
  const norm = (cityId || 'varanasi').toLowerCase().trim()
  return CITY_SAFETY_DIRECTORIES[norm] || CITY_SAFETY_DIRECTORIES.varanasi
}

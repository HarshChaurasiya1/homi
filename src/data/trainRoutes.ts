export type TrainClassCode = 'GEN' | '2S' | 'SL' | '3E' | '3A' | '2A' | '1A' | 'CC' | 'EC'

export interface TrainClassFare {
  classCode: TrainClassCode
  className: string
  fareInr: number
  statusNote?: string
}

export interface DetailedTrain {
  id: string
  trainNumber: string
  trainName: string
  fromStationCode: string
  fromStationName: string
  toStationCode: string
  toStationName: string
  departureTime: string
  arrivalTime: string
  duration: string
  durationMinutes: number
  runningDays: string[]
  classes: TrainClassFare[]
  isRecommended: boolean
  recommendationReason?: string
  recommendationBadge?: string
  pantry: string
  cleanlinessScore: number
  punctualityScore: number
  keyHalts: string[]
  bookingUrl: string
  direction: 'outbound' | 'return'
}

export interface ReturnTransitComparison {
  originCityName: string
  destinationCityId: string
  destinationCityName: string
  distanceKm: number
  recommendedMode: 'train' | 'bus' | 'flight' | 'taxi'
  recommendationReason: string
  trains: DetailedTrain[]
  recommendedTrain: DetailedTrain
  bus: {
    operator: string
    boardingPoint: string
    droppingPoint: string
    duration: string
    fareFormatted: string
    fareInr: number
    schedule: string
    tip: string
    bookingUrl: string
  }
  flight?: {
    airlines: string
    departureAirport: string
    arrivalAirport: string
    duration: string
    fareFormatted: string
    fareInr: number
    schedule: string
    tip: string
    bookingUrl: string
  }
  taxi: {
    highway: string
    duration: string
    fareFormatted: string
    fareInr: number
    tollEstimatedInr: number
    tip: string
  }
}

export const DETAILED_TRAINS_DATABASE: Record<string, { outbound: DetailedTrain[]; return: DetailedTrain[] }> = {
  // =========================================================================
  // 1. JHANSI <-> VARANASI
  // =========================================================================
  'jhansi-varanasi': {
    outbound: [
      {
        id: 'train-11107-outbound',
        trainNumber: '11107',
        trainName: 'Bundelkhand Express',
        fromStationCode: 'VGLJ',
        fromStationName: 'Virangana Lakshmibai Jhansi Jn',
        toStationCode: 'BSB',
        toStationName: 'Varanasi Junction (Cantt)',
        departureTime: '22:40',
        arrivalTime: '10:45 (+1 Day)',
        duration: '12h 05m (Overnight)',
        durationMinutes: 725,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: 'GEN', className: 'General (UR/2S)', fareInr: 175, statusNote: 'Unreserved coach / UTS app' },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 325, statusNote: 'Standard sleeper berth' },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 880, statusNote: 'AC with complimentary fresh bedding' },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1250, statusNote: 'Spacious two-tier with privacy curtains' },
          { classCode: '1A', className: '1st AC (1A)', fareInr: 2100, statusNote: 'Lockable luxury coupe/cabin' },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only #1 Recommended Train',
        recommendationReason:
          'Depart Jhansi after dinner at 22:40, sleep through the night, and wake up at Varanasi Junction at 10:45 AM. Saves a full hotel night with direct broad-gauge comfort and the highest confirmed berth probability on this route.',
        pantry: 'Pantry Car onboard + IRCTC E-Catering to seat at Prayagraj Chheoki & Banda',
        cleanlinessScore: 4.3,
        punctualityScore: 91,
        keyHalts: [
          'VGLJ - Jhansi (22:40)',
          'MRPR - Mauranipur (23:36)',
          'MBA - Mahoba (00:40)',
          'BNDA - Banda (01:55)',
          'CKTD - Chitrakootdham (03:00)',
          'MKP - Manikpur (04:00)',
          'PCOI - Prayagraj Chheoki (06:45)',
          'MZP - Mirzapur (08:35)',
          'BSB - Varanasi Junction (10:45)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'outbound',
      },
      {
        id: 'train-19167-outbound',
        trainNumber: '19167',
        trainName: 'Sabarmati Express',
        fromStationCode: 'VGLJ',
        fromStationName: 'Virangana Lakshmibai Jhansi Jn',
        toStationCode: 'BSB',
        toStationName: 'Varanasi Junction (Cantt)',
        departureTime: '06:15',
        arrivalTime: '20:30',
        duration: '14h 15m (Daytime)',
        durationMinutes: 855,
        runningDays: ['Tue', 'Thu', 'Fri', 'Sun'],
        classes: [
          { classCode: 'GEN', className: 'General (UR)', fareInr: 175 },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 330 },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 895 },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1270 },
        ],
        isRecommended: false,
        pantry: 'IRCTC E-Catering at Kanpur Central & Lucknow Charbagh',
        cleanlinessScore: 3.9,
        punctualityScore: 84,
        keyHalts: [
          'VGLJ - Jhansi (06:15)',
          'ORAI - Orai (07:45)',
          'CNB - Kanpur Central (11:00)',
          'LKO - Lucknow Charbagh (13:30)',
          'AYC - Ayodhya Cantt (16:45)',
          'SHG - Shahganj (18:50)',
          'BSB - Varanasi (20:30)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'outbound',
      },
      {
        id: 'train-12175-outbound',
        trainNumber: '12175',
        trainName: 'Chambal Express',
        fromStationCode: 'VGLJ',
        fromStationName: 'Virangana Lakshmibai Jhansi Jn',
        toStationCode: 'BSB',
        toStationName: 'Varanasi Junction',
        departureTime: '09:15',
        arrivalTime: '18:50',
        duration: '9h 35m (Fast Day Express)',
        durationMinutes: 575,
        runningDays: ['Wed', 'Sun'],
        classes: [
          { classCode: 'GEN', className: 'General (UR)', fareInr: 185 },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 345 },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 920 },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1310 },
        ],
        isRecommended: false,
        pantry: 'E-Catering at Prayagraj Chheoki',
        cleanlinessScore: 4.1,
        punctualityScore: 88,
        keyHalts: [
          'VGLJ - Jhansi (09:15)',
          'BNDA - Banda (11:55)',
          'MKP - Manikpur (13:10)',
          'PCOI - Prayagraj Chheoki (15:20)',
          'MZP - Mirzapur (16:40)',
          'BSB - Varanasi (18:50)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'outbound',
      },
    ],
    return: [
      {
        id: 'train-11108-return',
        trainNumber: '11108',
        trainName: 'Bundelkhand Express',
        fromStationCode: 'BSB',
        fromStationName: 'Varanasi Junction (Cantt)',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '16:30',
        arrivalTime: '05:35 (+1 Day)',
        duration: '13h 05m (Overnight)',
        durationMinutes: 785,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: 'GEN', className: 'General (UR/2S)', fareInr: 175, statusNote: 'Unreserved coach / UTS app' },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 325, statusNote: 'Standard sleeper berth' },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 880, statusNote: 'AC with fresh linen & blanket' },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1250, statusNote: 'Curtained wide 2-tier berth' },
          { classCode: '1A', className: '1st AC (1A)', fareInr: 2100, statusNote: 'Lockable coupe / cabin luxury' },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only #1 Recommended Return Train',
        recommendationReason:
          'HOMI’s One & Only Pick for Return: Board at 16:30 after a final afternoon Banaras lassi; sleep through the night and roll into Jhansi at 05:35 AM sharp before the workday begins. Direct zero-change train with the highest confirmed seat allocation on this corridor.',
        pantry: 'Pantry Car onboard + IRCTC E-Catering to seat at Prayagraj Chheoki',
        cleanlinessScore: 4.4,
        punctualityScore: 92,
        keyHalts: [
          'BSB - Varanasi Junction (16:30)',
          'CAR - Chunar Junction (17:28)',
          'MZP - Mirzapur (17:58)',
          'BDL - Vindhyachal (18:10)',
          'PCOI - Prayagraj Chheoki (19:55)',
          'SRJ - Shankargarh (20:45)',
          'MKP - Manikpur Junction (21:55)',
          'CKTD - Chitrakootdham (22:30)',
          'BNDA - Banda (23:25)',
          'MBA - Mahoba Junction (00:45)',
          'KLAR - Kulpahar (01:10)',
          'HPP - Harpalpur (01:45)',
          'MRPR - Mauranipur (02:50)',
          'VGLJ - Jhansi Junction (05:35)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
      {
        id: 'train-19168-return',
        trainNumber: '19168',
        trainName: 'Sabarmati Express',
        fromStationCode: 'BSB',
        fromStationName: 'Varanasi Junction (Cantt)',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '14:15',
        arrivalTime: '04:45 (+1 Day)',
        duration: '14h 30m',
        durationMinutes: 870,
        runningDays: ['Mon', 'Tue', 'Thu', 'Sat'],
        classes: [
          { classCode: 'GEN', className: 'General (UR)', fareInr: 175 },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 330 },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 895 },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1270 },
        ],
        isRecommended: false,
        pantry: 'E-Catering at Ayodhya & Lucknow Charbagh',
        cleanlinessScore: 3.9,
        punctualityScore: 82,
        keyHalts: [
          'BSB - Varanasi (14:15)',
          'JNU - Jaunpur (15:20)',
          'AY - Ayodhya (18:35)',
          'LKO - Lucknow Charbagh (23:05)',
          'CNB - Kanpur Central (01:10)',
          'ORAI - Orai (02:40)',
          'VGLJ - Jhansi (04:45)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
      {
        id: 'train-12176-return',
        trainNumber: '12176',
        trainName: 'Chambal Express',
        fromStationCode: 'BSB',
        fromStationName: 'Varanasi Junction',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '07:45',
        arrivalTime: '17:35',
        duration: '9h 50m (Fast Daytime Express)',
        durationMinutes: 590,
        runningDays: ['Tue', 'Sat'],
        classes: [
          { classCode: 'GEN', className: 'General (UR)', fareInr: 185 },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 345 },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 920 },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1310 },
        ],
        isRecommended: false,
        pantry: 'E-Catering available at Prayagraj Chheoki',
        cleanlinessScore: 4.1,
        punctualityScore: 89,
        keyHalts: [
          'BSB - Varanasi (07:45)',
          'MZP - Mirzapur (08:50)',
          'PCOI - Prayagraj Chheoki (10:15)',
          'MKP - Manikpur (11:55)',
          'BNDA - Banda (13:10)',
          'MBA - Mahoba (14:15)',
          'VGLJ - Jhansi (17:35)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
      {
        id: 'train-09466-return',
        trainNumber: '09466',
        trainName: 'GKP Ahmedabad Special via BSB-VGLJ',
        fromStationCode: 'BSB',
        fromStationName: 'Varanasi Junction',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '12:55',
        arrivalTime: '00:15 (+1 Day)',
        duration: '11h 20m',
        durationMinutes: 680,
        runningDays: ['Mon'],
        classes: [
          { classCode: 'GEN', className: 'General (UR)', fareInr: 190 },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 350 },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 940 },
        ],
        isRecommended: false,
        pantry: 'Pantry Car',
        cleanlinessScore: 3.8,
        punctualityScore: 80,
        keyHalts: [
          'BSB - Varanasi (12:55)',
          'PCOI - Prayagraj Chheoki (15:20)',
          'MKP - Manikpur (17:05)',
          'BNDA - Banda (18:35)',
          'VGLJ - Jhansi (00:15)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
    ],
  },

  // =========================================================================
  // 2. JHANSI <-> JAIPUR
  // =========================================================================
  'jhansi-jaipur': {
    outbound: [
      {
        id: 'train-19665-outbound',
        trainNumber: '19665',
        trainName: 'Khajuraho - Udaipur Express via Jaipur',
        fromStationCode: 'VGLJ',
        fromStationName: 'Virangana Lakshmibai Jhansi Jn',
        toStationCode: 'JP',
        toStationName: 'Jaipur Junction',
        departureTime: '13:40',
        arrivalTime: '21:55',
        duration: '8h 15m (Direct Daytime)',
        durationMinutes: 495,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: 'GEN', className: 'General (UR/2S)', fareInr: 160 },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 285 },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 770 },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1090 },
          { classCode: '1A', className: '1st AC (1A)', fareInr: 1850 },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only #1 Recommended Outbound Train',
        recommendationReason:
          'Direct daily train with zero transfers. Board at 13:40 PM from Jhansi, enjoy the sunset over eastern Rajasthan, and arrive at Jaipur Junction at 21:55 PM ready for dinner.',
        pantry: 'Pantry Car + E-Catering at Agra Cantt & Bharatpur',
        cleanlinessScore: 4.4,
        punctualityScore: 90,
        keyHalts: [
          'VGLJ - Jhansi (13:40)',
          'GWL - Gwalior (15:00)',
          'DHO - Dholpur (16:15)',
          'AGC - Agra Cantt (17:25)',
          'BTE - Bharatpur (18:25)',
          'BKI - Bandikui (20:00)',
          'DO - Dausa (20:45)',
          'JP - Jaipur Junction (21:55)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'outbound',
      },
    ],
    return: [
      {
        id: 'train-19666-return',
        trainNumber: '19666',
        trainName: 'Udaipur - Khajuraho Express via Jaipur',
        fromStationCode: 'JP',
        fromStationName: 'Jaipur Junction',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '05:35',
        arrivalTime: '14:05',
        duration: '8h 30m',
        durationMinutes: 510,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: 'GEN', className: 'General (UR/2S)', fareInr: 160, statusNote: 'Unreserved coach / UTS app' },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 285, statusNote: 'Standard sleeper berth' },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 770, statusNote: 'AC with fresh linen & blanket' },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1090, statusNote: 'Curtained wide 2-tier berth' },
          { classCode: '1A', className: '1st AC (1A)', fareInr: 1850, statusNote: 'Lockable luxury coupe/cabin' },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only #1 Recommended Return Train',
        recommendationReason:
          'HOMI’s One & Only Pick for Return: Direct daily morning express with zero train transfers. Board at 05:35 AM from Jaipur Junction and arrive in Jhansi at 14:05 PM for an easy afternoon return home.',
        pantry: 'Pantry Car onboard + IRCTC E-Catering at Agra Cantt & Gwalior',
        cleanlinessScore: 4.4,
        punctualityScore: 90,
        keyHalts: [
          'JP - Jaipur Junction (05:35)',
          'DO - Dausa (06:22)',
          'BKI - Bandikui Junction (06:55)',
          'BTE - Bharatpur (08:15)',
          'AGC - Agra Cantt (09:40)',
          'DHO - Dholpur (10:50)',
          'GWL - Gwalior (12:05)',
          'VGLJ - Jhansi Junction (14:05)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
      {
        id: 'train-12196-return',
        trainNumber: '12196',
        trainName: 'Ajmer - Agra Intercity / Link to VGLJ',
        fromStationCode: 'JP',
        fromStationName: 'Jaipur Junction',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '16:55',
        arrivalTime: '00:15 (+1 Day)',
        duration: '7h 20m',
        durationMinutes: 440,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: '2S', className: 'Second Seating (2S)', fareInr: 165 },
          { classCode: 'CC', className: 'AC Chair Car (CC)', fareInr: 595 },
        ],
        isRecommended: false,
        pantry: 'Snack vendor service onboard',
        cleanlinessScore: 4.1,
        punctualityScore: 88,
        keyHalts: ['JP - Jaipur (16:55)', 'BKI - Bandikui (18:15)', 'AGC - Agra (20:30)', 'GWL - Gwalior (22:40)', 'VGLJ - Jhansi (00:15)'],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
    ],
  },

  // =========================================================================
  // 3. JHANSI <-> DELHI
  // =========================================================================
  'jhansi-delhi': {
    outbound: [
      {
        id: 'train-12001-outbound',
        trainNumber: '12001',
        trainName: 'Bhopal Shatabdi Express',
        fromStationCode: 'VGLJ',
        fromStationName: 'Virangana Lakshmibai Jhansi Jn',
        toStationCode: 'NDLS',
        toStationName: 'New Delhi Railway Station',
        departureTime: '18:42',
        arrivalTime: '23:50',
        duration: '5h 08m',
        durationMinutes: 308,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: 'CC', className: 'AC Chair Car (CC)', fareInr: 1050, statusNote: 'Includes hot evening snacks & tea' },
          { classCode: 'EC', className: 'Executive Class (EC)', fareInr: 1950, statusNote: 'Spacious 2x2 luxury seating with gourmet dinner' },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only #1 Fast Evening Express',
        recommendationReason:
          'High-speed premier express operating at 130 km/h on the Agra corridor. 99% punctuality record, delicious meals served to your seat, center-to-center travel.',
        pantry: 'Catering included in ticket (Hot dinner & beverages)',
        cleanlinessScore: 4.8,
        punctualityScore: 98,
        keyHalts: ['VGLJ - Jhansi (18:42)', 'GWL - Gwalior (19:40)', 'AGC - Agra Cantt (21:10)', 'MTJ - Mathura (21:50)', 'NDLS - New Delhi (23:50)'],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'outbound',
      },
    ],
    return: [
      {
        id: 'train-12002-return',
        trainNumber: '12002',
        trainName: 'New Delhi - Bhopal Shatabdi Express',
        fromStationCode: 'NDLS',
        fromStationName: 'New Delhi Railway Station',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '06:00',
        arrivalTime: '10:45',
        duration: '4h 45m',
        durationMinutes: 285,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: 'CC', className: 'AC Chair Car (CC)', fareInr: 1050, statusNote: 'Includes complimentary hot breakfast & tea' },
          { classCode: 'EC', className: 'Executive Class (EC)', fareInr: 1950, statusNote: '2x2 wide executive seats with gourmet breakfast' },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only #1 Recommended Return Train',
        recommendationReason:
          'HOMI’s One & Only Morning Return Choice: Board at 06:00 AM at New Delhi and arrive in Jhansi by 10:45 AM. Unmatched 99% on-time record, zero flight hassle, and hot breakfast served right at your seat.',
        pantry: 'Full IRCTC catering included (Breakfast, tea, mineral water)',
        cleanlinessScore: 4.9,
        punctualityScore: 99,
        keyHalts: [
          'NDLS - New Delhi (06:00)',
          'MTJ - Mathura Junction (07:19)',
          'AGC - Agra Cantt (07:50)',
          'GWL - Gwalior Junction (09:23)',
          'VGLJ - Jhansi Junction (10:45)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
      {
        id: 'train-20172-return',
        trainNumber: '20172',
        trainName: 'Rani Kamlapati Vande Bharat Express',
        fromStationCode: 'NZM',
        fromStationName: 'Hazrat Nizamuddin (Delhi)',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '14:40',
        arrivalTime: '19:00',
        duration: '4h 20m',
        durationMinutes: 260,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
        classes: [
          { classCode: 'CC', className: 'AC Chair Car (CC)', fareInr: 1250 },
          { classCode: 'EC', className: 'Executive Class (EC)', fareInr: 2250 },
        ],
        isRecommended: false,
        pantry: 'Onboard gourmet catering with rotating menu',
        cleanlinessScore: 4.9,
        punctualityScore: 98,
        keyHalts: ['NZM - Hazrat Nizamuddin (14:40)', 'AGC - Agra Cantt (16:15)', 'GWL - Gwalior (17:45)', 'VGLJ - Jhansi (19:00)'],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
      {
        id: 'train-12616-return',
        trainNumber: '12616',
        trainName: 'Grand Trunk Express (Overnight Budget Return)',
        fromStationCode: 'NDLS',
        fromStationName: 'New Delhi Railway Station',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '16:10',
        arrivalTime: '23:05',
        duration: '6h 55m',
        durationMinutes: 415,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: 'GEN', className: 'General (UR)', fareInr: 150 },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 275 },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 730 },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1030 },
        ],
        isRecommended: false,
        pantry: 'Pantry Car',
        cleanlinessScore: 4.2,
        punctualityScore: 91,
        keyHalts: ['NDLS - New Delhi (16:10)', 'MTJ - Mathura (18:10)', 'AGC - Agra Cantt (19:00)', 'GWL - Gwalior (21:10)', 'VGLJ - Jhansi (23:05)'],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
    ],
  },

  // =========================================================================
  // 4. JHANSI <-> UDAIPUR
  // =========================================================================
  'jhansi-udaipur': {
    outbound: [
      {
        id: 'train-19665-udaipur-outbound',
        trainNumber: '19665',
        trainName: 'Khajuraho - Udaipur City Express',
        fromStationCode: 'VGLJ',
        fromStationName: 'Virangana Lakshmibai Jhansi Jn',
        toStationCode: 'UDZ',
        toStationName: 'Udaipur City',
        departureTime: '13:40',
        arrivalTime: '06:35 (+1 Day)',
        duration: '16h 55m (Overnight)',
        durationMinutes: 1015,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: 'GEN', className: 'General (UR/2S)', fareInr: 245 },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 445 },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 1210 },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1730 },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only Direct Outbound Train',
        recommendationReason:
          'Direct daily train through eastern Rajasthan. Board at 13:40 PM in Jhansi, sleep comfortably, and arrive at Udaipur City at 06:35 AM right in time for sunrise on Lake Pichola.',
        pantry: 'Pantry Car + E-Catering at Agra Cantt & Ajmer',
        cleanlinessScore: 4.3,
        punctualityScore: 89,
        keyHalts: ['VGLJ - Jhansi (13:40)', 'GWL - Gwalior (15:00)', 'AGC - Agra (17:25)', 'JP - Jaipur (22:15)', 'AII - Ajmer (01:05)', 'UDZ - Udaipur (06:35)'],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'outbound',
      },
    ],
    return: [
      {
        id: 'train-19666-udaipur-return',
        trainNumber: '19666',
        trainName: 'Udaipur City - Khajuraho Express',
        fromStationCode: 'UDZ',
        fromStationName: 'Udaipur City',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '22:15',
        arrivalTime: '14:05 (+1 Day)',
        duration: '15h 50m (Overnight)',
        durationMinutes: 950,
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { classCode: 'GEN', className: 'General (UR/2S)', fareInr: 245, statusNote: 'Unreserved coach / UTS app' },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 445, statusNote: 'Standard sleeper berth' },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 1210, statusNote: 'AC with fresh linen & blanket' },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1730, statusNote: 'Curtained wide 2-tier berth' },
          { classCode: '1A', className: '1st AC (1A)', fareInr: 2950, statusNote: 'Lockable luxury coupe/cabin' },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only #1 Recommended Return Train',
        recommendationReason:
          'HOMI’s One & Only Direct Return Train: Board at 22:15 after sunset dinner by Lake Pichola, sleep through the night across Rajasthan, and roll into Jhansi at 14:05 PM without changing trains.',
        pantry: 'Pantry Car onboard + IRCTC E-Catering at Jaipur & Agra',
        cleanlinessScore: 4.4,
        punctualityScore: 90,
        keyHalts: [
          'UDZ - Udaipur City (22:15)',
          'RPZ - Ranapratapnagar (22:23)',
          'MVJ - Mavli Junction (22:55)',
          'CNA - Chanderiya (00:10)',
          'BHL - Bhilwara (01:00)',
          'AII - Ajmer Junction (03:15)',
          'KSG - Kishangarh (03:45)',
          'JP - Jaipur Junction (05:35)',
          'DO - Dausa (06:22)',
          'BTE - Bharatpur (08:15)',
          'AGC - Agra Cantt (09:40)',
          'DHO - Dholpur (10:50)',
          'GWL - Gwalior (12:05)',
          'VGLJ - Jhansi Junction (14:05)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
    ],
  },

  // =========================================================================
  // 5. JHANSI <-> MUSSOORIE (via Dehradun / Haridwar)
  // =========================================================================
  'jhansi-mussoorie': {
    outbound: [
      {
        id: 'train-12687-mussoorie-outbound',
        trainNumber: '12687',
        trainName: 'Madurai - Dehradun Superfast Express',
        fromStationCode: 'VGLJ',
        fromStationName: 'Virangana Lakshmibai Jhansi Jn',
        toStationCode: 'DDN',
        toStationName: 'Dehradun Railway Station',
        departureTime: '15:20',
        arrivalTime: '05:00 (+1 Day)',
        duration: '13h 40m',
        durationMinutes: 820,
        runningDays: ['Mon', 'Thu'],
        classes: [
          { classCode: 'GEN', className: 'General (UR)', fareInr: 210 },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 385 },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 1040 },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1490 },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only Direct Rail Outbound',
        recommendationReason: 'Direct train to Dehradun foothills. 1h 15m scenic uphill taxi from Dehradun station takes you right into Mussoorie Mall Road.',
        pantry: 'Pantry Car',
        cleanlinessScore: 4.2,
        punctualityScore: 88,
        keyHalts: ['VGLJ - Jhansi (15:20)', 'GWL - Gwalior (16:30)', 'AGC - Agra (18:50)', 'NZM - Delhi (21:40)', 'HW - Haridwar (03:30)', 'DDN - Dehradun (05:00)'],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'outbound',
      },
    ],
    return: [
      {
        id: 'train-12688-mussoorie-return',
        trainNumber: '12688',
        trainName: 'Dehradun - Madurai Superfast Express',
        fromStationCode: 'DDN',
        fromStationName: 'Dehradun (Mussoorie Railhead)',
        toStationCode: 'VGLJ',
        toStationName: 'Virangana Lakshmibai Jhansi Jn',
        departureTime: '06:50',
        arrivalTime: '17:40',
        duration: '10h 50m (Daytime Superfast)',
        durationMinutes: 650,
        runningDays: ['Mon', 'Fri'],
        classes: [
          { classCode: 'GEN', className: 'General (UR/2S)', fareInr: 210, statusNote: 'Unreserved coach / UTS app' },
          { classCode: 'SL', className: 'Sleeper (SL)', fareInr: 385, statusNote: 'Standard sleeper berth' },
          { classCode: '3A', className: '3rd AC (3A)', fareInr: 1040, statusNote: 'AC with fresh linen & blanket' },
          { classCode: '2A', className: '2nd AC (2A)', fareInr: 1490, statusNote: 'Curtained wide 2-tier berth' },
        ],
        isRecommended: true,
        recommendationBadge: 'One & Only #1 Recommended Return Train',
        recommendationReason:
          'HOMI’s One & Only Return Train from Garhwal: Take a 1-hour early taxi down from Mussoorie Library Chowk to Dehradun Station. Board at 06:50 AM, cross Haridwar and Delhi, and arrive in Jhansi by 17:40 PM for dinner.',
        pantry: 'Pantry Car + IRCTC E-Catering at Haridwar & Hazrat Nizamuddin',
        cleanlinessScore: 4.3,
        punctualityScore: 89,
        keyHalts: [
          'DDN - Dehradun (06:50)',
          'HW - Haridwar Junction (08:35)',
          'RK - Roorkee (09:20)',
          'MOZ - Muzaffarnagar (10:30)',
          'GZB - Ghaziabad (12:45)',
          'NZM - Hazrat Nizamuddin (13:40)',
          'AGC - Agra Cantt (15:55)',
          'GWL - Gwalior (16:50)',
          'VGLJ - Jhansi Junction (17:40)',
        ],
        bookingUrl: 'https://www.irctc.co.in/nget/train-search',
        direction: 'return',
      },
    ],
  },
}

export function getTrainsForRoute(origin: string, destination: string, direction: 'outbound' | 'return' = 'return'): DetailedTrain[] {
  const normOrigin = origin.trim().toLowerCase()
  const normDest = destination.trim().toLowerCase()
  const key1 = `${normOrigin}-${normDest}`
  const key2 = `${normDest}-${normOrigin}`

  if (DETAILED_TRAINS_DATABASE[key1]) {
    return DETAILED_TRAINS_DATABASE[key1][direction] || []
  }
  if (DETAILED_TRAINS_DATABASE[key2]) {
    return DETAILED_TRAINS_DATABASE[key2][direction] || []
  }

  // Fallback for Jhansi pairing
  if (normOrigin.includes('jhansi') || normDest.includes('jhansi')) {
    const otherCity = normOrigin.includes('jhansi') ? normDest : normOrigin
    const fallbackKey = `jhansi-${otherCity}`
    if (DETAILED_TRAINS_DATABASE[fallbackKey]) {
      return DETAILED_TRAINS_DATABASE[fallbackKey][direction] || []
    }
  }

  return []
}

export function calculateReturnTransit(destinationCityId: string, homeCity: string = 'Jhansi'): ReturnTransitComparison {
  const normDest = destinationCityId.trim().toLowerCase()
  const normHome = homeCity.trim()

  const destinationNames: Record<string, { name: string; distKm: number }> = {
    varanasi: { name: 'Varanasi', distKm: 520 },
    jaipur: { name: 'Jaipur', distKm: 430 },
    delhi: { name: 'Delhi NCR', distKm: 420 },
    udaipur: { name: 'Udaipur', distKm: 690 },
    mussoorie: { name: 'Mussoorie & Landour', distKm: 650 },
    manali: { name: 'Manali', distKm: 980 },
  }

  const destInfo = destinationNames[normDest] || { name: destinationCityId, distKm: 500 }
  const returnTrains = getTrainsForRoute(normDest, normHome, 'return')
  const recommendedTrain = returnTrains.find((t) => t.isRecommended) || returnTrains[0]

  // Default calibrated return bus & taxi based on destination
  const busConfig: Record<string, ReturnTransitComparison['bus']> = {
    varanasi: {
      operator: 'UPSRTC AC Janrath / Zingbus Multi-Axle Sleeper',
      boardingPoint: 'Varanasi Cantt Depot (Opposite Railway Station)',
      droppingPoint: 'Jhansi Bus Stand (Elite Chauraha)',
      duration: '11h 30m (Overnight)',
      fareFormatted: '₹750 - ₹1,200',
      fareInr: 750,
      schedule: 'Daily departures at 19:30 & 21:00',
      tip: 'Book the 20:00 AC Sleeper via Kanpur bypass for the smoothest highway sleep.',
      bookingUrl: 'https://www.redbus.in/',
    },
    jaipur: {
      operator: 'RSRTC Goldline AC Sleeper / Private Volvo',
      boardingPoint: 'Sindhi Camp / Narayan Singh Circle, Jaipur',
      droppingPoint: 'Jhansi Elite Chauraha',
      duration: '9h 00m',
      fareFormatted: '₹650 - ₹950',
      fareInr: 650,
      schedule: 'Daily departures at 21:30 & 22:30',
      tip: 'Direct night sleeper bus via Dausa, Bharatpur, Agra, and Gwalior bypass.',
      bookingUrl: 'https://www.redbus.in/',
    },
    delhi: {
      operator: 'UPSRTC Platinum Volvo / Zingbus AC Sleeper',
      boardingPoint: 'ISBT Anand Vihar / Kashmiri Gate / Akshardham',
      droppingPoint: 'Jhansi Bypass / Elite Chauraha',
      duration: '7h 30m',
      fareFormatted: '₹650 - ₹1,100',
      fareInr: 650,
      schedule: 'Hourly service 24x7',
      tip: 'Yamuna Expressway & Taj Express Highway offers seamless overnight transit.',
      bookingUrl: 'https://www.redbus.in/',
    },
    udaipur: {
      operator: 'Shrinath Travels Multi-Axle AC Sleeper',
      boardingPoint: 'Udiapole, Udaipur',
      droppingPoint: 'Jhansi Bypass',
      duration: '14h 00m (Overnight)',
      fareFormatted: '₹950 - ₹1,500',
      fareInr: 950,
      schedule: 'Daily 19:00 departure',
      tip: 'Train 19666 is recommended over the bus for much superior sleep quality.',
      bookingUrl: 'https://www.redbus.in/',
    },
    mussoorie: {
      operator: 'UTC Royal Cruiser Volvo (Dehradun to Delhi/Jhansi link)',
      boardingPoint: 'Mussoorie Picture Palace -> Dehradun ISBT',
      droppingPoint: 'Jhansi Elite Chauraha',
      duration: '13h 00m',
      fareFormatted: '₹950 - ₹1,600',
      fareInr: 950,
      schedule: 'Evening departures from Dehradun ISBT',
      tip: 'Take an afternoon cab down from Mussoorie to Dehradun ISBT before 17:00.',
      bookingUrl: 'https://www.redbus.in/',
    },
    manali: {
      operator: 'HRTC Himsuta 2+2 AC Volvo + Intercity Train Link',
      boardingPoint: 'Manali Mall Road Private Bus Stand',
      droppingPoint: 'Delhi ISBT Kashmere Gate -> Transfer to Jhansi',
      duration: '18h 00m total',
      fareFormatted: '₹1,450 - ₹2,400',
      fareInr: 1450,
      schedule: 'Daily 17:30 & 18:30 departures from Manali',
      tip: 'Board the evening 18:00 Volvo, sleep through the mountains, reach Delhi at 06:30, and take Shatabdi to Jhansi.',
      bookingUrl: 'https://www.redbus.in/',
    },
  }

  const taxiConfig: Record<string, ReturnTransitComparison['taxi']> = {
    varanasi: {
      highway: 'NH19 (GT Road) -> Kanpur Bypass -> NH27 Bundelkhand Highway',
      duration: '9h 30m',
      fareFormatted: '₹6,500 - ₹8,500 (Sedan/Ertiga)',
      fareInr: 6500,
      tollEstimatedInr: 580,
      tip: 'Depart Varanasi by 06:00 AM to reach Jhansi before 16:00 PM with lunch at Kanpur.',
    },
    jaipur: {
      highway: 'Jaipur -> Dausa -> Agra-Lucknow Expressway link -> Gwalior -> Jhansi NH44',
      duration: '7h 45m',
      fareFormatted: '₹5,500 - ₹7,500',
      fareInr: 5500,
      tollEstimatedInr: 490,
      tip: 'Smooth 4-lane highway; stop at Bharatpur for hot breakfast.',
    },
    delhi: {
      highway: 'Yamuna Expressway -> Agra Bypass -> NH44 Gwalior -> Jhansi',
      duration: '6h 30m',
      fareFormatted: '₹5,200 - ₹7,000',
      fareInr: 5200,
      tollEstimatedInr: 620,
      tip: '6-lane concrete Yamuna Expressway makes this one of the smoothest long drives in India.',
    },
    udaipur: {
      highway: 'Udaipur -> Chittorgarh -> Kota -> Shivpuri -> Jhansi (NH27 East-West Corridor)',
      duration: '11h 30m',
      fareFormatted: '₹8,500 - ₹11,500',
      fareInr: 8500,
      tollEstimatedInr: 740,
      tip: 'Scenic drive across central Rajasthan and the Chambal river ravines.',
    },
    mussoorie: {
      highway: 'Mussoorie -> Dehradun -> Roorkee -> Meerut Expressway -> Delhi -> NH44 Jhansi',
      duration: '11h 00m',
      fareFormatted: '₹7,800 - ₹10,500',
      fareInr: 7800,
      tollEstimatedInr: 820,
      tip: 'Leave Mussoorie at 07:00 AM to bypass Delhi afternoon ring road traffic.',
    },
    manali: {
      highway: 'Manali -> Chandigarh -> Delhi Eastern Peripheral -> NH44 Jhansi',
      duration: '17h 00m',
      fareFormatted: '₹14,000 - ₹18,000',
      fareInr: 14000,
      tollEstimatedInr: 1250,
      tip: 'Requires two seasoned drivers or an overnight halt at Chandigarh or Ambala.',
    },
  }

  return {
    originCityName: homeCity,
    destinationCityId: normDest,
    destinationCityName: destInfo.name,
    distanceKm: destInfo.distKm,
    recommendedMode: 'train',
    recommendationReason: recommendedTrain
      ? `Train #${recommendedTrain.trainNumber} (${recommendedTrain.trainName}) is the undisputed #1 return choice: ${recommendedTrain.recommendationReason}`
      : 'Express train is the safest, most economical, and most punctual return option.',
    trains: returnTrains,
    recommendedTrain: recommendedTrain,
    bus: busConfig[normDest] || busConfig.varanasi,
    taxi: taxiConfig[normDest] || taxiConfig.varanasi,
  }
}

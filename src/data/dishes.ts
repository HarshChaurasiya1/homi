import type { LocalDish } from './types'

export const LOCAL_DISHES: LocalDish[] = [
  // ==================== JAIPUR ====================
  {
    id: 'jaipur-pyaaz-kachori',
    cityId: 'jaipur',
    name: 'Crisp Pyaaz Kachori with Tangy Tamarind Chutney',
    hindiName: 'प्याज़ की कचौरी',
    type: 'snack',
    description:
      'Golden, flaky multi-layered pastry stuffed with a piping-hot filling of spiced caramelized onions, nigella seeds, and aromatic garam masala.',
    originStory:
      'A Rajasthani culinary trademark perfected for morning travelers arriving by train at Jaipur Junction.',
    iconicSpotName: 'Rawat Mishthan Bhandar',
    spotNeighborhood: 'Station Road, Sindhi Camp, Jaipur',
    approxPriceInr: 50,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jaipur-paneer-ghewar',
    cityId: 'jaipur',
    name: 'Honeycomb Malai & Paneer Ghewar',
    hindiName: 'मलाई घेवर',
    type: 'sweet',
    description:
      'A disc-shaped honeycomb sweet soaked in cardamom saffron syrup and crowned with a thick layer of set rabdi and toasted almonds.',
    originStory:
      'Customarily presented during royal Teej and Raksha Bandhan festivities across the Pink City.',
    iconicSpotName: 'Laxmi Mishthan Bhandar (LMB)',
    spotNeighborhood: 'Johari Bazaar, Pink City',
    approxPriceInr: 120,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
  },

  // ==================== UDAIPUR ====================
  {
    id: 'udaipur-dal-baati',
    cityId: 'udaipur',
    name: 'Authentic Mewari Dal Baati Churma',
    hindiName: 'मेवाड़ी दाल बाटी चूरमा',
    type: 'veg',
    description:
      'Crisp wheat baatis baked to perfection, crushed and drenched in pure melted desi ghee, served with five-lentil panchmel dal, garlic chutney, and rose petal churma.',
    originStory:
      'The sacred culinary foundation of Mewar warriors, prepared using slow woodfire earthen ovens.',
    iconicSpotName: 'Krishna Dal Bati Restro',
    spotNeighborhood: 'Gulab Bagh Road, Udaipur',
    approxPriceInr: 320,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'udaipur-mirchi-vada',
    cityId: 'udaipur',
    name: 'Jumbo Mewari Mirchi Vada with Mint Chutney',
    hindiName: 'मिर्ची वड़ा',
    type: 'snack',
    description:
      'Plump Bhavnagri mild green chillies stuffed with tangy spiced mashed potatoes, dipped in gram flour batter and fried until blistered and golden.',
    originStory:
      'The quintessential late-morning companion to a piping hot cup of ginger chai near Jagdish Temple.',
    iconicSpotName: 'Manak Balaji Mirchi Vada',
    spotNeighborhood: 'Jagdish Chowk, Old City Udaipur',
    approxPriceInr: 40,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'udaipur-ker-sangri',
    cityId: 'udaipur',
    name: 'Traditional Ker Sangri & Bajra Roti',
    hindiName: 'केर सांगरी',
    type: 'veg',
    description:
      'Wild desert capers and dried beans stir-fried in mustard oil with whole red chillies and dry mango powder, served with hot bajra flatbread.',
    originStory:
      'A culinary triumph of desert ingenuity where wild dried shrubs sustained the kingdom through arid winters.',
    iconicSpotName: 'Ambrai Restaurant',
    spotNeighborhood: 'Amet Haveli, Naga Nagri, Lake Pichola',
    approxPriceInr: 450,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  },

  // ==================== MANALI ====================
  {
    id: 'manali-siddu',
    cityId: 'manali',
    name: 'Steaming Himachali Siddu with Pure Ghee',
    hindiName: 'हिमाचली सिड्डू',
    type: 'veg',
    description:
      'Warm fermented wheat dumplings generously filled with crushed roasted walnuts, poppy seeds (khashkhash), and mountain spices, sliced open and dipped in a bowl of warm clarified ghee.',
    originStory:
      'The traditional high-altitude winter staple of Kullu valley, designed to provide long-lasting warmth against snowy winds.',
    iconicSpotName: 'Siddu Corner & Old Manali Village Kitchen',
    spotNeighborhood: 'Club House Road, Old Manali',
    approxPriceInr: 90,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'manali-trout-fish',
    cityId: 'manali',
    name: 'Pan-Seared Himalayan Rainbow Trout',
    hindiName: 'हिमालयन ट्राउट फिश',
    type: 'non-veg',
    description:
      'Freshly caught cold-water trout from the crystal-clear Beas river, pan-seared in butter with wild mountain thyme, lemon zest, and roasted baby potatoes.',
    originStory:
      'Introduced to the gushing snowmelt streams of Himachal in the early 20th century, becoming Manali’s premier culinary treat.',
    iconicSpotName: 'Cafe 1947 & Johnson’s Cafe',
    spotNeighborhood: 'Near Nehru Kund & Circuit House, Manali',
    approxPriceInr: 550,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },

  // ==================== VARANASI ====================
  {
    id: 'varanasi-tamatar-chaat',
    cityId: 'varanasi',
    name: 'Fiery Kashi Tamatar Chaat in Earthen Kulhad',
    hindiName: 'काशी टमाटर चाट',
    type: 'snack',
    description:
      'Spiced, stewed ripe tomatoes blended with roasted cumin, asafoetida, cashews, and mashed potatoes, topped with sugar syrup and crunchy namak para.',
    originStory:
      'A preparation completely unique to Varanasi that you will not find anywhere else in northern India.',
    iconicSpotName: 'Kashi Chaat Bhandar',
    spotNeighborhood: 'Dashashwamedh Ghat Road, Varanasi',
    approxPriceInr: 60,
    image: '/assets/cities/varanasi/food-and-sweets/tamatar-chaat-desi-ghee-spiced.webp',
  },
  {
    id: 'varanasi-malaiyo',
    cityId: 'varanasi',
    name: 'Winter Cloud Malaiyo with Saffron & Pistachio',
    hindiName: 'मलइयो',
    type: 'sweet',
    description:
      'An ethereal, cloud-like foam churned from morning dew-condensed milk, delicately infused with saffron and cardamom, served in clay kulhads.',
    originStory:
      'Crafted exclusively during the chilly winter dawn from November to February on the ancient rooftops of the walled city.',
    iconicSpotName: 'Shreeji Sweets & Markandey Malaiyo',
    spotNeighborhood: 'Thatheri Bazaar, Chowk, Varanasi',
    approxPriceInr: 50,
    image: '/assets/cities/varanasi/food-and-sweets/varanasi-malaiyo-earthen-kullhad.webp',
  },
  {
    id: 'varanasi-banarasi-paan',
    cityId: 'varanasi',
    name: 'Legendary Banarasi Meetha Paan',
    hindiName: 'बनारसी मीठा पान',
    type: 'sweet',
    description:
      'Tender betel leaf layered with rose petal gulkand, sweet fennel, candied dates, and silver foil that melts effortlessly in your mouth.',
    originStory:
      'Celebrated for centuries in classical Sanskrit literature and Indian cinema as the ultimate post-meal digestive ritual.',
    iconicSpotName: 'Keshav Tambool Bhandar',
    spotNeighborhood: 'Near Lanka Gate, Banaras Hindu University',
    approxPriceInr: 35,
    image: '/assets/cities/varanasi/food-and-sweets/banarasi-meetha-paan-gulkand.webp',
  },
  {
    id: 'varanasi-kachori-jalebi',
    cityId: 'varanasi',
    name: 'Ram Bhandar Urad Dal Kachori & Crisp Jalebi',
    hindiName: 'कचौड़ी-जलेबी',
    type: 'snack',
    description:
      'Crispy, hollow urad dal kachoris crushed over fiery hing potato curry, accompanied by piping hot golden syrup jalebis.',
    originStory:
      'The sacred dawn breakfast ritual of Varanasi residents since the early 19th century.',
    iconicSpotName: 'Ram Bhandar',
    spotNeighborhood: 'Thatheri Bazaar, Chowk',
    approxPriceInr: 70,
    image: '/assets/cities/varanasi/food-and-sweets/rambhandar-kachori-sabzi-jalebi.webp',
  },
  {
    id: 'varanasi-blue-lassi',
    cityId: 'varanasi',
    name: 'Hand-Churned Creamy Rabri & Fruit Lassi',
    hindiName: 'बनारसी लस्सी',
    type: 'sweet',
    description:
      'Thick, velvety hand-churned yogurt topped with thick malai cream, rabri, roasted pistachios, and fresh pomegranate.',
    originStory:
      'Hand-churned with traditional wooden mathani in tiny earthen cups for over 90 years.',
    iconicSpotName: 'Blue Lassi Shop',
    spotNeighborhood: 'Bangali Tola (near Manikarnika Ghat)',
    approxPriceInr: 80,
    image: '/assets/cities/varanasi/food-and-sweets/blue-lassi-pomegranate-rabri.webp',
  },

  // ==================== MUSSOORIE ====================
  {
    id: 'mussoorie-apple-pie',
    cityId: 'mussoorie',
    name: 'Freshly Baked Landour Cinnamon Apple Pie',
    hindiName: 'लैंडौर एप्पल पाई',
    type: 'sweet',
    description:
      'Flaky buttery pastry filled with cinnamon-spiced local Himalayan apples, served warm with a scoop of vanilla bean ice cream.',
    originStory:
      'Baked using heirloom recipes from the 19th-century Landour Community Cookbook compiled by American and British residents.',
    iconicSpotName: 'Landour Bakehouse',
    spotNeighborhood: 'Sisters Bazaar, Landour, Mussoorie',
    approxPriceInr: 220,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mussoorie-char-dukan-omelette',
    cityId: 'mussoorie',
    name: 'Char Dukan Butter Bun Omelette & Masala Chai',
    hindiName: 'चार दुकान बन ऑमलेट',
    type: 'snack',
    description:
      'A fluffy two-egg masala omelette wrapped inside a toasted sweet bun with generous layers of melting salted Amul butter and black pepper.',
    originStory:
      'The iconic student and writer morning pitstop outside St. Paul’s Church since the 1950s.',
    iconicSpotName: 'Anil’s Cafe at Char Dukan',
    spotNeighborhood: 'Char Dukan, Upper Landour, Mussoorie',
    approxPriceInr: 95,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mussoorie-tibetan-tingmo',
    cityId: 'mussoorie',
    name: 'Steamed Tibetan Tingmo & Spicy Thukpa',
    hindiName: 'तिब्बती टिंगमो और थुकपा',
    type: 'veg',
    description:
      'Flower-shaped steamed lotus bread served alongside piping hot Tibetan noodle soup simmered with local mountain greens and spicy chilli oil.',
    originStory:
      'Celebrated across Mussoorie ever since the 14th Dalai Lama made his first home in Happy Valley in 1959.',
    iconicSpotName: 'Kalsang Friends Corner',
    spotNeighborhood: 'The Mall Road, Mussoorie',
    approxPriceInr: 240,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
]

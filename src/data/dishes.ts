import type { LocalDish } from './types'


export const LOCAL_DISHES: LocalDish[] = [
  // Delhi iconic dishes
  {
    id: 'delhi-chole-bhature',
    cityId: 'delhi',
    name: 'Chole Bhature with Pickled Green Chilli & Amla',
    hindiName: 'छोले भटूरे',
    type: 'veg',
    description:
      'Pillowy, golden fried bhaturas served with slow-simmered dark pindi chole infused with pomegranate seeds and dried anardana.',
    originStory:
      'Refined to perfection by Punjabi migrants after 1947, becoming Delhi’s definitive weekend breakfast obsession.',
    iconicSpotName: 'Sita Ram Diwan Chand',
    spotNeighborhood: 'Chuna Mandi, Paharganj (also Nagpal in Lajpat Nagar)',
    approxPriceInr: 90,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'delhi-old-delhi-nihari',
    cityId: 'delhi',
    name: 'Old Delhi Nihari with Tandoori Khameeri Roti',
    hindiName: 'पुरानी दिल्ली की निहारी',
    type: 'non-veg',
    description:
      'A rich, velvety bone-marrow stew simmered overnight in copper deghs with over 30 aromatic spices, finished with fresh ginger juliennes and lime.',
    originStory:
      'Created in royal Mughal kitchens during the reign of Shah Jahan as an invigorating dawn breakfast during frosty Delhi winters.',
    iconicSpotName: 'Haji Shabrati Nihari Wale',
    spotNeighborhood: 'Haveli Azam Khan, Chitli Qabar, Old Delhi',
    approxPriceInr: 180,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'delhi-dahi-bhalla',
    cityId: 'delhi',
    name: 'Chandni Chowk Dahi Bhalla & Papdi Chaat',
    hindiName: 'दही भल्ला पापड़ी',
    type: 'veg',
    description:
      'Spongy urad dal fritters soaked in chilled beaten curd, doused with sweet saunth chutney, zesty mint paste, and secret roasted cumin chaat masala.',
    originStory:
      'Served since 1940 at the corner of Paranthe Wali Gali; legend has it only two master sauces are used to build the dish.',
    iconicSpotName: 'Natraj Dahi Bhalla Corner',
    spotNeighborhood: 'Near Town Hall, Chandni Chowk',
    approxPriceInr: 70,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'delhi-daulat-ki-chaat',
    cityId: 'delhi',
    name: 'Daulat ki Chaat (Winter Milk Cloud)',
    hindiName: 'दौलत की चाट',
    type: 'sweet',
    description:
      'An ethereal, cloud-like foam churned from morning dew-condensed milk, topped with saffron syrup, pistachios, and delicate silver vark.',
    originStory:
      'Prepared exclusively in the chill of November to February, where winter night dew aids the delicate frothing process.',
    iconicSpotName: 'Khemchand Adesh Kumar',
    spotNeighborhood: 'Dariba Kalan & Kinari Bazaar, Old Delhi',
    approxPriceInr: 60,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
  },

  // Jaipur iconic dishes
  {
    id: 'jaipur-pyaaz-kachori',
    cityId: 'jaipur',
    name: 'Crisp Pyaaz Kachori with Tangy Tamarind Chutney',
    hindiName: 'प्याज़ की कचौरी',
    type: 'snack',
    description:
      'Golden, flaky multi-layered deep-fried pastry stuffed with a piping-hot filling of spiced caramelized onions, nigella seeds, and garam masala.',
    originStory:
      'A Rajasthani culinary trademark perfected for morning travelers arriving by train at Jaipur Junction.',
    iconicSpotName: 'Rawat Mishthan Bhandar',
    spotNeighborhood: 'Station Road, Sindhi Camp, Jaipur',
    approxPriceInr: 50,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jaipur-dal-baati-churma',
    cityId: 'jaipur',
    name: 'Traditional Dal Baati Churma with Pure Desi Ghee',
    hindiName: 'दाल बाटी चूरमा',
    type: 'veg',
    description:
      'Hard wheat rolls baked over cow dung embers, crushed and drowned in hot desi ghee, accompanied by five-lentil panchmel dal, garlic chutney, and jaggery churma.',
    originStory:
      'Originated as wartime ration in the Rajput era, where baatis were buried in desert sand beneath campfires while warriors fought.',
    iconicSpotName: 'Laxmi Mishthan Bhandar (LMB) & Thali House',
    spotNeighborhood: 'Johari Bazaar, Pink City',
    approxPriceInr: 350,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jaipur-paneer-ghewar',
    cityId: 'jaipur',
    name: 'Honeycomb Malai & Paneer Ghewar',
    hindiName: 'मलाई घेवर',
    type: 'sweet',
    description:
      'A disc-shaped honeycomb sweet soaked in cardamom saffron sugar syrup and crowned with a thick layer of set rabdi and toasted almonds.',
    originStory:
      'Customarily presented during the monsoon festivals of Teej and Raksha Bandhan across the royal court of Jaipur.',
    iconicSpotName: 'Sambhar Fini & Ghewar Wale',
    spotNeighborhood: 'Ghee Walon ka Rasta, Johari Bazaar',
    approxPriceInr: 120,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jaipur-laal-maas',
    cityId: 'jaipur',
    name: 'Smoked Junglee Laal Maas',
    hindiName: 'लाल मांस',
    type: 'non-veg',
    description:
      'A fiery Rajasthani meat curry braised in cold-pressed mustard oil with Mathania dried red chillies, garlic, and hot charcoal smoke.',
    originStory:
      'Originally cooked by royal Rajput hunting parties who seasoned wild game using only dried chillies and water fetched from village stepwells.',
    iconicSpotName: 'Handi Restaurant & 1135 AD',
    spotNeighborhood: 'MI Road, Jaipur',
    approxPriceInr: 450,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
]

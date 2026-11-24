/**
 * Services and About Us content configuration for Deekshitha Travels.
 * Phase 7: Verified client information for services, locations, and business identity.
 */

export const ABOUT_CONTENT = {
  sectionBadge: "About Deekshitha Travels",
  mainHeading: "Reliable Taxi Services & Car Rentals in Tirupati.",
  description:
    "Deekshitha Travels provides dependable taxi services, local travel, airport pickup and drop, and car rentals for customers across Tirupati, Renigunta, and Tirupati Airport. Whether you require prompt airport transportation, local city travel, or a flexible rental vehicle, our priority is to make every journey comfortable, punctual, and hassle-free.",
  image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80",
  imageAlt: "Comfortable and safe travel with Deekshitha Travels in Tirupati",
  highlights: [
    {
      id: "taxi-services",
      title: "Taxi Services",
      description: "On-demand and scheduled taxi services across Tirupati, Renigunta, and outstation trips."
    },
    {
      id: "local-travel",
      title: "Local Travel",
      description: "Comfortable city rides for temple visits, shopping, and everyday transit in Tirupati."
    },
    {
      id: "airport-transfers",
      title: "Airport Pickup and Drop",
      description: "Punctual transfers to and from Tirupati Airport with hassle-free doorstep pickup."
    },
    {
      id: "car-rentals",
      title: "Car Rentals",
      description: "Flexible vehicle rental options tailored to your personal, family, or business travel."
    }
  ]
};

export const SERVICES_LIST = [
  {
    id: "taxi-services",
    title: "Taxi Services",
    subtitle: "Point-to-Point & Outstation",
    badge: "24/7 Available",
    rateNote: "Affordable km rates",
    features: ["Round & One-Way", "Doorstep Pickup"],
    description: "Reliable, comfortable taxi services for round trips, one-way drops, and outstation travel across the Tirupati region.",
    image: "/images/services/taxi_services.webp",
    imageAlt: "Deekshitha Travels taxi services in Tirupati",
    icon: "taxi",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Taxi Services."
  },
  {
    id: "local-travel",
    title: "Local Travel",
    subtitle: "City Rides & Temple Visits",
    badge: "Darshan Transit",
    rateNote: "Hourly & full-day",
    features: ["Temple Packages", "City Errand Drops"],
    description: "Convenient local travel solutions across Tirupati for temple darshan, city errands, sightseeing, and railway transfers.",
    image: "/images/services/local_travel.webp",
    imageAlt: "Local travel taxi services in Tirupati",
    icon: "map-pin",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Local Travel in Tirupati."
  },
  {
    id: "airport-pickup-drop",
    title: "Airport Transfers",
    subtitle: "Tirupati Airport Pickup & Drop",
    badge: "Flight Punctual",
    rateNote: "Fixed transparent fares",
    features: ["Flight Tracking", "Luggage Support"],
    description: "Prompt airport transfer services connecting Tirupati Airport, Renigunta, and Tirupati city with on-time pickups.",
    image: "/images/services/airport_transfers.webp",
    imageAlt: "Airport pickup and drop services at Tirupati Airport",
    icon: "plane",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Airport Pickup and Drop services."
  },
  {
    id: "car-rentals",
    title: "Car Rentals",
    subtitle: "Flexible Rental Packages",
    badge: "Custom Plans",
    rateNote: "Driver included",
    features: ["Sedan & MPV", "Family & Corporate"],
    description: "Vehicle rental packages with well-maintained cars for personal, family, or corporate travel needs.",
    image: "/images/services/car_rentals.webp",
    imageAlt: "Car rental options by Deekshitha Travels in Tirupati",
    icon: "key",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Car Rentals."
  }
];

export const LOCATION_CATEGORIES = [
  { id: "all", label: "All Hubs" },
  { id: "transit", label: "Airports & Transit" },
  { id: "temples", label: "Pilgrimage Temples" },
  { id: "areas", label: "Key Areas & Sightseeing" },
  { id: "institutions", label: "Hospitals & Campuses" }
];

export const SERVICE_LOCATIONS = [
  // 1. Airports & Transportation
  {
    id: "tirupati-airport",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Tirupati International Airport",
    areaType: "Terminal Pickup & Drop",
    badge: "Flight Tracking",
    image: "/images/hero/tirupati_airport.webp",
    description: "24/7 flight-aligned taxi pickups, drop-offs, and flight tracking with luggage support at Renigunta terminal."
  },
  {
    id: "tirupati-railway-station",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Tirupati Railway Station (TPTY)",
    areaType: "Main Rail Terminal",
    badge: "Platform Pickup",
    image: "/images/hero/chennai_city_transit.webp",
    description: "Platform-side pickup and transfer directly to hotels, Tirumala ghat road, or surrounding temple circuits."
  },
  {
    id: "renigunta-junction",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Renigunta Railway Junction (RU)",
    areaType: "Major Junction Hub",
    badge: "24/7 Cab Hub",
    image: "/images/hero/chennai_city_transit.webp",
    description: "Round-the-clock cab availability for long-distance trains arriving at Renigunta junction."
  },
  {
    id: "tirupati-bus-station",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Tirupati Central Bus Station (CBS)",
    areaType: "APSRTC Central Depot",
    badge: "Central Depot",
    image: "/images/services/taxi_services.webp",
    description: "Prompt pickups and drops connecting the central bus complex to hotels and pilgrimage sites."
  },
  {
    id: "alipiri-bus-station",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Alipiri Bus Station & Foothills",
    areaType: "Tirumala Gateway",
    badge: "Hill Foothills",
    image: "/images/hero/tirumala_ghat_road.webp",
    description: "Gateway point for uphill vehicles and pilgrims walking the traditional Alipiri Mettu footpath."
  },
  {
    id: "chennai-transit",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Chennai Airport & Central (MAS)",
    areaType: "Outstation Transit Hub",
    badge: "135 km Transit",
    image: "/images/hero/chennai_city_transit.webp",
    description: "Reliable highway taxi service connecting Tirupati to Chennai International Airport and Central station."
  },

  // 2. Famous Temples & Pilgrimage Destinations
  {
    id: "tirumala-temple",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Tirumala Sri Venkateswara Temple",
    areaType: "Sacred Hill Shrine",
    badge: "Ghat Road Special",
    image: "/images/hero/tirumala_temple_gopuram.webp",
    description: "Specialized uphill and downhill ghat road taxi trips with experienced hill drivers and return waiting."
  },
  {
    id: "padmavathi-temple",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Sri Padmavathi Ammavari Temple",
    areaType: "Tiruchanur Pilgrimage",
    badge: "5 km from City",
    image: "/images/hero/padmavathi_ammavari_temple.webp",
    description: "Dedicated cab service for darshan at Tiruchanur, complete with custom waiting and return packages."
  },
  {
    id: "kapila-theertham",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Kapila Theertham Temple & Falls",
    areaType: "Sacred Waterfall Shrine",
    badge: "Holy Waterfalls",
    image: "/images/hero/kapila_theertham.webp",
    description: "Comfortable city transit to the holy Shiva temple and natural waterfall at the foot of Seshachalam hills."
  },
  {
    id: "srikalahasti-temple",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Srikalahasteeswara Temple",
    areaType: "Rahu-Ketu Kshetra",
    badge: "38 km Circuit",
    image: "/images/hero/srikalahasti_temple.webp",
    description: "Specialized darshan taxi packages for Rahu Ketu sarpa dosha nivarana pooja at Srikalahasti."
  },
  {
    id: "kanipakam-temple",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Kanipakam Vinayaka Temple",
    areaType: "Swayambhu Ganesha",
    badge: "70 km Circuit",
    image: "/images/hero/kanipakam_vinayaka_temple.webp",
    description: "Smooth outstation taxi service to the historic self-manifested Swayambhu Varasiddhi Vinayaka temple."
  },
  {
    id: "golden-temple-sripuram",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Golden Temple, Sripuram",
    areaType: "Sri Lakshmi Narayani",
    badge: "110 km Circuit",
    image: "/images/hero/sripuram_golden_temple.webp",
    description: "Full-day outstation taxi tours to the magnificent pure-gold spiritual park and shrine in Vellore."
  },
  {
    id: "arunachalam-temple",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Arunachalam (Tiruvannamalai)",
    areaType: "Agni Linga Kshetra",
    badge: "195 km Circuit",
    image: "/images/hero/arunachalam_temple.webp",
    description: "Dedicated pilgrimage taxi service for Arunachaleswarar darshan and sacred Girivalam pradakshina."
  },
  {
    id: "kanchipuram-temple",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Kanchipuram Heritage Temples",
    areaType: "City of Thousand Temples",
    badge: "115 km Circuit",
    image: "/images/hero/kanchipuram_temples.webp",
    description: "Pilgrimage trips to Kamakshi Amman, Varadharaja Perumal and Ekambareswarar temples."
  },
  {
    id: "iskcon-tirupati",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "ISKCON Temple Tirupati",
    areaType: "Radha Govinda Mandir",
    badge: "Alipiri Bypass",
    image: "/images/hero/padmavathi_ammavari_temple.webp",
    description: "Convenient local transfers for tourists and devotees visiting ISKCON along Alipiri Bypass Road."
  },
  {
    id: "srinivasa-mangapuram",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Srinivasa Mangapuram Temple",
    areaType: "Kalyana Venkateswara",
    badge: "12 km West",
    image: "/images/hero/tirumala_ghat_road.webp",
    description: "Smooth outstation-style taxi rides to the historic temple located 12 km west of Tirupati."
  },
  {
    id: "govindaraja-swamy",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Sri Govindaraja Swamy Temple",
    areaType: "Heart of Tirupati",
    badge: "Raja Gopuram",
    image: "/images/hero/tirumala_temple_gopuram.webp",
    description: "Quick city taxi drops right by the historic Raja Gopuram near the Tirupati Railway Station."
  },

  // 3. Key Areas & Sightseeing
  {
    id: "mahabalipuram-shore",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Mahabalipuram Shore Temple",
    areaType: "UNESCO Coastal Heritage",
    badge: "155 km Coastal",
    image: "/images/hero/mahabalipuram_shore_temple.webp",
    description: "Scenic coastal highway taxi rides to 8th-century shore temples and rock-cut monuments."
  },
  {
    id: "pondicherry-getaway",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Pondicherry Beach & Promenade",
    areaType: "Coastal French Quarter",
    badge: "235 km Getaway",
    image: "/images/hero/pondicherry_promenade.webp",
    description: "Custom holiday cab packages to French Quarter, Promenade Beach, Auroville and seaside cafes."
  },
  {
    id: "chandragiri-fort",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Chandragiri Fort & Heritage Park",
    areaType: "Historical Sightseeing",
    badge: "14 km Sightseeing",
    image: "/images/hero/vellore_cmc_and_fort.webp",
    description: "Sightseeing packages with driver waiting for the Raja Mahal Museum and the evening Light & Sound show."
  },
  {
    id: "tiruchanur-area",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Tiruchanur & Suburbs",
    areaType: "Pilgrimage & Residential",
    badge: "Marriage Halls",
    image: "/images/hero/padmavathi_ammavari_temple.webp",
    description: "Frequent point-to-point taxi services connecting Tiruchanur town, marriage halls, and hotels."
  },
  {
    id: "renigunta-city",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Renigunta Industrial & Town Area",
    areaType: "Industrial & Transit",
    badge: "Business Transit",
    image: "/images/hero/tirupati_airport.webp",
    description: "Regular corporate and local cab rides across Renigunta industrial zones and residential pockets."
  },
  {
    id: "tirupati-city-centre",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Tirupati City Centre",
    areaType: "Bhavani Nagar & Markets",
    badge: "City Shopping",
    image: "/images/services/local_travel.webp",
    description: "Door-to-door cab bookings across major markets, shopping centers, lodges, and residential neighborhoods."
  },

  // 4. Hospitals & Educational Campuses
  {
    id: "vellore-cmc",
    category: "institutions",
    categoryLabel: "Hospitals & Campuses",
    name: "CMC Hospital Vellore",
    areaType: "Premier Healthcare Hub",
    badge: "105 km Medical",
    image: "/images/hero/vellore_cmc_and_fort.webp",
    description: "Comfortable, compassionate patient transportation from Tirupati to Christian Medical College Vellore."
  },
  {
    id: "svims-hospital",
    category: "institutions",
    categoryLabel: "Hospitals & Campuses",
    name: "SVIMS & BIRRD Super Speciality",
    areaType: "Medical Healthcare Hub",
    badge: "Super Speciality",
    image: "/images/hero/vellore_cmc_and_fort.webp",
    description: "Priority emergency and scheduled transportation for patients, attendants, and visiting doctors."
  },
  {
    id: "ruia-hospital",
    category: "institutions",
    categoryLabel: "Hospitals & Campuses",
    name: "Ruia Government General Hospital",
    areaType: "Regional Medical Center",
    badge: "General Hospital",
    image: "/images/services/local_travel.webp",
    description: "Reliable patient transit and doorstep pickup connecting Ruia Hospital with regional towns."
  },
  {
    id: "sv-university",
    category: "institutions",
    categoryLabel: "Hospitals & Campuses",
    name: "Sri Venkateswara University (SVU)",
    areaType: "Educational Campus",
    badge: "University Campus",
    image: "/images/hero/tirumala_ghat_road.webp",
    description: "Campus transit for students, parents, faculty, and visiting delegations across the sprawling SVU grounds."
  },
  {
    id: "ttd-administrative",
    category: "institutions",
    categoryLabel: "Hospitals & Campuses",
    name: "TTD Administrative Buildings",
    areaType: "KT Road Government Hub",
    badge: "KT Road Hub",
    image: "/images/hero/padmavathi_ammavari_temple.webp",
    description: "Hassle-free transfers to TTD administrative offices, darshan pass counters, and KT Road institutions."
  }
];

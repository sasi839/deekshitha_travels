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
    description: "Reliable, comfortable taxi services for round trips, one-way drops, and outstation travel across the Tirupati region.",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Deekshitha Travels taxi services in Tirupati",
    icon: "taxi",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Taxi Services."
  },
  {
    id: "local-travel",
    title: "Local Travel",
    subtitle: "City Rides & Temple Visits",
    description: "Convenient local travel solutions across Tirupati for temple darshan, city errands, sightseeing, and railway transfers.",
    image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Local travel taxi services in Tirupati",
    icon: "map-pin",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Local Travel in Tirupati."
  },
  {
    id: "airport-pickup-drop",
    title: "Airport Pickup and Drop",
    subtitle: "Tirupati Airport Transfers",
    description: "Prompt airport transfer services connecting Tirupati Airport, Renigunta, and Tirupati city with on-time pickups.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Airport pickup and drop services at Tirupati Airport",
    icon: "plane",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Airport Pickup and Drop services."
  },
  {
    id: "car-rentals",
    title: "Car Rentals",
    subtitle: "Flexible Rental Packages",
    description: "Vehicle rental packages with well-maintained cars for personal, family, or corporate travel needs.",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
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
    description: "24/7 flight-aligned taxi pickups, drop-offs, and flight tracking with luggage support at Renigunta terminal."
  },
  {
    id: "tirupati-railway-station",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Tirupati Railway Station (TPTY)",
    areaType: "Main Rail Terminal",
    description: "Platform-side pickup and transfer directly to hotels, Tirumala ghat road, or surrounding temple circuits."
  },
  {
    id: "renigunta-junction",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Renigunta Railway Junction (RU)",
    areaType: "Major Junction Hub",
    description: "Round-the-clock cab availability for long-distance trains arriving at Renigunta junction."
  },
  {
    id: "tirupati-bus-station",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Tirupati Central Bus Station (CBS)",
    areaType: "APSRTC Central Depot",
    description: "Prompt pickups and drops connecting the central bus complex to hotels and pilgrimage sites."
  },
  {
    id: "alipiri-bus-station",
    category: "transit",
    categoryLabel: "Airports & Transit",
    name: "Alipiri Bus Station & Foothills",
    areaType: "Tirumala Gateway",
    description: "Gateway point for uphill vehicles and pilgrims walking the traditional Alipiri Mettu footpath."
  },

  // 2. Famous Temples & Pilgrimage Destinations
  {
    id: "tirumala-temple",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Tirumala Sri Venkateswara Temple",
    areaType: "Sacred Hill Shrine",
    description: "Specialized uphill and downhill ghat road taxi trips with experienced hill drivers and return waiting."
  },
  {
    id: "padmavathi-temple",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Sri Padmavathi Ammavari Temple",
    areaType: "Tiruchanur Pilgrimage",
    description: "Dedicated cab service for darshan at Tiruchanur, complete with custom waiting and return packages."
  },
  {
    id: "kapila-theertham",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Kapila Theertham Temple & Falls",
    areaType: "Sacred Waterfall Shrine",
    description: "Comfortable city transit to the holy Shiva temple and natural waterfall at the foot of Seshachalam hills."
  },
  {
    id: "iskcon-tirupati",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "ISKCON Temple Tirupati",
    areaType: "Radha Govinda Mandir",
    description: "Convenient local transfers for tourists and devotees visiting ISKCON along Alipiri Bypass Road."
  },
  {
    id: "srinivasa-mangapuram",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Srinivasa Mangapuram Temple",
    areaType: "Kalyana Venkateswara",
    description: "Smooth outstation-style taxi rides to the historic temple located 12 km west of Tirupati."
  },
  {
    id: "govindaraja-swamy",
    category: "temples",
    categoryLabel: "Pilgrimage Temples",
    name: "Sri Govindaraja Swamy Temple",
    areaType: "Heart of Tirupati",
    description: "Quick city taxi drops right by the historic Raja Gopuram near the Tirupati Railway Station."
  },

  // 3. Key Areas & Sightseeing
  {
    id: "tiruchanur-area",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Tiruchanur & Suburbs",
    areaType: "Pilgrimage & Residential",
    description: "Frequent point-to-point taxi services connecting Tiruchanur town, marriage halls, and hotels."
  },
  {
    id: "renigunta-city",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Renigunta Industrial & Town Area",
    areaType: "Industrial & Transit",
    description: "Regular corporate and local cab rides across Renigunta industrial zones and residential pockets."
  },
  {
    id: "chandragiri-fort",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Chandragiri Fort & Heritage Park",
    areaType: "Historical Sightseeing",
    description: "Sightseeing packages with driver waiting for the Raja Mahal Museum and the evening Light & Sound show."
  },
  {
    id: "tirupati-city-centre",
    category: "areas",
    categoryLabel: "Key Areas & Sightseeing",
    name: "Tirupati City Centre",
    areaType: "Bhavani Nagar, Tilak Rd & Korlagunta",
    description: "Door-to-door cab bookings across major markets, shopping centers, lodges, and residential neighborhoods."
  },

  // 4. Hospitals & Educational Campuses
  {
    id: "svims-hospital",
    category: "institutions",
    categoryLabel: "Hospitals & Campuses",
    name: "SVIMS & BIRRD Super Speciality",
    areaType: "Medical Healthcare Hub",
    description: "Priority emergency and scheduled transportation for patients, attendants, and visiting doctors."
  },
  {
    id: "ruia-hospital",
    category: "institutions",
    categoryLabel: "Hospitals & Campuses",
    name: "Ruia Government General Hospital",
    areaType: "Regional Medical Center",
    description: "Reliable patient transit and doorstep pickup connecting Ruia Hospital with regional towns."
  },
  {
    id: "sv-university",
    category: "institutions",
    categoryLabel: "Hospitals & Campuses",
    name: "Sri Venkateswara University (SVU)",
    areaType: "Educational Campus",
    description: "Campus transit for students, parents, faculty, and visiting delegations across the sprawling SVU grounds."
  },
  {
    id: "ttd-administrative",
    category: "institutions",
    categoryLabel: "Hospitals & Campuses",
    name: "TTD Administrative Buildings",
    areaType: "KT Road Government Hub",
    description: "Hassle-free transfers to TTD administrative offices, darshan pass counters, and KT Road institutions."
  }
];

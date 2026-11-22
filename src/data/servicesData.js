/**
 * Services and About Us content configuration for Deekshitha Travels.
 * Clean, structured, and easy to maintain or connect to a CMS in the future.
 */

export const ABOUT_CONTENT = {
  sectionBadge: "About Deekshitha Travels",
  mainHeading: "Making Every Journey Comfortable and Convenient.",
  description:
    "Deekshitha Travels provides taxi services and car rental solutions for customers in Tirupati and surrounding areas. Whether you need a convenient airport pickup, local transportation or a comfortable ride for your journey, we aim to make your travel simple and hassle-free.",
  image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80",
  imageAlt: "Comfortable and safe travel with Deekshitha Travels in Tirupati",
  highlights: [
    {
      id: "taxi-services",
      title: "Convenient Taxi Services",
      description: "Prompt on-demand and scheduled taxi services across Tirupati."
    },
    {
      id: "comfortable-travel",
      title: "Comfortable Travel",
      description: "Well-maintained, clean vehicles ensuring a relaxed ride every time."
    },
    {
      id: "airport-transfers",
      title: "Airport Pickup and Drop",
      description: "Timely transfers to and from Tirupati Airport with zero waiting hassle."
    },
    {
      id: "local-rental",
      title: "Local and Rental Travel Options",
      description: "Flexible car rental packages tailored to your journey needs."
    }
  ]
};

export const SERVICES_LIST = [
  {
    id: "airport-taxi",
    title: "Airport Taxi",
    subtitle: "Tirupati Airport Transfers",
    description: "Convenient pickup and drop services for Tirupati Airport.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Airport taxi services at Tirupati Airport",
    icon: "plane",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Airport Taxi services."
  },
  {
    id: "local-taxi",
    title: "Local Taxi Services",
    subtitle: "City & Darshan Rides",
    description: "Taxi services across Tirupati for local travel and transportation needs.",
    image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Local taxi services in Tirupati",
    icon: "car",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Local Taxi Services."
  },
  {
    id: "car-rentals",
    title: "Car Rentals",
    subtitle: "Flexible Rental Packages",
    description: "Vehicle rental options for customers who need convenient transportation.",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Car rental options in Tirupati",
    icon: "key",
    whatsappText: "Hello Deekshitha Travels, I would like to enquire about Car Rentals."
  }
];

export const SERVICE_LOCATIONS = [
  {
    id: "tirupati",
    name: "Tirupati",
    areaType: "City & Temple Area",
    description: "Full coverage across all residential, commercial, and temple areas."
  },
  {
    id: "renigunta",
    name: "Renigunta",
    areaType: "Railway & Junction Hub",
    description: "Quick pickups and drops for Renigunta Railway Station and surrounds."
  },
  {
    id: "tirupati-airport",
    name: "Tirupati Airport",
    areaType: "Domestic Airport Terminal",
    description: "Dedicated airport taxi transfers with on-time flight tracking."
  }
];

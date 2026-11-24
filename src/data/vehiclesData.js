/**
 * Genuine Customer Fleet Data for Deekshitha Travels.
 * Approved Customer Vehicles:
 * 1. Maruti Suzuki Swift Dzire (Modern 2024 Sedan)
 * 2. Maruti Suzuki Ertiga (Modern Smart Hybrid MPV)
 * 3. Toyota Innova (Innova Crysta Premium MPV)
 * 4. Toyota Etios (Etios Platinum Sedan)
 * 5. Force Tempo Traveller (12-17 Seater Luxury Tourist Van)
 * 
 * Tariffs are custom and provided upon request.
 * Real, authentic photographs stored in /images/vehicles/
 */

export const APPROVED_VEHICLES = [
  {
    id: "maruti-swift-dzire",
    vehicle_name: "Maruti Suzuki Swift Dzire",
    vehicle_model: "Swift Dzire VXi/ZXi",
    category: "Prime Sedan",
    image: "/images/vehicles/maruti_suzuki_swift_dzire.webp",
    image_urls: ["/images/vehicles/maruti_suzuki_swift_dzire.webp"],
    image_alt: "Modern Maruti Suzuki Swift Dzire AC sedan taxi in Tirupati",
    seating_capacity: "4 Seats",
    luggage_capacity: "2-3 Bags",
    is_ac: true,
    ac_label: "AC",
    description: "Comfortable and fuel-efficient modern AC sedan, ideal for couples, small families, Tirupati city transit, and airport transfers.",
    price_display: "Tariff on Request",
    price_note: "Contact for custom quotes",
    badge: "Popular Choice",
    display_order: 1,
    is_active: true
  },
  {
    id: "maruti-ertiga",
    vehicle_name: "Maruti Suzuki Ertiga",
    vehicle_model: "Ertiga ZXi / Smart Hybrid",
    category: "Comfort MPV",
    image: "/images/vehicles/maruti_suzuki_ertiga.webp",
    image_urls: ["/images/vehicles/maruti_suzuki_ertiga.webp"],
    image_alt: "Modern Maruti Suzuki Ertiga Smart Hybrid MPV taxi for Tirupati and Tirumala travel",
    seating_capacity: "6 Seats",
    luggage_capacity: "3 Bags",
    is_ac: true,
    ac_label: "AC",
    description: "Spacious and versatile 6-seater modern MPV with smooth AC comfort, perfect for family temple pilgrimage and local Tirupati tours.",
    price_display: "Tariff on Request",
    price_note: "Affordable family packages",
    badge: "Family Favorite",
    display_order: 2,
    is_active: true
  },
  {
    id: "toyota-innova",
    vehicle_name: "Toyota Innova",
    vehicle_model: "Innova Crysta 2.4",
    category: "Family & Pilgrim SUV",
    image: "/images/vehicles/toyota_innova.webp",
    image_urls: ["/images/vehicles/toyota_innova.webp"],
    image_alt: "Toyota Innova Crysta MPV for Tirumala ghat road and temple darshan",
    seating_capacity: "7 Seats",
    luggage_capacity: "4 Bags",
    is_ac: true,
    ac_label: "Dual AC",
    description: "Premium, robust MPV known for exceptional comfort and safety across Tirumala hills, ghat roads, and long-distance pilgrim journeys.",
    price_display: "Tariff on Request",
    price_note: "Custom pilgrim packages",
    badge: "Pilgrimage Favorite",
    display_order: 3,
    is_active: true
  },
  {
    id: "toyota-etios",
    vehicle_name: "Toyota Etios",
    vehicle_model: "Etios Platinum GD/VX",
    category: "Prime Sedan",
    image: "/images/vehicles/toyota_etios.webp",
    image_urls: ["/images/vehicles/toyota_etios.webp"],
    image_alt: "Toyota Etios Platinum AC sedan for Tirupati Airport pickup and outstation travel",
    seating_capacity: "4 Seats",
    luggage_capacity: "3 Bags",
    is_ac: true,
    ac_label: "AC",
    description: "Reliable and spacious sedan featuring class-leading rear legroom and generous boot capacity for relaxed airport and temple travel.",
    price_display: "Tariff on Request",
    price_note: "Prompt airport & local transit",
    badge: "Comfort Sedan",
    display_order: 4,
    is_active: true
  },
  {
    id: "force-tempo-traveller",
    vehicle_name: "Force Tempo Traveller",
    vehicle_model: "Tempo Traveller 3350 / Luxury",
    category: "Luxury Group Van",
    image: "/images/vehicles/force_tempo_traveller.webp",
    image_urls: ["/images/vehicles/force_tempo_traveller.webp"],
    image_alt: "Force Tempo Traveller 12-17 seater luxury tourist van for Tirupati and Tirumala group darshan",
    seating_capacity: "12-17 Seats",
    luggage_capacity: "8-10 Bags",
    is_ac: true,
    ac_label: "Dual AC",
    description: "Spacious luxury high-roof tourist van with comfortable pushback seats, dual AC and ample luggage boot. Ideal for group pilgrimage darshan, large family outings, and outstation tours.",
    price_display: "Tariff on Request",
    price_note: "Best group travel rates",
    badge: "Group Tour Special",
    display_order: 5,
    is_active: true
  }
];

// Backwards-compatible export
export const SAMPLE_VEHICLES = APPROVED_VEHICLES;

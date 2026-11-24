import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "database.json");
const UPLOAD_DIR = path.resolve(__dirname, "../public/uploads");

// Ensure data and upload directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Initial seed data
const INITIAL_SLIDERS = [
  {
    id: "slider-1",
    image: "/images/hero/tirumala_temple_gopuram.webp",
    alt: "Tirumala Sri Venkateswara Swamy Temple Gopurams and Golden Ananda Nilayam in Tirupati",
    badge: "Tirumala Sri Venkateswara Swamy Temple",
    title: "Tirupati & Tirumala Cabs",
    subtitle: "Reliable temple darshan & airport taxi service.",
    buttonText: "Call Now",
    whatsappText: "WhatsApp",
    order: 1,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "slider-2",
    image: "/images/hero/tirumala_ghat_road.webp",
    alt: "Scenic Tirumala Ghat Road winding through lush green Seshachalam Hills, Tirupati",
    badge: "Tirumala Mountain Ghat Road",
    title: "Tirupati & Tirumala Cabs",
    subtitle: "Reliable temple darshan & airport taxi service.",
    buttonText: "Call Now",
    whatsappText: "WhatsApp",
    order: 2,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "slider-3",
    image: "/images/hero/padmavathi_ammavari_temple.webp",
    alt: "Sri Padmavathi Ammavari Temple traditional architecture in Tiruchanur, Tirupati",
    badge: "Sri Padmavathi Ammavari Temple, Tiruchanur",
    title: "Tirupati & Tirumala Cabs",
    subtitle: "Reliable temple darshan & airport taxi service.",
    buttonText: "Call Now",
    whatsappText: "WhatsApp",
    order: 3,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "slider-4",
    image: "/images/hero/kapila_theertham.webp",
    alt: "Kapila Theertham Temple and natural sacred waterfall in Tirupati at the foot of Seshachalam hills",
    badge: "Kapila Theertham Temple & Waterfalls",
    title: "Tirupati & Tirumala Cabs",
    subtitle: "Reliable temple darshan & airport taxi service.",
    buttonText: "Call Now",
    whatsappText: "WhatsApp",
    order: 4,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_VEHICLES = [
  {
    id: "maruti-swift-dzire",
    vehicle_name: "Maruti Suzuki Swift Dzire",
    vehicle_model: "Swift Dzire VXi/ZXi",
    name: "Maruti Suzuki Swift Dzire",
    model: "Swift Dzire VXi/ZXi",
    category: "Prime Sedan",
    image: "/images/vehicles/maruti_suzuki_swift_dzire.jpg",
    image_urls: ["/images/vehicles/maruti_suzuki_swift_dzire.jpg"],
    image_alt: "Maruti Suzuki Swift Dzire AC sedan taxi in Tirupati",
    seating_capacity: "4 Seats",
    luggage_capacity: "2-3 Bags",
    is_ac: true,
    ac_label: "AC",
    description: "Comfortable and fuel-efficient AC sedan, ideal for couples, small families, Tirupati city transit, and airport transfers.",
    price_display: "Tariff on Request",
    price_note: "Contact for custom quotes",
    badge: "Popular Choice",
    display_order: 1,
    order: 1,
    is_active: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "maruti-ertiga",
    vehicle_name: "Maruti Suzuki Ertiga",
    vehicle_model: "Ertiga ZXi / Smart Hybrid",
    name: "Maruti Suzuki Ertiga",
    model: "Ertiga ZXi / Smart Hybrid",
    category: "Comfort MPV",
    image: "/images/vehicles/maruti_suzuki_ertiga.jpg",
    image_urls: ["/images/vehicles/maruti_suzuki_ertiga.jpg"],
    image_alt: "Maruti Suzuki Ertiga 6-seater MPV taxi for Tirupati and Tirumala travel",
    seating_capacity: "6 Seats",
    luggage_capacity: "3 Bags",
    is_ac: true,
    ac_label: "AC",
    description: "Spacious and versatile 6-seater MPV with smooth AC comfort, perfect for family temple pilgrimage and local Tirupati tours.",
    price_display: "Tariff on Request",
    price_note: "Affordable family packages",
    badge: "Family Favorite",
    display_order: 2,
    order: 2,
    is_active: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "toyota-innova",
    vehicle_name: "Toyota Innova",
    vehicle_model: "Innova Crysta 2.4",
    name: "Toyota Innova",
    model: "Innova Crysta 2.4",
    category: "Family & Pilgrim SUV",
    image: "/images/vehicles/toyota_innova.jpg",
    image_urls: ["/images/vehicles/toyota_innova.jpg"],
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
    order: 3,
    is_active: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "toyota-etios",
    vehicle_name: "Toyota Etios",
    vehicle_model: "Etios Platinum GD/VX",
    name: "Toyota Etios",
    model: "Etios Platinum GD/VX",
    category: "Prime Sedan",
    image: "/images/vehicles/toyota_etios.jpg",
    image_urls: ["/images/vehicles/toyota_etios.jpg"],
    image_alt: "Toyota Etios AC sedan for Tirupati Airport pickup and outstation travel",
    seating_capacity: "4 Seats",
    luggage_capacity: "3 Bags",
    is_ac: true,
    ac_label: "AC",
    description: "Reliable and spacious sedan featuring class-leading rear legroom and generous boot capacity for relaxed airport and temple travel.",
    price_display: "Tariff on Request",
    price_note: "Prompt airport & local transit",
    badge: "Comfort Sedan",
    display_order: 4,
    order: 4,
    is_active: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Default admin: username "admin", password "admin123" (stored securely as bcrypt hash)
const DEFAULT_ADMIN = {
  id: "admin-1",
  username: "admin",
  passwordHash: bcrypt.hashSync("admin123", 10),
  role: "admin",
  name: "Deekshitha Travels Administrator"
};

function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      admin: DEFAULT_ADMIN,
      sliders: INITIAL_SLIDERS,
      vehicles: INITIAL_VEHICLES,
      settings: {
        businessName: "Deekshitha Travels",
        phone: "6300540826",
        phoneDisplay: "+91 63005 40826",
        email: "deekshithatravels21@gmail.com",
        whatsapp: "916300540826"
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    const initialData = {
      admin: DEFAULT_ADMIN,
      sliders: INITIAL_SLIDERS,
      vehicles: INITIAL_VEHICLES,
      settings: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
}

let dbCache = initDatabase();

export function getDb() {
  if (!dbCache) {
    dbCache = initDatabase();
  }
  return dbCache;
}

export function saveDb(data) {
  dbCache = data;
  const tempPath = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempPath, DB_FILE);
  return dbCache;
}

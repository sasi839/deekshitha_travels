-- ============================================================================
-- DEEKSHITHA TRAVELS - INITIAL PRODUCTION SEED DATA FOR SUPABASE POSTGRESQL
-- Strictly ONLY the 4 Approved Genuine Customer Vehicles & Authentic Slides
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. APPROVED VEHICLES SEED
-- 1. Maruti Suzuki Swift Dzire
-- 2. Maruti Suzuki Ertiga
-- 3. Toyota Innova
-- 4. Toyota Etios
-- ----------------------------------------------------------------------------

-- Clean existing demo vehicles
TRUNCATE TABLE public.vehicles RESTART IDENTITY CASCADE;

INSERT INTO public.vehicles (
    id,
    vehicle_name,
    vehicle_model,
    seating_capacity,
    luggage_capacity,
    description,
    image_urls,
    is_active,
    display_order
) VALUES 
(
    '11111111-1111-1111-1111-111111111101',
    'Maruti Suzuki Swift Dzire',
    'Swift Dzire VXi/ZXi',
    '4 Seats',
    '2-3 Bags',
    'Comfortable and fuel-efficient AC sedan, ideal for couples, small families, Tirupati city transit, and airport transfers.',
    ARRAY['/images/vehicles/maruti_suzuki_swift_dzire.jpg'],
    true,
    1
),
(
    '11111111-1111-1111-1111-111111111102',
    'Maruti Suzuki Ertiga',
    'Ertiga ZXi / Smart Hybrid',
    '6 Seats',
    '3 Bags',
    'Spacious and versatile 6-seater MPV with smooth AC comfort, perfect for family temple pilgrimage and local Tirupati tours.',
    ARRAY['/images/vehicles/maruti_suzuki_ertiga.jpg'],
    true,
    2
),
(
    '11111111-1111-1111-1111-111111111103',
    'Toyota Innova',
    'Innova Crysta 2.4',
    '7 Seats',
    '4 Bags',
    'Premium, robust MPV known for exceptional comfort and safety across Tirumala hills, ghat roads, and long-distance pilgrim journeys.',
    ARRAY['/images/vehicles/toyota_innova.jpg'],
    true,
    3
),
(
    '11111111-1111-1111-1111-111111111104',
    'Toyota Etios',
    'Etios Platinum GD/VX',
    '4 Seats',
    '3 Bags',
    'Reliable and spacious sedan featuring class-leading rear legroom and generous boot capacity for relaxed airport and temple travel.',
    ARRAY['/images/vehicles/toyota_etios.jpg'],
    true,
    4
),
(
    '11111111-1111-1111-1111-111111111105',
    'Force Tempo Traveller',
    'Tempo Traveller 3350 / Luxury',
    '12-17 Seats',
    '8-10 Bags',
    'Spacious luxury high-roof tourist van with comfortable pushback seats, dual AC and ample luggage boot. Ideal for group pilgrimage darshan, large family outings, and outstation tours.',
    ARRAY['/images/vehicles/force_tempo_traveller.jpg'],
    true,
    5
);

-- ----------------------------------------------------------------------------
-- 2. HERO SLIDERS SEED (Expanded 12 Popular Destinations)
-- 1. Tirumala
-- 2. Kapila Theertham
-- 3. Tirupati Airport
-- 4. Srikalahasti
-- 5. Kanipakam
-- 6. Golden Temple, Sripuram – Vellore
-- 7. Arunachalam (Tiruvannamalai)
-- 8. Kanchipuram
-- 9. Chennai
-- 10. Pondicherry
-- 11. Mahabalipuram
-- 12. Vellore
-- ----------------------------------------------------------------------------
TRUNCATE TABLE public.hero_sliders RESTART IDENTITY CASCADE;

INSERT INTO public.hero_sliders (
    id,
    heading,
    description,
    image_url,
    is_active,
    display_order
) VALUES 
(
    '22222222-2222-2222-2222-222222222201',
    'Tirumala Sri Venkateswara Temple',
    'Sacred hill shrine darshan & 24/7 ghat road taxi service.',
    '/images/hero/tirumala_temple_gopuram.webp',
    true,
    1
),
(
    '22222222-2222-2222-2222-222222222202',
    'Kapila Theertham Temple & Waterfalls',
    'Sacred Shiva cave temple & natural waterfall at Seshachalam foothills.',
    '/images/hero/kapila_theertham.webp',
    true,
    2
),
(
    '22222222-2222-2222-2222-222222222203',
    'Tirupati International Airport (TIR)',
    '24/7 flight-aligned taxi pickups & drops with on-time terminal service.',
    '/images/hero/tirupati_airport.webp',
    true,
    3
),
(
    '22222222-2222-2222-2222-222222222204',
    'Srikalahasteeswara Temple, Srikalahasti',
    'Famous Vayu Linga Kshetra & Rahu-Ketu dosha nivarana pooja darshan.',
    '/images/hero/srikalahasti_temple.webp',
    true,
    4
),
(
    '22222222-2222-2222-2222-222222222205',
    'Kanipakam Sri Varasiddhi Vinayaka Temple',
    'Historic self-manifested Swayambhu Ganesha pilgrimage taxi circuit.',
    '/images/hero/kanipakam_vinayaka_temple.webp',
    true,
    5
),
(
    '22222222-2222-2222-2222-222222222206',
    'Golden Temple, Sripuram – Vellore',
    'Magnificent pure-gold spiritual shrine & lush Star Path complex.',
    '/images/hero/sripuram_golden_temple.webp',
    true,
    6
),
(
    '22222222-2222-2222-2222-222222222207',
    'Arunachalam (Tiruvannamalai) Temple',
    'Sacred Agni Sthalam darshan, Girivalam hill round trips & ashrams.',
    '/images/hero/arunachalam_temple.webp',
    true,
    7
),
(
    '22222222-2222-2222-2222-222222222208',
    'Kanchipuram Heritage & Pilgrimage Circuit',
    'Historic city of a thousand temples & world-renowned silk weavers.',
    '/images/hero/kanchipuram_temples.webp',
    true,
    8
),
(
    '22222222-2222-2222-2222-222222222209',
    'Chennai City & Airport Transfers',
    'Smooth intercity highway taxi drops to Central, Airport & CMBT.',
    '/images/hero/chennai_city_transit.webp',
    true,
    9
),
(
    '22222222-2222-2222-2222-222222222210',
    'Pondicherry (Puducherry) Coastal Getaway',
    'Scenic coastal road trips to Promenade Beach, French Quarter & Auroville.',
    '/images/hero/pondicherry_promenade.webp',
    true,
    10
),
(
    '22222222-2222-2222-2222-222222222211',
    'Mahabalipuram UNESCO Shore Temple',
    'Historic rock-cut monuments, scenic coastal highway & Bay of Bengal.',
    '/images/hero/mahabalipuram_shore_temple.webp',
    true,
    11
),
(
    '22222222-2222-2222-2222-222222222212',
    'Vellore City & CMC Hospital Transit',
    'Dedicated patient transport to CMC Hospital, VIT & historic Vellore Fort.',
    '/images/hero/vellore_cmc_and_fort.webp',
    true,
    12
);

-- ----------------------------------------------------------------------------
-- 3. SERVICE LOCATIONS SEED
-- ----------------------------------------------------------------------------
TRUNCATE TABLE public.service_locations RESTART IDENTITY CASCADE;

INSERT INTO public.service_locations (
    id,
    location_name,
    location_category,
    description,
    is_active,
    display_order
) VALUES 
(
    '33333333-3333-3333-3333-333333333301',
    'Tirupati International Airport',
    'transit',
    '24/7 flight-aligned taxi pickups, drop-offs, and flight tracking with luggage support at Renigunta terminal.',
    true,
    1
),
(
    '33333333-3333-3333-3333-333333333302',
    'Tirupati Main Railway Station',
    'transit',
    'Round-the-clock platform pickup and doorstep drop-offs connecting all arrival trains and pilgrim platforms.',
    true,
    2
),
(
    '33333333-3333-3333-3333-333333333303',
    'Renigunta Railway Junction',
    'transit',
    'Express station transfer service connecting long-distance express passengers directly to Tirupati hotels or Tirumala.',
    true,
    3
),
(
    '33333333-3333-3333-3333-333333333304',
    'Tirumala Venkateswara Temple',
    'temples',
    'Specialized ghat-road journeys with seasoned drivers for peaceful Srivari darshan and Tirumala hill cottages.',
    true,
    4
),
(
    '33333333-3333-3333-3333-333333333305',
    'Sri Padmavathi Ammavari Temple (Tiruchanur)',
    'temples',
    'Dedicated darshan trip for Sri Padmavathi Devi blessings, located 5 km from Tirupati city center.',
    true,
    5
),
(
    '33333333-3333-3333-3333-333333333306',
    'Sri Govindaraja Swamy Temple',
    'temples',
    'Convenient city center pickup to this historic Vaishnavite shrine near the railway station.',
    true,
    6
),
(
    '33333333-3333-3333-3333-333333333307',
    'Kapila Theertham Temple',
    'temples',
    'Scenic hillside sacred Shiva temple and natural waterfall located at the foot of Seshachalam hills.',
    true,
    7
),
(
    '33333333-3333-3333-3333-333333333308',
    'Srikalahasti Temple (Rahu-Ketu Kshetra)',
    'temples',
    'Day-trip pilgrimage taxi service for Rahu Ketu sarpa dosha nivarana pooja at Srikalahasti (38 km).',
    true,
    8
),
(
    '33333333-3333-3333-3333-333333333309',
    'Kanipakam Vinayaka Temple',
    'temples',
    'Comfortable outstation round-trip service to the self-manifested Swayambhu Varasiddhi Vinayaka Swamy temple (70 km).',
    true,
    9
);

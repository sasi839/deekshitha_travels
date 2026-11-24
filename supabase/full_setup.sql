-- ============================================================================
-- DEEKSHITHA TRAVELS - COMPLETE SUPABASE SETUP SCRIPT
-- Execute this single script in your Supabase SQL Editor:
-- 1. Creates public.vehicles, public.hero_sliders, public.service_locations
-- 2. Sets up updated_at triggers and performance indexes
-- 3. Configures Row Level Security (RLS) for public and admin roles
-- 4. Creates public storage buckets ('vehicles' and 'hero_sliders') with storage RLS
-- 5. Seeds the 4 genuine customer vehicles, 4 authentic temple hero sliders, and service locations
-- ============================================================================

BEGIN;

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. VEHICLES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_name TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    seating_capacity TEXT NOT NULL,
    luggage_capacity TEXT NOT NULL,
    description TEXT,
    image_urls TEXT[] DEFAULT '{}'::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_vehicles_active_order 
ON public.vehicles (is_active, display_order ASC);

-- ----------------------------------------------------------------------------
-- 2. HERO SLIDERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero_sliders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hero_sliders_active_order 
ON public.hero_sliders (is_active, display_order ASC);

-- ----------------------------------------------------------------------------
-- 3. SERVICE LOCATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_name TEXT NOT NULL,
    location_category TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_service_locations_active_order 
ON public.service_locations (is_active, display_order ASC);

-- ----------------------------------------------------------------------------
-- 4. UPDATED_AT TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER set_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_hero_sliders_updated_at ON public.hero_sliders;
CREATE TRIGGER set_hero_sliders_updated_at
BEFORE UPDATE ON public.hero_sliders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_service_locations_updated_at ON public.service_locations;
CREATE TRIGGER set_service_locations_updated_at
BEFORE UPDATE ON public.service_locations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_locations ENABLE ROW LEVEL SECURITY;

-- Vehicles Policies
DROP POLICY IF EXISTS "Public can view active vehicles" ON public.vehicles;
CREATE POLICY "Public can view active vehicles" ON public.vehicles FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all vehicles" ON public.vehicles;
CREATE POLICY "Admins can view all vehicles" ON public.vehicles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert vehicles" ON public.vehicles;
CREATE POLICY "Admins can insert vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update vehicles" ON public.vehicles;
CREATE POLICY "Admins can update vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete vehicles" ON public.vehicles;
CREATE POLICY "Admins can delete vehicles" ON public.vehicles FOR DELETE TO authenticated USING (true);

-- Hero Sliders Policies
DROP POLICY IF EXISTS "Public can view active hero sliders" ON public.hero_sliders;
CREATE POLICY "Public can view active hero sliders" ON public.hero_sliders FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can view all hero sliders" ON public.hero_sliders FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can insert hero sliders" ON public.hero_sliders FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can update hero sliders" ON public.hero_sliders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can delete hero sliders" ON public.hero_sliders FOR DELETE TO authenticated USING (true);

-- Service Locations Policies
DROP POLICY IF EXISTS "Public can view active service locations" ON public.service_locations;
CREATE POLICY "Public can view active service locations" ON public.service_locations FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all service locations" ON public.service_locations;
CREATE POLICY "Admins can view all service locations" ON public.service_locations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert service locations" ON public.service_locations;
CREATE POLICY "Admins can insert service locations" ON public.service_locations FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update service locations" ON public.service_locations;
CREATE POLICY "Admins can update service locations" ON public.service_locations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete service locations" ON public.service_locations;
CREATE POLICY "Admins can delete service locations" ON public.service_locations FOR DELETE TO authenticated USING (true);

-- ----------------------------------------------------------------------------
-- 6. STORAGE BUCKETS
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('vehicles', 'vehicles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('hero_sliders', 'hero_sliders', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE 
SET public = true, 
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage Policies
DROP POLICY IF EXISTS "Public can view vehicle photos" ON storage.objects;
CREATE POLICY "Public can view vehicle photos" ON storage.objects FOR SELECT USING (bucket_id = 'vehicles');

DROP POLICY IF EXISTS "Public can view hero slider photos" ON storage.objects;
CREATE POLICY "Public can view hero slider photos" ON storage.objects FOR SELECT USING (bucket_id = 'hero_sliders');

DROP POLICY IF EXISTS "Admins can upload vehicle photos" ON storage.objects;
CREATE POLICY "Admins can upload vehicle photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vehicles');

DROP POLICY IF EXISTS "Admins can update vehicle photos" ON storage.objects;
CREATE POLICY "Admins can update vehicle photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'vehicles');

DROP POLICY IF EXISTS "Admins can delete vehicle photos" ON storage.objects;
CREATE POLICY "Admins can delete vehicle photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'vehicles');

DROP POLICY IF EXISTS "Admins can upload hero slider photos" ON storage.objects;
CREATE POLICY "Admins can upload hero slider photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero_sliders');

DROP POLICY IF EXISTS "Admins can update hero slider photos" ON storage.objects;
CREATE POLICY "Admins can update hero slider photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'hero_sliders');

DROP POLICY IF EXISTS "Admins can delete hero slider photos" ON storage.objects;
CREATE POLICY "Admins can delete hero slider photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'hero_sliders');

-- ----------------------------------------------------------------------------
-- 7. INITIAL DATA SEED (ONLY 4 Genuine Approved Vehicles)
-- ----------------------------------------------------------------------------
DELETE FROM public.vehicles;
INSERT INTO public.vehicles (
    id, vehicle_name, vehicle_model, seating_capacity, luggage_capacity, description, image_urls, is_active, display_order
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
);

DELETE FROM public.hero_sliders;
INSERT INTO public.hero_sliders (
    id, heading, description, image_url, is_active, display_order
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

DELETE FROM public.service_locations;
INSERT INTO public.service_locations (
    id, location_name, location_category, description, is_active, display_order
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

COMMIT;

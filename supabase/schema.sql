-- ============================================================================
-- DEEKSHITHA TRAVELS - PRODUCTION DATABASE SCHEMA FOR SUPABASE POSTGRESQL
-- Phase 10: Real Vehicle Integration & Live Supabase Database
-- ============================================================================

-- Enable required extensions
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

-- Index for public queries (active vehicles in display order)
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

-- Index for public queries (active sliders in display order)
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

-- Index for location filtering
CREATE INDEX IF NOT EXISTS idx_service_locations_active_order 
ON public.service_locations (is_active, display_order ASC);

CREATE INDEX IF NOT EXISTS idx_service_locations_category 
ON public.service_locations (location_category);

-- ----------------------------------------------------------------------------
-- 4. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
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
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_locations ENABLE ROW LEVEL SECURITY;

-- VEHICLES RLS:
-- Public can view ONLY active vehicles
DROP POLICY IF EXISTS "Public can view active vehicles" ON public.vehicles;
CREATE POLICY "Public can view active vehicles" 
ON public.vehicles 
FOR SELECT 
USING (is_active = true);

-- Authenticated admins can view all vehicles (active + inactive)
DROP POLICY IF EXISTS "Admins can view all vehicles" ON public.vehicles;
CREATE POLICY "Admins can view all vehicles" 
ON public.vehicles 
FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated admins can insert new vehicles
DROP POLICY IF EXISTS "Admins can insert vehicles" ON public.vehicles;
CREATE POLICY "Admins can insert vehicles" 
ON public.vehicles 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Authenticated admins can update any vehicle
DROP POLICY IF EXISTS "Admins can update vehicles" ON public.vehicles;
CREATE POLICY "Admins can update vehicles" 
ON public.vehicles 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Authenticated admins can delete vehicles
DROP POLICY IF EXISTS "Admins can delete vehicles" ON public.vehicles;
CREATE POLICY "Admins can delete vehicles" 
ON public.vehicles 
FOR DELETE 
TO authenticated 
USING (true);

-- HERO SLIDERS RLS:
-- Public can view ONLY active sliders
DROP POLICY IF EXISTS "Public can view active hero sliders" ON public.hero_sliders;
CREATE POLICY "Public can view active hero sliders" 
ON public.hero_sliders 
FOR SELECT 
USING (is_active = true);

-- Authenticated admins can view all sliders
DROP POLICY IF EXISTS "Admins can view all hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can view all hero sliders" 
ON public.hero_sliders 
FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated admins can insert sliders
DROP POLICY IF EXISTS "Admins can insert hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can insert hero sliders" 
ON public.hero_sliders 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Authenticated admins can update sliders
DROP POLICY IF EXISTS "Admins can update hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can update hero sliders" 
ON public.hero_sliders 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Authenticated admins can delete sliders
DROP POLICY IF EXISTS "Admins can delete hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can delete hero sliders" 
ON public.hero_sliders 
FOR DELETE 
TO authenticated 
USING (true);

-- SERVICE LOCATIONS RLS:
-- Public can view ONLY active service locations
DROP POLICY IF EXISTS "Public can view active service locations" ON public.service_locations;
CREATE POLICY "Public can view active service locations" 
ON public.service_locations 
FOR SELECT 
USING (is_active = true);

-- Authenticated admins can view all service locations
DROP POLICY IF EXISTS "Admins can view all service locations" ON public.service_locations;
CREATE POLICY "Admins can view all service locations" 
ON public.service_locations 
FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated admins can insert service locations
DROP POLICY IF EXISTS "Admins can insert service locations" ON public.service_locations;
CREATE POLICY "Admins can insert service locations" 
ON public.service_locations 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Authenticated admins can update service locations
DROP POLICY IF EXISTS "Admins can update service locations" ON public.service_locations;
CREATE POLICY "Admins can update service locations" 
ON public.service_locations 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Authenticated admins can delete service locations
DROP POLICY IF EXISTS "Admins can delete service locations" ON public.service_locations;
CREATE POLICY "Admins can delete service locations" 
ON public.service_locations 
FOR DELETE 
TO authenticated 
USING (true);

-- ----------------------------------------------------------------------------
-- 6. STORAGE BUCKETS & STORAGE RLS POLICIES
-- ----------------------------------------------------------------------------

-- Insert storage buckets if not existing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('vehicles', 'vehicles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('hero_sliders', 'hero_sliders', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE 
SET public = true, 
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage bucket RLS policies:
-- Public read access to vehicle photographs
DROP POLICY IF EXISTS "Public can view vehicle photos" ON storage.objects;
CREATE POLICY "Public can view vehicle photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vehicles');

-- Public read access to hero slider photographs
DROP POLICY IF EXISTS "Public can view hero slider photos" ON storage.objects;
CREATE POLICY "Public can view hero slider photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero_sliders');

-- Authenticated admins can upload vehicle photographs
DROP POLICY IF EXISTS "Admins can upload vehicle photos" ON storage.objects;
CREATE POLICY "Admins can upload vehicle photos" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'vehicles');

-- Authenticated admins can update/replace vehicle photographs
DROP POLICY IF EXISTS "Admins can update vehicle photos" ON storage.objects;
CREATE POLICY "Admins can update vehicle photos" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'vehicles');

-- Authenticated admins can delete vehicle photographs
DROP POLICY IF EXISTS "Admins can delete vehicle photos" ON storage.objects;
CREATE POLICY "Admins can delete vehicle photos" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'vehicles');

-- Authenticated admins can upload hero slider photographs
DROP POLICY IF EXISTS "Admins can upload hero slider photos" ON storage.objects;
CREATE POLICY "Admins can upload hero slider photos" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'hero_sliders');

-- Authenticated admins can update/replace hero slider photographs
DROP POLICY IF EXISTS "Admins can update hero slider photos" ON storage.objects;
CREATE POLICY "Admins can update hero slider photos" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'hero_sliders');

-- Authenticated admins can delete hero slider photographs
DROP POLICY IF EXISTS "Admins can delete hero slider photos" ON storage.objects;
CREATE POLICY "Admins can delete hero slider photos" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'hero_sliders');

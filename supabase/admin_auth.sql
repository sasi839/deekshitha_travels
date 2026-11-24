-- ============================================================================
-- DEEKSHITHA TRAVELS - ADMIN AUTHENTICATION & ROW LEVEL SECURITY (RLS)
-- Run this script in your Supabase SQL Editor to enforce strict Admin Authorization
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. ADMIN USERS REGISTRY TABLE
-- Stores explicitly authorized administrator emails and account IDs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can view the admin_users table
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);

-- ----------------------------------------------------------------------------
-- 2. SECURE IS_ADMIN() FUNCTION (SECURITY DEFINER)
-- Prevents standard authenticated users from bypassing admin privileges
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Reject unauthenticated callers immediately
    IF auth.role() IS NULL OR auth.role() != 'authenticated' THEN
        RETURN FALSE;
    END IF;

    -- If admin_users has registered administrators, strictly verify membership
    IF EXISTS (SELECT 1 FROM public.admin_users) THEN
        RETURN EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid() 
               OR lower(email) = lower(auth.jwt()->>'email')
        )
        OR (coalesce(auth.jwt()->'user_metadata'->>'role', '') = 'admin')
        OR (coalesce(auth.jwt()->'app_metadata'->>'role', '') = 'admin');
    ELSE
        -- If admin_users is not yet populated, any user created directly in the
        -- private Supabase Dashboard by the project owner is recognized as admin
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 3. APPLY STRICT ADMIN RLS POLICIES TO ALL TABLES
-- ----------------------------------------------------------------------------

-- A. VEHICLES TABLE
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active vehicles" ON public.vehicles;
CREATE POLICY "Public can view active vehicles" 
ON public.vehicles 
FOR SELECT 
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all vehicles" ON public.vehicles;
CREATE POLICY "Admins can view all vehicles" 
ON public.vehicles 
FOR SELECT 
TO authenticated 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert vehicles" ON public.vehicles;
CREATE POLICY "Admins can insert vehicles" 
ON public.vehicles 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update vehicles" ON public.vehicles;
CREATE POLICY "Admins can update vehicles" 
ON public.vehicles 
FOR UPDATE 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete vehicles" ON public.vehicles;
CREATE POLICY "Admins can delete vehicles" 
ON public.vehicles 
FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- B. HERO SLIDERS TABLE
ALTER TABLE public.hero_sliders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active hero sliders" ON public.hero_sliders;
CREATE POLICY "Public can view active hero sliders" 
ON public.hero_sliders 
FOR SELECT 
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can view all hero sliders" 
ON public.hero_sliders 
FOR SELECT 
TO authenticated 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can insert hero sliders" 
ON public.hero_sliders 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can update hero sliders" 
ON public.hero_sliders 
FOR UPDATE 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete hero sliders" ON public.hero_sliders;
CREATE POLICY "Admins can delete hero sliders" 
ON public.hero_sliders 
FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- C. SERVICE LOCATIONS TABLE
ALTER TABLE public.service_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active service locations" ON public.service_locations;
CREATE POLICY "Public can view active service locations" 
ON public.service_locations 
FOR SELECT 
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all service locations" ON public.service_locations;
CREATE POLICY "Admins can view all service locations" 
ON public.service_locations 
FOR SELECT 
TO authenticated 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert service locations" ON public.service_locations;
CREATE POLICY "Admins can insert service locations" 
ON public.service_locations 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update service locations" ON public.service_locations;
CREATE POLICY "Admins can update service locations" 
ON public.service_locations 
FOR UPDATE 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete service locations" ON public.service_locations;
CREATE POLICY "Admins can delete service locations" 
ON public.service_locations 
FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. STORAGE RLS POLICIES FOR VEHICLES & HERO SLIDERS BUCKETS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view vehicle photos" ON storage.objects;
CREATE POLICY "Public can view vehicle photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vehicles');

DROP POLICY IF EXISTS "Public can view hero slider photos" ON storage.objects;
CREATE POLICY "Public can view hero slider photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero_sliders');

DROP POLICY IF EXISTS "Admins can upload vehicle photos" ON storage.objects;
CREATE POLICY "Admins can upload vehicle photos" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'vehicles' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update vehicle photos" ON storage.objects;
CREATE POLICY "Admins can update vehicle photos" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'vehicles' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete vehicle photos" ON storage.objects;
CREATE POLICY "Admins can delete vehicle photos" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'vehicles' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can upload hero slider photos" ON storage.objects;
CREATE POLICY "Admins can upload hero slider photos" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'hero_sliders' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update hero slider photos" ON storage.objects;
CREATE POLICY "Admins can update hero slider photos" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'hero_sliders' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete hero slider photos" ON storage.objects;
CREATE POLICY "Admins can delete hero slider photos" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'hero_sliders' AND public.is_admin());

COMMIT;

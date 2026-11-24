# Deekshitha Travels - Supabase Integration Guide

This directory contains the production database migrations, Row Level Security (RLS) policies, storage bucket configurations, and seed data for **Deekshitha Travels**.

---

## 1. Quick One-Step Setup

1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor** in the left sidebar.
3. Click **+ New Query**.
4. Paste the entire content of [`full_setup.sql`](./full_setup.sql).
5. Click **Run** (or press `Ctrl+Enter`).

---

## 2. Environment Variables Configuration

Create a `.env` file in the root of the project with your project's publishable/anon keys:

```env
# Supabase Production Project URL
VITE_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase Public Anonymous API Key (Safe for frontend)
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> **Security Note:** Never put the `service_role` key into client-side code or commit `.env` to GitHub. The client application strictly uses the publishable anonymous key governed by Row Level Security (RLS).

---

## 3. Database Architecture

### A. `public.vehicles`
| Column | Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, default `uuid_generate_v4()` | Unique vehicle identifier |
| `vehicle_name` | TEXT | NOT NULL | e.g. "Maruti Suzuki Swift Dzire" |
| `vehicle_model` | TEXT | NOT NULL | e.g. "Swift Dzire VXi/ZXi" |
| `seating_capacity` | TEXT | NOT NULL | e.g. "4 Seats" |
| `luggage_capacity` | TEXT | NOT NULL | e.g. "2-3 Bags" |
| `description` | TEXT | | Brief overview of comfort and use cases |
| `image_urls` | TEXT[] | DEFAULT `'{}'` | Array of public image URLs or storage paths |
| `is_active` | BOOLEAN | DEFAULT `true` | Visibility toggle for public site |
| `display_order` | INTEGER | DEFAULT `0` | Order of presentation on public fleet grid |
| `created_at` | TIMESTAMPTZ | DEFAULT `now()` | Timestamp of creation |
| `updated_at` | TIMESTAMPTZ | DEFAULT `now()` | Auto-updated via trigger |

### B. `public.hero_sliders`
| Column | Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, default `uuid_generate_v4()` | Unique slide identifier |
| `heading` | TEXT | NOT NULL | Slide title / destination highlight |
| `description` | TEXT | | Supporting subtitle text |
| `image_url` | TEXT | NOT NULL | WebP / JPG temple or destination photography |
| `is_active` | BOOLEAN | DEFAULT `true` | Active/inactive toggle |
| `display_order` | INTEGER | DEFAULT `0` | Sequence in the hero slideshow |
| `created_at` | TIMESTAMPTZ | DEFAULT `now()` | Timestamp of creation |
| `updated_at` | TIMESTAMPTZ | DEFAULT `now()` | Auto-updated via trigger |

### C. `public.service_locations`
| Column | Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, default `uuid_generate_v4()` | Unique location identifier |
| `location_name` | TEXT | NOT NULL | Name of transit hub, temple, or landmark |
| `location_category` | TEXT | NOT NULL | `transit`, `temples`, `areas`, `institutions` |
| `description` | TEXT | | Detailed service description |
| `is_active` | BOOLEAN | DEFAULT `true` | Active/inactive toggle |
| `display_order` | INTEGER | DEFAULT `0` | Order of presentation |
| `created_at` | TIMESTAMPTZ | DEFAULT `now()` | Timestamp of creation |
| `updated_at` | TIMESTAMPTZ | DEFAULT `now()` | Auto-updated via trigger |

---

## 4. Storage Buckets

Two public storage buckets are created automatically:
1. `vehicles`: For vehicle photographs uploaded through the Admin dashboard.
2. `hero_sliders`: For hero slider background photographs.

Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif` (max 5MB per file).

---

## 5. Security & Row Level Security (RLS) Policies

- **Public Visitors (Anon)**:
  - Can ONLY `SELECT` records where `is_active = true`.
  - Can read images from the public `vehicles` and `hero_sliders` buckets.
  - CANNOT insert, update, or delete records or storage objects.
- **Authenticated Administrators**:
  - Full CRUD (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) across all records regardless of `is_active`.
  - Full upload, update, and deletion permissions on storage buckets.

---

## 6. Keeping the Supabase Free Project Active

Supabase automatically pauses free projects after **7 days of no inbound HTTP API traffic or dashboard activity**.
- **Important:** Simply loading the website from a cached browser or local file does not generate API requests.
- When live, visitors querying the live database (`api.getPublicVehicles()` or `api.getPublicSliders()`) will naturally reset the inactivity timer.
- To prevent accidental pausing during low-season traffic:
  1. An external uptime monitor (e.g. UptimeRobot, BetterUptime) sending a `GET` request every 24 hours to `https://<project-ref>.supabase.co/rest/v1/vehicles?is_active=eq.true&select=id&limit=1` with header `apikey: <ANON_KEY>` will keep the project active without creating synthetic database writes.
  2. Or upgrade the Supabase project to the Pro plan ($25/mo), which guarantees 0% downtime with no inactivity pausing.

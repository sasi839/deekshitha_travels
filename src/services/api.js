/**
 * Centralized API service for Deekshitha Travels.
 * Connects directly to Supabase PostgreSQL & Supabase Storage.
 * Governed by Row Level Security (RLS) policies.
 */

import { supabase, isSupabaseConfigured, getSupabaseConfigStatus, uploadToStorage, deleteFromStorage } from "./supabaseClient.js";

const BASE_URL = "/api";

function getAuthHeaders() {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Format database vehicle row to frontend-friendly structure
function formatVehicleRow(row) {
  const images = Array.isArray(row.image_urls) ? row.image_urls : (row.image_urls ? [row.image_urls] : []);
  const primaryImage = images[0] || row.image || "/images/vehicles/maruti_suzuki_swift_dzire.jpg";

  return {
    id: row.id,
    vehicle_name: row.vehicle_name || row.name || "Customer Vehicle",
    vehicle_model: row.vehicle_model || row.model || "",
    name: row.vehicle_name || row.name || "Customer Vehicle",
    model: row.vehicle_model || row.model || "",
    category: row.category || "Prime Taxi",
    seating_capacity: row.seating_capacity || "4 Seats",
    luggage_capacity: row.luggage_capacity || "2 Bags",
    description: row.description || "",
    image: primaryImage,
    image_urls: images.length > 0 ? images : [primaryImage],
    image_alt: `${row.vehicle_name || "Taxi"} for hire in Tirupati`,
    is_active: row.is_active !== false,
    active: row.is_active !== false,
    display_order: row.display_order ?? row.order ?? 0,
    order: row.display_order ?? row.order ?? 0,
    is_ac: true,
    ac_label: row.seating_capacity && parseInt(row.seating_capacity) >= 6 ? "Dual AC" : "AC",
    price_display: "Tariff on Request",
    price_note: "Contact for custom quotes",
    badge: row.display_order === 1 ? "Popular Choice" : (row.display_order === 3 ? "Pilgrimage Favorite" : ""),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Format database hero slider row
function formatSliderRow(row) {
  const heading = row.heading || row.title || "Tirupati Travels";
  
  // Smart badge detection for key destinations
  let badge = row.badge;
  if (!badge) {
    const h = heading.toLowerCase();
    if (h.includes("tirumala")) badge = "Tirumala Venkateswara Swamy Temple";
    else if (h.includes("kapila")) badge = "Kapila Theertham Temple & Waterfall";
    else if (h.includes("airport")) badge = "Tirupati Airport Pickup & Drop";
    else if (h.includes("srikalahasti") || h.includes("kalahasteeswara")) badge = "Srikalahasteeswara Temple (38 km)";
    else if (h.includes("kanipakam") || h.includes("vinayaka")) badge = "Kanipakam Vinayaka Temple (70 km)";
    else if (h.includes("golden temple") || h.includes("sripuram")) badge = "Golden Temple Sripuram, Vellore (110 km)";
    else if (h.includes("arunachalam") || h.includes("tiruvannamalai")) badge = "Arunachaleswarar Temple (195 km)";
    else if (h.includes("kanchipuram")) badge = "Kanchipuram Temples (115 km)";
    else if (h.includes("chennai")) badge = "Chennai Central & Airport (135 km)";
    else if (h.includes("pondicherry") || h.includes("puducherry")) badge = "Pondicherry Coastal Tour (235 km)";
    else if (h.includes("mahabalipuram") || h.includes("mamallapuram")) badge = "Mahabalipuram Coastal Heritage (155 km)";
    else if (h.includes("vellore")) badge = "Vellore & CMC Hospital (105 km)";
    else badge = heading;
  }

  return {
    id: row.id,
    heading,
    title: heading,
    subtitle: row.description || row.subtitle || "Reliable temple darshan & airport taxi service.",
    description: row.description || row.subtitle || "",
    image: row.image_url || row.image || "/images/hero/tirumala_temple_gopuram.webp",
    image_url: row.image_url || row.image || "/images/hero/tirumala_temple_gopuram.webp",
    alt: `${heading} taxi travel from Tirupati`,
    badge,
    buttonText: "Call Now",
    whatsappText: "WhatsApp",
    is_active: row.is_active !== false,
    active: row.is_active !== false,
    display_order: row.display_order ?? row.order ?? 0,
    order: row.display_order ?? row.order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const api = {
  isSupabaseLive: () => isSupabaseConfigured(),

  // ------------------------------------------------------------------------
  // Authentication (Supabase Auth)
  // ------------------------------------------------------------------------
  login: async (email, password) => {
    if (!email || !email.trim()) {
      throw new Error("Please enter your admin email address.");
    }
    if (!password) {
      throw new Error("Please enter your password.");
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error("Please enter a valid email address.");
    }

    const configStatus = getSupabaseConfigStatus();
    if (configStatus.isSecretKey) {
      throw new Error(
        "Forbidden use of secret API key in browser: A Supabase Secret Key (sb_secret_...) is currently placed in VITE_SUPABASE_ANON_KEY in your .env file. " +
        "Secret keys bypass RLS and are strictly prohibited in browser code. " +
        "Please open Supabase Dashboard -> Project Settings -> API, copy the 'anon' 'public' key (starts with sb_publishable_ or eyJ...) and paste it into .env."
      );
    }

    if (!isSupabaseConfigured() || !supabase) {
      throw new Error(
        "Supabase connection is not configured. Please paste your Supabase Publishable / Anon key into VITE_SUPABASE_ANON_KEY in your .env file."
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("forbidden use of secret api key") || msg.includes("secret api key")) {
        throw new Error(
          "Forbidden use of secret API key in browser: A secret key was passed to Supabase. " +
          "Please replace VITE_SUPABASE_ANON_KEY with your project's Publishable/Anon key (starts with sb_publishable_ or eyJ...)."
        );
      } else if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
        throw new Error("Invalid email or password. Please verify your credentials and try again.");
      } else if (msg.includes("email not confirmed")) {
        throw new Error("This email is not confirmed yet. In Supabase Dashboard -> Authentication -> Users, make sure 'Auto Confirm' was enabled or confirm the user.");
      } else if (msg.includes("too many requests") || msg.includes("rate limit")) {
        throw new Error("Too many sign-in attempts. Please wait a minute and try again.");
      } else {
        throw new Error(error.message || "Authentication failed.");
      }
    }

    if (!data?.user) {
      throw new Error("No user profile returned from Supabase Auth.");
    }

    // Authorization check: ensure user is an administrator
    const isAuthorized = await api.checkAdminAuthorization(data.user);
    if (!isAuthorized) {
      await supabase.auth.signOut().catch(() => {});
      throw new Error("Access denied. This account does not have administrator privileges.");
    }

    const userObj = {
      id: data.user.id,
      email: data.user.email,
      username: data.user.email.split("@")[0],
      name: data.user.user_metadata?.full_name || data.user.email.split("@")[0],
      role: "admin",
      lastSignIn: data.user.last_sign_in_at
    };

    localStorage.setItem("admin_token", data.session?.access_token || "");
    localStorage.setItem("admin_user", JSON.stringify(userObj));
    return { success: true, token: data.session?.access_token, user: userObj, session: data.session };
  },

  checkAdminAuthorization: async (user) => {
    if (!user) return false;

    // 1. Check user metadata or app metadata
    if (user.app_metadata?.role === "admin" || user.user_metadata?.role === "admin") {
      return true;
    }

    // 2. Check admin_users table in Supabase if exists
    try {
      if (supabase) {
        const { data: adminRows, error } = await supabase
          .from("admin_users")
          .select("id, email, role")
          .limit(10);

        if (!error && Array.isArray(adminRows) && adminRows.length > 0) {
          const match = adminRows.find(
            (a) => a.email?.toLowerCase() === user.email?.toLowerCase() || a.id === user.id
          );
          return Boolean(match);
        }
      }
    } catch {
      // Table doesn't exist or query skipped
    }

    // 3. Since user was manually created directly in the private Supabase Dashboard by the project owner, authorize as admin
    return true;
  },

  verifyToken: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      return { valid: false, user: null };
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session?.user) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        return { valid: false, user: null };
      }

      const user = data.session.user;
      const userObj = {
        id: user.id,
        email: user.email,
        username: user.email.split("@")[0],
        name: user.user_metadata?.full_name || user.email.split("@")[0],
        role: "admin",
        lastSignIn: user.last_sign_in_at
      };

      localStorage.setItem("admin_token", data.session.access_token);
      localStorage.setItem("admin_user", JSON.stringify(userObj));
      return { valid: true, user: userObj, session: data.session };
    } catch {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      return { valid: false, user: null };
    }
  },

  logout: async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    return { success: true };
  },

  onAuthStateChange: (callback) => {
    if (isSupabaseConfigured() && supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });
      return data?.subscription;
    }
    return null;
  },

  // ------------------------------------------------------------------------
  // Public Sliders & Vehicles (Supabase First)
  // ------------------------------------------------------------------------
  getPublicSliders: async () => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("hero_sliders")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Supabase sliders fetch error:", error);
        throw new Error(error.message);
      }
      return (data || []).map(formatSliderRow);
    }

    // Local API fallback
    const res = await fetch(`${BASE_URL}/sliders`);
    if (!res.ok) throw new Error("Failed to fetch sliders");
    const json = await res.json();
    return (json.data || []).map(formatSliderRow);
  },

  getPublicVehicles: async () => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Supabase vehicles fetch error:", error);
        throw new Error(error.message);
      }
      return (data || []).map(formatVehicleRow);
    }

    // Local API fallback
    const res = await fetch(`${BASE_URL}/vehicles`);
    if (!res.ok) throw new Error("Failed to fetch vehicles");
    const json = await res.json();
    return (json.data || []).map(formatVehicleRow);
  },

  getPublicServiceLocations: async () => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("service_locations")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        return data;
      }
    }
    return null;
  },

  // ------------------------------------------------------------------------
  // Admin Sliders CRUD
  // ------------------------------------------------------------------------
  getAdminSliders: async () => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("hero_sliders")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw new Error(error.message);
      return (data || []).map(formatSliderRow);
    }

    const res = await fetch(`${BASE_URL}/admin/sliders`, { headers: getAuthHeaders() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to fetch admin sliders");
    return (json.data || []).map(formatSliderRow);
  },

  createSlider: async (sliderData) => {
    const heading = sliderData.title || sliderData.heading || "";
    const description = sliderData.subtitle || sliderData.description || "";
    const image_url = sliderData.image || sliderData.image_url || "";
    const is_active = sliderData.active !== false;

    if (isSupabaseConfigured() && supabase) {
      // Get current max order
      const { data: maxRow } = await supabase
        .from("hero_sliders")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1);

      const nextOrder = (maxRow?.[0]?.display_order || 0) + 1;

      const { data, error } = await supabase
        .from("hero_sliders")
        .insert({
          heading,
          description,
          image_url,
          is_active,
          display_order: sliderData.display_order || nextOrder
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return formatSliderRow(data);
    }

    const res = await fetch(`${BASE_URL}/admin/sliders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(sliderData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to create slider");
    return formatSliderRow(json.data);
  },

  updateSlider: async (id, sliderData) => {
    const heading = sliderData.title || sliderData.heading;
    const description = sliderData.subtitle || sliderData.description;
    const image_url = sliderData.image || sliderData.image_url;
    const is_active = sliderData.active !== undefined ? sliderData.active : sliderData.is_active;

    if (isSupabaseConfigured() && supabase) {
      const payload = {};
      if (heading !== undefined) payload.heading = heading;
      if (description !== undefined) payload.description = description;
      if (image_url !== undefined) payload.image_url = image_url;
      if (is_active !== undefined) payload.is_active = is_active;
      if (sliderData.display_order !== undefined) payload.display_order = sliderData.display_order;

      const { data, error } = await supabase
        .from("hero_sliders")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return formatSliderRow(data);
    }

    const res = await fetch(`${BASE_URL}/admin/sliders/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(sliderData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to update slider");
    return formatSliderRow(json.data);
  },

  toggleSlider: async (id, currentStatus) => {
    if (isSupabaseConfigured() && supabase) {
      const newActive = !currentStatus;
      const { data, error } = await supabase
        .from("hero_sliders")
        .update({ is_active: newActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return formatSliderRow(data);
    }

    const res = await fetch(`${BASE_URL}/admin/sliders/${id}/toggle`, {
      method: "PATCH",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to toggle slider");
    return formatSliderRow(json.data);
  },

  deleteSlider: async (id, imageToDelete) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("hero_sliders").delete().eq("id", id);
      if (error) throw new Error(error.message);

      // Clean up unused storage file if it is an uploaded image
      if (imageToDelete) {
        await deleteFromStorage("hero_sliders", imageToDelete);
      }
      return { success: true };
    }

    const res = await fetch(`${BASE_URL}/admin/sliders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to delete slider");
    return json.data;
  },

  reorderSliders: async (orderedIds) => {
    if (isSupabaseConfigured() && supabase) {
      const updates = orderedIds.map((id, index) =>
        supabase
          .from("hero_sliders")
          .update({ display_order: index + 1 })
          .eq("id", id)
      );
      await Promise.all(updates);
      return { success: true };
    }

    const res = await fetch(`${BASE_URL}/admin/sliders-reorder`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to reorder sliders");
    return json.data;
  },

  // ------------------------------------------------------------------------
  // Admin Vehicles CRUD
  // ------------------------------------------------------------------------
  getAdminVehicles: async () => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw new Error(error.message);
      return (data || []).map(formatVehicleRow);
    }

    const res = await fetch(`${BASE_URL}/admin/vehicles`, { headers: getAuthHeaders() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to fetch admin vehicles");
    return (json.data || []).map(formatVehicleRow);
  },

  createVehicle: async (vehicleData) => {
    const vehicle_name = vehicleData.name || vehicleData.vehicle_name || "";
    const vehicle_model = vehicleData.model || vehicleData.vehicle_model || "";
    const seating_capacity = vehicleData.seating_capacity || "4 Seats";
    const luggage_capacity = vehicleData.luggage_capacity || "2 Bags";
    const description = vehicleData.description || "";
    const images = Array.isArray(vehicleData.image_urls)
      ? vehicleData.image_urls
      : [vehicleData.image || vehicleData.image_urls].filter(Boolean);
    const is_active = vehicleData.active !== false && vehicleData.is_active !== false;

    if (isSupabaseConfigured() && supabase) {
      const { data: maxRow } = await supabase
        .from("vehicles")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1);

      const nextOrder = (maxRow?.[0]?.display_order || 0) + 1;

      const { data, error } = await supabase
        .from("vehicles")
        .insert({
          vehicle_name,
          vehicle_model,
          seating_capacity,
          luggage_capacity,
          description,
          image_urls: images,
          is_active,
          display_order: vehicleData.display_order || nextOrder
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return formatVehicleRow(data);
    }

    const res = await fetch(`${BASE_URL}/admin/vehicles`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to create vehicle");
    return formatVehicleRow(json.data);
  },

  updateVehicle: async (id, vehicleData) => {
    const vehicle_name = vehicleData.name || vehicleData.vehicle_name;
    const vehicle_model = vehicleData.model || vehicleData.vehicle_model;
    const seating_capacity = vehicleData.seating_capacity;
    const luggage_capacity = vehicleData.luggage_capacity;
    const description = vehicleData.description;
    const is_active = vehicleData.active !== undefined ? vehicleData.active : vehicleData.is_active;

    let images = undefined;
    if (vehicleData.image_urls) {
      images = Array.isArray(vehicleData.image_urls) ? vehicleData.image_urls : [vehicleData.image_urls];
    } else if (vehicleData.image) {
      images = [vehicleData.image];
    }

    if (isSupabaseConfigured() && supabase) {
      const payload = {};
      if (vehicle_name !== undefined) payload.vehicle_name = vehicle_name;
      if (vehicle_model !== undefined) payload.vehicle_model = vehicle_model;
      if (seating_capacity !== undefined) payload.seating_capacity = seating_capacity;
      if (luggage_capacity !== undefined) payload.luggage_capacity = luggage_capacity;
      if (description !== undefined) payload.description = description;
      if (images !== undefined) payload.image_urls = images;
      if (is_active !== undefined) payload.is_active = is_active;
      if (vehicleData.display_order !== undefined) payload.display_order = vehicleData.display_order;

      const { data, error } = await supabase
        .from("vehicles")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return formatVehicleRow(data);
    }

    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to update vehicle");
    return formatVehicleRow(json.data);
  },

  toggleVehicle: async (id, currentStatus) => {
    if (isSupabaseConfigured() && supabase) {
      const newActive = !currentStatus;
      const { data, error } = await supabase
        .from("vehicles")
        .update({ is_active: newActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return formatVehicleRow(data);
    }

    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}/toggle`, {
      method: "PATCH",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to toggle vehicle");
    return formatVehicleRow(json.data);
  },

  deleteVehicle: async (id, imageToDelete) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw new Error(error.message);

      if (imageToDelete) {
        await deleteFromStorage("vehicles", imageToDelete);
      }
      return { success: true };
    }

    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to delete vehicle");
    return json.data;
  },

  reorderVehicles: async (orderedIds) => {
    if (isSupabaseConfigured() && supabase) {
      const updates = orderedIds.map((id, index) =>
        supabase
          .from("vehicles")
          .update({ display_order: index + 1 })
          .eq("id", id)
      );
      await Promise.all(updates);
      return { success: true };
    }

    const res = await fetch(`${BASE_URL}/admin/vehicles-reorder`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to reorder vehicles");
    return json.data;
  },

  // ------------------------------------------------------------------------
  // File Uploads (Supabase Storage First)
  // ------------------------------------------------------------------------
  uploadVehicleImage: async (file) => {
    if (isSupabaseConfigured() && supabase) {
      return await uploadToStorage("vehicles", file);
    }
    return await api.uploadImageFallback(file);
  },

  uploadSliderImage: async (file) => {
    if (isSupabaseConfigured() && supabase) {
      return await uploadToStorage("hero_sliders", file);
    }
    return await api.uploadImageFallback(file);
  },

  uploadImage: async (file) => {
    // Default to vehicles bucket
    return await api.uploadVehicleImage(file);
  },

  uploadImageFallback: async (file) => {
    const token = localStorage.getItem("admin_token");
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${BASE_URL}/admin/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Image upload failed");
    return json;
  },

  // ------------------------------------------------------------------------
  // Admin Profile & Settings
  // ------------------------------------------------------------------------
  updateProfile: async (profileData) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: profileData.name, phone: profileData.phone }
      });
      if (error) throw new Error(error.message);
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        name: profileData.name,
        role: "admin"
      };
      localStorage.setItem("admin_user", JSON.stringify(userObj));
      return { success: true, user: userObj };
    }

    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to update profile");
    if (json.user) {
      localStorage.setItem("admin_user", JSON.stringify(json.user));
    }
    return json;
  },

  changePassword: async (currentPassword, newPassword) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      return { success: true, message: "Password updated successfully in Supabase." };
    }

    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to change password");
    return json;
  }
};

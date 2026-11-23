/**
 * Centralized API service for Deekshitha Travels.
 * Handles both public endpoints and authenticated admin CRUD operations.
 */

const BASE_URL = "/api";

function getAuthHeaders() {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // ------------------------------------------------------------------------
  // Authentication
  // ------------------------------------------------------------------------
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    if (data.token) {
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
    }
    return data;
  },

  verifyToken: async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return { valid: false };

    try {
      const res = await fetch(`${BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        return { valid: false };
      }
      return data;
    } catch {
      return { valid: false };
    }
  },

  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  },

  // ------------------------------------------------------------------------
  // Public Sliders & Vehicles
  // ------------------------------------------------------------------------
  getPublicSliders: async () => {
    const res = await fetch(`${BASE_URL}/sliders`);
    if (!res.ok) throw new Error("Failed to fetch sliders");
    const json = await res.json();
    return json.data || [];
  },

  getPublicVehicles: async () => {
    const res = await fetch(`${BASE_URL}/vehicles`);
    if (!res.ok) throw new Error("Failed to fetch vehicles");
    const json = await res.json();
    return json.data || [];
  },

  // ------------------------------------------------------------------------
  // Admin Sliders CRUD
  // ------------------------------------------------------------------------
  getAdminSliders: async () => {
    const res = await fetch(`${BASE_URL}/admin/sliders`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to fetch admin sliders");
    return json.data || [];
  },

  createSlider: async (sliderData) => {
    const res = await fetch(`${BASE_URL}/admin/sliders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(sliderData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to create slider");
    return json.data;
  },

  updateSlider: async (id, sliderData) => {
    const res = await fetch(`${BASE_URL}/admin/sliders/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(sliderData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to update slider");
    return json.data;
  },

  toggleSlider: async (id) => {
    const res = await fetch(`${BASE_URL}/admin/sliders/${id}/toggle`, {
      method: "PATCH",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to toggle slider");
    return json.data;
  },

  deleteSlider: async (id) => {
    const res = await fetch(`${BASE_URL}/admin/sliders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to delete slider");
    return json.data;
  },

  reorderSliders: async (orderedIds) => {
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
    const res = await fetch(`${BASE_URL}/admin/vehicles`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to fetch admin vehicles");
    return json.data || [];
  },

  createVehicle: async (vehicleData) => {
    const res = await fetch(`${BASE_URL}/admin/vehicles`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to create vehicle");
    return json.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to update vehicle");
    return json.data;
  },

  toggleVehicle: async (id) => {
    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}/toggle`, {
      method: "PATCH",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to toggle vehicle");
    return json.data;
  },

  deleteVehicle: async (id) => {
    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to delete vehicle");
    return json.data;
  },

  reorderVehicles: async (orderedIds) => {
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
  // Admin File Upload
  // ------------------------------------------------------------------------
  uploadImage: async (file) => {
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

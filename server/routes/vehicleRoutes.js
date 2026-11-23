import { Router } from "express";
import { getDb, saveDb } from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();

// --------------------------------------------------------------------------
// Public Endpoints
// --------------------------------------------------------------------------

// GET /api/vehicles - Public: Returns only active vehicles
router.get("/vehicles", (req, res) => {
  const db = getDb();
  const activeVehicles = (db.vehicles || [])
    .filter((v) => v.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  res.json({ success: true, count: activeVehicles.length, data: activeVehicles });
});

// --------------------------------------------------------------------------
// Admin Endpoints (Protected)
// --------------------------------------------------------------------------

// GET /api/admin/vehicles - Returns all vehicles
router.get("/admin/vehicles", requireAuth, (req, res) => {
  const db = getDb();
  const vehicles = (db.vehicles || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, count: vehicles.length, data: vehicles });
});

// POST /api/admin/vehicles - Create new vehicle
router.post("/admin/vehicles", requireAuth, (req, res) => {
  const {
    name,
    model,
    category,
    image,
    image_alt,
    seating_capacity,
    luggage_capacity,
    is_ac,
    ac_label,
    description,
    price_display,
    price_note,
    badge,
    active
  } = req.body;

  if (!name || !image) {
    return res.status(400).json({ error: "Vehicle name and photograph are required" });
  }

  const db = getDb();
  const vehicles = db.vehicles || [];
  const maxOrder = vehicles.reduce((max, v) => Math.max(max, v.order || 0), 0);

  const newVehicle = {
    id: `vehicle-${Date.now()}`,
    name: name.trim(),
    model: (model || name).trim(),
    category: (category || "Standard Taxi").trim(),
    image: image.trim(),
    image_alt: (image_alt || `${name} taxi service in Tirupati`).trim(),
    seating_capacity: (seating_capacity || "4 Seats").trim(),
    luggage_capacity: (luggage_capacity || "2 Bags").trim(),
    is_ac: is_ac !== false,
    ac_label: (ac_label || (is_ac !== false ? "AC" : "Non-AC")).trim(),
    description: (description || "Reliable and comfortable travel in Tirupati and surrounding areas.").trim(),
    price_display: (price_display || "Tariff on Request").trim(),
    price_note: (price_note || "Contact for custom quotes").trim(),
    badge: (badge || "").trim(),
    order: maxOrder + 1,
    active: active !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  vehicles.push(newVehicle);
  db.vehicles = vehicles;
  saveDb(db);

  res.status(201).json({ success: true, message: "Vehicle added successfully", data: newVehicle });
});

// PUT /api/admin/vehicles/:id - Update existing vehicle
router.put("/admin/vehicles/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const {
    name,
    model,
    category,
    image,
    image_alt,
    seating_capacity,
    luggage_capacity,
    is_ac,
    ac_label,
    description,
    price_display,
    price_note,
    badge,
    active,
    order
  } = req.body;

  const db = getDb();
  const vehicles = db.vehicles || [];
  const index = vehicles.findIndex((v) => v.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  const current = vehicles[index];
  vehicles[index] = {
    ...current,
    name: name !== undefined ? name.trim() : current.name,
    model: model !== undefined ? model.trim() : current.model,
    category: category !== undefined ? category.trim() : current.category,
    image: image !== undefined ? image.trim() : current.image,
    image_alt: image_alt !== undefined ? image_alt.trim() : current.image_alt,
    seating_capacity: seating_capacity !== undefined ? seating_capacity.trim() : current.seating_capacity,
    luggage_capacity: luggage_capacity !== undefined ? luggage_capacity.trim() : current.luggage_capacity,
    is_ac: is_ac !== undefined ? Boolean(is_ac) : current.is_ac,
    ac_label: ac_label !== undefined ? ac_label.trim() : current.ac_label,
    description: description !== undefined ? description.trim() : current.description,
    price_display: price_display !== undefined ? price_display.trim() : current.price_display,
    price_note: price_note !== undefined ? price_note.trim() : current.price_note,
    badge: badge !== undefined ? badge.trim() : current.badge,
    active: active !== undefined ? Boolean(active) : current.active,
    order: order !== undefined ? Number(order) : current.order,
    updatedAt: new Date().toISOString()
  };

  db.vehicles = vehicles;
  saveDb(db);

  res.json({ success: true, message: "Vehicle updated successfully", data: vehicles[index] });
});

// PATCH /api/admin/vehicles/:id/toggle - Toggle vehicle active state
router.patch("/admin/vehicles/:id/toggle", requireAuth, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const vehicles = db.vehicles || [];
  const index = vehicles.findIndex((v) => v.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  vehicles[index].active = !vehicles[index].active;
  vehicles[index].updatedAt = new Date().toISOString();
  db.vehicles = vehicles;
  saveDb(db);

  res.json({
    success: true,
    message: `Vehicle ${vehicles[index].active ? "activated" : "deactivated"}`,
    data: vehicles[index]
  });
});

// DELETE /api/admin/vehicles/:id - Delete vehicle
router.delete("/admin/vehicles/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const vehicles = db.vehicles || [];
  const index = vehicles.findIndex((v) => v.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  const deleted = vehicles.splice(index, 1)[0];
  db.vehicles = vehicles;
  saveDb(db);

  res.json({ success: true, message: "Vehicle deleted successfully", data: deleted });
});

// PUT /api/admin/vehicles-reorder - Reorder vehicles
router.put("/admin/vehicles-reorder", requireAuth, (req, res) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: "orderedIds must be an array of vehicle IDs" });
  }

  const db = getDb();
  const vehicles = db.vehicles || [];

  orderedIds.forEach((id, idx) => {
    const v = vehicles.find((item) => item.id === id);
    if (v) {
      v.order = idx + 1;
      v.updatedAt = new Date().toISOString();
    }
  });

  db.vehicles = vehicles;
  saveDb(db);

  res.json({ success: true, message: "Vehicles reordered successfully", data: vehicles });
});

export default router;

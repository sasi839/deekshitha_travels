import { Router } from "express";
import { getDb, saveDb } from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();

// --------------------------------------------------------------------------
// Public Endpoints
// --------------------------------------------------------------------------

// GET /api/sliders - Public: Returns only active sliders sorted by order
router.get("/sliders", (req, res) => {
  const db = getDb();
  const activeSliders = (db.sliders || [])
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  res.json({ success: true, count: activeSliders.length, data: activeSliders });
});

// --------------------------------------------------------------------------
// Admin Endpoints (Protected)
// --------------------------------------------------------------------------

// GET /api/admin/sliders - Returns all sliders for dashboard
router.get("/admin/sliders", requireAuth, (req, res) => {
  const db = getDb();
  const sliders = (db.sliders || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, count: sliders.length, data: sliders });
});

// POST /api/admin/sliders - Create new slider
router.post("/admin/sliders", requireAuth, (req, res) => {
  const { image, alt, badge, title, subtitle, buttonText, whatsappText, active } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Slider image URL or path is required" });
  }

  const db = getDb();
  const sliders = db.sliders || [];
  const maxOrder = sliders.reduce((max, s) => Math.max(max, s.order || 0), 0);

  const newSlider = {
    id: `slider-${Date.now()}`,
    image: image.trim(),
    alt: (alt || title || "Deekshitha Travels hero slide").trim(),
    badge: (badge || "Tirupati Travel").trim(),
    title: (title || "Tirupati & Tirumala Cabs").trim(),
    subtitle: (subtitle || "Reliable temple darshan & airport taxi service.").trim(),
    buttonText: (buttonText || "Call Now").trim(),
    whatsappText: (whatsappText || "WhatsApp").trim(),
    order: maxOrder + 1,
    active: active !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  sliders.push(newSlider);
  db.sliders = sliders;
  saveDb(db);

  res.status(201).json({ success: true, message: "Slider created successfully", data: newSlider });
});

// PUT /api/admin/sliders/:id - Update existing slider
router.put("/admin/sliders/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { image, alt, badge, title, subtitle, buttonText, whatsappText, active, order } = req.body;

  const db = getDb();
  const sliders = db.sliders || [];
  const index = sliders.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Slider not found" });
  }

  const current = sliders[index];
  sliders[index] = {
    ...current,
    image: image !== undefined ? image.trim() : current.image,
    alt: alt !== undefined ? alt.trim() : current.alt,
    badge: badge !== undefined ? badge.trim() : current.badge,
    title: title !== undefined ? title.trim() : current.title,
    subtitle: subtitle !== undefined ? subtitle.trim() : current.subtitle,
    buttonText: buttonText !== undefined ? buttonText.trim() : current.buttonText,
    whatsappText: whatsappText !== undefined ? whatsappText.trim() : current.whatsappText,
    active: active !== undefined ? Boolean(active) : current.active,
    order: order !== undefined ? Number(order) : current.order,
    updatedAt: new Date().toISOString()
  };

  db.sliders = sliders;
  saveDb(db);

  res.json({ success: true, message: "Slider updated successfully", data: sliders[index] });
});

// PATCH /api/admin/sliders/:id/toggle - Quick toggle active/inactive
router.patch("/admin/sliders/:id/toggle", requireAuth, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const sliders = db.sliders || [];
  const index = sliders.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Slider not found" });
  }

  sliders[index].active = !sliders[index].active;
  sliders[index].updatedAt = new Date().toISOString();
  db.sliders = sliders;
  saveDb(db);

  res.json({
    success: true,
    message: `Slider ${sliders[index].active ? "activated" : "deactivated"}`,
    data: sliders[index]
  });
});

// DELETE /api/admin/sliders/:id - Delete slider
router.delete("/admin/sliders/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const sliders = db.sliders || [];
  const index = sliders.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Slider not found" });
  }

  const deleted = sliders.splice(index, 1)[0];
  db.sliders = sliders;
  saveDb(db);

  res.json({ success: true, message: "Slider deleted successfully", data: deleted });
});

// PUT /api/admin/sliders/reorder - Reorder sliders
router.put("/admin/sliders-reorder", requireAuth, (req, res) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: "orderedIds must be an array of slider IDs" });
  }

  const db = getDb();
  const sliders = db.sliders || [];

  orderedIds.forEach((id, idx) => {
    const s = sliders.find((item) => item.id === id);
    if (s) {
      s.order = idx + 1;
      s.updatedAt = new Date().toISOString();
    }
  });

  db.sliders = sliders;
  saveDb(db);

  res.json({ success: true, message: "Sliders reordered successfully", data: sliders });
});

export default router;

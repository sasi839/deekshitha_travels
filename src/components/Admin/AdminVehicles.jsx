import { useState } from "react";
import { api } from "../../services/api";

const COMMON_CATEGORIES = [
  "Prime Sedan",
  "Family & Pilgrim SUV",
  "Executive Travel",
  "Group Traveller",
  "Mini Bus",
  "Hatchback"
];

export default function AdminVehicles({ vehicles, onRefresh, onShowToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const initialForm = {
    name: "",
    model: "",
    category: "Prime Sedan",
    image: "",
    image_alt: "",
    seating_capacity: "4 Seats",
    luggage_capacity: "2-3 Bags",
    is_ac: true,
    ac_label: "AC",
    description: "",
    price_display: "Tariff on Request",
    price_note: "Contact for custom quotes",
    badge: "",
    active: true
  };

  const [form, setForm] = useState(initialForm);

  const openAddModal = () => {
    setEditingVehicle(null);
    setForm(initialForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      name: vehicle.name || "",
      model: vehicle.model || "",
      category: vehicle.category || "Prime Sedan",
      image: vehicle.image || "",
      image_alt: vehicle.image_alt || "",
      seating_capacity: vehicle.seating_capacity || "4 Seats",
      luggage_capacity: vehicle.luggage_capacity || "2 Bags",
      is_ac: vehicle.is_ac !== false,
      ac_label: vehicle.ac_label || "AC",
      description: vehicle.description || "",
      price_display: vehicle.price_display || "Tariff on Request",
      price_note: vehicle.price_note || "",
      badge: vehicle.badge || "",
      active: vehicle.active !== false
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    setFormError("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Selected photo exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    try {
      setUploading(true);
      setFormError("");
      const res = await api.uploadImage(file);
      setForm((prev) => ({
        ...prev,
        image: res.url,
        image_alt: prev.image_alt || `${prev.name || "Taxi"} photo`
      }));
      if (onShowToast) onShowToast("Vehicle photograph uploaded!", "success");
    } catch (err) {
      setFormError(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Vehicle name is required.");
      return;
    }
    if (!form.image.trim()) {
      setFormError("Vehicle photo is required (upload or provide an image URL).");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const payload = {
        ...form,
        image_alt: form.image_alt.trim() || `${form.name} for hire in Tirupati`
      };

      if (editingVehicle) {
        await api.updateVehicle(editingVehicle.id, payload);
        if (onShowToast) onShowToast("Vehicle details updated!", "success");
      } else {
        await api.createVehicle(payload);
        if (onShowToast) onShowToast("New vehicle added to fleet!", "success");
      }

      closeModal();
      await onRefresh();
    } catch (err) {
      setFormError(err.message || "Error saving vehicle");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (vehicle) => {
    try {
      await api.toggleVehicle(vehicle.id);
      if (onShowToast) {
        onShowToast(
          `Vehicle ${vehicle.active ? "hidden from" : "visible on"} public site.`,
          "success"
        );
      }
      await onRefresh();
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to toggle status", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteVehicle(id);
      setDeleteConfirmId(null);
      if (onShowToast) onShowToast("Vehicle removed from fleet.", "success");
      await onRefresh();
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to delete vehicle", "error");
    }
  };

  const handleMove = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= vehicles.length) return;

    const reordered = [...vehicles];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const orderedIds = reordered.map((v) => v.id);
    try {
      await api.reorderVehicles(orderedIds);
      await onRefresh();
      if (onShowToast) onShowToast("Fleet display order updated.", "success");
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to reorder", "error");
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Vehicle Fleet Management</h2>
          <p className="admin-page-subtitle">
            Manage your fleet inventory, seating capacities, air conditioning, and visibility on the public website.
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={openAddModal}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="admin-card">
        {vehicles.length === 0 ? (
          <div className="admin-empty-state">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <p>No vehicles found. Add your first cab to display on the fleet section.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Order</th>
                  <th style={{ width: "120px" }}>Photo</th>
                  <th>Vehicle Name &amp; Category</th>
                  <th style={{ width: "140px" }}>Capacity</th>
                  <th style={{ width: "100px" }}>AC</th>
                  <th style={{ width: "110px" }}>Status</th>
                  <th style={{ width: "150px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, index) => (
                  <tr key={v.id} className={v.active === false ? "row-inactive" : ""}>
                    <td>
                      <div className="order-reorder-group">
                        <span className="order-badge">{index + 1}</span>
                        <div className="reorder-btns">
                          <button
                            type="button"
                            className="reorder-btn"
                            disabled={index === 0}
                            onClick={() => handleMove(index, -1)}
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="reorder-btn"
                            disabled={index === vehicles.length - 1}
                            onClick={() => handleMove(index, 1)}
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-thumb-wrapper">
                        <img
                          src={v.image}
                          alt={v.name}
                          className="admin-thumb-img"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="slider-info-cell">
                        <div className="vehicle-title-row">
                          <strong className="slider-table-title">{v.name}</strong>
                          {v.badge && <span className="vehicle-badge-pill">{v.badge}</span>}
                        </div>
                        <span className="vehicle-subcat">{v.category} &bull; {v.model || "Standard"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="capacity-info-cell">
                        <span className="cap-tag seat-tag">{v.seating_capacity || "4 Seats"}</span>
                        <span className="cap-tag bag-tag">{v.luggage_capacity || "2 Bags"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`ac-indicator ${v.is_ac !== false ? "ac-yes" : "ac-no"}`}>
                        {v.ac_label || (v.is_ac !== false ? "AC" : "Non-AC")}
                      </span>
                    </td>
                    <td>
                      <label className="admin-toggle-switch" title={v.active ? "Click to Deactivate" : "Click to Activate"}>
                        <input
                          type="checkbox"
                          checked={v.active !== false}
                          onChange={() => handleToggleActive(v)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label-text">
                          {v.active !== false ? "Active" : "Hidden"}
                        </span>
                      </label>
                    </td>
                    <td>
                      <div className="table-action-btns">
                        <button
                          type="button"
                          className="action-icon-btn edit-btn"
                          onClick={() => openEditModal(v)}
                          title="Edit Vehicle"
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn delete-btn"
                          onClick={() => setDeleteConfirmId(v.id)}
                          title="Delete Vehicle"
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingVehicle ? "Edit Vehicle Details" : "Add Vehicle to Fleet"}
              </h3>
              <button type="button" className="admin-modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              {formError && <div className="admin-form-alert error">{formError}</div>}

              {/* Photo Upload & Preview */}
              <div className="admin-form-group">
                <label className="admin-label">
                  Vehicle Photograph <span className="req">*</span>
                </label>
                <div className="image-upload-preview-container">
                  <div className="image-preview-box">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Vehicle preview"
                        className="live-preview-img"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                    ) : (
                      <div className="preview-placeholder">
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>No photo selected</span>
                      </div>
                    )}
                  </div>

                  <div className="image-input-controls">
                    <label className="admin-file-upload-btn">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ display: "none" }}
                      />
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                    </label>

                    <div className="or-divider">
                      <span>or enter image URL / path</span>
                    </div>

                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. /uploads/innova.jpg or https://..."
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Name & Model */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">
                    Vehicle Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Toyota Innova Crysta"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Model / Variant</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Crysta 2.4 VX/ZX"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <input
                    type="text"
                    list="category-suggestions"
                    className="admin-input"
                    placeholder="Select or enter category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                  <datalist id="category-suggestions">
                    {COMMON_CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Badge Tag (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Popular Choice, Pilgrim Favorite"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  />
                </div>
              </div>

              {/* Capacity Specs: Seating, Luggage, AC */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Seating Capacity</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 6-7 Seats or 4 Seats"
                    value={form.seating_capacity}
                    onChange={(e) => setForm({ ...form, seating_capacity: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Luggage Capacity</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 3-4 Bags"
                    value={form.luggage_capacity}
                    onChange={(e) => setForm({ ...form, luggage_capacity: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">AC Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. AC or Dual AC"
                    value={form.ac_label}
                    onChange={(e) => setForm({ ...form, ac_label: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="admin-form-group">
                <label className="admin-label">Description / Features</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="e.g. Comfortable and spacious cab with push-back seats, clean interiors, and experienced driver for Tirumala hills."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Price Note & Active Status */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Price / Tariff Note</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Tariff on Request or ₹12/km"
                    value={form.price_display}
                    onChange={(e) => setForm({ ...form, price_display: e.target.value })}
                  />
                </div>
                <div className="admin-form-group" style={{ display: "flex", alignItems: "flex-end", paddingBottom: "10px" }}>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    />
                    <span>Active on public website</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeModal}
                  disabled={saving || uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving || uploading}
                >
                  {saving ? "Saving..." : editingVehicle ? "Save Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="admin-modal-dialog delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-dialog-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="#dc2626" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="delete-dialog-title">Remove Vehicle?</h3>
            <p className="delete-dialog-desc">
              Are you sure you want to remove this vehicle from your fleet? It will immediately disappear from the public website.
            </p>
            <div className="delete-dialog-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Yes, Remove Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

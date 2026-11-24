import { useState } from "react";
import { api } from "../../services/api";

export default function AdminSliders({ sliders, onRefresh, onShowToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const initialForm = {
    badge: "Pilgrimage Cabs",
    title: "",
    subtitle: "",
    image: "",
    buttonText: "Book Tirumala Taxi",
    active: true
  };

  const [form, setForm] = useState(initialForm);

  const openAddModal = () => {
    setEditingSlider(null);
    setForm(initialForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (slider) => {
    setEditingSlider(slider);
    setForm({
      badge: slider.badge || "",
      title: slider.title || "",
      subtitle: slider.subtitle || "",
      image: slider.image || "",
      buttonText: slider.buttonText || "Book Ride",
      active: slider.active !== false
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSlider(null);
    setFormError("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Selected file exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    try {
      setUploading(true);
      setFormError("");
      const res = await api.uploadSliderImage(file);
      setForm((prev) => ({ ...prev, image: res.url }));
      if (onShowToast) onShowToast("Slider photograph uploaded to Supabase Storage!", "success");
    } catch (err) {
      setFormError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Slider heading / title is required.");
      return;
    }
    if (!form.image.trim()) {
      setFormError("Slider image is required (upload or provide an image URL).");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      if (editingSlider) {
        await api.updateSlider(editingSlider.id, form);
        if (onShowToast) onShowToast("Slider updated successfully!", "success");
      } else {
        await api.createSlider(form);
        if (onShowToast) onShowToast("New slider added successfully!", "success");
      }

      closeModal();
      await onRefresh();
    } catch (err) {
      setFormError(err.message || "Error saving slider");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slider) => {
    try {
      await api.toggleSlider(slider.id, slider.active !== false);
      if (onShowToast) {
        onShowToast(
          `Slider ${slider.active ? "deactivated" : "activated"} on live site.`,
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
      const s = sliders.find((item) => item.id === id);
      await api.deleteSlider(id, s?.image);
      setDeleteConfirmId(null);
      if (onShowToast) onShowToast("Slider deleted permanently.", "success");
      await onRefresh();
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to delete slider", "error");
    }
  };

  const handleMove = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sliders.length) return;

    const reordered = [...sliders];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const orderedIds = reordered.map((s) => s.id);
    try {
      await api.reorderSliders(orderedIds);
      await onRefresh();
      if (onShowToast) onShowToast("Slider order updated.", "success");
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to reorder", "error");
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Hero Slider Management</h2>
          <p className="admin-page-subtitle">
            Control the visual hero carousel on the public website. Add, edit, reorder, or toggle active slides.
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={openAddModal}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Slider</span>
          </button>
        </div>
      </div>

      {/* Sliders Table / List */}
      <div className="admin-card">
        {sliders.length === 0 ? (
          <div className="admin-empty-state">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <p>No hero sliders found. Add one above to showcase on the homepage.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Order</th>
                  <th style={{ width: "120px" }}>Preview</th>
                  <th>Heading &amp; Subtitle</th>
                  <th style={{ width: "130px" }}>Badge</th>
                  <th style={{ width: "110px" }}>Status</th>
                  <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sliders.map((slider, index) => (
                  <tr key={slider.id} className={slider.active === false ? "row-inactive" : ""}>
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
                            disabled={index === sliders.length - 1}
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
                          src={slider.image}
                          alt={slider.title}
                          className="admin-thumb-img"
                          onError={(e) => {
                            e.currentTarget.src = "/temple-tirumala.jpg";
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="slider-info-cell">
                        <strong className="slider-table-title">{slider.title}</strong>
                        <p className="slider-table-subtitle">{slider.subtitle || "No description"}</p>
                      </div>
                    </td>
                    <td>
                      <span className="admin-pill-badge">{slider.badge || "Hero"}</span>
                    </td>
                    <td>
                      <label className="admin-toggle-switch" title={slider.active ? "Click to Deactivate" : "Click to Activate"}>
                        <input
                          type="checkbox"
                          checked={slider.active !== false}
                          onChange={() => handleToggleActive(slider)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label-text">
                          {slider.active !== false ? "Active" : "Hidden"}
                        </span>
                      </label>
                    </td>
                    <td>
                      <div className="table-action-btns">
                        <button
                          type="button"
                          className="action-icon-btn edit-btn"
                          onClick={() => openEditModal(slider)}
                          title="Edit Slider"
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn delete-btn"
                          onClick={() => setDeleteConfirmId(slider.id)}
                          title="Delete Slider"
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

      {/* Add / Edit Slider Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingSlider ? "Edit Hero Slider" : "Add New Hero Slider"}
              </h3>
              <button type="button" className="admin-modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              {formError && <div className="admin-form-alert error">{formError}</div>}

              {/* Image Preview & Upload */}
              <div className="admin-form-group">
                <label className="admin-label">
                  Hero Image <span className="req">*</span>
                </label>
                <div className="image-upload-preview-container">
                  <div className="image-preview-box">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Hero preview"
                        className="live-preview-img"
                        onError={(e) => {
                          e.currentTarget.src = "/temple-tirumala.jpg";
                        }}
                      />
                    ) : (
                      <div className="preview-placeholder">
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>No image selected</span>
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
                      <span>{uploading ? "Uploading..." : "Upload Photograph"}</span>
                    </label>

                    <div className="or-divider">
                      <span>or enter image URL / path</span>
                    </div>

                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. /temple-tirumala.jpg or https://..."
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Tagline / Badge</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Tirumala Darshan Cab"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Button Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. WhatsApp Booking"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Main Heading <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Tirumala Sri Venkateswara Temple Cabs"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="e.g. Safe, timely pilgrimage taxi service with experienced ghat road drivers."
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  />
                  <span>Publish immediately to public website</span>
                </label>
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
                  {saving ? "Saving..." : editingSlider ? "Save Changes" : "Create Slider"}
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
            <h3 className="delete-dialog-title">Delete Hero Slider?</h3>
            <p className="delete-dialog-desc">
              Are you sure you want to permanently delete this slider from your website? This action cannot be undone.
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
                Yes, Delete Slider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

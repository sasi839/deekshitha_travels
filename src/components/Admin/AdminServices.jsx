import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { SERVICES_LIST, LOCATION_CATEGORIES } from "../../data/servicesData";

export default function AdminServices({ onShowToast }) {
  const [activeSubTab, setActiveSubTab] = useState("locations"); // "locations" | "services"
  
  // Locations state
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);
  const [deleteLocId, setDeleteLocId] = useState(null);
  const [savingLoc, setSavingLoc] = useState(false);
  const [locFormError, setLocFormError] = useState("");

  const initialLocForm = {
    location_name: "",
    location_category: "temples",
    description: "",
    is_active: true
  };
  const [locForm, setLocForm] = useState(initialLocForm);

  // Core Services state
  const [servicesList, setServicesList] = useState(SERVICES_LIST);
  const [uploadingServiceImg, setUploadingServiceImg] = useState(false);
  const [serviceImgSuccess, setServiceImgSuccess] = useState("");

  // Load locations from Supabase
  const loadLocations = useCallback(async () => {
    try {
      setLoadingLocations(true);
      const data = await api.getAdminLocations();
      setLocations(data);
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to load locations", "error");
    } finally {
      setLoadingLocations(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoadingLocations(true);
        const data = await api.getAdminLocations();
        if (isMounted) setLocations(data);
      } catch (err) {
        if (isMounted && onShowToast) onShowToast(err.message || "Failed to load locations", "error");
      } finally {
        if (isMounted) setLoadingLocations(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [onShowToast]);

  // Open Add Location Modal
  const openAddLocModal = () => {
    setEditingLoc(null);
    setLocForm(initialLocForm);
    setLocFormError("");
    setIsLocModalOpen(true);
  };

  // Open Edit Location Modal
  const openEditLocModal = (loc) => {
    setEditingLoc(loc);
    setLocForm({
      location_name: loc.location_name || "",
      location_category: loc.location_category || "temples",
      description: loc.description || "",
      is_active: loc.is_active !== false
    });
    setLocFormError("");
    setIsLocModalOpen(true);
  };

  const closeLocModal = () => {
    setIsLocModalOpen(false);
    setEditingLoc(null);
    setLocFormError("");
  };

  // Save Location (Create or Update)
  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!locForm.location_name.trim()) {
      setLocFormError("Location name is required.");
      return;
    }

    try {
      setSavingLoc(true);
      setLocFormError("");

      if (editingLoc) {
        await api.updateLocation(editingLoc.id, locForm);
        if (onShowToast) onShowToast("Service location updated successfully!", "success");
      } else {
        await api.createLocation(locForm);
        if (onShowToast) onShowToast("New service location added to Supabase!", "success");
      }

      closeLocModal();
      loadLocations();
    } catch (err) {
      setLocFormError(err.message || "Failed to save location");
    } finally {
      setSavingLoc(false);
    }
  };

  // Toggle Location Active
  const handleToggleLoc = async (loc) => {
    try {
      await api.toggleLocation(loc.id, loc.is_active);
      if (onShowToast) {
        onShowToast(`Location marked ${!loc.is_active ? "Active" : "Hidden"}`, "success");
      }
      loadLocations();
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to update status", "error");
    }
  };

  // Delete Location
  const handleDeleteLoc = async (id) => {
    try {
      await api.deleteLocation(id);
      setDeleteLocId(null);
      if (onShowToast) onShowToast("Location deleted from database.", "success");
      loadLocations();
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to delete location", "error");
    }
  };

  // Service Image Upload to Supabase Storage
  const handleServiceImageUpload = async (e, serviceId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (onShowToast) onShowToast("Image exceeds 5MB limit", "error");
      return;
    }

    try {
      setUploadingServiceImg(true);
      setServiceImgSuccess("");
      const res = await api.uploadServiceImage(file);
      
      // Update local state for servicesList
      setServicesList((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, image: res.url } : s))
      );

      setServiceImgSuccess(`Updated photo for service! New CDN URL: ${res.url}`);
      if (onShowToast) onShowToast("Service image uploaded to Supabase Storage!", "success");
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to upload service image", "error");
    } finally {
      setUploadingServiceImg(false);
    }
  };

  // Filtered locations
  const filteredLocations = selectedCategory === "all"
    ? locations
    : locations.filter((loc) => loc.location_category === selectedCategory);

  return (
    <div className="admin-page">
      {/* Top Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Services &amp; Locations</h2>
          <p className="admin-page-subtitle">
            Manage destination hubs in Supabase &amp; core taxi service offerings
          </p>
        </div>
        <div className="admin-header-actions">
          {activeSubTab === "locations" && (
            <button type="button" className="admin-btn admin-btn-primary" onClick={openAddLocModal}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Destination Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab Switcher */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.5rem" }}>
        <button
          type="button"
          className={`admin-btn ${activeSubTab === "locations" ? "admin-btn-primary" : "admin-btn-outline"}`}
          onClick={() => setActiveSubTab("locations")}
          style={{ height: 38, fontSize: "0.85rem" }}
        >
          <span>Destination Hubs &amp; Locations ({locations.length})</span>
        </button>
        <button
          type="button"
          className={`admin-btn ${activeSubTab === "services" ? "admin-btn-primary" : "admin-btn-outline"}`}
          onClick={() => setActiveSubTab("services")}
          style={{ height: 38, fontSize: "0.85rem" }}
        >
          <span>Core Services ({servicesList.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: DESTINATION HUBS & LOCATIONS */}
      {activeSubTab === "locations" && (
        <div>
          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {LOCATION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: selectedCategory === cat.id ? "#f5b014" : "rgba(255, 255, 255, 0.05)",
                  color: selectedCategory === cat.id ? "#121417" : "#cbd5e1",
                  border: "1px solid " + (selectedCategory === cat.id ? "#f5b014" : "rgba(255, 255, 255, 0.1)"),
                  borderRadius: 100,
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loadingLocations ? (
            <div className="admin-inline-loading" style={{ padding: "3rem" }}>
              <div className="admin-spinner"></div>
              <span>Loading Supabase locations...</span>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="admin-empty-state">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="#94a3b8" strokeWidth="1.5" fill="none">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3>No Locations Found</h3>
              <p>No service destination hubs match the selected category.</p>
              <button type="button" className="admin-btn admin-btn-primary" onClick={openAddLocModal}>
                Add First Location
              </button>
            </div>
          ) : (
            <div className="admin-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>#</th>
                    <th>Destination Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th style={{ width: 100 }}>Status</th>
                    <th style={{ width: 130, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocations.map((loc, idx) => (
                    <tr key={loc.id}>
                      <td>
                        <span style={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.85rem" }}>
                          {loc.display_order || idx + 1}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "#ffffff", fontSize: "0.92rem", display: "block" }}>
                          {loc.location_name}
                        </strong>
                        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>ID: {loc.id}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            background: "rgba(245, 176, 20, 0.12)",
                            color: "#f5b014",
                            border: "1px solid rgba(245, 176, 20, 0.25)",
                            borderRadius: 6,
                            padding: "0.2rem 0.5rem",
                            fontSize: "0.74rem",
                            fontWeight: 600,
                            textTransform: "capitalize"
                          }}
                        >
                          {loc.location_category}
                        </span>
                      </td>
                      <td style={{ maxWidth: 300 }}>
                        <span style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {loc.description || "—"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`admin-status-pill ${loc.is_active ? "active" : "inactive"}`}
                          onClick={() => handleToggleLoc(loc)}
                          title="Click to toggle active status"
                          style={{ cursor: "pointer", border: "none" }}
                        >
                          <span className="status-dot"></span>
                          <span>{loc.is_active ? "Active" : "Hidden"}</span>
                        </button>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className="admin-action-btn edit"
                            onClick={() => openEditLocModal(loc)}
                            title="Edit Location"
                          >
                            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn delete"
                            onClick={() => setDeleteLocId(loc.id)}
                            title="Delete Location"
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
      )}

      {/* SUBTAB 2: CORE SERVICES */}
      {activeSubTab === "services" && (
        <div>
          {serviceImgSuccess && (
            <div className="admin-alert admin-alert-success" style={{ marginBottom: "1rem" }}>
              <span>{serviceImgSuccess}</span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {servicesList.map((srv) => (
              <div
                key={srv.id}
                style={{
                  background: "linear-gradient(180deg, #181c22 0%, #12151b 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <div style={{ height: 160, position: "relative", backgroundColor: "#0f1115" }}>
                  <img
                    src={srv.image}
                    alt={srv.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = "/images/services/taxi_services.webp";
                    }}
                  />
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(18, 20, 23, 0.85)", backdropFilter: "blur(4px)", padding: "0.25rem 0.6rem", borderRadius: 100, fontSize: "0.72rem", color: "#f5b014", fontWeight: 700, border: "1px solid rgba(245, 176, 20, 0.3)" }}>
                    {srv.badge}
                  </div>
                </div>

                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.35rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                      {srv.title}
                    </h3>
                    <span style={{ fontSize: "0.75rem", color: "#f5b014", fontWeight: 600 }}>
                      {srv.rateNote}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.75rem" }}>
                    {srv.subtitle}
                  </span>
                  <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.45, margin: "0 0 1rem 0", flex: 1 }}>
                    {srv.description}
                  </p>

                  <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "rgba(245, 176, 20, 0.12)",
                        color: "#f5b014",
                        border: "1px solid rgba(245, 176, 20, 0.3)",
                        borderRadius: 8,
                        padding: "0.45rem 0.85rem",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: uploadingServiceImg ? "wait" : "pointer",
                        width: "100%",
                        justifyContent: "center",
                        boxSizing: "border-box"
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{uploadingServiceImg ? "Uploading to Storage..." : "Upload New Image (Storage)"}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: "none" }}
                        disabled={uploadingServiceImg}
                        onChange={(e) => handleServiceImageUpload(e, srv.id)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT LOCATION */}
      {isLocModalOpen && (
        <div className="admin-modal-backdrop" onClick={closeLocModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingLoc ? "Edit Destination Hub" : "Add New Destination Hub"}
              </h3>
              <button type="button" className="admin-modal-close" onClick={closeLocModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="admin-form">
              {locFormError && (
                <div className="admin-alert admin-alert-danger" style={{ marginBottom: "1rem" }}>
                  <span>{locFormError}</span>
                </div>
              )}

              <div className="admin-form-group">
                <label className="admin-label">
                  Destination Name <span className="star">*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Tirumala Venkateswara Temple"
                  value={locForm.location_name}
                  onChange={(e) => setLocForm({ ...locForm, location_name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Hub Category <span className="star">*</span>
                </label>
                <select
                  className="admin-input"
                  value={locForm.location_category}
                  onChange={(e) => setLocForm({ ...locForm, location_category: e.target.value })}
                >
                  <option value="transit">Airports &amp; Transit</option>
                  <option value="temples">Pilgrimage Temples</option>
                  <option value="areas">Key Areas &amp; Sightseeing</option>
                  <option value="institutions">Hospitals &amp; Campuses</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Description / Service Details</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="e.g. 24/7 dedicated cab service with hill-certified chauffeurs..."
                  value={locForm.description}
                  onChange={(e) => setLocForm({ ...locForm, description: e.target.value })}
                />
              </div>

              <div className="admin-form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="locActiveCheck"
                  checked={locForm.is_active}
                  onChange={(e) => setLocForm({ ...locForm, is_active: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: "#f5b014", cursor: "pointer" }}
                />
                <label htmlFor="locActiveCheck" style={{ color: "#cbd5e1", fontSize: "0.85rem", cursor: "pointer" }}>
                  Active (visible in public Service Locations on website)
                </label>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-outline" onClick={closeLocModal} disabled={savingLoc}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={savingLoc}>
                  {savingLoc ? "Saving to Supabase..." : editingLoc ? "Update Location" : "Add Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteLocId && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteLocId(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Confirm Deletion</h3>
              <button type="button" className="admin-modal-close" onClick={() => setDeleteLocId(null)}>
                &times;
              </button>
            </div>
            <div style={{ padding: "1.25rem 1.5rem" }}>
              <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>
                Are you sure you want to remove this service location from Supabase? This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn admin-btn-outline" onClick={() => setDeleteLocId(null)}>
                Cancel
              </button>
              <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDeleteLoc(deleteLocId)}>
                Delete from Supabase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

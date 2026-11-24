import { api } from "../../services/api";

export default function AdminOverview({ sliders, vehicles, onNavigate, onOpenNewSlider, onOpenNewVehicle, onBackToSite }) {
  const activeSliders = sliders.filter((s) => s.active !== false).length;
  const activeVehicles = vehicles.filter((v) => v.active !== false).length;
  const isSupabase = api.isSupabaseLive();

  return (
    <div className="admin-overview">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Dashboard Overview</h2>
          <p className="admin-page-subtitle">Real-time dynamic content control for Deekshitha Travels</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onBackToSite}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>View Live Site</span>
          </button>
        </div>
      </div>

      {/* Supabase Connectivity Status Banner */}
      <div className={`admin-alert ${isSupabase ? "admin-alert-success" : "admin-alert-info"}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: isSupabase ? "#10b981" : "#f59e0b" }} />
          <div>
            <strong>Database Connection: </strong>
            <span>{isSupabase ? "Live Supabase PostgreSQL & Storage Connected" : "Local Development Database Active"}</span>
          </div>
        </div>
        {!isSupabase && (
          <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Add VITE_SUPABASE_URL in .env to switch to cloud database
          </span>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" onClick={() => onNavigate("sliders")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon-wrap icon-gold">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Hero Sliders</span>
            <div className="admin-stat-number-row">
              <span className="admin-stat-number">{sliders.length}</span>
              <span className="admin-stat-badge badge-active">{activeSliders} Active</span>
            </div>
            <p className="admin-stat-desc">Click to manage homepage images &amp; text</p>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigate("vehicles")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon-wrap icon-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Vehicle Fleet</span>
            <div className="admin-stat-number-row">
              <span className="admin-stat-number">{vehicles.length}</span>
              <span className="admin-stat-badge badge-active">{activeVehicles} Active</span>
            </div>
            <p className="admin-stat-desc">Click to manage cabs, categories &amp; capacities</p>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigate("profile")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon-wrap icon-blue">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Admin Profile</span>
            <div className="admin-stat-number-row">
              <span className="admin-stat-text-status">Active Account</span>
            </div>
            <p className="admin-stat-desc">Click to update profile, password &amp; details</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="admin-quick-actions-card">
        <h3 className="admin-card-heading">Quick Actions</h3>
        <div className="admin-quick-buttons">
          <button type="button" className="admin-btn admin-btn-primary" onClick={onOpenNewSlider}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Slider</span>
          </button>

          <button type="button" className="admin-btn admin-btn-primary" onClick={onOpenNewVehicle}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Vehicle</span>
          </button>

          <button type="button" className="admin-btn admin-btn-outline" onClick={() => onNavigate("sliders")}>
            Manage Sliders
          </button>

          <button type="button" className="admin-btn admin-btn-outline" onClick={() => onNavigate("vehicles")}>
            Manage Fleet
          </button>

          <button type="button" className="admin-btn admin-btn-outline" onClick={() => onNavigate("profile")}>
            Admin Profile
          </button>
        </div>
      </div>
    </div>
  );
}

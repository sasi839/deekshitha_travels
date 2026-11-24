import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import AdminLogin from "./AdminLogin";
import AdminOverview from "./AdminOverview";
import AdminSliders from "./AdminSliders";
import AdminVehicles from "./AdminVehicles";
import AdminProfile from "./AdminProfile";
import logoImg from "../../assets/logo.png";
import "./AdminPanel.css";

export default function AdminPanel({ onBackToSite }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState("overview"); // "overview" | "sliders" | "vehicles" | "profile"
  const [sliders, setSliders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Verify auth on mount
  useEffect(() => {
    async function verify() {
      try {
        const res = await api.verifyToken();
        if (res && res.valid) {
          setIsAuthenticated(true);
          setCurrentUser(res.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    verify();

    // Subscribe to live Supabase auth state transitions
    const subscription = api.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          setIsAuthenticated(true);
          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            username: session.user.email.split("@")[0],
            name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
            role: "admin"
          });
        }
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Fetch admin data
  const loadAdminData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [slidersData, vehiclesData] = await Promise.all([
        api.getAdminSliders(),
        api.getAdminVehicles()
      ]);
      setSliders(slidersData);
      setVehicles(vehiclesData);
    } catch (err) {
      showToast(err.message || "Failed to load dashboard data", "error");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    (async () => {
      try {
        const [slidersData, vehiclesData] = await Promise.all([
          api.getAdminSliders(),
          api.getAdminVehicles()
        ]);
        if (isMounted) {
          setSliders(slidersData);
          setVehicles(vehiclesData);
        }
      } catch (err) {
        if (isMounted) showToast(err.message || "Failed to load dashboard data", "error");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name || user.username}!`, "success");
    loadAdminData();
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast("Logged out successfully.", "success");
  };

  const handleNavigate = (tab) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
  };

  if (checkingAuth) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} onBackToSite={onBackToSite} />;
  }

  const userInitial = (currentUser?.name || currentUser?.username || "A").charAt(0).toUpperCase();

  return (
    <div className="admin-layout">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <span className="toast-text">{toast.message}</span>
          <button type="button" className="toast-close" onClick={() => setToast(null)}>
            &times;
          </button>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <img
            src={logoImg}
            alt="Deekshitha Travels"
            className="admin-brand-logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="admin-brand-text">
            <span className="admin-brand-name">Deekshitha</span>
            <span className="admin-brand-badge">ADMIN</span>
          </div>
          {/* Close button on mobile sidebar */}
          <button
            type="button"
            className="admin-sidebar-mobile-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Menu"
          >
            &times;
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="admin-sidebar-user" onClick={() => handleNavigate("profile")}>
          <div className="sidebar-avatar">{userInitial}</div>
          <div className="sidebar-user-info">
            <strong className="sidebar-user-name">{currentUser?.name || "Administrator"}</strong>
            <span className="sidebar-user-role">@{currentUser?.username || "admin"}</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            type="button"
            className={`admin-nav-item ${currentTab === "overview" ? "active" : ""}`}
            onClick={() => handleNavigate("overview")}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Overview</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${currentTab === "sliders" ? "active" : ""}`}
            onClick={() => handleNavigate("sliders")}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Hero Sliders</span>
            <span className="admin-nav-count">{sliders.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${currentTab === "vehicles" ? "active" : ""}`}
            onClick={() => handleNavigate("vehicles")}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span>Vehicle Fleet</span>
            <span className="admin-nav-count">{vehicles.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${currentTab === "profile" ? "active" : ""}`}
            onClick={() => handleNavigate("profile")}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Admin Profile</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-side-btn live-btn" onClick={onBackToSite}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>View Website</span>
          </button>

          <button type="button" className="admin-side-btn logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="admin-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="admin-top-title">
              {currentTab === "overview" && "Overview"}
              {currentTab === "sliders" && "Hero Sliders"}
              {currentTab === "vehicles" && "Vehicle Fleet"}
              {currentTab === "profile" && "Admin Profile"}
            </h1>
          </div>

          <div className="topbar-right">
            <div
              className="admin-user-pill"
              onClick={() => handleNavigate("profile")}
              title="Click to view & edit admin profile"
              style={{ cursor: "pointer" }}
            >
              <div className="user-avatar-circle">{userInitial}</div>
              <span className="user-name-label">{currentUser?.name || "Administrator"}</span>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-secondary view-site-top-btn"
              onClick={onBackToSite}
              title="Return to public customer website"
            >
              <span className="topbar-btn-text">Public Site &rarr;</span>
              <span className="topbar-btn-icon">&rarr;</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-body">
          {loadingData && (
            <div className="admin-inline-loading">
              <div className="admin-spinner small"></div>
              <span>Updating live data...</span>
            </div>
          )}

          {currentTab === "overview" && (
            <AdminOverview
              sliders={sliders}
              vehicles={vehicles}
              onNavigate={handleNavigate}
              onOpenNewSlider={() => handleNavigate("sliders")}
              onOpenNewVehicle={() => handleNavigate("vehicles")}
              onBackToSite={onBackToSite}
            />
          )}

          {currentTab === "sliders" && (
            <AdminSliders
              sliders={sliders}
              onRefresh={loadAdminData}
              onShowToast={showToast}
            />
          )}

          {currentTab === "vehicles" && (
            <AdminVehicles
              vehicles={vehicles}
              onRefresh={loadAdminData}
              onShowToast={showToast}
            />
          )}

          {currentTab === "profile" && (
            <AdminProfile
              user={currentUser}
              onUpdateUser={(updated) => setCurrentUser(updated)}
              onLogout={handleLogout}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}

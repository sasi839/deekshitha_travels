import { useState } from "react";
import { api } from "../../services/api";
import { BUSINESS_INFO } from "../../constants/businessInfo";

export default function AdminProfile({ user, onUpdateUser, onLogout, onShowToast }) {
  // Profile state
  const [name, setName] = useState(user?.name || "Deekshitha Travels Administrator");
  const [email, setEmail] = useState(user?.email || "deekshithatravels21@gmail.com");
  const [phone, setPhone] = useState(user?.phone || "6300540826");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });

    if (!name.trim()) {
      setProfileMsg({ type: "error", text: "Administrator name cannot be empty." });
      return;
    }

    try {
      setSavingProfile(true);
      const res = await api.updateProfile({ name, email, phone });
      if (res.user && onUpdateUser) {
        onUpdateUser(res.user);
      }
      setProfileMsg({ type: "success", text: "Profile details saved successfully!" });
      if (onShowToast) onShowToast("Admin profile updated successfully!", "success");
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Failed to save profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: "", text: "" });

    if (!currentPassword) {
      setPassMsg({ type: "error", text: "Current password is required." });
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      setChangingPass(true);
      await api.changePassword(currentPassword, newPassword);
      setPassMsg({ type: "success", text: "Password changed successfully! Keep it secure." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (onShowToast) onShowToast("Admin password updated successfully!", "success");
    } catch (err) {
      setPassMsg({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setChangingPass(false);
    }
  };

  const initialLetter = (name || user?.username || "A").charAt(0).toUpperCase();

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Admin Profile &amp; Account</h2>
          <p className="admin-page-subtitle">
            Manage your administrator credentials, contact information, and security settings.
          </p>
        </div>
        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={onLogout}
            title="Log out of admin session"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Banner */}
      <div className="admin-profile-banner-card">
        <div className="profile-banner-left">
          <div className="profile-big-avatar">{initialLetter}</div>
          <div className="profile-banner-details">
            <div className="profile-name-row">
              <h3 className="profile-banner-name">{name || "Administrator"}</h3>
              <span className="profile-role-badge">SUPER ADMIN</span>
            </div>
            <p className="profile-banner-user">
              Username: <strong>@{user?.username || "admin"}</strong> &bull; Role: <strong>{user?.role || "admin"}</strong>
            </p>
            <p className="profile-banner-meta">
              Session: <strong>Active (JWT Authenticated)</strong> &bull; Storage: <strong>Local JSON Database</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="admin-settings-grid">
        {/* Edit Profile Details */}
        <div className="admin-card">
          <h3 className="admin-card-heading">Edit Profile Information</h3>
          <p className="admin-card-desc">
            Update your display name and contact information displayed across administrative logs.
          </p>

          <form onSubmit={handleSaveProfile} className="admin-settings-form">
            {profileMsg.text && (
              <div className={`admin-form-alert ${profileMsg.type}`}>
                {profileMsg.text}
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-label">
                Display Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Deekshitha Travels Administrator"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Admin Email Address</label>
              <input
                type="email"
                className="admin-input"
                placeholder="e.g. deekshithatravels21@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Primary Mobile / WhatsApp Number</label>
              <input
                type="tel"
                className="admin-input"
                placeholder="e.g. 6300540826"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Account Username</label>
              <input
                type="text"
                className="admin-input input-readonly"
                value={user?.username || "admin"}
                disabled
                title="Username is locked for primary administrative security"
              />
              <span className="input-help-text">Primary login identifier (read-only).</span>
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={savingProfile}
            >
              {savingProfile ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="admin-card">
          <h3 className="admin-card-heading">Change Password</h3>
          <p className="admin-card-desc">
            Update the administrator login credentials to ensure system security.
          </p>

          <form onSubmit={handleChangePassword} className="admin-settings-form">
            {passMsg.text && (
              <div className={`admin-form-alert ${passMsg.type}`}>
                {passMsg.text}
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-label">
                Current Password <span className="req">*</span>
              </label>
              <input
                type="password"
                className="admin-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">
                New Password (min. 6 characters) <span className="req">*</span>
              </label>
              <input
                type="password"
                className="admin-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">
                Confirm New Password <span className="req">*</span>
              </label>
              <input
                type="password"
                className="admin-input"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={changingPass}
            >
              {changingPass ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Verified Business Information Reference */}
      <div className="admin-card" style={{ marginTop: "1.5rem" }}>
        <h3 className="admin-card-heading">Verified Business Contact Information</h3>
        <p className="admin-card-desc">
          Contact points integrated throughout website WhatsApp and Call actions.
        </p>

        <div className="business-info-list">
          <div className="business-info-row">
            <span className="business-info-label">Business Name:</span>
            <strong className="business-info-value">{BUSINESS_INFO.name}</strong>
          </div>
          <div className="business-info-row">
            <span className="business-info-label">Customer Calling Line:</span>
            <strong className="business-info-value">{BUSINESS_INFO.phoneDisplay}</strong>
          </div>
          <div className="business-info-row">
            <span className="business-info-label">Customer WhatsApp Line:</span>
            <strong className="business-info-value">+{BUSINESS_INFO.whatsappNumber}</strong>
          </div>
          <div className="business-info-row">
            <span className="business-info-label">Official Email:</span>
            <strong className="business-info-value">{BUSINESS_INFO.email}</strong>
          </div>
          <div className="business-info-row">
            <span className="business-info-label">Service Headquarters:</span>
            <strong className="business-info-value">{BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state}</strong>
          </div>
        </div>

        <div className="system-health-strip">
          <div className="health-dot active"></div>
          <span>API Connected &bull; Atomic JSON Database Storage &bull; SSL Secured</span>
        </div>
      </div>
    </div>
  );
}

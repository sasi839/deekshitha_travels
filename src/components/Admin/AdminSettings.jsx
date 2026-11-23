import { useState } from "react";
import { api } from "../../services/api";
import { BUSINESS_INFO } from "../../constants/businessInfo";

export default function AdminSettings({ onShowToast }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.changePassword(currentPassword, newPassword);
      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (onShowToast) onShowToast("Admin password changed successfully!", "success");
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Website &amp; Security Settings</h2>
          <p className="admin-page-subtitle">
            Update security credentials and review verified business contact details.
          </p>
        </div>
      </div>

      <div className="admin-settings-grid">
        {/* Change Password Card */}
        <div className="admin-card">
          <h3 className="admin-card-heading">Change Admin Password</h3>
          <p className="admin-card-desc">
            Update the administrator login password to maintain system security.
          </p>

          <form onSubmit={handleChangePassword} className="admin-settings-form">
            {error && <div className="admin-form-alert error">{error}</div>}
            {success && <div className="admin-form-alert success">{success}</div>}

            <div className="admin-form-group">
              <label className="admin-label">Current Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">New Password (min. 6 characters)</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Enter new strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Confirm New Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Verified Business Information */}
        <div className="admin-card">
          <h3 className="admin-card-heading">Verified Business Info</h3>
          <p className="admin-card-desc">
            Contact information configured across website booking and floating call buttons.
          </p>

          <div className="business-info-list">
            <div className="business-info-row">
              <span className="business-info-label">Business Name:</span>
              <strong className="business-info-value">{BUSINESS_INFO.name}</strong>
            </div>
            <div className="business-info-row">
              <span className="business-info-label">Primary Phone:</span>
              <strong className="business-info-value">{BUSINESS_INFO.phone}</strong>
            </div>
            <div className="business-info-row">
              <span className="business-info-label">WhatsApp:</span>
              <strong className="business-info-value">+{BUSINESS_INFO.whatsappNumber}</strong>
            </div>
            <div className="business-info-row">
              <span className="business-info-label">Email:</span>
              <strong className="business-info-value">{BUSINESS_INFO.email}</strong>
            </div>
            <div className="business-info-row">
              <span className="business-info-label">Primary Hub:</span>
              <strong className="business-info-value">{BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state}</strong>
            </div>
            <div className="business-info-row">
              <span className="business-info-label">Coverage:</span>
              <span className="business-info-value">Tirupati &bull; Tirumala &bull; Renigunta &bull; Airport</span>
            </div>
          </div>

          <div className="system-health-strip">
            <div className="health-dot active"></div>
            <span>Database Online &bull; Local Storage &bull; Express API Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

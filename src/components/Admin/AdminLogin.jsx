import { useState } from "react";
import { api } from "../../services/api";
import logoImg from "../../assets/logo.webp";

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.login(username, password);
      if (data.success) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        {/* Brand Header */}
        <div className="admin-login-brand">
          <img src={logoImg} alt="Deekshitha Travels Logo" className="admin-login-logo" />
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">Sign in to manage sliders, fleet &amp; settings</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="username">Username</label>
            <div className="admin-input-wrapper">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <div className="admin-input-wrapper">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary admin-btn-block" disabled={loading}>
            {loading ? (
              <span className="admin-btn-spinner-wrap">
                <span className="admin-spinner" />
                Signing In...
              </span>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <button type="button" onClick={onBackToSite} className="admin-link-btn">
            &larr; Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
}

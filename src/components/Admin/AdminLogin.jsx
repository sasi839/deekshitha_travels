import { useState } from "react";
import { api } from "../../services/api";
import { getSupabaseConfigStatus } from "../../services/supabaseClient";
import logoImg from "../../assets/logo.png";

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const configStatus = getSupabaseConfigStatus();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your administrator email address.");
      return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address (e.g. admin@example.com).");
      return;
    }

    if (!password) {
      setError("Please enter your account password.");
      return;
    }

    setLoading(true);

    try {
      const data = await api.login(trimmedEmail, password);
      if (data.success && data.user) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || "Invalid email or password. Please verify your credentials.");
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
          <p className="admin-login-subtitle">Sign in to manage fleet, sliders &amp; website content</p>
        </div>

        {/* Supabase Key Diagnostic Alerts */}
        {configStatus.isSecretKey && (
          <div className="admin-alert admin-alert-warning" role="alert">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <strong>Action Required:</strong> A Supabase secret key (<code>sb_secret_...</code>) was detected in <code>.env</code>.
              Please replace it with your project&apos;s <strong>anon / public key</strong> (starts with <code>sb_publishable_</code> or <code>eyJ...</code>).
            </div>
          </div>
        )}

        {!configStatus.hasKey && (
          <div className="admin-alert admin-alert-info" role="alert">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <strong>Setup:</strong> Please paste your Supabase Publishable / Anon key into <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code> to connect live authentication.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="admin-alert admin-alert-error" role="alert" aria-live="assertive">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          {/* Admin Email Input */}
          <div className="admin-form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="admin-input-wrapper">
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@example.com"
                required
                autoComplete="email"
                autoFocus
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="admin-form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-password-wrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="admin-password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
                disabled={loading}
              >
                {showPassword ? (
                  /* Eye-Off Icon */
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* Eye Icon */
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-btn-block"
            disabled={loading}
          >
            {loading ? (
              <span className="admin-btn-spinner-wrap">
                <span className="admin-spinner" />
                <span>Authenticating with Supabase...</span>
              </span>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        {/* Security Badge Footer */}
        <div className="admin-login-security-notice">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Secured with Supabase Authentication</span>
        </div>

        {/* Back to Public Website Navigation */}
        <div className="admin-login-footer">
          <button type="button" onClick={onBackToSite} className="admin-link-btn">
            &larr; Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
}

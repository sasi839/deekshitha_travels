import { BUSINESS_INFO } from "../../constants/businessInfo";
import SSNexoraFooter from "./SSNexoraFooter";
import logoImg from "../../assets/logo.webp";
import "./Footer.css";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onOpenAdmin }) {
  const servicesList = [
    { label: "Taxi Services", href: "#services" },
    { label: "Local Travel", href: "#services" },
    { label: "Airport Pickup and Drop", href: "#services" },
    { label: "Car Rentals", href: "#services" }
  ];

  const serviceAreas = ["Tirupati", "Renigunta", "Tirupati Airport"];

  return (
    <footer className="site-footer" role="contentinfo" aria-label="Footer">
      {/* Deekshitha Travels Primary Business Footer */}
      <div className="footer-main-container">
        <div className="footer-grid">
          {/* Column 1 – Business Identity */}
          <div className="footer-col footer-col-brand">
            <a href="#home" className="footer-logo" aria-label="Deekshitha Travels Home">
              <div className="footer-logo-wrapper">
                <img
                  src={logoImg}
                  alt="Deekshitha Travels Logo"
                  className="footer-brand-logo"
                  width="76"
                  height="38"
                  loading="lazy"
                />
              </div>
              <div className="footer-logo-text">
                <span className="brand-title">DEEKSHITHA</span>
                <span className="brand-subtitle">TRAVELS</span>
              </div>
            </a>
            <p className="footer-about-text">
              Your trusted travel partner for reliable taxi services, local travel, airport pickup and drop, and car rentals across Tirupati, Renigunta, and Tirupati Airport.
            </p>
          </div>

          {/* Column 2 – Our Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Our Services</h4>
            <ul className="footer-links-list">
              {servicesList.map((service) => (
                <li key={service.label}>
                  <a href={service.href} className="footer-link">
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Contact Information */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-heading">Contact Information</h4>
            <div className="footer-contact-items">
              {/* Phone */}
              <a href={BUSINESS_INFO.phoneTel} className="footer-contact-link" aria-label={`Call ${BUSINESS_INFO.phoneDisplay}`}>
                <div className="contact-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span>Phone: {BUSINESS_INFO.phone}</span>
              </a>

              {/* Email */}
              <a href={BUSINESS_INFO.emailMailto} className="footer-contact-link" aria-label={`Email ${BUSINESS_INFO.email}`}>
                <div className="contact-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="email-text">{BUSINESS_INFO.email}</span>
              </a>

              {/* WhatsApp Link */}
              <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer-contact-link" aria-label="Chat on WhatsApp">
                <div className="contact-icon-box whatsapp-box">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.547 5.375L2 22l4.75-1.516a10.024 10.024 0 0 0 5.281 1.484c5.531 0 10.031-4.5 10.031-10.031S17.562 2 12.031 2zm0 18.25c-1.688 0-3.25-.453-4.609-1.25l-.328-.188-3.047.969.984-2.969-.219-.344A8.17 8.17 0 0 1 3.813 12c0-4.531 3.688-8.219 8.218-8.219 4.531 0 8.219 3.688 8.219 8.219 0 4.531-3.688 8.25-8.219 8.25zm4.516-6.172c-.25-.125-1.469-.719-1.688-.813-.234-.094-.406-.125-.578.125-.172.25-.656.813-.813.984-.141.156-.3.188-.547.063-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.141-.25-.016-.391.109-.516.109-.109.25-.3.375-.453.125-.156.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.906-.219-.5-.438-.438-.594-.438h-.516c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.156 0 1.281.938 2.516 1.063 2.688.141.172 1.844 2.828 4.469 3.969.625.266 1.109.438 1.484.563.625.203 1.203.172 1.656.109.5-.078 1.469-.609 1.688-1.203.203-.594.203-1.109.141-1.203-.047-.109-.219-.172-.469-.297z" />
                  </svg>
                </div>
                <span>WhatsApp: +91 {BUSINESS_INFO.phone}</span>
              </a>

              {/* Location */}
              <div className="footer-location-line">
                <div className="contact-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span>Location: Tirupati, Andhra Pradesh.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Service Location Highlight */}
        <div className="footer-locations-strip">
          <span className="strip-label">Service Locations:</span>
          <div className="strip-areas">
            {serviceAreas.map((area, idx) => (
              <span key={area} className="strip-area-item">
                <span className="strip-pin" aria-hidden="true">📍</span>
                <span>{area}</span>
                {idx < serviceAreas.length - 1 && <span className="strip-separator" aria-hidden="true">•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Copyright Section */}
        <div className="footer-copyright-strip">
          <p className="copyright-text">
            © {CURRENT_YEAR} Deekshitha Travels. All Rights Reserved.
          </p>
          <div className="copyright-links-row">
            <span className="copyright-subtext">
              Taxi Services &amp; Car Rentals in Tirupati
            </span>
            <span className="copyright-dot">•</span>
            <a
              href="#/admin"
              className="footer-admin-link"
              onClick={(e) => {
                if (onOpenAdmin) {
                  e.preventDefault();
                  window.location.hash = "/admin";
                  onOpenAdmin();
                }
              }}
              title="Administrator Login Portal"
            >
              Admin Portal
            </a>
          </div>
        </div>
      </div>

      {/* Universal SS Nexora Technologies Signature Branding Footer */}
      <SSNexoraFooter />
    </footer>
  );
}

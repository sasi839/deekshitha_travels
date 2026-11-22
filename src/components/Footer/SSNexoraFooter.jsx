import "./SSNexoraFooter.css";

/**
 * Universal Signature Footer for SS Nexora Technologies.
 * Reusable developer / agency credit component designed to adapt
 * seamlessly to client websites while keeping the core brand identity intact.
 *
 * Brand Identity:
 * - Brand Name: SS NEXORA
 * - Company Name: SS Nexora Technologies
 * - Tagline: Building Tomorrow, Digitally.
 * - Services: WEB DEVELOPMENT • SOFTWARE • AI SOLUTIONS
 * - Copyright: © SS Nexora Technologies
 */
export default function SSNexoraFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="ss-nexora-signature-footer" role="contentinfo" aria-label="Website Developed by SS Nexora Technologies">
      <div className="ss-nexora-container">
        {/* Subtle Horizontal Divider */}
        <div className="ss-nexora-divider" />

        {/* Branding Block */}
        <div className="ss-nexora-brand-block">
          <div className="ss-nexora-brand-title-wrap">
            <span className="ss-nexora-brand-name">SS NEXORA</span>
            <span className="ss-nexora-brand-subtitle">T E C H N O L O G I E S</span>
          </div>

          <p className="ss-nexora-tagline">Building Tomorrow, Digitally.</p>

          <div className="ss-nexora-services-pill">
            <span>WEB DEVELOPMENT</span>
            <span className="ss-nexora-dot" aria-hidden="true">•</span>
            <span>SOFTWARE</span>
            <span className="ss-nexora-dot" aria-hidden="true">•</span>
            <span>AI SOLUTIONS</span>
          </div>

          <p className="ss-nexora-copyright">
            © {currentYear} SS Nexora Technologies
          </p>
        </div>
      </div>
    </div>
  );
}

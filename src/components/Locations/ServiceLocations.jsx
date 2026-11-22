import { SERVICE_LOCATIONS } from "../../data/servicesData";
import { BUSINESS_INFO } from "../../constants/businessInfo";
import "./ServiceLocations.css";

export default function ServiceLocations() {
  return (
    <section className="service-locations-section" aria-label="Service Locations">
      <div className="locations-container">
        {/* Section Heading */}
        <header className="locations-header">
          <span className="section-badge">Coverage Areas</span>
          <h2 className="locations-title">Serving Tirupati and Nearby Areas</h2>
          <p className="locations-subtitle">
            Reliable local pickup and drop-off services across primary travel hubs.
          </p>
        </header>

        {/* Locations Grid */}
        <div className="locations-grid">
          {SERVICE_LOCATIONS.map((loc) => {
            const encodedMsg = encodeURIComponent(
              `Hello Deekshitha Travels, I need taxi service in / to ${loc.name}. Please share details.`
            );
            const locWhatsapp = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodedMsg}`;

            return (
              <div key={loc.id} className="location-card">
                <div className="location-icon-wrapper">
                  <svg
                    className="location-pin-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="location-info">
                  <span className="location-tag">{loc.areaType}</span>
                  <h3 className="location-name">{loc.name}</h3>
                  <p className="location-desc">{loc.description}</p>
                </div>
                <a
                  href={locWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-cta-link"
                  aria-label={`Book ride in ${loc.name} via WhatsApp`}
                >
                  <span>Book in {loc.name}</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

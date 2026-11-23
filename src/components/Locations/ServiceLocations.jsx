import { useState } from "react";
import { SERVICE_LOCATIONS, LOCATION_CATEGORIES } from "../../data/servicesData";
import { BUSINESS_INFO } from "../../constants/businessInfo";
import "./ServiceLocations.css";

function getCategoryIcon(category) {
  switch (category) {
    case "transit":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
        </svg>
      );
    case "temples":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2L2 9h20L12 2z" />
          <path d="M4 9v11h16V9" />
          <path d="M9 20v-7h6v7" />
          <line x1="12" y1="2" x2="12" y2="5" />
        </svg>
      );
    case "institutions":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="9" x2="12" y2="15" />
          <line x1="9" y1="12" x2="15" y2="12" />
        </svg>
      );
    case "areas":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
  }
}

export default function ServiceLocations() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredLocations =
    activeCategory === "all"
      ? SERVICE_LOCATIONS
      : SERVICE_LOCATIONS.filter((loc) => loc.category === activeCategory);

  return (
    <section id="locations" className="service-locations-section" aria-label="Service Locations">
      <div className="locations-container">
        {/* Section Heading */}
        <header className="locations-header">
          <span className="section-badge">Coverage Network</span>
          <h2 className="locations-title">Popular Destinations &amp; Service Locations</h2>
          <p className="locations-subtitle">
            Reliable local pickup and drop services across Tirupati, Tirumala hills, airports, railway junctions, and premier temples.
          </p>

          {/* Category Filter Tabs */}
          <div className="locations-category-tabs" role="tablist" aria-label="Location Categories">
            {LOCATION_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === "all"
                  ? SERVICE_LOCATIONS.length
                  : SERVICE_LOCATIONS.filter((l) => l.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`loc-cat-tab ${isActive ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                  <span className="loc-tab-count">{count}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Locations Grid */}
        <div className="locations-grid">
          {filteredLocations.map((loc) => {
            const encodedMsg = encodeURIComponent(
              `Hello Deekshitha Travels, I need taxi service for ${loc.name} (${loc.areaType}). Please share availability and rates.`
            );
            const locWhatsapp = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodedMsg}`;

            return (
              <div key={loc.id} className="location-card">
                <div className="location-card-top">
                  <div className={`location-icon-wrapper icon-${loc.category}`}>
                    {getCategoryIcon(loc.category)}
                  </div>
                  <span className="location-category-badge">{loc.categoryLabel}</span>
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
                  aria-label={`Enquire taxi to ${loc.name} on WhatsApp`}
                >
                  <svg className="wa-icon-small" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.547 5.375L2 22l4.75-1.516a10.024 10.024 0 0 0 5.281 1.484c5.531 0 10.031-4.5 10.031-10.031S17.562 2 12.031 2zm0 18.25c-1.688 0-3.25-.453-4.609-1.25l-.328-.188-3.047.969.984-2.969-.219-.344A8.17 8.17 0 0 1 3.813 12c0-4.531 3.688-8.219 8.218-8.219 4.531 0 8.219 3.688 8.219 8.219 0 4.531-3.688 8.25-8.219 8.25zm4.516-6.172c-.25-.125-1.469-.719-1.688-.813-.234-.094-.406-.125-.578.125-.172.25-.656.813-.813.984-.141.156-.3.188-.547.063-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.141-.25-.016-.391.109-.516.109-.109.25-.3.375-.453.125-.156.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.906-.219-.5-.438-.438-.594-.438h-.516c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.156 0 1.281.938 2.516 1.063 2.688.141.172 1.844 2.828 4.469 3.969.625.266 1.109.438 1.484.563.625.203 1.203.172 1.656.109.5-.078 1.469-.609 1.688-1.203.203-.594.203-1.109.141-1.203-.047-.109-.219-.172-.469-.297z" />
                  </svg>
                  <span>Book Ride to {loc.name.split(" ")[0]}</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>

        {/* Coverage Note Footer */}
        <div className="locations-bottom-notice">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" className="notice-icon">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>
            Custom doorstep pickup and drops available anywhere across Tirupati, Renigunta, Tirumala ghats, and Tirupati Airport.
          </p>
        </div>
      </div>
    </section>
  );
}

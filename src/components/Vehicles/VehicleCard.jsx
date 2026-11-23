import { BUSINESS_INFO } from "../../constants/businessInfo";
import "./VehicleCard.css";

export default function VehicleCard({ vehicle }) {
  const {
    name,
    category,
    image,
    image_alt,
    seating_capacity,
    ac_label,
    luggage_capacity,
    description,
    price_display,
    price_note,
    badge
  } = vehicle;

  const whatsappMessage = encodeURIComponent(
    `Hello Deekshitha Travels, I am interested in booking ${name}. Please share the details.`
  );
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <article className="vehicle-card">
      {/* Vehicle Image Container */}
      <div className="vehicle-image-wrapper">
        <img
          src={image}
          alt={image_alt || name}
          className="vehicle-image"
          loading="lazy"
        />
        {badge && <span className="vehicle-badge">{badge}</span>}
        <span className="vehicle-category">{category}</span>
      </div>

      {/* Vehicle Content Body */}
      <div className="vehicle-card-body">
        <h3 className="vehicle-title">{name}</h3>

        {/* Feature Specs Icons */}
        <div className="vehicle-specs-list" aria-label="Vehicle Specifications">
          {/* Seating */}
          <div className="spec-item spec-seating" title="Seating Capacity">
            <svg
              className="spec-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="spec-text">{seating_capacity}</span>
          </div>

          {/* AC / Non-AC */}
          <div className="spec-item spec-ac" title="Air Conditioning">
            <svg
              className="spec-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
            </svg>
            <span className="spec-text">{ac_label}</span>
          </div>

          {/* Luggage Capacity */}
          <div className="spec-item spec-luggage" title="Luggage Capacity">
            <svg
              className="spec-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span className="spec-text">{luggage_capacity}</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="vehicle-description">{description}</p>

        {/* Pricing Info */}
        <div className="vehicle-price-row">
          <div className="price-info">
            <span className="price-label">Rental Pricing</span>
            <span className="price-value">{price_display}</span>
          </div>
          {price_note && <span className="price-note">{price_note}</span>}
        </div>

        {/* Action Buttons */}
        <div className="vehicle-actions">
          {/* Call Now */}
          <a
            href={BUSINESS_INFO.phoneTel}
            className="vehicle-btn vehicle-btn-call"
            aria-label={`Call to book ${name}`}
          >
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="btn-label-desktop">Call Now</span>
            <span className="btn-label-mobile">Call</span>
          </a>

          {/* WhatsApp Enquiry */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vehicle-btn vehicle-btn-whatsapp"
            aria-label={`Enquire about ${name} on WhatsApp`}
          >
            <svg
              className="btn-icon whatsapp-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.547 5.375L2 22l4.75-1.516a10.024 10.024 0 0 0 5.281 1.484c5.531 0 10.031-4.5 10.031-10.031S17.562 2 12.031 2zm0 18.25c-1.688 0-3.25-.453-4.609-1.25l-.328-.188-3.047.969.984-2.969-.219-.344A8.17 8.17 0 0 1 3.813 12c0-4.531 3.688-8.219 8.218-8.219 4.531 0 8.219 3.688 8.219 8.219 0 4.531-3.688 8.25-8.219 8.25zm4.516-6.172c-.25-.125-1.469-.719-1.688-.813-.234-.094-.406-.125-.578.125-.172.25-.656.813-.813.984-.141.156-.3.188-.547.063-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.141-.25-.016-.391.109-.516.109-.109.25-.3.375-.453.125-.156.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.906-.219-.5-.438-.438-.594-.438h-.516c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.156 0 1.281.938 2.516 1.063 2.688.141.172 1.844 2.828 4.469 3.969.625.266 1.109.438 1.484.563.625.203 1.203.172 1.656.109.5-.078 1.469-.609 1.688-1.203.203-.594.203-1.109.141-1.203-.047-.109-.219-.172-.469-.297z" />
            </svg>
            <span className="btn-label-desktop">Enquiry</span>
            <span className="btn-label-mobile">Enquire</span>
          </a>
        </div>
      </div>
    </article>
  );
}

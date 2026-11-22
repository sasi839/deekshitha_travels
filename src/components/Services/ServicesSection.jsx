import { SERVICES_LIST } from "../../data/servicesData";
import { BUSINESS_INFO } from "../../constants/businessInfo";
import "./ServicesSection.css";

export default function ServicesSection() {
  return (
    <section id="services" className="services-section" aria-label="Our Travel Services">
      <div className="services-container">
        {/* Section Header */}
        <header className="services-header">
          <span className="section-badge">What We Offer</span>
          <h2 className="services-title">Our Travel Services</h2>
          <p className="services-subtitle">
            Reliable travel solutions for your everyday journeys.
          </p>
        </header>

        {/* 3 Services Cards Grid */}
        <div className="services-grid">
          {SERVICES_LIST.map((service) => {
            const encodedMsg = encodeURIComponent(service.whatsappText);
            const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodedMsg}`;

            return (
              <article key={service.id} className="service-card">
                {/* Service Visual Header */}
                <div className="service-image-box">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    className="service-image"
                    loading="lazy"
                  />
                  <div className="service-image-gradient" />
                  
                  {/* Service Icon Badge */}
                  <div className="service-icon-badge" aria-hidden="true">
                    {service.icon === "plane" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
                      </svg>
                    )}
                    {service.icon === "car" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    )}
                    {service.icon === "key" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L10 10l-1.5-1.5L7 10 4 7l-2 2 5.5 5.5A7.5 7.5 0 1 0 17.5 4.5z" />
                        <circle cx="7.5" cy="16.5" r="1.5" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Service Content */}
                <div className="service-body">
                  <span className="service-category">{service.subtitle}</span>
                  <h3 className="service-name">{service.title}</h3>
                  <p className="service-desc">{service.description}</p>

                  {/* WhatsApp Enquiry Button */}
                  <div className="service-footer">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="service-whatsapp-btn"
                      aria-label={`Enquire about ${service.title} on WhatsApp`}
                    >
                      <svg
                        className="btn-icon whatsapp-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.547 5.375L2 22l4.75-1.516a10.024 10.024 0 0 0 5.281 1.484c5.531 0 10.031-4.5 10.031-10.031S17.562 2 12.031 2zm0 18.25c-1.688 0-3.25-.453-4.609-1.25l-.328-.188-3.047.969.984-2.969-.219-.344A8.17 8.17 0 0 1 3.813 12c0-4.531 3.688-8.219 8.218-8.219 4.531 0 8.219 3.688 8.219 8.219 0 4.531-3.688 8.25-8.219 8.25zm4.516-6.172c-.25-.125-1.469-.719-1.688-.813-.234-.094-.406-.125-.578.125-.172.25-.656.813-.813.984-.141.156-.3.188-.547.063-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.141-.25-.016-.391.109-.516.109-.109.25-.3.375-.453.125-.156.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.906-.219-.5-.438-.438-.594-.438h-.516c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.156 0 1.281.938 2.516 1.063 2.688.141.172 1.844 2.828 4.469 3.969.625.266 1.109.438 1.484.563.625.203 1.203.172 1.656.109.5-.078 1.469-.609 1.688-1.203.203-.594.203-1.109.141-1.203-.047-.109-.219-.172-.469-.297z" />
                      </svg>
                      <span>WhatsApp Enquiry</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

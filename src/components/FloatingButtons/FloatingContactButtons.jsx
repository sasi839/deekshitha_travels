import { BUSINESS_INFO } from "../../constants/businessInfo";
import "./FloatingContactButtons.css";

export default function FloatingContactButtons() {
  const scrollToBooking = (e) => {
    e.preventDefault();
    const target = document.getElementById("booking") || document.getElementById("contact");
    if (target) {
      const navbar = document.querySelector(".navbar-header");
      const navOffset = navbar ? navbar.offsetHeight : 70;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - navOffset - 16;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth"
      });
      window.history.pushState(null, "", "#booking");
    }
  };

  return (
    <>
      {/* 1. Persistent Floating "Book a Ride" Button (Bottom-Left) */}
      <div className="floating-book-container">
        <a
          href="#booking"
          onClick={scrollToBooking}
          className="floating-book-btn"
          aria-label="Book a Ride - Scroll directly to taxi booking form"
        >
          {/* Subtle Ambient Pulse Aura */}
          <span className="book-btn-pulse-glow" aria-hidden="true" />

          {/* Vehicle Icon Wrap */}
          <span className="book-btn-icon-wrap" aria-hidden="true">
            <svg
              className="book-btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3c-.1.2-.1.4-.1.6v4.5c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </span>

          {/* Text Content */}
          <span className="book-btn-content">
            <span className="book-btn-title">Book a Ride</span>
            <span className="book-btn-micro">Instant Quote</span>
          </span>

          {/* Forward Arrow */}
          <svg
            className="book-btn-arrow"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      </div>

      {/* 2. Floating Quick Contact Options (Bottom-Right: WhatsApp & Call) */}
      <aside className="floating-contact-container" aria-label="Quick Contact Options">
        {/* WhatsApp Button (Top) */}
        <a
          href={BUSINESS_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-btn-whatsapp"
          aria-label="Chat with Deekshitha Travels on WhatsApp"
        >
          <span className="floating-tooltip">Chat on WhatsApp</span>
          <svg
            className="floating-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.547 5.375L2 22l4.75-1.516a10.024 10.024 0 0 0 5.281 1.484c5.531 0 10.031-4.5 10.031-10.031S17.562 2 12.031 2zm0 18.25c-1.688 0-3.25-.453-4.609-1.25l-.328-.188-3.047.969.984-2.969-.219-.344A8.17 8.17 0 0 1 3.813 12c0-4.531 3.688-8.219 8.218-8.219 4.531 0 8.219 3.688 8.219 8.219 0 4.531-3.688 8.25-8.219 8.25zm4.516-6.172c-.25-.125-1.469-.719-1.688-.813-.234-.094-.406-.125-.578.125-.172.25-.656.813-.813.984-.141.156-.3.188-.547.063-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.141-.25-.016-.391.109-.516.109-.109.25-.3.375-.453.125-.156.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.906-.219-.5-.438-.438-.594-.438h-.516c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.156 0 1.281.938 2.516 1.063 2.688.141.172 1.844 2.828 4.469 3.969.625.266 1.109.438 1.484.563.625.203 1.203.172 1.656.109.5-.078 1.469-.609 1.688-1.203.203-.594.203-1.109.141-1.203-.047-.109-.219-.172-.469-.297z" />
          </svg>
        </a>

        {/* Call Now Button (Bottom) */}
        <a
          href={BUSINESS_INFO.phoneTel}
          className="floating-btn floating-btn-call"
          aria-label={`Call Deekshitha Travels at ${BUSINESS_INFO.phoneDisplay}`}
        >
          <span className="floating-tooltip">Call: {BUSINESS_INFO.phoneDisplay}</span>
          <svg
            className="floating-icon"
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
        </a>
      </aside>
    </>
  );
}

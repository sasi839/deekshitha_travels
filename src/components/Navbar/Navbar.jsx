import { useState, useEffect } from "react";
import { BUSINESS_INFO } from "../../constants/businessInfo";
import logoImg from "../../assets/logo.png";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Dynamic ScrollSpy: Highlight active link based on current viewport position
  useEffect(() => {
    const sectionIds = ["home", "about", "vehicles", "services", "locations", "contact", "booking"];
    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 130;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            const mappedLink = id === "booking" ? "#contact" : `#${id}`;
            setActiveLink(mappedLink);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Smooth scroll handler with fixed navbar offset compensation
  const handleLinkClick = (href, e) => {
    setActiveLink(href);
    setIsMenuOpen(false);

    if (href.startsWith("#")) {
      if (e) e.preventDefault();
      const sectionId = href.substring(1);
      const targetElement = document.getElementById(sectionId) || (sectionId === "contact" ? document.getElementById("booking") : null);
      if (targetElement) {
        const navHeader = document.querySelector(".navbar-header");
        const navOffset = navHeader ? navHeader.offsetHeight : 64;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, elementPosition - navOffset),
          behavior: "smooth"
        });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand Logo with Default Authentic Logo Image */}
        <a
          href="#home"
          className="navbar-brand"
          onClick={(e) => handleLinkClick("#home", e)}
          aria-label="Deekshitha Travels Home"
        >
          <div className="brand-logo-wrapper">
            <img
              src={logoImg}
              alt="Deekshitha Travels Logo"
              className="navbar-brand-logo"
              width="96"
              height="44"
              loading="eager"
            />
          </div>
          <div className="brand-text">
            <span className="brand-title">DEEKSHITHA</span>
            <span className="brand-subtitle">TRAVELS</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links">
            {BUSINESS_INFO.navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`nav-link ${activeLink === link.href ? "active" : ""}`}
                  onClick={(e) => handleLinkClick(link.href, e)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Action Button */}
        <div className="navbar-actions">
          <a
            href={BUSINESS_INFO.phoneTel}
            className="call-btn-desktop"
            aria-label={`Call ${BUSINESS_INFO.name} at ${BUSINESS_INFO.phoneDisplay}`}
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
            <span>Call Now</span>
          </a>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            className={`hamburger-btn ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger-line line-1"></span>
            <span className="hamburger-line line-2"></span>
            <span className="hamburger-line line-3"></span>
          </button>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer */}
      <div
        className={`mobile-backdrop ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <div className={`mobile-nav-drawer ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <img
              src={logoImg}
              alt="Deekshitha Travels Logo"
              className="mobile-brand-logo"
              width="86"
              height="40"
            />
            <div className="brand-text">
              <span className="brand-title">DEEKSHITHA</span>
              <span className="brand-subtitle">TRAVELS</span>
            </div>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="mobile-nav-links">
          {BUSINESS_INFO.navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`mobile-nav-link ${activeLink === link.href ? "active" : ""}`}
                onClick={(e) => handleLinkClick(link.href, e)}
              >
                <span>{link.label}</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-drawer-footer">
          <a
            href={BUSINESS_INFO.phoneTel}
            className="mobile-call-btn"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Call Now: {BUSINESS_INFO.phoneDisplay}</span>
          </a>
          <p className="mobile-location-tag">
            {BUSINESS_INFO.locationHighlight}
          </p>
        </div>
      </div>
    </header>
  );
}

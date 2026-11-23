import { useState, useEffect, useCallback } from "react";
import { BUSINESS_INFO, HERO_SLIDES } from "../../constants/businessInfo";
import { api } from "../../services/api";
import "./HeroSlider.css";

export default function HeroSlider() {
  const [slides, setSlides] = useState(HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch active sliders from dynamic backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchSliders() {
      try {
        const dynamicSliders = await api.getPublicSliders();
        if (isMounted && Array.isArray(dynamicSliders) && dynamicSliders.length > 0) {
          setSlides(dynamicSliders);
        }
      } catch (err) {
        // Graceful fallback to static HERO_SLIDES
        console.warn("Using offline hero slides fallback:", err);
      }
    }
    fetchSliders();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % (totalSlides || 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + (totalSlides || 1)) % (totalSlides || 1));
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Automatic sliding with 5-second interval
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide, totalSlides]);

  const safeCurrentSlide = totalSlides > 0 ? (currentSlide >= totalSlides ? 0 : currentSlide) : 0;

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  const activeSlideData = slides[safeCurrentSlide] || slides[0] || {};

  return (
    <section
      id="home"
      className="hero-slider-section"
      aria-label="Deekshitha Travels Highlights"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      {/* Slides Container */}
      <div className="hero-slides-wrapper">
        {slides.map((slide, index) => {
          const isActive = index === safeCurrentSlide;
          return (
            <div
              key={slide.id || index}
              className={`hero-slide ${isActive ? "active" : ""}`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={slide.alt || slide.title || "Tirupati Travels"}
                className="hero-slide-image"
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  e.currentTarget.src = "/temple-tirumala.jpg";
                }}
              />
              <div className="hero-slide-overlay" />
            </div>
          );
        })}
      </div>

      {/* Hero Content (Floating over slides) */}
      <div className="hero-content-container">
        <div className="hero-content-inner">
          {/* Location & Temple Destination Badge */}
          <div className="hero-location-badge">
            <svg
              className="location-icon"
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
            <span key={safeCurrentSlide} className="badge-fade-text">
              {activeSlideData.badge || BUSINESS_INFO.locationHighlight}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-heading">
            {activeSlideData.title ? (
              activeSlideData.title
            ) : (
              <>
                Tirupati &amp; Tirumala <span className="highlight-text">Cabs</span>
              </>
            )}
          </h1>

          {/* Supporting Text */}
          <p className="hero-subtitle">
            {activeSlideData.subtitle || "Reliable temple darshan & airport taxi service."}
          </p>

          {/* Call to Action Buttons */}
          <div className="hero-cta-group">
            {/* Call Now Button */}
            <a
              href={BUSINESS_INFO.phoneTel}
              className="hero-btn hero-btn-call"
              aria-label={`Call ${BUSINESS_INFO.phoneDisplay}`}
            >
              <svg
                className="btn-svg-icon"
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
              <span>{activeSlideData.buttonText || "Call Now"}</span>
            </a>

            {/* WhatsApp Chat Button */}
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn-whatsapp"
              aria-label={`Chat with ${BUSINESS_INFO.name} on WhatsApp`}
            >
              <svg
                className="btn-svg-icon whatsapp-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.547 5.375L2 22l4.75-1.516a10.024 10.024 0 0 0 5.281 1.484c5.531 0 10.031-4.5 10.031-10.031S17.562 2 12.031 2zm0 18.25c-1.688 0-3.25-.453-4.609-1.25l-.328-.188-3.047.969.984-2.969-.219-.344A8.17 8.17 0 0 1 3.813 12c0-4.531 3.688-8.219 8.218-8.219 4.531 0 8.219 3.688 8.219 8.219 0 4.531-3.688 8.25-8.219 8.25zm4.516-6.172c-.25-.125-1.469-.719-1.688-.813-.234-.094-.406-.125-.578.125-.172.25-.656.813-.813.984-.141.156-.3.188-.547.063-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.141-.25-.016-.391.109-.516.109-.109.25-.3.375-.453.125-.156.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.906-.219-.5-.438-.438-.594-.438h-.516c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.156 0 1.281.938 2.516 1.063 2.688.141.172 1.844 2.828 4.469 3.969.625.266 1.109.438 1.484.563.625.203 1.203.172 1.656.109.5-.078 1.469-.609 1.688-1.203.203-.594.203-1.109.141-1.203-.047-.109-.219-.172-.469-.297z" />
              </svg>
              <span>{activeSlideData.whatsappText || "WhatsApp"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Manual Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            className="slider-arrow slider-arrow-prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            className="slider-arrow slider-arrow-next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Indicators (Dots) */}
      {totalSlides > 1 && (
        <div className="slider-indicators" role="tablist" aria-label="Slide Selection">
          {slides.map((slide, index) => {
            const isActive = index === safeCurrentSlide;
            return (
              <button
                key={slide.id || index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}`}
                className={`indicator-dot ${isActive ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

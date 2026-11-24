import { useState } from "react";
import { BUSINESS_INFO } from "../../constants/businessInfo";
import { APPROVED_VEHICLES } from "../../data/vehiclesData";
import "./EnquiryForm.css";

const TODAY = new Date().toISOString().split("T")[0];

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    pickupLocation: "",
    destination: "",
    travelDate: TODAY,
    pickupTime: "",
    preferredVehicle: APPROVED_VEHICLES[0]?.vehicle_name || "Maruti Suzuki Swift Dzire",
    passengers: "1-4 Passengers",
    tripType: "Local Sightseeing & Temple Darshan",
    additionalRequirements: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tripTypes = [
    "Local Sightseeing & Temple Darshan",
    "Tirumala Hill Darshan & Ghat Road",
    "Tirupati Airport Pickup / Drop",
    "Outstation Highway Trip (Chennai, Vellore, Bangalore)",
    "Round Trip & Multi-day Package"
  ];

  const passengerOptions = [
    "1-3 Passengers (Sedan)",
    "4-6 Passengers (MPV / Ertiga)",
    "7 Passengers (Innova Crysta)",
    "8-12 Passengers (Tempo Traveller)",
    "13-17 Passengers (Tempo Traveller Large)",
    "17+ Group Booking"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile is required";
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Enter 10-digit mobile";
    }
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup is required";
    }
    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }
    if (!formData.travelDate) {
      newErrors.travelDate = "Date is required";
    }
    if (!formData.preferredVehicle) {
      newErrors.preferredVehicle = "Select vehicle";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      const firstErrorEl = document.querySelector(".field-error");
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    const timeText = formData.pickupTime.trim() ? formData.pickupTime.trim() : "Flexible / To be confirmed";
    const notesText = formData.additionalRequirements.trim() || "None";

    const messageLines = [
      "🚕 *NEW TAXI BOOKING ENQUIRY - DEEKSHITHA TRAVELS*",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `👤 *Customer Name:* ${formData.customerName.trim()}`,
      `📞 *Mobile Number:* ${formData.mobileNumber.trim()}`,
      `👥 *Passengers:* ${formData.passengers}`,
      `📍 *Pickup Location:* ${formData.pickupLocation.trim()}`,
      `🏁 *Destination:* ${formData.destination.trim()}`,
      `📅 *Travel Date:* ${formData.travelDate}`,
      `⏰ *Pickup Time:* ${timeText}`,
      `🚗 *Preferred Vehicle:* ${formData.preferredVehicle}`,
      `🧭 *Trip Type:* ${formData.tripType}`,
      ...(notesText !== "None" ? [`📝 *Notes:* ${notesText}`] : []),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Please share tariff quote & confirm cab availability."
    ];

    const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(messageLines.join("\n"))}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="booking" className="enquiry-section" aria-label="Book a Taxi with Deekshitha Travels">
      <div id="contact" style={{ position: "absolute", top: 0, left: 0, height: 1, width: 1, pointerEvents: "none" }} aria-hidden="true" />
      <div className="enquiry-container">
        <div className="enquiry-card-wrapper">
          {/* Column 1: Promotional / Info Card */}
          <div className="enquiry-info-col">
            <div className="enquiry-badge-wrap">
              <span className="section-badge">Fast Booking</span>
              <span className="instant-quote-badge">
                <span className="badge-pulse-dot" />
                24/7 Available
              </span>
            </div>

            <h2 className="enquiry-col-title">Book Your Tirupati Taxi &amp; Cab Online</h2>
            <p className="enquiry-col-desc">
              Clean AC cabs, transparent pricing, and courteous hill-experienced drivers for your Tirumala darshan, airport transfer, and outstation travel.
            </p>

            {/* Value Highlights */}
            <div className="enquiry-features-list">
              <div className="enquiry-feat-item">
                <div className="feat-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="feat-text">
                  <strong>Instant WhatsApp Confirmation</strong>
                  <span>Direct driver allotment with fixed upfront quote</span>
                </div>
              </div>

              <div className="enquiry-feat-item">
                <div className="feat-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="feat-text">
                  <strong>Zero Advance Required</strong>
                  <span>Pay comfortably after trip completion</span>
                </div>
              </div>

              <div className="enquiry-feat-item">
                <div className="feat-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="feat-text">
                  <strong>Tirumala Ghat Specialists</strong>
                  <span>Seasoned hill-certified courteous chauffeurs</span>
                </div>
              </div>
            </div>

            {/* Direct Call & Office Location Cards */}
            <div className="enquiry-contact-cards">
              <div className="enquiry-call-card">
                <div className="call-card-icon-wrap" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="call-card-details">
                  <span className="call-card-hint">24/7 Helpline &amp; Booking</span>
                  <a href={BUSINESS_INFO.phoneTel} className="call-card-link">
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="enquiry-location-card">
                <div className="loc-card-icon-wrap" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="loc-card-details">
                  <span className="loc-card-hint">Operating Hub in Tirupati</span>
                  <a
                    href="https://maps.google.com/?q=Tirupati+Central,+Near+Bus+Stand+%26+Railway+Station,+Tirupati,+Andhra+Pradesh+517501"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="loc-card-link"
                    title="View office location & get directions on Google Maps"
                  >
                    <span>{BUSINESS_INFO.address.street}, Tirupati</span>
                    <span className="loc-directions-tag">Google Maps &rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Compact & Streamlined Booking Form */}
          <div className="enquiry-form-col">
            <form className="compact-enquiry-form" onSubmit={handleSubmit} noValidate>
              <div className="form-col-header">
                <h3 className="form-col-title">Cab Reservation</h3>
                <span className="form-col-subtitle">Enter details for fast fare quote</span>
              </div>

              <div className="compact-form-grid">
                {/* 1. Customer Name */}
                <div className="compact-field">
                  <label htmlFor="customerName" className="compact-label">
                    <span>Name</span> <span className="star">*</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={`compact-input ${errors.customerName ? "field-error" : ""}`}
                      autoComplete="name"
                    />
                  </div>
                  {errors.customerName && <span className="compact-err">{errors.customerName}</span>}
                </div>

                {/* 2. Mobile Number */}
                <div className="compact-field">
                  <label htmlFor="mobileNumber" className="compact-label">
                    <span>Mobile</span> <span className="star">*</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className={`compact-input ${errors.mobileNumber ? "field-error" : ""}`}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.mobileNumber && <span className="compact-err">{errors.mobileNumber}</span>}
                </div>

                {/* 3. Pickup Location */}
                <div className="compact-field">
                  <label htmlFor="pickupLocation" className="compact-label">
                    <span>Pickup</span> <span className="star">*</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <input
                      type="text"
                      id="pickupLocation"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      placeholder="Station, airport, hotel..."
                      className={`compact-input ${errors.pickupLocation ? "field-error" : ""}`}
                    />
                  </div>
                  {errors.pickupLocation && <span className="compact-err">{errors.pickupLocation}</span>}
                </div>

                {/* 4. Destination */}
                <div className="compact-field">
                  <label htmlFor="destination" className="compact-label">
                    <span>Destination</span> <span className="star">*</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Tirumala, Kanipakam..."
                      className={`compact-input ${errors.destination ? "field-error" : ""}`}
                    />
                  </div>
                  {errors.destination && <span className="compact-err">{errors.destination}</span>}
                </div>

                {/* 5. Travel Date */}
                <div className="compact-field">
                  <label htmlFor="travelDate" className="compact-label">
                    <span>Date</span> <span className="star">*</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <input
                      type="date"
                      id="travelDate"
                      name="travelDate"
                      min={TODAY}
                      value={formData.travelDate}
                      onChange={handleChange}
                      className={`compact-input compact-date ${errors.travelDate ? "field-error" : ""}`}
                    />
                  </div>
                  {errors.travelDate && <span className="compact-err">{errors.travelDate}</span>}
                </div>

                {/* 6. Pickup Time */}
                <div className="compact-field">
                  <label htmlFor="pickupTime" className="compact-label">
                    <span>Time</span> <span className="compact-opt">(Optional)</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <input
                      type="time"
                      id="pickupTime"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange}
                      className="compact-input compact-date"
                    />
                  </div>
                </div>

                {/* 7. Preferred Vehicle */}
                <div className="compact-field">
                  <label htmlFor="preferredVehicle" className="compact-label">
                    <span>Vehicle</span> <span className="star">*</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3c-.1.2-.1.4-.1.6v4.5c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                    <select
                      id="preferredVehicle"
                      name="preferredVehicle"
                      value={formData.preferredVehicle}
                      onChange={handleChange}
                      className={`compact-select ${errors.preferredVehicle ? "field-error" : ""}`}
                    >
                      {APPROVED_VEHICLES.map((v) => (
                        <option key={v.id} value={v.vehicle_name}>
                          {v.vehicle_name} ({v.seating_capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.preferredVehicle && <span className="compact-err">{errors.preferredVehicle}</span>}
                </div>

                {/* 8. Number of Passengers */}
                <div className="compact-field">
                  <label htmlFor="passengers" className="compact-label">
                    <span>Passengers</span> <span className="star">*</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <select
                      id="passengers"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="compact-select"
                    >
                      {passengerOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 9. Trip Type (Full Width) */}
                <div className="compact-field compact-field-full">
                  <label htmlFor="tripType" className="compact-label">
                    <span>Trip Type</span> <span className="star">*</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                    <select
                      id="tripType"
                      name="tripType"
                      value={formData.tripType}
                      onChange={handleChange}
                      className="compact-select"
                    >
                      {tripTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 10. Additional Requirements */}
                <div className="compact-field compact-field-full">
                  <label htmlFor="additionalRequirements" className="compact-label">
                    <span>Special Notes</span> <span className="compact-opt">(Optional)</span>
                  </label>
                  <div className="compact-input-wrap">
                    <svg className="compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <input
                      type="text"
                      id="additionalRequirements"
                      name="additionalRequirements"
                      value={formData.additionalRequirements}
                      onChange={handleChange}
                      placeholder="Flight arrival no., senior citizens, luggage..."
                      className="compact-input"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="compact-submit-wrap">
                <button
                  type="submit"
                  className="compact-submit-btn"
                  disabled={isSubmitting}
                  aria-label="Confirm Taxi Booking on WhatsApp"
                >
                  <svg
                    className="whatsapp-btn-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.547 5.375L2 22l4.75-1.516a10.024 10.024 0 0 0 5.281 1.484c5.531 0 10.031-4.5 10.031-10.031S17.562 2 12.031 2zm0 18.25c-1.688 0-3.25-.453-4.609-1.25l-.328-.188-3.047.969.984-2.969-.219-.344A8.17 8.17 0 0 1 3.813 12c0-4.531 3.688-8.219 8.218-8.219 4.531 0 8.219 3.688 8.219 8.219 0 4.531-3.688 8.25-8.219 8.25zm4.516-6.172c-.25-.125-1.469-.719-1.688-.813-.234-.094-.406-.125-.578.125-.172.25-.656.813-.813.984-.141.156-.3.188-.547.063-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.141-.25-.016-.391.109-.516.109-.109.25-.3.375-.453.125-.156.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.906-.219-.5-.438-.438-.594-.438h-.516c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.156 0 1.281.938 2.516 1.063 2.688.141.172 1.844 2.828 4.469 3.969.625.266 1.109.438 1.484.563.625.203 1.203.172 1.656.109.5-.078 1.469-.609 1.688-1.203.203-.594.203-1.109.141-1.203-.047-.109-.219-.172-.469-.297z" />
                  </svg>
                  <span>{isSubmitting ? "Opening WhatsApp..." : "Book on WhatsApp"}</span>
                  <svg className="btn-arrow-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <div className="compact-micro-guarantee">
                  <span>✓ Zero Advance</span>
                  <span>&bull;</span>
                  <span>Instant Driver Allotment</span>
                  <span>&bull;</span>
                  <span>Clean AC Cabs</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

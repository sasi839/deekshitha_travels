import { useState } from "react";
import { BUSINESS_INFO } from "../../constants/businessInfo";
import { SAMPLE_VEHICLES } from "../../data/vehiclesData";
import "./EnquiryForm.css";

export default function EnquiryForm() {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    pickupLocation: "",
    destination: "",
    travelDate: today,
    preferredVehicle: SAMPLE_VEHICLES[0]?.name || "Sedan (Swift Dzire / Etios)",
    tripType: "Local Trip",
    additionalRequirements: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tripTypes = [
    "Local Trip",
    "Airport Pickup",
    "Airport Drop",
    "Outstation",
    "Car Rental"
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
      newErrors.customerName = "Customer name is required.";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Please enter a valid mobile number.";
    }
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required.";
    }
    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required.";
    }
    if (!formData.travelDate) {
      newErrors.travelDate = "Travel date is required.";
    }
    if (!formData.preferredVehicle) {
      newErrors.preferredVehicle = "Please select a preferred vehicle.";
    }
    if (!formData.tripType) {
      newErrors.tripType = "Please select a trip type.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const additionalReq = formData.additionalRequirements.trim() || "None";

    // Format WhatsApp message exactly as requested
    const message = [
      "Hello Deekshitha Travels!",
      "",
      "I would like to enquire about a taxi booking.",
      "",
      `Customer Name: ${formData.customerName.trim()}`,
      `Mobile Number: ${formData.mobileNumber.trim()}`,
      `Pickup Location: ${formData.pickupLocation.trim()}`,
      `Destination: ${formData.destination.trim()}`,
      `Travel Date: ${formData.travelDate}`,
      `Preferred Vehicle: ${formData.preferredVehicle}`,
      `Trip Type: ${formData.tripType}`,
      `Additional Requirements: ${additionalReq}`,
      "",
      "Please contact me with the booking details."
    ].join("\n");

    const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="enquiry-section" aria-label="Customer Travel Enquiry">
      <div className="enquiry-container">
        {/* Section Header */}
        <header className="enquiry-header">
          <span className="section-badge">Fast Booking & Quotation</span>
          <h2 className="enquiry-title">Plan Your Journey With Us</h2>
          <p className="enquiry-subtitle">
            Share your travel details and contact us for your taxi booking.
          </p>
        </header>

        {/* Form Card Container */}
        <div className="enquiry-card">
          <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              {/* 1. Customer Name */}
              <div className="form-group">
                <label htmlFor="customerName" className="form-label">
                  Customer Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`form-input ${errors.customerName ? "input-error" : ""}`}
                  autoComplete="name"
                />
                {errors.customerName && (
                  <span className="error-text">{errors.customerName}</span>
                )}
              </div>

              {/* 2. Mobile Number */}
              <div className="form-group">
                <label htmlFor="mobileNumber" className="form-label">
                  Mobile Number <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="e.g. 6300540826"
                  className={`form-input ${errors.mobileNumber ? "input-error" : ""}`}
                  autoComplete="tel"
                />
                {errors.mobileNumber && (
                  <span className="error-text">{errors.mobileNumber}</span>
                )}
              </div>

              {/* 3. Pickup Location */}
              <div className="form-group">
                <label htmlFor="pickupLocation" className="form-label">
                  Pickup Location <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="pickupLocation"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="e.g. Tirupati Airport, Hotel, Home"
                  className={`form-input ${errors.pickupLocation ? "input-error" : ""}`}
                />
                {errors.pickupLocation && (
                  <span className="error-text">{errors.pickupLocation}</span>
                )}
              </div>

              {/* 4. Destination */}
              <div className="form-group">
                <label htmlFor="destination" className="form-label">
                  Destination <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Tirumala, Renigunta, Chennai"
                  className={`form-input ${errors.destination ? "input-error" : ""}`}
                />
                {errors.destination && (
                  <span className="error-text">{errors.destination}</span>
                )}
              </div>

              {/* 5. Travel Date */}
              <div className="form-group">
                <label htmlFor="travelDate" className="form-label">
                  Travel Date <span className="required-star">*</span>
                </label>
                <input
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  min={today}
                  value={formData.travelDate}
                  onChange={handleChange}
                  className={`form-input form-date-input ${errors.travelDate ? "input-error" : ""}`}
                />
                {errors.travelDate && (
                  <span className="error-text">{errors.travelDate}</span>
                )}
              </div>

              {/* 6. Preferred Vehicle */}
              <div className="form-group">
                <label htmlFor="preferredVehicle" className="form-label">
                  Preferred Vehicle <span className="required-star">*</span>
                </label>
                <select
                  id="preferredVehicle"
                  name="preferredVehicle"
                  value={formData.preferredVehicle}
                  onChange={handleChange}
                  className={`form-select ${errors.preferredVehicle ? "input-error" : ""}`}
                >
                  {SAMPLE_VEHICLES.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} ({v.seating_capacity}, {v.ac_label})
                    </option>
                  ))}
                </select>
                {errors.preferredVehicle && (
                  <span className="error-text">{errors.preferredVehicle}</span>
                )}
              </div>

              {/* 7. Trip Type */}
              <div className="form-group form-group-full">
                <label htmlFor="tripType" className="form-label">
                  Trip Type <span className="required-star">*</span>
                </label>
                <select
                  id="tripType"
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleChange}
                  className={`form-select ${errors.tripType ? "input-error" : ""}`}
                >
                  {tripTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.tripType && (
                  <span className="error-text">{errors.tripType}</span>
                )}
              </div>

              {/* 8. Additional Requirements */}
              <div className="form-group form-group-full">
                <label htmlFor="additionalRequirements" className="form-label">
                  Additional Requirements <span className="optional-tag">(Optional)</span>
                </label>
                <textarea
                  id="additionalRequirements"
                  name="additionalRequirements"
                  rows="3"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder="E.g., Number of passengers, flight arrival time, child seat, luggage details..."
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="form-submit-container">
              <button
                type="submit"
                className="enquiry-submit-btn"
                disabled={isSubmitting}
                aria-label="Send Enquiry on WhatsApp"
              >
                <svg
                  className="whatsapp-btn-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.547 5.375L2 22l4.75-1.516a10.024 10.024 0 0 0 5.281 1.484c5.531 0 10.031-4.5 10.031-10.031S17.562 2 12.031 2zm0 18.25c-1.688 0-3.25-.453-4.609-1.25l-.328-.188-3.047.969.984-2.969-.219-.344A8.17 8.17 0 0 1 3.813 12c0-4.531 3.688-8.219 8.218-8.219 4.531 0 8.219 3.688 8.219 8.219 0 4.531-3.688 8.25-8.219 8.25zm4.516-6.172c-.25-.125-1.469-.719-1.688-.813-.234-.094-.406-.125-.578.125-.172.25-.656.813-.813.984-.141.156-.3.188-.547.063-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.141-.25-.016-.391.109-.516.109-.109.25-.3.375-.453.125-.156.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.906-.219-.5-.438-.438-.594-.438h-.516c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.156 0 1.281.938 2.516 1.063 2.688.141.172 1.844 2.828 4.469 3.969.625.266 1.109.438 1.484.563.625.203 1.203.172 1.656.109.5-.078 1.469-.609 1.688-1.203.203-.594.203-1.109.141-1.203-.047-.109-.219-.172-.469-.297z" />
                </svg>
                <span>{isSubmitting ? "Opening WhatsApp..." : "Send Enquiry on WhatsApp"}</span>
              </button>

              <p className="direct-call-prompt">
                Prefer calling? Reach us instantly at{" "}
                <a href={BUSINESS_INFO.phoneTel} className="prompt-call-link">
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

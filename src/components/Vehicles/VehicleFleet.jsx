import { useState, useEffect } from "react";
import VehicleCard from "./VehicleCard";
import { api } from "../../services/api";
import { BUSINESS_INFO } from "../../constants/businessInfo";
import { APPROVED_VEHICLES } from "../../data/vehiclesData";
import "./VehicleFleet.css";

export default function VehicleFleet() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadFleet() {
      setError(null);
      try {
        const dynamicVehicles = await api.getPublicVehicles();
        if (!isMounted) return;
        if (Array.isArray(dynamicVehicles) && dynamicVehicles.length > 0) {
          setVehicles(dynamicVehicles);
        } else {
          setVehicles(APPROVED_VEHICLES);
        }
      } catch (err) {
        console.warn("Database vehicle query notice:", err.message);
        if (isMounted) {
          setVehicles(APPROVED_VEHICLES);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFleet();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setRetryCount((prev) => prev + 1);
  };

  return (
    <section id="vehicles" className="vehicle-fleet-section" aria-label="Our Vehicle Fleet">
      <div className="vehicle-fleet-container">
        {/* Section Header */}
        <header className="section-header">
          <div className="section-badge-row">
            <span className="section-badge">Verified Fleet</span>
            {api.isSupabaseLive() && (
              <span className="fleet-live-badge" title="Powered by Supabase Database">
                <span className="live-dot" />
                Live Online
              </span>
            )}
          </div>
          <h2 className="section-title">Choose Your Ride</h2>
          <p className="section-subtitle">
            Reliable customer vehicles for Tirupati darshan &amp; airport journeys.
          </p>
          <p className="section-description">
            Clean, air-conditioned cars with experienced drivers for local temple visits, airport transfers, and outstation tours.
          </p>
        </header>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="vehicles-grid" aria-label="Loading vehicles...">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="fleet-skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-content">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-desc" />
                  <div className="skeleton-line skeleton-desc" style={{ width: "70%" }} />
                  <div className="skeleton-line skeleton-btn" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error / Notice State */}
        {!loading && error && vehicles.length === 0 && (
          <div className="fleet-notice-card">
            <svg className="fleet-notice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3 className="fleet-notice-title">Temporarily Unable to Load Fleet</h3>
            <p className="fleet-notice-desc">
              We couldn&apos;t connect to the vehicle database. You can still reach us directly via call or WhatsApp for instant cab bookings.
            </p>
            <div className="fleet-notice-actions">
              <button type="button" onClick={handleRetry} className="fleet-btn-retry">
                Retry Loading
              </button>
              <a href={BUSINESS_INFO.phoneTel} className="fleet-btn-contact">
                Call: {BUSINESS_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && vehicles.length === 0 && (
          <div className="fleet-notice-card">
            <h3 className="fleet-notice-title">No Vehicles Listed Currently</h3>
            <p className="fleet-notice-desc">
              All approved vehicles are being serviced or updated. Please contact us directly for immediate cab availability.
            </p>
            <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="fleet-btn-retry" style={{ textDecoration: "none", display: "inline-block" }}>
              Enquire on WhatsApp
            </a>
          </div>
        )}

        {/* Vehicles Grid */}
        {!loading && vehicles.length > 0 && (
          <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id || vehicle.vehicle_name} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

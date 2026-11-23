import { useState, useEffect } from "react";
import VehicleCard from "./VehicleCard";
import { SAMPLE_VEHICLES } from "../../data/vehiclesData";
import { api } from "../../services/api";
import "./VehicleFleet.css";

export default function VehicleFleet() {
  const [vehicles, setVehicles] = useState(SAMPLE_VEHICLES);

  // Fetch active vehicles from dynamic backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchFleet() {
      try {
        const dynamicVehicles = await api.getPublicVehicles();
        if (isMounted && Array.isArray(dynamicVehicles) && dynamicVehicles.length > 0) {
          setVehicles(dynamicVehicles);
        }
      } catch (err) {
        console.warn("Using offline vehicle fleet fallback:", err);
      }
    }
    fetchFleet();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="vehicles" className="vehicle-fleet-section" aria-label="Our Vehicle Fleet">
      <div className="vehicle-fleet-container">
        {/* Section Header */}
        <header className="section-header">
          <span className="section-badge">Our Fleet</span>
          <h2 className="section-title">Choose Your Ride</h2>
          <p className="section-subtitle">
            Find the right vehicle for your comfortable journey.
          </p>
          <p className="section-description">
            Explore our range of vehicles for local travel, airport transfers and outstation journeys.
          </p>
        </header>

        {/* Vehicles Grid */}
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}

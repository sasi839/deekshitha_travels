import VehicleCard from "./VehicleCard";
import { SAMPLE_VEHICLES } from "../../data/vehiclesData";
import "./VehicleFleet.css";

export default function VehicleFleet() {
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
          {SAMPLE_VEHICLES.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}

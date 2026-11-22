import Navbar from "./components/Navbar/Navbar";
import HeroSlider from "./components/HeroSlider/HeroSlider";
import VehicleFleet from "./components/Vehicles/VehicleFleet";
import AboutSection from "./components/About/AboutSection";
import ServicesSection from "./components/Services/ServicesSection";
import ServiceLocations from "./components/Locations/ServiceLocations";
import EnquiryForm from "./components/Enquiry/EnquiryForm";
import Footer from "./components/Footer/Footer";
import FloatingContactButtons from "./components/FloatingButtons/FloatingContactButtons";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main id="main-content">
        <HeroSlider />
        <VehicleFleet />
        <AboutSection />
        <ServicesSection />
        <ServiceLocations />
        <EnquiryForm />
      </main>
      <Footer />
      <FloatingContactButtons />
    </div>
  );
}

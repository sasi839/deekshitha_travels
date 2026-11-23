import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import HeroSlider from "./components/HeroSlider/HeroSlider";
import VehicleFleet from "./components/Vehicles/VehicleFleet";
import AboutSection from "./components/About/AboutSection";
import ServicesSection from "./components/Services/ServicesSection";
import ServiceLocations from "./components/Locations/ServiceLocations";
import EnquiryForm from "./components/Enquiry/EnquiryForm";
import Footer from "./components/Footer/Footer";
import FloatingContactButtons from "./components/FloatingButtons/FloatingContactButtons";
import AdminPanel from "./components/Admin/AdminPanel";
import "./App.css";

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    if (typeof window === "undefined") return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path.startsWith("/admin") ||
      hash.startsWith("#/admin") ||
      hash.startsWith("#admin")
    );
  });

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setIsAdminRoute(
        path.startsWith("/admin") ||
        hash.startsWith("#/admin") ||
        hash.startsWith("#admin")
      );
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  const handleBackToSite = () => {
    // Return to public homepage
    if (window.location.hash) {
      window.location.hash = "";
    }
    if (window.location.pathname.startsWith("/admin")) {
      window.history.pushState({}, "", "/");
    }
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isAdminRoute) {
    return <AdminPanel onBackToSite={handleBackToSite} />;
  }

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
      <Footer onOpenAdmin={() => setIsAdminRoute(true)} />
      <FloatingContactButtons />
    </div>
  );
}

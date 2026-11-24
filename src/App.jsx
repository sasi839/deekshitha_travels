import { useState, useEffect, lazy, Suspense } from "react";
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

const AdminPanel = lazy(() => import("./components/Admin/AdminPanel"));

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
    return (
      <Suspense
        fallback={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#121417",
              color: "#f5b014",
              gap: "1rem"
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                border: "3px solid rgba(245, 176, 20, 0.2)",
                borderTopColor: "#f5b014",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
              }}
            />
            <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: 500 }}>
              Loading Admin Portal...
            </span>
          </div>
        }
      >
        <AdminPanel onBackToSite={handleBackToSite} />
      </Suspense>
    );
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

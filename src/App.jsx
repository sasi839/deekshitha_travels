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
import { updateDocumentMetadata, getRouteMetadata } from "./utils/seo";
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
      if (typeof window === "undefined") return;
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      // Ensure sitemap navigation loads the raw XML file directly
      if (path === "/sitemap" || path === "/sitemap/") {
        window.location.replace("/sitemap.xml");
        return;
      }

      const isAdmin = (
        path.startsWith("/admin") ||
        hash.startsWith("#/admin") ||
        hash.startsWith("#admin")
      );
      setIsAdminRoute(isAdmin);

      if (isAdmin) {
        updateDocumentMetadata("/admin");
      } else {
        const cleanPath = path.replace(/\/+$/, "") || "/";
        if (cleanPath !== "/") {
          updateDocumentMetadata(cleanPath);
        } else if (hash) {
          const mappedPath = "/" + hash.replace(/^#\/?/, "").replace("booking", "contact");
          updateDocumentMetadata(mappedPath);
        } else {
          updateDocumentMetadata("/");
        }
      }
    };

    // Apply metadata on initial mount
    handleRouteChange();

    // Deep link scroll on direct URL navigation (e.g. /services, /vehicles)
    if (typeof window !== "undefined") {
      const initPath = window.location.pathname.toLowerCase();
      const initHash = window.location.hash.toLowerCase();
      const isCurrentAdmin = (
        initPath.startsWith("/admin") ||
        initHash.startsWith("#/admin") ||
        initHash.startsWith("#admin")
      );
      if (!isCurrentAdmin) {
        const cleanPath = initPath.replace(/\/+$/, "");
        const meta = getRouteMetadata(cleanPath);
        if (meta && meta.sectionId && meta.sectionId !== "home") {
          setTimeout(() => {
            const el = document.getElementById(meta.sectionId);
            if (el) {
              const navHeader = document.querySelector(".navbar-header");
              const navOffset = navHeader ? navHeader.offsetHeight : 68;
              const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
              window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
            }
          }, 120);
        }
      }
    }

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
    updateDocumentMetadata("/");
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

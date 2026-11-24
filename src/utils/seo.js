/**
 * SEO & Route Metadata Utility for Deekshitha Travels
 * Manages document title, meta descriptions, canonical URLs, and robots indexing directives.
 */

export const BASE_PRODUCTION_URL = "https://deekshithatravels.com";

export const ROUTE_METADATA = {
  "/": {
    title: "Deekshitha Travels | 24/7 Taxi Services, Tirumala Darshan & Car Rentals in Tirupati",
    description:
      "Book 24/7 reliable taxi services in Tirupati with Deekshitha Travels. Safe Tirumala darshan cabs, Tirupati Airport (TIR) pickup and drop, outstation trips & verified car rentals. Call +91 6300540826.",
    canonical: `${BASE_PRODUCTION_URL}/`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    sectionId: "home"
  },
  "/services": {
    title: "Taxi Services & Car Rental Packages in Tirupati | Deekshitha Travels",
    description:
      "Explore 24/7 taxi services in Tirupati, Tirumala darshan packages, airport transfers, and car rentals. Transparent pricing with courteous drivers. Call +91 6300540826.",
    canonical: `${BASE_PRODUCTION_URL}/services`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    sectionId: "services"
  },
  "/vehicles": {
    title: "Our Vehicle Fleet - Sedan, Innova, Tempo Traveller | Deekshitha Travels",
    description:
      "Choose from our verified fleet: Swift Dzire, Ertiga, Innova Crysta, Etios, and Tempo Traveller in Tirupati. Clean AC cabs for families and groups. Call +91 6300540826.",
    canonical: `${BASE_PRODUCTION_URL}/vehicles`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    sectionId: "vehicles"
  },
  "/locations": {
    title: "Popular Destinations & Service Locations | Deekshitha Travels",
    description:
      "Doorstep taxi pickup across Tirupati, Tirumala, Renigunta, Tirupati Airport, Srikalahasti, Kanipakam, and Vellore. Reliable outstation cabs. Call +91 6300540826.",
    canonical: `${BASE_PRODUCTION_URL}/locations`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    sectionId: "locations"
  },
  "/about": {
    title: "About Deekshitha Travels | Trusted Taxi Agency in Tirupati",
    description:
      "Learn about Deekshitha Travels, your trusted travel partner for 24/7 cabs, Tirumala temple darshan, and airport transfers in Tirupati. Call +91 6300540826.",
    canonical: `${BASE_PRODUCTION_URL}/about`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    sectionId: "about"
  },
  "/contact": {
    title: "Book a Taxi - Contact & Online Reservation | Deekshitha Travels",
    description:
      "Book your Tirupati cab online or via WhatsApp. Zero advance required, instant driver allotment, and transparent fares. Call +91 6300540826.",
    canonical: `${BASE_PRODUCTION_URL}/contact`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    sectionId: "booking"
  },
  "/admin": {
    title: "Admin Portal | Deekshitha Travels",
    description: "Administrative access portal for Deekshitha Travels.",
    canonical: `${BASE_PRODUCTION_URL}/admin`,
    robots: "noindex, nofollow",
    sectionId: null
  }
};

/**
 * Normalizes a given pathname to match ROUTE_METADATA keys.
 */
export function getRouteMetadata(pathname = "/") {
  const cleanPath = (pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
  if (cleanPath.startsWith("/admin")) {
    return ROUTE_METADATA["/admin"];
  }
  return ROUTE_METADATA[cleanPath] || ROUTE_METADATA["/"];
}

/**
 * Updates DOM head tags dynamically to reflect current route metadata.
 */
export function updateDocumentMetadata(pathname = "/") {
  if (typeof document === "undefined") return;

  const meta = getRouteMetadata(pathname);

  // 1. Title
  if (meta.title && document.title !== meta.title) {
    document.title = meta.title;
  }

  // Helper to get or create a tag
  const setMetaTag = (selector, createAttrs, content) => {
    let el = document.querySelector(selector);
    if (!el && createAttrs) {
      el = document.createElement("meta");
      Object.entries(createAttrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
    }
    if (el) {
      el.setAttribute("content", content);
    }
  };

  // 2. Meta description
  setMetaTag('meta[name="description"]', { name: "description" }, meta.description);

  // 3. Meta title
  setMetaTag('meta[name="title"]', { name: "title" }, meta.title);

  // 4. Canonical URL
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement("link");
    canonicalEl.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute("href", meta.canonical);

  // 5. Robots indexing directive (CRITICAL: blocks indexing on /admin)
  setMetaTag('meta[name="robots"]', { name: "robots" }, meta.robots);

  // 6. Open Graph Tags
  const defaultImage = `${BASE_PRODUCTION_URL}/og-image.jpg`;
  const defaultImageAlt = "Deekshitha Travels - 24/7 Taxi Services, Tirumala Darshan & Car Rentals in Tirupati";
  setMetaTag('meta[property="og:title"]', { property: "og:title" }, meta.title);
  setMetaTag('meta[property="og:description"]', { property: "og:description" }, meta.description);
  setMetaTag('meta[property="og:url"]', { property: "og:url" }, meta.canonical);
  setMetaTag('meta[property="og:image"]', { property: "og:image" }, defaultImage);
  setMetaTag('meta[property="og:image:secure_url"]', { property: "og:image:secure_url" }, defaultImage);
  setMetaTag('meta[property="og:image:type"]', { property: "og:image:type" }, "image/jpeg");
  setMetaTag('meta[property="og:image:width"]', { property: "og:image:width" }, "1200");
  setMetaTag('meta[property="og:image:height"]', { property: "og:image:height" }, "630");
  setMetaTag('meta[property="og:image:alt"]', { property: "og:image:alt" }, defaultImageAlt);

  // 7. Twitter Tags
  setMetaTag('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
  setMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }, meta.title);
  setMetaTag('meta[name="twitter:description"]', { name: "twitter:description" }, meta.description);
  setMetaTag('meta[name="twitter:url"]', { name: "twitter:url" }, meta.canonical);
  setMetaTag('meta[name="twitter:image"]', { name: "twitter:image" }, defaultImage);
  setMetaTag('meta[name="twitter:image:alt"]', { name: "twitter:image:alt" }, defaultImageAlt);
}

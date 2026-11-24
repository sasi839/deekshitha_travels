import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const DIST_PATH = path.resolve(__dirname, "../dist");

// Serve frontend static files
app.use(express.static(DIST_PATH));

// Sitemap & Robots specific routes
app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.sendFile(path.join(DIST_PATH, "sitemap.xml"));
});

app.get(/^\/sitemap\/?$/, (req, res) => {
  res.redirect(301, "/sitemap.xml");
});

app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.sendFile(path.join(DIST_PATH, "robots.txt"));
});

// SPA fallback for all remaining routes (e.g. /admin, /admin/login)
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(DIST_PATH, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Deekshitha Travels API & Web Server running on http://localhost:${PORT}`);
});

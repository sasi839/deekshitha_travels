import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsPath = path.resolve(__dirname, "../public/uploads");
app.use("/uploads", express.static(uploadsPath));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", sliderRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", uploadRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Sitemap and Robots routes
app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  const distSitemap = path.resolve(__dirname, "../dist/sitemap.xml");
  const publicSitemap = path.resolve(__dirname, "../public/sitemap.xml");
  const sitemapFile = fs.existsSync(distSitemap) ? distSitemap : publicSitemap;
  res.sendFile(sitemapFile);
});

app.get(/^\/sitemap\/?$/, (req, res) => {
  res.redirect(301, "/sitemap.xml");
});

app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  const distRobots = path.resolve(__dirname, "../dist/robots.txt");
  const publicRobots = path.resolve(__dirname, "../public/robots.txt");
  const robotsFile = fs.existsSync(distRobots) ? distRobots : publicRobots;
  res.sendFile(robotsFile);
});

export default app;

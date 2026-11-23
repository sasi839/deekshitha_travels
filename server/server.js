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

// SPA fallback for all remaining routes (e.g. /admin, /admin/login)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(DIST_PATH, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Deekshitha Travels API & Web Server running on http://localhost:${PORT}`);
});

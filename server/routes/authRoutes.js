import { Router } from "express";
import bcrypt from "bcryptjs";
import { getDb, saveDb } from "../db.js";
import { generateToken, verifyToken, requireAuth } from "../auth.js";

const router = Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const db = getDb();
  const admin = db.admin;

  if (admin.username !== username.trim()) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = generateToken({
    id: admin.id,
    username: admin.username,
    role: admin.role
  });

  return res.json({
    success: true,
    token,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name || "Administrator",
      role: admin.role
    }
  });
});

// GET /api/auth/verify
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, error: "No token provided" });
  }

  const token = authHeader.substring(7).trim();
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ valid: false, error: "Invalid or expired token" });
  }

  const db = getDb();
  if (db.admin.username !== payload.username) {
    return res.status(401).json({ valid: false, error: "User not found" });
  }

  return res.json({
    valid: true,
    user: {
      id: db.admin.id,
      username: db.admin.username,
      name: db.admin.name || "Administrator",
      role: db.admin.role
    }
  });
});

// POST /api/auth/change-password
router.post("/change-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }

  const db = getDb();
  const isMatch = bcrypt.compareSync(currentPassword, db.admin.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: "Incorrect current password" });
  }

  db.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  saveDb(db);

  return res.json({ success: true, message: "Password updated successfully" });
});

export default router;

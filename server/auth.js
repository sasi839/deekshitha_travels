import crypto from "crypto";
import { getDb } from "./db.js";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "deekshitha-travels-secret-key-2026-secure-token";
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Date.now();
  const body = Buffer.from(JSON.stringify({
    ...payload,
    iat: now,
    exp: now + TOKEN_EXPIRY_MS
  })).toString("base64url");

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }

  const token = authHeader.substring(7).trim();
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }

  // Verify against current admin in db
  const db = getDb();
  if (db.admin.username !== payload.username) {
    return res.status(401).json({ error: "Unauthorized: User not recognized" });
  }

  req.user = payload;
  next();
}

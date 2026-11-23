import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { requireAuth } from "../auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const UPLOAD_DIR = path.resolve(__dirname, "../../public/uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && (mime.startsWith("image/") || mime === "image/svg+xml")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPG, PNG, WebP, SVG) are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// POST /api/admin/upload - Protected image upload
router.post("/admin/upload", requireAuth, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "Image file too large. Maximum size is 5MB" });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: "Image uploaded successfully",
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  });
});

export default router;

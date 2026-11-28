import multer from "multer";
import { AppError } from "./errorHandler.middleware.js";

// Vercel rejects request bodies over 4.5 MB before they reach the API, so cap images at 4 MB.
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const parser = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1, fields: 5 },
  fileFilter: (req, file, cb) => cb(null, TYPES.includes(file.mimetype)),
}).single("image");

/** One image in the "image" field, at most 4 MB, kept in memory for checking. */
export function imageUpload(req, res, next) {
  parser(req, res, (err) => {
    if (err?.code === "LIMIT_FILE_SIZE") return next(new AppError("That image is too large (limit 4 MB).", 413, "FILE_TOO_LARGE"));
    if (err) return next(new AppError("Couldn't read the upload.", 400, "BAD_UPLOAD"));
    if (!req.file) return next(new AppError("Attach a PNG, JPG, WebP or GIF image.", 400, "NO_FILE"));
    next();
  });
}

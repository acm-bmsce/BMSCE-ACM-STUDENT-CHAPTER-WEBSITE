import { Router } from "express";
import { config } from "../config/index.js";
import { login } from "../services/auth.service.js";
import { CONTENT } from "../services/content.schemas.js";
import { saveImage } from "../services/images.js";
import { mode, readFile, writeFile } from "../services/store.js";
import { requireAdmin, requireMasterFor } from "../middlewares/auth.middleware.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";
import { imageUpload } from "../middlewares/upload.middleware.js";
import { loginLimiter, uploadLimiter } from "../middlewares/rateLimiter.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);

router.get("/health", (req, res) => {
  // Counts only (never names or hashes), so a deployment's setup can be checked at a glance.
  res.json({
    status: "ok",
    service: "bmsce-acm-admin",
    storage: mode(),
    backend: config.liveApi ? "connected" : "off",
    admins: config.admins.length,
    adminEntriesIgnored: config.admins.problems || 0,
    jwtSecret: config.jwtSecret.length >= 32 ? "ok" : config.admins.length ? "missing or too short" : "not needed (no ADMIN_USERS)",
  });
});

// ---------------------------------------------------------------- sign-in

router.post(
  "/auth/login",
  loginLimiter,
  validate(loginSchema),
  wrap(async (req, res) => {
    res.json({ success: true, data: await login(req.body.username, req.body.password, req.ip) });
  })
);

router.get("/auth/me", requireAdmin, (req, res) => res.json({ success: true, data: req.admin }));

// ---------------------------------------------------------------- content

const fileFor = (name) => {
  const entry = CONTENT[name];
  if (!entry) throw new AppError("Unknown content file", 404, "NOT_FOUND");
  return entry;
};

/** Where saves go, so the panel can say "live in about a minute" or "saved on this computer". */
router.get("/admin/status", requireAdmin, (req, res) => {
  res.json({ success: true, data: { storage: mode(), repo: mode() === "github" ? config.github.repo : null, branch: mode() === "github" ? config.github.branch : null } });
});

/** GET /admin/content/:name → { data, sha }: the latest saved version (from GitHub when connected). */
router.get(
  "/admin/content/:name",
  requireAdmin,
  wrap(async (req, res) => {
    const entry = fileFor(req.params.name);
    const file = await readFile(entry.path);
    if (!file) throw new AppError(`${entry.path} is missing`, 404, "NOT_FOUND");
    let data;
    try {
      data = JSON.parse(file.data.toString("utf8"));
    } catch {
      throw new AppError(`${entry.path} isn't valid JSON`, 500, "BAD_CONTENT");
    }
    res.setHeader("Cache-Control", "no-store");
    res.json({ success: true, data, sha: file.sha });
  })
);

/** PUT /admin/content/:name { data, sha }: checks the data, then commits it (or writes it locally). */
router.put(
  "/admin/content/:name",
  requireAdmin,
  requireMasterFor(["site", "projects"]),
  wrap(async (req, res) => {
    const entry = fileFor(req.params.name);
    const { data, sha } = req.body || {};
    if (typeof sha !== "string" || !/^[0-9a-f]{40}$/.test(sha)) throw new AppError("Reload the page and try again (missing version).", 400, "MISSING_SHA");
    const parsed = entry.schema.safeParse(data);
    if (!parsed.success) {
      const details = parsed.error.issues.slice(0, 20).map((i) => ({ field: i.path.join("."), message: i.message }));
      throw new AppError("Some fields need fixing before this can be published.", 400, "VALIDATION_ERROR", details);
    }
    const buf = Buffer.from(`${JSON.stringify(parsed.data, null, 2)}\n`, "utf8");
    const saved = await writeFile(entry.path, buf, { sha, message: `content: update ${entry.label.toLowerCase()} (by ${req.admin.username})` });
    res.json({ success: true, data: parsed.data, sha: saved.sha, commit: saved.commit, storage: mode() });
  })
);

// ---------------------------------------------------------------- images

router.post(
  "/admin/uploads",
  requireAdmin,
  uploadLimiter,
  imageUpload,
  wrap(async (req, res) => {
    res.status(201).json({ success: true, data: await saveImage(req.file.buffer, { who: req.admin.username }) });
  })
);

/**
 * A just-uploaded image, before the redeploy that publishes it under /img/uploads/. Public on
 * purpose: these images are about to be public on the site anyway.
 */
router.get(
  "/uploads/:name",
  wrap(async (req, res) => {
    if (!/^[a-z0-9]{16}\.webp$/.test(req.params.name)) throw new AppError("Not found", 404, "NOT_FOUND");
    const file = await readFile(`public/img/uploads/${req.params.name}`);
    if (!file) throw new AppError("Not found", 404, "NOT_FOUND");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.type("image/webp").send(file.data);
  })
);

export default router;

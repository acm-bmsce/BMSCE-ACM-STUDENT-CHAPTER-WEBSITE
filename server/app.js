import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/index.js";
import apiRouter from "./routes/api.js";
import { errorHandler, AppError } from "./middlewares/errorHandler.middleware.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", config.trustProxy);

// Security headers. The API only returns JSON and images, so helmet's strict defaults fit.
// The website's own policy is a <meta> tag written into index.html at build time (vite.config.js).
const apiHelmet = helmet();
const webHelmet = config.serveWeb
  ? helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: { defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc, frameAncestors: ["'none'"], objectSrc: ["'none'"], baseUri: ["'self'"] },
      },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      crossOriginEmbedderPolicy: false,
    })
  : apiHelmet;
app.use((req, res, next) => (req.path.startsWith("/api") ? apiHelmet : webHelmet)(req, res, next));

// CORS Configuration
const allowedOrigins = new Set([config.frontendUrl].filter(Boolean));
if (config.env !== "production") {
  ["http://localhost:5173", "http://localhost:4173", "http://127.0.0.1:5173"].forEach((origin) => allowedOrigins.add(origin));
}

app.use((req, res, next) => {
  const requestOrigin = `${req.protocol}://${req.get("host")}`;
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, webhooks)
      // and same-origin browser requests, including Vercel custom domains and aliases.
      if (!origin || origin === requestOrigin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new AppError("Origin is not allowed", 403, "CORS_ORIGIN_DENIED"));
      }
    },
    credentials: true,
  })(req, res, next);
});

// Request logging (sanitized, no secrets or passwords)
if (config.env !== "test") {
  app.use(morgan("dev"));
}

// Global rate limiting
app.use("/api", generalLimiter);

// Content saves send a whole file (the events list is ~100 KB), so allow a little room.
app.use(express.json({ limit: "2mb" }));

// Mount main API
app.use("/api", apiRouter);

// 404 handler for unmatched API routes
app.use("/api/*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, "ROUTE_NOT_FOUND"));
});

// One-service deployments: SERVE_WEB=true also serves the built website (npm run build) with
// the same caching rules as vercel.json, so /api is same-origin and needs no CORS or rewrites.
if (config.serveWeb) {
  const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
  if (fs.existsSync(path.join(dist, "index.html"))) {
    app.use(
      express.static(dist, {
        index: false,
        setHeaders: (res, file) => {
          const rel = path.relative(dist, file).split(path.sep).join("/");
          if (rel.startsWith("assets/")) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          else if (/^(img|animations|Fonts)\//.test(rel)) res.setHeader("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
        },
      })
    );
    app.get(/^(?!\/api(\/|$)).*/, (req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(dist, "index.html"));
    });
  } else {
    console.warn("[web] SERVE_WEB is on but dist/index.html is missing. Run `npm run build` first.");
  }
}

// Centralized error handling middleware
app.use(errorHandler);

export default app;

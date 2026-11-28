import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, "../..");

// Load .env from the project root (local development; Vercel sets real environment variables).
dotenv.config({ path: path.join(PROJECT, ".env") });

/** The folder whose content/ and public/img/uploads/ the API reads and writes (tests use a copy). */
export const ROOT = process.env.CONTENT_ROOT ? path.resolve(process.env.CONTENT_ROOT) : PROJECT;

/**
 * ADMIN_USERS lists who can sign in to the admin panel, as username:bcrypt-hash pairs separated
 * by commas, e.g. "aprameya:$2b$12$...,fazal:$2b$12$...". Make a hash with `npm run admin:hash`.
 */
const BCRYPT = /\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}/;

/**
 * Forgiving about how the value was pasted: surrounding quotes, a leading "ADMIN_USERS=",
 * pairs separated by commas, semicolons, spaces or new lines, and stray characters around the
 * hash. Entries that still don't contain a username and a bcrypt hash are counted as problems.
 */
export function parseAdmins(raw = "") {
  const text = String(raw).trim().replace(/^ADMIN_USERS\s*=\s*/i, "").replace(/^["'`]+|["'`]+$/g, "");
  const admins = [];
  let problems = 0;
  for (const entry of text.split(/[\s,;]+/).filter(Boolean)) {
    const pair = entry.replace(/^["'`]+|["'`]+$/g, "");
    const i = pair.indexOf(":");
    const hash = i > 0 ? BCRYPT.exec(pair.slice(i + 1))?.[0] : null;
    const username = i > 0 ? pair.slice(0, i).trim().toLowerCase() : "";
    if (username && hash) admins.push({ username, hash });
    else problems += 1;
  }
  return Object.assign(admins, { problems });
}

export const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  // Hops of reverse proxy in front of the API (Vercel adds one), so rate limits and the login
  // lockout see each visitor's IP. "false" disables.
  trustProxy: (() => {
    const v = process.env.TRUST_PROXY || (process.env.NODE_ENV === "production" ? "1" : "false");
    return v === "false" ? false : /^\d+$/.test(v) ? Number(v) : v;
  })(),
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "12h",
  admins: parseAdmins(process.env.ADMIN_USERS),
  // Where content is saved. With GITHUB_TOKEN set, every save is a commit to GITHUB_REPO on
  // GITHUB_BRANCH (and the host redeploys). Without it, files are written to this checkout.
  github: {
    token: process.env.GITHUB_TOKEN || "",
    // On Vercel, defaults to the repository and branch being deployed.
    repo:
      process.env.GITHUB_REPO ||
      (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}` : "acm-bmsce/BMSCE-ACM-STUDENT-CHAPTER-WEBSITE"),
    branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main",
  },
  // The chapter's backend; its sign-ins are accepted here too (see auth.middleware.js). "off" disables.
  liveApi: (() => {
    const v = (process.env.LIVE_API ?? process.env.VITE_LIVE_API ?? process.env.VITE_API_BASE_URL ?? "https://bmsceacmwebsite.onrender.com").trim();
    return !v || v === "off" ? "" : v.replace(/\/+$/, "");
  })(),
  // Serve the built website from this server as well (single-service hosting).
  serveWeb: process.env.SERVE_WEB === "true",
};

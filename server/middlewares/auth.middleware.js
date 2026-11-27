import { config } from "../config/index.js";
import { verify } from "../services/auth.service.js";
import { AppError } from "./errorHandler.middleware.js";

/**
 * Admin routes take either of two sign-ins:
 *  - a token from this server's own /auth/login (accounts in ADMIN_USERS), or
 *  - a token from the chapter's backend (LIVE_API), which is what the admin panel uses when the
 *    backend is connected. The backend is asked once which kind of account the token belongs to:
 *    listing all projects is allowed for master admins (200), refused for other approved accounts
 *    (403) and for invalid or expired tokens (401). Answers are remembered for a few minutes.
 */
const CACHE_MS = 5 * 60 * 1000;
const known = new Map(); // token -> { admin, until }

const subject = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")).sub || "";
  } catch {
    return "";
  }
};

export async function backendAdmin(token) {
  if (!config.liveApi || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) return null;
  const hit = known.get(token);
  if (hit && hit.until > Date.now()) return hit.admin;
  let status;
  try {
    const res = await fetch(`${config.liveApi}/projects/?limit=1`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(60000) });
    status = res.status;
  } catch {
    throw new AppError("The chapter's backend didn't answer. It may be waking up; try again in a minute.", 503, "BACKEND_UNREACHABLE");
  }
  const name = subject(token);
  const admin = status === 200 ? { username: name, name, role: "master" } : status === 403 ? { username: name, name, role: "coordinator" } : null;
  if (known.size > 500) known.clear();
  if (admin || status === 401) known.set(token, { admin, until: Date.now() + CACHE_MS });
  return admin;
}

export function forgetBackendTokens() {
  known.clear();
}

export async function requireAdmin(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  try {
    const admin = (token && verify(token)) || (token && (await backendAdmin(token)));
    if (!admin) return next(new AppError("Please sign in again.", 401, "UNAUTHORIZED"));
    req.admin = { role: "master", ...admin };
    next();
  } catch (err) {
    next(err);
  }
}

/** Content that only master admins may change (coordinators manage events and stories). */
export function requireMasterFor(names) {
  return (req, res, next) => {
    if (names.includes(req.params.name) && req.admin?.role !== "master") {
      return next(new AppError("Only a master admin account can change this.", 403, "FORBIDDEN"));
    }
    next();
  };
}

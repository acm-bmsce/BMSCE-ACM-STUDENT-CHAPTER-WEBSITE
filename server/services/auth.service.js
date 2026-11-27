import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";

/**
 * Admin sign-in. Accounts come from ADMIN_USERS (username:bcrypt-hash pairs); there is no
 * database. After MAX_FAILS wrong passwords for one username from one IP, that pair is locked
 * for LOCK_MS. The counter lives in memory, so it resets when the server restarts.
 */
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const fails = new Map(); // `${ip}|${username}` -> { count, until }

// Compared when the username is unknown, so a wrong username takes as long as a wrong password.
// Made once, at the same cost as the real hashes.
let dummy = null;
const dummyHash = () => (dummy ||= bcrypt.hash("not-a-real-password", Number(config.admins[0]?.hash.slice(4, 6)) || 12));

export function resetLockouts() {
  fails.clear();
}

export async function login(username, password, ip = "") {
  const name = String(username || "").trim().toLowerCase();
  const key = `${ip}|${name}`;
  const entry = fails.get(key);
  if (entry?.until && entry.until > Date.now()) {
    const mins = Math.ceil((entry.until - Date.now()) / 60000);
    throw new AppError(`Too many wrong passwords. Try again in ${mins} minute${mins === 1 ? "" : "s"}.`, 429, "ACCOUNT_LOCKED");
  }
  if (!config.admins.length || config.jwtSecret.length < 32) throw new AppError("This API has no sign-ins of its own. Sign in with your account on the chapter's backend.", 503, "NO_ADMINS");

  const admin = config.admins.find((a) => a.username === name);
  const ok = await bcrypt.compare(String(password || ""), admin ? admin.hash : await dummyHash());
  if (!admin || !ok) {
    const count = (entry?.until && entry.until <= Date.now() ? 0 : entry?.count || 0) + 1;
    fails.set(key, { count, until: count >= MAX_FAILS ? Date.now() + LOCK_MS : 0 });
    throw new AppError("Wrong username or password.", 401, "INVALID_CREDENTIALS");
  }
  fails.delete(key);
  const token = jwt.sign({ sub: admin.username, role: "admin" }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  return { token, user: { username: admin.username, name: admin.username } };
}

/** The admin a bearer token belongs to, or null. Tokens for removed accounts stop working. */
export function verify(token) {
  if (config.jwtSecret.length < 32) return null;
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const admin = config.admins.find((a) => a.username === payload.sub);
    return admin ? { username: admin.username, name: admin.username } : null;
  } catch {
    return null;
  }
}

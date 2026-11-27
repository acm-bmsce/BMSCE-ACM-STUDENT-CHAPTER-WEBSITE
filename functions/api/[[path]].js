// The content API on Cloudflare Pages (the same API as server/ on Vercel or Node, for the
// routes the admin panel uses when the chapter's backend is connected).
//
// Cloudflare runs this for every request to /api/*. It reads and saves the content/ files
// (team, home-page numbers, drafts, website-only event details, story years) as commits to the
// GitHub repository, which makes Cloudflare Pages rebuild the site. Sign-in is the backend's:
// the admin panel sends the backend's token, and the backend is asked once which kind of account
// it belongs to.
//
// Settings (Cloudflare Pages → Settings → Variables and Secrets):
//   GITHUB_TOKEN   (secret) fine-grained token for this repository, Contents: Read and write
//   GITHUB_REPO    optional, default acm-bmsce/BMSCE-ACM-STUDENT-CHAPTER-WEBSITE
//   GITHUB_BRANCH  optional, default main
//   LIVE_API       optional, default https://bmsceacmwebsite.onrender.com
import { CONTENT } from "../../server/services/content.schemas.js";

const DEFAULT_REPO = "acm-bmsce/BMSCE-ACM-STUDENT-CHAPTER-WEBSITE";
const DEFAULT_BACKEND = "https://bmsceacmwebsite.onrender.com";

class ApiError extends Error {
  constructor(message, status = 500, code = "ERROR", details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });

const settings = (env = {}) => {
  const live = (env.LIVE_API ?? env.VITE_LIVE_API ?? env.VITE_API_BASE_URL ?? DEFAULT_BACKEND).trim();
  return {
    token: env.GITHUB_TOKEN || "",
    repo: env.GITHUB_REPO || DEFAULT_REPO,
    branch: env.GITHUB_BRANCH || "main",
    live: !live || live === "off" ? "" : live.replace(/\/+$/, ""),
  };
};

// ---------------------------------------------------------------- bytes and hashes

const enc = new TextEncoder();
const dec = new TextDecoder();
const toBase64 = (bytes) => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const fromBase64 = (b64) => Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0));
/** Git's id for a file's content, so a version read without GitHub's API matches one read with it. */
async function blobSha(bytes) {
  const head = enc.encode(`blob ${bytes.length}\0`);
  const all = new Uint8Array(head.length + bytes.length);
  all.set(head);
  all.set(bytes, head.length);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-1", all));
  return [...digest].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------- GitHub

async function github(cfg, method, rel, body) {
  const url = `https://api.github.com/repos/${cfg.repo}/contents/${rel}${method === "GET" ? `?ref=${encodeURIComponent(cfg.branch)}` : ""}`;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${cfg.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "bmsce-acm-admin",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Couldn't reach GitHub. Try again in a moment.", 502, "GITHUB_UNREACHABLE");
  }
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

const tokenRefused = () => new ApiError("GitHub refused the token. Check GITHUB_TOKEN (Contents: read & write on this repo).", 502, "GITHUB_AUTH");

/** { bytes, sha } of a content file. Without a token, the public copy is read instead. */
async function readFile(cfg, rel) {
  if (!cfg.token) {
    const res = await fetch(`https://raw.githubusercontent.com/${cfg.repo}/${encodeURIComponent(cfg.branch)}/${rel}`, { headers: { "User-Agent": "bmsce-acm-admin" } }).catch(() => null);
    if (!res || !res.ok) throw new ApiError(`Couldn't read ${rel} from GitHub${res ? ` (${res.status})` : ""}.`, 502, "GITHUB_ERROR");
    const bytes = new Uint8Array(await res.arrayBuffer());
    return { bytes, sha: await blobSha(bytes) };
  }
  const { status, json: j } = await github(cfg, "GET", rel);
  if (status === 401 || status === 403) throw tokenRefused();
  if (status !== 200) throw new ApiError(`GitHub couldn't read ${rel} (${status})`, 502, "GITHUB_ERROR");
  let bytes = j.content ? fromBase64(j.content) : new Uint8Array();
  if (!j.content && j.download_url) bytes = new Uint8Array(await (await fetch(j.download_url, { headers: { Authorization: `Bearer ${cfg.token}` } })).arrayBuffer());
  return { bytes, sha: j.sha };
}

async function writeFile(cfg, rel, bytes, { sha, message }) {
  if (!cfg.token) {
    throw new ApiError("Saving isn't set up on this deployment yet: add GITHUB_TOKEN in Cloudflare Pages → Settings → Variables and Secrets, then redeploy.", 503, "SAVES_NOT_CONFIGURED");
  }
  const { status, json: j } = await github(cfg, "PUT", rel, { message, content: toBase64(bytes), branch: cfg.branch, sha });
  if (status === 200 || status === 201) return { sha: j.content?.sha, commit: j.commit?.sha };
  if (status === 409 || (status === 422 && /sha/i.test(j.message || ""))) {
    throw new ApiError("Someone published a newer version since you opened this. Reload to get it, then make your change again.", 409, "CONTENT_CONFLICT");
  }
  if (status === 401 || status === 403) throw tokenRefused();
  throw new ApiError(`GitHub couldn't save ${rel} (${status}${j.message ? `: ${j.message}` : ""})`, 502, "GITHUB_ERROR");
}

// ---------------------------------------------------------------- sign-in (the backend's)

const CACHE_MS = 5 * 60 * 1000;
const known = new Map(); // token -> { admin, until }, per Cloudflare isolate

const subject = (token) => {
  try {
    return JSON.parse(dec.decode(fromBase64(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))).sub || "";
  } catch {
    return "";
  }
};

/** Listing all projects is allowed for master admins (200), refused for other accounts (403) and bad tokens (401). */
async function adminFor(cfg, request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !cfg.live || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) throw new ApiError("Please sign in again.", 401, "UNAUTHORIZED");
  const hit = known.get(token);
  if (hit && hit.until > Date.now()) {
    if (!hit.admin) throw new ApiError("Please sign in again.", 401, "UNAUTHORIZED");
    return hit.admin;
  }
  let status;
  try {
    status = (await fetch(`${cfg.live}/projects/?limit=1`, { headers: { Authorization: `Bearer ${token}` } })).status;
  } catch {
    throw new ApiError("The chapter's backend didn't answer. It may be waking up; try again in a minute.", 503, "BACKEND_UNREACHABLE");
  }
  const name = subject(token);
  const admin = status === 200 ? { username: name, name, role: "master" } : status === 403 ? { username: name, name, role: "coordinator" } : null;
  if (status >= 500) throw new ApiError("The chapter's backend didn't answer. It may be waking up; try again in a minute.", 503, "BACKEND_UNREACHABLE");
  if (known.size > 500) known.clear();
  known.set(token, { admin, until: Date.now() + CACHE_MS });
  if (!admin) throw new ApiError("Please sign in again.", 401, "UNAUTHORIZED");
  return admin;
}

// ---------------------------------------------------------------- routes

const MASTER_ONLY = ["site", "projects"];

async function handle(request, env) {
  const cfg = settings(env);
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, "").replace(/\/+$/, "") || "/";
  const method = request.method;

  if (path === "/health" && method === "GET") {
    return json({ status: "ok", service: "bmsce-acm-admin", host: "cloudflare", storage: cfg.token ? "github" : "not set up (add GITHUB_TOKEN)", backend: cfg.live ? "connected" : "off" });
  }
  if (path === "/auth/login") {
    throw new ApiError("Sign in with your account on the chapter's backend.", 503, "NO_ADMINS");
  }
  if (path === "/admin/uploads") {
    throw new ApiError("Images are uploaded to Cloudinary on this deployment.", 503, "UPLOADS_ELSEWHERE");
  }

  const admin = await adminFor(cfg, request);
  if (path === "/auth/me" && method === "GET") return json({ success: true, data: admin });
  if (path === "/admin/status" && method === "GET") {
    return json({ success: true, data: { storage: cfg.token ? "github" : "local", repo: cfg.repo, branch: cfg.branch } });
  }

  const m = /^\/admin\/content\/([a-z-]+)$/.exec(path);
  if (m) {
    const entry = CONTENT[m[1]];
    if (!entry) throw new ApiError("Unknown content file", 404, "NOT_FOUND");
    if (method === "GET") {
      const file = await readFile(cfg, entry.path);
      let data;
      try {
        data = JSON.parse(dec.decode(file.bytes));
      } catch {
        throw new ApiError(`${entry.path} isn't valid JSON`, 500, "BAD_CONTENT");
      }
      return json({ success: true, data, sha: file.sha });
    }
    if (method === "PUT") {
      if (MASTER_ONLY.includes(m[1]) && admin.role !== "master") throw new ApiError("Only a master admin account can change this.", 403, "FORBIDDEN");
      const body = await request.json().catch(() => ({}));
      const { data, sha } = body || {};
      if (typeof sha !== "string" || !/^[0-9a-f]{40}$/.test(sha)) throw new ApiError("Reload the page and try again (missing version).", 400, "MISSING_SHA");
      const parsed = entry.schema.safeParse(data);
      if (!parsed.success) {
        const details = parsed.error.issues.slice(0, 20).map((i) => ({ field: i.path.join("."), message: i.message }));
        throw new ApiError("Some fields need fixing before this can be published.", 400, "VALIDATION_ERROR", details);
      }
      const bytes = enc.encode(`${JSON.stringify(parsed.data, null, 2)}\n`);
      const saved = await writeFile(cfg, entry.path, bytes, { sha, message: `content: update ${entry.label.toLowerCase()} (by ${admin.username})` });
      return json({ success: true, data: parsed.data, sha: saved.sha, commit: saved.commit, storage: "github" });
    }
  }
  throw new ApiError("Not found", 404, "NOT_FOUND");
}

export async function onRequest({ request, env }) {
  try {
    return await handle(request, env);
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    const message = err instanceof ApiError ? err.message : "Something went wrong on the server.";
    return json({ success: false, error: { message, code: err.code || "ERROR", ...(err.details ? { details: err.details } : {}) } }, status);
  }
}

// For tests.
export { blobSha, known as backendTokenCache };

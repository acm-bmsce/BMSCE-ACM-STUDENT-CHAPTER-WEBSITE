import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { config, ROOT } from "../config/index.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";

/**
 * Reads and writes files in this repository: the content JSON (content/*.json) and uploaded
 * images (public/img/uploads/*.webp).
 *
 *  github  GITHUB_TOKEN set: each write is a commit to GITHUB_REPO on GITHUB_BRANCH through the
 *          GitHub contents API; the host (Vercel) redeploys from that commit.
 *  local   no token: files are written in this checkout (development); commit them yourself.
 *
 * Every file has a version (`sha`, the git blob hash). A save must name the version it started
 * from; if someone published a newer one meanwhile, the save is refused instead of overwriting it.
 */

const ALLOWED = /^(content\/[a-z-]+\.json|public\/img\/uploads\/[a-z0-9-]+\.webp)$/;

const safePath = (rel) => {
  const p = path.posix.normalize(String(rel || ""));
  if (!ALLOWED.test(p)) throw new AppError("That file can't be changed from the admin panel", 400, "BAD_PATH");
  return p;
};

/** Git's blob hash, so local versions look exactly like GitHub's. */
export const blobSha = (buf) => crypto.createHash("sha1").update(`blob ${buf.length}\0`).update(buf).digest("hex");

export const mode = () => (config.github.token ? "github" : "local");

// ---------------------------------------------------------------- GitHub

async function gh(method, rel, body) {
  const { repo, branch, token } = config.github;
  const url = `https://api.github.com/repos/${repo}/contents/${rel.split("/").map(encodeURIComponent).join("/")}${method === "GET" ? `?ref=${encodeURIComponent(branch)}` : ""}`;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "bmsce-acm-admin",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AppError("Couldn't reach GitHub. Try again in a moment.", 502, "GITHUB_UNREACHABLE");
  }
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function ghRead(rel) {
  const { status, json } = await gh("GET", rel);
  if (status === 404) return null;
  if (status === 401 || status === 403) throw new AppError("GitHub refused the token. Check GITHUB_TOKEN (Contents: read & write on this repo).", 502, "GITHUB_AUTH");
  if (status !== 200) throw new AppError(`GitHub couldn't read ${rel} (${status})`, 502, "GITHUB_ERROR");
  let buf;
  if (json.content) buf = Buffer.from(json.content, "base64");
  else if (json.download_url) buf = Buffer.from(await (await fetch(json.download_url, { headers: { Authorization: `Bearer ${config.github.token}` } })).arrayBuffer());
  else buf = Buffer.alloc(0);
  return { data: buf, sha: json.sha };
}

async function ghWrite(rel, buf, { sha, message }) {
  const { status, json } = await gh("PUT", rel, {
    message,
    content: buf.toString("base64"),
    branch: config.github.branch,
    ...(sha ? { sha } : {}),
  });
  if (status === 200 || status === 201) return { sha: json.content?.sha, commit: json.commit?.sha };
  if (status === 409 || (status === 422 && /sha/i.test(json.message || ""))) {
    throw new AppError("Someone published a newer version since you opened this. Reload to get it, then make your change again.", 409, "CONTENT_CONFLICT");
  }
  if (status === 401 || status === 403) throw new AppError("GitHub refused the token. Check GITHUB_TOKEN (Contents: read & write on this repo).", 502, "GITHUB_AUTH");
  throw new AppError(`GitHub couldn't save ${rel} (${status}${json.message ? `: ${json.message}` : ""})`, 502, "GITHUB_ERROR");
}

// ---------------------------------------------------------------- local files

async function localRead(rel) {
  try {
    const data = await fs.readFile(path.join(ROOT, rel));
    return { data, sha: blobSha(data) };
  } catch {
    return null;
  }
}

async function localWrite(rel, buf, { sha }) {
  if (process.env.VERCEL) {
    throw new AppError("Saving isn't set up on this deployment yet: add GITHUB_TOKEN in Vercel's environment variables, then redeploy.", 503, "SAVES_NOT_CONFIGURED");
  }
  const current = await localRead(rel);
  if (current && sha !== undefined && sha !== null && current.sha !== sha) {
    throw new AppError("Someone published a newer version since you opened this. Reload to get it, then make your change again.", 409, "CONTENT_CONFLICT");
  }
  const full = path.join(ROOT, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buf);
  return { sha: blobSha(buf), commit: null };
}

// ---------------------------------------------------------------- API

/** { data: Buffer, sha } or null when the file doesn't exist. */
export const readFile = (rel) => (mode() === "github" ? ghRead(safePath(rel)) : localRead(safePath(rel)));

/**
 * Writes a file. `sha` is the version the edit started from (required for existing files,
 * so a stale save can't overwrite a newer one); omit it only when creating a new file.
 */
export const writeFile = (rel, buf, opts = {}) => (mode() === "github" ? ghWrite(safePath(rel), buf, opts) : localWrite(safePath(rel), buf, opts));

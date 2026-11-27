// Admin panel client.
//
// With the chapter's backend connected (src/lib/liveApi.js, the default), sign-in, events,
// projects and Insight Series stories go to that backend, the same database the website reads,
// and images are uploaded to Cloudinary. Two things the backend has no place for stay in this
// repository's content/ files, saved through this site's own API (/api, server/): each event's
// website-only details (its link name, draft status, type, team sizes, prices…) and the pages'
// content (team, home-page numbers, timeline…). Drafts are never sent to the backend, so nothing
// half-written appears anywhere until it is published.
//
// With VITE_LIVE_API=off, everything is saved to the content/ files as before.
import { API_BASE } from "./apiBase";
import { CLOUDINARY, LIVE } from "./liveApi";

export { API_BASE, LIVE };

const TOKEN_KEY = "acm_admin_token";
const USER_KEY = "acm_admin_user";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getToken());

/** Master admins manage projects and accounts; coordinators manage events and stories. */
export const isMaster = () => !LIVE || getStoredUser()?.role === "master";

export function setSession(token, user) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* storage unavailable */
  }
}

const networkError = () => {
  const err = new Error("Cannot reach the server. Check your connection and try again.");
  err.code = "NETWORK_ERROR";
  return err;
};

/** This site's own API (content files, uploads when no backend is connected). */
async function send(path, { method = "GET", body, form, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  let res;
  try {
    res = await fetch(API_BASE + path, { method, headers, body: form || (body !== undefined ? JSON.stringify(body) : undefined) });
  } catch {
    throw networkError();
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json?.error?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = json?.error?.code;
    err.details = json?.error?.details;
    if (res.status === 401 && auth) clearSession();
    throw err;
  }
  return json;
}

/** The chapter's backend. A free Render service can take up to a minute to wake up. */
async function live(path, { method = "GET", body, form, auth = true } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90000);
  let res;
  try {
    res = await fetch(LIVE + path, { method, headers, body: form || (body !== undefined ? JSON.stringify(body) : undefined), signal: ctrl.signal });
  } catch {
    throw networkError();
  } finally {
    clearTimeout(timer);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = json?.detail;
    const text = Array.isArray(detail) ? detail.map((d) => `${(d.loc || []).slice(1).join(".")}: ${d.msg}`).join("; ") : typeof detail === "string" ? detail : "";
    const err = new Error(
      res.status === 403
        ? "Only a master admin account can do this."
        : res.status === 401 && auth
          ? "Your session has ended. Please sign in again."
          : text || `The backend refused the request (${res.status}).`
    );
    err.status = res.status;
    if (res.status === 401 && auth) clearSession();
    throw err;
  }
  return json;
}

async function liveAll(path) {
  const all = [];
  for (let skip = 0; skip < 5000; skip += 100) {
    const page = await live(`${path}${path.includes("?") ? "&" : "?"}limit=100&skip=${skip}`);
    all.push(...page);
    if (page.length < 100) break;
  }
  return all;
}

// ---------------------------------------------------------------- content files

const versions = {}; // name -> { data, sha } as last loaded or saved
let lastStorage = null; // "github" | "local" | "backend", from the last save

/** What happens next after a save, for the confirmation message. */
export const publishNote = () =>
  lastStorage === "backend"
    ? "It's live on the website now."
    : lastStorage === "local"
      ? "Changes saved."
      : "Publishing now: live on the website in about a minute.";

/** The latest saved version of a content file: { data, sha }. */
export async function loadContent(name) {
  const res = await send(`/admin/content/${name}`);
  versions[name] = { data: res.data, sha: res.sha };
  return versions[name];
}

/** Saves a whole content file. Throws err.code === "CONTENT_CONFLICT" if someone saved first. */
export async function saveContent(name, data, sha = versions[name]?.sha) {
  const res = await send(`/admin/content/${name}`, { method: "PUT", body: { data, sha } });
  versions[name] = { data: res.data, sha: res.sha };
  lastStorage = res.storage;
  return { ...versions[name], storage: res.storage };
}

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`);

/** List-style files (projects, insights) without a backend: change one entry, save the list. */
function collection(name, { make }) {
  const current = async () => versions[name] || loadContent(name);
  const idOf = (x) => x._id || x.id;
  return {
    list: async () => ({ data: (await loadContent(name)).data }),
    create: async (input) => {
      const { data, sha } = await current();
      const record = make(input);
      await saveContent(name, [record, ...data], sha);
      return { data: record };
    },
    update: async (id, patch) => {
      const { data, sha } = await current();
      const i = data.findIndex((x) => idOf(x) === id);
      if (i === -1) throw new Error("That entry no longer exists. Reload the page.");
      const next = [...data];
      next[i] = { ...data[i], ...patch, _id: idOf(data[i]) };
      await saveContent(name, next, sha);
      return { data: next[i] };
    },
    remove: async (id) => {
      const { data, sha } = await current();
      await saveContent(name, data.filter((x) => idOf(x) !== id), sha);
      return { data: { _id: id } };
    },
  };
}

const INSIGHT_DEFAULTS = { title: "Insight Series", bgColor: "rgba(125, 212, 238, 0.15)", borderColor: "#7dd4ee", size: "regular" };

const localProjects = collection("projects", {
  make: (d) => ({ _id: newId(), status: "APPROVED", categories: [], techStack: [], ...d, submission_date: new Date().toISOString() }),
});
const localInsights = collection("insights", {
  make: (d) => ({ _id: newId(), ...INSIGHT_DEFAULTS, ...d, year: String(d.year ?? "") }),
});

// ---------------------------------------------------------------- backend: projects, insights

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));
const PROJECT_FIELDS = ["title", "description", "author", "githubUrl", "imageUrl", "categories", "techStack", "status"];
const INSIGHT_FIELDS = ["personName", "description", "image", "insta_link", "title", "bgColor", "borderColor", "size"];

const liveProjects = {
  // All projects, pending ones included (master admins only).
  list: async () => ({ data: await liveAll("/projects/") }),
  create: async (input) => ({ data: await live("/projects/", { method: "POST", body: { categories: [], techStack: [], ...pick(input, PROJECT_FIELDS), status: input.status || "APPROVED" } }) }),
  // The backend replaces a project with what it's sent, so send all of it.
  update: async (id, patch) => {
    const all = await liveAll("/projects/");
    const current = all.find((p) => p._id === id);
    if (!current) throw new Error("That project no longer exists. Reload the page.");
    const body = pick({ ...current, ...patch }, PROJECT_FIELDS);
    await live(`/projects/${id}`, { method: "PATCH", body });
    return { data: { ...current, ...body } };
  },
  remove: async (id) => {
    await live(`/projects/${id}`, { method: "DELETE" });
    return { data: { _id: id } };
  },
};

// The backend's API can't set a story's batch year, so the year is kept in content/insights.json
// (with a copy of the story) and the website uses it over the backend's.
async function keepYear(record) {
  try {
    const { data, sha } = await loadContent("insights");
    const rest = data.filter((x) => x._id !== record._id);
    await saveContent("insights", record.deleted ? rest : [{ ...data.find((x) => x._id === record._id), ...record }, ...rest], sha);
  } catch (err) {
    const warn = new Error(`Saved to the website, but the batch year wasn't: ${err.message}`);
    warn.partial = true;
    throw warn;
  }
}
const liveInsights = {
  list: async () => {
    const [remote, file] = await Promise.all([liveAll("/insights/"), loadContent("insights").catch(() => ({ data: [] }))]);
    const years = new Map(file.data.map((x) => [x._id, x.year]));
    return { data: remote.map((x) => (years.get(x._id) ? { ...x, year: years.get(x._id) } : x)) };
  },
  create: async (input) => {
    const created = await live("/insights/", { method: "POST", body: { ...INSIGHT_DEFAULTS, ...pick(input, INSIGHT_FIELDS) } });
    const record = { ...created, year: String(input.year ?? "") };
    lastStorage = "backend";
    await keepYear(record);
    return { data: record };
  },
  update: async (id, patch) => {
    const updated = await live(`/insights/${id}`, { method: "PATCH", body: pick(patch, INSIGHT_FIELDS) });
    const record = { ...updated, ...pick(patch, INSIGHT_FIELDS), _id: id, ...(patch.year !== undefined ? { year: String(patch.year) } : {}) };
    lastStorage = "backend";
    await keepYear(record);
    return { data: record };
  },
  remove: async (id) => {
    await live(`/insights/${id}`, { method: "DELETE" });
    lastStorage = "backend";
    await keepYear({ _id: id, deleted: true }).catch(() => {});
    return { data: { _id: id } };
  },
};

const withNote = (fn) => async (...args) => {
  const out = await fn(...args);
  if (LIVE) lastStorage = "backend";
  return out;
};

// ---------------------------------------------------------------- backend: events

// What the backend stores for an event; everything else is website-only.
const EVENT_FIELDS = ["title", "description", "fullDescription", "date", "image", "gallery", "location", "outcomes", "attendees", "registration_link", "is_featured"];
const pad = (n) => String(n).padStart(2, "0");
/** The backend takes the day as DD-MM-YYYY (and keeps no time). */
const dayOf = (iso) => {
  const d = new Date(iso);
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
};
const toBackend = (e) => ({
  title: e.title,
  description: e.description,
  fullDescription: e.fullDescription || e.description,
  date_str: dayOf(e.date),
  image: e.image || null,
  gallery: e.gallery || [],
  location: e.location || "",
  outcomes: Array.isArray(e.outcomes) ? e.outcomes.join("\n") || null : e.outcomes || null,
  attendees: Number(e.attendees) || 0,
  registration_link: e.registration_link || null,
  is_featured: Boolean(e.is_featured),
});
const sameDay = (a, b) => a && b && dayOf(a) === dayOf(b);
const backendChanged = (a, b) =>
  EVENT_FIELDS.some((k) => (k === "date" ? !sameDay(a.date, b.date) : JSON.stringify(toBackend(a)[k] ?? null) !== JSON.stringify(toBackend(b)[k] ?? null)));
// Website-only details as stored in content/events.json, next to a copy of the backend's fields
// (which keeps the website working from its bundled copy if the backend is ever down).
const SITE_KEYS = ["slug", "status", "endDate", "type", "teamMin", "teamMax", "memberPrice", "nonMemberPrice", "acmExclusive", "capacity", "is_team_event", "registration_open", "registration_limit"];
const siteChanged = (a, b) => SITE_KEYS.some((k) => JSON.stringify(a?.[k] ?? null) !== JSON.stringify(b?.[k] ?? null)) || a?.date !== b?.date;

/**
 * Events as the admin panel edits them: the backend's events with their website-only details,
 * plus drafts. Resolves to { data, sha } like loadContent().
 */
async function loadEvents() {
  if (!LIVE) return loadContent("events");
  const [remote, file] = await Promise.all([liveAll("/events/"), loadContent("events")]);
  const local = new Map(file.data.map((e) => [e._id, e]));
  const ids = new Set(remote.map((e) => e._id));
  const merged = remote.map((r) => {
    const l = local.get(r._id) || {};
    const out = { ...l, ...r, status: "published" };
    if (l.date && sameDay(l.date, r.date)) out.date = l.date;
    return out;
  });
  // Drafts exist only here. Published entries the backend no longer has were deleted there.
  const drafts = file.data.filter((e) => e.status === "draft" && !ids.has(e._id));
  return { data: [...drafts, ...merged], sha: file.sha };
}

/**
 * Saves a change to the event list (one event added, edited, (un)published or deleted at a time).
 * The backend is updated first for published events; content/events.json keeps website-only
 * details and drafts. Unpublishing saves the draft here before removing it from the backend, so
 * nothing is lost if either step fails.
 */
async function saveEvents(prev, next, sha) {
  if (!LIVE) {
    const res = await saveContent("events", next, sha);
    return res;
  }
  const before = new Map(prev.map((e) => [e._id, e]));
  const after = new Map(next.map((e) => [e._id, e]));
  const out = [];
  let fileNeeded = false;
  const removals = [];

  for (const e of next) {
    const old = before.get(e._id);
    const wasLive = old && old.status !== "draft";
    const isLive = e.status !== "draft";
    let record = e;
    if (isLive && !wasLive) {
      // Newly published: the backend gives it its id.
      const created = await live("/events/", { method: "POST", body: toBackend(e) });
      record = { ...e, _id: created._id };
      fileNeeded = true;
    } else if (isLive && backendChanged(old, e)) {
      await live(`/events/${e._id}`, { method: "PATCH", body: toBackend(e) });
    } else if (!isLive && wasLive) {
      removals.push(e._id);
      fileNeeded = true;
    }
    // Drafts live only in the file; published events need it when their website-only details change.
    if (!isLive ? !old || JSON.stringify(old) !== JSON.stringify(e) : !old || siteChanged(old, record)) fileNeeded = true;
    out.push(record);
  }
  for (const old of prev) if (!after.has(old._id)) {
    if (old.status !== "draft") removals.push(old._id);
    fileNeeded = true;
  }

  const remove = async () => {
    for (const id of removals) await live(`/events/${id}`, { method: "DELETE" }).catch((err) => {
      if (err.status !== 404) throw err;
    });
  };
  const unpublishing = removals.some((id) => after.has(id));
  if (unpublishing) {
    // Keep the draft safe first.
    const res = await saveContent("events", out, sha);
    await remove();
    lastStorage = "backend";
    return { data: out, sha: res.sha };
  }
  await remove();
  lastStorage = "backend";
  if (!fileNeeded) return { data: out, sha };
  try {
    const res = await saveContent("events", out, sha);
    lastStorage = "backend";
    return { data: out, sha: res.sha };
  } catch (err) {
    const warn = new Error(
      `Saved to the website, but its link name and other website-only details weren't: ${err.message}`
    );
    warn.partial = true;
    warn.data = out;
    throw warn;
  }
}

// ---------------------------------------------------------------- images

/** A just-uploaded image is served by the API until the redeploy publishes it under /img/uploads/. */
export const previewSrc = (src) => {
  const m = /^\/img\/uploads\/([a-z0-9]{16}\.webp)$/.exec(src || "");
  return m ? `${API_BASE}/uploads/${m[1]}` : src;
};

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

async function uploadToCloudinary(file) {
  if (!ALLOWED.includes(file.type)) throw new Error("Use a PNG, JPEG, WebP or GIF image.");
  if (file.size > 10 * 1024 * 1024) throw new Error("That image is over 10 MB. Use a smaller one.");
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY.preset);
  let res;
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloud}/image/upload`, { method: "POST", body: form });
  } catch {
    throw networkError();
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.secure_url) throw new Error(json?.error?.message || "The image couldn't be uploaded.");
  return { path: json.secure_url, width: json.width, height: json.height };
}

// ---------------------------------------------------------------- accounts (backend)

const usernameFrom = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).sub || "";
  } catch {
    return "";
  }
};

async function liveLogin(username, password) {
  const form = new URLSearchParams({ username, password });
  let res;
  try {
    res = await fetch(`${LIVE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
  } catch {
    throw networkError();
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(
      res.status === 400
        ? "Wrong username or password."
        : typeof json?.detail === "string"
          ? json.detail
          : `Sign-in failed (${res.status}). The server may be waking up; try again in a minute.`
    );
  }
  const token = json.access_token;
  // Only master admins may list all projects, so that answers which kind of account this is.
  const probe = await fetch(`${LIVE}/projects/?limit=1`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
  const role = probe?.ok ? "master" : "coordinator";
  const name = usernameFrom(token) || username;
  return { data: { token, user: { name, username: name, role } } };
}

export const adminApi = {
  login: (username, password) => (LIVE ? liveLogin(username, password) : send("/auth/login", { method: "POST", body: { username, password }, auth: false })),
  me: () => (LIVE ? Promise.resolve({ data: getStoredUser() }) : send("/auth/me")),
  status: () => send("/admin/status"),

  /** Uploads an image; resolves to { path, width, height }. */
  uploadImage: async (file) => {
    if (LIVE) return uploadToCloudinary(file);
    const form = new FormData();
    form.append("image", file);
    return (await send("/admin/uploads", { method: "POST", form })).data;
  },

  loadEvents,
  saveEvents,

  listProjects: LIVE ? liveProjects.list : localProjects.list,
  createProject: withNote(LIVE ? liveProjects.create : localProjects.create),
  updateProject: withNote(LIVE ? liveProjects.update : localProjects.update),
  deleteProject: withNote(LIVE ? liveProjects.remove : localProjects.remove),

  listInsights: LIVE ? liveInsights.list : localInsights.list,
  createInsight: withNote(LIVE ? liveInsights.create : localInsights.create),
  updateInsight: withNote(LIVE ? liveInsights.update : localInsights.update),
  deleteInsight: withNote(LIVE ? liveInsights.remove : localInsights.remove),

  // Asking for an account or a password reset (anyone; a master admin then approves it).
  requestAccess: ({ username, email, password }) => live("/auth/register", { method: "POST", body: { username, email, password }, auth: false }),
  requestReset: (username) => live(`/auth/request-reset?username=${encodeURIComponent(username)}`, { method: "POST", auth: false }),

  // Accounts (master admins; backend only).
  pendingUsers: () => live("/auth/pending"),
  approveUser: (id) => live(`/auth/${id}/approve`, { method: "PATCH" }),
  resetRequests: () => live("/auth/reset-requests"),
  resetPassword: (userId, newPassword) => live("/auth/approve-reset", { method: "POST", body: { user_id: userId, new_password: newPassword } }),
};

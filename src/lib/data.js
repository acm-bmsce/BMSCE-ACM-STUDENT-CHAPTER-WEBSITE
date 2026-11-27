import { useSyncExternalStore } from "react";
import { withSlugs } from "./eventLinks";
import eventsContent from "../../content/events.json";
import projectsContent from "../../content/projects.json";
import insightsContent from "../../content/insights.json";
import overrides from "../../content/live-overrides.json";
import { LIVE } from "./liveApi";

// Events, projects and insights come from the chapter's backend (src/lib/liveApi.js), which the
// admin panel also writes to. Pages render at once from the copy bundled in content/, then switch
// to the live data when it arrives; if the backend is asleep or down, the bundled copy stays.

/** Resize / convert Cloudinary assets on the fly (PDF posters become JPGs). */
export function cdn(url, width = 900) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const out = url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
  return out.replace(/\.pdf$/i, ".jpg");
}

// Text from the database is shown as typed, except that an em dash reads as a comma.
const clean = (s) => (typeof s === "string" ? s.replace(/\s*\u2014\s*/g, ", ").trim() : "");

const num = (v) => (v === "" || v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v));

export function normalizeEvent(e) {
  const date = e.date ? new Date(e.date) : null;
  const outcomes = Array.isArray(e.outcomes) ? e.outcomes : clean(e.outcomes) ? [clean(e.outcomes)] : [];
  return {
    id: e._id,
    slug: clean(e.slug),
    status: e.status === "draft" ? "draft" : "published",
    endDate: e.endDate ? new Date(e.endDate) : null,
    type: clean(e.type),
    teamMin: num(e.teamMin),
    teamMax: num(e.teamMax),
    memberPrice: num(e.memberPrice),
    nonMemberPrice: num(e.nonMemberPrice),
    acmExclusive: !!e.acmExclusive,
    capacity: num(e.capacity),
    title: clean(e.title),
    date,
    year: date ? date.getFullYear() : null,
    image: e.image,
    description: clean(e.description),
    fullDescription: clean(e.fullDescription) || clean(e.description),
    outcomes: outcomes.filter(Boolean),
    gallery: (e.gallery || []).filter(Boolean),
    location: clean(e.location),
    attendees: e.attendees || null,
    registrationLink: clean(e.registration_link),
    featured: !!e.is_featured,
    teamEvent: !!e.is_team_event,
  };
}

export function normalizeProject(p) {
  return {
    id: p._id,
    title: clean(p.title),
    description: clean(p.description),
    author: clean(p.author),
    github: p.githubUrl,
    image: p.imageUrl,
    categories: p.categories || [],
    stack: p.techStack || [],
  };
}

export function normalizeInsight(i) {
  const [role, ...company] = clean(i.description).split(",");
  return {
    id: i._id,
    name: clean(i.personName),
    role: clean(role),
    company: clean(company.join(",")),
    image: i.image,
    link: i.insta_link,
    year: clean(String(i.year || "")),
    order: typeof i.order === "number" ? i.order : 999,
  };
}

const byDateDesc = (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
const byOrderAsc = (a, b) => (a.order ?? 999) - (b.order ?? 999);

// An Instagram post code is the post's numeric id in base64, and ids grow over time, so the
// code alone orders stories from newest to oldest. Stories without a post link keep `order`.
const IG = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const igId = (link) => {
  const code = String(link || "").match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/)?.[1];
  if (!code) return null;
  let n = 0n;
  for (const ch of code) n = n * 64n + BigInt(IG.indexOf(ch));
  return n;
};
const newestFirst = (a, b) => {
  const x = igId(a.link);
  const y = igId(b.link);
  if (x !== null && y !== null && x !== y) return x > y ? -1 : 1;
  if ((x === null) !== (y === null)) return x === null ? 1 : -1;
  return byOrderAsc(a, b);
};

/* ---------------------------------------------------------------- shaping */

// Fields only this site keeps (the shareable slug, draft status, team sizes…) come from the
// bundled copy; everything else comes from the backend. The backend stores dates without a time,
// so a start time kept here for the same day is used.
const SITE_ONLY = ["slug", "status", "endDate", "type", "teamMin", "teamMax", "memberPrice", "nonMemberPrice", "acmExclusive", "capacity", "is_team_event", "registration_open", "registration_limit"];
const hidden = new Set(overrides.hideImages || []);
const fileName = (src) => String(src).split("/").pop().replace(/\.[a-z0-9]+$/i, "");
const patch = (e) => {
  const out = { ...e, ...(overrides.events?.[e._id] || {}) };
  if (Array.isArray(out.gallery)) out.gallery = out.gallery.filter((src) => !hidden.has(fileName(src)));
  return out;
};
function mergeEvents(live) {
  const local = new Map(eventsContent.map((e) => [e._id, e]));
  const merged = live.map((e) => {
    const l = local.get(e._id) || {};
    const keep = Object.fromEntries(SITE_ONLY.filter((k) => l[k] !== undefined).map((k) => [k, l[k]]));
    if (l.date && sameDay(l.date, e.date)) keep.date = l.date;
    return { ...e, ...keep };
  });
  // The backend is the record: something deleted there is gone here too, whatever the bundled
  // copy says. Drafts live only in the bundled copy and are never shown.
  return merged;
}
const sameDay = (a, b) => {
  const x = new Date(a);
  const y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
};
const shapeEvents = (raw) => withSlugs(raw.map(patch).map(normalizeEvent).filter((e) => e.status === "published").sort(byDateDesc));
// Hidden (not "APPROVED") projects are kept for the admin but are not shown.
const shapeProjects = (raw) => raw.filter((p) => (p.status || "APPROVED") === "APPROVED").map(normalizeProject);
const shapeInsights = (raw) => raw.map(normalizeInsight).sort(newestFirst);

// A story's batch year can't be set through the backend's API; the admin panel keeps it here.
const YEARS = new Map(insightsContent.filter((x) => x.year).map((x) => [x._id, String(x.year)]));
const withYears = (list) => list.map((x) => (YEARS.has(x._id) ? { ...x, year: YEARS.get(x._id) } : x));

/* ---------------------------------------------------------------- live store */

const state = {
  events: shapeEvents(eventsContent),
  projects: shapeProjects(projectsContent),
  insights: shapeInsights(insightsContent),
};
const listeners = new Set();
const set = (key, value) => {
  state[key] = value;
  listeners.forEach((fn) => fn());
};
const subscribe = (fn) => {
  listeners.add(fn);
  start();
  return () => listeners.delete(fn);
};

async function getJSON(path, signal) {
  const res = await fetch(`${LIVE}${path}`, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error(`not a list: ${path}`);
  return data;
}
// The API returns at most 100 items a call.
async function getAll(path, signal) {
  const all = [];
  for (let skip = 0; skip < 5000; skip += 100) {
    const page = await getJSON(`${path}${path.includes("?") ? "&" : "?"}limit=100&skip=${skip}`, signal);
    all.push(...page);
    if (page.length < 100) break;
  }
  return all;
}

// The last live copy is kept for an hour, so a return visit shows it straight away.
const CACHE = "acm-live-v1";
const readCache = () => {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE) || "null");
    return c && Date.now() - c.at < 3600e3 ? c : null;
  } catch {
    return null;
  }
};
const writeCache = (c) => {
  try {
    localStorage.setItem(CACHE, JSON.stringify({ ...c, at: Date.now() }));
  } catch {
    /* storage full or blocked: fine */
  }
};

let started = false;
function start() {
  if (started || !LIVE || typeof window === "undefined") return;
  started = true;
  const cached = readCache();
  if (cached) apply(cached);
  // A free Render service can take up to a minute to wake; give it that long.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 75000);
  const got = {};
  const jobs = [
    getAll("/events/", ctrl.signal).then((d) => (got.events = d)),
    getJSON("/projects/showcase?limit=100", ctrl.signal).then((d) => (got.projects = d)),
    getAll("/insights/", ctrl.signal).then((d) => (got.insights = d)),
  ].map((p) => p.then(() => apply(got)).catch(() => {}));
  Promise.all(jobs).then(() => {
    clearTimeout(timer);
    if (Object.keys(got).length) writeCache({ ...(cached || {}), ...got });
  });
}
function apply(c) {
  // An empty answer never wipes out what the bundled copy already shows.
  if (c.events?.length) set("events", shapeEvents(mergeEvents(c.events)));
  if (c.projects?.length) set("projects", shapeProjects(c.projects));
  if (c.insights?.length) set("insights", shapeInsights(withYears(c.insights)));
}

const use = (key) => useSyncExternalStore(subscribe, () => state[key], () => state[key]);
export const useEvents = () => use("events");
export const useProjects = () => use("projects");
export const useInsights = () => use("insights");

export function formatDate(d, opts = { day: "2-digit", month: "short", year: "numeric" }) {
  return d ? d.toLocaleDateString("en-IN", opts) : "";
}

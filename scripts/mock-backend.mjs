// A stand-in for the chapter's backend (github.com/acm-bmsce/WEBSITE-BACKEND), for tests only, so
// they never write to the real database. It copies that backend's routes and its quirks: dates are
// sent as DD-MM-YYYY, a project PATCH must carry title, description and author, a new Insight's
// year always starts as "Alumni", only "master" accounts may manage projects and accounts, and
// event and insight writes need no sign-in at all.
//
//   node scripts/mock-backend.mjs [port]        (seeded from content/*.json)
//   import { startMockBackend } from "./mock-backend.mjs"
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, "content", `${name}.json`), "utf8"));
const oid = () => crypto.randomBytes(12).toString("hex");
const SECRET = crypto.randomBytes(32);
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const sign = (sub) => {
  const head = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub, exp: Math.floor(Date.now() / 1000) + 3600 })}`;
  return `${head}.${crypto.createHmac("sha256", SECRET).update(head).digest("base64url")}`;
};
const subjectOf = (token) => {
  const [h, p, s] = String(token).split(".");
  if (!s || crypto.createHmac("sha256", SECRET).update(`${h}.${p}`).digest("base64url") !== s) return null;
  return JSON.parse(Buffer.from(p, "base64url").toString()).sub;
};

const hidePassword = (u) => {
  const out = { ...u };
  delete out.password;
  return out;
};

export function startMockBackend({ port = 5056, users = [] } = {}) {
  const db = {
    events: read("events").map(({ _id, title, description, date, image, fullDescription, outcomes, gallery, location, attendees, registration_link, is_featured }) => ({
      _id, title, description, date: String(date).slice(0, 19), image: image ?? null, fullDescription: fullDescription || description, outcomes: Array.isArray(outcomes) ? outcomes.join("\n") : outcomes ?? null,
      gallery: gallery || [], location: location || "", attendees: Number(attendees) || 0, registration_link: registration_link ?? null, is_featured: !!is_featured,
    })),
    projects: read("projects").map((p) => ({ ...p })),
    insights: read("insights").map((i) => { const x = { ...i }; delete x.order; return x; }),
    users: users.map((u) => ({ _id: oid(), reset_requested: false, is_approved: true, role: "coordinator", ...u })),
  };
  const log = [];

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const send = (status, body) => {
      res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": req.headers.origin || "*", "Access-Control-Allow-Credentials": "true" });
      res.end(JSON.stringify(body));
    };
    if (req.method === "OPTIONS") {
      res.writeHead(200, { "Access-Control-Allow-Origin": req.headers.origin || "*", "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS", "Access-Control-Allow-Headers": req.headers["access-control-request-headers"] || "*", "Access-Control-Allow-Credentials": "true" });
      return res.end();
    }
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const body = (() => {
      if ((req.headers["content-type"] || "").includes("x-www-form-urlencoded")) return Object.fromEntries(new URLSearchParams(raw));
      try {
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();
    const p = url.pathname;
    const m = req.method;
    log.push(`${m} ${p}`);
    const limit = Math.min(Number(url.searchParams.get("limit") || 20), 100);
    const skip = Number(url.searchParams.get("skip") || 0);
    const page = (list) => list.slice(skip, skip + limit);
    const user = () => {
      const token = (req.headers.authorization || "").replace(/^Bearer /, "");
      const sub = token && subjectOf(token);
      return sub ? db.users.find((u) => u.username === sub) || null : null;
    };
    const master = () => {
      const u = user();
      if (!u) return send(401, { detail: "Could not validate credentials" }), null;
      if (u.role !== "master") return send(403, { detail: "Not authorized. Master Admin role required." }), null;
      return u;
    };
    const parseDay = (s) => {
      const mm = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s || "");
      return mm ? `${mm[3]}-${mm[2]}-${mm[1]}T00:00:00` : null;
    };
    const missing = (obj, keys) => keys.filter((k) => obj[k] === undefined || obj[k] === null);

    // ---- auth
    if (p === "/auth/login" && m === "POST") {
      const u = db.users.find((x) => x.username === body.username);
      if (!u || u.password !== body.password) return send(400, { detail: "Incorrect username or password" });
      if (u.role !== "master" && !u.is_approved) return send(401, { detail: "Account pending approval by Master Admin." });
      return send(200, { access_token: sign(u.username), token_type: "bearer" });
    }
    if (p === "/auth/register" && m === "POST") {
      const miss = missing(body, ["username", "email", "password"]);
      if (miss.length) return send(422, { detail: miss.map((k) => ({ loc: ["body", k], msg: "Field required" })) });
      if (db.users.some((x) => x.username === body.username)) return send(400, { detail: "Username already registered" });
      if (db.users.some((x) => x.email === body.email)) return send(400, { detail: "Email already registered" });
      const u = { _id: oid(), username: body.username, email: body.email, password: body.password, role: "coordinator", is_approved: false, reset_requested: false };
      db.users.push(u);
      return send(200, hidePassword(u));
    }
    if (p === "/auth/request-reset" && m === "POST") {
      const u = db.users.find((x) => x.username === url.searchParams.get("username"));
      if (u) u.reset_requested = true;
      return send(200, { message: "Request sent to Master Admin." });
    }
    if (p === "/auth/pending" && m === "GET") return master() && send(200, db.users.filter((u) => !u.is_approved).map(hidePassword));
    if (p === "/auth/reset-requests" && m === "GET") return master() && send(200, db.users.filter((u) => u.reset_requested).map(hidePassword));
    let mm = /^\/auth\/([^/]+)\/approve$/.exec(p);
    if (mm && m === "PATCH") {
      if (!master()) return;
      const u = db.users.find((x) => x._id === mm[1]);
      if (!u) return send(404, { detail: "User not found" });
      u.is_approved = true;
      return send(200, { message: `User ${u.username} approved.` });
    }
    if (p === "/auth/approve-reset" && m === "POST") {
      if (!master()) return;
      const u = db.users.find((x) => x._id === body.user_id);
      if (!u) return send(404, { detail: "User not found" });
      u.password = body.new_password;
      u.reset_requested = false;
      return send(200, { message: "Password reset successfully." });
    }

    // ---- events (no sign-in needed, as on the real backend)
    if (p === "/events/" && m === "GET") return send(200, page([...db.events].sort((a, b) => b.date.localeCompare(a.date))));
    if (p === "/events/" && m === "POST") {
      const miss = missing(body, ["title", "description", "date_str", "fullDescription", "location"]);
      if (miss.length) return send(422, { detail: miss.map((k) => ({ loc: ["body", k], msg: "Field required" })) });
      const date = parseDay(body.date_str);
      if (!date) return send(400, { detail: "Invalid date format. Use DD-MM-YYYY" });
      const rest = { ...body };
      delete rest.date_str;
      const e = { image: null, outcomes: null, gallery: [], attendees: 0, registration_link: null, is_featured: false, ...rest, date, _id: oid() };
      db.events.push(e);
      return send(200, e);
    }
    mm = /^\/events\/([^/]+)$/.exec(p);
    if (mm && (m === "PATCH" || m === "DELETE")) {
      const e = db.events.find((x) => x._id === mm[1]);
      if (!e) return send(404, { detail: "Event not found" });
      if (m === "DELETE") {
        db.events = db.events.filter((x) => x !== e);
        return send(200, { message: "Event deleted successfully" });
      }
      const { date_str, ...rest } = body;
      if (date_str !== undefined) {
        const date = parseDay(date_str);
        if (!date) return send(400, { detail: "Invalid date format. Use DD-MM-YYYY" });
        e.date = date;
      }
      Object.assign(e, rest);
      return send(200, e);
    }

    // ---- projects
    if (p === "/projects/showcase" && m === "GET") return send(200, page(db.projects.filter((x) => x.status === "APPROVED")));
    if (p === "/projects/" && m === "GET") return master() && send(200, page(db.projects));
    if (p === "/projects/" && m === "POST") {
      const miss = missing(body, ["title", "description", "author"]);
      if (miss.length) return send(422, { detail: miss.map((k) => ({ loc: ["body", k], msg: "Field required" })) });
      const x = { githubUrl: null, imageUrl: null, categories: [], techStack: [], ...body, status: body.status || "PENDING", _id: oid(), submission_date: new Date().toISOString() };
      db.projects.unshift(x);
      return send(200, x);
    }
    mm = /^\/projects\/([^/]+)$/.exec(p);
    if (mm && (m === "PATCH" || m === "DELETE")) {
      if (!master()) return;
      const x = db.projects.find((y) => y._id === mm[1]);
      if (!x) return send(404, { detail: "Project not found" });
      if (m === "DELETE") {
        db.projects = db.projects.filter((y) => y !== x);
        return send(200, { message: "Project deleted successfully" });
      }
      const miss = missing(body, ["title", "description", "author"]);
      if (miss.length) return send(422, { detail: miss.map((k) => ({ loc: ["body", k], msg: "Field required" })) });
      const before = { ...x };
      Object.assign(x, body);
      return send(200, before); // the real backend answers with the project as it was
    }

    // ---- insights (no sign-in needed, as on the real backend)
    if (p === "/insights/" && m === "GET") return send(200, page(db.insights));
    if (p === "/insights/" && m === "POST") {
      const miss = missing(body, ["personName", "description"]);
      if (miss.length) return send(422, { detail: miss.map((k) => ({ loc: ["body", k], msg: "Field required" })) });
      // Only these are stored; title, borderColor, size and year take their defaults.
      const x = { _id: oid(), personName: body.personName, description: body.description, image: body.image ?? null, insta_link: body.insta_link ?? null, bgColor: body.bgColor ?? "rgba(125, 212, 238, 0.15)", title: "Insight Series", borderColor: "#7dd4ee", size: "regular", year: "Alumni" };
      db.insights.push(x);
      return send(200, x);
    }
    mm = /^\/insights\/([^/]+)$/.exec(p);
    if (mm && (m === "PATCH" || m === "DELETE")) {
      const x = db.insights.find((y) => y._id === mm[1]);
      if (!x) return send(404, { detail: "Insight not found" });
      if (m === "DELETE") {
        db.insights = db.insights.filter((y) => y !== x);
        return send(200, { message: "Deleted successfully" });
      }
      const allowed = ["personName", "description", "image", "insta_link", "title", "bgColor", "borderColor", "size"];
      for (const k of allowed) if (body[k] !== undefined && body[k] !== null) x[k] = body[k];
      return send(200, x);
    }
    if (p === "/ping") return send(200, { status: "alive" });
    send(404, { detail: "Not Found" });
  });

  return new Promise((resolve) =>
    server.listen(port, () => resolve({ db, log, url: `http://localhost:${server.address().port}`, close: () => new Promise((r) => server.close(r)) }))
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const port = Number(process.argv[2]) || 5056;
  await startMockBackend({ port, users: [{ username: "master", password: "master-pass", role: "master" }] });
  console.log(`Mock backend on http://localhost:${port} (sign in as master / master-pass)`);
}

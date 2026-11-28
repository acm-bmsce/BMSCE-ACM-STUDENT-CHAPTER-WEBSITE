// The content API as it runs on Cloudflare Pages (functions/api/[[path]].js), with GitHub faked
// and the stand-in backend for sign-ins.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { BACKEND_USERS, backend } from "./setup.js";
import { onRequest, blobSha, backendTokenCache } from "../../functions/api/[[path]].js";

const ROOT = path.resolve(import.meta.dirname, "../..");
const siteBytes = fs.readFileSync(path.join(ROOT, "content/site.json"));
const gitSha = (buf) => crypto.createHash("sha1").update(`blob ${buf.length}\0`).update(buf).digest("hex");

const env = { GITHUB_TOKEN: "test-token", GITHUB_REPO: "acm-bmsce/test-repo", GITHUB_BRANCH: "main", LIVE_API: backend.url };
const call = async (method, route, { token, body, e = env } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await onRequest({ request: new Request(`https://bmsce.acm.org/api${route}`, { method, headers, body: body ? JSON.stringify(body) : undefined }), env: e });
  return { status: res.status, body: await res.json() };
};
const backendToken = async ({ username, password }) => {
  const res = await fetch(`${backend.url}/auth/login`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ username, password }) });
  return (await res.json()).access_token;
};

// Fake GitHub; everything else (the stand-in backend) goes through.
let github;
const realFetch = globalThis.fetch;
beforeEach(() => {
  backendTokenCache.clear();
  github = { calls: [], sha: gitSha(siteBytes), conflict: false };
  vi.stubGlobal("fetch", async (url, init = {}) => {
    const u = String(url);
    if (u.startsWith("https://api.github.com/")) {
      github.calls.push({ url: u, method: init.method || "GET", headers: init.headers, body: init.body ? JSON.parse(init.body) : null });
      if ((init.method || "GET") === "GET") return new Response(JSON.stringify({ content: siteBytes.toString("base64"), sha: github.sha }), { status: 200 });
      if (github.conflict) return new Response(JSON.stringify({ message: "sha does not match" }), { status: 409 });
      return new Response(JSON.stringify({ content: { sha: "b".repeat(40) }, commit: { sha: "c".repeat(40) } }), { status: 200 });
    }
    if (u.startsWith("https://raw.githubusercontent.com/")) {
      github.calls.push({ url: u, method: "GET" });
      return new Response(siteBytes, { status: 200 });
    }
    return realFetch(url, init);
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("Content API on Cloudflare Pages", () => {
  it("reports its setup without needing a sign-in", async () => {
    const res = await call("GET", "/health");
    expect(res.body).toMatchObject({ status: "ok", host: "cloudflare", storage: "github", backend: "connected" });
  });

  it("works out git's file id the same way GitHub does", async () => {
    expect(await blobSha(new Uint8Array(siteBytes))).toBe(gitSha(siteBytes));
  });

  it("refuses requests without a valid backend sign-in", async () => {
    expect((await call("GET", "/admin/content/site")).status).toBe(401);
    expect((await call("GET", "/admin/content/site", { token: "aaa.bbb.ccc" })).status).toBe(401);
  });

  it("lets a master admin read and save a file as a commit", async () => {
    const token = await backendToken(BACKEND_USERS.master);
    const cur = await call("GET", "/admin/content/site", { token });
    expect(cur.status).toBe(200);
    expect(cur.body.sha).toBe(github.sha);
    expect(github.calls[0].url).toBe("https://api.github.com/repos/acm-bmsce/test-repo/contents/content/site.json?ref=main");
    const saved = await call("PUT", "/admin/content/site", { token, body: { data: cur.body.data, sha: cur.body.sha } });
    expect(saved.status).toBe(200);
    const put = github.calls.find((c) => c.method === "PUT");
    expect(put.body).toMatchObject({ sha: github.sha, branch: "main", message: "content: update pages & team (by chief)" });
    expect(JSON.parse(Buffer.from(put.body.content, "base64").toString("utf8"))).toEqual(cur.body.data);
  });

  it("keeps the pages and projects for master admins", async () => {
    const token = await backendToken(BACKEND_USERS.coordinator);
    const cur = await call("GET", "/admin/content/site", { token });
    expect((await call("PUT", "/admin/content/site", { token, body: { data: cur.body.data, sha: cur.body.sha } })).status).toBe(403);
  });

  it("turns a version clash into a clear conflict, and checks the data first", async () => {
    const token = await backendToken(BACKEND_USERS.master);
    const cur = await call("GET", "/admin/content/site", { token });
    github.conflict = true;
    const stale = await call("PUT", "/admin/content/site", { token, body: { data: cur.body.data, sha: cur.body.sha } });
    expect(stale.status).toBe(409);
    expect(stale.body.error.code).toBe("CONTENT_CONFLICT");
    const bad = await call("PUT", "/admin/content/site", { token, body: { data: { ...cur.body.data, stats: "nope" }, sha: cur.body.sha } });
    expect(bad.status).toBe(400);
    expect(bad.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("without GITHUB_TOKEN, still reads (the public copy) but explains saving isn't set up", async () => {
    const e = { ...env, GITHUB_TOKEN: "" };
    const token = await backendToken(BACKEND_USERS.master);
    const cur = await call("GET", "/admin/content/site", { token, e });
    expect(cur.status).toBe(200);
    expect(cur.body.sha).toBe(gitSha(siteBytes));
    const saved = await call("PUT", "/admin/content/site", { token, e, body: { data: cur.body.data, sha: cur.body.sha } });
    expect(saved.status).toBe(503);
    expect(saved.body.error.code).toBe("SAVES_NOT_CONFIGURED");
  });
});

// Runs before every server test file: a throwaway copy of content/ and two known admins, so
// tests never touch the real files and never need real secrets.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import bcrypt from "bcryptjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "acm-content-"));
fs.cpSync(path.resolve(import.meta.dirname, "../../content"), path.join(root, "content"), { recursive: true });

export const ADMINS = { alice: "Alice-test-password-1", bob: "Bob-test-password-22" };

process.env.NODE_ENV = "test";
process.env.CONTENT_ROOT = root;
process.env.JWT_SECRET = "test-only-secret-0123456789abcdef0123456789";
process.env.GITHUB_TOKEN = "";
process.env.ADMIN_USERS = Object.entries(ADMINS)
  .map(([u, p]) => `${u}:${bcrypt.hashSync(p, 4)}`)
  .join(",");

// A stand-in for the chapter's backend (never the real one), for backend sign-ins.
import { startMockBackend } from "../../scripts/mock-backend.mjs";
export const BACKEND_USERS = {
  master: { username: "chief", password: "chief-pass-1", role: "master" },
  coordinator: { username: "helper", password: "helper-pass-1", role: "coordinator" },
};
export const backend = await startMockBackend({ port: 0, users: Object.values(BACKEND_USERS) });
process.env.LIVE_API = backend.url;

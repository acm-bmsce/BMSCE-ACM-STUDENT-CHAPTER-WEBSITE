import { z } from "zod";

// z.string().url() accepts any scheme the URL parser understands, including
// javascript: and data:. Everything we render as a link or image goes through these.
const isHttp = (v) => {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

// A path on this site: one leading slash, never "//host" (protocol-relative).
const isSitePath = (v) => /^\/(?!\/)[^\s]*$/.test(v);

/** An http(s) link. */
export const httpUrl = (message = "Enter a full link starting with https://") =>
  z.string().trim().max(500).refine(isHttp, message);

/** An http(s) link or a path on this site such as /img/photo.webp. */
export const urlOrSitePath = (message = "Use a full https:// link or a site path starting with /") =>
  z
    .string()
    .trim()
    .max(500)
    .refine((v) => isHttp(v) || isSitePath(v), message);

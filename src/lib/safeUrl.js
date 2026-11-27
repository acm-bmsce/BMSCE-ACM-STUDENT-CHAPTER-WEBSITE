// Links that come from data (events, projects, alumni stories, profiles) are rendered
// only if they use a scheme we expect. Anything else (javascript:, data:, vbscript:...)
// becomes undefined, so the element renders as plain text instead of a live link.
const ALLOWED = new Set(["http:", "https:", "mailto:", "tel:"]);

export function safeHref(url) {
  if (typeof url !== "string") return undefined;
  const v = url.trim();
  if (!v) return undefined;
  if (/^\/(?!\/)/.test(v)) return v; // a path on this site
  try {
    return ALLOWED.has(new URL(v).protocol) ? v : undefined;
  } catch {
    return undefined;
  }
}

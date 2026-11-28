/**
 * Every event has its own shareable address: /events/<slug>. The slug is saved with the event
 * in content/events.json; one is made from the title and year if it's missing.
 */
export const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "event";

/** Gives each event a unique slug, keeping slugs saved in content/events.json. */
export function withSlugs(events) {
  const used = new Set(events.filter((e) => e.slug).map((e) => e.slug));
  return events.map((e) => {
    if (e.slug) return e;
    const base = slugify(`${e.title}${e.year ? ` ${e.year}` : ""}`);
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    return { ...e, slug };
  });
}

export const eventPath = (e) => `/events/${encodeURIComponent(e.slug || e.id)}`;
export const eventUrl = (e) => `${window.location.origin}${eventPath(e)}`;

/** The page a path belongs to: an event's own address is still the Events page. */
export const pageOf = (pathname) => (/^\/events\/[^/]+\/?$/.test(pathname) ? "/events" : pathname);

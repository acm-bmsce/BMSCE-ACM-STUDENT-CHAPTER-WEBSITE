// Keeps the page's description, canonical address and link-preview tags right as people move
// between pages (the built HTML already has them for the first page loaded).
import { PAGES, SITE_URL } from "../data/seo";

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector);
  if (el && value) el.setAttribute(attr, value);
};

export function applySeo(pathname, { title, description } = {}) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const page = PAGES[path] || {};
  const desc = description || page.description;
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  setMeta('link[rel="canonical"]', "href", url);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[name="description"]', "content", desc);
  setMeta('meta[property="og:description"]', "content", desc);
  setMeta('meta[name="twitter:description"]', "content", desc);
  const t = title || page.title;
  setMeta('meta[property="og:title"]', "content", t);
  setMeta('meta[name="twitter:title"]', "content", t);
}

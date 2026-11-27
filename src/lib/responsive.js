// srcset for site photos that have resized copies (scripts/responsive-images.py writes them
// to /img/r/ and lists them in data/responsive.json). Unknown images get no srcset.
import manifest from "../data/responsive.json";

/** Spread onto an <img>: {...rs("/img/about.webp", "(max-width: 820px) 100vw, 50vw")} */
export function rs(src, sizes = "(max-width: 820px) 100vw, 50vw") {
  const entry = manifest[src];
  if (!entry) return {};
  const stem = src.replace(/^\/img\//, "").replace(/\.webp$/, "");
  const set = entry.variants.map((w) => `/img/r/${stem}-${w}.webp ${w}w`);
  set.push(`${src} ${entry.w}w`);
  return { srcSet: set.join(", "), sizes };
}

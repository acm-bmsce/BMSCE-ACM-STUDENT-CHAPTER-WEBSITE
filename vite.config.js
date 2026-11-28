import fs from "node:fs";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { PAGES, SITE_NAME, SITE_URL, eventMeta } from "./src/data/seo.js";

const origin = (url) => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};

/**
 * Writes the Content-Security-Policy into the built index.html. It lives here, not in
 * vercel.json, because the API's address is only known at build time (VITE_* env).
 * Directives a <meta> CSP ignores (frame-ancestors) are sent as headers by vercel.json.
 */
function contentSecurityPolicy(env) {
  // Only a cross-origin API needs listing; the default same-origin /api is covered by 'self'.
  // The live backend the public pages read events, projects and insights from (see src/lib/data.js).
  const live = (env.VITE_LIVE_API ?? env.VITE_API_BASE_URL ?? "https://bmsceacmwebsite.onrender.com").trim();
  const connect = [...new Set([env.VITE_API_URL, live === "off" ? "" : live].map(origin).filter(Boolean))];
  const allHttps = connect.every((o) => o.startsWith("https:"));

  const policy = [
    "default-src 'self'",
    // No third-party scripts.
    "script-src 'self'",
    // React style={{}} props need inline styles; no inline scripts are allowed.
    "style-src 'self' 'unsafe-inline'",
    // Admins can use images from any https:// link (Cloudinary, Drive, Instagram CDN…).
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    // With the backend connected, the admin panel uploads images to Cloudinary.
    `connect-src 'self' ${connect.join(" ")}${live === "off" ? "" : " https://api.cloudinary.com"} https://api.web3forms.com`,
    "frame-src 'none'",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(allHttps ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  return {
    name: "acm-csp",
    apply: "build",
    transformIndexHtml: () => [
      { tag: "meta", attrs: { "http-equiv": "Content-Security-Policy", content: policy }, injectTo: "head-prepend" },
    ],
  };
}

// Each inner page's hero photo, preloaded alongside its code (srcset as in PageHero).
const ROUTE_HERO = {
  "/events": "/img/events-collage.webp", "/projects": "/img/technical.webp", "/placements": "/img/internships.webp", "/about": "/img/orient-crowd.webp", "/join": "/img/orient-team.webp",
};
const HERO_SIZES = "(max-width: 820px) 72vw, 34vw";

const heroSrcset = (src) => {
  const manifest = JSON.parse(fs.readFileSync("src/data/responsive.json", "utf8"));
  const entry = manifest[src];
  if (!entry) return null;
  const stem = src.replace(/^\/img\//, "").replace(/\.webp$/, "");
  return [...entry.variants.map((w) => `/img/r/${stem}-${w}.webp ${w}w`), `${src} ${entry.w}w`].join(", ");
};

// Page modules by route, for the route preloader below.
const ROUTE_PAGES = {
  "/about": "About", "/events": "Events", "/team": "Team", "/join": "Join", "/projects": "Projects",
  "/placements": "Placements",
};

/**
 * Pages are code-split, so a visitor landing on /events would otherwise wait for the main
 * bundle to run before the browser even learns which chunk it needs. This emits a tiny
 * external script (CSP-friendly: no inline code) that modulepreloads the current route's
 * chunk and its imports in parallel with the main bundle.
 */
function routePreload() {
  return {
    name: "acm-route-preload",
    apply: "build",
    generateBundle(_, bundle) {
      const byPage = {};
      for (const chunk of Object.values(bundle)) {
        const m = chunk.type === "chunk" && chunk.facadeModuleId?.match(/[\\/]pages[\\/](\w+)\.jsx$/);
        if (m) byPage[m[1]] = ["/" + chunk.fileName, ...chunk.imports.filter((f) => !bundle[f]?.isEntry).map((f) => "/" + f)];
      }
      const map = Object.fromEntries(Object.entries(ROUTE_PAGES).filter(([, page]) => byPage[page]).map(([route, page]) => [route, byPage[page]]));
      const hero = Object.fromEntries(Object.entries(ROUTE_HERO).map(([route, src]) => [route, [src, heroSrcset(src)]]));
      // Plain ES5 string handling (no regex) so nothing needs escaping inside the template.
      const code = `(function(){var m=${JSON.stringify(map)},h=${JSON.stringify(hero)};var p=location.pathname;while(p.length>1&&p.charAt(p.length-1)==="/")p=p.slice(0,-1);var d=document.head,l,i;var img=h[p];if(img){l=document.createElement("link");l.rel="preload";l.as="image";l.href=img[0];if(img[1]){l.setAttribute("imagesrcset",img[1]);l.setAttribute("imagesizes",${JSON.stringify(HERO_SIZES)});}l.setAttribute("fetchpriority","high");d.appendChild(l);}var f=m[p];if(!f)return;for(i=0;i<f.length;i++){l=document.createElement("link");l.rel="modulepreload";l.href=f[i];d.appendChild(l);}})();`;
      this.emitFile({ type: "asset", fileName: "route-preload.js", source: code });
    },
    transformIndexHtml: () => [{ tag: "script", attrs: { src: "/route-preload.js" }, injectTo: "head" }],
  };
}

/**
 * sitemap.xml, written at build time so search engines find every page, including each
 * published event's own page (/events/<slug>) from content/events.json.
 */
function sitemap(siteUrl) {
  const base = siteUrl.replace(/\/+$/, "");
  return {
    name: "acm-sitemap",
    apply: "build",
    generateBundle() {
      const events = JSON.parse(fs.readFileSync("content/events.json", "utf8")).filter((e) => e.status !== "draft" && e.slug);
      const day = (d) => /^\d{4}-\d{2}-\d{2}/.exec(String(d || ""))?.[0] || null; // the date as written, no time-zone shift
      const pages = [
        ["/", "weekly", "1.0"],
        ["/events", "weekly", "0.9"],
        ["/about", "monthly", "0.7"],
        ["/team", "monthly", "0.7"],
        ["/join", "monthly", "0.8"],
        ["/projects", "monthly", "0.6"],
        ["/placements", "monthly", "0.6"],
      ].map(([path, freq, pri]) => `  <url><loc>${base}${path}</loc><changefreq>${freq}</changefreq><priority>${pri}</priority></url>`);
      const eventUrls = events.map((e) => {
        const mod = day(e.date);
        return `  <url><loc>${base}/events/${encodeURIComponent(e.slug)}</loc>${mod ? `<lastmod>${mod}</lastmod>` : ""}<priority>0.5</priority></url>`;
      });
      const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...pages, ...eventUrls, "</urlset>", ""].join("\n");
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: xml });
    },
  };
}

/**
 * Every page and every published event gets its own HTML file with its own title, description,
 * canonical address and link-preview tags (events also get schema.org Event data), so search
 * engines and link previews see the right page without running any JavaScript. The files are
 * copies of index.html with the head changed: /events is events.html, an event is
 * events/<slug>.html (Cloudflare Pages and Vercel's cleanUrls serve them without ".html").
 */
function pageHeads() {
  const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const set = (html, re, value) => html.replace(re, (m, a, b) => `${a}${esc(value)}${b}`);
  const head = (html, { title, description, url, extra = "" }) => {
    let out = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
    out = set(out, /(<meta name="description" content=")[^"]*(")/, description);
    out = set(out, /(<meta property="og:title" content=")[^"]*(")/, title);
    out = set(out, /(<meta property="og:description" content=")[^"]*(")/, description);
    out = set(out, /(<meta property="og:url" content=")[^"]*(")/, url);
    out = set(out, /(<meta name="twitter:title" content=")[^"]*(")/, title);
    out = set(out, /(<meta name="twitter:description" content=")[^"]*(")/, description);
    out = set(out, /(<link rel="canonical" href=")[^"]*(")/, url);
    return extra ? out.replace("</head>", `${extra}\n  </head>`) : out;
  };
  return {
    name: "acm-page-heads",
    apply: "build",
    writeBundle({ dir = "dist" }) {
      const base = fs.readFileSync(`${dir}/index.html`, "utf8");
      for (const [path, meta] of Object.entries(PAGES)) {
        const html = head(base, { ...meta, url: `${SITE_URL}${path}` });
        fs.writeFileSync(path === "/" ? `${dir}/index.html` : `${dir}${path}.html`, html);
      }
      fs.mkdirSync(`${dir}/events`, { recursive: true });
      const events = JSON.parse(fs.readFileSync("content/events.json", "utf8")).filter((e) => e.status !== "draft" && e.slug && e.title);
      for (const e of events) {
        const url = `${SITE_URL}/events/${encodeURIComponent(e.slug)}`;
        const meta = eventMeta(e);
        const data = {
          "@context": "https://schema.org",
          "@type": "Event",
          name: e.title,
          description: meta.description,
          url,
          ...(e.date ? { startDate: String(e.date).slice(0, 10) } : {}),
          ...(e.endDate ? { endDate: String(e.endDate).slice(0, 10) } : {}),
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: e.location ? `${e.location}, B.M.S. College of Engineering` : "B.M.S. College of Engineering",
            address: { "@type": "PostalAddress", streetAddress: "Bull Temple Road, Basavanagudi", addressLocality: "Bengaluru", addressRegion: "Karnataka", postalCode: "560019", addressCountry: "IN" },
          },
          ...(e.image && /^https?:/.test(e.image) ? { image: [e.image] } : {}),
          organizer: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
        };
        const extra = `    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\u003c")}</script>`;
        fs.writeFileSync(`${dir}/events/${e.slug}.html`, head(base, { ...meta, url, extra }));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [
      react(),
      contentSecurityPolicy(env),
      routePreload(),
      sitemap(env.VITE_SITE_URL || "https://bmsce.acm.org"),
      pageHeads(),
      // ANALYZE=1 npm run build writes a bundle breakdown to docs/bundle.html
      process.env.ANALYZE && visualizer({ filename: "docs/bundle.html", gzipSize: true, template: "treemap" }),
    ].filter(Boolean),
    // Same-origin /api in development and `vite preview`, forwarded to the local API.
    server: { proxy: { "/api": { target: env.VITE_API_PROXY || "http://localhost:5000", changeOrigin: true } } },
    preview: { proxy: { "/api": { target: env.VITE_API_PROXY || "http://localhost:5000", changeOrigin: true } } },
    // Debug logging never ships; console.warn/error stay for real failures.
    esbuild: { pure: ["console.log", "console.info", "console.debug"] },
    build: {
      target: "es2020",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: { vendor: ["react", "react-dom", "react-router-dom"], motion: ["lenis"] },
        },
      },
    },
  };
});

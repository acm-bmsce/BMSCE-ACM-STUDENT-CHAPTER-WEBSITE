/**
 * The chapter's backend (FastAPI + MongoDB on Render, source: github.com/acm-bmsce/WEBSITE-BACKEND).
 * Events, projects and Insight Series stories are read from it by the website and written to it by
 * the admin panel. Set VITE_LIVE_API to another address, or to "off" to use only the copies
 * bundled in content/ (the admin panel then saves those files instead).
 */
// VITE_API_BASE_URL is the name the previous site used for the same address.
const raw = (import.meta.env.VITE_LIVE_API ?? import.meta.env.VITE_API_BASE_URL ?? "https://bmsceacmwebsite.onrender.com").trim();
export const LIVE = !raw || raw === "off" ? "" : raw.replace(/\/+$/, "");

/** Image uploads go to the chapter's Cloudinary account (an unsigned upload preset, as before). */
export const CLOUDINARY = {
  cloud: import.meta.env.VITE_CLOUDINARY_CLOUD || "dzccr1oot",
  preset: import.meta.env.VITE_CLOUDINARY_PRESET || "Website-Image",
};

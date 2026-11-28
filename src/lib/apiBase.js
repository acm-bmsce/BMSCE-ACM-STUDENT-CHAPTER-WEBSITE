/**
 * The one place the site learns where the API lives.
 *
 * - VITE_API_URL set (e.g. https://api.example.org/api): every request goes there.
 * - Not set: requests go to /api on the site's own origin. In development and `vite preview`
 *   that path is proxied to the local API (vite.config.js); in production, point /api at the
 *   API with a rewrite on the host (see README, "Deploying").
 */
const env = import.meta.env;
// VITE_API_BASE_URL is not used here: on the previous site it held the backend's address (see liveApi.js).
export const API_BASE = (env.VITE_API_URL || "/api").replace(/\/+$/, "");

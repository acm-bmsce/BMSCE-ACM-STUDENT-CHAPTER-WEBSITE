// Vercel serverless entry: the admin API (sign-in, content saves, image uploads) as one function.
// vercel.json rewrites /api/* here; the website itself is the static Vite build in dist/.
import app from "../server/app.js";
import { config } from "../server/config/index.js";

// Only this API's own sign-ins (ADMIN_USERS) need a JWT secret; the backend's sign-ins don't.
if (config.admins.length && config.jwtSecret.length < 32) {
  throw new Error("ADMIN_USERS is set, so JWT_SECRET must be set to at least 32 random characters in the Vercel project's environment variables.");
}

export default app;

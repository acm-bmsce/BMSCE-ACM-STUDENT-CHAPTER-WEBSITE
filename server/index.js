// Local development server (npm run dev:server). On Vercel the same app runs from api/index.js.
import app from "./app.js";
import { config } from "./config/index.js";
import { mode } from "./services/store.js";

// Only this API's own sign-ins (ADMIN_USERS) need a JWT secret; the backend's sign-ins don't.
if (config.admins.length && config.jwtSecret.length < 32) {
  throw new Error("ADMIN_USERS is set, so JWT_SECRET must be set to at least 32 random characters (see .env.example).");
}

app.listen(config.port, () => {
  console.log(`BMSCE ACM admin API on http://localhost:${config.port}/api`);
  console.log(`  admins: ${config.admins.length ? config.admins.map((a) => a.username).join(", ") : "none (set ADMIN_USERS; npm run admin:hash makes a hash)"}`);
  console.log(
    mode() === "github"
      ? `  saves:  commit to ${config.github.repo}@${config.github.branch} (GITHUB_TOKEN set)`
      : "  saves:  write files in this folder (no GITHUB_TOKEN); commit them yourself"
  );
});

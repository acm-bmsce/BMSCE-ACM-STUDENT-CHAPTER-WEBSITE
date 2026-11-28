// `npm run build`. The project's shared .env sets NODE_ENV=development for the API, and
// Vite honours that, which would ship a development React build (jsxDEV, local source
// paths, twice the size). Pin production before Vite starts, then build as usual.
import { build } from "vite";

process.env.NODE_ENV = "production";
await build();

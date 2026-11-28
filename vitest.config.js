import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 20000,
    hookTimeout: 20000,
    include: ["server/tests/**/*.test.js"],
    // A throwaway copy of content/ and test admins; real files are never touched.
    setupFiles: ["server/tests/setup.js"],
  },
});

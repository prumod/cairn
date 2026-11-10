import { randomUUID } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

// One disposable database for the whole run. Workers inherit it, so the steps can seed rows.
process.env.CAIRN_E2E_DATABASE ??= "cairn_e2e_" + randomUUID().replaceAll("-", "");

export default defineConfig({
  testDir: defineBddConfig({
    features: "features/**/*.feature",
    steps: "apps/web/tests/acceptance/e2e/**/*.steps.ts",
    outputDir: ".features-gen",
    missingSteps: "fail-on-gen",
  }),
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "exec node --import tsx scripts/start-browser-test-server.ts",
    gracefulShutdown: { signal: "SIGTERM", timeout: 10000 },
    env: { NODE_ENV: "test" },
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});

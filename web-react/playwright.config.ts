import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const host = "127.0.0.1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 120_000,
  expect: { timeout: 25_000 },
  use: {
    ...devices["Desktop Chrome"],
    trace: "on-first-retry",
    video: "on",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", testMatch: /e2e\/.*\.spec\.ts$/ }],
  webServer: [
    {
      command: "npm run api",
      cwd: repoRoot,
      url: `http://${host}:3000/users?_limit=1`,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: `npm run web -- --host ${host} --port 4200`,
      cwd: repoRoot,
      url: `http://${host}:4200/`,
      reuseExistingServer: true,
      timeout: 300_000,
    },
    {
      command: `npm run build && npm run preview -- --host ${host} --port 4173 --strictPort`,
      cwd: __dirname,
      url: `http://${host}:4173/`,
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
});

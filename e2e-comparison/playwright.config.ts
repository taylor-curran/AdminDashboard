import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const host = "127.0.0.1";

/**
 * Migration audit Playwright config.
 * - Starts json-server, Angular (:4200), React Vite preview (:4173).
 * - Use --grep @angular to run checks that must pass against Angular.
 * - Use --grep @reactMismatch to run checks that fail on React (expected).
 */
export default defineConfig({
  testDir: "./specs",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: path.join(__dirname, "playwright-report") }],
    ["json", { outputFile: path.join(__dirname, "test-results", "results.json") }],
  ],
  timeout: 120_000,
  expect: { timeout: 25_000 },
  use: {
    ...devices["Desktop Chrome"],
    trace: "on-first-retry",
    video: "on",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "angular-audit",
      use: { baseURL: `http://${host}:4200` },
      testMatch: /specs\/.*\.spec\.ts$/,
      grep: /@angular/,
    },
    {
      name: "react-audit",
      use: { baseURL: `http://${host}:4173` },
      testMatch: /specs\/.*\.spec\.ts$/,
      grep: /@reactMismatch/,
    },
    {
      name: "screenshot-pairs",
      testMatch: /specs\/screenshot-pairs\.spec\.ts$/,
    },
  ],
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
      cwd: path.join(repoRoot, "web-react"),
      url: `http://${host}:4173/`,
      reuseExistingServer: true,
      timeout: 300_000,
    },
  ],
});

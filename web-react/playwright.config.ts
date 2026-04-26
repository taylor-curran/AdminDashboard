import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reuse = !process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    trace: "on-first-retry",
    screenshot: "off",
    video: process.env.RECORD_DEMO ? "on" : "off",
  },
  projects: [
    {
      name: "parity",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npx json-server --watch ../db.json --port 3000",
      cwd: __dirname,
      port: 3000,
      reuseExistingServer: reuse,
      timeout: 30_000,
    },
    {
      command: "npx ng serve --host 127.0.0.1 --port 4200",
      cwd: "..",
      url: "http://127.0.0.1:4200/",
      reuseExistingServer: reuse,
      timeout: 180_000,
    },
    {
      command: "npm run dev -- --host 127.0.0.1 --port 5173",
      cwd: __dirname,
      url: "http://127.0.0.1:5173/",
      reuseExistingServer: reuse,
      timeout: 120_000,
    },
  ],
});

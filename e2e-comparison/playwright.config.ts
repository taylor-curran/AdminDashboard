import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");

export default defineConfig({
  testDir: "./specs",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    ...devices["Desktop Chrome"],
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  expect: {
    timeout: 15_000,
  },
  timeout: 60_000,
  projects: [
    {
      name: "angular",
      use: { baseURL: "http://127.0.0.1:4200" },
    },
    {
      name: "react",
      use: { baseURL: "http://127.0.0.1:5173" },
    },
  ],
  webServer: [
    {
      command: "npx json-server --watch db.json --port 3000 --host 127.0.0.1",
      cwd: repoRoot,
      url: "http://127.0.0.1:3000/users",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "npx ng serve --host 127.0.0.1 --port 4200",
      cwd: repoRoot,
      url: "http://127.0.0.1:4200/",
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      command: "npm run dev -- --host 127.0.0.1 --port 5173",
      cwd: path.join(repoRoot, "web-react"),
      url: "http://127.0.0.1:5173/",
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
});

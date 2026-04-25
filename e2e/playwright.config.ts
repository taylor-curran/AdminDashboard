import { defineConfig, devices } from "@playwright/test";

// One config drives both reference (Angular @ :4200) and ported (React @ :5173)
// suites. Tests live in side-by-side files and validate parity.
export default defineConfig({
  testDir: ".",
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    trace: "off",
    screenshot: "off",
    video: "off",
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "angular",
      testMatch: /.*\.angular\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:4200",
      },
    },
    {
      name: "react",
      testMatch: /.*\.react\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:5173",
      },
    },
    {
      name: "screenshots",
      testMatch: /screenshots\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "demo",
      testMatch: /demo\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

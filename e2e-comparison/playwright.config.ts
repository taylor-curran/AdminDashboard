import { defineConfig, devices } from "@playwright/test";

const angularURL = process.env.ANGULAR_BASE_URL ?? "http://127.0.0.1:4200";
const reactURL = process.env.REACT_BASE_URL ?? "http://127.0.0.1:5173";

export default defineConfig({
  testDir: "./specs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    trace: "on-first-retry",
    screenshot: "on",
    video: "off",
  },
  projects: [
    {
      name: "angular",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: angularURL,
      },
    },
    {
      name: "react",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: reactURL,
      },
    },
  ],
});

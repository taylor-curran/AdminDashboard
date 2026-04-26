import { defineConfig, devices } from "@playwright/test";

const baseProjects = {
  angular: { baseURL: "http://127.0.0.1:4200" },
  react: { baseURL: "http://127.0.0.1:5173" },
} as const;

export default defineConfig({
  testDir: "./specs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 4,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    trace: "on-first-retry",
    screenshot: "on",
    video: "off",
  },
  projects: [
    {
      name: "angular",
      use: { ...devices["Desktop Chrome"], baseURL: baseProjects.angular.baseURL },
    },
    {
      name: "react",
      use: { ...devices["Desktop Chrome"], baseURL: baseProjects.react.baseURL },
    },
  ],
});

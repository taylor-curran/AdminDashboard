import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [["list"]],
  use: {
    browserName: "chromium",
    headless: true,
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
    trace: "off",
  },
  projects: [
    {
      name: "angular",
      use: {
        baseURL: "http://127.0.0.1:4200",
      },
    },
    {
      name: "react",
      use: {
        baseURL: "http://127.0.0.1:5173",
      },
    },
  ],
});

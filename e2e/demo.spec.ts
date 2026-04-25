import { test, expect } from "@playwright/test";
import { mkdirSync, renameSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ARTIFACTS = "/opt/cursor/artifacts";
const VIDEO_DIR = join(ARTIFACTS, "videos");
mkdirSync(VIDEO_DIR, { recursive: true });

test("demo: end-to-end React app walkthrough", async ({ browser }) => {
  test.setTimeout(180_000);
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
  });
  const page = await ctx.newPage();
  const base = "http://localhost:5173";

  // 1) Land on /login (unauthenticated guard pushes us here)
  await page.goto(base + "/home");
  await page.waitForURL(/\/401$/);
  await page.waitForTimeout(800);

  await page.goto(base + "/login");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // 2) Bad credentials -> error message
  await page.fill("#email", "wrong@mail.com");
  await page.fill("#password", "badpass");
  await page.locator("form").getByRole("button", { name: /login/i }).click();
  await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  await page.waitForTimeout(800);

  // 3) Successful admin login
  await page.fill("#email", "admin@mail.com");
  await page.fill("#password", "admin");
  await page.locator("form").getByRole("button", { name: /login/i }).click();
  await page.waitForURL(/\/home$/);
  await page.waitForTimeout(1500);

  // 4) Navigate to Orders
  await page.locator("a.link", { hasText: "Orders" }).click();
  await page.waitForURL(/\/payment-orders$/);
  await page.waitForTimeout(1200);

  // 5) Open details for the first order
  await page.getByLabel("View PAY123456").click();
  await page.waitForURL(/\/payment-orders\/1$/);
  await page.waitForTimeout(1200);

  // 6) Back to Orders, then Users
  await page.locator("a.link", { hasText: "Orders" }).click();
  await page.waitForURL(/\/payment-orders$/);
  await page.waitForTimeout(800);
  await page.locator("a.link", { hasText: "Users" }).click();
  await page.waitForURL(/\/users$/);
  await page.waitForTimeout(1200);

  // 7) Logout
  await page.getByRole("button", { name: /logout/i }).click();
  await page.waitForURL(/\/login$/);
  await page.waitForTimeout(800);

  await ctx.close();

  // Move the recorded video into a stable filename.
  const files = readdirSync(VIDEO_DIR).filter((f) => f.endsWith(".webm"));
  if (files.length > 0) {
    const newest = files.sort().slice(-1)[0];
    renameSync(join(VIDEO_DIR, newest), join(VIDEO_DIR, "react-demo.webm"));
    console.log("video saved at", join(VIDEO_DIR, "react-demo.webm"));
  }
});

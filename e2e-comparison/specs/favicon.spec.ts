import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

const shotDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "screenshots",
);

test.describe("Favicon link", () => {
  test("Angular exposes favicon.ico link", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular-only");
    await page.goto("/login");
    const href = await page.locator('link[rel="icon"]').getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/favicon/i);
    await page.screenshot({
      path: path.join(shotDir, "favicon-head-login-angular.png"),
      fullPage: true,
    });
  });

  test("React app does not expose the same favicon link as Angular", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React-only");
    await page.goto("/login");
    const icon = page.locator('link[rel="icon"]');
    await expect(icon).toHaveCount(0);
    await page.screenshot({
      path: path.join(shotDir, "favicon-head-login-react.png"),
      fullPage: true,
    });
  });
});

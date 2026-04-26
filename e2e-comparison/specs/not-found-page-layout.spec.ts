import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

const shotDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "screenshots",
);

test.describe("404 Not Found page root layout class", () => {
  test("Angular wraps content in error-container", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular-only");
    await page.goto("/this-route-does-not-exist-xyz");
    await page.waitForURL("**/404", { timeout: 30_000 });
    await expect(page.locator(".error-container")).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "not-found-404-layout-angular.png"),
      fullPage: true,
    });
  });

  test("React uses error-page wrapper instead of error-container", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React-only");
    await page.goto("/this-route-does-not-exist-xyz");
    await page.waitForURL("**/404", { timeout: 30_000 });
    await expect(page.locator(".error-container")).toHaveCount(0);
    await expect(page.locator(".error-page")).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "not-found-404-layout-react.png"),
      fullPage: true,
    });
  });
});

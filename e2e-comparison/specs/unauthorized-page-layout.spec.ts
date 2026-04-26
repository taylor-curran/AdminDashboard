import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";
import { clearSession } from "../helpers/auth.js";

const shotDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "screenshots",
);

test.describe("401 Unauthorized page root layout class", () => {
  test("Angular wraps content in unauthorized-container", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular-only");
    await clearSession(page);
    await page.goto("/home");
    await page.waitForURL("**/401", { timeout: 30_000 });
    await expect(page.locator(".unauthorized-container")).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "unauthorized-401-layout-angular.png"),
      fullPage: true,
    });
  });

  test("React uses error-page wrapper instead of unauthorized-container", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React-only");
    await clearSession(page);
    await page.goto("/home");
    await page.waitForURL("**/401", { timeout: 30_000 });
    await expect(page.locator(".unauthorized-container")).toHaveCount(0);
    await expect(page.locator(".error-page")).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "unauthorized-401-layout-react.png"),
      fullPage: true,
    });
  });
});

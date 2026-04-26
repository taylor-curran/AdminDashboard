import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";
import { loginAsCustomer } from "../helpers/auth.js";

const shotDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "screenshots",
);

test.describe("403 Forbidden page root layout class", () => {
  test("Angular wraps content in forbidden-container", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular-only");
    await loginAsCustomer(page);
    await page.waitForURL("**/403", { timeout: 30_000 });
    await expect(page.locator(".forbidden-container")).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "forbidden-403-layout-angular.png"),
      fullPage: true,
    });
  });

  test("React uses error-page wrapper instead of forbidden-container", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React-only");
    await loginAsCustomer(page);
    await page.waitForURL("**/403", { timeout: 30_000 });
    await expect(page.locator(".forbidden-container")).toHaveCount(0);
    await expect(page.locator(".error-page")).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "forbidden-403-layout-react.png"),
      fullPage: true,
    });
  });
});

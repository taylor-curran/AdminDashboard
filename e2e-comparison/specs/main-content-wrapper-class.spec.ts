import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

const shotDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "screenshots",
);

test.describe("Main content wrapper CSS class", () => {
  test("Angular uses .content for the router outlet region", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular-only");
    await page.goto("/login");
    await expect(page.locator("div.content")).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "shell-main-region-angular.png"),
      fullPage: true,
    });
  });

  test("React uses .app-content instead of .content for the main region", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React-only");
    await page.goto("/login");
    await expect(page.locator("div.content")).toHaveCount(0);
    await expect(page.locator("div.app-content")).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "shell-main-region-react.png"),
      fullPage: true,
    });
  });
});

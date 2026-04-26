import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

const shotDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "screenshots",
);

test.describe("Login page primary heading element", () => {
  test("Angular uses an h2 for the Login heading", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular-only");
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { level: 2, name: "Login" }),
    ).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "login-heading-angular.png"),
      fullPage: true,
    });
  });

  test("React does not expose Login as an h2 heading", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React-only");
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { level: 2, name: "Login" }),
    ).toHaveCount(0);
    await expect(
      page.locator(".p-card-title").filter({ hasText: "Login" }),
    ).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, "login-heading-react.png"),
      fullPage: true,
    });
  });
});

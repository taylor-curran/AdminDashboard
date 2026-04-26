import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

const shotDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "screenshots",
);

test.describe("Document title (root /login)", () => {
  test("matches Angular reference title", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "angular",
      "Angular-only oracle: title must be AdminDashboard",
    );
    await page.goto("/login");
    await expect(page).toHaveTitle("AdminDashboard");
    await page.screenshot({
      path: path.join(shotDir, "document-title-login-angular.png"),
      fullPage: true,
    });
  });

  test("React migration uses a different document title", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "react",
      "React-only: expect mismatch vs Angular AdminDashboard",
    );
    await page.goto("/login");
    await expect(page).not.toHaveTitle("AdminDashboard");
    await expect(page).toHaveTitle("Admin Dashboard (React)");
    await page.screenshot({
      path: path.join(shotDir, "document-title-login-react.png"),
      fullPage: true,
    });
  });
});

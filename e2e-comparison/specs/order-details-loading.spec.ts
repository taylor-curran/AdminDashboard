import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth.js";

const shotDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "screenshots",
);

test.describe("Payment order details while request is in flight", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/paymentOrders/1", async (route) => {
      await new Promise((r) => setTimeout(r, 5000));
      await route.continue();
    });
  });

  test("Angular shows empty-state copy before the order loads", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular-only");
    await loginAsAdmin(page);
    await page.goto("/payment-orders/1");
    await expect(page.getByText("No payment order selected")).toBeVisible({
      timeout: 2000,
    });
    await page.screenshot({
      path: path.join(shotDir, "order-details-slow-load-angular.png"),
      fullPage: true,
    });
  });

  test("React shows a loading message instead of the Angular empty-state copy", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React-only");
    await loginAsAdmin(page);
    await page.goto("/payment-orders/1");
    await expect(page.getByText("No payment order selected")).not.toBeVisible({
      timeout: 2000,
    });
    await expect(page.getByText(/Loading/u)).toBeVisible({ timeout: 2000 });
    await page.screenshot({
      path: path.join(shotDir, "order-details-slow-load-react.png"),
      fullPage: true,
    });
  });
});

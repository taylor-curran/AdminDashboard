import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

const REACT = "http://127.0.0.1:5173";

test.describe("react e2e demo", () => {
  test("admin journey", async ({ page }) => {
    await loginAsAdmin(page, REACT);
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();

    await page.getByRole("link", { name: /Orders/i }).click();
    await expect(
      page.getByRole("heading", { name: "Payment Orders" }),
    ).toBeVisible();
    await page.locator("tbody tr").first().locator("button").first().click();
    await page.waitForURL("**/payment-orders/1");

    await page.getByRole("link", { name: "Users" }).click();
    await expect(
      page.getByRole("heading", { name: "User Management" }),
    ).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/login$/),
      page.locator("nav.sidebar").getByRole("button", { name: "Logout" }).click(),
    ]);
    await expect(page.locator("#email")).toBeVisible();
  });
});

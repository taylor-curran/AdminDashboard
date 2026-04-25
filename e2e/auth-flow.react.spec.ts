import { test, expect, type Page } from "@playwright/test";

async function clearAuth(page: Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  });
}

test.describe("React port: auth flow + role gating", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test("/home redirects to /401 when unauthenticated", async ({ page }) => {
    await page.goto("/home");
    await page.waitForURL(/\/401$/, { timeout: 15_000 });
    await expect(page.getByText("401 - Unauthorized")).toBeVisible();
  });

  test("/payment-orders redirects to /401 when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/payment-orders");
    await page.waitForURL(/\/401$/, { timeout: 15_000 });
  });

  test("admin login navigates to /home", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.fill("#email", "admin@mail.com");
    await page.fill("#password", "admin");
    await page.locator("form").getByRole("button", { name: /login/i }).click();
    await page.waitForURL(/\/home$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  });

  test("non-admin login lands on /403", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.fill("#email", "john.doe@example.com");
    await page.fill("#password", "Password123!");
    await page.locator("form").getByRole("button", { name: /login/i }).click();
    await page.waitForURL(/\/403$/, { timeout: 15_000 });
    await expect(page.getByText("403 - Forbidden")).toBeVisible();
  });

  test("404 page renders for unknown route", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await page.waitForURL(/\/404$/, { timeout: 15_000 });
    await expect(page.getByText("404 - Not Found")).toBeVisible();
  });
});

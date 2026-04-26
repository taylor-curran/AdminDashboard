import { expect, test } from "@playwright/test";
import path from "node:path";

const ADMIN_EMAIL = "admin@mail.com";
const ADMIN_PASSWORD = "admin";

async function saveScreenshot(page: import("@playwright/test").Page, name: string) {
  const project = test.info().project.name;
  const fileName = `${name}.${project}.png`;
  await page.screenshot({
    path: path.join(process.cwd(), "screenshots", fileName),
    fullPage: true,
  });
}

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.waitForTimeout(1500);

  await page.locator("#email").or(page.getByLabel(/email/i)).first().fill(ADMIN_EMAIL);
  await page
    .locator("#password")
    .or(page.getByLabel(/password/i))
    .first()
    .fill(ADMIN_PASSWORD);
  await page.locator("form").getByRole("button", { name: /^login$/i }).click();

  await expect(page).toHaveURL(/\/home$/);
}

test("login screen includes credential form controls", async ({ page }) => {
  await page.goto("/login");
  await page.waitForTimeout(1500);

  await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
  await expect(page.locator("#email").or(page.getByLabel(/email/i)).first()).toBeVisible();
  await expect(
    page.locator("#password").or(page.getByLabel(/password/i)).first(),
  ).toBeVisible();
  await expect(page.locator("form").getByRole("button", { name: /^login$/i })).toBeVisible();

  await saveScreenshot(page, "login-form");
});

test("admin can sign in and reach the authenticated home dashboard", async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole("heading", { name: /home/i })).toBeVisible();
  await expect(page.getByText(/welcome back, admin!/i)).toBeVisible();

  await saveScreenshot(page, "home-dashboard");
});

test("payment orders page exposes tabular data view", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/payment-orders");
  await page.waitForTimeout(2500);

  await expect(page.getByRole("heading", { name: /payment orders/i })).toBeVisible();
  await expect(page.getByText(/payment reference/i).first()).toBeVisible();
  await expect(page.getByPlaceholder(/global search/i)).toBeVisible();
  await expect(page.getByText(/PAY123456|Order #1/i).first()).toBeVisible();

  await saveScreenshot(page, "payment-orders-table");
});

test("users page contains user management form and table", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/users");
  await page.waitForTimeout(2500);

  await expect(page.getByRole("heading", { name: /user management/i })).toBeVisible();
  await expect(page.getByLabel(/first name/i)).toBeVisible();
  await expect(page.getByLabel(/last name/i)).toBeVisible();
  await expect(page.locator("p-multiselect")).toBeVisible();
  await expect(page.getByRole("button", { name: /add user/i })).toBeVisible();
  await expect(page.getByText(/john\.doe@example\.com/i).first()).toBeVisible();

  await saveScreenshot(page, "users-management");
});

import { Page } from "@playwright/test";

export const ADMIN = {
  email: "admin@mail.com",
  password: "admin",
};

export const CUSTOMER = {
  email: "john.doe@example.com",
  password: "Password123!",
};

function loginSubmitButton(page: Page) {
  // Sidebar and form both have a "Login" button on /login; the form is the one inside <form>
  return page.locator("form").getByRole("button", { name: /Login/i });
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await page.locator("#email").fill(ADMIN.email);
  await page.locator("#password").fill(ADMIN.password);
  await loginSubmitButton(page).click();
  await page.waitForURL("**/home", { timeout: 15000 });
}

export async function loginAsCustomer(page: Page) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await page.locator("#email").fill(CUSTOMER.email);
  await page.locator("#password").fill(CUSTOMER.password);
  await loginSubmitButton(page).click();
  // Home is admin-only; customers are redirected to 403 after login.
  await page.waitForURL("**/403", { timeout: 15000 });
}

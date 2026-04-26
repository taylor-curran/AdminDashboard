import type { Page } from "@playwright/test";

const ADMIN_EMAIL = "admin@mail.com";
const ADMIN_PASSWORD = "admin";

function loginSubmit(page: Page) {
  return page.locator("form").getByRole("button", { name: "Login" });
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(ADMIN_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(ADMIN_PASSWORD);
  await loginSubmit(page).click();
  await page.waitForURL("**/home", { timeout: 30_000 });
}

export async function clearSession(page: Page) {
  await page.goto("/login");
  await page.evaluate(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  });
}

const CUSTOMER_EMAIL = "john.doe@example.com";
const CUSTOMER_PASSWORD = "Password123!";

export async function loginAsCustomer(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(CUSTOMER_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(CUSTOMER_PASSWORD);
  await loginSubmit(page).click();
}

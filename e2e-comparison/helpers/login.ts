import type { Page } from "@playwright/test";

const ADMIN_EMAIL = "admin@mail.com";
const ADMIN_PASSWORD = "admin";

export async function loginAsAdmin(page: Page, baseURL: string) {
  await page.goto(`${baseURL}/login`);
  await page.getByLabel("Email", { exact: true }).fill(ADMIN_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(ADMIN_PASSWORD);
  await page.locator("form").getByRole("button", { name: "Login" }).click();
  await page.waitForURL(`${baseURL}/home`);
}

import type { Page } from "@playwright/test";

export const ADMIN_EMAIL = "admin@mail.com";
export const ADMIN_PASSWORD = "admin";

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  const form = page.locator("app-login form, [data-testid='login-form']").first();
  await form.getByLabel("Email", { exact: true }).fill(ADMIN_EMAIL);
  await form.getByLabel("Password", { exact: true }).fill(ADMIN_PASSWORD);
  await form.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/home", { timeout: 20000 });
  await page.waitForTimeout(800);
}

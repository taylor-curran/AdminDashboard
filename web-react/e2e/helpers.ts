import type { Page } from "@playwright/test";

const ADMIN_EMAIL = "admin@mail.com";
const ADMIN_PASSWORD = "admin";

export async function loginAsAdmin(page: Page, baseURL: string) {
  await page.goto(`${baseURL}/login`);
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.locator("form").getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/home");
}

export const routesToShot = [
  { path: "/home", name: "home" },
  { path: "/payment-orders", name: "payment-orders" },
  { path: "/payment-orders/1", name: "payment-order-details" },
  { path: "/users", name: "users" },
  { path: "/404", name: "404" },
  { path: "/401", name: "401" },
  { path: "/403", name: "403" },
] as const;

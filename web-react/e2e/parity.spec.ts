import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shotDir = path.join(__dirname, "screenshots");

const ADMIN_EMAIL = "admin@mail.com";
const ADMIN_PASSWORD = "admin";

async function loginAsAdmin(page: import("@playwright/test").Page, baseURL: string) {
  await page.goto(`${baseURL}/login`);
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.locator("form").getByRole("button", { name: "Login" }).click();
  await page.waitForURL(`${baseURL}/home`);
}

for (const { label, baseURL } of [
  { label: "angular", baseURL: "http://127.0.0.1:4200" },
  /* Playwright starts Vite preview on 4173 so it is not confused with an existing :5173 dev server */
  { label: "react", baseURL: "http://127.0.0.1:4173" },
] as const) {
  test(`${label}: login, routes, screenshots, unauthenticated /home → 401`, async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`${baseURL}/login`);
    await page.screenshot({ path: path.join(shotDir, `${label}-login.png`), fullPage: true });

    await loginAsAdmin(page, baseURL);
    await page.screenshot({ path: path.join(shotDir, `${label}-home.png`), fullPage: true });

    await page.goto(`${baseURL}/payment-orders`);
    await expect(page.getByRole("heading", { name: "Payment Orders" })).toBeVisible();
    await page.screenshot({ path: path.join(shotDir, `${label}-payment-orders.png`), fullPage: true });

    await page.goto(`${baseURL}/payment-orders/1`);
    await expect(page.getByRole("heading", { name: "Payment Order Details" })).toBeVisible();
    await expect(page.getByText("Order #1")).toBeVisible();
    await page.screenshot({
      path: path.join(shotDir, `${label}-payment-order-detail.png`),
      fullPage: true,
    });

    await page.goto(`${baseURL}/users`);
    await expect(page.getByRole("heading", { name: "User Management" })).toBeVisible();
    await page.screenshot({ path: path.join(shotDir, `${label}-users.png`), fullPage: true });

    await page.goto(`${baseURL}/this-route-does-not-exist`);
    await expect(page.getByRole("heading", { name: "404 - Not Found" })).toBeVisible();
    await page.screenshot({ path: path.join(shotDir, `${label}-404.png`), fullPage: true });

    await context.clearCookies();
    await page.goto(`${baseURL}/login`);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto(`${baseURL}/home`);
    await expect(page).toHaveURL(`${baseURL}/401`);

    await context.close();
  });
}

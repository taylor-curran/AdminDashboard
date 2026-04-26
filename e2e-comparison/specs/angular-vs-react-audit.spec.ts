import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/login";

const CUSTOMER_EMAIL = "john.doe@example.com";
const CUSTOMER_PASSWORD = "Password123!";

test.describe.configure({ mode: "serial" });

test.describe("Angular reference (must pass) @angular", () => {
  test.use({ baseURL: "http://127.0.0.1:4200" });

  test("document title is AdminDashboard", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/AdminDashboard/);
  });

  test("login page uses Angular main-container and login-container classes", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator(".main-container .login-container")).toBeVisible();
  });

  test("root mount element is app-root not #root", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("app-root")).toBeVisible();
    await expect(page.locator("#root")).toHaveCount(0);
  });

  test("index references favicon.ico", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('link[rel="icon"][href="favicon.ico"]')).toBeAttached();
  });

  test("statistics cards show chart section titles as visible text", async ({ page }) => {
    await loginAsAdmin(page, "http://127.0.0.1:4200");
    await page.goto("/home");
    const stats = page.locator(".statistics-container");
    await expect(stats.getByText("Number of successful transactions")).toBeVisible();
    await expect(stats.getByText("Number of users")).toBeVisible();
    await expect(stats.getByText("Payment status distribution")).toBeVisible();
  });

  test("admin shell uses container and content layout classes", async ({ page }) => {
    await loginAsAdmin(page, "http://127.0.0.1:4200");
    await page.goto("/home");
    await expect(page.locator(".container > .content")).toBeVisible();
  });

  test("404 page uses outer .container wrapper", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.locator("div.container >> .error-container")).toBeVisible();
  });

  test("404 copy uses straight apostrophe in you're", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByText(/you're looking for doesn't exist/i)).toBeVisible();
  });

  test("404 Go to Homepage control is a single anchor styled as p-button", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.locator("a.p-button", { hasText: "Go to Homepage" })).toBeVisible();
  });

  test("users form submit buttons read Add User / Update User", async ({ page }) => {
    await loginAsAdmin(page, "http://127.0.0.1:4200");
    await page.goto("/users");
    await expect(page.getByRole("button", { name: "Add User" })).toBeVisible();
  });

  test("payment orders list uses GET http://localhost:3000/paymentOrders", async ({ page }) => {
    const reqPromise = page.waitForRequest(
      (r) => r.url() === "http://localhost:3000/paymentOrders" && r.method() === "GET",
    );
    await loginAsAdmin(page, "http://127.0.0.1:4200");
    await page.goto("/payment-orders");
    await reqPromise;
  });

  test("payment order detail shows Angular date format for Created On", async ({ page }) => {
    await loginAsAdmin(page, "http://127.0.0.1:4200");
    await page.goto("/payment-orders/1");
    await expect(page.getByText("Jun 15, 2024")).toBeVisible();
    await expect(page.getByText("Jun 16, 2024")).toBeVisible();
  });

  test("customer is redirected to /403 when visiting /home", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email", { exact: true }).fill(CUSTOMER_EMAIL);
    await page.getByLabel("Password", { exact: true }).fill(CUSTOMER_PASSWORD);
    await page.locator("form").getByRole("button", { name: "Login" }).click();
    await page.waitForURL(/\/(home|403)$/);
    await page.goto("/home");
    await expect(page).toHaveURL("http://127.0.0.1:4200/403");
  });

  test("401 when unauthenticated user opens /home", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/login");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto("/home");
    await expect(page).toHaveURL("http://127.0.0.1:4200/401");
  });
});

test.describe("React migration (expected mismatches vs Angular) @reactMismatch", () => {
  test.use({ baseURL: "http://127.0.0.1:4173" });

  test("document title is not AdminDashboard", async ({ page }) => {
    await page.goto("/login");
    await expect(page).not.toHaveTitle(/AdminDashboard/);
  });

  test("login page uses React layout classes not Angular main-container/login-container", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page.locator(".main-container .login-container")).toHaveCount(0);
    await expect(page.locator(".login-main-container .login-card")).toBeVisible();
  });

  test("admin shell uses app-container and app-content not Angular container/content", async ({
    page,
  }) => {
    await loginAsAdmin(page, "http://127.0.0.1:4173");
    await page.goto("/home");
    await expect(page.locator(".container > .content")).toHaveCount(0);
    await expect(page.locator(".app-container > .app-content")).toBeVisible();
  });

  test("404 page does not use Angular's .container > .error-container structure", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.locator("div.container >> .error-container")).toHaveCount(0);
  });

  test("404 Go to Homepage is not a plain anchor.p-button (uses button inside link)", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.locator("a.p-button", { hasText: "Go to Homepage" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Go to Homepage" })).toBeVisible();
  });

  test("root mount element is #root not Angular app-root", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("app-root")).toHaveCount(0);
    await expect(page.locator("#root")).toBeVisible();
  });

  test("payment orders list uses GET through React origin (proxied path)", async ({ page }) => {
    const reqPromise = page.waitForRequest(
      (r) => r.url().startsWith("http://127.0.0.1:4173/paymentOrders") && r.method() === "GET",
    );
    await loginAsAdmin(page, "http://127.0.0.1:4173");
    await page.goto("/payment-orders");
    await reqPromise;
  });

  test("payment order detail uses locale date strings instead of Angular date pipe", async ({
    page,
  }) => {
    await loginAsAdmin(page, "http://127.0.0.1:4173");
    await page.goto("/payment-orders/1");
    await expect(page.getByText("Jun 15, 2024")).not.toBeVisible();
    await expect(page.getByText(/6\/15\/2024|15\/06\/2024/)).toBeVisible();
  });

  test("index does not reference favicon.ico like Angular", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('link[rel="icon"][href="favicon.ico"]')).toHaveCount(0);
  });
});

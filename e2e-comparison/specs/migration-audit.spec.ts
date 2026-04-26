import { test, expect } from "@playwright/test";
import { ADMIN, loginAsAdmin, loginAsCustomer } from "./helpers";

test.describe("Migration audit — angular expectations", () => {
  test("document title is AdminDashboard (login)", async ({ page, browserName, baseURL }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await page.goto("/login");
    await expect(page).toHaveTitle("AdminDashboard");
  });

  test("login page: favicon link present in head", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await page.goto("/login");
    await expect(page.locator("link[rel~='icon']")).toHaveCount(1);
  });

  test("login: submit button is never disabled while idle", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await page.goto("/login");
    const btn = page.locator("form").getByRole("button", { name: /Login/i });
    await expect(btn).toBeEnabled();
  });

  test("login: failed login error is not a live region (no role=alert)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await page.goto("/login");
    await page.locator("#email").fill("admin@mail.com");
    await page.locator("#password").fill("not-the-password-xyz");
    await page.locator("form").getByRole("button", { name: /Login/i }).click();
    const err = page.locator(".error-message");
    await expect(err).toContainText("Invalid email or password");
    await expect(err).not.toHaveAttribute("role", "alert");
  });

  test("unauthorized: outer wrapper is .container, not .error-page-container", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await page.goto("/users");
    await expect(page).toHaveURL(/\/401/);
    await expect(page.locator(".error-page-container")).toHaveCount(0);
  });

  test("not-found: outer wrapper is .container, not .error-page-container", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await page.goto("/does-not-exist-xyz");
    await expect(page).toHaveURL(/\/404/);
    await expect(page.locator(".error-page-container")).toHaveCount(0);
  });

  test("forbidden: outer error shell is .container, not .error-page-container", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await loginAsCustomer(page);
    await page.goto("/users");
    await expect(page).toHaveURL(/\/403/);
    await expect(page.locator(".forbidden-container")).toBeVisible();
    await expect(page.locator(".error-page-container")).toHaveCount(0);
  });

  test("forbidden: Logout is a p-button with routerLink to /login (navigate on click)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await loginAsCustomer(page);
    await page.goto("/users");
    await expect(page).toHaveURL(/\/403/);
    const logout = page
      .locator(".forbidden-container")
      .getByRole("button", { name: /^Logout$/i });
    await expect(logout).toBeVisible();
    await expect(logout).toHaveAttribute("routerlink", "/login");
  });

  test("unauthorized: Login control is a link", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await page.goto("/users");
    await expect(page).toHaveURL(/\/401/);
    const login = page.getByRole("link", { name: /^Login$/ });
    await expect(login).toBeVisible();
  });

  test("payment orders: row open-details control has no aria-label (icon only)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await loginAsAdmin(page);
    await page.goto("/payment-orders");
    await expect(page.getByText("PAY123456")).toBeVisible({ timeout: 15000 });
    const firstRow = page.locator("p-table tbody tr").first();
    const extBtn = firstRow.getByRole("button").first();
    await expect(extBtn).toBeVisible();
    await expect(extBtn).not.toHaveAttribute("aria-label", /.+/);
  });

  test("users: edit/delete action buttons have no aria-labels", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await loginAsAdmin(page);
    await page.goto("/users");
    await expect(page.getByText("john.doe@example.com").first()).toBeVisible({ timeout: 15000 });
    const row = page
      .getByRole("row", { name: /john\.doe@example\.com/i })
      .first();
    const buttons = row.getByRole("button");
    const n = await buttons.count();
    for (let i = 0; i < n; i++) {
      await expect(buttons.nth(i)).not.toHaveAttribute("aria-label", /.+/);
    }
  });

  test("payment order details: back control is a link with an icon, no added accessible name", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await loginAsAdmin(page);
    await page.goto("/payment-orders/1");
    await expect(page.getByText("PAY123456", { exact: false })).toBeVisible({ timeout: 15000 });
    const back = page.locator(".title-container a.p-button.link").first();
    await expect(back).toBeVisible();
    await expect(back).not.toHaveAttribute("aria-label", /.+/);
    await expect(back.locator("i.pi-arrow-left")).toBeVisible();
  });

  test("sidebar: Home is the only nav link with aria-current when on Home", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await loginAsAdmin(page);
    await page.goto("/home");
    const nav = page.locator("app-sidebar nav.sidebar, nav.sidebar");
    const home = nav.locator("a.link").filter({ has: page.getByText("Home", { exact: true }) });
    const orders = nav.locator("a.link").filter({ has: page.getByText("Orders", { exact: true }) });
    const users = nav.locator("a.link").filter({ has: page.getByText("Users", { exact: true }) });
    await expect(home).toHaveAttribute("aria-current", "page");
    await expect(orders).not.toHaveAttribute("aria-current", /.+/);
    await expect(users).not.toHaveAttribute("aria-current", /.+/);
  });

  test("sidebar: on Orders route, Home link is not marked current", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await loginAsAdmin(page);
    await page.goto("/payment-orders");
    const nav = page.locator("app-sidebar nav.sidebar, nav.sidebar");
    const home = nav.locator("a.link").filter({ has: page.getByText("Home", { exact: true }) });
    await expect(home).not.toHaveAttribute("aria-current", "page");
  });

  test("sidebar: Dashboard brand area is not role=button", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await page.goto("/login");
    const brand = page.locator("app-sidebar .sidebar-container > div").first();
    await expect(brand).not.toHaveAttribute("role", "button");
  });

  test("layout: main content region uses .content (not .app-content)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "angular", "Angular behavior");
    await page.goto("/login");
    await expect(page.locator(".content")).toBeVisible();
    await expect(page.locator(".app-content")).toHaveCount(0);
  });
});

test.describe("Migration audit — intended react deltas", () => {
  test("document title is Admin Dashboard (React) on login", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await page.goto("/login");
    await expect(page).toHaveTitle("Admin Dashboard (React)");
  });

  test("login: submit button disabled while a submission is in flight", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await page.route("**/users?email=*", async (route) => {
      await new Promise((r) => setTimeout(r, 4000));
      await route.continue();
    });
    await page.goto("/login");
    const btn = page.locator("form").getByRole("button", { name: /Login/i });
    await expect(btn).toBeEnabled();
    await page.locator("#email").fill(ADMIN.email);
    await page.locator("#password").fill(ADMIN.password);
    void btn.click();
    await expect(
      page.locator("form").getByRole("button", { name: /Login/i }),
    ).toBeDisabled({ timeout: 2000 });
  });

  test("forbidden: page Logout is a real button, not a link (sidebar also has Logout)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await loginAsCustomer(page);
    await page.goto("/users");
    await expect(page).toHaveURL(/\/403/);
    await expect(page.getByRole("link", { name: /logout/i })).toHaveCount(0);
    const pageLogout = page
      .locator(".forbidden-container")
      .getByRole("button", { name: /^Logout$/i });
    await expect(pageLogout).toBeVisible();
  });

  test("login page: no favicon link in head (angular sets favicon)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await page.goto("/login");
    await expect(page.locator("link[rel~='icon']")).toHaveCount(0);
  });

  test("unauthorized: error shell uses .error-page-container", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await page.goto("/users");
    await expect(page).toHaveURL(/\/401/);
    await expect(page.locator(".error-page-container")).toHaveCount(1);
  });

  test("not-found: error shell uses .error-page-container", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await page.goto("/this-route-missing-abc");
    await expect(page).toHaveURL(/\/404/);
    await expect(page.locator(".error-page-container")).toHaveCount(1);
  });

  test("forbidden: error shell uses .error-page-container", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await loginAsCustomer(page);
    await page.goto("/users");
    await expect(page).toHaveURL(/\/403/);
    await expect(page.locator(".forbidden-container")).toBeVisible();
    await expect(page.locator(".error-page-container")).toHaveCount(1);
  });

  test("payment orders: row open-details control has View + reference aria-label", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await loginAsAdmin(page);
    await page.goto("/payment-orders");
    await expect(page.getByText("PAY123456")).toBeVisible({ timeout: 15000 });
    const firstRow = page.locator("table tbody tr").first();
    const extBtn = firstRow.getByLabel(/View PAY123456/);
    await expect(extBtn).toBeVisible();
  });

  test("users: edit and delete have explicit aria-labels with email", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await loginAsAdmin(page);
    await page.goto("/users");
    await expect(page.getByText("john.doe@example.com").first()).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole("button", { name: "Edit john.doe@example.com" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Delete john.doe@example.com" }),
    ).toBeVisible();
  });

  test("payment order details: back control has Back aria-label", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await loginAsAdmin(page);
    await page.goto("/payment-orders/1");
    const back = page.getByLabel("Back");
    await expect(back).toBeVisible();
  });

  test("sidebar: Dashboard brand is focusable (role=button) for keyboard users", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await page.goto("/login");
    await expect(page.getByTestId("sidebar").locator(".brand")).toHaveAttribute("role", "button");
  });

  test("layout: main content region uses .app-content (not .content under app-shell)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await page.goto("/login");
    await expect(page.locator(".app-shell .app-content")).toBeVisible();
    await expect(page.locator(".app-shell .content")).toHaveCount(0);
  });

  test("login: failed login error is marked role=alert", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "react", "React delta");
    await page.goto("/login");
    await page.locator("#email").fill("admin@mail.com");
    await page.locator("#password").fill("not-the-password-xyz");
    await page.locator("form").getByRole("button", { name: /Login/i }).click();
    await expect(
      page.locator(".error-message[role='alert']"),
    ).toContainText("Invalid email or password");
  });
});

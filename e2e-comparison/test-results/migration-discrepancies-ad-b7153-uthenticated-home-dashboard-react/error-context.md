# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: migration-discrepancies.spec.ts >> admin can sign in and reach the authenticated home dashboard
- Location: tests/migration-discrepancies.spec.ts:45:5

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.fill: Test timeout of 45000ms exceeded.
Call log:
  - waiting for locator('#email').or(getByLabel(/email/i)).first()

```

# Page snapshot

```yaml
- main [ref=e3]:
  - heading "Admin Dashboard — React" [level=1] [ref=e4]
  - paragraph [ref=e5]:
    - text: Replace this with your port of the Angular app in
    - code [ref=e6]: ../src
    - text: .
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import path from "node:path";
  3  | 
  4  | const ADMIN_EMAIL = "admin@mail.com";
  5  | const ADMIN_PASSWORD = "admin";
  6  | 
  7  | async function saveScreenshot(page: import("@playwright/test").Page, name: string) {
  8  |   const project = test.info().project.name;
  9  |   const fileName = `${name}.${project}.png`;
  10 |   await page.screenshot({
  11 |     path: path.join(process.cwd(), "screenshots", fileName),
  12 |     fullPage: true,
  13 |   });
  14 | }
  15 | 
  16 | async function loginAsAdmin(page: import("@playwright/test").Page) {
  17 |   await page.goto("/login");
  18 |   await page.waitForTimeout(1500);
  19 | 
> 20 |   await page.locator("#email").or(page.getByLabel(/email/i)).first().fill(ADMIN_EMAIL);
     |                                                                      ^ Error: locator.fill: Test timeout of 45000ms exceeded.
  21 |   await page
  22 |     .locator("#password")
  23 |     .or(page.getByLabel(/password/i))
  24 |     .first()
  25 |     .fill(ADMIN_PASSWORD);
  26 |   await page.locator("form").getByRole("button", { name: /^login$/i }).click();
  27 | 
  28 |   await expect(page).toHaveURL(/\/home$/);
  29 | }
  30 | 
  31 | test("login screen includes credential form controls", async ({ page }) => {
  32 |   await page.goto("/login");
  33 |   await page.waitForTimeout(1500);
  34 | 
  35 |   await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
  36 |   await expect(page.locator("#email").or(page.getByLabel(/email/i)).first()).toBeVisible();
  37 |   await expect(
  38 |     page.locator("#password").or(page.getByLabel(/password/i)).first(),
  39 |   ).toBeVisible();
  40 |   await expect(page.locator("form").getByRole("button", { name: /^login$/i })).toBeVisible();
  41 | 
  42 |   await saveScreenshot(page, "login-form");
  43 | });
  44 | 
  45 | test("admin can sign in and reach the authenticated home dashboard", async ({ page }) => {
  46 |   await loginAsAdmin(page);
  47 |   await expect(page.getByRole("heading", { name: /home/i })).toBeVisible();
  48 |   await expect(page.getByText(/welcome back, admin!/i)).toBeVisible();
  49 | 
  50 |   await saveScreenshot(page, "home-dashboard");
  51 | });
  52 | 
  53 | test("payment orders page exposes tabular data view", async ({ page }) => {
  54 |   await loginAsAdmin(page);
  55 |   await page.goto("/payment-orders");
  56 |   await page.waitForTimeout(2500);
  57 | 
  58 |   await expect(page.getByRole("heading", { name: /payment orders/i })).toBeVisible();
  59 |   await expect(page.getByText(/payment reference/i).first()).toBeVisible();
  60 |   await expect(page.getByPlaceholder(/global search/i)).toBeVisible();
  61 |   await expect(page.getByText(/PAY123456|Order #1/i).first()).toBeVisible();
  62 | 
  63 |   await saveScreenshot(page, "payment-orders-table");
  64 | });
  65 | 
  66 | test("users page contains user management form and table", async ({ page }) => {
  67 |   await loginAsAdmin(page);
  68 |   await page.goto("/users");
  69 |   await page.waitForTimeout(2500);
  70 | 
  71 |   await expect(page.getByRole("heading", { name: /user management/i })).toBeVisible();
  72 |   await expect(page.getByLabel(/first name/i)).toBeVisible();
  73 |   await expect(page.getByLabel(/last name/i)).toBeVisible();
  74 |   await expect(page.locator("p-multiselect")).toBeVisible();
  75 |   await expect(page.getByRole("button", { name: /add user/i })).toBeVisible();
  76 |   await expect(page.getByText(/john\.doe@example\.com/i).first()).toBeVisible();
  77 | 
  78 |   await saveScreenshot(page, "users-management");
  79 | });
  80 | 
```
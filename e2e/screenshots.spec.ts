import { test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ARTIFACTS = "/opt/cursor/artifacts/screenshots";
mkdirSync(ARTIFACTS, { recursive: true });

const sides = [
  { name: "angular", base: "http://localhost:4200" },
  { name: "react", base: "http://localhost:5173" },
];

const unauthPages = [
  { route: "/login", file: "login" },
  { route: "/401", file: "unauthorized" },
  { route: "/403", file: "forbidden" },
  { route: "/404", file: "not-found" },
];

const authPages = [
  { route: "/home", file: "home" },
  { route: "/payment-orders", file: "payment-orders" },
  { route: "/payment-orders/1", file: "payment-order-details" },
  { route: "/users", file: "users" },
];

async function login(page: Page, base: string) {
  await page.goto(base + "/login");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  });
  await page.reload();
  await page.waitForLoadState("networkidle");
  await page.fill("#email", "admin@mail.com");
  await page.fill("#password", "admin");
  await page
    .locator("form")
    .getByRole("button", { name: /login/i })
    .click();
  await page.waitForURL(/\/home$/, { timeout: 15_000 });
}

async function clearAuth(page: Page, base: string) {
  await page.goto(base + "/login");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  });
  await page.reload();
  await page.waitForLoadState("networkidle");
}

async function snap(page: Page, file: string, side: string) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  const out = resolve(ARTIFACTS, `${file}.${side}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log("wrote", out);
}

test.describe.configure({ mode: "serial" });

for (const side of sides) {
  test(`screenshots: ${side.name}`, async ({ browser }) => {
    test.setTimeout(180_000);
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();

    // Unauth pages
    await clearAuth(page, side.base);
    for (const p of unauthPages) {
      await page.goto(side.base + p.route);
      await snap(page, p.file, side.name);
    }

    // Login once and snap authed pages
    await login(page, side.base);
    for (const p of authPages) {
      await page.goto(side.base + p.route);
      await snap(page, p.file, side.name);
    }

    await ctx.close();
  });
}

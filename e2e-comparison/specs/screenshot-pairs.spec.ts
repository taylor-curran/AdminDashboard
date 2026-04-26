import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "@playwright/test";
import { loginAsAdmin } from "../helpers/login";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shotDir = path.join(__dirname, "..", "screenshots");

/** Captures paired screenshots for Angular vs React (same viewport flows). */
test.describe("Screenshot pairs @screenshots", () => {
  test("login card chrome", async ({ browser }) => {
    for (const { label, base } of [
      { label: "angular", base: "http://127.0.0.1:4200" },
      { label: "react", base: "http://127.0.0.1:4173" },
    ] as const) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto(`${base}/login`);
      await page.locator("p-card, .p-card, .login-card").first().screenshot({
        path: path.join(shotDir, `audit-login-card-${label}.png`),
      });
      await ctx.close();
    }
  });

  test("home statistics card title treatment", async ({ browser }) => {
    for (const { label, base } of [
      { label: "angular", base: "http://127.0.0.1:4200" },
      { label: "react", base: "http://127.0.0.1:4173" },
    ] as const) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await loginAsAdmin(page, base);
      await page.goto(`${base}/home`);
      await page.locator(".statistics-container").screenshot({
        path: path.join(shotDir, `audit-home-statistics-${label}.png`),
      });
      await ctx.close();
    }
  });

  test("404 page body copy and chrome", async ({ browser }) => {
    for (const { label, base } of [
      { label: "angular", base: "http://127.0.0.1:4200" },
      { label: "react", base: "http://127.0.0.1:4173" },
    ] as const) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto(`${base}/this-route-does-not-exist`);
      await page.screenshot({
        path: path.join(shotDir, `audit-404-fullpage-${label}.png`),
        fullPage: true,
      });
      await ctx.close();
    }
  });

  test("users form primary submit button", async ({ browser }) => {
    for (const { label, base } of [
      { label: "angular", base: "http://127.0.0.1:4200" },
      { label: "react", base: "http://127.0.0.1:4173" },
    ] as const) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await loginAsAdmin(page, base);
      await page.goto(`${base}/users`);
      const form = page.locator("form").first();
      await form.screenshot({ path: path.join(shotDir, `audit-users-form-${label}.png`) });
      await ctx.close();
    }
  });

  test("payment order 1 dates section", async ({ browser }) => {
    for (const { label, base } of [
      { label: "angular", base: "http://127.0.0.1:4200" },
      { label: "react", base: "http://127.0.0.1:4173" },
    ] as const) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await loginAsAdmin(page, base);
      await page.goto(`${base}/payment-orders/1`);
      const section = page.locator(".card-body, .detail-card-body").first();
      await section.screenshot({
        path: path.join(shotDir, `audit-payment-detail-dates-${label}.png`),
      });
      await ctx.close();
    }
  });
});

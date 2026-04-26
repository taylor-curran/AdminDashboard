import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseURL = "http://127.0.0.1:4173";
const recordDir = path.join(__dirname, "recordings");
const outputVideo = path.join(__dirname, "demo-react-flow.webm");

test("record React walkthrough to demo-react-flow.webm", async ({ browser }) => {
  fs.mkdirSync(recordDir, { recursive: true });
  const context = await browser.newContext({
    recordVideo: { dir: recordDir, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/login`);
  await page.getByLabel("Email").fill("admin@mail.com");
  await page.getByLabel("Password").fill("admin");
  await page.locator("form").getByRole("button", { name: "Login" }).click();
  await page.waitForURL(`${baseURL}/home`);
  await page.waitForTimeout(500);
  await page.goto(`${baseURL}/payment-orders`);
  await page.waitForTimeout(500);
  await page.goto(`${baseURL}/payment-orders/1`);
  await page.waitForTimeout(500);
  await page.goto(`${baseURL}/users`);
  await page.waitForTimeout(600);
  await page.getByRole("link", { name: "Home" }).click();
  await page.waitForTimeout(500);
  await context.close();

  const [video] = fs.readdirSync(recordDir).filter((f) => f.endsWith(".webm"));
  if (!video) throw new Error("No webm produced by Playwright");
  fs.renameSync(path.join(recordDir, video), outputVideo);
});

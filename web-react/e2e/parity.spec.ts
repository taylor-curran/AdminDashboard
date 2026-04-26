import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { loginAsAdmin, routesToShot } from "./helpers";

const ANGULAR = "http://127.0.0.1:4200";
const REACT = "http://127.0.0.1:5173";

async function ensureArtifactDir(): Promise<string> {
  const preferred = "/opt/cursor/artifacts/screenshots";
  try {
    await mkdir(preferred, { recursive: true });
    return preferred;
  } catch {
    const fallback = join(process.cwd(), "..", "artifacts", "screenshots");
    await mkdir(fallback, { recursive: true });
    return fallback;
  }
}

test.describe("visual parity screenshots", () => {
  test("angular and react pages", async ({ browser }) => {
    const outDir = await ensureArtifactDir();

    for (const { path, name } of routesToShot) {
      if (path !== "/401" && path !== "/403" && path !== "/404") {
        const ctxA = await browser.newContext();
        const pageA = await ctxA.newPage();
        await loginAsAdmin(pageA, ANGULAR);
        await pageA.goto(`${ANGULAR}${path}`);
        await pageA.waitForLoadState("domcontentloaded");
        await pageA.screenshot({
          path: join(outDir, `angular-${name}.png`),
          fullPage: true,
        });
        await ctxA.close();

        const ctxR = await browser.newContext();
        const pageR = await ctxR.newPage();
        await loginAsAdmin(pageR, REACT);
        await pageR.goto(`${REACT}${path}`);
        await pageR.waitForLoadState("domcontentloaded");
        await pageR.screenshot({
          path: join(outDir, `react-${name}.png`),
          fullPage: true,
        });
        await ctxR.close();
      } else {
        const ctxA = await browser.newContext();
        const pageA = await ctxA.newPage();
        await pageA.goto(`${ANGULAR}${path}`);
        await pageA.waitForLoadState("domcontentloaded");
        await pageA.screenshot({
          path: join(outDir, `angular-${name}.png`),
          fullPage: true,
        });
        await ctxA.close();

        const ctxR = await browser.newContext();
        const pageR = await ctxR.newPage();
        await pageR.goto(`${REACT}${path}`);
        await pageR.waitForLoadState("domcontentloaded");
        await pageR.screenshot({
          path: join(outDir, `react-${name}.png`),
          fullPage: true,
        });
        await ctxR.close();
      }
    }
  });

  test("login error message parity", async ({ browser }) => {
    const ctxA = await browser.newContext();
    const pageA = await ctxA.newPage();
    await pageA.goto(`${ANGULAR}/login`);
    await pageA.getByLabel("Email").fill("wrong@x.com");
    await pageA.getByLabel("Password").fill("wrongpass");
    await pageA.locator("form").getByRole("button", { name: "Login" }).click();
    await expect(pageA.getByText("Invalid email or password")).toBeVisible();

    const ctxR = await browser.newContext();
    const pageR = await ctxR.newPage();
    await pageR.goto(`${REACT}/login`);
    await pageR.getByLabel("Email").fill("wrong@x.com");
    await pageR.getByLabel("Password").fill("wrongpass");
    await pageR.locator("form").getByRole("button", { name: "Login" }).click();
    await expect(pageR.getByText("Invalid email or password")).toBeVisible();
    await ctxA.close();
    await ctxR.close();
  });
});

import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers.js";

test.describe("Angular reference vs React migration (audit)", () => {
  test("document title matches AdminDashboard in Angular; React app uses different title", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "angular") {
      await expect(page).toHaveTitle("AdminDashboard");
    } else {
      await expect(page).toHaveTitle("Admin Dashboard (React)");
    }
  });

  test("unauthenticated user visiting home is sent to 401 in Angular; React does not show 401 page", async ({
    page,
  }, testInfo) => {
    await page.goto("/home");
    if (testInfo.project.name === "angular") {
      await expect(
        page.getByRole("heading", { name: "401 - Unauthorized" })
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: "401 - Unauthorized" })
      ).toHaveCount(0);
    }
  });

  test("login page shows Login heading, Email and Password fields in Angular; React has no full login form", async ({
    page,
  }, testInfo) => {
    await page.goto("/login");
    if (testInfo.project.name === "angular") {
      const form = page.locator("app-login form").first();
      await expect(
        page.getByRole("heading", { name: "Login" })
      ).toBeVisible();
      await expect(form.getByLabel("Email", { exact: true })).toBeVisible();
      await expect(form.getByLabel("Password", { exact: true })).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: "Login" })
      ).toHaveCount(0);
      await expect(page.getByLabel("Email", { exact: true })).toHaveCount(0);
    }
  });

  test("post-login shell shows Home, Orders, Users navigation in Angular; React has no app navigation", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await loginAsAdmin(page);
      const nav = page.getByRole("navigation");
      await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Orders" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Users" })).toBeVisible();
    } else {
      await page.goto("/");
      const nav = page.getByRole("navigation");
      await expect(nav.getByRole("link", { name: "Home" })).toHaveCount(0);
    }
  });

  test("home dashboard shows Home heading and welcome copy in Angular; React has neither", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await loginAsAdmin(page);
      await expect(
        page.getByRole("heading", { name: "Home" })
      ).toBeVisible();
      await expect(
        page.getByText("Welcome back, Admin!", { exact: true })
      ).toBeVisible();
    } else {
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Home" })).toHaveCount(
        0
      );
      await expect(
        page.getByText("Welcome back, Admin!", { exact: true })
      ).toHaveCount(0);
    }
  });

  test("home dashboard includes statistics chart card headers in Angular; React has none of these sections", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await loginAsAdmin(page);
      await expect(
        page.getByText("Number of successful transactions", { exact: true })
      ).toBeVisible();
      await expect(
        page.getByText("Number of users", { exact: true })
      ).toBeVisible();
      await expect(
        page.getByText("Payment status distribution", { exact: true })
      ).toBeVisible();
    } else {
      await page.goto("/");
      await expect(
        page.getByText("Number of successful transactions", { exact: true })
      ).toHaveCount(0);
    }
  });

  test("payment orders list has Payment Orders title and global search in Angular; React is missing the orders table UI", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await loginAsAdmin(page);
      await page.goto("/payment-orders");
      await expect(
        page.getByRole("heading", { name: "Payment Orders" })
      ).toBeVisible();
      await expect(
        page.getByPlaceholder("Global Search")
      ).toBeVisible();
    } else {
      await page.goto("/payment-orders");
      await expect(
        page.getByRole("heading", { name: "Payment Orders" })
      ).toHaveCount(0);
    }
  });

  test("payment orders table lists Payment Reference column in Angular; React does not show this table", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await loginAsAdmin(page);
      await page.goto("/payment-orders");
      await expect(
        page.getByRole("columnheader", { name: /Payment Reference/ })
      ).toBeVisible();
    } else {
      await page.goto("/payment-orders");
      await expect(
        page.getByRole("columnheader", { name: /Payment Reference/ })
      ).toHaveCount(0);
    }
  });

  test("payment order details page shows order layout sections in Angular; React has no details page", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await loginAsAdmin(page);
      await page.goto("/payment-orders/1", { waitUntil: "domcontentloaded" });
      await expect(
        page.getByRole("heading", { name: "Payment Order Details" })
      ).toBeVisible();
      await expect(
        page.getByText("Payment Details", { exact: true })
      ).toBeVisible();
    } else {
      await page.goto("/payment-orders/1");
      await expect(
        page.getByText("Payment Details", { exact: true })
      ).toHaveCount(0);
    }
  });

  test("user management page shows User Management title and user form in Angular; React is missing the page", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await loginAsAdmin(page);
      await page.goto("/users");
      await expect(
        page.getByRole("heading", { name: "User Management" })
      ).toBeVisible();
      await expect(
        page.getByLabel("First Name", { exact: true })
      ).toBeVisible();
    } else {
      await page.goto("/users");
      await expect(
        page.getByRole("heading", { name: "User Management" })
      ).toHaveCount(0);
    }
  });

  test("users table shows Actions column in Angular; React has no data table", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await loginAsAdmin(page);
      await page.goto("/users");
      await expect(
        page.getByRole("columnheader", { name: "Actions" })
      ).toBeVisible();
    } else {
      await page.goto("/users");
      await expect(
        page.getByRole("columnheader", { name: "Actions" })
      ).toHaveCount(0);
    }
  });

  test("HTTP 404 route shows Not Found page in Angular; React does not render 404 view", async ({
    page,
  }, testInfo) => {
    await page.goto("/this-route-does-not-exist");
    if (testInfo.project.name === "angular") {
      await expect(
        page.getByRole("heading", { name: "404 - Not Found" })
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: "404 - Not Found" })
      ).toHaveCount(0);
    }
  });

  test("forbidden page shows 403 - Forbidden in Angular; React has no 403 view", async ({
    page,
  }, testInfo) => {
    await page.goto("/403");
    if (testInfo.project.name === "angular") {
      await expect(
        page.getByRole("heading", { name: "403 - Forbidden" })
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: "403 - Forbidden" })
      ).toHaveCount(0);
    }
  });

  test("unauthorized page shows 401 - Unauthorized in Angular; React has no 401 view", async ({
    page,
  }, testInfo) => {
    await page.goto("/401");
    if (testInfo.project.name === "angular") {
      await expect(
        page.getByRole("heading", { name: "401 - Unauthorized" })
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: "401 - Unauthorized" })
      ).toHaveCount(0);
    }
  });

  test("React placeholder mentions porting the Angular app; Angular home does not show that string", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "angular") {
      await expect(
        page.getByText(/Replace this with your port of the Angular app/)
      ).toHaveCount(0);
    } else {
      await expect(
        page.getByText(/Replace this with your port of the Angular app/)
      ).toBeVisible();
    }
  });

  test("main React heading uses Admin Dashboard — React; Angular has no H1 with that string", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "angular") {
      await expect(
        page.getByRole("heading", { name: "Admin Dashboard — React" })
      ).toHaveCount(0);
    } else {
      await expect(
        page.getByRole("heading", { name: "Admin Dashboard — React" })
      ).toBeVisible();
    }
  });

  test("payment orders has column filter placeholder for currency in Angular; React not present", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await loginAsAdmin(page);
      await page.goto("/payment-orders");
      await expect(
        page.getByPlaceholder("Search by Currency")
      ).toBeVisible();
    } else {
      await page.goto("/payment-orders");
      await expect(page.getByPlaceholder("Search by Currency")).toHaveCount(0);
    }
  });

  test("forbidden page offers Logout control in Angular; React has no Logout on /403", async ({
    page,
  }, testInfo) => {
    await page.goto("/403");
    if (testInfo.project.name === "angular") {
      await expect(
        page.getByRole("button", { name: "Logout" })
      ).toBeVisible();
    } else {
      await expect(page.getByRole("button", { name: "Logout" })).toHaveCount(0);
    }
  });

  test("not-found page links to home with Go to Homepage in Angular; React has no such link", async ({
    page,
  }, testInfo) => {
    await page.goto("/this-route-does-not-exist");
    if (testInfo.project.name === "angular") {
      await expect(
        page.getByRole("link", { name: "Go to Homepage" })
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("link", { name: "Go to Homepage" })
      ).toHaveCount(0);
    }
  });

  test("unauthorized page links to Login in Angular; React has no Login link on /401", async ({
    page,
  }, testInfo) => {
    await page.goto("/401");
    if (testInfo.project.name === "angular") {
      await expect(
        page.getByRole("link", { name: "Login" })
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("link", { name: "Login" })
      ).toHaveCount(0);
    }
  });

  test("login shows invalid credentials message after bad password in Angular; React has no login flow to show it", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "angular") {
      await page.goto("/login");
      const form = page.locator("app-login form").first();
      await form.getByLabel("Email", { exact: true }).fill("admin@mail.com");
      await form
        .getByLabel("Password", { exact: true })
        .fill("wrong-password");
      await form.getByRole("button", { name: "Login" }).click();
      await expect(
        page.getByText("Invalid email or password", { exact: true })
      ).toBeVisible();
    } else {
      await page.goto("/");
      await expect(
        page.getByText("Invalid email or password", { exact: true })
      ).toHaveCount(0);
    }
  });
});

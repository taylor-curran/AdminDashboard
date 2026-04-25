import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "./authService";

const adminUser = {
  id: "3ad5",
  firstName: "admin",
  lastName: "admin",
  email: "admin@mail.com",
  password: "admin",
  roles: ["Administrator"],
  createdOn: "2024-07-03T19:22:15.464Z",
};

describe("authService", () => {
  beforeEach(() => {
    authService.logout();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    authService.logout();
  });

  it("calls GET /users?email=… and stores user on successful login", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([adminUser]), { status: 200 }),
    );

    const ok = await authService.login("admin@mail.com", "admin");

    expect(ok).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const url = fetchSpy.mock.calls[0][0] as string;
    expect(url).toBe("http://localhost:3000/users?email=admin%40mail.com");
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getCurrentUser()?.email).toBe("admin@mail.com");
    expect(JSON.parse(localStorage.getItem("currentUser")!).email).toBe(
      "admin@mail.com",
    );
  });

  it("returns false and does not store user when password is wrong", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([adminUser]), { status: 200 }),
    );

    const ok = await authService.login("admin@mail.com", "wrong");

    expect(ok).toBe(false);
    expect(authService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem("currentUser")).toBeNull();
  });

  it("returns false when user is not found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("[]", { status: 200 }),
    );

    const ok = await authService.login("nope@mail.com", "x");
    expect(ok).toBe(false);
    expect(authService.isAuthenticated()).toBe(false);
  });

  it("clears the current user on logout", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([adminUser]), { status: 200 }),
    );
    await authService.login("admin@mail.com", "admin");
    expect(authService.isAuthenticated()).toBe(true);

    authService.logout();

    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBeNull();
    expect(localStorage.getItem("currentUser")).toBeNull();
  });
});

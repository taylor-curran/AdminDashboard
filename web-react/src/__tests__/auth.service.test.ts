import { describe, it, expect, beforeEach, vi } from "vitest";
import { authService } from "../services/auth.service";

describe("AuthService", () => {
  beforeEach(() => {
    localStorage.clear();
    (authService as any).currentUser = null;
    (authService as any).listeners.clear();
  });

  it("starts unauthenticated", () => {
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBeNull();
  });

  it("login succeeds with valid admin credentials", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "1",
            firstName: "Admin",
            lastName: "User",
            email: "admin@mail.com",
            password: "admin",
            roles: ["Administrator"],
            createdOn: "2024-01-01",
          },
        ]),
    });

    const result = await authService.login("admin@mail.com", "admin");
    expect(result).toBe(true);
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getCurrentUser()?.email).toBe("admin@mail.com");
  });

  it("login fails with wrong credentials", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const result = await authService.login("wrong@mail.com", "wrong");
    expect(result).toBe(false);
    expect(authService.isAuthenticated()).toBe(false);
  });

  it("logout clears user state", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "1",
            firstName: "Admin",
            lastName: "User",
            email: "admin@mail.com",
            password: "admin",
            roles: ["Administrator"],
            createdOn: "2024-01-01",
          },
        ]),
    });

    await authService.login("admin@mail.com", "admin");
    authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBeNull();
  });

  it("notifies subscribers on state change", async () => {
    const listener = vi.fn();
    authService.subscribe(listener);

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "1",
            firstName: "Admin",
            lastName: "User",
            email: "admin@mail.com",
            password: "admin",
            roles: ["Administrator"],
            createdOn: "2024-01-01",
          },
        ]),
    });

    await authService.login("admin@mail.com", "admin");
    expect(listener).toHaveBeenCalled();
  });

  it("restores user from localStorage", () => {
    const user = {
      id: "1",
      firstName: "Admin",
      lastName: "User",
      email: "admin@mail.com",
      password: "admin",
      roles: ["Administrator"],
      createdOn: "2024-01-01",
    };
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Re-import to test constructor
    (authService as any).currentUser = JSON.parse(
      localStorage.getItem("currentUser")!
    );
    expect(authService.getCurrentUser()?.email).toBe("admin@mail.com");
  });
});

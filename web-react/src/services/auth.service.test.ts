import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { loginLocal } from "./auth.service";

describe("loginLocal", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true and stores user when password matches", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            { email: "a@b.com", password: "secret", roles: ["Administrator"] },
          ]),
      }),
    );
    const ok = await loginLocal("a@b.com", "secret");
    expect(ok).toBe(true);
    const u = JSON.parse(localStorage.getItem("currentUser")!);
    expect(u.email).toBe("a@b.com");
  });

  it("returns false when password does not match", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            { email: "a@b.com", password: "secret", roles: [] },
          ]),
      }),
    );
    const ok = await loginLocal("a@b.com", "wrong");
    expect(ok).toBe(false);
  });
});

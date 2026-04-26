import { describe, expect, it, vi, afterEach } from "vitest";
import { loginWithApi } from "./auth";

describe("loginWithApi", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("GET /users?email= then returns user when password matches", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ email: "a@b.com", password: "secret", roles: ["Administrator"] }],
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = await loginWithApi("a@b.com", "secret");
    expect(user?.email).toBe("a@b.com");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/users?email="),
    );
  });

  it("returns null on wrong password", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ email: "a@b.com", password: "x", roles: [] }],
      }),
    );
    expect(await loginWithApi("a@b.com", "y")).toBeNull();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userService } from "./userService";
import type { User } from "./types";

const sampleUser: User = {
  id: "100",
  firstName: "Test",
  lastName: "User",
  email: "test.user@example.com",
  password: "Password123!",
  roles: ["Customer"],
  createdOn: "2024-07-04T00:00:00.000Z",
};

describe("userService HTTP shape", () => {
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    localStorage.setItem("token", "abc.def");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("getUsers -> GET /users with bearer token", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("[]", { status: 200 }));
    await userService.getUsers();

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("http://localhost:3000/users");
    expect((init as RequestInit | undefined)?.method).toBeUndefined();
    const headers = new Headers((init as RequestInit | undefined)?.headers);
    expect(headers.get("Authorization")).toBe("Bearer abc.def");
  });

  it("getUserById -> GET /users/:id", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(sampleUser), { status: 200 }),
    );
    await userService.getUserById("100");
    expect(fetchSpy.mock.calls[0][0]).toBe("http://localhost:3000/users/100");
  });

  it("createUser -> POST /users with JSON body", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(sampleUser), { status: 201 }),
    );
    await userService.createUser(sampleUser);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("http://localhost:3000/users");
    expect((init as RequestInit).method).toBe("POST");
    const headers = new Headers((init as RequestInit).headers);
    expect(headers.get("Content-Type")).toBe("application/json");
    expect((init as RequestInit).body).toBe(JSON.stringify(sampleUser));
  });

  it("updateUser -> PUT /users/:id with JSON body", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(sampleUser), { status: 200 }),
    );
    await userService.updateUser("100", sampleUser);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("http://localhost:3000/users/100");
    expect((init as RequestInit).method).toBe("PUT");
  });

  it("deleteUser -> DELETE /users/:id", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("{}", { status: 200 }));
    await userService.deleteUser("100");
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("http://localhost:3000/users/100");
    expect((init as RequestInit).method).toBe("DELETE");
  });
});

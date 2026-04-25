import { describe, it, expect, vi, beforeEach } from "vitest";
import { userService } from "../services/user.service";

describe("UserService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getUsers fetches GET /users", async () => {
    const mockUsers = [
      { id: "1", firstName: "John", lastName: "Doe", email: "john@test.com" },
    ];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    });

    const result = await userService.getUsers();
    expect(fetch).toHaveBeenCalledWith("/api/users");
    expect(result).toEqual(mockUsers);
  });

  it("createUser sends POST /api/users", async () => {
    const newUser = {
      firstName: "New",
      lastName: "User",
      email: "new@test.com",
      password: "Pass1234!",
      roles: ["Customer"],
      createdOn: "2024-01-01",
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...newUser, id: "99" }),
    });

    await userService.createUser(newUser);
    expect(fetch).toHaveBeenCalledWith("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
  });

  it("updateUser sends PUT /users/:id", async () => {
    const updated = { firstName: "Updated" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(updated),
    });

    await userService.updateUser("1", updated);
    expect(fetch).toHaveBeenCalledWith("/api/users/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  });

  it("deleteUser sends DELETE /users/:id", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await userService.deleteUser("1");
    expect(fetch).toHaveBeenCalledWith("/api/users/1", {
      method: "DELETE",
    });
  });
});

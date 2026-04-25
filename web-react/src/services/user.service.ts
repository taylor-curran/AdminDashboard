import { User } from "../types";

const API_URL = "/users";

export const userService = {
  async getUsers(): Promise<User[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load users");
    return res.json();
  },

  async getUserById(id: string): Promise<User> {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to load user");
    return res.json();
  },

  async createUser(user: Omit<User, "id">): Promise<User> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  async updateUser(id: string, user: Omit<User, "id">): Promise<User> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  },

  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete user");
  },
};

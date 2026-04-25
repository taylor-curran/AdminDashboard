import { apiFetch, getJSON } from "./http";
import type { User } from "./types";

const API_URL = "/users";

export const userService = {
  getUsers(): Promise<User[]> {
    return getJSON<User[]>(API_URL);
  },

  getUserById(id: string): Promise<User> {
    return getJSON<User>(`${API_URL}/${id}`);
  },

  async createUser(user: User): Promise<User> {
    const res = await apiFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(user),
    });
    return (await res.json()) as User;
  },

  async updateUser(id: string, user: User): Promise<User> {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
    return (await res.json()) as User;
  },

  async deleteUser(id: string): Promise<void> {
    await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
  },
};

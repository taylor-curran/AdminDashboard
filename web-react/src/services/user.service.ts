import type { User } from "../types/user";
import { apiFetch } from "../api/client";

export async function getUsers(): Promise<User[]> {
  const res = await apiFetch("/users");
  if (!res.ok) {
    throw new Error("Something bad happened; please try again later.");
  }
  return res.json() as Promise<User[]>;
}

export async function getUserById(id: string): Promise<User> {
  const res = await apiFetch(`/users/${id}`);
  if (!res.ok) {
    throw new Error("Something bad happened; please try again later.");
  }
  return res.json() as Promise<User>;
}

export async function createUser(user: User): Promise<User> {
  const res = await apiFetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    throw new Error("Something bad happened; please try again later.");
  }
  return res.json() as Promise<User>;
}

export async function updateUser(id: string, user: User): Promise<User> {
  const res = await apiFetch(`/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    throw new Error("Something bad happened; please try again later.");
  }
  return res.json() as Promise<User>;
}

export async function deleteUser(id: string): Promise<void> {
  const res = await apiFetch(`/users/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Something bad happened; please try again later.");
  }
}

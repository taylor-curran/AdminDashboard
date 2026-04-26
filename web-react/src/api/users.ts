import type { User } from "../types";
import { apiDelete, apiGet, apiPost, apiPut } from "./client";

export function getUsers(): Promise<User[]> {
  return apiGet<User[]>("/users");
}

export function getUserById(id: string): Promise<User> {
  return apiGet<User>(`/users/${id}`);
}

export function createUser(user: User): Promise<User> {
  return apiPost<User>("/users", user);
}

export function updateUser(id: string, user: User): Promise<User> {
  return apiPut<User>(`/users/${id}`, user);
}

export function deleteUser(id: string): Promise<void> {
  return apiDelete(`/users/${id}`);
}

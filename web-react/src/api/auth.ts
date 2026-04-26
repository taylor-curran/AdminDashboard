import type { User } from "../types";
import { apiGet } from "./client";

/** Mirrors `AuthService.login` — GET `/users?email=...` then password check. */
export async function loginWithApi(
  email: string,
  password: string,
): Promise<User | null> {
  try {
    const users = await apiGet<User[]>(`/users?email=${encodeURIComponent(email)}`);
    if (users.length > 0) {
      const user = users[0]!;
      if (user.password === password) return user;
    }
    return null;
  } catch {
    return null;
  }
}

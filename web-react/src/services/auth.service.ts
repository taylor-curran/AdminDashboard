import type { User } from "../types/user";
import { USERS_URL } from "../api/client";

const REMOTE_LOGIN_URL =
  "https://webhook.site/a758bb08-0248-488d-86b6-67995ad595a4";

export async function loginRemote(
  email: string,
  password: string,
): Promise<void> {
  const res = await fetch(REMOTE_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Remote login failed");
  }
  const data = (await res.json()) as { token: string };
  localStorage.setItem("token", JSON.stringify(data.token));
}

export async function loginLocal(
  email: string,
  password: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${USERS_URL}?email=${encodeURIComponent(email)}`);
    if (!res.ok) return false;
    const users = (await res.json()) as User[];
    if (users.length > 0) {
      const user = users[0];
      if (user.password === password) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export function loadStoredUser(): User | null {
  const raw = localStorage.getItem("currentUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem("currentUser");
}

export function isAdministrator(user: User | null): boolean {
  return !!user?.roles?.includes("Administrator");
}

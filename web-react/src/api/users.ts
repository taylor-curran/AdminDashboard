export interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
}

const BASE = import.meta.env.VITE_API_BASE ?? "";

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/users`);
  if (!res.ok) throw new Error(`GET /users failed: ${res.status}`);
  return (await res.json()) as User[];
}

// Mirrors the Angular tokenInterceptor: adds Authorization header when a token
// exists in localStorage. Issues requests against `http://localhost:3000` so the
// network log on the json-server matches the Angular reference exactly.

export const API_BASE = "http://localhost:3000";

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = new Headers(init.headers);

  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (
    init.body !== undefined &&
    init.body !== null &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res;
}

export async function getJSON<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  return (await res.json()) as T;
}

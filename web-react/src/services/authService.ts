import { apiFetch } from "./http";
import type { User } from "./types";

const API_URL = "/users";
const STORAGE_KEY = "currentUser";

type Listener = (user: User | null) => void;

class AuthService {
  private current: User | null;
  private listeners = new Set<Listener>();

  constructor() {
    const raw = localStorage.getItem(STORAGE_KEY);
    this.current = raw ? (JSON.parse(raw) as User) : null;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    for (const l of this.listeners) l(this.current);
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const res = await apiFetch(`${API_URL}?email=${encodeURIComponent(email)}`);
      const users = (await res.json()) as User[];
      if (users.length > 0) {
        const user = users[0];
        if (user.password === password) {
          this.current = user;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          this.emit();
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  logout(): void {
    this.current = null;
    localStorage.removeItem(STORAGE_KEY);
    this.emit();
  }

  isAuthenticated(): boolean {
    return !!this.current;
  }

  getCurrentUser(): User | null {
    return this.current;
  }

  /** For tests only. */
  _reset() {
    this.current = null;
    this.listeners.clear();
  }
}

export const authService = new AuthService();

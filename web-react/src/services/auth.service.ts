import { User } from "../types";

const API_URL = "/users";

class AuthService {
  private currentUser: User | null;
  private listeners: Set<(user: User | null) => void> = new Set();

  constructor() {
    const stored = localStorage.getItem("currentUser");
    this.currentUser = stored ? JSON.parse(stored) : null;
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.currentUser));
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
      const users: User[] = await res.json();
      if (users.length > 0) {
        const user = users[0];
        if (user.password === password) {
          this.currentUser = user;
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.notify();
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    this.notify();
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();

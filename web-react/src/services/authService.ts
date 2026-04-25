import axios from 'axios';
import { User } from '../types';

const API_URL = '/api/users';

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      const res = await axios.get<User[]>(`${API_URL}?email=${email}`);
      const users = res.data;
      if (users.length > 0) {
        const user = users[0];
        if (user.password === password) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};

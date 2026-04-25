import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from './authService';

const mockStorage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => {
      mockStorage[key] = value;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
    clear: () => Object.keys(mockStorage).forEach((k) => delete mockStorage[k]),
    length: 0,
    key: () => null,
  });
});

describe('authService', () => {
  describe('getCurrentUser', () => {
    it('should return null if no user in localStorage', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('should return the user from localStorage', () => {
      const user = {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mail.com',
        password: 'admin',
        roles: ['Administrator'],
      };
      mockStorage['currentUser'] = JSON.stringify(user);
      expect(authService.getCurrentUser()).toEqual(user);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user is stored', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true when a user is stored', () => {
      mockStorage['currentUser'] = JSON.stringify({ id: '1' });
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should remove user from localStorage', () => {
      mockStorage['currentUser'] = JSON.stringify({ id: '1' });
      authService.logout();
      expect(mockStorage['currentUser']).toBeUndefined();
    });
  });
});

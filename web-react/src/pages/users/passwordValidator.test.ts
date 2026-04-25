import { describe, it, expect } from 'vitest';
import { validatePassword } from './passwordValidator';

describe('passwordValidator', () => {
  it('should reject password without uppercase letter', () => {
    expect(validatePassword('password1!')).toBe('Password not strong enough.');
  });

  it('should reject password without lowercase letter', () => {
    expect(validatePassword('PASSWORD1!')).toBe('Password not strong enough.');
  });

  it('should reject password without numeric character', () => {
    expect(validatePassword('Password!')).toBe('Password not strong enough.');
  });

  it('should reject password without special character', () => {
    expect(validatePassword('Password1')).toBe('Password not strong enough.');
  });

  it('should accept a valid strong password', () => {
    expect(validatePassword('Password1!')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(validatePassword('')).toBeNull();
  });
});

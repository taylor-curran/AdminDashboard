import { passwordValidator } from './password-validator';
import { FormControl } from '@angular/forms';

describe('passwordValidator', () => {
  const validator = passwordValidator();

  it('should reject password without uppercase letter', () => {
    const control = new FormControl('password1!');
    const result = validator(control);
    expect(result).toEqual({ passwordStrength: true });
  });

  it('should reject password without lowercase letter', () => {
    const control = new FormControl('PASSWORD1!');
    const result = validator(control);
    expect(result).toEqual({ passwordStrength: true });
  });

  it('should reject password without numeric character', () => {
    const control = new FormControl('Password!');
    const result = validator(control);
    expect(result).toEqual({ passwordStrength: true });
  });

  it('should reject password without special character', () => {
    const control = new FormControl('Password1');
    const result = validator(control);
    expect(result).toEqual({ passwordStrength: true });
  });

  it('should accept a valid strong password', () => {
    const control = new FormControl('Password1!');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for empty string', () => {
    const control = new FormControl('');
    const result = validator(control);
    expect(result).toBeNull();
  });
});

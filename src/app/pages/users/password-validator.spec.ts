import { FormControl } from '@angular/forms';
import { passwordValidator } from './password-validator';

describe('passwordValidator', () => {
  const validator = passwordValidator();

  it('returns null for empty value', () => {
    expect(validator(new FormControl(''))).toBeNull();
  });

  it('returns passwordStrength when missing requirements', () => {
    expect(validator(new FormControl('short'))).toEqual({ passwordStrength: true });
    expect(validator(new FormControl('nouppercase1!'))).toEqual({
      passwordStrength: true,
    });
  });

  it('returns null for strong password', () => {
    expect(validator(new FormControl('Abcd1234!'))).toBeNull();
  });
});

import { FormControl } from '@angular/forms';
import { passwordValidator } from './password-validator';

describe('passwordValidator', () => {
  const validator = passwordValidator();

  it('returns null for empty value', () => {
    expect(validator(new FormControl(''))).toBeNull();
  });

  it('accepts strong password', () => {
    const c = new FormControl('Aa1!aaaa');
    expect(validator(c)).toBeNull();
  });

  it('rejects password missing uppercase', () => {
    const c = new FormControl('aa1!aaaa');
    expect(validator(c)).toEqual({ passwordStrength: true });
  });

  it('rejects password missing special character', () => {
    const c = new FormControl('Aa1aaaaa');
    expect(validator(c)).toEqual({ passwordStrength: true });
  });
});

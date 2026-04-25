import { FormControl } from '@angular/forms';
import { passwordValidator } from '../../src/app/pages/users/password-validator';

describe('passwordValidator (Angular reference)', () => {
  const validator = passwordValidator();
  const cases: Array<[string, boolean]> = [
    ['', true],
    ['Password123!', true],
    ['password123!', false],
    ['PASSWORD123!', false],
    ['Password!', false],
    ['Password123', false],
    ['A1b!', true],
    ['abcdef', false],
  ];

  for (const [value, valid] of cases) {
    it(`"${value}" -> ${valid ? 'valid' : 'invalid'}`, () => {
      const result = validator(new FormControl(value));
      if (valid) {
        expect(result).toBeNull();
      } else {
        expect(result).toEqual({ passwordStrength: true });
      }
    });
  }
});

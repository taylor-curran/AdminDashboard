import { describe, expect, it } from "vitest";
import { validatePasswordStrength } from "./passwordValidator";

// Mirror of Angular passwordValidator: returns true when the password is valid,
// false when it is not. An empty password is treated as "no error".
describe("validatePasswordStrength", () => {
  const cases: Array<[string, boolean]> = [
    ["", true],
    ["Password123!", true],
    ["password123!", false], // no upper case
    ["PASSWORD123!", false], // no lower case
    ["Password!", false], // no number
    ["Password123", false], // no special character
    ["A1b!", true], // short but contains all classes
    ["abcdef", false],
  ];

  for (const [pwd, expected] of cases) {
    it(`"${pwd}" -> ${expected}`, () => {
      expect(validatePasswordStrength(pwd)).toBe(expected);
    });
  }
});

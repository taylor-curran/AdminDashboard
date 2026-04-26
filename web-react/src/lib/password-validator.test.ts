import { describe, expect, it } from "vitest";
import { validatePasswordStrength } from "./password-validator";

describe("validatePasswordStrength", () => {
  it("matches Angular passwordValidator: empty is valid (no error)", () => {
    expect(validatePasswordStrength("")).toBe(true);
  });

  it("rejects weak passwords", () => {
    expect(validatePasswordStrength("short")).toBe(false);
    expect(validatePasswordStrength("nouppercase1!")).toBe(false);
  });

  it("accepts strong password", () => {
    expect(validatePasswordStrength("Abcd1234!")).toBe(true);
  });
});

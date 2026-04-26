import { describe, expect, it } from "vitest";
import { isPasswordStrong } from "./password-validator";

describe("isPasswordStrong", () => {
  it("returns true for empty", () => {
    expect(isPasswordStrong("")).toBe(true);
  });

  it("accepts strong password", () => {
    expect(isPasswordStrong("Aa1!aaaa")).toBe(true);
  });

  it("rejects missing uppercase", () => {
    expect(isPasswordStrong("aa1!aaaa")).toBe(false);
  });

  it("rejects missing special character", () => {
    expect(isPasswordStrong("Aa1aaaaa")).toBe(false);
  });
});

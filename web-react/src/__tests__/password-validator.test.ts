import { describe, it, expect } from "vitest";
import { validatePassword } from "../pages/users/password-validator";

describe("validatePassword", () => {
  it("returns null for a strong password", () => {
    expect(validatePassword("Test1234!")).toBeNull();
  });

  it("returns error for password without uppercase", () => {
    expect(validatePassword("test1234!")).toBe("passwordStrength");
  });

  it("returns error for password without lowercase", () => {
    expect(validatePassword("TEST1234!")).toBe("passwordStrength");
  });

  it("returns error for password without numeric", () => {
    expect(validatePassword("TestTest!")).toBe("passwordStrength");
  });

  it("returns error for password without special character", () => {
    expect(validatePassword("Test1234")).toBe("passwordStrength");
  });

  it("returns null for empty string", () => {
    expect(validatePassword("")).toBeNull();
  });
});

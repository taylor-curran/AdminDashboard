export function validatePassword(value: string): string | null {
  if (!value) return null;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialCharacter;
  return passwordValid ? null : "passwordStrength";
}

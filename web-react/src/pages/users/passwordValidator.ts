export function validatePasswordStrength(value: string): boolean {
  if (!value) return true; // mirror Angular: empty -> no error
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  return hasUpperCase && hasLowerCase && hasNumeric && hasSpecialCharacter;
}

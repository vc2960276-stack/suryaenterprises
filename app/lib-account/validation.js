// Browser-safe account validation, separate from password/JWT cryptography.
export const normaliseEmail = value => String(value ?? "").trim().toLowerCase();
export function normalisePhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}
export const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
export const isValidPhone = value => /^[6-9]\d{9}$/.test(value);
export const isValidPin = value => /^[1-9]\d{5}$/.test(value);

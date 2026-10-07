// Address validation shared by the addresses routes and checkout save.
import { isValidPhone, isValidPin, normalisePhone } from "./validation";

const clean = (v, max) => String(v ?? "").trim().slice(0, max);

export function validateAddress(input) {
  const a = {
    label: clean(input.label || "Home", 40),
    firstName: clean(input.firstName, 60),
    lastName: clean(input.lastName, 60),
    address: clean(input.address, 200),
    apartment: clean(input.apartment, 120),
    city: clean(input.city, 80),
    state: clean(input.state, 60),
    pinCode: clean(input.pinCode, 6),
    phone: normalisePhone(input.phone),
    isDefault: Boolean(input.isDefault),
  };
  if (!a.firstName) return { error: "First name is required.", field: "firstName" };
  if (!a.address) return { error: "House number and street are required.", field: "address" };
  if (!a.city) return { error: "Town / city is required.", field: "city" };
  if (!a.state) return { error: "State is required.", field: "state" };
  if (!isValidPin(a.pinCode)) return { error: "Enter a valid 6-digit PIN code.", field: "pinCode" };
  if (a.phone && !isValidPhone(a.phone)) return { error: "Enter a valid 10-digit mobile number.", field: "phone" };
  return { value: a };
}

// Two addresses are "the same place" when the street, city and PIN match.
export const sameAddress = (a, b) =>
  a.address.trim().toLowerCase() === String(b.address ?? "").trim().toLowerCase() &&
  a.city.trim().toLowerCase() === String(b.city ?? "").trim().toLowerCase() &&
  a.pinCode === String(b.pinCode ?? "");

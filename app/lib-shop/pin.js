// Delivery PIN: localStorage["surya-pin"] = "110055" (plain string).
import { createLocalStore } from "./local-store";

const identity = (v) => v;

const store = createLocalStore({
  key: "surya-pin",
  event: "surya-pin-updated",
  empty: "",
  parse: identity,
  serialize: identity,
});

export const PIN_PATTERN = /^[1-9][0-9]{5}$/;
export const usePin = store.useValue;
export const isValidPin = (pin) => PIN_PATTERN.test(String(pin).trim());

export function savePin(pin) {
  const value = String(pin).trim();
  if (!isValidPin(value)) return false;
  store.write(value);
  return true;
}

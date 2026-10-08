// Safe to share with client components; raw stored mobiles stay on the server.
export function maskMobile(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.length >= 4 ? `******${digits.slice(-4)}` : "*".repeat(digits.length);
}

export function parseIndianMobile(value) {
  if (typeof value !== "string" || value.length > 32 || !/^\+?[\d\s()-]+$/.test(value.trim())) return "";
  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  return /^[6-9]\d{9}$/.test(digits) ? digits : "";
}

export function maskMobileReferences(value, mobiles) {
  let text = String(value ?? "");
  const references = new Set(mobiles.flatMap(mobile => [String(mobile ?? "").replace(/\D/g, ""), parseIndianMobile(String(mobile ?? ""))]).filter(digits => digits.length >= 10));
  for (const digits of [...references].sort((a, b) => b.length - a.length)) text = text.replaceAll(digits, maskMobile(digits));
  return text;
}

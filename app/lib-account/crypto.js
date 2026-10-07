// Dependency-free password hashing (scrypt) and HS256 JWTs for customer
// sessions. Pure Node — no Next imports — so it is unit-testable.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_N = 16384;
const SCRYPT_KEYLEN = 64;

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(String(password), salt, SCRYPT_KEYLEN, { N: SCRYPT_N });
  return `scrypt$${SCRYPT_N}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function verifyPassword(password, stored) {
  if (typeof stored !== "string") return false;
  const [scheme, n, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64url");
  const actual = scryptSync(String(password), Buffer.from(saltB64, "base64url"), expected.length, { N: Number(n) || SCRYPT_N });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

const b64url = (input) => Buffer.from(typeof input === "string" ? input : JSON.stringify(input)).toString("base64url");

function hmac(secret, data) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function signJwt(payload, secret, { expiresInSeconds = 60 * 60 * 24 * 30 } = {}) {
  if (!secret || String(secret).length < 32) throw new Error("JWT secret must be at least 32 characters");
  const now = Math.floor(Date.now() / 1000);
  const header = b64url({ alg: "HS256", typ: "JWT" });
  const body = b64url({ ...payload, iat: now, exp: now + expiresInSeconds });
  const data = `${header}.${body}`;
  return `${data}.${hmac(secret, data)}`;
}

export function verifyJwt(token, secret) {
  if (typeof token !== "string" || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expected = hmac(secret, `${header}.${body}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// --- input normalisation shared by the account routes -----------------------
export const normaliseEmail = (v) => String(v ?? "").trim().toLowerCase();

// Indian mobile: keep the last 10 digits (drops +91 / 0 prefixes).
export function normalisePhone(v) {
  const digits = String(v ?? "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
export const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v);
export const isValidPin = (v) => /^[1-9]\d{5}$/.test(v);

import test from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword, verifyPassword, signJwt, verifyJwt, normalisePhone, normaliseEmail, isValidPhone, isValidPin,
} from "../crypto.js";

const SECRET = "test-secret-that-is-definitely-longer-than-32-chars";

test("passwords hash with a random salt and verify", () => {
  const a = hashPassword("Sunflower#2026");
  const b = hashPassword("Sunflower#2026");
  assert.notEqual(a, b);
  assert.ok(a.startsWith("scrypt$"));
  assert.equal(verifyPassword("Sunflower#2026", a), true);
  assert.equal(verifyPassword("sunflower#2026", a), false);
  assert.equal(verifyPassword("anything", "not-a-hash"), false);
});

test("JWT round-trips and rejects tampering and expiry", () => {
  const token = signJwt({ sub: "abc", email: "x@y.in" }, SECRET, { expiresInSeconds: 60 });
  const payload = verifyJwt(token, SECRET);
  assert.equal(payload.sub, "abc");
  assert.equal(payload.email, "x@y.in");
  assert.equal(verifyJwt(token, "another-secret-that-is-also-32-characters-long"), null);
  const [h, b, s] = token.split(".");
  const forged = `${h}.${Buffer.from(JSON.stringify({ sub: "evil", exp: 9999999999 })).toString("base64url")}.${s}`;
  assert.equal(verifyJwt(forged, SECRET), null);
  const expired = signJwt({ sub: "abc" }, SECRET, { expiresInSeconds: -5 });
  assert.equal(verifyJwt(expired, SECRET), null);
  assert.throws(() => signJwt({ sub: "abc" }, "short"));
});

test("Indian phone/email/PIN normalisation", () => {
  assert.equal(normalisePhone("+91 96503 00157"), "9650300157");
  assert.equal(normalisePhone("09650300157"), "9650300157");
  assert.equal(isValidPhone("9650300157"), true);
  assert.equal(isValidPhone("1234567890"), false);
  assert.equal(normaliseEmail("  Farmer@Example.IN "), "farmer@example.in");
  assert.equal(isValidPin("302013"), true);
  assert.equal(isValidPin("012345"), false);
});

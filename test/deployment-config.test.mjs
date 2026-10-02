import { test } from "node:test";
import assert from "node:assert/strict";
import { gatewayRewrites, validatePaymentEnvironment } from "../deployment-config.mjs";

const production = {
  NODE_ENV: "production", PUBLIC_BASE_URL: "https://suryaenter.in",
  PAYIN_BACKEND_ORIGIN: "https://api.suryaenter.in", MONGO_URL: "mongodb://127.0.0.1:27017/", DB_NAME: "SURYAENTERPRISES",
  PAYU_ENV: "production", PAYU_KEY: "configured-key", PAYU_SALT: "configured-salt", PAYIN_API_TOKEN: "a".repeat(64),
  PAYIN_BACKEND_WEBHOOK_URL: "https://suryaenter.in/gateway/api/webhooks/payu/payment"
};

test("gateway rewrites preserve payment assets, status, cancellation and merchant API paths", () => {
  const rules = gatewayRewrites(production);
  assert.deepEqual(rules, [
    { source: "/pay/:path*", destination: "https://api.suryaenter.in/pay/:path*" },
    { source: "/gateway/:path*", destination: "https://api.suryaenter.in/:path*" }
  ]);
  assert.deepEqual(gatewayRewrites({}), []);
  for (const target of ["http://localhost:8001", "https://suryaenter.in", "https://www.suryaenter.in", "https://user:pass@backend.host", "https://backend.host/path", "https://backend.example"]) {
    assert.throws(() => gatewayRewrites({ ...production, PAYIN_BACKEND_ORIGIN: target }), /PAYIN_BACKEND_ORIGIN/);
  }
});

test("production uses the deployed backend when its optional hosting override is absent", () => {
  const expected = [
    { source: "/pay/:path*", destination: "https://payin-frontend-hy1p.vercel.app/pay/:path*" },
    { source: "/gateway/:path*", destination: "https://payin-frontend-hy1p.vercel.app/:path*" }
  ];
  for (const value of [undefined, "", "   "]) {
    assert.deepEqual(gatewayRewrites({ NODE_ENV: "production", PAYIN_BACKEND_ORIGIN: value }), expected);
    assert.doesNotThrow(() => validatePaymentEnvironment({
      ...production, PAYIN_BACKEND_ORIGIN: value, PUBLIC_BASE_URL: undefined,
      PAYIN_BACKEND_WEBHOOK_URL: "https://www.suryaenter.in/gateway/api/webhooks/payu/payment"
    }));
  }
});

test("live payment runtime rejects missing callback configuration and sandbox credentials", () => {
  assert.doesNotThrow(() => validatePaymentEnvironment(production));
  for (const [key, value] of Object.entries({ PAYU_ENV: "test", PAYU_KEY: "", PAYU_SALT: "<salt>", PAYIN_API_TOKEN: "short", DB_NAME: "test", PAYIN_BACKEND_WEBHOOK_URL: "http://localhost:8001/api/webhooks/payu/payment" })) {
    assert.throws(() => validatePaymentEnvironment({ ...production, [key]: value }), new RegExp(key));
  }
  assert.doesNotThrow(() => validatePaymentEnvironment({ NODE_ENV: "development" }));
});

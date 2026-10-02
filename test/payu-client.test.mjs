import { test } from "node:test";
import assert from "node:assert/strict";

test("provider intent and verification preserve references, bound requests, and keep private errors off the API", async () => {
  const previous = Object.fromEntries(["PAYU_ENV", "PAYU_KEY", "PAYU_SALT"].map(key => [key, process.env[key]]));
  Object.assign(process.env, { PAYU_ENV: "test", PAYU_KEY: "synthetic-key", PAYU_SALT: "synthetic-salt" });
  const originalFetch = global.fetch;
  const { createPayUIntent, verifyPayUPayment } = await import("../app/lib/payu.js");
  const input = { txnid: "SYNTHETIC-ORDER", amount: 1, productinfo: "Test", firstname: "Customer", email: "customer@example.invalid", phone: "0000000000", successUrl: "https://www.suryaenter.in/api/payin/payu-callback", failureUrl: "https://www.suryaenter.in/api/payin/payu-callback" };
  let response = { result: { intentURIData: "pa=fixture%40invalid&am=1.00&cu=INR&tr=PROVIDER-REFERENCE", paymentId: "PROVIDER-ID" } };
  let httpStatus = 200;
  const requests = [];
  global.fetch = async (url, options) => {
    requests.push({ url, options });
    return new Response(JSON.stringify(response), { status: httpStatus });
  };
  try {
    const result = await createPayUIntent(input);
    assert.equal(result.intentUri, `upi://pay?${response.result.intentURIData}`);
    assert.equal(result.paymentId, "PROVIDER-ID");
    assert.equal(new URLSearchParams(requests[0].options.body).get("txn_s2s_flow"), "4");
    response = { transaction_details: { "SYNTHETIC-ORDER": { status: "pending" } } };
    assert.deepEqual(await verifyPayUPayment(input.txnid), response);
    for (const request of requests) {
      assert.ok(request.options.signal instanceof AbortSignal);
      assert.equal(request.options.signal.aborted, false);
      assert.equal(request.options.cache, "no-store");
    }
    response = { message: "PRIVATE-PROVIDER-DATA", result: { customer: "PRIVATE-CUSTOMER-DATA" } };
    for (const status of [200, 502]) {
      httpStatus = status;
      await assert.rejects(createPayUIntent(input), error => !/PRIVATE-/.test(error.message));
    }
    await assert.rejects(verifyPayUPayment(input.txnid), error => !/PRIVATE-/.test(error.message));

    // Keep the provider's retry advice while never exposing its response body.
    global.fetch = async () => new Response("Too many requests PRIVATE-KEY PRIVATE-CUSTOMER", {
      status: 429, headers: { "Retry-After": "120", "X-Request-Id": "synthetic-request-id" },
    });
    for (const operation of [() => createPayUIntent(input), () => verifyPayUPayment(input.txnid)]) {
      await assert.rejects(operation, error => {
        assert.equal(error.code, "PAYMENT_PROVIDER_RATE_LIMITED");
        assert.equal(error.retryAfterSeconds, 120);
        assert.equal(error.providerDiagnostics.httpStatus, 429);
        assert.equal(error.providerDiagnostics.rateLimitMentioned, true);
        assert.equal(error.providerDiagnostics.requestId, "synthetic-request-id");
        assert.doesNotMatch(JSON.stringify(error) + error.message, /PRIVATE-/);
        return true;
      });
    }
    global.fetch = async () => new Response("<html>PRIVATE-DATA</html>", {
      status: 429, headers: { "Retry-After": "not-a-duration" },
    });
    await assert.rejects(createPayUIntent(input), error => {
      assert.equal(error.retryAfterSeconds, undefined);
      assert.equal(error.providerDiagnostics.responseFormat, "html");
      assert.doesNotMatch(JSON.stringify(error), /PRIVATE-/);
      return true;
    });
  } finally {
    global.fetch = originalFetch;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

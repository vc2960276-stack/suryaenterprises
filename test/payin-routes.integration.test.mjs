import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import mongoose from "mongoose";
import { NextResponse } from "next/server.js";

const uri = process.env.PAYIN_TEST_MONGO_URI;

test("Surya routes create and verify real isolated orders, validate callbacks and retry dropped relays", { skip: !uri, timeout: 45000 }, async t => {
  Object.assign(process.env, { PAYU_ENV: "test", PAYU_KEY: "synthetic-key", PAYU_SALT: "synthetic-salt",
    PAYIN_API_TOKEN: "synthetic-bridge-token", PUBLIC_BASE_URL: "https://store.example",
    PAYIN_BACKEND_WEBHOOK_URL: "https://gateway.example/api/webhooks/payu/payment" });
  const payu = await import("../app/lib/payu.js");
  const payment = await import("../app/lib/paymentStatus.js");
  const { default: Order } = await import("../app/models/Order.js");
  const originalFetch = global.fetch;
  const dbName = `surya_payin_e2e_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const truth = new Map();
  let relayStatus = 200, relayCount = 0, providerStatus = 200;
  // Execute the production handlers with their import dependencies injected.
  // No route logic or financial query is replaced; MongoDB and PayU SDK run normally.
  globalThis.__suryaPayinFixture = { crypto, NextResponse, connectDB: async () => mongoose.connection, Order, ...payu, ...payment };
  const load = async path => {
    const source = (await readFile(new URL(path, import.meta.url), "utf8")).replace(/^import .*;\r?$/gm, "");
    return import(`data:text/javascript;base64,${Buffer.from(`const { crypto, NextResponse, connectDB, Order, createPayUIntent, verifyPayUPayment, verifyPayUCallbackHash, refreshOrderPayment, verifiedPaymentUpdate } = globalThis.__suryaPayinFixture;\n${source}`).toString("base64")}`);
  };
  const create = await load("../app/api/payin/create-order/route.js");
  const check = await load("../app/api/payin/check-status/route.js");
  const callback = await load("../app/api/payin/payu-callback/route.js");
  const call = async (handler, body, { form = false, token = process.env.PAYIN_API_TOKEN } = {}) => {
    const response = await handler.POST(new Request("https://store.example/api/payin/test", { method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": form ? "application/x-www-form-urlencoded" : "application/json" },
      body: form ? new URLSearchParams(body).toString() : JSON.stringify(body) }));
    return { status: response.status, body: await response.json() };
  };
  global.fetch = async (url, options) => {
    if (url === process.env.PAYIN_BACKEND_WEBHOOK_URL) {
      relayCount++;
      return Response.json({ success: relayStatus === 200 }, { status: relayStatus });
    }
    assert.match(url, /^https:\/\/(test\.payu\.in|secure\.payu\.in)\//);
    const params = new URLSearchParams(options.body);
    const txnid = params.get("txnid") || params.get("var1");
    if (params.get("command") === "verify_payment") {
      const expected = crypto.createHash("sha512").update(`synthetic-key|verify_payment|${txnid}|synthetic-salt`).digest("hex");
      assert.equal(params.get("hash"), expected);
      return Response.json({ status: 1, transaction_details: { [txnid]: truth.get(txnid) } }, { status: providerStatus });
    }
    assert.equal(params.get("hash"), payu.generatePayUPaymentHash({ txnid, amount: params.get("amount"), productinfo: params.get("productinfo"),
      firstname: params.get("firstname"), email: params.get("email"), udf1: params.get("udf1") }));
    const entry = { txnid, amt: params.get("amount"), status: "pending", unmappedstatus: "pending", mihpayid: `PID-${txnid}`, bank_ref_num: null };
    truth.set(txnid, entry);
    return Response.json({ result: { paymentId: entry.mihpayid, intentURIData: `pa=fixture%40invalid&am=${entry.amt}&cu=INR&tr=${txnid}` } });
  };
  let order;
  const signed = extra => {
    const data = { key: "synthetic-key", txnid: order.transactionId, amount: "500.00", status: "success", productinfo: "Payment",
      firstname: "Customer", email: "fixture@example.invalid", bank_ref_num: "CALLBACK-FAKE-UTR", ...extra };
    const values = ["synthetic-salt", data.status, ...Array(10).fill(""), data.email, data.firstname, data.productinfo, data.amount, data.txnid, data.key];
    data.hash = crypto.createHash("sha512").update(values.join("|")).digest("hex");
    return data;
  };
  try {
    await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10000 });
    await Order.init();
    await t.test("create-order preserves UPI references and blocks invalid credentials and duplicates", async () => {
      const body = { order_id: "SYNTHETIC-CROSS-REPO", amount: 500, name: "Customer", email: "fixture@example.invalid", mobile: "9999999999" };
      assert.equal((await call(create, body, { token: "invalid" })).status, 401);
      const result = await call(create, body);
      assert.equal(result.status, 200);
      assert.equal(result.body.status, "success");
      assert.match(result.body.data.deep_link, /^upi:\/\/pay\?/);
      order = await Order.findOne({ orderId: body.order_id });
      assert.ok(order.transactionId.length <= 25);
      assert.equal((await call(create, body)).status, 409);
      assert.equal((await call(check, { order_id: order.orderId })).body.data.payment_status, "pending");
    });
    await t.test("provider uncertainty and forged callback metadata do not produce fake success", async () => {
      assert.equal((await call(callback, { ...signed(), hash: "0".repeat(128) }, { form: true })).status, 400);
      assert.equal((await call(callback, signed({ amount: "1.00" }), { form: true })).status, 400);
      assert.equal((await call(callback, signed(), { form: true })).status, 503);
      assert.equal((await Order.findById(order._id)).paymentStatus, "pending");
      const actual = truth.get(order.transactionId);
      actual.status = "success";
      actual.unmappedstatus = "auth";
      assert.equal((await call(check, { order_id: order.orderId })).body.data.payment_status, "pending");
      actual.unmappedstatus = "captured";
      actual.amt = "1.00";
      assert.equal((await call(check, { order_id: order.orderId })).body.data.payment_status, "pending");
      actual.amt = "500.00";
      providerStatus = 429;
      assert.equal((await call(check, { order_id: order.orderId })).body.data.payment_status, "pending");
      providerStatus = 200;
      actual.status = "failed";
      assert.equal((await call(check, { order_id: order.orderId })).body.data.payment_status, "failed");
    });
    await t.test("late success recovers failure, uses authoritative UTR and retries a dropped backend relay", async () => {
      const actual = truth.get(order.transactionId);
      actual.status = "success";
      actual.unmappedstatus = "captured";
      actual.bank_ref_num = "PAYU-VERIFIED-UTR";
      relayStatus = 503;
      assert.equal((await call(callback, signed(), { form: true })).status, 503);
      const stored = await Order.findById(order._id);
      assert.equal(stored.paymentStatus, "paid");
      assert.equal(stored.payuBankRefNum, "PAYU-VERIFIED-UTR");
      relayStatus = 200;
      const response = await call(callback, signed(), { form: true });
      assert.equal(response.status, 200);
      assert.equal(relayCount, 2);
      const before = (await Order.findById(order._id)).payuBankRefNum;
      await Promise.all(Array.from({ length: 8 }, () => call(callback, signed({ status: "failed" }), { form: true })));
      assert.equal((await Order.findById(order._id)).paymentStatus, "paid");
      assert.equal((await Order.findById(order._id)).payuBankRefNum, before);
      assert.equal((await call(check, { order_id: order.orderId })).body.data.utr, "PAYU-VERIFIED-UTR");
    });
  } finally {
    global.fetch = originalFetch;
    delete globalThis.__suryaPayinFixture;
    if (mongoose.connection.readyState === 1 && mongoose.connection.name === dbName) await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import { processRecoveryWork, publishRecoveryWork, validRecoveryWork, RECOVERY_TOPIC } from "../app/lib/paymentRecoveryQueue.js";

const id = "SE1791000000000abcdef1234";
const work = { transaction_id: id, kind: "payment", generation: 0 };
const setup = () => Object.assign(process.env, { PAYIN_API_TOKEN: "synthetic-server-token", PAYIN_BACKEND_ORIGIN: "https://gateway.example" });

test("a durable next step is published before ack and lost publish acknowledgments use the same dedup key", async () => {
  setup();
  const keys = [], chain = [], received = [];
  let lostAck = true;
  const sendMessage = async (topic, message, options) => {
    assert.equal(topic, RECOVERY_TOPIC);
    keys.push(options.idempotencyKey);
    if (!chain.find(row => row.key === options.idempotencyKey)) chain.push({ ...message, key: options.idempotencyKey });
    assert.equal(options.retentionSeconds, 604800);
    assert.equal(options.delaySeconds, 5);
    if (lostAck) { lostAck = false; throw new Error("Synthetic lost queue ACK"); }
  };
  const request = async (url, options) => {
    received.push(JSON.parse(options.body));
    assert.equal(url, "https://gateway.example/api/internal/payments/reconcile-order");
    assert.equal(options.headers.Authorization, "Bearer synthetic-server-token");
    assert.equal(options.redirect, "error");
    return Response.json({ success: true, complete: false, retry_after_seconds: 5 });
  };
  const publish = (message, options) => publishRecoveryWork(message, { ...options, sendMessage });
  await assert.rejects(processRecoveryWork(work, { request, publish }), /lost queue ACK/);
  // The queue redelivers the original step on another function invocation.
  await processRecoveryWork(work, { request, publish });
  assert.deepEqual(keys, [`payment:${id}:1`, `payment:${id}:1`]);
  assert.equal(chain.length, 1);
  assert.equal(chain[0].generation, 1);
  assert.equal(received.length, 2);
  // Only identifier and kind cross the server bridge, never payment claims.
  assert.deepEqual(received[0], { transaction_id: id, kind: "payment" });
});

test("backend failures remain retryable and delivered callbacks finish without extra jobs", async () => {
  setup();
  let published = 0;
  const publish = async () => { published++; };
  for (const status of [401, 404, 429, 500, 503]) {
    await assert.rejects(processRecoveryWork(work, { request: async () => new Response("", { status }), publish }), new RegExp(`HTTP ${status}`));
  }
  await assert.rejects(processRecoveryWork(work, { request: async () => { throw new Error("Timeout"); }, publish }), /Timeout/);
  await processRecoveryWork(work, { request: async () => Response.json({ success: true, complete: true }), publish });
  assert.equal(published, 0);
});

test("owed callbacks continue in independent invocations with a capped retry delay", async () => {
  setup();
  let deliveries = 0, message = { ...work, kind: "callback", event_id: `${id}:success` };
  const request = async () => Response.json({ success: true, complete: ++deliveries === 80, retry_after_seconds: 30 });
  const delays = [], keys = new Set();
  while (message) {
    const current = message; message = null;
    await processRecoveryWork(current, { request, publish: async (next, options) => {
      await publishRecoveryWork(next, { ...options, sendMessage: async (_topic, row, sendOptions) => {
        assert.ok(!keys.has(sendOptions.idempotencyKey)); keys.add(sendOptions.idempotencyKey);
        delays.push(sendOptions.delaySeconds); message = row;
      } });
    } });
  }
  assert.equal(deliveries, 80);
  assert.equal(delays.length, 79);
  assert.ok(delays.every(delay => delay === 30));
});

test("consumer is private and producers reject malformed or forged event identifiers", async () => {
  assert.equal(validRecoveryWork(work), true);
  for (const invalid of [{ ...work, transaction_id: "other" }, { ...work, generation: -1 },
    { ...work, event_id: "OTHER:success" }, { ...work, kind: "credit" }]) {
    assert.equal(validRecoveryWork(invalid), false);
  }
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(config.functions["app/api/queues/payment-recovery/route.js"].experimentalTriggers[0].type, "queue/v2beta");
});

test("the server producer requires its bridge token and queues only validated identifiers", async () => {
  setup();
  const jobs = [];
  globalThis.__queueProducerFixture = { crypto, validRecoveryWork,
    enqueuePaymentRecovery: async (...args) => { jobs.push(args); return true; } };
  try {
    const source = (await readFile(new URL("../app/api/internal/payin/recovery/route.js", import.meta.url), "utf8"))
      .replace(/^import .*;\r?$/gm, "");
    const route = await import(`data:text/javascript;base64,${Buffer.from(`const { crypto, validRecoveryWork, enqueuePaymentRecovery } = globalThis.__queueProducerFixture;\n${source}`).toString("base64")}`);
    const call = (body, token = "synthetic-server-token") => route.POST(new Request("https://store.example/api/internal/payin/recovery", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body),
    }));
    assert.equal((await call(work, "wrong")).status, 401);
    assert.equal((await call({ ...work, event_id: "OTHER:success" })).status, 400);
    assert.equal((await call({ ...work, kind: "credit" })).status, 400);
    assert.equal(jobs.length, 0);
    assert.equal((await call(work)).status, 202);
    assert.equal(jobs.length, 1);
    assert.deepEqual(jobs[0], [id, { kind: "payment", eventId: undefined }]);
  } finally { delete globalThis.__queueProducerFixture; }
});

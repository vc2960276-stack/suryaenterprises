import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { hashPassword } from "../app/lib-account/crypto.js";
import { createAdminAuth, ensureAdminIndexes } from "../app/lib-admin/auth-store.mjs";
import { createOrdersStore } from "../app/lib-admin/orders-store.mjs";
import { dashboardFilters } from "../app/lib-admin/core.mjs";

const uri = process.env.PAYIN_TEST_MONGO_URI;
test("private admin authenticates, reconciles real Mongo rows and logs fulfillment without financial writes", { skip: !uri, timeout: 45000 }, async t => {
  const dbName = `surya_admin_e2e_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const conn = await mongoose.createConnection(uri, { dbName, serverSelectionTimeoutMS: 10000, maxPoolSize: 4 }).asPromise();
  const db = conn.db, gateway = conn.getClient().db(`${dbName}_gateway`);
  const now = new Date("2026-10-08T10:00:00Z"), clock = () => now;
  const catalog = [{ sku: "P500", name: "Fixture seeds", price: 500, image: "/assets/catalog/abc.webp", unit: "100 g", category: "Seeds" },
    { sku: "P400", name: "Fixture nutrition", price: 400, image: "/assets/catalog/def.webp", unit: "1 kg", category: "Crop Nutrition" }];
  const base = { provider: "payu", paymentStatus: "paid", createdAt: new Date("2026-10-06T12:00:00Z"), updatedAt: new Date("2026-10-08T09:00:00Z"),
    customer: { firstName: "Fixture", lastName: "Buyer", email: "fixture@example.invalid", phone: "9999999999" } };
  const a = { _id: new mongoose.Types.ObjectId(), ...base, orderId: "GATEWAY-A", transactionId: "PAYU-TXN-A", subtotal: 500, payuPaymentId: "PAYU-ID-A", payuBankRefNum: "REAL-UTR-A", paidAt: new Date("2026-10-08T08:00:00Z") };
  const b = { _id: new mongoose.Types.ObjectId(), ...base, orderId: "STORE-B", transactionId: "PAYU-TXN-B", subtotal: 400, payuPaymentId: "PAYU-ID-B",
    items: [{ sku: "P400", name: "Fixture nutrition", price: 400, quantity: 1 }] };
  const c = { _id: new mongoose.Types.ObjectId(), ...base, orderId: "GATEWAY-C", transactionId: "PAYU-TXN-C", subtotal: 450, payuPaymentId: "PAYU-ID-C", updatedAt: new Date("2026-10-07T07:00:00Z") };
  try {
    await ensureAdminIndexes(db);
    await db.collection("store_admin_settings").insertOne({ _id: "access", keyHash: hashPassword("synthetic-admin-key") });
    await db.collection("orders").insertMany([a, b, c, { ...base, orderId: "PENDING", subtotal: 900, payuPaymentId: "PENDING-ID", paymentStatus: "pending" },
      { ...base, orderId: "FAILED", subtotal: 900, payuPaymentId: "FAILED-ID", paymentStatus: "failed" }, { ...base, orderId: "NO-PROVIDER-ID", subtotal: 900 }]);
    await gateway.collection("transactions").insertMany([{ transactionId: a.orderId, orderId: "ORIGINAL-MERCHANT-A", status: "SUCCESS", provider: "PAYU", amount: 500, payuId: a.payuPaymentId, callbackStatus: "SENT", paidAt: a.paidAt },
      { transactionId: c.orderId, orderId: "MISMATCHED-PAYMENT", status: "SUCCESS", provider: "PAYU", amount: 1, payuId: c.payuPaymentId }]);
    const auth = createAdminAuth(db, { now: clock });
    await t.test("key-only sessions reject bad/tampered tokens, expire and revoke on rotation", async () => {
      await assert.rejects(auth.login("wrong", "ip-a"), e => e.status === 401);
      const token = await auth.login("synthetic-admin-key", "ip-a");
      assert.ok(await auth.read(token)); assert.equal(await auth.read(`${token.slice(0, 63)}x`), null);
      const stored = await db.collection("store_admin_sessions").findOne({}); assert.notEqual(stored._id, token);
      await auth.logout(token); assert.equal(await auth.read(token), null);
      const again = await auth.login("synthetic-admin-key", "ip-b");
      const later = createAdminAuth(db, { now: () => new Date(now.getTime() + 9 * 3600000) }); assert.equal(await later.read(again), null);
      await db.collection("store_admin_settings").updateOne({ _id: "access" }, { $set: { keyHash: hashPassword("rotated-admin-key") } });
      assert.equal(await auth.read(again), null);
      for (let i = 0; i < 10; i++) await assert.rejects(auth.login("wrong", "brute-force"), e => e.status === 401);
      await assert.rejects(auth.login("rotated-admin-key", "brute-force"), e => e.status === 429);
    });
    const store = createOrdersStore(db, gateway, catalog, { now: clock });
    await t.test("IST period, collections and actual merchandise totals exclude failed/fake rows", async () => {
      const data = await store.dashboard(dashboardFilters(new URLSearchParams(), now));
      assert.equal(data.summary.paymentCount, 2); assert.equal(data.summary.collectedAmount, 900); assert.equal(data.summary.realProductSales, 400);
      assert.equal(data.summary.awaitingProductConfirmation, 1); assert.equal(data.orders.length, 2);
      const row = data.orders.find(r => r.orderId === a.orderId);
      assert.equal(row.externalOrderId, "ORIGINAL-MERCHANT-A"); assert.equal(row.utr, "REAL-UTR-A"); assert.equal(row.assignment, "approximate");
      assert.equal(row.fulfillmentStatus, "unassigned"); assert.equal(row.catalogMatch.price, 500);
      assert.equal(data.summary.daySeries.at(-1).amount, 900);
      const all = await store.dashboard(dashboardFilters(new URLSearchParams("range=all"), now));
      assert.equal(all.summary.paymentCount, 3); assert.equal(all.summary.collectedAmount, 1350);
      assert.equal(all.orders.find(r => r.orderId === c.orderId).externalOrderId, null);
      const search = await store.dashboard(dashboardFilters(new URLSearchParams("range=all&q=ORIGINAL-MERCHANT-A"), now)); assert.equal(search.orders.length, 1);
    });
    await t.test("product confirmation and real shipment write only operations; concurrent changes conflict", async () => {
      const financialBefore = await db.collection("orders").findOne({ _id: a._id });
      const id = String(a._id);
      await assert.rejects(store.update(id, { revision: 0, action: "fulfillment", status: "delivered" }), e => e.status === 422);
      let row = await store.update(id, { revision: 0, action: "confirm-product", sku: "P500" }); assert.equal(row.revision, 1);
      const results = await Promise.allSettled([store.update(id, { revision: 1, action: "fulfillment", status: "packed" }), store.update(id, { revision: 1, action: "notes", notes: "Concurrent edit" })]);
      assert.equal(results.filter(r => r.status === "fulfilled").length, 1); assert.equal(results.find(r => r.status === "rejected").reason.status, 409);
      row = await store.detail(id);
      if (row.fulfillmentStatus === "processing") row = await store.update(id, { revision: row.revision, action: "fulfillment", status: "packed" });
      row = await store.update(id, { revision: row.revision, action: "fulfillment", status: "shipped", carrier: "Fixture carrier", trackingId: "TRACK-001" });
      assert.equal(row.shipment.deliveredAt, undefined);
      row = await store.update(id, { revision: row.revision, action: "fulfillment", status: "delivered" }); assert.ok(row.shipment.deliveredAt);
      assert.ok(row.history.some(h => h.to === "delivered"));
      assert.deepEqual(await db.collection("orders").findOne({ _id: a._id }), financialBefore);
      const filtered = await store.dashboard(dashboardFilters(new URLSearchParams("range=all&fulfillment=delivered"), now)); assert.equal(filtered.orders.length, 1);
      const csv = await store.exportCsv(dashboardFilters(new URLSearchParams("range=all"), now)); assert.match(csv, /REAL-UTR-A/); assert.match(csv, /ORIGINAL-MERCHANT-A/); assert.doesNotMatch(csv, /PENDING-ID|FAILED-ID/);
    });
  } finally {
    if (db.databaseName === dbName && dbName.startsWith("surya_admin_e2e_")) await db.dropDatabase();
    if (gateway.databaseName === `${dbName}_gateway`) await gateway.dropDatabase();
    await conn.close();
  }
});

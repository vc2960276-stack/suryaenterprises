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
    await t.test("bulk shipment is restricted, retry safe and supports audited status corrections", async () => {
      const financialBefore = await db.collection("orders").find({}).sort({ _id: 1 }).toArray();
      const gatewayBefore = await gateway.collection("transactions").find({}).sort({ _id: 1 }).toArray();
      const filters = dashboardFilters(new URLSearchParams("range=all"), now);
      const preview = await store.shipmentPreview(filters);
      assert.equal(preview.matchedCount, 3); assert.equal(preview.eligibleCount, 1); assert.equal(preview.unconfirmedCount, 1);
      assert.deepEqual(preview.candidates, [{ id: String(b._id), revision: 0 }]);
      const reference = { carrier: "DTDC", trackingId: "FIXTURE-CONSIGNMENT", note: "Fixture confirmed purchases have shipped" };
      const invalid = await store.bulkShip({ orders: [{ id: String(c._id), revision: 0 }], ...reference });
      assert.equal(invalid.shippedCount, 0); assert.equal(invalid.failedCount, 1);
      assert.equal(await db.collection("store_admin_orders").findOne({ _id: String(c._id) }), null);
      const shipped = await store.bulkShip({ orders: preview.candidates, ...reference });
      assert.equal(shipped.shippedCount, 1); assert.equal(shipped.failedCount, 0);
      const repeated = await store.bulkShip({ orders: preview.candidates, ...reference });
      assert.equal(repeated.shippedCount, 0); assert.equal(repeated.alreadyRecordedCount, 1);
      let row = await store.detail(String(b._id));
      assert.equal(row.fulfillmentStatus, "shipped"); assert.equal(row.shipment.carrier, "DTDC");
      assert.equal(row.history.filter(event => event.action === "shipment_recorded").length, 1);
      row = await store.update(row.id, { revision: row.revision, action: "correct-status", status: "processing", note: "Courier returned parcel for address correction" });
      assert.equal(row.fulfillmentStatus, "processing"); assert.deepEqual(row.shipment, {});
      assert.equal(row.history.at(-1).previousShipment.trackingId, reference.trackingId);
      row = await store.update(row.id, { revision: row.revision, action: "correct-status", status: "cancelled", note: "Customer cancelled the returned purchase" });
      assert.equal(row.fulfillmentStatus, "cancelled");
      assert.deepEqual(await db.collection("orders").find({}).sort({ _id: 1 }).toArray(), financialBefore);
      assert.deepEqual(await gateway.collection("transactions").find({}).sort({ _id: 1 }).toArray(), gatewayBefore);
    });
    await t.test("reported owner review confirms associations idempotently without manufacturing purchased items", async () => {
      const financialBefore = await db.collection("orders").find({}).sort({ _id: 1 }).toArray();
      const filters = dashboardFilters(new URLSearchParams("range=all"), now);
      await assert.rejects(store.confirmReviewedAssociations(filters, { note: "Missing attestation" }), e => e.status === 422);
      const statement = { ownerReportedManualReview: true, note: "Owner reported manually reviewing current product associations." };
      const preview = await store.confirmReviewedAssociations(filters, { ...statement, dryRun: true });
      assert.equal(preview.candidateCount, 1); assert.equal(preview.amountINR, 450);
      assert.equal(await db.collection("store_admin_orders").findOne({ _id: String(c._id) }), null);
      const result = await store.confirmReviewedAssociations(filters, statement);
      assert.equal(result.confirmedCount, 1); assert.equal(result.conflictCount, 0);
      const row = await store.detail(String(c._id));
      assert.equal(row.assignment, "confirmed"); assert.equal(row.fulfillmentStatus, "processing"); assert.deepEqual(row.items, []);
      assert.equal(row.history.at(-1).source, "owner_reported_review");
      assert.equal((await store.confirmReviewedAssociations(filters, statement)).confirmedCount, 0);
      assert.equal((await store.detail(String(c._id))).history.filter(event => event.action === "owner_review_confirmation").length, 1);
      assert.equal((await store.detail(String(a._id))).fulfillmentStatus, "delivered");
      assert.equal((await store.detail(String(b._id))).fulfillmentStatus, "cancelled");
      assert.deepEqual(await db.collection("orders").find({}).sort({ _id: 1 }).toArray(), financialBefore);
    });
    await t.test("customer delivery corrections persist with history without changing contact or payment records", async () => {
      const financialBefore = await db.collection("orders").find({}).sort({ _id: 1 }).toArray();
      const id = String(c._id), before = await store.detail(id);
      const address = { address: "Fixture Lane 12", city: "New Delhi", state: "Delhi", pinCode: "110001" };
      await assert.rejects(store.update(id, { revision: before.revision, action: "customer-address", address: { ...address, pinCode: "000001" } }), e => e.status === 422);
      const updated = await store.update(id, { revision: before.revision, action: "customer-address", address, note: "Customer supplied an updated delivery address." });
      assert.deepEqual(Object.fromEntries(Object.keys(address).map(key => [key, updated.customer[key]])), address);
      assert.equal(updated.customer.email, before.customer.email); assert.equal(updated.customer.phone, before.customer.phone);
      assert.equal(updated.fulfillmentStatus, before.fulfillmentStatus);
      assert.equal(updated.history.at(-1).action, "customer_address_updated");
      assert.equal(updated.history.at(-1).previousAddress.address, "");
      assert.deepEqual(updated.history.at(-1).address, address);
      await assert.rejects(store.update(id, { revision: before.revision, action: "customer-address", address: { ...address, address: "Stale overwrite" } }), e => e.status === 409);
      assert.equal((await store.detail(id)).customer.address, address.address);
      assert.deepEqual(await db.collection("orders").find({}).sort({ _id: 1 }).toArray(), financialBefore);
    });
  } finally {
    if (db.databaseName === dbName && dbName.startsWith("surya_admin_e2e_")) await db.dropDatabase();
    if (gateway.databaseName === `${dbName}_gateway`) await gateway.dropDatabase();
    await conn.close();
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProductMatcher, csvCell, dashboardFilters, fulfillmentUpdate } from "../app/lib-admin/core.mjs";
import { prepareStorefrontPurchase } from "../app/lib/checkoutOrder.mjs";

const catalog = [
  { sku: "A", name: "Seeds", price: 400, stock: 20, image: "/assets/catalog/a.webp" },
  { sku: "B", name: "Nutrition", price: 500, stock: 20 },
  { sku: "C", name: "Protection", price: 600, stock: 20 },
  { sku: "D", name: "Machine", price: 500, stock: 20 },
];
test("admin dates default to today's IST boundary and reject invalid calendar/query inputs", () => {
  const now = new Date("2026-10-07T20:00:00Z");
  const day = dashboardFilters(new URLSearchParams(), now);
  assert.equal(day.from, "2026-10-08"); assert.equal(day.start.toISOString(), "2026-10-07T18:30:00.000Z");
  assert.equal(day.end.toISOString(), "2026-10-08T18:30:00.000Z");
  const week = dashboardFilters(new URLSearchParams("range=7d"), now); assert.equal(week.from, "2026-10-02");
  assert.equal(dashboardFilters(new URLSearchParams("range=all"), now).start, null);
  for (const q of ["range=custom&from=2026-02-30&to=2026-03-01", "range=custom&from=2026-10-09&to=2026-10-08", "page=-1", "limit=100000", "fulfillment=paid"]) assert.throws(() => dashboardFilters(new URLSearchParams(q), now));
});
test("catalog associations use the nearest real price and remain deterministic per payment", () => {
  const { match } = buildProductMatcher(catalog);
  const exact = match(500, "reference"); assert.equal(exact.price, 500); assert.equal(exact.exact, true);
  assert.deepEqual(match(500, "reference"), exact);
  const approx = match(470, "another"); assert.equal(approx.price, 500); assert.equal(approx.delta, -30); assert.equal(approx.exact, false);
  assert.equal(match(1, "small").price, 400); assert.equal(match(0, "invalid"), null); assert.equal(match(500, "id", "missing"), null);
});
test("fulfillment requires confirmed association and actual shipment; no automatic delivered records", () => {
  const draft = { revision: 0, assignment: "approximate", fulfillmentStatus: "unassigned" };
  assert.throws(() => fulfillmentUpdate(draft, { revision: 0, action: "fulfillment", status: "delivered" }), /not allowed/);
  const confirmed = fulfillmentUpdate(draft, { revision: 0, action: "confirm-product", sku: "B" });
  assert.equal(confirmed.set.fulfillmentStatus, "processing"); assert.equal(confirmed.set.productSku, "B");
  const packed = { assignment: "confirmed", fulfillmentStatus: "packed", shipment: {} };
  assert.throws(() => fulfillmentUpdate(packed, { revision: 1, action: "fulfillment", status: "shipped" }), /carrier and tracking/);
  const shipped = fulfillmentUpdate(packed, { revision: 1, action: "fulfillment", status: "shipped", carrier: "India Post", trackingId: "REAL-TRACKING" });
  assert.ok(shipped.set.shipment.shippedAt); assert.equal(shipped.set.shipment.deliveredAt, undefined);
  assert.throws(() => fulfillmentUpdate({ assignment: "confirmed", fulfillmentStatus: "shipped", shipment: {} }, { revision: 2, action: "fulfillment", status: "delivered" }), /before delivery/);
  assert.throws(() => fulfillmentUpdate(packed, { revision: 1, action: "fulfillment", status: "cancelled" }), /reason/);
});
test("CSV exports neutralize user-controlled spreadsheet formulas", () => {
  assert.equal(csvCell('=HYPERLINK("bad")'), '"\'=HYPERLINK(""bad"")"');
  assert.equal(csvCell("+919123456789"), '"\'+919123456789"');
  assert.equal(csvCell("normal,name"), '"normal,name"');
});
test("storefront prices, quantities, SKUs and address are validated before a provider request", () => {
  const body = { amount: 800, items: [{ sku: "A", quantity: 2, price: 1, name: "Spoofed" }], shipping: { address: "Real street", city: "Delhi", state: "Delhi", pinCode: "110001" } };
  const purchase = prepareStorefrontPurchase(body, catalog);
  assert.equal(purchase.subtotal, 800); assert.equal(purchase.items[0].name, "Seeds"); assert.equal(purchase.items[0].price, 400);
  assert.throws(() => prepareStorefrontPurchase({ ...body, amount: 1 }, catalog), /prices changed/);
  assert.throws(() => prepareStorefrontPurchase({ ...body, items: [{ sku: "missing", quantity: 1 }] }, catalog), /unavailable/);
  assert.throws(() => prepareStorefrontPurchase({ ...body, items: [{ sku: "A", quantity: -1 }] }, catalog), /quantity/);
  assert.throws(() => prepareStorefrontPurchase({ ...body, shipping: {} }, catalog), /complete shipping/);
});

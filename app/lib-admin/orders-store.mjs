import mongoose from "mongoose";
import { AdminError, STAGES, buildProductMatcher, csvCell, fulfillmentUpdate, indiaDate, purchasedItems } from "./core.mjs";

const { ObjectId } = mongoose.Types;

const SUCCESS = { paymentStatus: "paid", provider: { $in: ["payu", "PAYU"] },
  payuPaymentId: { $type: "string", $nin: ["", "Not Found"] }, subtotal: { $gt: 0, $lt: Number.MAX_SAFE_INTEGER / 100 } };
const regex = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const iso = value => value ? new Date(value).toISOString() : null;
const idFor = value => {
  if (typeof value !== "string" || !/^[a-f0-9]{24}$/.test(value)) throw new AdminError("Order not found.", 404);
  return new ObjectId(value);
};
const timeStages = [{ $set: { __paidAt: { $ifNull: ["$paidAt", { $ifNull: ["$updatedAt", "$createdAt"] }] } } }];
const timeMatch = (start, end) => {
  const bounds = { ...(start ? { $gte: start } : {}), ...(end ? { $lt: end } : {}) };
  return { $or: [{ paidAt: { $type: "date", ...bounds } }, { paidAt: null, updatedAt: { $type: "date", ...bounds } },
    { paidAt: null, updatedAt: null, createdAt: { $type: "date", ...bounds } }] };
};
const operationalStages = [
  { $lookup: { from: "store_admin_orders", let: { id: { $toString: "$_id" } }, pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id"] } } }], as: "__ops" } },
  { $set: { __ops: { $arrayElemAt: ["$__ops", 0] }, __purchased: { $gt: [{ $size: { $ifNull: ["$items", []] } }, 0] } } },
  { $set: { __stage: { $ifNull: ["$__ops.fulfillmentStatus", { $cond: ["$__purchased", "processing", "unassigned"] }] } } },
];
const projection = { payuResponse: 0, payuQrString: 0, paymentErrorDetails: 0, __ops: 0 };

// Financial collections are read-only. Operations live in their own collection.
export function createOrdersStore(db, gatewayDb, products, { now = () => new Date() } = {}) {
  const orders = db.collection("orders"), operations = db.collection("store_admin_orders");
  const matcher = buildProductMatcher(products);
  const metadata = async rows => new Map((await operations.find({ _id: { $in: rows.map(r => String(r._id)) } }).toArray()).map(r => [r._id, r]));
  const gatewayRows = async rows => {
    if (!gatewayDb || !rows.length) return new Map();
    const txns = await gatewayDb.collection("transactions").find({ transactionId: { $in: rows.map(r => r.orderId) }, provider: "PAYU" },
      { projection: { transactionId: 1, orderId: 1, payuTxnId: 1, payuId: 1, status: 1, amount: 1, paidAt: 1, callbackStatus: 1 } }).toArray();
    // Never attach a different payment merely because its amount matches.
    const source = new Map(rows.map(r => [r.orderId, r]));
    return new Map(txns.filter(t => { const r = source.get(t.transactionId);
      return r && Math.round(r.subtotal * 100) === Math.round(t.amount * 100) && (!t.payuId || t.payuId === r.payuPaymentId);
    }).map(t => [t.transactionId, t]));
  };
  const toRow = (order, ops, gateway, detail = false) => {
    const purchased = purchasedItems(order);
    const assignment = purchased ? "purchased" : ops?.productConfirmedAt ? "confirmed" : "approximate";
    const selected = ops?.productSnapshot || matcher.match(order.subtotal, order.transactionId || order.orderId, ops?.productSku);
    const customer = order.customer || {};
    const paidAt = order.paidAt || order.__paidAt || order.updatedAt || order.createdAt;
    const row = {
      id: String(order._id), orderId: order.orderId, externalOrderId: gateway?.orderId || null,
      transactionId: order.transactionId || order.payuTxnId || null, paymentId: order.payuPaymentId, utr: order.payuBankRefNum || null,
      amount: order.subtotal, currency: "INR", paymentStatus: "paid", paidAt: iso(paidAt), createdAt: iso(order.createdAt),
      dateBasis: order.paidAt ? "payment_confirmed" : "record_updated", providerPaidAt: iso(gateway?.paidAt),
      source: gateway ? "gateway" : "storefront", gatewayStatus: gateway?.status || null, callbackStatus: gateway?.callbackStatus || null,
      customer: { name: [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Customer", email: customer.email || "", phone: customer.phone || "",
        address: [customer.address, customer.apartment].filter(Boolean).join(", "), city: customer.city || "", state: customer.state || "", pinCode: customer.pinCode || "" },
      assignment, catalogMatch: purchased ? null : selected,
      items: purchased ? order.items.map(i => ({ sku: i.sku, name: i.name, quantity: i.quantity, price: i.price, image: matcher.bySku.get(i.sku)?.image || null })) : [],
      fulfillmentStatus: ops?.fulfillmentStatus || (purchased ? "processing" : "unassigned"), shipment: ops?.shipment || {},
      notes: ops?.notes || "", revision: ops?.revision || 0,
    };
    if (detail) row.history = [{ at: iso(paidAt), action: "payment_recorded", note: "Successful PayU payment in MongoDB." }, ...(ops?.history || []).map(h => ({ ...h, at: iso(h.at) }))];
    return row;
  };
  const enrich = async (rows, detail = false) => {
    const [ops, gateway] = await Promise.all([metadata(rows), gatewayRows(rows)]);
    return rows.map(r => toRow(r, ops.get(String(r._id)), gateway.get(r.orderId), detail));
  };
  const pipeline = async filters => {
    const match = { ...SUCCESS };
    if (filters.q) {
      const pattern = new RegExp(regex(filters.q), "i");
      const external = gatewayDb ? await gatewayDb.collection("transactions").find({ provider: "PAYU", status: "SUCCESS", orderId: pattern },
        { projection: { transactionId: 1 } }).limit(1001).toArray() : [];
      if (external.length > 1000) throw new AdminError("Refine the search to match fewer merchant order IDs.");
      match.$or = ["orderId", "transactionId", "payuTxnId", "payuPaymentId", "payuBankRefNum", "customer.firstName", "customer.lastName", "customer.email", "customer.phone"].map(field => ({ [field]: pattern }));
      match.$or.push({ $expr: { $regexMatch: { input: { $concat: [{ $ifNull: ["$customer.firstName", ""] }, " ", { $ifNull: ["$customer.lastName", ""] }] }, regex: regex(filters.q), options: "i" } } });
      if (external.length) match.$or.push({ orderId: { $in: external.map(t => t.transactionId) } });
    }
    const result = [{ $match: match }];
    if (filters.start || filters.end) result.push({ $match: timeMatch(filters.start, filters.end) });
    result.push(...timeStages);
    result.push(...operationalStages);
    if (filters.fulfillment !== "all") result.push({ $match: { __stage: filters.fulfillment } });
    return result;
  };
  const trend = async () => {
    const today = indiaDate(now()), end = new Date(`${today}T00:00:00+05:30`);
    const start = new Date(end.getTime() - 6 * 86400000);
    const values = await orders.aggregate([{ $match: SUCCESS }, { $match: timeMatch(start, new Date(end.getTime() + 86400000)) }, ...timeStages,
      { $group: { _id: { $dateToString: { date: "$__paidAt", format: "%Y-%m-%d", timezone: "Asia/Kolkata" } }, count: { $sum: 1 }, cents: { $sum: { $round: [{ $multiply: ["$subtotal", 100] }, 0] } } } }], { maxTimeMS: 12000 }).toArray();
    const byDay = new Map(values.map(v => [v._id, v]));
    return Array.from({ length: 7 }, (_, i) => { const date = indiaDate(new Date(start.getTime() + i * 86400000)), value = byDay.get(date);
      return { date, count: value?.count || 0, amount: (value?.cents || 0) / 100 }; });
  };
  const dashboard = async filters => {
    const query = await pipeline(filters);
    const [results, daySeries] = await Promise.all([
      orders.aggregate([...query, { $facet: {
        totals: [{ $group: { _id: null, paymentCount: { $sum: 1 }, cents: { $sum: { $round: [{ $multiply: ["$subtotal", 100] }, 0] } },
          awaitingProductConfirmation: { $sum: { $cond: [{ $eq: ["$__stage", "unassigned"] }, 1, 0] } }, realProductCents: { $sum: { $cond: ["$__purchased", { $round: [{ $multiply: ["$subtotal", 100] }, 0] }, 0] } } } }],
        stages: [{ $group: { _id: "$__stage", count: { $sum: 1 } } }],
        rows: [{ $sort: { __paidAt: -1, _id: -1 } }, { $skip: (filters.page - 1) * filters.limit }, { $limit: filters.limit }, { $project: projection }],
      } }], { maxTimeMS: 12000 }).toArray(), trend(),
    ]);
    const data = results[0], totals = data.totals[0] || { paymentCount: 0, cents: 0, awaitingProductConfirmation: 0, realProductCents: 0 };
    const fulfillmentCounts = Object.fromEntries(STAGES.map(s => [s, 0]));
    for (const stage of data.stages) fulfillmentCounts[stage._id] = stage.count;
    return { summary: { collectedAmount: totals.cents / 100, paymentCount: totals.paymentCount,
      averagePayment: totals.paymentCount ? Math.round(totals.cents / totals.paymentCount) / 100 : 0,
      awaitingProductConfirmation: totals.awaitingProductConfirmation, realProductSales: totals.realProductCents / 100, fulfillmentCounts, daySeries },
      orders: await enrich(data.rows), pagination: { page: filters.page, limit: filters.limit, total: totals.paymentCount, pages: Math.ceil(totals.paymentCount / filters.limit) },
      period: { from: filters.from, to: filters.to, label: filters.label }, generatedAt: now().toISOString() };
  };
  const detail = async id => {
    const order = await orders.findOne({ ...SUCCESS, _id: idFor(id) }, { projection: { payuResponse: 0, payuQrString: 0 } });
    if (!order) throw new AdminError("Successful PayU order not found.", 404);
    return (await enrich([order], true))[0];
  };
  const update = async (id, body) => {
    const current = await detail(id);
    if (current.revision !== body.revision) throw new AdminError("This order changed. Reload it before saving.", 409);
    const change = fulfillmentUpdate(current, body, now());
    if (body.action === "confirm-product") {
      const productSnapshot = matcher.match(current.amount, current.transactionId, body.sku);
      if (!productSnapshot) throw new AdminError("Catalog product not found.", 422);
      change.set.productSnapshot = productSnapshot;
    }
    const ops = await operations.findOne({ _id: id });
    try {
      if (!ops) {
        await operations.insertOne({ _id: id, orderId: current.orderId, revision: 1, createdAt: now(), updatedAt: now(), ...change.set, history: [change.event] });
      } else {
        const result = await operations.updateOne({ _id: id, revision: body.revision },
          { $set: { ...change.set, updatedAt: now() }, $inc: { revision: 1 }, $push: { history: change.event } });
        if (!result.matchedCount) throw new AdminError("This order changed. Reload it before saving.", 409);
      }
    } catch (error) { if (error.code === 11000) throw new AdminError("This order changed. Reload it before saving.", 409); throw error; }
    return detail(id);
  };
  const exportCsv = async filters => {
    const records = await orders.aggregate([...(await pipeline(filters)), { $sort: { __paidAt: -1, _id: -1 } }, { $limit: 10001 }, { $project: projection }], { maxTimeMS: 15000 }).toArray();
    if (records.length > 10000) throw new AdminError("Choose a narrower period to export up to 10,000 orders.");
    const rows = await enrich(records);
    const columns = ["Surya order ID", "Merchant order ID", "PayU transaction ID", "PayU payment ID", "UTR", "Collected INR", "Recorded successful at", "Date basis", "Customer", "Email", "Phone", "Product association", "Catalog SKU", "Catalog product", "Catalog price INR", "Price difference INR", "Fulfillment", "Carrier", "Tracking ID"];
    return '\uFEFF' + [columns.map(csvCell).join(","), ...rows.map(r => [r.orderId, r.externalOrderId, r.transactionId, r.paymentId, r.utr, r.amount, r.paidAt, r.dateBasis,
      r.customer.name, r.customer.email, r.customer.phone, r.assignment, r.catalogMatch?.sku || r.items.map(i => i.sku).join("; "),
      r.catalogMatch?.name || r.items.map(i => i.name).join("; "), r.catalogMatch?.price ?? "", r.catalogMatch?.delta ?? "", r.fulfillmentStatus, r.shipment.carrier, r.shipment.trackingId].map(csvCell).join(","))].join("\r\n");
  };
  return { dashboard, detail, update, exportCsv };
}

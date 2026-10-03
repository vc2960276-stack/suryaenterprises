import { test } from "node:test";
import assert from "node:assert/strict";
import { verifiedPaymentUpdate, refreshOrderPayment } from "../app/lib/paymentStatus.js";

const order = { _id: "fixture", transactionId: "PROVIDER-TXN", subtotal: 500, paymentStatus: "pending" };
const provider = (extra = {}) => ({ status: 1, transaction_details: { "PROVIDER-TXN": {
  txnid: "PROVIDER-TXN", status: "success", unmappedstatus: "captured", amt: "500.00", mihpayid: "PAYU-ID", bank_ref_num: "VERIFIED-UTR", ...extra,
} } });

test("only a bound, captured, correctly valued provider result becomes paid", () => {
  assert.equal(verifiedPaymentUpdate(order, provider()).paymentStatus, "paid");
  for (const data of [{ txnid: "OTHER" }, { amt: "1.00" }, { amt: undefined }, { currency: "USD" }, { mihpayid: "Not Found" }]) {
    assert.equal(verifiedPaymentUpdate(order, provider(data)), null);
  }
  assert.equal(verifiedPaymentUpdate(order, { ...provider(), status: 0 }), null);
  assert.equal(verifiedPaymentUpdate(order, provider({ status: "success", unmappedstatus: "auth" })).paymentStatus, "pending");
  assert.equal(verifiedPaymentUpdate(order, provider({ status: "pending" })).paymentStatus, "pending");
});

test("verified success recovers failure and a concurrent paid result cannot be downgraded", async () => {
  let stored = { ...order, paymentStatus: "failed" };
  const model = {
    async findOneAndUpdate(filter, update) {
      assert.equal(filter._id, order._id);
      if (stored.paymentStatus === "paid" && filter.paymentStatus.$ne === "paid") return null;
      stored = { ...stored, ...update.$set };
      return stored;
    },
    async findById() { return stored; },
  };
  assert.equal((await refreshOrderPayment(stored, { verify: async () => provider(), model })).paymentStatus, "paid");
  const stale = { ...order, paymentStatus: "pending" };
  assert.equal((await refreshOrderPayment(stale, { verify: async () => provider({ status: "failed" }), model })).paymentStatus, "paid");
  assert.equal(stored.payuBankRefNum, "VERIFIED-UTR");
});

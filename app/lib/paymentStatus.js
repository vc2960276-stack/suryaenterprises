const SUCCESS = new Set(["success", "captured", "paid", "completed"]);
const FAILED = new Set(["failed", "failure", "usercancelled", "user_cancelled", "cancelled", "canceled", "dropped", "bounced", "expired"]);

export function verifiedPaymentUpdate(order, provider) {
  if (Number(provider?.status) !== 1) return null;
  const details = provider.transaction_details?.[order.transactionId];
  if (!details || (details.txnid && details.txnid !== order.transactionId)) return null;
  const amount = Number(details.transaction_amount ?? details.amt ?? details.amount);
  if (!Number.isFinite(amount) || amount <= 0 || Math.round(amount * 100) !== Math.round(Number(order.subtotal) * 100)) return null;
  if (details.currency && details.currency !== "INR") return null;
  const status = String(details.status || "").toLowerCase();
  const unmapped = String(details.unmappedstatus || "").toLowerCase();
  const paymentStatus = SUCCESS.has(status) && (!unmapped || SUCCESS.has(unmapped))
    ? "paid" : FAILED.has(status) ? "failed" : "pending";
  const paymentId = String(details.mihpayid || "");
  if (paymentStatus === "paid" && (!paymentId || paymentId === "Not Found")) return null;
  return {
    paymentStatus,
    ...(paymentStatus === "paid" && order.paymentStatus !== "paid" ? { paidAt: new Date() } : {}),
    ...(paymentId && paymentId !== "Not Found" ? { payuPaymentId: paymentId } : {}),
    ...(details.bank_ref_num || details.bank_ref_no ? { payuBankRefNum: String(details.bank_ref_num || details.bank_ref_no) } : {}),
    payuResponse: provider,
  };
}

export async function refreshOrderPayment(order, { verify, model }) {
  const update = verifiedPaymentUpdate(order, await verify(order.transactionId));
  if (!update) return order;
  if (order.paymentStatus === "paid") {
    // Enrich a missing bank reference, but never replace an established one.
    if (!order.payuBankRefNum && update.paymentStatus === "paid" && update.payuBankRefNum &&
      (!order.payuPaymentId || order.payuPaymentId === update.payuPaymentId)) {
      return await model.findOneAndUpdate({ _id: order._id, paymentStatus: "paid", payuBankRefNum: { $in: [null, ""] } },
        { $set: { payuBankRefNum: update.payuBankRefNum } }, { returnDocument: "after" }) || await model.findById(order._id);
    }
    return order;
  }
  // Failure is recoverable; a verified success wins over concurrent stale reads.
  return await model.findOneAndUpdate({ _id: order._id, paymentStatus: { $ne: "paid" } },
    { $set: update }, { returnDocument: "after" }) || await model.findById(order._id);
}

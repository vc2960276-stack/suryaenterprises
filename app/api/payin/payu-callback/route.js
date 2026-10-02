import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { verifyPayUCallbackHash } from "../../../lib/payu";

export const dynamic = "force-dynamic";

const SUCCESS_STATUSES = ["success", "captured", "paid"];

const FAILED_STATUSES = [
  "failed",
  "failure",
  "usercancelled",
  "user_cancelled",
  "cancelled",
  "dropped",
  "bounced",
  "expired",
];

/**
 * Optionally relay the verified PayU payload to the Pay-In platform backend so
 * merchant transactions created through it are updated and merchant webhooks fire.
 * The backend re-verifies the PayU hash with the shared salt.
 */
async function forwardToPayinBackend(rawBody) {
  const target = process.env.PAYIN_BACKEND_WEBHOOK_URL;

  if (!target) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: rawBody,
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Pay-In backend webhook returned HTTP ${response.status}`);
    }
  } catch (error) {
    console.error("Pay-In backend webhook forward failed:", error.message);
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request) {
  try {
    const raw = await request.text();
    const params = new URLSearchParams(raw);
    const data = Object.fromEntries(params.entries());

    if (!verifyPayUCallbackHash(data)) {
      return NextResponse.json({ success: false, error: "Invalid PayU callback hash" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOne({ transactionId: data.txnid });
    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    const expectedAmount = Number(order.subtotal || 0).toFixed(2);
    const receivedAmount = Number(data.amount || 0).toFixed(2);
    if (expectedAmount !== receivedAmount) {
      return NextResponse.json({ success: false, error: "Amount mismatch" }, { status: 400 });
    }

    const status = String(data.status || "").toLowerCase();

    // Idempotent: a paid order never flips back on a duplicate or late callback.
    if (order.paymentStatus !== "paid") {
      order.payuTxnId = data.txnid || order.payuTxnId;
      order.payuPaymentId = data.mihpayid || order.payuPaymentId;
      order.payuBankRefNum = data.bank_ref_num || data.bank_ref_no || order.payuBankRefNum;
      order.payuResponse = data;

      if (SUCCESS_STATUSES.includes(status)) {
        order.paymentStatus = "paid";
      } else if (FAILED_STATUSES.includes(status)) {
        order.paymentStatus = "failed";
        order.paymentError = data.error_Message || data.error || order.paymentError;
      }

      await order.save();
    }

    await forwardToPayinBackend(raw);

    return NextResponse.json({ success: true, order_id: order.orderId, payment_status: order.paymentStatus });
  } catch (error) {
    console.error("PayU callback error:", error);
    return NextResponse.json({ success: false, error: "Callback processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "PayU callback endpoint is active" });
}

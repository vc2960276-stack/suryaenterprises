import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { verifyPayUPayment } from "../../../lib/payu";
import { refreshOrderPayment } from "../../../lib/paymentStatus";

export const dynamic = "force-dynamic";

function bearer(request) {
  const value = request.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

function toResponse(order) {
  return {
    status: "success",
    data: {
      order_id: order.orderId,
      transaction_id: order.transactionId,
      payment_status: order.paymentStatus,
      amount: order.subtotal,
      currency: "INR",
      payu_payment_id: order.payuPaymentId || null,
      utr: order.payuBankRefNum || null,
      deep_link: order.payuQrString || null,
      qr_string: order.payuQrString || null,
    },
    error: null,
  };
}

export async function POST(request) {
  try {
    if (!process.env.PAYIN_API_TOKEN || bearer(request) !== process.env.PAYIN_API_TOKEN) {
      return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });
    }

    const { order_id } = await request.json();
    if (!order_id) return NextResponse.json({ status: "error", error: "order_id is required" }, { status: 400 });

    await connectDB();
    let order = await Order.findOne({ orderId: String(order_id) });
    if (!order) return NextResponse.json({ status: "error", error: "Order not found" }, { status: 404 });

    if (order.transactionId && (order.paymentStatus !== "paid" || !order.payuBankRefNum)) {
      try {
        order = await refreshOrderPayment(order, { verify: verifyPayUPayment, model: Order });
      } catch (error) {
        // An unavailable provider never turns a pending payment into success/failure.
        console.error("PayU verification unavailable:", error.name);
      }
    }

    return NextResponse.json(toResponse(order));
  } catch (error) {
    console.error("PayU check-status error:", error);
    return NextResponse.json({ status: "error", error: "Unable to check payment status" }, { status: 500 });
  }
}

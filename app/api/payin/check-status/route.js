import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { verifyPayUPayment } from "../../../lib/payu";

export const dynamic = "force-dynamic";

function bearer(request) {
  const value = request.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

export async function POST(request) {
  try {
    if (!process.env.PAYIN_API_TOKEN || bearer(request) !== process.env.PAYIN_API_TOKEN) {
      return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });
    }

    const { order_id } = await request.json();
    if (!order_id) return NextResponse.json({ status: "error", error: "order_id is required" }, { status: 400 });

    await connectDB();
    const order = await Order.findOne({ orderId: String(order_id) });
    if (!order) return NextResponse.json({ status: "error", error: "Order not found" }, { status: 404 });

    if (order.paymentStatus === "pending" && order.transactionId) {
      const provider = await verifyPayUPayment(order.transactionId);
      const details = provider?.transaction_details?.[order.transactionId];
      if (details) {
        const status = String(details.status || details.unmappedstatus || "").toLowerCase();
        if (status === "success" || status === "captured") order.paymentStatus = "paid";
        else if (["failed", "failure", "usercancelled", "user_cancelled"].includes(status)) order.paymentStatus = "failed";
        order.payuResponse = provider;
        await order.save();
      }
    }

    return NextResponse.json({
      status: "success",
      data: {
        order_id: order.orderId,
        transaction_id: order.transactionId,
        payment_status: order.paymentStatus,
        amount: order.subtotal,
        currency: "INR",
        payu_payment_id: order.payuPaymentId || null,
      },
      error: null,
    });
  } catch (error) {
    console.error("PayU check-status error:", error);
    return NextResponse.json({ status: "error", error: error.message || "Unable to check payment status" }, { status: 500 });
  }
}

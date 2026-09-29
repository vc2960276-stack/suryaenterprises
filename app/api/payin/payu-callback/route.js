import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { verifyPayUCallbackHash } from "../../../lib/payu";

export const dynamic = "force-dynamic";

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
    order.payuTxnId = data.txnid || order.payuTxnId;
    order.payuPaymentId = data.mihpayid || order.payuPaymentId;
    order.payuResponse = data;
    order.paymentStatus = status === "success" ? "paid" : "failed";
    await order.save();

    return NextResponse.json({ success: true, order_id: order.orderId, payment_status: order.paymentStatus });
  } catch (error) {
    console.error("PayU callback error:", error);
    return NextResponse.json({ success: false, error: "Callback processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "PayU callback endpoint is active" });
}

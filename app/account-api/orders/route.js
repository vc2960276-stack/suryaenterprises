import { connectDB } from "../../lib/mongodb";
import Order from "../../models/Order";
import { handler, ok } from "../../lib-account/session";

export const dynamic = "force-dynamic";

// GET /account-api/orders — read-only list of the signed-in customer's
// orders from the existing Order collection (Order.js is frozen; it has no
// customerId). Orders are matched on the email captured at checkout. Phone
// numbers are deliberately NOT used for matching: they are unverified at
// sign-up, so a shared or mistyped number would expose someone else's orders.
export const GET = handler(
  async ({ customer }) => {
    await connectDB();
    const escaped = customer.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const orders = await Order.find({ "customer.email": new RegExp(`^${escaped}$`, "i") })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("orderId subtotal paymentStatus paymentMethod createdAt updatedAt items")
      .lean();

    return ok({
      orders: orders.map((o) => ({
        orderId: o.orderId,
        amount: o.subtotal ?? 0,
        paymentStatus: o.paymentStatus ?? "pending",
        paymentMethod: o.paymentMethod ?? "payu_dynamic_qr",
        items: (o.items ?? []).map((i) => ({ sku: i.sku, name: i.name, quantity: i.quantity, price: i.price })),
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      })),
    });
  },
  { auth: true }
);

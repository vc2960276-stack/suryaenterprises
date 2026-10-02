"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { getProduct, formatINR } from "../products/data/products";

function readCart() {
  if (typeof window === "undefined") return {};

  const savedCart = window.localStorage.getItem("surya-cart");

  try {
    return savedCart ? JSON.parse(savedCart) : {};
  } catch {
    return {};
  }
}

const initialDetails = {
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "Delhi",
  pinCode: "",
  phone: "",
  email: "",
  notes: "",
};

export default function CheckoutPage() {
  const [cart] = useState(readCart);
  const [details, setDetails] = useState(initialDetails);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // PayU payment information
  const [payment, setPayment] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentChecking, setPaymentChecking] = useState(false);

  const cartItems = Object.entries(cart)
    .map(([sku, quantity]) => ({
      product: getProduct(sku),
      quantity,
    }))
    .filter((item) => item.product);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  const updateDetails = (event) => {
    setDetails((currentDetails) => ({
      ...currentDetails,
      [event.target.name]: event.target.value,
    }));
  };

  // --------------------------------------------------
  // CREATE PAYU PAYMENT
  // --------------------------------------------------

  const placeOrder = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0 || isLoading) {
      return;
    }

    setIsLoading(true);
    setPaymentMessage("");

    try {
      // Generate unique Surya order ID
      const orderId = `SE${Date.now()}${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const customerName =
        `${details.firstName} ${details.lastName}`.trim();

      const response = await fetch(
        "/api/checkout/payin/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            order_id: orderId,

            amount: Number(subtotal),

            name: customerName,

            email: details.email.trim(),

            mobile: details.phone.trim(),

            productinfo:
              "Surya Enterprises Product Purchase",

            // Optional values
            customer_ip: "",

            device_info:
              typeof navigator !== "undefined"
                ? navigator.userAgent
                : "Surya-Enterprise-Web",

            expiry_seconds: 1800,
          }),
        }
      );

      const data = await response.json();

      console.log("PayU create response:", data);

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data.error ||
          "Unable to create payment"
        );
      }

      // The API returns the UPI intent as qr_string (and deep_link);
      // accept either so older/newer responses both work.
      const qrString =
        data.data?.qr_string ||
        data.data?.deep_link ||
        data.data?.upi_intent;

      if (!qrString) {
        throw new Error(
          "PayU did not return a payment QR."
        );
      }

      // IMPORTANT:
      // This changes the page from checkout
      // to the payment screen.
      setPayment({ ...data.data, qr_string: qrString });
    } catch (error) {
      console.error("Pay-In error:", error);

      alert(
        error.message ||
        "Unable to start payment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // CHECK PAYMENT STATUS
  // --------------------------------------------------

  const checkPaymentStatus = async () => {
    if (!payment?.order_id || paymentChecking) {
      return;
    }

    setPaymentChecking(true);
    setPaymentMessage(
      "Checking payment status..."
    );

    try {
      const response = await fetch(
        "/api/checkout/payin/status",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            order_id: payment.order_id,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "PayU status response:",
        data
      );

      if (
        !response.ok ||
        data.status !== "success"
      ) {
        throw new Error(
          data.error ||
          "Unable to check payment"
        );
      }

      const paymentStatus =
        data.data?.payment_status;

      // Your backend may return "paid"
      // or "success". Support both.
      if (
        paymentStatus === "paid" ||
        paymentStatus === "success"
      ) {
        setPaymentMessage(
          "Payment successful!"
        );

        // Clear cart
        window.localStorage.removeItem(
          "surya-cart"
        );

        window.dispatchEvent(
          new Event("surya-cart-updated")
        );

        // Show confirmation page
        setPayment(null);
        setOrderPlaced(true);

        return;
      }

      if (
        paymentStatus === "failed" ||
        paymentStatus === "failure"
      ) {
        setPaymentMessage(
          "Payment failed. Please start a new payment."
        );

        return;
      }

      setPaymentMessage(
        "Payment is still pending. Complete the UPI payment and check again."
      );
    } catch (error) {
      console.error(
        "Payment status error:",
        error
      );

      setPaymentMessage(
        error.message ||
        "Unable to check payment status."
      );
    } finally {
      setPaymentChecking(false);
    }
  };

  // --------------------------------------------------
  // ORDER SUCCESS PAGE
  // --------------------------------------------------

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-white px-6 py-24 text-center">
        <div
          className="mx-auto max-w-xl border border-green-100 bg-green-50 px-8 py-16"
          data-testid="order-confirmation"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
            Order confirmed
          </p>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Thank you for your order
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Your payment has been successfully
            received. We have received your order
            and will contact you shortly to confirm
            delivery details.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800"
          >
            Return to home
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // PAYU PAYMENT PAGE
  // --------------------------------------------------

  if (payment) {
    const qrUrl =
      `https://api.qrserver.com/v1/create-qr-code/` +
      `?size=320x320&margin=12&data=${encodeURIComponent(
        payment.qr_string
      )}`;

    return (
      <main className="min-h-screen bg-slate-50 px-4 py-14 text-slate-800 sm:px-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center shadow-xl sm:p-10">

          {/* Header */}
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
            Secure UPI Payment
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Complete Your Payment
          </h1>

          <p className="mt-3 text-slate-600">
            Scan the QR code using any supported
            UPI app and complete your payment.
          </p>

          {/* Amount */}
          <div className="mt-6">
            <p className="text-sm text-slate-500">
              Amount
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {formatINR(payment.amount)}
            </p>
          </div>

          {/* QR */}
          <div className="mx-auto mt-8 w-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Image
              src={qrUrl}
              alt="UPI payment QR code"
              width={320}
              height={320}
              unoptimized
              className="h-64 w-64 sm:h-80 sm:w-80"
            />
          </div>

          {/* Order ID */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Order ID
            </p>

            <p className="mt-1 break-all font-semibold text-slate-900">
              {payment.order_id}
            </p>
          </div>

          {/* Open UPI App */}
          {payment.qr_string && (
            <a
              href={payment.qr_string}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800 sm:w-auto"
            >
              Open UPI App
            </a>
          )}

          {/* Instructions */}
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-left text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-900">
              How to pay
            </p>

            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>
                Open Google Pay, PhonePe, Paytm or
                another supported UPI app.
              </li>

              <li>
                Scan the QR code above.
              </li>

              <li>
                Complete the payment.
              </li>

              <li>
                Return here and click
                <strong>
                  {" "}I Have Paid — Check Payment
                </strong>.
              </li>
            </ol>
          </div>

          {/* Check Payment */}
          <button
            type="button"
            disabled={paymentChecking}
            onClick={checkPaymentStatus}
            className="mt-6 w-full rounded-lg bg-green-700 px-6 py-4 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {paymentChecking
              ? "Checking Payment..."
              : "I Have Paid — Check Payment"}
          </button>

          {/* Status message */}
          {paymentMessage && (
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm font-medium text-slate-600">
              {paymentMessage}
            </div>
          )}

          <p className="mt-5 text-xs text-slate-400">
            Payment status is confirmed by Surya
            Enterprise using PayU. Do not close this
            page until your payment is confirmed.
          </p>

          {/* Back */}
          <button
            type="button"
            onClick={() => {
              setPayment(null);
              setPaymentMessage("");
            }}
            className="mt-5 text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            ← Back to Checkout
          </button>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // NORMAL CHECKOUT PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-white px-4 py-14 text-slate-800 sm:px-8 md:px-12 lg:px-20">

      <form
        onSubmit={placeOrder}
        className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]"
      >

        {/* =========================
            BILLING DETAILS
        ========================== */}

        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Billing Details
          </h1>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">

            <label className="text-sm font-semibold">
              First name{" "}
              <span className="text-red-600">
                *
              </span>

              <input
                required
                name="firstName"
                value={details.firstName}
                onChange={updateDetails}
                className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700"
              />
            </label>

            <label className="text-sm font-semibold">
              Last name{" "}
              <span className="text-red-600">
                *
              </span>

              <input
                required
                name="lastName"
                value={details.lastName}
                onChange={updateDetails}
                className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-semibold">
            Country / Region

            <input
              readOnly
              value="India"
              className="mt-2 w-full border border-slate-200 bg-slate-50 px-3 py-3 font-normal"
            />
          </label>

          <label className="mt-5 block text-sm font-semibold">
            House number and street name{" "}
            <span className="text-red-600">
              *
            </span>

            <input
              required
              name="address"
              value={details.address}
              onChange={updateDetails}
              className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700"
            />
          </label>

          <label className="mt-5 block text-sm font-semibold">
            Apartment, suite, etc.{" "}
            <span className="font-normal text-slate-400">
              (optional)
            </span>

            <input
              name="apartment"
              value={details.apartment}
              onChange={updateDetails}
              className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700"
            />
          </label>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <label className="text-sm font-semibold">
              Town / City{" "}
              <span className="text-red-600">
                *
              </span>

              <input
                required
                name="city"
                value={details.city}
                onChange={updateDetails}
                className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700"
              />
            </label>

            <label className="text-sm font-semibold">
              State{" "}
              <span className="text-red-600">
                *
              </span>

              <select
                name="state"
                value={details.state}
                onChange={updateDetails}
                className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-green-700"
              >
                <option>Delhi</option>
                <option>Gujarat</option>
                <option>Maharashtra</option>
                <option>Rajasthan</option>
                <option>Uttar Pradesh</option>
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <label className="text-sm font-semibold">
              PIN Code{" "}
              <span className="text-red-600">
                *
              </span>

              <input
                required
                inputMode="numeric"
                name="pinCode"
                value={details.pinCode}
                onChange={updateDetails}
                className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700"
              />
            </label>

            <label className="text-sm font-semibold">
              Phone{" "}
              <span className="text-red-600">
                *
              </span>

              <input
                required
                type="tel"
                name="phone"
                value={details.phone}
                onChange={updateDetails}
                className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-semibold">
            Email address{" "}
            <span className="text-red-600">
              *
            </span>

            <input
              required
              type="email"
              name="email"
              value={details.email}
              onChange={updateDetails}
              className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700"
            />
          </label>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">
            Additional Information
          </h2>

          <label className="mt-4 block text-sm font-semibold">
            Order notes{" "}
            <span className="font-normal text-slate-400">
              (optional)
            </span>

            <textarea
              name="notes"
              value={details.notes}
              onChange={updateDetails}
              placeholder="Notes about your order, e.g. special notes for delivery."
              rows={4}
              className="mt-2 w-full resize-y border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700"
            />
          </label>
        </section>

        {/* =========================
            ORDER SUMMARY
        ========================== */}

        <aside className="self-start bg-slate-50 p-6 md:p-8">

          <h2 className="text-2xl font-bold text-slate-900">
            Your Order
          </h2>

          <div className="mt-5 border-y border-slate-200">

            <div className="grid grid-cols-[1fr_auto] gap-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              <span>Product</span>
              <span>Subtotal</span>
            </div>

            {cartItems.length === 0 ? (
              <p className="border-t border-slate-200 py-5 text-sm text-slate-500">
                Your cart is empty.{" "}

                <Link
                  href="/products"
                  className="font-semibold text-green-700 underline"
                >
                  Browse products
                </Link>
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.sku}
                  className="grid grid-cols-[1fr_auto] gap-4 border-t border-slate-200 py-4 text-sm"
                >
                  <span className="leading-5">
                    {item.product.name} ×{" "}
                    {item.quantity}
                  </span>

                  <span>
                    {formatINR(
                      item.product.price *
                      item.quantity
                    )}
                  </span>
                </div>
              ))
            )}

            <div className="grid grid-cols-[1fr_auto] border-t border-slate-200 py-4 text-sm font-bold">
              <span>Subtotal</span>
              <span>
                {formatINR(subtotal)}
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto] border-t border-slate-200 py-4 font-bold">
              <span>Total</span>
              <span>
                {formatINR(subtotal)}
              </span>
            </div>
          </div>

          {/* PAYMENT METHOD */}

          <div className="mt-8 border-b border-slate-200 pb-6">

            <p className="font-semibold text-slate-900">
              Online Payment
            </p>

            <p className="mt-3 bg-white p-4 text-sm leading-6 text-slate-600">
              Pay securely using UPI. After
              placing your order, a secure UPI
              payment QR code will appear.
            </p>
          </div>

          {/* PLACE ORDER */}

          <button
            type="submit"
            disabled={
              cartItems.length === 0 ||
              isLoading
            }
            data-testid="place-order-btn"
            className="mt-6 w-full bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading
              ? "Creating Payment..."
              : `Pay ${formatINR(subtotal)}`}
          </button>

        </aside>
      </form>
    </main>
  );
}

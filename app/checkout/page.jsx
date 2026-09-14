"use client";

import Link from "next/link";
import { useState } from "react";
import { getProduct, formatINR } from "../products/data/products";

function readCart() {
  if (typeof window === "undefined") return {};
  const savedCart = window.localStorage.getItem("surya-cart");
  return savedCart ? JSON.parse(savedCart) : {};
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
  const cartItems = Object.entries(cart)
    .map(([sku, quantity]) => ({ product: getProduct(sku), quantity }))
    .filter((item) => item.product);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const updateDetails = (event) => {
    setDetails((currentDetails) => ({
      ...currentDetails,
      [event.target.name]: event.target.value,
    }));
  };

  const placeOrder = (event) => {
    event.preventDefault();
    setOrderPlaced(true);
    window.localStorage.removeItem("surya-cart");
    window.dispatchEvent(new Event("surya-cart-updated"));
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-white px-6 py-24 text-center">
        <div className="mx-auto max-w-xl border border-green-100 bg-green-50 px-8 py-16" data-testid="order-confirmation">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
            Order confirmed
          </p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">Thank you for your order</h1>
          <p className="mt-4 leading-7 text-slate-600">
            We have received your order and will contact you shortly to confirm delivery details.
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

  return (
    <main className="min-h-screen bg-white px-4 py-14 text-slate-800 sm:px-8 md:px-12 lg:px-20">
      <form onSubmit={placeOrder} className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">Checkout</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Billing Details</h1>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              First name <span className="text-red-600">*</span>
              <input required name="firstName" value={details.firstName} onChange={updateDetails} className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700" />
            </label>
            <label className="text-sm font-semibold">
              Last name <span className="text-red-600">*</span>
              <input required name="lastName" value={details.lastName} onChange={updateDetails} className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700" />
            </label>
          </div>

          <label className="mt-5 block text-sm font-semibold">
            Country / Region
            <input readOnly value="India" className="mt-2 w-full border border-slate-200 bg-slate-50 px-3 py-3 font-normal" />
          </label>
          <label className="mt-5 block text-sm font-semibold">
            House number and street name <span className="text-red-600">*</span>
            <input required name="address" value={details.address} onChange={updateDetails} className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700" />
          </label>
          <label className="mt-5 block text-sm font-semibold">
            Apartment, suite, etc. <span className="font-normal text-slate-400">(optional)</span>
            <input name="apartment" value={details.apartment} onChange={updateDetails} className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700" />
          </label>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Town / City <span className="text-red-600">*</span>
              <input required name="city" value={details.city} onChange={updateDetails} className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700" />
            </label>
            <label className="text-sm font-semibold">
              State <span className="text-red-600">*</span>
              <select name="state" value={details.state} onChange={updateDetails} className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-green-700">
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
              PIN Code <span className="text-red-600">*</span>
              <input required inputMode="numeric" name="pinCode" value={details.pinCode} onChange={updateDetails} className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700" />
            </label>
            <label className="text-sm font-semibold">
              Phone <span className="text-red-600">*</span>
              <input required type="tel" name="phone" value={details.phone} onChange={updateDetails} className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700" />
            </label>
          </div>
          <label className="mt-5 block text-sm font-semibold">
            Email address <span className="text-red-600">*</span>
            <input required type="email" name="email" value={details.email} onChange={updateDetails} className="mt-2 w-full border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700" />
          </label>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">Additional Information</h2>
          <label className="mt-4 block text-sm font-semibold">
            Order notes <span className="font-normal text-slate-400">(optional)</span>
            <textarea name="notes" value={details.notes} onChange={updateDetails} placeholder="Notes about your order, e.g. special notes for delivery." rows={4} className="mt-2 w-full resize-y border border-slate-400 px-3 py-3 font-normal outline-none focus:border-green-700" />
          </label>
        </section>

        <aside className="self-start bg-slate-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Your Order</h2>
          <div className="mt-5 border-y border-slate-200">
            <div className="grid grid-cols-[1fr_auto] gap-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              <span>Product</span>
              <span>Subtotal</span>
            </div>
            {cartItems.length === 0 ? (
              <p className="border-t border-slate-200 py-5 text-sm text-slate-500">
                Your cart is empty. <Link href="/products" className="font-semibold text-green-700 underline">Browse products</Link>
              </p>
            ) : (
              cartItems.map((item) => (
                <div key={item.product.sku} className="grid grid-cols-[1fr_auto] gap-4 border-t border-slate-200 py-4 text-sm">
                  <span className="leading-5">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatINR(item.product.price * item.quantity)}</span>
                </div>
              ))
            )}
            <div className="grid grid-cols-[1fr_auto] border-t border-slate-200 py-4 text-sm font-bold">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] border-t border-slate-200 py-4 font-bold">
              <span>Total</span>
              <span>{formatINR(subtotal)}</span>
            </div>
          </div>

          <div className="mt-8 border-b border-slate-200 pb-6">
            <p className="font-semibold text-slate-900">Cash on delivery</p>
            <p className="mt-3 bg-white p-4 text-sm leading-6 text-slate-600">Pay with cash upon delivery.</p>
          </div>
          <button
            type="submit"
            disabled={cartItems.length === 0}
            data-testid="place-order-btn"
            className="mt-6 bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Place order
          </button>
        </aside>
      </form>
    </main>
  );
}

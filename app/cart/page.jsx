"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  getProductPrice,
  images,
} from "../products/components/productGallery";

function readCart() {
  if (typeof window === "undefined") return {};

  const savedCart = window.localStorage.getItem("surya-cart");
  return savedCart ? JSON.parse(savedCart) : {};
}

export default function CartPage() {
  const [cart, setCart] = useState(readCart);
  const cartItems = Object.entries(cart).map(([index, quantity]) => ({
    index: Number(index),
    image: images[Number(index)],
    quantity,
    price: getProductPrice(Number(index)),
  }));
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const updateQuantity = (index, change) => {
    setCart((currentCart) => {
      const nextQuantity = (currentCart[index] || 0) + change;
      const nextCart = { ...currentCart };

      if (nextQuantity > 0) {
        nextCart[index] = nextQuantity;
      } else {
        delete nextCart[index];
      }

      window.localStorage.setItem("surya-cart", JSON.stringify(nextCart));
      window.dispatchEvent(new Event("surya-cart-updated"));
      return nextCart;
    });
  };

  return (
    <main className="min-h-screen bg-white px-4 py-14 text-slate-800 sm:px-8 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
              Shopping cart
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Your Cart
            </h1>
          </div>
          <Link
            href="/products"
            className="font-semibold text-green-700 underline-offset-4 hover:underline"
          >
            Continue shopping
          </Link>
        </header>

        {cartItems.length === 0 ? (
          <div className="border border-slate-200 px-6 py-20 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-green-700" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold text-slate-900">Your cart is empty</h2>
            <p className="mt-2 text-slate-500">Add products to see them here.</p>
            <Link
              href="/products"
              className="mt-7 inline-flex bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-hidden border-y border-slate-200">
              <div className="hidden grid-cols-[48px_minmax(220px,1fr)_120px_180px_140px] gap-6 border-b border-slate-200 px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500 md:grid">
                <span />
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.image.src}
                  className="grid gap-4 border-b border-slate-200 px-4 py-6 md:grid-cols-[48px_minmax(220px,1fr)_120px_180px_140px] md:items-center md:gap-6 md:px-6"
                >
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.index, -item.quantity)}
                    aria-label={`Remove product ${item.index + 1}`}
                    className="flex h-9 w-9 items-center justify-center bg-slate-50 text-xl text-green-700 hover:bg-green-50"
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 bg-white">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </div>
                    <h2 className="font-bold leading-6 text-slate-800">
                      Agricultural product {String(item.index + 1).padStart(2, "0")} - crop care solution
                    </h2>
                  </div>
                  <div className="font-bold text-slate-800">
                    <span className="mr-2 text-xs font-normal text-slate-500 md:hidden">Price</span>
                    ₹ {item.price.toLocaleString("en-IN")}.00
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 md:hidden">Quantity</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.index, -1)}
                      aria-label="Decrease quantity"
                      className="flex h-9 w-9 items-center justify-center bg-slate-50 text-green-800 hover:bg-green-50"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="flex h-9 min-w-12 items-center justify-center border border-slate-200 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.index, 1)}
                      aria-label="Increase quantity"
                      className="flex h-9 w-9 items-center justify-center bg-green-700 text-white hover:bg-green-800"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="font-bold text-green-700">
                    <span className="mr-2 text-xs font-normal text-slate-500 md:hidden">Subtotal</span>
                    ₹ {(item.price * item.quantity).toLocaleString("en-IN")}.00
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="border-2 border-green-700 px-8 py-3 font-bold text-green-700 transition hover:bg-green-700 hover:text-white"
              >
                Update Cart
              </button>
            </div>

            <aside className="mt-12 ml-auto max-w-md bg-slate-50 p-8">
              <h2 className="text-xl font-bold text-slate-900">Cart Totals</h2>
              <div className="mt-5 border-t border-slate-200 pt-5">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>₹ {subtotal.toLocaleString("en-IN")}.00</span>
                </div>
                <div className="mt-6 flex justify-between border-t border-slate-200 pt-5 font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹ {subtotal.toLocaleString("en-IN")}.00</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center bg-green-700 px-5 py-3 text-center font-bold text-white transition hover:bg-green-800"
              >
                Proceed To Checkout
              </Link>
            </aside>
          </>
        )}
      </div>
    </main>
  );
}

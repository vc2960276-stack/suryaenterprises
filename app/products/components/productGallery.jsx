"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { getProduct, productsForView, formatINR } from "../data/products";

export default function ProductGallery({ category }) {
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return {};
    const savedCart = window.localStorage.getItem("surya-cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const viewProducts = productsForView(category);

  const cartItems = Object.entries(cart)
    .map(([sku, quantity]) => ({ product: getProduct(sku), quantity }))
    .filter((item) => item.product);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const updateQuantity = (sku, change) => {
    setCart((currentCart) => {
      const nextQuantity = (currentCart[sku] || 0) + change;
      const nextCart = { ...currentCart };
      if (nextQuantity > 0) {
        nextCart[sku] = nextQuantity;
      } else {
        delete nextCart[sku];
      }
      window.localStorage.setItem("surya-cart", JSON.stringify(nextCart));
      window.dispatchEvent(new Event("surya-cart-updated"));
      return nextCart;
    });
  };

  return (
    <section
      aria-labelledby="product-gallery-heading"
      id="cart"
      className="mt-14 border-t border-green-100 pt-14 md:mt-16 md:pt-16"
      data-testid="product-gallery"
    >
      <header className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">
          PRODUCT RANGE
        </p>
        <h2
          id="product-gallery-heading"
          className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
        >
          {category} Products
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Explore {viewProducts.length} products from our agricultural solutions range.
        </p>

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-4 border border-green-100 bg-green-50 px-5 py-4 text-sm">
          <ShoppingCart className="h-5 w-5 text-green-700" aria-hidden="true" />
          <span className="font-semibold text-slate-800" data-testid="cart-item-count">
            {itemCount} {itemCount === 1 ? "item" : "items"} in cart
          </span>
          <span className="text-slate-500">Subtotal:</span>
          <span className="text-lg font-bold text-green-700" data-testid="cart-subtotal">
            {formatINR(subtotal)}
          </span>
          {itemCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setCart({});
                window.localStorage.setItem("surya-cart", "{}");
                window.dispatchEvent(new Event("surya-cart-updated"));
              }}
              data-testid="clear-cart-btn"
              className="inline-flex items-center gap-1 text-slate-500 underline-offset-4 hover:text-red-600 hover:underline"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear cart
            </button>
          )}
        </div>
      </header>

      {itemCount > 0 && (
        <div className="mb-10 overflow-hidden border-y border-slate-200 bg-white">
          <div className="hidden grid-cols-[48px_minmax(220px,1fr)_120px_180px_140px] gap-6 border-b border-slate-200 px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500 md:grid">
            <span />
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.product.sku}
              className="grid gap-4 border-b border-slate-200 px-4 py-6 md:grid-cols-[48px_minmax(220px,1fr)_120px_180px_140px] md:items-center md:gap-6 md:px-6"
            >
              <button
                type="button"
                onClick={() => updateQuantity(item.product.sku, -item.quantity)}
                aria-label={`Remove ${item.product.name}`}
                className="flex h-9 w-9 items-center justify-center bg-slate-50 text-xl text-green-700 transition hover:bg-green-50"
              >
                ×
              </button>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 bg-white">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold leading-6 text-slate-800">{item.product.name}</h3>
              </div>
              <div className="font-bold text-slate-800">
                <span className="mr-2 text-xs font-normal text-slate-500 md:hidden">Price</span>
                {formatINR(item.product.price)}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-normal text-slate-500 md:hidden">Quantity</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.product.sku, -1)}
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
                  onClick={() => updateQuantity(item.product.sku, 1)}
                  aria-label="Increase quantity"
                  className="flex h-9 w-9 items-center justify-center bg-green-700 text-white hover:bg-green-800"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="font-bold text-green-700">
                <span className="mr-2 text-xs font-normal text-slate-500 md:hidden">Subtotal</span>
                {formatINR(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {viewProducts.map((product) => (
          <article
            key={product.sku}
            data-testid={`product-card-${product.sku}`}
            className="group relative flex min-h-[420px] flex-col overflow-hidden border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-square shrink-0 overflow-hidden bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-contain p-2 transition duration-500 group-hover:scale-105"
              />
              {product.isFeatured && (
                <span className="absolute right-3 top-3 bg-lime-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-green-950">
                  Featured
                </span>
              )}
              <span className="absolute left-3 top-3 bg-green-900/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {product.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
              <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-800">
                {product.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">SKU: {product.sku}</p>
              <p className="mt-1 text-xs font-medium text-green-700">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
              <p className="mt-auto pt-4 text-2xl font-bold text-green-700">
                {formatINR(product.price)}
              </p>
              {cart[product.sku] ? (
                <div className="mt-4 flex items-center justify-between border border-green-200 bg-green-50 p-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.sku, -1)}
                    aria-label={`Remove one ${product.name}`}
                    className="flex h-9 w-9 items-center justify-center text-green-800 transition hover:bg-white"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="font-bold text-green-900">{cart[product.sku]}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.sku, 1)}
                    aria-label={`Add one ${product.name}`}
                    className="flex h-9 w-9 items-center justify-center text-green-800 transition hover:bg-white"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => updateQuantity(product.sku, 1)}
                  data-testid={`add-to-cart-${product.sku}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-green-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  Add to cart
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

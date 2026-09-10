"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";

export const images = [
  "41hV0bY0QPL", "41NnoPBDI1L", "51BNUfVw9sL", "51dnfv4Ed7L",
  "51EupA0EhUL", "51mLj7rM9wL", "51NPS3Kdz5L", "51nqzpAKLcL",
  "51pIwSmqUuL", "51Ql5uTXL8L", "51Sq5HeBWDL", "51TUjaYWJJL",
  "51vOYPhp42L", "615Y75vnjLL", "618hi1yydSL", "61A-Gb8exL",
  "61g2Exjz8hL", "61ICHPYgX9L", "61NVysvJEL", "61oTa4EpjML",
  "61P811MVz7L", "61rInGHOgaL", "61tH3rkTKfL", "61Uj-Wd00hL",
  "61uN4uHGaL", "61YKl1tdghL", "61ymPNjgqAL", "712MhPjJCIL",
  "719Frbj3kiL", "71A1TuiwtHL", "71Ex0q12fvL", "71Ge3LSyo8L",
  "71H4oMZyI4L", "71j3T6dDKEL", "71JbzOOpJJL", "71KjhN5L1L",
  "71l25RbisL", "71LOtjfUsqL", "71oVG23bMVL", "71p9RBpKiL",
  "71rALmymU6L", "71rtPaNPGL", "71SFkPIGCQL", "71ThUxl5abL",
  "71V4Yj4oboL", "71vFf9T3VIL", "71vntpP8IWL", "71WNSRq4WlL",
  "71WV7IS7CJL", "71X0VwHWqeL",
].map((name) => ({
  src: `/assets/images/${name}-250x250.jpg`,
  alt: "Agricultural product",
}));

export const getProductPrice = (index) => 349 + index * 73;

const categoryRanges = {
    Featured: [0, 7],
    Insecticide: [0, 11],
    Herbicide: [12, 24],
    Fungicide: [25, 37],
    "PGR and Others": [38, 49],
};

export default function ProductGallery({ category }) {
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return {};

    const savedCart = window.localStorage.getItem("surya-cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
    const [start, end] = categoryRanges[category] || categoryRanges.Featured;
    const categoryImages = images.slice(start, end + 1).map((image, index) => ({
        ...image,
        productIndex: start + index,
    }));

  const itemCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const subtotal = Object.entries(cart).reduce(
    (total, [index, quantity]) => total + getProductPrice(Number(index)) * quantity,
    0,
  );
  const cartItems = Object.entries(cart).map(([index, quantity]) => ({
    index: Number(index),
    image: images[Number(index)],
    quantity,
    price: getProductPrice(Number(index)),
  }));

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
    <section
      aria-labelledby="product-gallery-heading"
      id="cart"
      className="mt-14 border-t border-green-100 pt-14 md:mt-16 md:pt-16"
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
          Explore selected products from our agricultural solutions range.
        </p>

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-4 border border-green-100 bg-green-50 px-5 py-4 text-sm">
          <ShoppingCart className="h-5 w-5 text-green-700" aria-hidden="true" />
          <span className="font-semibold text-slate-800">
            {itemCount} {itemCount === 1 ? "item" : "items"} in cart
          </span>
          <span className="text-slate-500">Subtotal:</span>
          <span className="text-lg font-bold text-green-700">
            ₹ {subtotal.toLocaleString("en-IN")}.00
          </span>
          {itemCount > 0 && (
            <button
              type="button"
              onClick={() => setCart({})}
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
              key={item.image.src}
              className="grid gap-4 border-b border-slate-200 px-4 py-6 md:grid-cols-[48px_minmax(220px,1fr)_120px_180px_140px] md:items-center md:gap-6 md:px-6"
            >
              <button
                type="button"
                onClick={() => updateQuantity(item.index, -item.quantity)}
                aria-label={`Remove ${category} product ${item.index + 1}`}
                className="flex h-9 w-9 items-center justify-center bg-slate-50 text-xl text-green-700 transition hover:bg-green-50"
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
                <h3 className="font-bold leading-6 text-slate-800">
                  {category} product {String(item.index + 1).padStart(2, "0")} - crop care solution
                </h3>
              </div>
              <div className="font-bold text-slate-800">
                <span className="mr-2 text-xs font-normal text-slate-500 md:hidden">Price</span>
                ₹ {item.price.toLocaleString("en-IN")}.00
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-normal text-slate-500 md:hidden">Quantity</span>
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

          <div className="flex justify-end px-4 py-6 md:px-6">
            <button
              type="button"
              className="border-2 border-green-700 px-8 py-3 font-bold text-green-700 transition hover:bg-green-700 hover:text-white"
            >
              Update Cart
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categoryImages.map((image, index) => (
          <article
            key={image.src}
            className="group relative flex min-h-[390px] flex-col overflow-hidden border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-square shrink-0 overflow-hidden bg-white">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-contain p-2 transition duration-500 group-hover:scale-105"
              />
              <span className="absolute right-3 top-3 bg-lime-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-green-950">
                Featured
              </span>
            </div>
            <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
              <h3 className="line-clamp-2 min-h-14 text-lg font-medium leading-7 text-slate-800">
                {category} product {String(index + 1).padStart(2, "0")} - crop care solution
              </h3>
              <p className="mt-auto pt-5 text-2xl font-bold text-green-700">
                        ₹ {getProductPrice(image.productIndex).toLocaleString("en-IN")}.00
              </p>
                    {cart[image.productIndex] ? (
                <div className="mt-4 flex items-center justify-between border border-green-200 bg-green-50 p-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(image.productIndex, -1)}
                    aria-label={`Remove one ${category} product ${image.productIndex + 1}`}
                    className="flex h-9 w-9 items-center justify-center text-green-800 transition hover:bg-white"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                            <span className="font-bold text-green-900">{cart[image.productIndex]}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(image.productIndex, 1)}
                    aria-label={`Add one ${category} product ${image.productIndex + 1}`}
                    className="flex h-9 w-9 items-center justify-center text-green-800 transition hover:bg-white"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => updateQuantity(image.productIndex, 1)}
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

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";
import { addToCart, setQty, useCart, useCartHydrated } from "../../lib-shop/cart";
import { toast } from "../../lib-shop/toast";
import QuantityStepper from "./QuantityStepper";
import WishlistButton from "./WishlistButton";

// Quantity + "Add to cart" (yellow) + "Buy now" (green). Writes the exact
// surya-cart contract via lib-shop/cart.
export default function BuyBox({ sku, name, stock }) {
  const router = useRouter();
  const cart = useCart();
  const hydrated = useCartHydrated();
  const inCart = hydrated ? cart[sku] || 0 : 0;
  const [qty, setLocalQty] = useState(1);
  const max = Math.max(0, stock - inCart);
  const inStock = stock > 0;

  const add = () => {
    if (inCart > 0) {
      setQty(sku, inCart + qty, stock);
    } else {
      addToCart(sku, qty, stock);
    }
    setLocalQty(1);
  };

  if (!inStock) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-danger">Currently out of stock</p>
        <WishlistButton sku={sku} name={name} variant="button" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] font-semibold text-ink">Quantity</span>
        <QuantityStepper value={Math.min(qty, Math.max(1, max))} min={1} max={Math.max(1, max)} onChange={setLocalQty} itemName={name} />
        <span className="text-xs text-ink-2">
          {inCart > 0 ? <>{inCart} already in your cart · </> : null}
          max {stock}
        </span>
      </div>

      <div className="fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-40 grid grid-cols-2 max-sm:mb-0 gap-2 border-t border-line bg-white p-2 sm:static sm:z-auto sm:flex sm:border-0 sm:bg-transparent sm:p-0">
        <button
          type="button"
          disabled={max <= 0}
          onClick={() => {
            add();
            toast(`Added to cart: ${name}`, { tone: "success", action: { label: "View cart", href: "/cart" } });
          }}
          className="btn btn-cart h-12 w-full text-[15px] sm:w-52"
        >
          <ShoppingCart className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          {max <= 0 ? "Max in cart" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (max > 0 || inCart === 0) add();
            router.push("/checkout");
          }}
          className="btn btn-buy h-12 w-full text-[15px] sm:w-52"
        >
          <Zap className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Buy now
        </button>
      </div>

      <WishlistButton sku={sku} name={name} variant="button" className="h-9 text-[13px]" />
    </div>
  );
}

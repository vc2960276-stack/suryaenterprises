"use client";

import { ShoppingCart } from "lucide-react";
import { addToCart, setQty, useCart, useCartHydrated } from "../../lib-shop/cart";
import { toast } from "../../lib-shop/toast";
import QuantityStepper from "./QuantityStepper";

// Yellow "Add to cart" that turns into a quantity stepper once in the cart.
export default function AddToCartControl({ sku, name, stock, size = "sm", className = "" }) {
  const cart = useCart();
  const hydrated = useCartHydrated();
  const qty = hydrated ? cart[sku] || 0 : 0;
  const inStock = stock > 0;

  if (!inStock) {
    return (
      <button type="button" disabled aria-label={`${name} is out of stock`} className={`btn btn-disabled w-full ${className}`}>
        Out of stock
      </button>
    );
  }

  if (qty > 0) {
    return (
      <div className={`flex items-center justify-between gap-2 ${className}`}>
        <QuantityStepper
          value={qty}
          max={stock}
          size={size}
          removable
          itemName={name}
          onChange={(next) => {
            setQty(sku, next, stock);
            if (next <= 0) toast(`Removed ${name} from cart`);
          }}
        />
        <span className="text-xs font-medium text-brand">In cart</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addToCart(sku, 1, stock);
        toast(`Added to cart: ${name}`, { tone: "success", action: { label: "View cart", href: "/cart" } });
      }}
      aria-label={`Add ${name} to cart`}
      className={`btn btn-cart w-full ${size === "sm" ? "h-8 text-[13px]" : ""} ${className}`}
    >
      <ShoppingCart className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      Add to cart
    </button>
  );
}

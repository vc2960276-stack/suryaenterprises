"use client";

import { Heart } from "lucide-react";
import { toggleWishlist, useWishlist, useWishlistHydrated } from "../../lib-shop/wishlist";
import { toast } from "../../lib-shop/toast";

export default function WishlistButton({ sku, name, variant = "icon", className = "" }) {
  const list = useWishlist();
  const hydrated = useWishlistHydrated();
  const active = hydrated && list.includes(sku);

  const onClick = (e) => {
    e.preventDefault();
    const added = toggleWishlist(sku);
    toast(added ? `Saved to wishlist: ${name}` : `Removed from wishlist: ${name}`, {
      action: added ? { label: "View", href: "/wishlist" } : undefined,
    });
  };

  if (variant === "button") {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={`btn btn-outline ${className}`}>
        <Heart className={`h-4 w-4 ${active ? "fill-danger text-danger" : ""}`} strokeWidth={1.75} aria-hidden="true" />
        {active ? "Wishlisted" : "Wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white/95 text-ink-3 shadow-sm transition hover:text-danger ${className}`}
    >
      <Heart className={`h-4 w-4 ${active ? "fill-danger text-danger" : ""}`} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

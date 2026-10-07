"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Home, LayoutGrid, Search, ShoppingCart } from "lucide-react";
import { cartCount, useCart, useCartHydrated } from "../../lib-shop/cart";
import { useWishlist, useWishlistHydrated } from "../../lib-shop/wishlist";
import { FOCUS_SEARCH_EVENT } from "./SearchBar";

const itemsLabel = (n) => `${n} ${n === 1 ? "item" : "items"}`;

function Badge({ count }) {
  if (!count) return null;
  return (
    <span aria-hidden="true" className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-harvest px-1 text-[10px] font-bold tabular-nums text-ink">
      {count > 99 ? "99+" : count}
    </span>
  );
}

// Flipkart-style bottom navigation for phones.
export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const cart = useCart();
  const cartReady = useCartHydrated();
  const wishlist = useWishlist();
  const wishReady = useWishlistHydrated();
  const cartQty = cartReady ? cartCount(cart) : 0;
  const wishQty = wishReady ? wishlist.length : 0;

  const item = (active) =>
    `relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
      active ? "text-brand" : "text-ink-2"
    }`;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="flex h-14 items-stretch">
        <Link href="/" className={item(pathname === "/")} aria-current={pathname === "/" ? "page" : undefined}>
          <Home className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Home
        </Link>
        <Link
          href="/products"
          className={item(pathname === "/products" || pathname.startsWith("/c/"))}
          aria-current={pathname === "/products" ? "page" : undefined}
        >
          <LayoutGrid className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Categories
        </Link>
        <button
          type="button"
          className={item(pathname === "/search")}
          onClick={() => {
            if (pathname === "/checkout") router.push("/search");
            else window.dispatchEvent(new Event(FOCUS_SEARCH_EVENT));
          }}
        >
          <Search className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Search
        </button>
        <Link href="/wishlist" aria-label={`Wishlist, ${itemsLabel(wishQty)}`} className={item(pathname === "/wishlist")} aria-current={pathname === "/wishlist" ? "page" : undefined}>
          <span className="relative">
            <Heart className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            <Badge count={wishQty} />
          </span>
          Wishlist
        </Link>
        <Link href="/cart" aria-label={`Cart, ${itemsLabel(cartQty)}`} className={item(pathname === "/cart")} aria-current={pathname === "/cart" ? "page" : undefined}>
          <span className="relative">
            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            <Badge count={cartQty} />
          </span>
          Cart
        </Link>
      </div>
    </nav>
  );
}

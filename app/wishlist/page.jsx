"use client";

import { Heart } from "lucide-react";
import Breadcrumbs from "../components/shop/Breadcrumbs";
import EmptyState from "../components/shop/EmptyState";
import ProductCard from "../components/shop/ProductCard";
import { CardSkeleton } from "../components/shop/Skeletons";
import { useWishlist, useWishlistHydrated } from "../lib-shop/wishlist";
import { getProduct } from "../products/data/products";

export default function WishlistPage() {
  const skus = useWishlist();
  const hydrated = useWishlistHydrated();
  const items = skus.map((sku) => getProduct(sku)).filter(Boolean);

  return (
    <main className="shell py-3">
      <Breadcrumbs className="mb-2" items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <div className="mb-2 rounded-lg border border-line bg-white px-4 py-3">
        <h1 className="font-display text-lg font-extrabold text-ink">
          My Wishlist{" "}
          {hydrated && <span className="font-sans text-sm font-medium text-ink-2">({items.length})</span>}
        </h1>
        <p className="text-xs text-ink-2">Saved on this device. Accounts and synced wishlists are coming soon.</p>
      </div>
      {!hydrated ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-busy="true">
          {Array.from({ length: 5 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" actions={[{ label: "Explore products", href: "/products" }]}>
          <p>Tap the heart on any product to save it here for later.</p>
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {items.map((p) => (
            <li key={p.sku}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

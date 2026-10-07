// Wishlist: localStorage["surya-wishlist"] = array of skus.
import { createLocalStore } from "./local-store";

const store = createLocalStore({
  key: "surya-wishlist",
  event: "surya-wishlist-updated",
  empty: [],
  validate: Array.isArray,
});

export const readWishlist = store.read;
export const useWishlist = store.useValue;
export const useWishlistHydrated = store.useHydrated;

export function toggleWishlist(sku) {
  const list = readWishlist();
  const has = list.includes(sku);
  store.write(has ? list.filter((s) => s !== sku) : [sku, ...list]);
  return !has;
}

export function addToWishlist(sku) {
  const list = readWishlist();
  if (!list.includes(sku)) store.write([sku, ...list]);
}

export function removeFromWishlist(sku) {
  store.write(readWishlist().filter((s) => s !== sku));
}

// Builds listing URLs (category, subcategory + search pages) from normalized
// filter state. Shared by server components (links) and client components
// (router.push).
//
// Query keys: q, category (search scope only), sub[], brand[], crop[], min,
// max, unit[], stock, sort, page.

export function listingSearchParams(state) {
  const sp = new URLSearchParams();
  if (state.q) sp.set("q", state.q);
  if (state.category) sp.set("category", state.category);
  for (const s of state.subs ?? []) sp.append("sub", s);
  for (const b of state.brands ?? []) sp.append("brand", b);
  for (const c of state.crops ?? []) sp.append("crop", c);
  if (state.min != null) sp.set("min", String(state.min));
  if (state.max != null) sp.set("max", String(state.max));
  for (const u of state.units ?? []) sp.append("unit", u);
  if (state.inStock) sp.set("stock", "1");
  if (state.sort && state.sort !== "relevance") sp.set("sort", state.sort);
  if (state.page && state.page > 1) sp.set("page", String(state.page));
  return sp;
}

export function listingHref(basePath, state, overrides = {}) {
  const next = { ...state, page: 1, ...overrides };
  const qs = listingSearchParams(next).toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

export const toggleValue = (list = [], value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export const PRICE_PRESETS = [
  { label: "Under ₹500", min: null, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
  { label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
  { label: "Over ₹5,000", min: 5000, max: null },
];

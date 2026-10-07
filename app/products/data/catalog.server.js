// Server-only catalogue access for marketplace pages (home, listing, search,
// product detail, search suggestions). The full ~6 MB catalogue never reaches
// the browser: pages read from here and pass only the rendered page of results
// (as plain "card" objects) to client components.
import "server-only";
import productsData from "./products.json";
import { CATEGORIES, categoryByData, categoryBySlug } from "../../config/taxonomy";

export const PAGE_SIZE = 24;

// ---------------------------------------------------------------------------
// Indexes (built once per server process)
// ---------------------------------------------------------------------------

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9.%]+/g, " ")
    .trim();

const tokenize = (value) => normalize(value).split(" ").filter(Boolean);

const UNIT_FACTORS = { ml: 1, l: 1000, g: 1, gm: 1, kg: 1000 };

// "100 ml" -> 100, "5 L" -> 5000 (for sorting pack sizes small -> large).
export function packSizeValue(unit) {
  const match = /([\d.]+)\s*([a-z]+)/i.exec(String(unit ?? ""));
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number(match[1]) * (UNIT_FACTORS[match[2].toLowerCase()] ?? 1);
}

const records = productsData.map((product, order) => ({
  product,
  order,
  categorySlug: categoryByData[product.category]?.slug ?? null,
  nameTokens: tokenize(product.name),
  nameText: normalize(product.name),
  aiText: normalize(product.activeIngredient),
  descText: normalize(product.description),
}));

const bySlug = new Map(records.map((r) => [r.product.slug, r]));
const bySku = new Map(records.map((r) => [r.product.sku, r]));

// ---------------------------------------------------------------------------
// Shapes sent to the browser
// ---------------------------------------------------------------------------

// The minimal props a ProductCard needs. Optional owner-supplied fields are
// passed through only when present so they render automatically later.
export function toCard(product) {
  const card = {
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    unit: product.unit,
    stock: product.stock,
    category: product.category,
    activeIngredient: product.activeIngredient,
    rating: product.rating ?? null,
  };
  if (product.mrp) card.mrp = product.mrp;
  if (product.reviewsCount) card.reviewsCount = product.reviewsCount;
  return card;
}

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export function getProductBySlug(slug) {
  return bySlug.get(slug)?.product ?? null;
}

export function getProductBySkuServer(sku) {
  return bySku.get(sku)?.product ?? null;
}

export function getCategoryProducts(slug) {
  return records.filter((r) => r.categorySlug === slug);
}

// Pick up to `limit` records, at most one per active ingredient, so rails
// don't fill up with five pack sizes of the same product.
function distinctByIngredient(list, limit) {
  const seen = new Set();
  const out = [];
  for (const r of list) {
    const key = r.product.activeIngredient;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
    if (out.length >= limit) break;
  }
  return out;
}

const byRatingDesc = (a, b) =>
  (b.product.rating ?? 0) - (a.product.rating ?? 0) || a.order - b.order;

// Small deterministic hash so "Customers also viewed" is stable per product.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ---------------------------------------------------------------------------
// Navigation / home data
// ---------------------------------------------------------------------------

let navCache = null;

// Category strip + mega menu: counts, popular active ingredients, pack sizes.
export function getNavCategories() {
  if (navCache) return navCache;
  navCache = CATEGORIES.map((category) => {
    const list = getCategoryProducts(category.slug);
    const aiCounts = new Map();
    const unitCounts = new Map();
    for (const r of list) {
      aiCounts.set(r.product.activeIngredient, (aiCounts.get(r.product.activeIngredient) ?? 0) + 1);
      unitCounts.set(r.product.unit, (unitCounts.get(r.product.unit) ?? 0) + 1);
    }
    const topIngredients = [...aiCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([value, count]) => ({ value, count }));
    const packSizes = [...unitCounts.entries()]
      .sort((a, b) => packSizeValue(a[0]) - packSizeValue(b[0]))
      .map(([value, count]) => ({ value, count }));
    const top = [...list].sort(byRatingDesc)[0]?.product;
    return {
      slug: category.slug,
      name: category.name,
      shortName: category.shortName ?? category.name,
      need: category.need,
      icon: category.icon,
      tint: category.tint,
      description: category.description,
      count: list.length,
      image: top?.image ?? null,
      illustration: category.illustration ?? null,
      topIngredients,
      packSizes,
    };
  });
  return navCache;
}

export function getCatalogStats() {
  return { total: records.length, ingredients: new Set(records.map((r) => r.product.activeIngredient)).size };
}

export function getHomeRails() {
  const featured = distinctByIngredient(
    records.filter((r) => r.product.isFeatured).sort(byRatingDesc),
    16
  );
  const topRated = distinctByIngredient(
    records.filter((r) => (r.product.rating ?? 0) >= 4.5).sort(byRatingDesc),
    16
  );
  const under500 = distinctByIngredient(
    records.filter((r) => r.product.price < 500).sort(byRatingDesc),
    16
  );
  const perCategory = CATEGORIES.map((category) => ({
    slug: category.slug,
    name: category.name,
    items: distinctByIngredient(getCategoryProducts(category.slug).sort(byRatingDesc), 14).map((r) =>
      toCard(r.product)
    ),
  }));
  return {
    featured: featured.map((r) => toCard(r.product)),
    topRated: topRated.map((r) => toCard(r.product)),
    under500: under500.map((r) => toCard(r.product)),
    perCategory,
  };
}

// A few real product images per category for hero / landing collages.
export function getCategoryShowcase(slug, limit = 4) {
  return distinctByIngredient(getCategoryProducts(slug).sort(byRatingDesc), limit).map((r) =>
    toCard(r.product)
  );
}

export function getTopPicks(limit = 12) {
  const perCat = Math.ceil(limit / CATEGORIES.length);
  return CATEGORIES.flatMap((c) =>
    distinctByIngredient(getCategoryProducts(c.slug).sort(byRatingDesc), perCat)
  )
    .slice(0, limit)
    .map((r) => toCard(r.product));
}

// ---------------------------------------------------------------------------
// Product detail helpers
// ---------------------------------------------------------------------------

// Other pack sizes of the same active ingredient (one per unit).
export function getPackVariants(product) {
  const seen = new Set();
  return records
    .filter((r) => r.product.activeIngredient === product.activeIngredient && r.product.category === product.category)
    .sort((a, b) => {
      const aSelf = a.product.slug === product.slug ? -1 : 0;
      const bSelf = b.product.slug === product.slug ? -1 : 0;
      return aSelf - bSelf || a.order - b.order;
    })
    .filter((r) => {
      if (seen.has(r.product.unit)) return false;
      seen.add(r.product.unit);
      return true;
    })
    .sort((a, b) => packSizeValue(a.product.unit) - packSizeValue(b.product.unit))
    .map((r) => ({ slug: r.product.slug, unit: r.product.unit, price: r.product.price, stock: r.product.stock }));
}

export function getSimilarProducts(product, limit = 14) {
  const same = records.filter(
    (r) => r.product.category === product.category && r.product.activeIngredient !== product.activeIngredient
  );
  return distinctByIngredient(same.sort(byRatingDesc), limit).map((r) => toCard(r.product));
}

export function getAlsoViewed(product, limit = 14) {
  const seed = product.sku;
  const pool = records
    .filter((r) => r.product.category === product.category && r.product.activeIngredient !== product.activeIngredient)
    .map((r) => ({ r, k: hash(`${seed}:${r.product.sku}`) }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.r);
  return distinctByIngredient(pool, limit).map((r) => toCard(r.product));
}

// ---------------------------------------------------------------------------
// Listing: search, filters, facets, sort, pagination
// ---------------------------------------------------------------------------

export const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "popularity", label: "Popularity" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

const asArray = (value) =>
  (Array.isArray(value) ? value : value == null ? [] : [value]).map(String).filter(Boolean);

const asNumber = (value) => {
  if (value == null || value === "") return null;
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

const first = (value) => (Array.isArray(value) ? value[0] : value) ?? "";

export function parseListingParams(sp = {}) {
  const sort = String(first(sp.sort));
  const rating = asNumber(sp.rating);
  const page = Math.max(1, Math.floor(asNumber(sp.page) ?? 1));
  return {
    q: String(first(sp.q)).trim().slice(0, 120),
    category: String(first(sp.category)),
    min: asNumber(sp.min),
    max: asNumber(sp.max),
    rating: rating === 3 || rating === 4 ? rating : null,
    units: asArray(sp.unit),
    ais: asArray(sp.ai),
    inStock: first(sp.stock) === "1",
    sort: SORTS.some((s) => s.value === sort) ? sort : "relevance",
    page,
  };
}

function scoreRecord(record, tokens, phrase) {
  let score = 0;
  for (const token of tokens) {
    if (record.nameTokens.includes(token)) score += 4;
    else if (record.nameTokens.some((t) => t.startsWith(token))) score += 3;
    else if (record.aiText.includes(token)) score += 2;
    else if (record.descText.includes(token)) score += 1;
    else return 0; // every token must match somewhere
  }
  if (phrase && record.nameText.includes(phrase)) score += 5;
  if (phrase && record.nameText.startsWith(phrase)) score += 3;
  return score;
}

// Returns [{ record, score }] for a free-text query.
export function searchRecords(query, pool = records) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return pool.map((record) => ({ record, score: 0 }));
  const phrase = tokens.join(" ");
  const out = [];
  for (const record of pool) {
    const score = scoreRecord(record, tokens, phrase);
    if (score > 0) out.push({ record, score });
  }
  return out;
}

function passes(record, f, skip) {
  const p = record.product;
  if (skip !== "category" && f.category && record.categorySlug !== f.category) return false;
  if (skip !== "price") {
    if (f.min != null && p.price < f.min) return false;
    if (f.max != null && p.price > f.max) return false;
  }
  if (skip !== "rating" && f.rating != null && (p.rating ?? 0) < f.rating) return false;
  if (skip !== "unit" && f.units.length && !f.units.includes(p.unit)) return false;
  if (skip !== "ai" && f.ais.length && !f.ais.includes(p.activeIngredient)) return false;
  if (skip !== "stock" && f.inStock && !(p.stock > 0)) return false;
  return true;
}

function countBy(list, f, skip, key) {
  const counts = new Map();
  for (const { record } of list) {
    if (!passes(record, f, skip)) continue;
    const k = key(record);
    if (k == null) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

/**
 * Run a listing query.
 * @param {{ scope: "category" | "search", categorySlug?: string, params: ReturnType<typeof parseListingParams> }} input
 */
export function queryListing({ scope, categorySlug, params }) {
  const filters = { ...params };
  if (scope === "category") filters.category = categorySlug;
  if (filters.category && !categoryBySlug[filters.category]) filters.category = "";

  const base = scope === "search" ? searchRecords(params.q) : searchRecords("", getCategoryProducts(categorySlug));

  // Facets: each facet is counted with every *other* filter applied.
  const categoryCounts = countBy(base, filters, "category", (r) => r.categorySlug);
  const unitCounts = countBy(base, filters, "unit", (r) => r.product.unit);
  const aiCounts = countBy(base, filters, "ai", (r) => r.product.activeIngredient);
  const ratingPool = base.filter(({ record }) => passes(record, filters, "rating"));
  const pricePool = base.filter(({ record }) => passes(record, filters, "price"));
  const prices = (pricePool.length ? pricePool : base).map(({ record }) => record.product.price);

  const facets = {
    categories: CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, count: categoryCounts.get(c.slug) ?? 0 })),
    units: [...unitCounts.entries()]
      .sort((a, b) => packSizeValue(a[0]) - packSizeValue(b[0]))
      .map(([value, count]) => ({ value, count })),
    ais: [...aiCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, count })),
    ratings: [4, 3].map((value) => ({
      value,
      count: ratingPool.filter(({ record }) => (record.product.rating ?? 0) >= value).length,
    })),
    priceMin: prices.length ? Math.min(...prices) : 0,
    priceMax: prices.length ? Math.max(...prices) : 0,
  };

  const matched = base.filter(({ record }) => passes(record, filters));

  const sorters = {
    relevance: (a, b) => b.score - a.score || byRatingDesc(a.record, b.record),
    popularity: (a, b) => byRatingDesc(a.record, b.record),
    price_asc: (a, b) => a.record.product.price - b.record.product.price || a.record.order - b.record.order,
    price_desc: (a, b) => b.record.product.price - a.record.product.price || a.record.order - b.record.order,
    // Catalogue order is append-only, so later entries are the newest.
    newest: (a, b) => b.record.order - a.record.order,
  };
  // For category pages without a query, "relevance" keeps catalogue order.
  const sorter =
    params.sort === "relevance" && scope === "category"
      ? (a, b) => a.record.order - b.record.order
      : sorters[params.sort];
  matched.sort(sorter);

  const total = matched.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(params.page, pageCount);
  const items = matched
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    .map(({ record }) => toCard(record.product));

  return { items, total, page, pageCount, pageSize: PAGE_SIZE, facets, filters };
}

// Up to 8 lightweight suggestions for the header search box.
export function suggest(query, categorySlug) {
  const q = String(query ?? "").trim();
  if (q.length < 2) return [];
  const pool = categorySlug && categoryBySlug[categorySlug] ? getCategoryProducts(categorySlug) : records;
  return searchRecords(q, pool)
    .sort((a, b) => b.score - a.score || byRatingDesc(a.record, b.record))
    .slice(0, 8)
    .map(({ record: { product } }) => ({
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      category: product.category,
    }));
}

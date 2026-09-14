import productsData from "./products.json";

// 200 real Surya Enterprises agricultural products (50 per category).
export const products = productsData;

// Fast lookup by SKU (used as the stable cart key).
export const productBySku = Object.fromEntries(products.map((p) => [p.sku, p]));

export function getProduct(sku) {
  return productBySku[sku];
}

const VIEW_TO_CATEGORY = {
  Insecticide: "Insecticides",
  Insecticides: "Insecticides",
  Herbicide: "Herbicides",
  Herbicides: "Herbicides",
  Fungicide: "Fungicides",
  Fungicides: "Fungicides",
  "PGR and Others": "PGR and Others",
};

// Returns the products to display for a gallery "view" (category or "Featured").
export function productsForView(view) {
  if (view === "Featured") {
    return products.filter((p) => p.isFeatured).slice(0, 8);
  }
  const category = VIEW_TO_CATEGORY[view] || view;
  return products.filter((p) => p.category === category);
}

export const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN")}.00`;

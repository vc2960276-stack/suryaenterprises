// Builds the slim client-side product index used by the cart and checkout.
//
// The full catalogue (app/products/data/products.json, ~6 MB) stays on the
// server (see app/products/data/catalog.server.js). Client code that needs a
// synchronous getProduct(sku) — the cart page and the frozen checkout page —
// reads this slim index instead, so their bundles stay small.
//
// Runs automatically before `npm run dev` and `npm run build`.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const dataDir = new URL("../app/products/data/", import.meta.url);
const source = new URL("products.json", dataDir);
const target = new URL("products.index.json", dataDir);

const FIELDS = ["sku", "name", "slug", "price", "image", "unit", "category", "stock"];

const products = JSON.parse(await readFile(source, "utf8"));
if (!Array.isArray(products)) throw new Error("products.json must contain an array");

const index = products.map((product) => {
  const slim = {};
  for (const field of FIELDS) slim[field] = product[field];
  // productsForView("Featured") relies on this flag; only emitted when true.
  if (product.isFeatured) slim.isFeatured = true;
  return slim;
});

const json = JSON.stringify(index);
let previous = "";
try {
  previous = await readFile(target, "utf8");
} catch {
  // first run
}
if (previous !== json) await writeFile(target, json);

console.log(
  `[product-index] ${index.length} products -> ${fileURLToPath(target)} (${(json.length / 1024).toFixed(0)} KB)`
);

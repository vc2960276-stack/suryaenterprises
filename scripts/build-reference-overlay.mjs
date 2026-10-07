// DEVELOPMENT-ONLY reference overlay (never production, never committed).
//
//   npm run dev:reference      # builds the overlay, then starts `next dev`
//   node scripts/build-reference-overlay.mjs
//
// Writes app/products/data/reference-overlay.json (git-ignored) so the owner
// can see the source site's descriptions and images next to our own while
// writing ours. The file maps our SKUs to reference copy:
//
//   { generatedAt, sourceLabel, imageDir,
//     products: { [family]: { description, descriptionHtml, images, sourceUrl } },
//     skus:     { [sku]: family } }
//
// The overlay is read at request time with fs by
// app/products/data/reference-overlay.server.js ONLY when
// NODE_ENV === "development"; images are streamed from the source folder by
// app/dev-reference-image/[...file]/route.js (404 outside development).
// Nothing is copied into public/ and nothing from this file reaches
// products.json (scripts/build-product-index.mjs fails the build if it does).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalog, loadSource, SOURCE_DIR } from "./import-brand-catalog.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT = path.join(ROOT, "app/products/data/reference-overlay.json");
const IMAGE_DIR = path.join(SOURCE_DIR, "images");
const IMAGE_ROUTE = "/dev-reference-image/";
const SOURCE_LABEL = "BigHaat";

// Allow only harmless block/inline tags; every attribute is dropped.
const ALLOWED_TAGS = new Set(["p", "ul", "ol", "li", "b", "strong", "i", "em", "br", "h2", "h3"]);
const SPACED_TAGS = new Set(["div", "tr", "td", "th", "table", "h4", "h5", "h6", "section", "span"]);

export function sanitizeHtml(html) {
  return String(html ?? "")
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
      const t = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(t)) return SPACED_TAGS.has(t) ? " " : "";
      if (t === "br") return "<br>";
      return match.startsWith("</") ? `</${t}>` : `<${t}>`;
    })
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

const plainText = (text) =>
  String(text ?? "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

function main() {
  const source = loadSource();
  const { records, sources } = buildCatalog(source);
  const products = {};
  const skus = {};
  let missingImages = 0;
  for (const r of records) {
    const src = sources.get(r.sku);
    if (!src) continue;
    skus[r.sku] = r.family;
    if (products[r.family]) continue;
    const images = String(src.product.image_files ?? "")
      .split("|")
      .map((f) => f.trim().replace(/^images\//, ""))
      .filter((f) => /^[A-Za-z0-9._-]+$/.test(f))
      .filter((f) => {
        const ok = existsSync(path.join(IMAGE_DIR, f));
        if (!ok) missingImages += 1;
        return ok;
      })
      .map((f) => `${IMAGE_ROUTE}${f}`);
    products[r.family] = {
      description: plainText(src.product.description_text),
      descriptionHtml: sanitizeHtml(src.product.description_html),
      images,
      sourceUrl: String(src.product.url ?? "").trim(),
    };
  }
  const data = { generatedAt: new Date().toISOString(), sourceLabel: SOURCE_LABEL, imageDir: path.relative(ROOT, IMAGE_DIR), products, skus };
  const json = JSON.stringify(data);
  writeFileSync(OUT, json);
  console.log(
    `[reference-overlay] ${Object.keys(products).length} products / ${Object.keys(skus).length} skus -> ${OUT} (${(json.length / 1048576).toFixed(1)} MB, ${missingImages} listed images not found). Development only.`
  );
  if (!readFileSync(path.join(ROOT, ".gitignore"), "utf8").includes("reference-overlay.json")) {
    console.warn("[reference-overlay] WARNING: reference-overlay.json is not git-ignored!");
  }
}

main();

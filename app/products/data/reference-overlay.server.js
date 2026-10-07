// DEVELOPMENT-ONLY loader for the local reference overlay written by
// scripts/build-reference-overlay.mjs (git-ignored JSON next to this file).
//
// Isolation by construction:
//  - returns null unless process.env.NODE_ENV === "development" (Next inlines
//    NODE_ENV at build time, so this branch is dead code in production);
//  - the JSON is read with fs at request time, never imported, so `next build`
//    cannot bundle it;
//  - returns null when the file does not exist.
import "server-only";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

// The overlay path is folded with Array#reduce ON PURPOSE. Next's build-time
// file tracer (Turbopack's analyzer, and @vercel/nft on Vercel) statically
// evaluates path.join / string concatenation / array joins / small arrow
// functions / `env || fallback` expressions passed to fs calls, and would
// list the overlay in every route's .nft.json — packaging it into server
// functions whenever the file exists on the build machine. Neither tracer
// evaluates a reduce callback, so the value stays unknown and nothing is
// traced (verified: zero .nft.json hits after `next build`). Do not "simplify"
// this to path.join(process.cwd(), ...). SURYA_REFERENCE_OVERLAY (unset in
// practice) can point at another file.
const OVERLAY_SEGMENTS = ["app", "products", "data", "reference-overlay.json"];
const overlayPath = () =>
  process.env.SURYA_REFERENCE_OVERLAY || OVERLAY_SEGMENTS.reduce((dir, segment) => path.join(dir, segment), process.cwd());
const IMAGE_ROUTE = "/dev-reference-image/";

let cache = null; // { mtimeMs, data }

export function loadReferenceOverlay() {
  if (process.env.NODE_ENV !== "development") return null;
  const file = overlayPath();
  if (!existsSync(file)) return null;
  const { mtimeMs } = statSync(file);
  if (cache && cache.mtimeMs === mtimeMs) return cache.data;
  let data = null;
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    const files = new Set();
    for (const p of Object.values(parsed.products ?? {})) {
      for (const img of p.images ?? []) if (typeof img === "string" && img.startsWith(IMAGE_ROUTE)) files.add(img.slice(IMAGE_ROUTE.length));
    }
    data = { ...parsed, files };
  } catch (err) {
    console.warn("[reference-overlay] could not read overlay:", err?.message ?? err);
  }
  cache = { mtimeMs, data };
  return data;
}

export const hasReferenceOverlay = () => loadReferenceOverlay() != null;

// Reference copy for one of our SKUs, or null.
export function getReference(sku) {
  const overlay = loadReferenceOverlay();
  if (!overlay) return null;
  const family = overlay.skus?.[sku];
  const entry = family ? overlay.products?.[family] : null;
  if (!entry) return null;
  return {
    description: entry.description || "",
    descriptionHtml: entry.descriptionHtml || "",
    images: Array.isArray(entry.images) ? entry.images : [],
    sourceUrl: entry.sourceUrl || "",
    sourceLabel: overlay.sourceLabel || "source",
  };
}

// Absolute path of a reference image, only for files the overlay lists and
// only inside the configured image directory (path-traversal safe).
export function resolveReferenceImage(file) {
  const overlay = loadReferenceOverlay();
  if (!overlay || !overlay.imageDir || !overlay.files.has(file)) return null;
  const dir = path.resolve(/* turbopackIgnore: true */ process.cwd(), overlay.imageDir);
  const abs = path.resolve(/* turbopackIgnore: true */ dir, file);
  if (!abs.startsWith(dir + path.sep)) return null;
  return existsSync(abs) ? abs : null;
}

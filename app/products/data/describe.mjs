// Our OWN product descriptions and specification tables, generated from the
// factual fields of a record (name, brand, category, subcategory, pack size,
// crop, product type, weight, barcode). Used by scripts/import-brand-catalog.mjs.
//
// Rules: templated, factual, no marketing claims, no copied text. Templates
// vary by level-1 category: seeds mention crop & pack, machinery the product
// type, nutrition the application, crop protection the label / CIB&RC rule.

const END = "Always read the product label before use.";

const TEMPLATES = {
  Seeds: (r) =>
    [
      `${r.baseName} by ${r.brand} — ${r.subcategory} (${r.category}).`,
      `Pack size: ${r.unit}.`,
      r.crop ? `Crop: ${r.crop}${r.cropType ? ` (${r.cropType.toLowerCase()} crop)` : ""}.` : null,
      "Sow as directed on the packet; store unopened in a cool, dry place.",
      END,
    ],
  "Crop Protection": (r) =>
    [
      `${r.baseName} by ${r.brand} — ${r.subcategory} (${r.category}).`,
      `Pack size: ${r.unit}.`,
      "Use only on the crops and at the doses stated on the CIB&RC-approved label; keep away from children, food and feed.",
      END,
    ],
  "Crop Nutrition": (r) =>
    [
      `${r.baseName} by ${r.brand} — ${r.subcategory} (${r.category}).`,
      `Pack size: ${r.unit}.`,
      "Apply at the rate, timing and method printed on the label for the crop and growth stage.",
      END,
    ],
  "Farm Machinery": (r) =>
    [
      `${r.baseName} by ${r.brand} — ${r.subcategory} (${r.category}).`,
      r.productType && r.productType !== r.category ? `Product type: ${r.productType}.` : null,
      `Unit: ${r.unit}.`,
      "Operate and maintain as described in the manufacturer's instructions.",
      END,
    ],
  "Animal Husbandry": (r) =>
    [
      `${r.baseName} by ${r.brand} — ${r.subcategory} (${r.category}).`,
      `Pack size: ${r.unit}.`,
      "Use as directed on the label; consult a veterinarian for dosage where applicable.",
      END,
    ],
};

const fallback = (r) => [`${r.baseName} by ${r.brand} — ${r.subcategory} (${r.category}).`, `Pack size: ${r.unit}.`, END];

/**
 * @param {{ baseName: string, brand: string, category: string, subcategory: string, unit: string,
 *           crop?: string|null, cropType?: string|null, productType?: string|null,
 *           weight?: number|null, weightUnit?: string|null, barcode?: string|null }} r
 * @returns {string}
 */
export function describeProduct(r) {
  const parts = (TEMPLATES[r.category] ?? fallback)(r);
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

// Specification table for the PDP. Only non-empty values are kept.
export function specsFor(r) {
  const specs = {
    Brand: r.brand,
    Category: r.category,
    Subcategory: r.subcategory,
    "Pack size": r.unit,
    Crop: r.crop || null,
    "Crop type": r.cropType || null,
    "Product type": r.productType && r.productType !== r.category ? r.productType : null,
    Weight: r.weight != null ? `${r.weight} ${r.weightUnit ?? ""}`.trim() : null,
    Barcode: r.barcode || null,
  };
  return Object.fromEntries(Object.entries(specs).filter(([, v]) => v != null && v !== ""));
}

// Placeholder product imagery. The catalogue is imported from a brand/product
// master WITHOUT licensed photography, so every listing shows a flat
// illustrated placeholder for its category until the owner supplies real
// pack shots. ONE data-driven map: level-2 subcategory slug first, then the
// level-1 category slug, then a generic fallback.
//
// Files live in public/assets/placeholders (hand-drawn SVG, 320x320, white
// frame, crop green / harvest yellow / earth brown palette). Used by the
// import script (sets `image` on every record) and by the PDP to show the
// "Image coming soon" caption.

export const PLACEHOLDER_DIR = "/assets/placeholders/";

// Level-1 category slug -> file.
const BY_CATEGORY = {
  seeds: "seeds.svg",
  "crop-protection": "crop-protection.svg",
  "crop-nutrition": "crop-nutrition.svg",
  "farm-machinery": "farm-machinery.svg",
  "animal-husbandry": "animal-husbandry.svg",
};

// Level-2 subcategory slug -> file (only the common ones have their own art).
const BY_SUBCATEGORY = {
  insecticides: "insecticides.svg",
  "bio-insecticides": "insecticides.svg",
  herbicides: "herbicides.svg",
  fungicides: "fungicides.svg",
  "bio-fungicides": "fungicides.svg",
  "traps-and-lures": "traps-and-lures.svg",
  sprayers: "sprayers.svg",
  tarpaulin: "tarpaulin.svg",
  mulches: "tarpaulin.svg",
  fertilizers: "fertilizers.svg",
  "organic-fertilizers": "fertilizers.svg",
  "bio-fertilizers": "fertilizers.svg",
  biostimulants: "biostimulants.svg",
  "growth-regulators": "biostimulants.svg",
  "brush-cutter": "brush-cutter.svg",
  "tillers-cultivator": "brush-cutter.svg",
  "cattle-feed-products": "cattle-feed.svg",
};

export const GENERIC_PLACEHOLDER = `${PLACEHOLDER_DIR}generic.svg`;

export function placeholderFor(categorySlug, subcategorySlug) {
  const file = BY_SUBCATEGORY[subcategorySlug] ?? BY_CATEGORY[categorySlug];
  return file ? `${PLACEHOLDER_DIR}${file}` : GENERIC_PLACEHOLDER;
}

export const isPlaceholderImage = (src) => typeof src === "string" && src.startsWith(PLACEHOLDER_DIR);

// Every file the map can produce (the import script verifies they exist).
export const PLACEHOLDER_FILES = [...new Set([...Object.values(BY_CATEGORY), ...Object.values(BY_SUBCATEGORY), "generic.svg"])];

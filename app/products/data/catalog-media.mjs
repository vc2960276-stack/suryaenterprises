export const CATALOG_MEDIA_PREFIX = "/assets/catalog/";
const IMAGE_PATH = /^\/assets\/catalog\/[a-f0-9]{16}\.webp$/;

// The same photos are shared by every pack size of a product.
export function withCatalogMedia(product, media) {
  const images = media.products?.[product.family];
  return Array.isArray(images) && images.length
    ? { ...product, image: images[0], images }
    : product;
}

export function validateCatalogMedia(catalog, media, assetExists) {
  const problems = [];
  if (media.schemaVersion !== 1 || !media.products || typeof media.products !== "object") {
    return ["Invalid production catalog media manifest"];
  }
  const families = new Set(catalog.map((product) => product.family));
  const checked = new Set();
  for (const family of families) {
    const images = media.products[family];
    if (!Array.isArray(images) || !images.length) {
      problems.push(`No production photo for ${family}`);
      continue;
    }
    for (const image of images) {
      if (typeof image !== "string" || !IMAGE_PATH.test(image)) {
        problems.push(`Invalid production image path for ${family}`);
        continue;
      }
      if (checked.has(image)) continue;
      checked.add(image);
      if (!assetExists(image)) problems.push(`Missing production image: ${image}`);
    }
  }
  return problems;
}

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, readdir, stat, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { generateCatalogMedia } from "../scripts/build-catalog-media.mjs";
import { withCatalogMedia, validateCatalogMedia } from "../app/products/data/catalog-media.mjs";

test("production photos cover all pack sizes, decode as WebP, and survive a repeat build", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "surya-media-test-"));
  try {
    const imageDir = path.join(root, "source");
    const publicDir = path.join(root, "public");
    await mkdir(imageDir);
    const picture = await sharp({ create: { width: 1000, height: 600, channels: 3, background: "#0c8c45" } }).png().toBuffer();
    await writeFile(path.join(imageDir, "front.png"), picture);
    await writeFile(path.join(imageDir, "duplicate.png"), picture);
    await writeFile(path.join(imageDir, "broken.png"), "not an image");
    const catalog = [
      { sku: "small", family: "seed", image: "/assets/placeholders/seeds.svg" },
      { sku: "large", family: "seed", image: "/assets/placeholders/seeds.svg" },
    ];
    const sources = new Map([["small", { product: { image_files: "images/broken.png|images/front.png|images/duplicate.png" } }]]);
    const first = await generateCatalogMedia({ catalog, sources, imageDir, publicDir });
    assert.equal(first.failed.length, 1);
    assert.equal(first.media.products.seed.length, 1, "duplicate files must not become duplicate gallery slides");
    const small = withCatalogMedia(catalog[0], first.media);
    const large = withCatalogMedia(catalog[1], first.media);
    assert.equal(small.image, large.image);
    assert.equal(small.images[0], small.image);
    const file = path.join(publicDir, small.image);
    const metadata = await sharp(await readFile(file)).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, 768);
    assert.equal(metadata.height, 461);
    const originalMtime = (await stat(file)).mtimeMs;
    const second = await generateCatalogMedia({ catalog, sources, imageDir, publicDir });
    assert.deepEqual(second.media, first.media);
    assert.equal((await stat(file)).mtimeMs, originalMtime, "unchanged photos should reuse the published asset");
    assert.deepEqual(await readdir(path.dirname(file)), [path.basename(file)]);
    assert.deepEqual(validateCatalogMedia(catalog, first.media, (image) => existsSync(path.join(publicDir, image))), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("production validation rejects development URLs, traversal, missing photos and uncovered products", () => {
  const catalog = [{ family: "seed" }, { family: "pump" }];
  for (const image of ["/dev-reference-image/front.png", "https://example.com/front.png", "/assets/catalog/../../private.webp"]) {
    const errors = validateCatalogMedia(catalog, { schemaVersion: 1, products: { seed: [image] } }, () => true);
    assert.ok(errors.some((error) => error.includes("Invalid production image path")));
    assert.ok(errors.some((error) => error.includes("No production photo for pump")));
  }
  const errors = validateCatalogMedia([{ family: "seed" }], {
    schemaVersion: 1, products: { seed: ["/assets/catalog/0123456789abcdef.webp"] },
  }, () => false);
  assert.ok(errors.some((error) => error.includes("Missing production image")));
});

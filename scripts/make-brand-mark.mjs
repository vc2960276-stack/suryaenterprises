// Produces a transparent version of the square brand mark for dark surfaces.
//
//   node scripts/make-brand-mark.mjs
//
// Reads public/assets/brand/surya-mark-white.png (the mark on white; created
// from surya-mark.png on first run), flood-fills from all four edges so only
// the background CONNECTED to the border becomes transparent (highlights
// inside the sun/leaves stay opaque), feathers the edge for 2px, erodes the
// alpha by 1px to kill halos, and writes public/assets/brand/surya-mark.png.
// public/icon.png is left on white (favicons need an opaque background).
import { existsSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const DIR = new URL("../public/assets/brand/", import.meta.url);
const SRC = fileURLToPath(new URL("surya-mark-white.png", DIR));
const OUT = fileURLToPath(new URL("surya-mark.png", DIR));
const NEAR_WHITE = 236;

if (!existsSync(SRC)) copyFileSync(OUT, SRC);

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = new Uint8Array(data);
const isWhite = (i) => px[i * 4] >= NEAR_WHITE && px[i * 4 + 1] >= NEAR_WHITE && px[i * 4 + 2] >= NEAR_WHITE;

// 1. Flood fill from the four edges over near-white pixels.
const bg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x += 1) stack.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y += 1) stack.push(y * W, y * W + W - 1);
while (stack.length) {
  const i = stack.pop();
  if (bg[i] || !isWhite(i)) continue;
  bg[i] = 1;
  const x = i % W;
  const y = (i - x) / W;
  if (x > 0) stack.push(i - 1);
  if (x < W - 1) stack.push(i + 1);
  if (y > 0) stack.push(i - W);
  if (y < H - 1) stack.push(i + W);
}

// 2. Erode the opaque region by 1px (any pixel touching background goes too).
const bg2 = new Uint8Array(bg);
for (let y = 1; y < H - 1; y += 1) {
  for (let x = 1; x < W - 1; x += 1) {
    const i = y * W + x;
    if (!bg[i] && (bg[i - 1] || bg[i + 1] || bg[i - W] || bg[i + W])) bg2[i] = 1;
  }
}

// 3. Distance (in px, up to 2) from each kept pixel to the background → feathered alpha.
const dist = new Float32Array(W * H).fill(Infinity);
for (let i = 0; i < W * H; i += 1) if (bg2[i]) dist[i] = 0;
for (let pass = 0; pass < 2; pass += 1) {
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const i = y * W + x;
      if (bg2[i]) continue;
      let d = dist[i];
      if (x > 0) d = Math.min(d, dist[i - 1] + 1);
      if (x < W - 1) d = Math.min(d, dist[i + 1] + 1);
      if (y > 0) d = Math.min(d, dist[i - W] + 1);
      if (y < H - 1) d = Math.min(d, dist[i + W] + 1);
      dist[i] = d;
    }
  }
}

// 4. Apply: background → alpha 0; within 2px of it → alpha scaled by distance
//    AND by how far the pixel is from white (so pale fringe pixels fade out).
let cleared = 0;
for (let i = 0; i < W * H; i += 1) {
  const o = i * 4;
  if (bg2[i]) {
    px[o + 3] = 0;
    cleared += 1;
    continue;
  }
  const d = dist[i];
  if (d <= 2) {
    const minRgb = Math.min(px[o], px[o + 1], px[o + 2]);
    const colourWeight = Math.min(1, (255 - minRgb) / (255 - 150)); // 1 for saturated, →0 for near-white
    const edgeWeight = d / 2.5;
    px[o + 3] = Math.round(255 * Math.min(1, Math.max(edgeWeight, colourWeight * 0.9)));
  }
}

await sharp(Buffer.from(px.buffer), { raw: { width: W, height: H, channels: 4 } }).png().toFile(OUT);
console.log(`surya-mark.png: ${W}x${H}, ${cleared} background pixels made transparent (${((cleared / (W * H)) * 100).toFixed(1)}%)`);

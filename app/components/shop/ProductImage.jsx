"use client";

import Image from "next/image";
import { useState } from "react";
import { placeholderFor } from "../../config/placeholders";
import { categoryByData } from "../../config/taxonomy";

// ONE product image component for cards, galleries, cart, wishlist, checkout
// summary and search suggestions: contain-fit inside a white frame, the right
// `unoptimized` flag (vector placeholders and anything served outside
// /assets — e.g. local development images — bypass the optimizer) and a
// graceful fallback to the category placeholder when the file fails to load.
const needsRaw = (src) => typeof src === "string" && (src.endsWith(".svg") || !src.startsWith("/assets/"));

export default function ProductImage({
  src,
  alt = "",
  category,
  sizes,
  preload = false,
  frameClassName = "aspect-square w-full",
  className = "",
  style,
}) {
  const [failed, setFailed] = useState(null); // src that failed, if any
  const fallback = placeholderFor(categoryByData[category]?.slug);
  const shown = !src || failed === src ? fallback : src;
  return (
    <span className={`relative block overflow-hidden border border-line/70 bg-white ${frameClassName}`}>
      <Image
        src={shown}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        unoptimized={needsRaw(shown)}
        onError={() => setFailed(src)}
        className={`object-contain ${className}`}
        style={style}
      />
    </span>
  );
}

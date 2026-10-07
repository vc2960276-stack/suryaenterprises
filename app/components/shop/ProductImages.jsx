"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import ProductImage from "./ProductImage";

// Main image + thumbnails (when the product has `images`), hover zoom on
// desktop. Placeholder artwork renders crisply (SVG, object-contain, white
// frame) with an "Image coming soon" caption.
export default function ProductImages({ images, name, category, placeholder = false }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(null);
  const src = images[index] ?? images[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {images.length > 1 && (
          <ul className="no-scrollbar flex gap-2 overflow-x-auto sm:max-h-[480px] sm:flex-col sm:overflow-y-auto" aria-label="Product images">
            {images.map((img, i) => (
              <li key={img}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  onMouseEnter={() => setIndex(i)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                  aria-pressed={i === index}
                  className={`relative block h-16 w-16 overflow-hidden rounded-md border-2 bg-white ${i === index ? "border-brand" : "border-line hover:border-ink-3"}`}
                >
                  <ProductImage src={img} category={category} sizes="64px" frameClassName="h-full w-full" className="p-1" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div
          className={`relative aspect-square w-full flex-1 overflow-hidden rounded-lg border border-line bg-white ${placeholder ? "" : "cursor-zoom-in"}`}
          onMouseMove={(e) => {
            if (placeholder) return;
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
        >
          <ProductImage
            src={src}
            alt={placeholder ? "" : name}
            category={category}
            sizes="(min-width: 1024px) 40vw, 100vw"
            preload
            frameClassName="h-full w-full"
            className={`transition-transform duration-150 ease-out motion-reduce:transition-none ${placeholder ? "p-8" : "p-4"}`}
            style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        </div>
      </div>
      {placeholder && (
        <p className="inline-flex items-center gap-1.5 self-center rounded-full bg-canvas px-3 py-1 text-xs font-medium text-ink-2">
          <ImageOff className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Image coming soon — illustration shown
        </p>
      )}
    </div>
  );
}

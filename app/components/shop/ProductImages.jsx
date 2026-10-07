"use client";

import Image from "next/image";
import { useState } from "react";

// Main image + thumbnails (when the product has `images`), hover zoom on desktop.
export default function ProductImages({ images, name }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(null);
  const src = images[index] ?? images[0];

  return (
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
                <Image src={img} alt="" fill sizes="64px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div
        className="relative aspect-square w-full flex-1 cursor-zoom-in overflow-hidden rounded-lg border border-line bg-white"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <Image
          src={src}
          alt={name}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          preload
          className="object-contain p-4 transition-transform duration-150 ease-out motion-reduce:transition-none"
          style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
      </div>
    </div>
  );
}

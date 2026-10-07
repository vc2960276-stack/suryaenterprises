"use client";

import Link from "next/link";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { SITE } from "../../config/site";
import { ICONS } from "./icons";

// Slim offers ticker under the header. Content comes ONLY from site.js
// `offers` (enabled items). The track is rendered twice so the CSS loop is
// seamless; the second copy is aria-hidden and unfocusable. Pauses on
// hover, keyboard focus and via the pause button; prefers-reduced-motion
// turns it into a static scrollable strip (see globals.css).
function Track({ items, hidden = false }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((o, i) => {
        const Icon = o.icon ? ICONS[o.icon] : null;
        const inner = (
          <>
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-harvest" strokeWidth={1.75} aria-hidden="true" />}
            <span>{o.text}</span>
          </>
        );
        return (
          <li key={`${o.text}-${i}`} className="flex items-center whitespace-nowrap text-[12.5px] font-medium">
            {o.href ? (
              <Link href={o.href} tabIndex={hidden ? -1 : 0} className="inline-flex items-center gap-1.5 rounded px-1 py-1 hover:text-harvest hover:underline">
                {inner}
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-1 py-1">{inner}</span>
            )}
            <span aria-hidden="true" className="mx-5 block h-1.5 w-1.5 rotate-45 bg-harvest/80" />
          </li>
        );
      })}
    </ul>
  );
}

export default function OffersMarquee() {
  const items = (SITE.offers ?? []).filter((o) => o.enabled && o.text);
  const [paused, setPaused] = useState(false);
  if (!items.length) return null;
  const duration = Math.max(28, items.length * 9);

  return (
    <section
      aria-label="Highlights and offers"
      className={`marquee on-dark print-hidden relative bg-brand-deep text-white ${paused ? "marquee-paused" : ""}`}
    >
      <div className="shell relative flex items-center pr-12">
        <div className="marquee-viewport relative min-w-0 flex-1 overflow-hidden">
          <div className="marquee-track flex w-max py-1" style={{ "--marquee-duration": `${duration}s` }}>
            <Track items={items} />
            <Track items={items} hidden />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex w-24 items-center justify-end bg-gradient-to-l from-brand-deep via-brand-deep/90 to-transparent pr-2 lg:pr-3">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Play offers ticker" : "Pause offers ticker"}
          className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          {paused ? (
            <Play className="h-3 w-3" fill="currentColor" aria-hidden="true" />
          ) : (
            <Pause className="h-3 w-3" fill="currentColor" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
}

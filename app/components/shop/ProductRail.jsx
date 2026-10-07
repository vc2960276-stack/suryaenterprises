"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Horizontal scroll rail with arrow buttons. Cards are passed as children
// (rendered on the server).
export default function ProductRail({ title, eyebrow, href, hrefLabel = "View all", children, id }) {
  const scroller = useRef(null);
  const headingId = id ? `${id}-heading` : undefined;

  const scrollBy = (dir) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby={headingId} className="rounded-lg border border-line bg-white">
      <div className="flex items-end justify-between gap-3 border-b border-line px-3 py-3 sm:px-4">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={headingId} className="truncate font-display text-lg font-extrabold text-ink sm:text-xl">
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {href && (
            <Link href={href} className="btn btn-buy h-8 px-3 text-[13px]">
              {hrefLabel}
            </Link>
          )}
        </div>
      </div>
      <div className="group/rail relative">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label={`Scroll ${title} left`}
          className="absolute left-1 top-1/2 z-10 hidden h-20 w-9 -translate-y-1/2 items-center justify-center rounded-r-md border border-line bg-white/95 text-ink shadow-md transition hover:bg-white md:flex md:opacity-0 md:group-hover/rail:opacity-100 md:focus-visible:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-3 px-3 py-3 sm:gap-3 sm:px-4"
        >
          {children}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={`Scroll ${title} right`}
          className="absolute right-1 top-1/2 z-10 hidden h-20 w-9 -translate-y-1/2 items-center justify-center rounded-l-md border border-line bg-white/95 text-ink shadow-md transition hover:bg-white md:flex md:opacity-0 md:group-hover/rail:opacity-100 md:focus-visible:opacity-100"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { listingHref } from "../../lib-shop/listing-url";
import BottomSheet from "./BottomSheet";
import FilterSidebar from "./FilterSidebar";

export default function MobileListingControls({ basePath, state, facets, scope, categorySlug, subcategorySlug, sorts, total, activeCount }) {
  const [sheet, setSheet] = useState(null);
  const close = useCallback(() => setSheet(null), []);
  const sortLabel = sorts.find((s) => s.value === state.sort)?.label ?? "Relevance";

  return (
    <>
      <div className="sticky top-[var(--header-h)] z-30 -mx-3 mt-2 grid grid-cols-2 border-y border-line bg-white shadow-[0_2px_4px_rgba(20,33,26,0.06)] lg:hidden">
        <button type="button" onClick={() => setSheet("sort")} className="flex h-11 items-center justify-center gap-2 border-r border-line text-[13px] font-semibold text-ink">
          <ArrowUpDown className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="truncate">Sort: {sortLabel}</span>
        </button>
        <button type="button" onClick={() => setSheet("filter")} className="flex h-11 items-center justify-center gap-2 text-[13px] font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Filter
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] text-white">{activeCount}</span>
          )}
        </button>
      </div>

      <BottomSheet open={sheet === "sort"} onClose={close} title="Sort by">
        <ul className="py-1">
          {sorts.map((s) => {
            const active = s.value === state.sort;
            return (
              <li key={s.value}>
                <Link
                  href={listingHref(basePath, state, { sort: s.value })}
                  scroll={false}
                  onClick={close}
                  aria-current={active ? "true" : undefined}
                  className="flex items-center justify-between px-4 py-3 text-[14px] text-ink"
                >
                  {s.label}
                  <span
                    aria-hidden="true"
                    className={`h-4 w-4 rounded-full border-2 ${active ? "border-brand bg-[radial-gradient(circle,#0F7A3D_45%,transparent_50%)]" : "border-[#A9B4AD]"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </BottomSheet>

      <BottomSheet
        open={sheet === "filter"}
        onClose={close}
        title="Filters"
        footer={
          <button type="button" onClick={close} className="btn btn-buy w-full">
            Show {total.toLocaleString("en-IN")} results
          </button>
        }
      >
        <FilterSidebar
          basePath={basePath}
          state={state}
          facets={facets}
          scope={scope}
          categorySlug={categorySlug}
          subcategorySlug={subcategorySlug}
          total={total}
          inSheet
        />
      </BottomSheet>
    </>
  );
}

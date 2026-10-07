import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listingHref } from "../../lib-shop/listing-url";

function pages(current, count) {
  const set = new Set([1, count, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => set.add(p));
  if (current >= count - 2) [count - 1, count - 2, count - 3].forEach((p) => set.add(p));
  const list = [...set].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}

export default function Pagination({ basePath, state, page, pageCount }) {
  if (pageCount <= 1) return null;
  const href = (p) => listingHref(basePath, state, { page: p });
  const base = "flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-[13px] font-semibold tabular-nums";
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white px-3 py-3">
      <p className="text-xs text-ink-2">
        Page <span className="font-semibold text-ink">{page}</span> of {pageCount.toLocaleString("en-IN")}
      </p>
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          {page > 1 ? (
            <Link href={href(page - 1)} className={`${base} gap-1 text-brand hover:bg-brand-tint`} rel="prev">
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sr-only sm:hidden">Previous page</span>
            </Link>
          ) : null}
        </li>
        {pages(page, pageCount).map((p) =>
          typeof p === "string" ? (
            <li key={p} aria-hidden="true" className="px-1 text-ink-3">
              …
            </li>
          ) : (
            <li key={p} className={Math.abs(p - page) > 1 && p !== 1 && p !== pageCount ? "hidden sm:block" : ""}>
              <Link
                href={href(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                className={`${base} ${p === page ? "bg-brand text-white" : "text-ink hover:bg-brand-tint"}`}
              >
                {p}
              </Link>
            </li>
          )
        )}
        <li>
          {page < pageCount ? (
            <Link href={href(page + 1)} className={`${base} gap-1 text-brand hover:bg-brand-tint`} rel="next">
              <span className="hidden sm:inline">Next</span>
              <span className="sr-only sm:hidden">Next page</span>
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          ) : null}
        </li>
      </ul>
    </nav>
  );
}

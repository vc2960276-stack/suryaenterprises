import Link from "next/link";
import { listingHref } from "../../lib-shop/listing-url";

export default function SortBar({ basePath, state, sorts }) {
  return (
    <nav aria-label="Sort results" className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[13px]">
      <span className="mr-2 font-semibold text-ink">Sort by</span>
      {sorts.map((s) => {
        const active = state.sort === s.value;
        return (
          <Link
            key={s.value}
            href={listingHref(basePath, state, { sort: s.value })}
            scroll={false}
            aria-current={active ? "true" : undefined}
            className={`border-b-2 px-2 py-1.5 transition ${
              active ? "border-brand font-semibold text-brand" : "border-transparent text-ink-2 hover:text-ink"
            }`}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}

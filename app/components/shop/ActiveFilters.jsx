import Link from "next/link";
import { X } from "lucide-react";
import { categoryBySlug } from "../../config/taxonomy";
import { formatPrice } from "../../lib-shop/format";
import { listingHref } from "../../lib-shop/listing-url";

export default function ActiveFilters({ basePath, state, scope }) {
  const chips = [];
  if (scope === "search" && state.category && categoryBySlug[state.category]) {
    chips.push({ label: categoryBySlug[state.category].name, o: { category: "" } });
  }
  if (state.min != null || state.max != null) {
    const label =
      state.min != null && state.max != null
        ? `${formatPrice(state.min)} – ${formatPrice(state.max)}`
        : state.min != null
          ? `Over ${formatPrice(state.min)}`
          : `Under ${formatPrice(state.max)}`;
    chips.push({ label, o: { min: null, max: null } });
  }
  if (state.rating) chips.push({ label: `${state.rating}★ & above`, o: { rating: null } });
  state.units.forEach((u) => chips.push({ label: u, o: { units: state.units.filter((x) => x !== u) } }));
  state.ais.forEach((a) => chips.push({ label: a, o: { ais: state.ais.filter((x) => x !== a) } }));
  if (state.inStock) chips.push({ label: "In stock", o: { inStock: false } });
  if (!chips.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.label}>
          <Link
            href={listingHref(basePath, state, c.o)}
            scroll={false}
            className="chip border-brand/30 bg-brand-tint text-brand hover:border-brand"
            aria-label={`Remove filter ${c.label}`}
          >
            <span className="max-w-[200px] truncate">{c.label}</span>
            <X className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

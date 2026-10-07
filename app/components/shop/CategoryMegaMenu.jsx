"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { COMING_SOON } from "../../config/taxonomy";
import { ICONS } from "./icons";

const listingHref = (slug, params) => {
  const sp = new URLSearchParams(params);
  const qs = sp.toString();
  return `/c/${slug}${qs ? `?${qs}` : ""}`;
};

// Green category strip with hover/click mega menus.
export default function CategoryMegaMenu({ categories }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(null);
  const [lastPath, setLastPath] = useState(pathname);
  const closeTimer = useRef(null);
  const rootRef = useRef(null);

  // Close the menu after navigation (render-time sync, no effect needed).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      clearTimeout(closeTimer.current);
    };
  }, []);

  const hoverOpen = (slug) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(slug), 90);
  };
  const hoverClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const current = categories.find((c) => c.slug === open);

  return (
    <nav ref={rootRef} aria-label="Shop by category" className="on-dark relative hidden bg-brand lg:block" onMouseLeave={hoverClose}>
      <div className="shell flex h-10 items-stretch gap-0.5 text-[13px] font-semibold text-white">
        <Link
          href="/products"
          className={`flex items-center px-3 hover:bg-brand-hover ${pathname === "/products" ? "bg-brand-hover" : ""}`}
        >
          All categories
        </Link>
        {categories.map((c) => {
          const active = pathname === `/c/${c.slug}`;
          return (
            <div key={c.slug} className="flex" onMouseEnter={() => hoverOpen(c.slug)}>
              <Link
                href={`/c/${c.slug}`}
                className={`flex items-center pl-3 pr-1 hover:bg-brand-hover ${active || open === c.slug ? "bg-brand-hover" : ""}`}
              >
                {c.name}
              </Link>
              <button
                type="button"
                aria-expanded={open === c.slug}
                aria-controls="mega-menu-panel"
                aria-label={`${c.name} menu`}
                onClick={() => setOpen((o) => (o === c.slug ? null : c.slug))}
                className={`flex items-center pl-0.5 pr-2 hover:bg-brand-hover ${active || open === c.slug ? "bg-brand-hover" : ""}`}
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${open === c.slug ? "rotate-180" : ""}`}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
            </div>
          );
        })}
        <Link href="/products/institutional" className="flex items-center px-3 hover:bg-brand-hover" onMouseEnter={hoverClose}>
          Bulk &amp; institutional
        </Link>
        <span className="ml-auto hidden items-center gap-1 text-xs font-medium text-white/85 xl:flex" onMouseEnter={hoverClose}>
          Coming soon:
          {COMING_SOON.map((c) => (
            <span key={c.slug} className="rounded-full bg-white/12 px-2 py-0.5 text-[11px] text-white">
              {c.name}
            </span>
          ))}
        </span>
      </div>

      {current && (
        <div
          id="mega-menu-panel"
          onMouseEnter={() => clearTimeout(closeTimer.current)}
          className="fade-in absolute inset-x-0 top-full z-40 border-b border-line bg-white text-ink shadow-[0_12px_24px_rgba(20,33,26,0.12)]"
        >
          <div className="shell grid grid-cols-[220px_1fr_1fr_240px] gap-6 py-5">
            <div className="flex flex-col gap-3 border-r border-line pr-5">
              <p className="eyebrow">{current.need}</p>
              <p className="font-display text-xl font-extrabold leading-tight">{current.name}</p>
              <p className="text-[13px] leading-5 text-ink-2">{current.description}</p>
              <Link href={`/c/${current.slug}`} className="btn btn-buy mt-auto h-9 w-fit px-3 text-[13px]">
                View all {current.count.toLocaleString("en-IN")}
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-2">Popular active ingredients</p>
              <ul className="grid gap-0.5">
                {current.topIngredients.map((ai) => (
                  <li key={ai.value}>
                    <Link
                      href={listingHref(current.slug, { ai: ai.value })}
                      className="flex items-center justify-between rounded px-2 py-1.5 text-[13px] hover:bg-brand-tint hover:text-brand"
                    >
                      <span className="truncate">{ai.value}</span>
                      <span className="text-xs tabular-nums text-ink-3">{ai.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-2">Shop by pack size</p>
              <div className="flex flex-wrap gap-1.5">
                {current.packSizes.map((u) => (
                  <Link key={u.value} href={listingHref(current.slug, { unit: u.value })} className="chip hover:border-brand hover:text-brand">
                    {u.value}
                    <span className="text-ink-3">{u.count}</span>
                  </Link>
                ))}
              </div>
              <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-ink-2">Quick picks</p>
              <ul className="grid gap-0.5 text-[13px]">
                <li>
                  <Link href={listingHref(current.slug, { sort: "popularity" })} className="block rounded px-2 py-1.5 hover:bg-brand-tint hover:text-brand">
                    Top rated {current.name.toLowerCase()}
                  </Link>
                </li>
                <li>
                  <Link href={listingHref(current.slug, { max: "500" })} className="block rounded px-2 py-1.5 hover:bg-brand-tint hover:text-brand">
                    Under ₹500
                  </Link>
                </li>
                <li>
                  <Link href={listingHref(current.slug, { sort: "price_asc" })} className="block rounded px-2 py-1.5 hover:bg-brand-tint hover:text-brand">
                    Lowest price first
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg p-4" style={{ background: current.tint }}>
              {(current.illustration || current.image) && (
                <span className="relative h-36 w-36 overflow-hidden rounded-full bg-white ring-1 ring-black/5">
                  {current.illustration ? (
                    <Image src={current.illustration} alt="" fill sizes="144px" unoptimized className="object-cover" />
                  ) : (
                    <Image src={current.image} alt="" fill sizes="144px" className="object-contain p-3" />
                  )}
                </span>
              )}
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                {(() => {
                  const Icon = ICONS[current.icon];
                  return Icon ? <Icon className="h-4 w-4 text-brand" strokeWidth={1.75} aria-hidden="true" /> : null;
                })()}
                {current.count.toLocaleString("en-IN")} products
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

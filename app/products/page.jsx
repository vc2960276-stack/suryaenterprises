import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Breadcrumbs from "../components/shop/Breadcrumbs";
import ProductCard from "../components/shop/ProductCard";
import { ICONS } from "../components/shop/icons";
import { COMING_SOON } from "../config/taxonomy";
import { getCatalogStats, getCategoryShowcase, getNavCategories, getTopPicks } from "./data/catalog.server";

export const metadata = {
  title: "All categories",
  description: "Explore insecticides, herbicides, fungicides, and PGR solutions from Surya Enterprises.",
};

export default function ProductsPage() {
  const categories = getNavCategories();
  const stats = getCatalogStats();
  const picks = getTopPicks(12);

  return (
    <main className="shell space-y-3 py-3">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All categories" }]} />
      <header className="rounded-lg border border-line bg-white px-4 py-4 sm:px-5">
        <p className="eyebrow">Surya Enterprises Limited</p>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[28px]">All categories</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-2">
          Explore our crop care categories, created to help farmers protect plants, manage challenges, and support productive
          growth — <span className="font-semibold text-ink tabular-nums">{stats.total.toLocaleString("en-IN")}</span> products in all.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((c) => {
          const Icon = ICONS[c.icon];
          const showcase = getCategoryShowcase(c.slug, 4);
          return (
            <li key={c.slug}>
              <Link
                href={`/c/${c.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-[0_4px_16px_rgba(20,33,26,0.10)]"
              >
                <div className="grid grid-cols-2 gap-px bg-line">
                  {showcase.map((p) => (
                    <span key={p.sku} className="relative aspect-square bg-white">
                      <Image src={p.image} alt="" fill sizes="(min-width: 1280px) 12vw, (min-width: 640px) 25vw, 50vw" className="object-contain p-2" />
                    </span>
                  ))}
                </div>
                <div className="flex flex-1 flex-col p-4" style={{ background: `linear-gradient(180deg, ${c.tint} 0%, #fff 70%)` }}>
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
                        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    )}
                    <h2 className="font-display text-lg font-extrabold text-ink group-hover:text-brand">{c.name}</h2>
                  </div>
                  <p className="mt-2 flex-1 text-[13px] leading-5 text-ink-2">{c.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brand">
                    Shop {c.count.toLocaleString("en-IN")} products
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="soon-heading" className="rounded-lg border border-line bg-white px-4 py-3">
        <h2 id="soon-heading" className="eyebrow">Coming soon to the marketplace</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {COMING_SOON.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <li key={c.slug} className="chip text-ink-2">
                {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />}
                {c.name}
              </li>
            );
          })}
          <li>
            <Link href="/products/institutional" className="chip border-brand text-brand hover:bg-brand-tint">
              Bulk &amp; institutional range
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="picks-heading" className="rounded-lg border border-line bg-white">
        <div className="border-b border-line px-4 py-3">
          <p className="eyebrow">Top picks</p>
          <h2 id="picks-heading" className="font-display text-lg font-extrabold text-ink">Highest rated across categories</h2>
        </div>
        <ul className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {picks.map((p) => (
            <li key={p.sku}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

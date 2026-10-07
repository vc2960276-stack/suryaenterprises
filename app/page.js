import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, Building2, Factory, Phone } from "lucide-react";
import HeroCarousel from "./components/shop/HeroCarousel";
import ProductCard from "./components/shop/ProductCard";
import ProductRail from "./components/shop/ProductRail";
import RecentlyViewed from "./components/shop/RecentlyViewed";
import ShopByNeed from "./components/shop/ShopByNeed";
import TrustBar from "./components/shop/TrustBar";
import { SITE, telHref } from "./config/site";
import {
  getCatalogStats,
  getHomeRails,
  getNavCategories,
} from "./products/data/catalog.server";

export const metadata = {
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
};

function Rail({ id, title, eyebrow, href, items }) {
  if (!items.length) return null;
  return (
    <ProductRail id={id} title={title} eyebrow={eyebrow} href={href}>
      {items.map((p) => (
        <ProductCard key={p.sku} product={p} layout="rail" />
      ))}
    </ProductRail>
  );
}

export default function HomePage() {
  const categories = getNavCategories();
  const stats = getCatalogStats();
  const rails = getHomeRails();
  const fmt = (n) => n.toLocaleString("en-IN");
  const count = (slug) => categories.find((c) => c.slug === slug)?.count ?? 0;

  // Hero scenes are hand-made flat illustrations (public/assets/marketplace).
  const slides = [
    {
      id: "marketplace",
      image: "/assets/marketplace/hero-paddy-sunrise.svg",
      eyebrow: SITE.tagline,
      eyebrowShort: "Agri marketplace",
      title: "Crop protection, direct from the manufacturer",
      text: `${fmt(stats.total)} products across insecticides, herbicides, fungicides and plant growth regulators — ${fmt(stats.ingredients)} active ingredients in every pack size.`,
      textShort: `${fmt(stats.total)} products · ${fmt(stats.ingredients)} active ingredients`,
      cta: "Shop all categories",
      href: "/products",
      secondary: { label: "Insecticides", href: "/c/insecticides" },
    },
    {
      id: "protect",
      image: "/assets/marketplace/hero-cotton-sprayer.svg",
      eyebrow: `${fmt(count("insecticides"))} insecticides · ${fmt(count("fungicides"))} fungicides`,
      eyebrowShort: "Pest & disease control",
      title: "Stop pests and disease before they spread",
      text: "Find the right molecule by active ingredient, compare pack sizes and order in minutes.",
      textShort: "Shop by active ingredient and pack size.",
      cta: "Shop insecticides",
      href: "/c/insecticides",
      secondary: { label: "Fungicides", href: "/c/fungicides" },
    },
    {
      id: "bulk",
      image: "/assets/marketplace/hero-agri-warehouse.svg",
      eyebrow: "For agri-retailers & institutions",
      eyebrowShort: "Retailers & institutions",
      title: "Bulk & institutional buying",
      text: "High-purity technical grades for institutional partners, with custom packaging on request.",
      textShort: "Technical grades and custom packaging.",
      cta: "Explore institutional",
      href: "/products/institutional",
      secondary: { label: "Talk to us", href: "/contact" },
    },
  ];

  return (
    <main className="shell space-y-3 py-3">
      <h1 className="sr-only">
        {SITE.name} — {SITE.tagline}
      </h1>
      <HeroCarousel slides={slides} />
      <ShopByNeed categories={categories} />
      <TrustBar />

      <Rail id="featured" title="Featured products" eyebrow="Handpicked by Surya" items={rails.featured} />
      <Rail id="top-rated" title="Top rated" eyebrow="Rated 4.5★ and above" href="/search?rating=4&sort=popularity" items={rails.topRated} />
      <Rail id="under-500" title="Under ₹500" eyebrow="Small packs, big protection" href="/search?max=500&sort=popularity" items={rails.under500} />

      {/* Bulk & institutional banner */}
      <section
        aria-labelledby="bulk-heading"
        className="on-dark relative grid overflow-hidden rounded-lg bg-brand-deep text-white md:grid-cols-[1.2fr_1fr]"
      >
        <div className="relative z-10 p-5 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-harvest">Bulk &amp; institutional buying</p>
          <h2 id="bulk-heading" className="mt-1.5 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
            Buying for a co-operative, dealer network or institution?
          </h2>
          <p className="mt-2 max-w-lg text-[14px] text-white/85">
            Browse our institutional range of technical-grade actives with listed purity, and request a quote for volume
            supply and custom packaging.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/products/institutional" className="btn btn-cart">
              <Building2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              View institutional range
            </Link>
            <a href={telHref} className="btn border border-white/40 text-white hover:bg-white/10">
              <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              {SITE.helpline.display}
            </a>
          </div>
        </div>
        <div className="relative hidden min-h-[220px] md:block">
          <Image src="/assets/marketplace/hero-agri-warehouse.svg" alt="" fill sizes="40vw" unoptimized className="object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-deep/10 to-transparent" />
        </div>
      </section>

      {rails.perCategory.map((c) => (
        <Rail key={c.slug} id={`best-${c.slug}`} title={`Best of ${c.name}`} eyebrow="Highest rated in category" href={`/c/${c.slug}?sort=popularity`} items={c.items} />
      ))}

      {/* Why buy from Surya */}
      <section aria-labelledby="why-heading" className="rounded-lg border border-line bg-white px-3 py-4 sm:px-4">
        <p className="eyebrow">Why buy from Surya</p>
        <h2 id="why-heading" className="font-display text-lg font-extrabold text-ink sm:text-xl">
          Straight from the people who make it
        </h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {[
            {
              icon: Factory,
              title: "Manufacturer-direct",
              text: "Every product is manufactured and supplied by Surya Enterprises — no middlemen between our plant and your farm.",
            },
            {
              icon: BadgeCheck,
              title: "Genuine product, clear details",
              text: "Each listing shows the active ingredient, formulation, pack size and SKU so you know exactly what you are buying.",
            },
            {
              icon: BookOpenCheck,
              title: "Label guidance first",
              text: "Use only as directed on the approved product label. Our helpline can point you to the right product for your crop problem.",
            },
          ].map((w) => (
            <li key={w.title} className="flex gap-3 rounded-lg bg-canvas p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand ring-1 ring-line">
                <w.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[14px] font-bold text-ink">{w.title}</span>
                <span className="mt-0.5 block text-[13px] leading-5 text-ink-2">{w.text}</span>
              </span>
            </li>
          ))}
        </ul>
        <Link href="/aboutUs" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brand hover:underline">
          About Surya Enterprises <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </section>

      <RecentlyViewed />
    </main>
  );
}

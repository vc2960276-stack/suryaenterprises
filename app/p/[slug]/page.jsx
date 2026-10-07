import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, BadgeCheck, FlaskConical, Package, Tag, Barcode } from "lucide-react";
import Breadcrumbs from "../../components/shop/Breadcrumbs";
import BuyBox from "../../components/shop/BuyBox";
import PinCheck from "../../components/shop/PinCheck";
import PriceTag from "../../components/shop/PriceTag";
import ProductCard from "../../components/shop/ProductCard";
import ProductImages from "../../components/shop/ProductImages";
import ProductRail from "../../components/shop/ProductRail";
import RatingBadge from "../../components/shop/RatingBadge";
import RecentlyViewed from "../../components/shop/RecentlyViewed";
import StockBadge from "../../components/shop/StockBadge";
import TrackRecent from "../../components/shop/TrackRecent";
import { SITE } from "../../config/site";
import { categoryByData } from "../../config/taxonomy";
import {
  getAlsoViewed,
  getPackVariants,
  getProductBySlug,
  getSimilarProducts,
  toCard,
} from "../../products/data/catalog.server";

// 10k products: render on demand (no generateStaticParams) and cache the
// result for a day; catalogue changes ship with a deploy anyway.
export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const description = product.description.slice(0, 160);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/p/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: [{ url: product.image, width: 250, height: 250, alt: product.name }],
    },
  };
}

function SectionCard({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-40 rounded-lg border border-line bg-white">
      <h2 id={`${id}-title`} className="border-b border-line px-4 py-3 font-display text-lg font-extrabold text-ink">
        {title}
      </h2>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = categoryByData[product.category];
  const images = product.images?.length ? product.images : [product.image];
  const variants = getPackVariants(product);
  const similar = getSimilarProducts(product);
  const alsoViewed = getAlsoViewed(product);
  const card = toCard(product);

  const specs = [
    ["Brand", product.brand],
    ["Active ingredient", product.activeIngredient],
    ["Category", product.category],
    ["Pack size", product.unit],
    ["SKU", product.sku],
    ...Object.entries(product.specs ?? {}),
  ].filter(([, v]) => v != null && v !== "");

  const highlights = [
    { icon: FlaskConical, label: "Active ingredient", value: product.activeIngredient },
    { icon: Tag, label: "Category", value: product.category },
    { icon: Package, label: "Pack", value: product.unit },
    { icon: Barcode, label: "SKU", value: product.sku },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    image: images,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="shell pb-24 pt-3 sm:pb-3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <TrackRecent card={card} />
      <Breadcrumbs
        className="mb-2"
        items={[
          { label: "Home", href: "/" },
          ...(category ? [{ label: category.name, href: `/c/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-3 rounded-lg border border-line bg-white p-3 sm:p-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+12px)] lg:self-start">
          <ProductImages images={images} name={product.name} />
        </div>

        <div className="min-w-0">
          <Link href="/products" className="text-[13px] font-semibold text-brand hover:underline">
            Visit the {product.brand} store
          </Link>
          <h1 className="mt-1 font-display text-[22px] font-bold leading-tight text-ink sm:text-2xl">{product.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <RatingBadge rating={product.rating} reviewsCount={product.reviewsCount} size="lg" />
            <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-2">
              <BadgeCheck className="h-4 w-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
              Sold by {SITE.name}
            </span>
          </div>

          <div className="mt-4">
            <PriceTag price={product.price} mrp={product.mrp} size="lg" />
            <p className="mt-1 text-xs text-ink-2">Price for one pack of {product.unit}</p>
          </div>

          {variants.length > 1 && (
            <div className="mt-5">
              <p className="text-[13px] font-semibold text-ink">
                Pack size: <span className="font-normal text-ink-2">{product.unit}</span>
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {variants.map((v) => {
                  const active = v.slug === product.slug;
                  return (
                    <li key={v.slug}>
                      <Link
                        href={`/p/${v.slug}`}
                        aria-current={active ? "true" : undefined}
                        className={`flex min-w-20 flex-col items-center rounded-md border-2 px-3 py-1.5 text-center transition ${
                          active ? "border-brand bg-brand-tint" : "border-line hover:border-ink-3"
                        } ${v.stock > 0 ? "" : "opacity-60"}`}
                      >
                        <span className="text-[13px] font-semibold text-ink">{v.unit}</span>
                        <span className="text-xs tabular-nums text-ink-2">₹{v.price.toLocaleString("en-IN")}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-5 flex items-center gap-2">
            <StockBadge stock={product.stock} verbose />
          </div>

          <div className="mt-3">
            <BuyBox sku={product.sku} name={product.name} stock={product.stock} />
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <p className="mb-2 text-[13px] font-semibold text-ink">Delivery</p>
            <PinCheck />
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <p className="mb-2 text-[13px] font-semibold text-ink">Highlights</p>
            <dl className="grid gap-2 sm:grid-cols-2">
              {highlights.map((h) => (
                <div key={h.label} className="flex items-start gap-2.5 rounded-md bg-canvas px-3 py-2">
                  <h.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-xs text-ink-2">{h.label}</dt>
                    <dd className="truncate text-[13px] font-semibold text-ink">{h.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {product.crops?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-ink-2">Recommended crops (as per label)</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {product.crops.map((c) => (
                    <li key={c} className="chip">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <nav aria-label="Product sections" className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-4">
            {[
              ["description", "Description"],
              ["specifications", "Specifications"],
              ["safety", "Safety & usage"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="chip hover:border-brand hover:text-brand">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <SectionCard id="description" title="Description">
          <p className="max-w-prose text-[14px] leading-6 text-ink">{product.description}</p>
        </SectionCard>
        <SectionCard id="specifications" title="Specifications">
          <table className="w-full text-[13px]">
            <tbody>
              {specs.map(([k, v]) => (
                <tr key={k} className="border-b border-line last:border-0">
                  <th scope="row" className="w-2/5 py-2 pr-4 text-left font-medium text-ink-2">
                    {k}
                  </th>
                  <td className="py-2 font-medium text-ink">{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>

      <div className="mt-3">
        <SectionCard id="safety" title="Safety & usage">
          <div className="flex gap-3 rounded-md border border-harvest/60 bg-harvest-tint p-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-earth" strokeWidth={1.75} aria-hidden="true" />
            <div className="text-[13px] leading-6 text-ink">
              <p className="font-bold">Always read and follow the label.</p>
              <p>{SITE.labelDisclaimer}</p>
            </div>
          </div>
          <ul className="mt-3 grid gap-1.5 text-[13px] text-ink sm:grid-cols-2">
            <li>• Wear protective gloves, mask and clothing while mixing and spraying.</li>
            <li>• Do not eat, drink or smoke during application.</li>
            <li>• Store in the original container in a cool, dry, locked place.</li>
            <li>• Dispose of empty containers as instructed on the label.</li>
          </ul>
        </SectionCard>
      </div>

      <div className="mt-3 space-y-3">
        {similar.length > 0 && (
          <ProductRail id="similar" title="Similar products" eyebrow={`More ${product.category.toLowerCase()}`} href={category ? `/c/${category.slug}` : undefined}>
            {similar.map((p) => (
              <ProductCard key={p.sku} product={p} layout="rail" />
            ))}
          </ProductRail>
        )}
        {alsoViewed.length > 0 && (
          <ProductRail id="also-viewed" title="Customers also viewed" eyebrow="From the same category">
            {alsoViewed.map((p) => (
              <ProductCard key={p.sku} product={p} layout="rail" />
            ))}
          </ProductRail>
        )}
        <RecentlyViewed excludeSku={product.sku} />
      </div>
    </main>
  );
}

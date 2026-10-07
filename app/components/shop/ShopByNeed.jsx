import Image from "next/image";
import Link from "next/link";
import { COMING_SOON } from "../../config/taxonomy";

// "Shop by need" round tiles: live categories with illustrated scenes (insect
// pest, weed, leaf disease, plant growth) and greyed "coming soon" verticals.
function Tile({ src, muted = false, children }) {
  return (
    <span
      className={`relative block aspect-square w-full max-w-[112px] overflow-hidden rounded-full ring-1 ring-black/5 transition ${
        muted ? "" : "group-hover:ring-2 group-hover:ring-brand"
      }`}
    >
      {src && (
        <Image
          src={src}
          alt=""
          fill
          sizes="112px"
          unoptimized
          className={`object-cover transition-transform duration-300 ${muted ? "opacity-70 grayscale-[65%]" : "group-hover:scale-105"}`}
        />
      )}
      {children}
    </span>
  );
}

export default function ShopByNeed({ categories }) {
  return (
    <section aria-labelledby="need-heading" className="rounded-lg border border-line bg-white px-3 py-3 sm:px-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Shop by need</p>
          <h2 id="need-heading" className="font-display text-lg font-extrabold text-ink sm:text-xl">
            What does your crop need today?
          </h2>
        </div>
        <Link href="/products" className="hidden text-[13px] font-semibold text-brand hover:underline sm:inline">
          All categories
        </Link>
      </div>
      <ul className="no-scrollbar -mx-3 mt-3 flex gap-1 overflow-x-auto px-3 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0 lg:grid-cols-8">
        {categories.map((c) => (
          <li key={c.slug} className="w-[92px] shrink-0 sm:w-auto">
            <Link href={`/c/${c.slug}`} className="group flex flex-col items-center gap-2 rounded-lg p-1.5 text-center">
              <Tile src={c.illustration} />
              <span className="leading-tight">
                <span className="block text-[13px] font-semibold text-ink group-hover:text-brand">{c.shortName}</span>
                <span className="block text-[11px] text-ink-2">{c.need}</span>
              </span>
            </Link>
          </li>
        ))}
        {COMING_SOON.map((c) => (
          <li key={c.slug} className="w-[92px] shrink-0 sm:w-auto">
            <div className="flex flex-col items-center gap-2 p-1.5 text-center">
              <span className="relative block w-full max-w-[112px]">
                <Tile src={c.illustration} muted />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-earth ring-1 ring-line">
                  Soon
                </span>
              </span>
              <span className="leading-tight">
                <span className="block text-[13px] font-semibold text-ink-2">{c.name}</span>
                <span className="block text-[11px] text-ink-3">Coming soon</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

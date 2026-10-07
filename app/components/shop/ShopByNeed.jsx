import Image from "next/image";
import Link from "next/link";

// "Shop by need" round tiles: the five live categories with illustrated
// scenes (seed packet, insect pest, nutrient sack, farm tools, livestock).
function Tile({ src }) {
  return (
    <span className="relative block aspect-square w-full max-w-[112px] overflow-hidden rounded-full ring-1 ring-black/5 transition group-hover:ring-2 group-hover:ring-brand">
      {src && (
        <Image
          src={src}
          alt=""
          fill
          sizes="112px"
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
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
            What does your farm need today?
          </h2>
        </div>
        <Link href="/products" className="hidden text-[13px] font-semibold text-brand hover:underline sm:inline">
          All categories
        </Link>
      </div>
      <ul className="no-scrollbar -mx-3 mt-3 flex gap-1 overflow-x-auto px-3 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-3 sm:px-0">
        {categories.map((c) => (
          <li key={c.slug} className="w-[92px] shrink-0 sm:w-auto">
            <Link href={`/c/${c.slug}`} className="group flex flex-col items-center gap-2 rounded-lg p-1.5 text-center">
              <Tile src={c.illustration} />
              <span className="leading-tight">
                <span className="block text-[13px] font-semibold text-ink group-hover:text-brand">{c.shortName}</span>
                <span className="block text-[11px] text-ink-2">{c.need}</span>
                <span className="mt-0.5 block text-[11px] tabular-nums text-ink-3">{c.count.toLocaleString("en-IN")} products</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

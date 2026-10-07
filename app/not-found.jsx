import Link from "next/link";
import { SearchX } from "lucide-react";
import { CATEGORIES } from "./config/taxonomy";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="shell py-6">
      <div className="flex flex-col items-center rounded-lg border border-line bg-white px-6 py-14 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint text-brand">
          <SearchX className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <p className="eyebrow mt-4">Error 404</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">We couldn&apos;t find that page</h1>
        <p className="mt-1.5 max-w-md text-sm text-ink-2">
          The product or page may have moved. Try searching from the bar above, or pick a category below.
        </p>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/c/${c.slug}`} className="chip hover:border-brand hover:text-brand">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="btn btn-buy mt-6">
          Back to home
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items, className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-ink-2 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex min-w-0 items-center gap-1">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-brand hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={`truncate ${last ? "max-w-[60vw] text-ink" : ""}`}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3 w-3 shrink-0 text-ink-3" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

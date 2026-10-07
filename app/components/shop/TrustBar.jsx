import { SITE } from "../../config/site";
import { ICONS } from "./icons";

export default function TrustBar({ className = "" }) {
  return (
    <ul className={`grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4 ${className}`}>
      {SITE.trust.map((t) => {
        const Icon = ICONS[t.icon];
        return (
          <li key={t.title} className="flex items-center gap-3 bg-white px-3 py-3 sm:px-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
              {Icon && <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold leading-tight text-ink">{t.title}</span>
              <span className="block text-xs leading-tight text-ink-2">{t.text}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

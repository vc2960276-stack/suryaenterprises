import Link from "next/link";

export default function EmptyState({ icon: Icon, title, children, actions = [], className = "" }) {
  return (
    <div className={`flex flex-col items-center rounded-lg border border-line bg-white px-6 py-14 text-center ${className}`}>
      {Icon && (
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint text-brand">
          <Icon className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <h2 className="mt-4 font-display text-lg font-bold text-ink">{title}</h2>
      {children && <div className="mt-1.5 max-w-md text-sm text-ink-2">{children}</div>}
      {actions.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {actions.map((a, i) => (
            <Link key={a.href} href={a.href} className={i === 0 ? "btn btn-buy" : "btn btn-outline"}>
              {a.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

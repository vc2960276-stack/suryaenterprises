import { SITE } from "../../config/site";

// Illustrated medallions drawn in the footer's tone-on-tone agri style.
// Keyed by the `icon` value in site.js `trust`.
const GLYPHS = {
  // factory with a leaf growing from the chimney
  factory: (
    <>
      <path d="M5 19V10l4 3v-3l4 3v-3l4 3V19" />
      <path d="M4 19h16" />
      <path d="M17 10V6.5" />
      <path d="M17 6.5c0-2 1.5-3.5 3.5-3.5 0 2-1.5 3.5-3.5 3.5z" fill="#0F7A3D" />
      <path d="M8 16h1.5M11.5 16H13M15 16h1.5" />
    </>
  ),
  // shield with a check
  shield: (
    <>
      <path d="M12 3l7 2.5v5.2c0 4.3-3 7.8-7 9.3-4-1.5-7-5-7-9.3V5.5z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  // phone with a lock on the screen
  upi: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
      <path d="M10.5 18.5h3" />
      <rect x="9.5" y="9.5" width="5" height="4" rx="1" fill="#0F7A3D" />
      <path d="M10.5 9.5V8.3a1.5 1.5 0 0 1 3 0v1.2" />
    </>
  ),
  // headset
  phone: (
    <>
      <path d="M5 13a7 7 0 0 1 14 0" />
      <rect x="4" y="12" width="3.5" height="6" rx="1.5" />
      <rect x="16.5" y="12" width="3.5" height="6" rx="1.5" />
      <path d="M18.5 18v1.2a2 2 0 0 1-2 2H13" />
    </>
  ),
  // product label with a check (label-compliant guidance)
  label: (
    <>
      <path d="M7 3h10a1 1 0 0 1 1 1v16l-6-3-6 3V4a1 1 0 0 1 1-1z" />
      <path d="M9.5 10l1.8 1.8L14.5 8.5" />
    </>
  ),
  // delivery truck (dispatch)
  truck: (
    <>
      <path d="M3 7h10v9H3z" />
      <path d="M13 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  // institutional building (bulk)
  building: (
    <>
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M2 20h20" />
      <path d="M9 20v-5h6v5" />
      <path d="M9 11h.01M12 11h.01M15 11h.01" />
    </>
  ),
};

export function Medallion({ icon }) {
  const glyph = GLYPHS[icon] ?? GLYPHS.shield;
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full">
        <circle cx="24" cy="24" r="23" fill="#E8F5EC" />
        <circle cx="24" cy="24" r="19.5" fill="none" stroke="#BFE3CC" strokeWidth="1" strokeDasharray="2.5 3" />
        <circle cx="39" cy="11" r="3" fill="#FFC72C" />
      </svg>
      <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="none" stroke="#0F7A3D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {glyph}
      </svg>
    </span>
  );
}

export default function TrustBar({ className = "" }) {
  const items = SITE.trust ?? [];
  if (!items.length) return null;
  return (
    <section aria-label="Why shop with Surya Enterprises" className={`relative overflow-hidden rounded-lg border border-line bg-[linear-gradient(100deg,#E8F5EC_0%,#FFFFFF_48%,#FFF8E6_100%)] ${className}`}>
      <div className="field-rows absolute inset-0" aria-hidden="true" />
      <ul className="no-scrollbar relative flex snap-x snap-mandatory gap-2 overflow-x-auto p-2 sm:grid sm:grid-cols-2 sm:gap-0 sm:overflow-visible sm:p-0 lg:grid-cols-4">
        {items.map((t, i) => (
          <li
            key={t.title}
            className={`flex w-[78%] shrink-0 snap-start items-center gap-3 rounded-md bg-white/85 px-3 py-3 ring-1 ring-line sm:w-auto sm:rounded-none sm:bg-transparent sm:px-4 sm:py-4 sm:ring-0 ${
              i > 0 ? "sm:border-l sm:border-line/80" : ""
            } ${i === 2 ? "sm:border-t sm:border-line/80 lg:border-t-0" : ""} ${i === 3 ? "sm:border-t sm:border-line/80 lg:border-t-0" : ""}`}
          >
            <Medallion icon={t.icon} />
            <span className="min-w-0">
              <span className="block font-display text-[14px] font-extrabold leading-tight text-ink">{t.title}</span>
              <span className="mt-0.5 block text-xs leading-snug text-ink-2">{t.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

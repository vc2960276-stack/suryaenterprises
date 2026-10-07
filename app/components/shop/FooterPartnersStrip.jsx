import Image from "next/image";
import Link from "next/link";
import { SITE } from "../../config/site";

// White band above the footer. LEFT: the certifications the business actually
// holds (site.js `certifications`, `enabled: true` — ISO, ZED/MSME).
// RIGHT corner: the two official payment-partner logos, large, aspect preserved.
// No decorative chips here.
const LOGOS = [
  { name: "PayU", src: "/assets/payments/payu.svg", w: 303, h: 152, cls: "h-8 sm:h-[46px]" },
  { name: "Razorpay", src: "/assets/payments/razorpay.webp", w: 960, h: 204, cls: "h-[25px] sm:h-9" },
];

function Certification({ c }) {
  const body = (
    <>
      <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-line">
        <Image src={c.image} alt="" fill sizes="56px" className="object-contain p-1" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[14px] font-extrabold text-ink group-hover:text-brand">{c.name}</span>
        {c.detail && <span className="block text-xs text-ink-2">{c.detail}</span>}
      </span>
    </>
  );
  return c.href ? (
    <Link href={c.href} className="group inline-flex items-center gap-3 rounded-md">
      {body}
    </Link>
  ) : (
    <span className="inline-flex items-center gap-3">{body}</span>
  );
}

export default function FooterPartnersStrip() {
  const certs = (SITE.certifications ?? []).filter((c) => c.enabled);
  return (
    <div className="border-y border-line bg-white">
      <div className="shell flex flex-col gap-5 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:py-6">
        {certs.length > 0 && (
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3" aria-label="Certifications">
            {certs.map((c) => (
              <li key={c.id}>
                <Certification c={c} />
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col items-start gap-2 md:items-end">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Payment partners</p>
          <ul className="flex items-center gap-6 sm:gap-8" aria-label="Payment partners">
            {LOGOS.map((l) => (
              <li key={l.name} className="flex items-center">
                <Image src={l.src} alt={l.name} width={l.w} height={l.h} className={`block w-auto ${l.cls}`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

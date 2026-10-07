import Link from "next/link";
import { Check, CircleAlert, CircleCheck, Clock3, Info, Lock, Phone } from "lucide-react";
import { SITE, telHref } from "../../config/site";
import BrandLogo from "./BrandLogo";

// Slim checkout header: brand lockup, "Secure checkout" lock and the
// Cart → Details → Payment step indicator. The global site header is not
// rendered on /checkout (see Header.jsx), so the shopper stays focused.
const STEPS = [
  { key: "cart", label: "Cart", href: "/cart" },
  { key: "details", label: "Details" },
  { key: "payment", label: "Payment" },
];
const ORDER = ["cart", "details", "payment", "done"];

function Steps({ step }) {
  const current = ORDER.indexOf(step);
  return (
    <ol className="flex items-center justify-center text-[12px] font-semibold" aria-label="Checkout progress">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.key} className="flex items-center">
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] tabular-nums ${
                done
                  ? "bg-brand text-white"
                  : active
                    ? "bg-harvest text-ink ring-4 ring-harvest/25"
                    : "bg-canvas text-ink-3 ring-1 ring-line"
              }`}
            >
              {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
            </span>
            {done && s.href ? (
              <Link href={s.href} className="ml-1.5 text-ink-2 hover:text-brand hover:underline">
                {s.label}
              </Link>
            ) : (
              <span aria-current={active ? "step" : undefined} className={`ml-1.5 ${active ? "text-ink" : "text-ink-3"}`}>
                {s.label}
              </span>
            )}
            {i < STEPS.length - 1 && <span aria-hidden="true" className={`mx-2 h-px w-6 sm:mx-3 sm:w-10 ${done ? "bg-brand" : "bg-line"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

export default function CheckoutHeader({ step = "details" }) {
  return (
    <header className="print-hidden sticky top-0 z-50 bg-white shadow-[0_1px_0_#E3E7E4]">
      <div className="shell flex h-16 items-center gap-4">
        <span className="lg:hidden">
          <BrandLogo height={40} responsiveHeight="clamp(32px, 10vw, 40px)" priority />
        </span>
        <span className="hidden lg:block">
          <BrandLogo height={48} priority />
        </span>
        <div className="hidden flex-1 md:block">
          <Steps step={step} />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <a href={telHref} className="hidden items-center gap-1.5 text-[13px] text-ink-2 hover:text-brand lg:inline-flex">
            <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="tabular-nums">{SITE.helpline.display}</span>
          </a>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-tint px-2.5 py-1.5 text-[12px] font-bold text-brand-deep">
            <Lock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Secure checkout
          </span>
        </div>
      </div>
      <div className="border-t border-line px-3 py-2 md:hidden">
        <Steps step={step} />
      </div>
    </header>
  );
}

// Payment status message with a tone derived from the message text the
// checkout logic already produces (success / failed / pending / other).
const TONES = {
  success: { Icon: CircleCheck, cls: "border-brand/30 bg-brand-tint text-brand-deep" },
  danger: { Icon: CircleAlert, cls: "border-danger/30 bg-[#FDECEA] text-danger" },
  pending: { Icon: Clock3, cls: "border-[#F3D27A] bg-[#FFF8E6] text-[#6B4E00]" },
  info: { Icon: Info, cls: "border-info/30 bg-[#EAF0FD] text-info" },
};

export function PaymentStatus({ message }) {
  if (!message) return null;
  const tone = /success/i.test(message)
    ? "success"
    : /fail/i.test(message)
      ? "danger"
      : /pending|checking/i.test(message)
        ? "pending"
        : "info";
  const { Icon, cls } = TONES[tone];
  return (
    <div role="status" aria-live="polite" className={`mt-4 flex items-start gap-2.5 rounded-lg border px-4 py-3 text-left text-[13px] font-medium ${cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

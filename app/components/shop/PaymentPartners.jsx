import Image from "next/image";
import { Lock } from "lucide-react";

// Official payment-partner logos (public/assets/payments), never stretched:
// PayU (303×152 SVG, supplied dark-green variant) and Razorpay (960×204 webp).
// Rendered on a WHITE rounded panel so both dark wordmarks read correctly on
// any surface. `compact` is the inline variant used in checkout.
const LOGOS = [
  { name: "PayU", src: "/assets/payments/payu.svg", w: 303, h: 152, height: 30 },
  { name: "Razorpay", src: "/assets/payments/razorpay.webp", w: 960, h: 204, height: 24 },
];

export default function PaymentPartners({ compact = false, caption = "Secure payments powered by", className = "" }) {
  return (
    <div className={`rounded-lg bg-white ${compact ? "border border-line px-3 py-2.5" : "p-4"} ${className}`}>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-2">
        <Lock className="h-3.5 w-3.5 text-brand" strokeWidth={2} aria-hidden="true" />
        {caption}
      </p>
      <ul className={`flex flex-wrap items-center ${compact ? "mt-2 gap-x-5 gap-y-2" : "mt-3 gap-x-6 gap-y-3"}`}>
        {LOGOS.map((l) => {
          const h = compact ? Math.round(l.height * 0.85) : l.height;
          const w = Math.round((l.w / l.h) * h);
          return (
            <li key={l.name} className="flex items-center">
              <Image src={l.src} alt={l.name} width={w} height={h} style={{ height: h, width: w }} className="block" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

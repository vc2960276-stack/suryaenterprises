import { discountPercent, formatPrice } from "../../lib-shop/format";

// Price with optional MRP strike-through + % off (only when `mrp` exists).
export default function PriceTag({ price, mrp, size = "md" }) {
  const off = discountPercent(price, mrp);
  const sizes = {
    sm: "text-[15px]",
    md: "text-base",
    lg: "text-[28px] leading-none",
  };
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums">
      <span className={`font-bold text-ink ${sizes[size]}`}>{formatPrice(price)}</span>
      {off > 0 && (
        <>
          <span className={`text-ink-3 line-through ${size === "lg" ? "text-base" : "text-xs"}`}>
            <span className="sr-only">MRP </span>
            {formatPrice(mrp)}
          </span>
          <span className={`font-semibold text-brand ${size === "lg" ? "text-base" : "text-xs"}`}>{off}% off</span>
        </>
      )}
    </div>
  );
}

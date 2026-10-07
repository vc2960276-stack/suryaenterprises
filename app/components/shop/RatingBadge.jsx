import { Star } from "lucide-react";

export default function RatingBadge({ rating, reviewsCount, size = "sm" }) {
  if (rating == null) return null;
  const big = size === "lg";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-0.5 rounded-[4px] bg-rating font-semibold text-white tabular-nums ${
          big ? "px-2 py-0.5 text-sm" : "px-1.5 py-px text-xs"
        }`}
        aria-label={`Rated ${Number(rating).toFixed(1)} out of 5`}
      >
        {Number(rating).toFixed(1)}
        <Star className={big ? "h-3.5 w-3.5" : "h-3 w-3"} fill="currentColor" strokeWidth={0} aria-hidden="true" />
      </span>
      {reviewsCount ? (
        <span className={`text-ink-2 tabular-nums ${big ? "text-sm" : "text-xs"}`}>
          ({Number(reviewsCount).toLocaleString("en-IN")})
        </span>
      ) : null}
    </span>
  );
}

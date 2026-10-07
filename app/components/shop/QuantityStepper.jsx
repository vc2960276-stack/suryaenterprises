"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

const SIZES = {
  sm: { h: "h-8", w: "w-8" },
  md: { h: "h-9", w: "w-9" },
  // 44px touch targets on phones, compact from lg up.
  touch: { h: "h-11 lg:h-9", w: "w-11 lg:w-9" },
};

// Accessible − qty + control. When `removable` and value is 1, the minus
// button becomes a remove (trash) button. `itemName` puts the product in each
// button label ("Increase quantity of …") so repeated steppers are distinct.
export default function QuantityStepper({ value, min = 0, max = 99, onChange, label, itemName, size = "md", removable = false }) {
  const { h, w } = SIZES[size] ?? SIZES.md;
  const of = itemName ? ` of ${itemName}` : "";
  const groupLabel = label ?? (itemName ? `Quantity of ${itemName}` : "Quantity");
  const atMin = value <= min;
  const atMax = value >= max;
  const showTrash = removable && value <= 1;
  return (
    <div className={`inline-flex ${h} items-stretch overflow-hidden rounded-md border border-line bg-white`} role="group" aria-label={groupLabel}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={atMin && !showTrash}
        aria-label={showTrash ? `Remove ${itemName ?? "item"} from cart` : `Decrease quantity${of}`}
        className={`${w} flex items-center justify-center text-ink transition hover:bg-brand-tint disabled:cursor-not-allowed disabled:text-ink-3 disabled:hover:bg-white`}
      >
        {showTrash ? <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> : <Minus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
      </button>
      <output aria-live="polite" className="flex min-w-9 items-center justify-center border-x border-line px-2 text-sm font-semibold tabular-nums text-ink">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        aria-label={`Increase quantity${of}`}
        title={atMax ? `Only ${max} in stock` : undefined}
        className={`${w} flex items-center justify-center text-ink transition hover:bg-brand-tint disabled:cursor-not-allowed disabled:text-ink-3 disabled:hover:bg-white`}
      >
        <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}

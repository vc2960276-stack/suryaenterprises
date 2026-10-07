"use client";

import { useId, useState } from "react";
import { MapPin } from "lucide-react";
import { SITE } from "../../config/site";
import { isValidPin, savePin, usePin } from "../../lib-shop/pin";

// Delivery PIN check: stores the PIN and shows the configured coverage
// message. No delivery dates are invented.
export default function PinCheck() {
  const savedPin = usePin();
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const id = useId();
  const value = draft ?? savedPin ?? "";

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isValidPin(value)) {
            setError("Enter a valid 6-digit PIN code.");
            setChecked(false);
            return;
          }
          savePin(value);
          setDraft(null);
          setChecked(true);
        }}
        className="flex max-w-sm items-stretch overflow-hidden rounded-md border border-line focus-within:border-brand"
      >
        <label htmlFor={id} className="flex items-center gap-1.5 bg-canvas px-3 text-[13px] font-semibold text-ink">
          <MapPin className="h-4 w-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          PIN
        </label>
        <input
          id={id}
          inputMode="numeric"
          maxLength={6}
          value={value}
          onChange={(e) => {
            setDraft(e.target.value.replace(/\D/g, ""));
            setError("");
            setChecked(false);
          }}
          placeholder="Enter delivery PIN code"
          aria-invalid={Boolean(error)}
          className="h-10 min-w-0 flex-1 px-3 text-sm tabular-nums outline-none"
        />
        <button type="submit" className="px-4 text-[13px] font-bold text-brand hover:bg-brand-tint">
          Check
        </button>
      </form>
      <p className="mt-1.5 text-xs" aria-live="polite">
        {error ? (
          <span className="font-medium text-danger">{error}</span>
        ) : checked || savedPin ? (
          <span className="text-ink-2">
            {savedPin && <strong className="font-semibold text-ink">{savedPin}: </strong>}
            {SITE.delivery.coverageMessage}
          </span>
        ) : (
          <span className="text-ink-2">Check delivery availability for your area.</span>
        )}
      </p>
    </div>
  );
}

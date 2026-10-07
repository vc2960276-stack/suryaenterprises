"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { isValidPin, savePin, usePin } from "../../lib-shop/pin";
import { SITE } from "../../config/site";

// "Deliver to <PIN> ▾" with an editable popover (stored in surya-pin).
export default function PinPicker({ tone = "dark" }) {
  const pin = usePin() || SITE.defaultPin || "";
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dark = tone === "dark";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setDraft(pin);
          setError("");
          setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${dark ? "text-white hover:bg-white/10" : "text-ink hover:bg-brand-tint"}`}
      >
        <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        <span>
          Deliver to <strong className="font-semibold tabular-nums">{pin || "Select PIN"}</strong>
        </span>
        <ChevronDown className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      </button>
      {open && (
        <div
          id={id}
          role="dialog"
          aria-label="Set delivery PIN code"
          className="fade-in absolute left-0 top-full z-[60] mt-1.5 w-72 rounded-lg border border-line bg-white p-4 text-ink shadow-xl"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isValidPin(draft)) {
                setError("Enter a valid 6-digit PIN code.");
                return;
              }
              savePin(draft);
              setOpen(false);
            }}
          >
            <label htmlFor={`${id}-input`} className="text-[13px] font-semibold">
              Delivery PIN code
            </label>
            <p className="mt-0.5 text-xs text-ink-2">{SITE.delivery.coverageMessage}</p>
            <div className="mt-3 flex gap-2">
              <input
                ref={inputRef}
                id={`${id}-input`}
                inputMode="numeric"
                maxLength={6}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-err` : undefined}
                placeholder="e.g. 302013"
                className="h-9 min-w-0 flex-1 rounded-md border border-line px-3 text-sm tabular-nums outline-none focus:border-brand"
              />
              <button type="submit" className="btn btn-buy h-9 px-3 text-[13px]">
                Apply
              </button>
            </div>
            {error && (
              <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-danger">
                {error}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

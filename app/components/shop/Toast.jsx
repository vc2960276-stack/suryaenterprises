"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { TOAST_EVENT } from "../../lib-shop/toast";

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timers = new Map();
    const onToast = (e) => {
      const t = e.detail;
      setToasts((list) => [...list.slice(-2), t]);
      timers.set(
        t.id,
        setTimeout(() => setToasts((list) => list.filter((x) => x.id !== t.id)), 3200)
      );
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-in pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-md bg-ink px-4 py-3 text-sm text-white shadow-lg"
        >
          {t.tone === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-harvest" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Info className="h-5 w-5 shrink-0 text-harvest" strokeWidth={1.75} aria-hidden="true" />
          )}
          <p className="line-clamp-2 flex-1">{t.message}</p>
          {t.action && (
            <Link href={t.action.href} className="shrink-0 font-semibold text-harvest hover:underline">
              {t.action.label}
            </Link>
          )}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))}
            className="shrink-0 text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

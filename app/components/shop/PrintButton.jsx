"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ className = "" }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`print-hidden inline-flex h-8 items-center gap-1.5 rounded-md border border-white/30 px-2.5 text-xs font-semibold text-white hover:bg-white/10 ${className}`}
    >
      <Printer className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      Print / save as PDF
    </button>
  );
}

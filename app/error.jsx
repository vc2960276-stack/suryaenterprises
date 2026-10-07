"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="shell py-6">
      <div role="alert" className="flex flex-col items-center rounded-lg border border-line bg-white px-6 py-14 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDECEA] text-danger">
          <AlertTriangle className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Something went wrong</h1>
        <p className="mt-1.5 max-w-md text-sm text-ink-2">
          This page couldn&apos;t load. Your cart is saved on this device — please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => reset()} className="btn btn-buy">
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

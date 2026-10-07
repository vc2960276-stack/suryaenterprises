import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SITE } from "../../config/site";
import BrandLogo from "./BrandLogo";

// Shared frame for the sign-in / create-account pages.
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <main className="shell flex min-h-[70vh] items-start justify-center py-6 sm:items-center sm:py-10">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-line bg-white px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex justify-center">
            <BrandLogo height={44} priority />
          </div>
          <h1 className="mt-6 text-center font-display text-[22px] font-extrabold leading-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-center text-[13px] text-ink-2">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-3 text-center text-[13px] text-ink-2">{footer}</div>}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-3">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} aria-hidden="true" />
          Your details are used only for orders and support —{" "}
          <Link href="/privacy" className="underline hover:text-brand">
            privacy policy
          </Link>
          .
        </p>
        <p className="mt-1 text-center text-xs text-ink-3">Need help? {SITE.helpline.display}</p>
      </div>
    </main>
  );
}

export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="field-label flex justify-between">
        {label}
        {hint && <span className="font-normal text-ink-3">{hint}</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1 block text-xs font-medium text-danger">
          {error}
        </span>
      )}
    </label>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-md border border-danger/30 bg-[#FDECEA] px-3 py-2 text-[13px] font-medium text-danger">
      {message}
    </div>
  );
}

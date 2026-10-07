"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, MapPin, Package, User, UserCircle } from "lucide-react";
import { toast } from "../../lib-shop/toast";
import { firstName, logout, useSession } from "../../lib-account/session-client";

const ITEMS = [
  { label: "My orders", href: "/account?tab=orders", Icon: Package },
  { label: "Addresses", href: "/account?tab=addresses", Icon: MapPin },
  { label: "Profile", href: "/account?tab=profile", Icon: UserCircle },
];

// Desktop header account control: a "Sign in" link when signed out, or the
// customer's first name with a small menu (Orders / Addresses / Profile /
// Sign out) when signed in.
export default function AccountMenu() {
  const session = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!session.customer) {
    return (
      <Link href="/login" className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-semibold text-ink hover:text-brand">
        <User className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        Sign in
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-[180px] items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-semibold text-ink hover:text-brand"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-tint text-[11px] font-bold uppercase text-brand">
          {firstName(session.customer).slice(0, 1)}
        </span>
        <span className="truncate">Hi, {firstName(session.customer)}</span>
        <ChevronDown className={`h-4 w-4 text-ink-3 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" aria-label="Account" className="fade-in absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-[0_8px_24px_rgba(20,33,26,0.12)]">
          <p className="truncate border-b border-line px-3 py-2 text-xs text-ink-2">{session.customer.email}</p>
          {ITEMS.map((it) => (
            <Link key={it.href} role="menuitem" href={it.href} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[13px] text-ink hover:bg-brand-tint hover:text-brand-deep">
              <it.Icon className="h-4 w-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
              {it.label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await logout();
              toast("You have been signed out.");
              router.refresh();
            }}
            className="flex w-full items-center gap-2 border-t border-line px-3 py-2 text-left text-[13px] text-ink hover:bg-canvas hover:text-danger"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

// Compact icon link for the mobile header.
export function AccountIconLink({ className = "" }) {
  const session = useSession();
  const signedIn = Boolean(session.customer);
  return (
    <Link href={signedIn ? "/account" : "/login"} aria-label={signedIn ? "My account" : "Sign in"} className={className}>
      {signedIn ? (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-tint text-[11px] font-bold uppercase text-brand">
          {firstName(session.customer).slice(0, 1)}
        </span>
      ) : (
        <User className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      )}
    </Link>
  );
}

// Rows for the mobile drawer.
export function AccountDrawerLinks({ onClose }) {
  const session = useSession();
  const router = useRouter();
  if (!session.customer) {
    return (
      <div className="flex gap-2 px-4 py-3">
        <Link href="/login" onClick={onClose} className="btn btn-buy h-10 flex-1">
          Sign in
        </Link>
        <Link href="/register" onClick={onClose} className="btn btn-outline h-10 flex-1">
          Create account
        </Link>
      </div>
    );
  }
  return (
    <div className="py-1">
      <p className="px-4 pt-2 text-[13px] font-semibold text-ink">Hi, {firstName(session.customer)}</p>
      {ITEMS.map((it) => (
        <Link key={it.href} href={it.href} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-ink">
          <it.Icon className="h-4 w-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          {it.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={async () => {
          onClose();
          await logout();
          toast("You have been signed out.");
          router.refresh();
        }}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] text-ink"
      >
        <LogOut className="h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
        Sign out
      </button>
    </div>
  );
}

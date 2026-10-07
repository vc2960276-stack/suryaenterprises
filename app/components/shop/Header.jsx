"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, Menu, Phone, ShoppingCart, User, X, ChevronRight } from "lucide-react";
import { SITE, telHref } from "../../config/site";
import { COMING_SOON } from "../../config/taxonomy";
import { cartCount, useCart, useCartHydrated } from "../../lib-shop/cart";
import { useWishlist, useWishlistHydrated } from "../../lib-shop/wishlist";
import CategoryMegaMenu from "./CategoryMegaMenu";
import PinPicker from "./PinPicker";
import SearchBar from "./SearchBar";
import { ICONS } from "./icons";

const COMPANY_LINKS = [
  { name: "About Us", href: "/aboutUs" },
  { name: "Management", href: "/management" },
  { name: "Quality Assurance", href: "/quality-assurance" },
  { name: "Career", href: "/career" },
  { name: "Contact", href: "/contact" },
];

const itemsLabel = (n) => `${n} ${n === 1 ? "item" : "items"}`;

// Visual-only count; the number is announced once via the link's aria-label.
function CountBadge({ count }) {
  if (!count) return null;
  return (
    <span aria-hidden="true" className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-harvest px-1 text-[11px] font-bold tabular-nums text-ink ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function useCounts() {
  const cart = useCart();
  const cartReady = useCartHydrated();
  const wishlist = useWishlist();
  const wishReady = useWishlistHydrated();
  return { cart: cartReady ? cartCount(cart) : 0, wishlist: wishReady ? wishlist.length : 0 };
}

function Logo({ compact = false }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${SITE.name} home`}>
      <Image
        src={SITE.logo}
        alt=""
        width={compact ? 32 : 40}
        height={compact ? 32 : 40}
        preload
        className="rounded object-contain"
      />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-extrabold tracking-tight text-ink ${compact ? "text-[15px]" : "text-lg"}`}>
          Surya Enterprises
        </span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-earth">
          {SITE.shortLabel}
        </span>
      </span>
    </Link>
  );
}

function SignInPlaceholder() {
  return (
    <span className="group relative">
      <button
        type="button"
        aria-disabled="true"
        aria-describedby="signin-tip"
        onClick={(e) => e.preventDefault()}
        className="flex cursor-not-allowed items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-semibold text-ink-2"
      >
        <User className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        Sign in
      </button>
      <span
        id="signin-tip"
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-xs text-white opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100"
      >
        Accounts coming soon
      </span>
    </span>
  );
}

function MobileMenu({ open, onClose, categories }) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector("a,button")?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-ink/50" />
      <div ref={panelRef} className="relative flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="on-dark flex items-center justify-between bg-brand px-4 py-3 text-white">
          <span className="font-display text-base font-extrabold">Shop by category</span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="rounded p-1 hover:bg-white/10">
            <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <ul className="divide-y divide-line">
          {categories.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <li key={c.slug}>
                <Link href={`/c/${c.slug}`} onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-ink">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: c.tint }}>
                    {Icon && <Icon className="h-4 w-4 text-brand" strokeWidth={1.75} aria-hidden="true" />}
                  </span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-xs tabular-nums text-ink-2">{c.count.toLocaleString("en-IN")}</span>
                  <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/products" onClick={onClose} className="flex items-center justify-between px-4 py-3 text-[14px] font-semibold text-brand">
              All categories <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link href="/products/institutional" onClick={onClose} className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-ink">
              Bulk &amp; institutional orders <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </li>
        </ul>
        <div className="border-t-8 border-canvas px-4 py-3">
          <p className="eyebrow">Coming soon</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMING_SOON.map((c) => (
              <span key={c.slug} className="chip text-ink-2">
                {c.name}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t-8 border-canvas py-1">
          <p className="eyebrow px-4 pt-2">Company</p>
          {COMPANY_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={onClose} className="block px-4 py-2.5 text-[14px] text-ink">
              {l.name}
            </Link>
          ))}
        </div>
        <a href={telHref} className="mt-auto flex items-center gap-2 border-t border-line px-4 py-4 text-[14px] font-semibold text-brand">
          <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Helpline {SITE.helpline.display}
        </a>
      </div>
    </div>
  );
}

export default function Header({ categories }) {
  const counts = useCounts();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const scopes = categories.map((c) => ({ slug: c.slug, name: c.name }));
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const headerRef = useRef(null);

  // Publish the sticky header's real height as --header-h so sticky bars
  // (mobile Filter/Sort, sidebars) sit exactly beneath it at any breakpoint.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const root = document.documentElement;
    const publish = () => root.style.setProperty("--header-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      {/* Utility strip (scrolls away) */}
      <div className="on-dark hidden bg-brand-deep text-xs text-white lg:block">
        <div className="shell flex h-8 items-center gap-4">
          <PinPicker />
          <a href={telHref} className="inline-flex items-center gap-1.5 text-white/90 hover:text-white">
            <Phone className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            Helpline <span className="font-semibold tabular-nums">{SITE.helpline.display}</span>
            <span className="text-white/70">· {SITE.helpline.hours}</span>
          </a>
          <nav aria-label="Utility" className="ml-auto flex items-center gap-4 text-white/90">
            <Link href="/products/institutional" className="hover:text-white hover:underline">
              Bulk / institutional orders
            </Link>
            <Link href="/contact" className="hover:text-white hover:underline">
              Track order
            </Link>
            <Link href="/contact" className="hover:text-white hover:underline">
              Help
            </Link>
          </nav>
        </div>
      </div>

      <header ref={headerRef} className="sticky top-0 z-50 bg-white shadow-[0_1px_0_#E3E7E4]">
        {/* Desktop main row */}
        <div className="shell hidden h-16 items-center gap-6 lg:flex">
          <Logo />
          <div className="max-w-3xl flex-1">
            <SearchBar categories={scopes} variant="desktop" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <SignInPlaceholder />
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${itemsLabel(counts.wishlist)}`}
              className={`relative flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-semibold hover:text-brand ${pathname === "/wishlist" ? "text-brand" : "text-ink"}`}
            >
              <span className="relative mr-1.5">
                <Heart className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                <CountBadge count={counts.wishlist} />
              </span>
              Wishlist
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart, ${itemsLabel(counts.cart)}`}
              className={`relative flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-semibold hover:text-brand ${pathname === "/cart" ? "text-brand" : "text-ink"}`}
            >
              <span className="relative mr-1.5">
                <ShoppingCart className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                <CountBadge count={counts.cart} />
              </span>
              Cart
            </Link>
          </div>
        </div>

        {/* Mobile compact header */}
        <div className="lg:hidden">
          <div className="flex h-12 items-center gap-2 px-3">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="-ml-2 flex h-11 w-11 items-center justify-center rounded text-ink">
              <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <Logo compact />
            <div className="-mr-2 ml-auto flex items-center">
              <Link href="/wishlist" aria-label={`Wishlist, ${itemsLabel(counts.wishlist)}`} className="relative flex h-11 w-11 items-center justify-center rounded text-ink">
                <span className="relative">
                  <Heart className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  <CountBadge count={counts.wishlist} />
                </span>
              </Link>
              <Link href="/cart" aria-label={`Cart, ${itemsLabel(counts.cart)}`} className="relative flex h-11 w-11 items-center justify-center rounded text-ink">
                <span className="relative">
                  <ShoppingCart className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  <CountBadge count={counts.cart} />
                </span>
              </Link>
            </div>
          </div>
          <div className="px-3 pb-2">
            <SearchBar categories={scopes} variant="mobile" />
          </div>
          <div className="border-t border-line bg-brand-tint px-3 py-1 text-xs">
            <PinPicker tone="light" />
          </div>
        </div>

        <CategoryMegaMenu categories={categories} />
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} categories={categories} />
    </>
  );
}

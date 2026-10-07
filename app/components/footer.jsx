import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { SITE, mailHref, telHref } from "../config/site";
import { CATEGORIES } from "../config/taxonomy";
import NewsletterForm from "./shop/NewsletterForm";
import FooterTrust from "./shop/FooterTrust";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      ...CATEGORIES.map((c) => ({ name: c.name, href: `/c/${c.slug}` })),
      { name: "All categories", href: "/products" },
      { name: "Bulk & institutional", href: "/products/institutional" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/aboutUs" },
      { name: "Management", href: "/management" },
      { name: "Quality Assurance", href: "/quality-assurance" },
      { name: "Career", href: "/career" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Help & policies",
    links: [
      { name: "Help & support", href: "/contact" },
      { name: "Track order", href: "/contact" },
      { name: "Your cart", href: "/cart" },
      { name: "Wishlist", href: "/wishlist" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Sitemap", href: "/sitemap" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-6 pb-16 lg:pb-0">
      <FooterTrust />
      <div className="on-dark bg-[#0B2A1A] text-white/80">
        <div className="shell grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3" aria-label={`${SITE.name} home`}>
              <Image src={SITE.logo} alt="" width={44} height={44} className="rounded bg-white object-contain p-0.5" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold text-white">Surya Enterprises</span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-harvest">{SITE.shortLabel}</span>
              </span>
            </Link>
            <p className="max-w-sm text-[13px] leading-relaxed">
              Discover the Difference with SURYAENTERPRISES Limited. We&apos;re redefining agrochemical excellence with
              quality, innovation, and sustainable practices as your trusted partner in cultivating success.
            </p>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white">Newsletter</p>
              <NewsletterForm />
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">{col.title}</h2>
              <ul className="space-y-2 text-[13px]">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.name}`}>
                    <Link href={l.href} className="hover:text-harvest hover:underline">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Contact</h2>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <a href={telHref} className="inline-flex items-center gap-2 hover:text-harvest">
                  <Phone className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span className="tabular-nums">{SITE.helpline.display}</span>
                </a>
                <p className="ml-6 text-xs text-white/60">{SITE.helpline.hours}</p>
              </li>
              <li>
                <a href={mailHref} className="inline-flex items-center gap-2 break-all hover:text-harvest">
                  <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
              {SITE.offices.map((o) => (
                <li key={o.gstin} className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-white">{o.label}</span>
                    <span className="block text-xs leading-relaxed">{o.address}</span>
                    <span className="block text-xs text-white/60">GSTIN: {o.gstin}</span>
                  </span>
                </li>
              ))}
              <li className="text-xs">
                <span className="font-semibold text-white">Grievance Officer:</span>{" "}
                <a href={`mailto:${SITE.grievanceEmail}`} className="hover:text-harvest">
                  {SITE.grievanceEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="shell flex flex-col gap-3 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/60">Payments</span>
              {SITE.payments.map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5 rounded border border-white/20 bg-white/5 px-2 py-1 font-semibold text-white">
                  <Smartphone className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {p}
                </span>
              ))}
            </div>
            <p className="text-white/60">© {year} {SITE.legalName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

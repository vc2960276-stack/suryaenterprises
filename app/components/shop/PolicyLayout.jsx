import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SITE, formatPolicyDate, mailHref, telHref } from "../../config/site";
import PageHeader from "./PageHeader";
import PrintButton from "./PrintButton";

// Shared chrome for every policy page: page header with "Last updated",
// left sticky table of contents, numbered sections and a related-policies footer. Print-friendly: the TOC,
// site header/footer and buttons are hidden by the print stylesheet.
export const RELATED_DEFAULT = [
  { name: "Privacy policy", href: "/privacy" },
  { name: "Terms of use", href: "/terms" },
  { name: "Shipping policy", href: "/shipping-policy" },
  { name: "Return & refund policy", href: "/return-refund-policy" },
  { name: "Grievance redressal", href: "/grievance-redressal" },
  { name: "FAQs", href: "/faqs" },
];

export default function PolicyLayout({
  eyebrow = "Policies",
  title,
  intro = null,
  sections = [],
  related = RELATED_DEFAULT,
  lastUpdated = SITE.legal.policyLastUpdated,
  children = null,
}) {
  const updated = formatPolicyDate(lastUpdated);
  const officer = SITE.legal.grievanceOfficer;
  return (
    <main className="pb-3">
      <PageHeader eyebrow={eyebrow} title={title} subtitle={intro} crumbs={[{ label: "Policies", href: "/sitemap#policies" }, { label: title }]}>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/80">
          <span>
            Last updated <time dateTime={lastUpdated}>{updated}</time>
          </span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span>{SITE.legalName}</span>
          <PrintButton />
        </div>
      </PageHeader>

      <div className="shell grid gap-4 pt-3 lg:grid-cols-[264px_minmax(0,1fr)] lg:items-start">
        <aside className="print-hidden space-y-3 lg:sticky lg:top-[calc(var(--header-h)+12px)]">
          {sections.length > 0 && (
            <nav aria-label="On this page" className="panel p-4">
              <p className="eyebrow">On this page</p>
              <ol className="mt-2 space-y-0.5 text-[13px]">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2 rounded px-2 py-1.5 text-ink-2 hover:bg-brand-tint hover:text-brand"
                    >
                      <span className="w-5 shrink-0 tabular-nums text-ink-3">{i + 1}.</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="panel p-4 text-[13px]">
            <p className="font-display text-[14px] font-extrabold text-ink">Questions about this policy?</p>
            <ul className="mt-2 space-y-1.5 text-ink-2">
              <li>
                <a href={telHref} className="inline-flex items-center gap-2 hover:text-brand">
                  <Phone className="h-4 w-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
                  <span className="tabular-nums">{SITE.helpline.display}</span>
                </a>
                <span className="block pl-6 text-xs text-ink-3">{SITE.helpline.hours}</span>
              </li>
              <li>
                <a href={mailHref} className="inline-flex items-center gap-2 break-all hover:text-brand">
                  <Mail className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
            </ul>
            <p className="mt-3 text-xs text-ink-2">
              Complaints: <Link href="/grievance-redressal" className="font-semibold text-brand hover:underline">{officer.designation}</Link>
            </p>
          </div>
        </aside>

        <article className="policy-body min-w-0">

          {children}

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="panel mb-3 scroll-mt-[calc(var(--header-h)+12px)] p-5 sm:p-7">
              <h2 id={`${s.id}-title`} className="flex items-start gap-3 font-display text-[18px] font-extrabold leading-tight text-ink sm:text-[20px]">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-tint text-[12px] font-bold tabular-nums text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </h2>
              <div className="policy-prose mt-3">{s.content}</div>
            </section>
          ))}

          {related.length > 0 && (
            <nav aria-label="Related policies" className="print-hidden rounded-lg border border-line bg-white px-5 py-4">
              <p className="eyebrow">Related policies</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="chip hover:border-brand hover:text-brand">
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>
      </div>
    </main>
  );
}

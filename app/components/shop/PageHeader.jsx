import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";

// Consistent header band for content pages (about, policies, careers...).
// `aside` is an optional block (logo, badge) placed to the right of the text
// on sm+ screens and below it on phones.
export default function PageHeader({
  eyebrow = null,
  title = "",
  subtitle = null,
  crumbs = [],
  image = null,
  aside = null,
  children = null,
}) {
  return (
    <div className="shell pt-3">
      <Breadcrumbs className="mb-2" items={[{ label: "Home", href: "/" }, ...crumbs]} />
      <header className="on-dark relative overflow-hidden rounded-lg bg-brand-deep text-white">
        {image && (
          <>
            <Image src={image} alt="" fill sizes="(min-width: 1440px) 1408px, 100vw" className="object-cover" preload />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-deep/90 to-brand-deep/40" />
          </>
        )}
        <div className="relative flex flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-9">
          <div className="min-w-0">
            {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-harvest">{eyebrow}</p>}
            <h1 className="mt-1 font-display text-[26px] font-extrabold leading-tight sm:text-[34px]">{title}</h1>
            {subtitle && <p className="mt-2 max-w-2xl text-[14px] text-white/85 sm:text-base">{subtitle}</p>}
            {children}
          </div>
          {aside && <div className="shrink-0 self-start sm:self-center">{aside}</div>}
        </div>
      </header>
    </div>
  );
}

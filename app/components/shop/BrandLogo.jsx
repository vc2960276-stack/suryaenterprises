import Image from "next/image";
import Link from "next/link";
import { SITE } from "../../config/site";

// The one brand logo used everywhere (header, drawer, footer, checkout,
// login, 404…). No text lockup: the owner-supplied artwork is the brand.
//
//   variant "wide"   → /assets/brand/surya-logo-wide.png (whitespace-trimmed,
//                      1630×340) for headers where height is the constraint.
//   variant "source" → /assets/brand/surya-logo.png (untouched 1672×941 source).
//   variant "mark"   → /assets/brand/surya-mark.png (square sun+leaves mark)
//                      for the footer tile and app icon.
//   height / width  → rendered size in px (aspect ratio preserved).
//   responsiveHeight → optional CSS height (e.g. clamp()) for the wide logo.
//   tile            → white rounded tile with padding (for dark surfaces).
const VARIANTS = {
  wide: { src: "/assets/brand/surya-logo-wide.png", ratio: 1630 / 340 },
  source: { src: "/assets/brand/surya-logo.png", ratio: 1672 / 941 },
  // Square brand mark (sun + leaves + field) cropped from the source; also the favicon.
  mark: { src: "/assets/brand/surya-mark.png", ratio: 1 },
};

export default function BrandLogo({
  variant = "wide",
  height,
  width,
  responsiveHeight,
  href = "/",
  tile = false,
  priority = false,
  className = "",
  onClick,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.wide;
  const h = height ?? Math.round((width ?? 200) / v.ratio);
  const w = width ?? Math.round(h * v.ratio);
  const img = (
    <Image
      src={v.src}
      alt={`${SITE.name} — ${SITE.logoTagline}`}
      width={w}
      height={h}
      preload={priority}
      sizes={`${w}px`}
      className={variant === "mark" ? "block" : "block bg-white"}
      style={responsiveHeight ? { height: responsiveHeight, width: "auto" } : { height: h, width: w }}
    />
  );
  const body = tile ? <span className="inline-flex rounded-lg bg-white p-2">{img}</span> : img;
  const base = `inline-flex shrink-0 items-center rounded-md ${className}`;
  if (!href) return <span className={base}>{body}</span>;
  return (
    <Link href={href} onClick={onClick} className={base} aria-label={`${SITE.name} home`}>
      {body}
    </Link>
  );
}

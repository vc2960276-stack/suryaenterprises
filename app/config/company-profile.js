// ---------------------------------------------------------------------------
// Surya Enterprises — company profile content.
//
// ONE source for everything the About page (app/aboutUs/page.jsx) and the
// downloadable company profile PDF (scripts/build-company-profile.mjs) say
// about the business. Edit here and both update on the next build.
//
// Facts only. Figures the business has not supplied (revenue, farmer counts,
// licence numbers) are deliberately absent — see the `null` / empty slots
// below and `SITE.licences` in site.js. Contact, office, GSTIN, certification
// and grievance-officer details are read from site.js so they are never
// duplicated.
// ---------------------------------------------------------------------------
// Explicit ".js" so Node can import this module directly from scripts/.
import { SITE } from "./site.js";

const FOUNDED = 2023;

export const COMPANY_PROFILE = {
  founded: FOUNDED,
  // Date the figures below were supplied by the owner (shown as "Figures as of …").
  figuresAsOf: "2026-10-07",

  name: "Surya Enterprises",
  displayName: "SURYA ENTERPRISES",
  legalName: SITE.legalName,
  tagline: "India's agriculture marketplace",
  positioning: "India's agriculture marketplace, built from inside the supply chain.",
  website: { display: "www.suryaenter.in", url: "https://www.suryaenter.in" },

  // The generated PDF (public/downloads). `pages` is asserted by the build script.
  pdf: {
    href: "/downloads/surya-enterprises-company-profile.pdf",
    title: "Company Profile",
    pages: 5,
    format: "A4",
  },
  confidentiality: "Confidential — for investor and partner reference",
  disclaimerTemplate: "Figures as of {date}; this profile is informational and not an offer of securities.",

  // Cover fact chips (PDF) and hero chips (About page).
  coverChips: [`Founded ${FOUNDED}`, "Licensed agro-inputs marketplace", "ISO & ZED certified"],

  // Online catalogue facts as supplied. The build script compares these with
  // app/products/data/products.json and warns if they drift.
  catalogue: {
    skus: 10472,
    activeIngredients: 651,
    priceMin: 100,
    priceMax: 10000,
    onlineCategories: ["insecticides", "herbicides", "fungicides", "PGR & others"],
  },

  // Share of sales by customer type (percent).
  salesMix: { b2c: 70, b2b: 30 },

  // Unknown figures — intentionally null so nothing is invented. Fill when the
  // business supplies audited numbers and extend the page/PDF to render them.
  revenue: null,
  farmersServed: null,

  // ---- About page: "Where we started" ------------------------------------
  origin: {
    eyebrow: "Where we started",
    title: "Three years inside the supply chain",
    paragraphs: [
      `Surya Enterprises began in ${FOUNDED} as a backend support channel for the agriculture-products supply chain — the operations layer that keeps inputs moving from manufacturers to the distributors, wholesalers and retailers who sell to farmers.`,
      "Working inside that chain, the founders watched the same pattern repeat at every hand-off: each layer added its margin, stock went missing exactly when crops needed it, and the farmer at the end paid the most while knowing the least about what was in the pack.",
      "So the company was incorporated as SURYA ENTERPRISES and built the Surya Marketplace — a licensed, manufacturer-direct channel that sells to farmers and institutions without the layers in between.",
    ],
    milestones: [
      { when: String(FOUNDED), title: "Backend support channel", text: "Operations support for the agri-inputs supply chain." },
      { when: "Inside the chain", title: "The problem, first-hand", text: "Layered margins, stock-outs and counterfeit packs seen at every hand-off." },
      { when: "Today", title: "SURYA ENTERPRISES", text: "Incorporated; the Surya Marketplace sells direct to farmers and institutions." },
    ],
  },

  // ---- About page: "The problem we saw" ------------------------------------
  problem: {
    eyebrow: "The problem we saw",
    title: "The farmer pays the most and knows the least",
    intro:
      "A ₹500–₹1,000 pack of crop protection passes through several hands before it reaches a field in a district like Sikar. Each hand takes a margin; none of them owes the farmer an explanation.",
    // The conventional route of a pack from factory to field.
    chain: ["Manufacturer", "Distributor", "Wholesaler", "Retailer", "Commission agent", "Farmer"],
    cards: [
      {
        icon: "layers",
        title: "Layered margins",
        text: "Distributor, wholesaler, retailer and commission agent each add a margin on the way to the field. Small and marginal farmers — buying one pack at a time — end up paying the highest price for it.",
      },
      {
        icon: "calendar",
        title: "Stock-outs at sowing and spraying time",
        text: "Inputs are needed in short windows: sowing, and the days when a pest or disease first shows. When the local shop is out of stock in that window, the crop pays for it.",
      },
      {
        icon: "alert",
        title: "Counterfeit and adulterated inputs",
        text: "With no transparent origin, a farmer cannot tell a genuine pack from a counterfeit or adulterated one — until the spray does not work.",
      },
      {
        icon: "eyeoff",
        title: "No guidance, no price transparency",
        text: "The farmer paying the most gets the least: no technical guidance on what to use, and no way to see what the product should actually cost.",
      },
    ],
  },

  // ---- About page: "Our answer" ---------------------------------------------
  answer: {
    eyebrow: "Our answer",
    title: "The Surya Marketplace",
    intro:
      "A licensed marketplace that delivers agro-inputs directly to farmers. It removes the middlemen and the commissions they add, so the farmer's money goes into the product.",
    quote: "The farmer's money goes into the product — and the farmer relies on us.",
    chain: ["Surya Enterprises", "Farmer"],
    points: [
      {
        icon: "truck",
        title: "Direct to the farmer",
        text: "Orders on the website or at our store go from Surya Enterprises to the farmer. No distributor, wholesaler or commission agent in between.",
      },
      {
        icon: "label",
        title: "Licensed to sell agro-inputs",
        text: "Surya Enterprises is licensed to sell agro-inputs in India, and every listing shows the active ingredient, formulation and pack size.",
      },
      {
        icon: "factory",
        title: "Manufacturer-direct",
        text: "Products are manufactured and supplied by Surya Enterprises — ISO certified and ZED (Zero Defect Zero Effect) certified.",
      },
      {
        icon: "sprout",
        title: "What changes for a farmer",
        text: `A listed price before buying, stock shown before ordering, sealed manufacturer packs, and a helpline (${SITE.helpline.hours}) for product questions.`,
      },
    ],
  },

  // ---- PDF page 2: business overview + model --------------------------------
  overviewBullets: [
    "Licensed agro-inputs marketplace selling directly to farmers and institutions across India through the website, a store in Jaipur and an institutional desk.",
    "Manufacturer-direct: products are manufactured and supplied by Surya Enterprises; ISO certified and ZED (Zero Defect Zero Effect) certified.",
    "Online catalogue of 10,472 SKUs across insecticides, herbicides, fungicides and PGR & others, covering 651 active ingredients.",
    "Pack prices from INR 100 to INR 10,000; every listing shows the active ingredient, formulation and pack size.",
    "Seeds, agro equipment, tarpaulins (tirpal) and crop nutrients supplied through the store and institutional desk; coming online in phases.",
    `Founded ${FOUNDED} as a backend support channel for the agri-inputs supply chain; incorporated as SURYA ENTERPRISES and launched the Surya Marketplace.`,
    "GST-registered in Rajasthan (registered office, Jaipur) and Delhi (corporate office).",
  ],
  businessModel: [
    {
      title: "Manufacturer-direct supply",
      text: "Surya Enterprises manufactures and supplies the products it sells. No distributor, wholesaler or commission layer sits between the company and the buyer.",
    },
    {
      title: "D2C — farmers (70% of sales)",
      text: "Website orders paid by UPI and dispatched to serviceable PIN codes across India, plus in-person sales at the Jaipur store.",
    },
    {
      title: "B2B — institutions (30% of sales)",
      text: "Quotation-based supply to agricultural universities and institutes, bulk enterprises, dealers and co-operatives through the institutional desk.",
    },
  ],

  // ---- Product portfolio ------------------------------------------------------
  // `online: true` lines are live on the website (categorySlug → /c/<slug>).
  // Example product names are verified against products.json by the build script.
  productLines: [
    {
      name: "Insecticides",
      icon: "bug",
      online: true,
      categorySlug: "insecticides",
      examples: ["Imidacloprid 17.8% SL", "Chlorpyriphos 50% EC", "Acephate 20% SP", "Abamectin 1.9% EC"],
    },
    {
      name: "Herbicides",
      icon: "weed",
      online: true,
      categorySlug: "herbicides",
      examples: ["Glyphosate 41% SL", "2,4-D Amine Salt 58% SL", "Pendimethalin 30% EC"],
    },
    {
      name: "Fungicides",
      icon: "leaf",
      online: true,
      categorySlug: "fungicides",
      examples: ["Mancozeb 75% WP", "Azoxystrobin 23% SC", "Tebuconazole 25.9% EC", "Carbendazim 50% WP"],
    },
    {
      name: "PGR & others",
      detail: "Plant growth regulators and bio-stimulants",
      icon: "growth",
      online: true,
      categorySlug: "pgr-and-others",
      examples: ["Amino Acid 1% SL", "Humic Acid Liquid", "Seaweed Extract Concentrate", "Gibberellic Acid 0.001% L"],
    },
    { name: "Seeds", icon: "wheat", online: false, examples: [] },
    { name: "Agro equipment", icon: "tools", online: false, examples: [] },
    { name: "Tarpaulins (tirpal)", icon: "tarp", online: false, examples: [] },
    { name: "Crop nutrients & crop-production inputs", icon: "sack", online: false, examples: [] },
  ],
  availability: {
    online: "Online now",
    offline: "Store & institutional desk",
    offlineNote: "Available through our store and institutional desk; coming online in phases.",
  },

  // ---- Sales channels -----------------------------------------------------------
  channels: [
    {
      key: "website",
      icon: "globe",
      title: "Website",
      detail: "www.suryaenter.in",
      text: "Browse by category, active ingredient and pack size. Pay by UPI via PayU; dispatch to serviceable PIN codes across India.",
      href: "/products",
      cta: "Shop online",
    },
    {
      key: "store",
      icon: "store",
      title: "Offline store",
      detail: "Rajdhani Krishi Mandi, Jaipur",
      // Full address comes from SITE.offices[0] (registered office).
      text: "Buy in person at our registered office in Jaipur's agricultural mandi.",
      href: "/contact",
      cta: "Contact & directions",
    },
    {
      key: "institutional",
      icon: "building",
      title: "Institutional desk",
      detail: "Quotations · GST invoice",
      text: "Bulk supply and technical grades with listed purity for universities, institutes, bulk enterprises, dealers and co-operatives.",
      href: "/products/institutional",
      cta: "Request a quotation",
    },
  ],

  // ---- Customer segments ----------------------------------------------------------
  segments: [
    {
      key: "b2c",
      share: 70,
      label: "B2C",
      title: "Farmers",
      text: "Farmers buying for their own fields — on the website or at the store.",
      who: ["Small and marginal farmers", "Individual growers"],
    },
    {
      key: "b2b",
      share: 30,
      label: "B2B",
      title: "Institutions & bulk buyers",
      text: "Served through the institutional desk with quotations and GST invoices.",
      who: ["Agricultural universities and institutes", "Bulk enterprises", "Dealers and co-operatives"],
    },
  ],

  paymentPartners: ["PayU", "Razorpay"],
  // Agro-input sales licences — rendered only when SITE.licences is filled.
  licences: SITE.licences ?? [],
};

// Price range as text. `currency` is "₹" on the web; the PDF uses "INR "
// because pdfkit's built-in Helvetica (WinAnsi) has no rupee glyph.
export function priceRange(currency = "₹", p = COMPANY_PROFILE) {
  const fmt = (n) => n.toLocaleString("en-IN");
  return `${currency}${fmt(p.catalogue.priceMin)} – ${currency}${fmt(p.catalogue.priceMax)}`;
}

// Key numbers table — ONLY facts the business has supplied.
export function keyNumbers({ currency = "₹" } = {}, p = COMPANY_PROFILE) {
  const fmt = (n) => n.toLocaleString("en-IN");
  return [
    { label: "Founded", value: String(p.founded) },
    { label: "Online SKUs", value: fmt(p.catalogue.skus) },
    { label: "Active ingredients", value: fmt(p.catalogue.activeIngredients) },
    { label: "Price range per pack", value: priceRange(currency, p) },
    { label: "Sales mix", value: `${p.salesMix.b2c}% B2C (farmers) / ${p.salesMix.b2b}% B2B` },
    { label: "GST registrations", value: `${SITE.offices.length} (${SITE.offices.map((o) => o.label.replace(" Registration", "")).join(", ")})` },
    { label: "Certifications", value: SITE.certifications.filter((c) => c.enabled).map((c) => c.name.replace(" certified", "")).join(", ") + " (MSME)" },
    { label: "Sales channels", value: `${p.channels.length} — website, Jaipur store, institutional desk` },
  ];
}

// "7 October 2026" from an ISO date (or a Date).
export function formatProfileDate(d = COMPANY_PROFILE.figuresAsOf) {
  const date = d instanceof Date ? d : new Date(`${d}T00:00:00`);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export const profileDisclaimer = (p = COMPANY_PROFILE) =>
  p.disclaimerTemplate.replace("{date}", formatProfileDate(p.figuresAsOf));

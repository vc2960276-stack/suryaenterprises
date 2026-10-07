// ---------------------------------------------------------------------------
// Surya Enterprises — company / business profile content.
//
// ONE source for everything the About page (app/aboutUs/page.jsx) and the
// downloadable Business Profile PDF (scripts/build-company-profile.mjs) say
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
const fmt = (n) => n.toLocaleString("en-IN");

export const COMPANY_PROFILE = {
  founded: FOUNDED,

  name: "Surya Enterprises",
  tradeName: "Surya Enterprises",
  displayName: "SURYA ENTERPRISES",
  legalName: SITE.legalName,
  tagline: "India's agriculture marketplace",
  positioning: "India's agriculture marketplace, built from inside the supply chain.",
  website: { display: "www.suryaenter.in", url: "https://www.suryaenter.in" },

  // One-line nature of business (identity block of the PDF).
  natureOfBusiness:
    "Licensed agro-inputs marketplace; manufacturer and direct seller of crop-protection products",

  // The generated PDF (public/downloads). `pages` is asserted by the build script.
  pdf: {
    href: "/downloads/surya-enterprises-company-profile.pdf",
    title: "Business Profile",
    subtitle: "Nature of business declaration",
    pages: 3,
    format: "A4",
    caption: "nature of business, products, channels, customers",
    linkLabel: "Business profile (PDF)",
    buttonLabel: "Download business profile (PDF)",
  },

  // Hero chips on the About page.
  coverChips: [`Founded ${FOUNDED}`, "Licensed agro-inputs marketplace", "ISO & ZED certified"],

  // Online catalogue facts as supplied. The build script compares these with
  // app/products/data/products.json and warns if they drift.
  catalogue: {
    skus: 10472,
    activeIngredients: 651,
    priceMin: 100,
    priceMax: 10000,
    onlineCategories: ["insecticides", "herbicides", "fungicides", "PGR & crop nutrients"],
  },

  // Share of sales by customer type (percent).
  salesMix: { b2c: 70, b2b: 30 },

  // Unknown figures — intentionally null so nothing is invented. Fill when the
  // business supplies audited numbers and extend the page/PDF to render them.
  revenue: null,
  farmersServed: null,

  // ---- PDF section 1: nature of business ------------------------------------
  nature: {
    paragraph:
      `${SITE.legalName}, trading as Surya Enterprises, is a licensed agro-inputs marketplace based at Rajdhani Krishi Mandi, Jaipur, with a corporate office in New Delhi. It manufactures and supplies crop-protection products (insecticides, herbicides, fungicides and plant growth regulators) and sells them directly to farmers and institutional buyers — through its website, its Jaipur store and an institutional desk — with no distributors or commission agents in between. Founded in ${FOUNDED} as a backend support channel for the agri-inputs supply chain, the company was incorporated to build the Surya Marketplace.`,
    bullets: [
      "Manufacturer-direct: products are manufactured and supplied by Surya Enterprises (ISO and ZED certified).",
      "Sells directly to farmers (B2C, 70% of sales) and to universities and institutes, bulk enterprises, dealers and co-operatives (B2B, 30%).",
      // {priceRange} is filled by the build script with ₹ (brand fonts embedded) or "INR".
      `Online catalogue of ${fmt(10472)} SKUs across 651 active ingredients, priced {priceRange} per pack.`,
      "Seeds, agro equipment, tarpaulins (tirpal) and crop-production inputs are sold in-store and by quotation.",
    ],
  },

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
      name: "PGR & crop nutrients",
      detail: "Plant growth regulators, bio-stimulants and nutrients",
      icon: "growth",
      online: true,
      categorySlug: "pgr-and-others",
      examples: ["Amino Acid 1% SL", "Humic Acid Liquid", "Seaweed Extract Concentrate", "Gibberellic Acid 0.001% L"],
    },
    { name: "Seeds", icon: "wheat", online: false, examples: [] },
    { name: "Agro equipment", icon: "tools", online: false, examples: [] },
    { name: "Tarpaulins (tirpal)", icon: "tarp", online: false, examples: [] },
    { name: "Crop-production inputs", icon: "sack", online: false, examples: [] },
  ],
  availability: {
    online: { badge: "Online now", channels: "Website + store" },
    offline: {
      badge: "Store & institutional desk",
      channels: "Store & institutional desk",
      note: "Available through our store and institutional desk; coming online in phases.",
    },
  },

  // ---- Sales channels -----------------------------------------------------------
  // `how` / `payment` feed the PDF channel table; the rest feeds the About cards.
  channels: [
    {
      key: "website",
      icon: "globe",
      title: "Website",
      detail: "www.suryaenter.in",
      text: "Browse by category, active ingredient and pack size. Pay by UPI via PayU; dispatch to serviceable PIN codes across India.",
      how: "Online orders at www.suryaenter.in (browse by category, active ingredient and pack size); dispatched to serviceable PIN codes across India.",
      payment: SITE.payments.join(", "),
      href: "/products",
      cta: "Shop online",
    },
    {
      key: "store",
      icon: "store",
      title: "In-store",
      detail: "Rajdhani Krishi Mandi, Jaipur",
      text: "Buy in person at our registered office in Jaipur's agricultural mandi.",
      how: `Walk-in purchases at the registered office: ${SITE.offices[0].address} (${SITE.helpline.hours}).`,
      payment: "At the store counter",
      href: "/contact",
      cta: "Contact & directions",
    },
    {
      key: "institutional",
      icon: "building",
      title: "Institutional desk",
      detail: "Quotations · GST invoice",
      text: "Bulk supply and technical grades with listed purity for universities, institutes, bulk enterprises, dealers and co-operatives.",
      how: `Quotations by phone (${SITE.helpline.display}) or email (${SITE.email}); GST invoice issued for every supply.`,
      payment: `Bank transfer / UPI. ${SITE.policies.bulk.creditTerms}`,
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
      text: "Farmers buying for their own fields, per pack — on the website or in-store.",
      who: ["Small and marginal farmers", "Individual growers"],
    },
    {
      key: "b2b",
      share: 30,
      label: "B2B",
      title: "Institutions & bulk buyers",
      text: "Buying by quotation through the institutional desk, with GST invoices.",
      who: ["Agricultural universities and institutes", "Bulk enterprises", "Dealers and co-operatives"],
    },
  ],

  paymentPartners: ["PayU", "Razorpay"],
  // Agro-input sales licences — rendered only when SITE.licences is filled.
  licences: SITE.licences ?? [],
  licencesFallback: "Licence details available on request.",

  // ---- PDF section 6: declaration ---------------------------------------------------
  declaration: {
    statement: "We confirm that the information above is true and describes the current nature of our business.",
    signatureFields: ["Name", "Designation", "Date", "Signature / Stamp"],
  },
};

// Price range as text. `currency` is "₹" on the web; the PDF uses "INR "
// because pdfkit's built-in Helvetica (WinAnsi) has no rupee glyph.
export function priceRange(currency = "₹", p = COMPANY_PROFILE) {
  return `${currency}${fmt(p.catalogue.priceMin)} – ${currency}${fmt(p.catalogue.priceMax)}`;
}

// Social-selling statement for the PDF, driven by SITE.social: as long as no
// profile URL is configured the business declares no social / third-party
// marketplace sales; once profiles are set the sentence names them.
export function socialStatement() {
  const names = { facebook: "Facebook", instagram: "Instagram", youtube: "YouTube", linkedin: "LinkedIn", x: "X (Twitter)" };
  const active = Object.entries(SITE.social ?? {})
    .filter(([, url]) => Boolean(url))
    .map(([key]) => names[key] ?? key);
  if (active.length === 0) return "No sales through social media or third-party marketplaces at present.";
  return `Social media presence: ${active.join(", ")} (brand communication only). Sales are made through the channels above; no sales through third-party marketplaces.`;
}

// "7 October 2026" from an ISO date (or a Date).
export function formatProfileDate(d) {
  const date = d instanceof Date ? d : new Date(`${d}T00:00:00`);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

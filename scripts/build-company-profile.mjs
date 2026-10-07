// Builds the branded, investor-facing company profile PDF.
//
//   public/downloads/surya-enterprises-company-profile.pdf   (A4, 5 pages)
//
// Every word comes from app/config/company-profile.js and app/config/site.js
// (legal name, GSTINs, offices, helpline, grievance officer, certifications),
// so the owner edits once and the About page and PDF stay in step. Catalogue
// figures are cross-checked against app/products/data/products.json.
//
// Runs automatically before `npm run dev` and `npm run build` (see package.json).
// Fonts: pdfkit's built-in Helvetica. It uses WinAnsi encoding, which has no
// rupee glyph — currency in the PDF is written "INR".
import PDFDocument from "pdfkit";
import { createWriteStream } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  COMPANY_PROFILE as P,
  formatProfileDate,
  keyNumbers,
  priceRange,
  profileDisclaimer,
} from "../app/config/company-profile.js";
import { SITE } from "../app/config/site.js";

const root = new URL("../", import.meta.url);
const LOGO = fileURLToPath(new URL("public/assets/brand/surya-logo-wide.png", root));
const OUT_DIR = new URL("public/downloads/", root);
const OUT = fileURLToPath(new URL(`public${P.pdf.href}`, root));
const PRODUCTS = new URL("app/products/data/products.json", root);

// ---------------------------------------------------------------------------
// Brand tokens (mirror app/globals.css) and page geometry (points).
// ---------------------------------------------------------------------------
const C = {
  green: "#0F7A3D",
  deep: "#0A4F28",
  yellow: "#FFC72C",
  ink: "#14211A",
  ink2: "#4A5A50",
  ink3: "#6B7A70",
  line: "#E3E7E4",
  tint: "#E8F5EC",
  cream: "#FFF6D9",
  zebra: "#F6F8F7",
  white: "#FFFFFF",
};
const PAGE = { w: 595.28, h: 841.89, mx: 48, top: 92, bottom: 74 };
const W = PAGE.w - PAGE.mx * 2; // content width
const RIGHT = PAGE.w - PAGE.mx;
const LOGO_RATIO = 1630 / 340;
const F = { reg: "Helvetica", bold: "Helvetica-Bold", obl: "Helvetica-Oblique" };

// ---------------------------------------------------------------------------
// Cross-check the stated catalogue facts against the live catalogue.
// ---------------------------------------------------------------------------
const products = JSON.parse(await readFile(PRODUCTS, "utf8"));
const prices = products.map((p) => p.price);
const live = {
  skus: products.length,
  activeIngredients: new Set(products.map((p) => p.activeIngredient)).size,
  priceMin: Math.min(...prices),
  priceMax: Math.max(...prices),
};
for (const key of Object.keys(live)) {
  if (live[key] !== P.catalogue[key]) {
    console.warn(`[company-profile] WARNING: catalogue.${key} is ${P.catalogue[key]} in company-profile.js but ${live[key]} in products.json`);
  }
}
const prefixes = new Set(products.map((p) => p.name.split(" - ")[0].trim().toLowerCase()));
for (const line of P.productLines) {
  for (const example of line.examples) {
    if (!prefixes.has(example.toLowerCase())) {
      console.warn(`[company-profile] WARNING: example product "${example}" (${line.name}) is not in products.json`);
    }
  }
}

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------
const generatedAt = new Date();
const generated = formatProfileDate(generatedAt);
const numbers = keyNumbers({ currency: "INR " });
const certs = (SITE.certifications ?? []).filter((c) => c.enabled);
const officer = SITE.legal.grievanceOfficer;

const doc = new PDFDocument({
  size: "A4",
  margins: { top: PAGE.top, bottom: PAGE.bottom, left: PAGE.mx, right: PAGE.mx },
  bufferPages: true,
  info: {
    Title: `${P.displayName} — ${P.pdf.title}`,
    Author: P.legalName,
    Subject: `${P.positioning} ${P.confidentiality}.`,
    Keywords: "Surya Enterprises, agriculture marketplace, agro-inputs, crop protection, company profile",
    Creator: "scripts/build-company-profile.mjs (pdfkit)",
    CreationDate: generatedAt,
  },
});

await mkdir(OUT_DIR, { recursive: true });
const stream = createWriteStream(OUT);
doc.pipe(stream);

// ---- primitives ------------------------------------------------------------
// PROFILE_DEBUG=1 prints where each page's content ends (must stay < 768pt).
const mark = (label) =>
  process.env.PROFILE_DEBUG && console.log(`[company-profile] ${label}: y=${Math.round(doc.y)} pages=${doc.bufferedPageRange().count}`);
const font = (name, size, color = C.ink) => doc.font(name).fontSize(size).fillColor(color);
const rule = (x1, y, x2, color = C.line, width = 0.5) => doc.moveTo(x1, y).lineTo(x2, y).lineWidth(width).stroke(color);

function textRight(str, right, y, { name = F.reg, size = 8, color = C.ink3, characterSpacing = 0 } = {}) {
  font(name, size, color);
  const w = doc.widthOfString(str, { characterSpacing });
  doc.text(str, right - w, y, { lineBreak: false, characterSpacing });
}

function pageHeader(section) {
  doc.image(LOGO, PAGE.mx, 26, { width: 118 });
  textRight(`${P.pdf.title} · ${section}`.toUpperCase(), RIGHT, 36, { size: 7.5, characterSpacing: 0.8 });
  rule(PAGE.mx, 62, RIGHT, C.green, 1.2);
}

// Section title with a harvest-yellow bar. Returns the y to continue from.
function h2(title, y) {
  doc.rect(PAGE.mx, y, 4, 18).fill(C.yellow);
  font(F.bold, 16).text(title, PAGE.mx + 12, y + 1, { width: W - 12, lineBreak: false });
  return y + 32;
}

function para(str, x, y, w, { size = 9.5, color = C.ink2, lineGap = 2.2, name = F.reg, align = "left" } = {}) {
  font(name, size, color).text(str, x, y, { width: w, lineGap, align });
  return doc.y;
}

function bullets(items, x, y, w, { size = 9.5, gap = 6 } = {}) {
  let cy = y;
  for (const item of items) {
    doc.circle(x + 3, cy + size * 0.55, 2).fill(C.green);
    font(F.reg, size, C.ink).text(item, x + 14, cy, { width: w - 14, lineGap: 2 });
    cy = doc.y + gap;
  }
  return cy;
}

function chip(label, x, y, { fill = C.tint, color = C.green, size = 9 } = {}) {
  font(F.bold, size, color);
  const w = doc.widthOfString(label) + 22;
  const h = 22;
  doc.roundedRect(x, y, w, h, h / 2).fill(fill);
  font(F.bold, size, color).text(label, x + 11, y + (h - size) / 2 - 1, { lineBreak: false });
  return w;
}

// Simple ruled table with a green header row and zebra rows. Cells wrap.
function table({ x, y, columns, rows, fontSize = 9 }) {
  const pad = 7;
  const totalW = columns.reduce((s, c) => s + c.width, 0);
  const headH = 22;
  doc.rect(x, y, totalW, headH).fill(C.green);
  let cx = x;
  for (const col of columns) {
    font(F.bold, 7.5, C.white).text(col.label.toUpperCase(), cx + pad, y + 8, {
      width: col.width - pad * 2,
      lineBreak: false,
      characterSpacing: 0.6,
    });
    cx += col.width;
  }
  let cy = y + headH;
  rows.forEach((row, i) => {
    let rh = 0;
    columns.forEach((col, j) => {
      font(col.bold ? F.bold : F.reg, fontSize);
      rh = Math.max(rh, doc.heightOfString(String(row[j] ?? ""), { width: col.width - pad * 2, lineGap: 1.5 }));
    });
    rh += pad * 2;
    if (i % 2 === 1) doc.rect(x, cy, totalW, rh).fill(C.zebra);
    cx = x;
    columns.forEach((col, j) => {
      const value = row[j];
      if (typeof col.render === "function") {
        col.render(value, cx + pad, cy + pad, col.width - pad * 2, row);
      } else {
        font(col.bold ? F.bold : F.reg, fontSize, col.color ?? C.ink).text(String(value ?? ""), cx + pad, cy + pad, {
          width: col.width - pad * 2,
          lineGap: 1.5,
        });
      }
      cx += col.width;
    });
    rule(x, cy + rh, x + totalW);
    cy += rh;
  });
  return cy;
}

// Label / value stack used for the company-details grid.
function field(label, lines, x, y, w) {
  font(F.bold, 7.5, C.green).text(label.toUpperCase(), x, y, { width: w, characterSpacing: 0.6, lineBreak: false });
  let cy = y + 12;
  for (const line of lines.filter(Boolean)) {
    const bold = typeof line === "object" && line.bold;
    const str = typeof line === "object" ? line.text : line;
    font(bold ? F.bold : F.reg, 9.5, bold ? C.ink : C.ink2).text(str, x, cy, { width: w, lineGap: 1.5 });
    cy = doc.y + 2;
  }
  return cy;
}

// ===========================================================================
// Page 1 — Cover
// ===========================================================================
doc.rect(0, 0, PAGE.w, 8).fill(C.yellow);
doc.image(LOGO, PAGE.mx, 70, { width: 300 });

font(F.bold, 8.5, C.green).text(P.confidentiality.toUpperCase(), PAGE.mx, 176, { characterSpacing: 1, lineBreak: false });
font(F.bold, 40, C.ink).text(P.pdf.title, PAGE.mx, 194, { lineBreak: false });
font(F.reg, 15, C.ink2).text(`${P.displayName} — ${P.tagline}`, PAGE.mx, 246, { width: W, lineBreak: false });

let cx = PAGE.mx;
for (const label of P.coverChips) cx += chip(label, cx, 280) + 8;

// Positioning block
const BLOCK_Y = 350;
const BLOCK_H = 262;
doc.roundedRect(PAGE.mx, BLOCK_Y, W, BLOCK_H, 8).fill(C.deep);
doc.rect(PAGE.mx, BLOCK_Y + 28, 5, BLOCK_H - 56).fill(C.yellow);
font(F.bold, 21, C.white).text("Built from inside the supply chain.", PAGE.mx + 28, BLOCK_Y + 32, { width: W - 56, lineGap: 2 });
para(P.answer.intro, PAGE.mx + 28, doc.y + 10, W - 56, { size: 11, color: "#D5E4DA", lineGap: 3 });
// Three figures across the bottom of the block
const figY = BLOCK_Y + BLOCK_H - 74;
const figures = [
  { value: P.catalogue.skus.toLocaleString("en-IN"), label: "SKUs online" },
  { value: P.catalogue.activeIngredients.toLocaleString("en-IN"), label: "Active ingredients" },
  { value: `${P.salesMix.b2c} / ${P.salesMix.b2b}`, label: "B2C / B2B sales mix" },
];
const figW = (W - 56) / 3;
figures.forEach((f, i) => {
  const fx = PAGE.mx + 28 + figW * i;
  if (i > 0) doc.moveTo(fx - 14, figY + 4).lineTo(fx - 14, figY + 44).lineWidth(0.5).stroke("#2E6B47");
  font(F.bold, 22, C.yellow).text(f.value, fx, figY, { lineBreak: false });
  font(F.reg, 8.5, "#D5E4DA").text(f.label.toUpperCase(), fx, figY + 30, { characterSpacing: 0.8, lineBreak: false });
});

// Meta row under the block
const metaY = BLOCK_Y + BLOCK_H + 28;
field("Prepared by", [{ text: P.legalName, bold: true }, `${SITE.offices[0].kind}: Jaipur, Rajasthan`], PAGE.mx, metaY, W / 3 - 10);
field("Date", [{ text: generated, bold: true }, `Figures as of ${formatProfileDate(P.figuresAsOf)}`], PAGE.mx + W / 3, metaY, W / 3 - 10);
field("Website", [{ text: P.website.display, bold: true }, `Helpline ${SITE.helpline.display}`], PAGE.mx + (2 * W) / 3, metaY, W / 3);

mark("page 1 end");

// ===========================================================================
// Page 2 — Business overview, model, key numbers
// ===========================================================================
doc.addPage();
pageHeader("Business overview");
let y = h2("Business overview", 84);
y = para(
  `${P.displayName} is a licensed agro-inputs marketplace that sells directly to farmers and institutions across India, built by a team that spent three years inside the agri-inputs supply chain.`,
  PAGE.mx,
  y,
  W,
  { size: 10, color: C.ink }
);
y = bullets(P.overviewBullets, PAGE.mx, y + 10, W, { size: 9, gap: 5 });
mark("page 2 after bullets");

y = h2("Business model", y + 10);
const colGap = 10;
const colW = (W - colGap * 2) / 3;
let modelBottom = y;
P.businessModel.forEach((m, i) => {
  const mx = PAGE.mx + (colW + colGap) * i;
  font(F.bold, 9.5);
  const titleH = doc.heightOfString(m.title, { width: colW - 24 });
  font(F.reg, 9);
  const textH = doc.heightOfString(m.text, { width: colW - 24, lineGap: 1.8 });
  const boxH = 16 + titleH + 6 + textH + 14;
  doc.roundedRect(mx, y, colW, boxH, 6).fill(C.tint);
  doc.rect(mx, y + 10, 3, boxH - 20).fill(C.green);
  font(F.bold, 9.5, C.green).text(m.title, mx + 12, y + 14, { width: colW - 24 });
  font(F.reg, 9, C.ink).text(m.text, mx + 12, doc.y + 4, { width: colW - 24, lineGap: 1.8 });
  modelBottom = Math.max(modelBottom, y + boxH);
});
y = modelBottom;

y = h2("Key numbers", y + 16);
font(F.reg, 8.5, C.ink3).text("Only figures supplied by the business are shown. Revenue and customer counts are not published in this profile.", PAGE.mx, y - 6, { width: W, lineBreak: false });
// Two metric/value pairs per row keeps the table compact.
const pairRows = [];
for (let i = 0; i < numbers.length; i += 2) {
  const a = numbers[i];
  const b = numbers[i + 1];
  pairRows.push([a.label, a.value, b?.label ?? "", b?.value ?? ""]);
}
const metricW = 104;
const valueW = W / 2 - metricW;
y = table({
  x: PAGE.mx,
  y: y + 8,
  columns: [
    { label: "Metric", width: metricW, bold: true },
    { label: "Value", width: valueW },
    { label: "Metric", width: metricW, bold: true },
    { label: "Value", width: valueW },
  ],
  rows: pairRows,
  fontSize: 9.5,
});
mark("page 2 end");

// ===========================================================================
// Page 3 — Product portfolio
// ===========================================================================
doc.addPage();
pageHeader("Product portfolio");
y = h2("Product portfolio", 84);
y = para(
  `${P.catalogue.skus.toLocaleString("en-IN")} products are online today across ${P.catalogue.onlineCategories.join(", ")} — ${P.catalogue.activeIngredients} active ingredients, ${priceRange("INR ")} per pack. ${P.availability.offlineNote.replace("Available", "Seeds, agro equipment, tarpaulins and crop nutrients are available")}`,
  PAGE.mx,
  y,
  W,
  { size: 10, color: C.ink }
);

const availabilityCell = (value, x, cy, w, row) => {
  const online = row[3] === true;
  const label = online ? P.availability.online.toUpperCase() : P.availability.offline.toUpperCase();
  font(F.bold, 7, online ? C.green : "#7A4E2D");
  const lw = Math.min(doc.widthOfString(label, { characterSpacing: 0.4 }) + 14, w);
  doc.roundedRect(x, cy - 1, lw, 15, 7.5).fill(online ? C.tint : C.cream);
  font(F.bold, 7, online ? C.green : "#7A4E2D").text(label, x + 7, cy + 3, { lineBreak: false, characterSpacing: 0.4 });
};

y = table({
  x: PAGE.mx,
  y: y + 14,
  columns: [
    { label: "Product line", width: 132, bold: true },
    { label: "Example products", width: 232 },
    { label: "Availability", width: W - 132 - 232, render: availabilityCell },
  ],
  rows: P.productLines.map((l) => [
    l.detail ? `${l.name}\n${l.detail}` : l.name,
    l.examples.length ? l.examples.join("  ·  ") : P.availability.offlineNote,
    "",
    l.online,
  ]),
  fontSize: 9,
});

font(F.reg, 8.5, C.ink3).text(
  "Example products are live listings on www.suryaenter.in; each listing shows the active ingredient, formulation, pack size and SKU. Pesticides are sold in sealed, labelled manufacturer packaging for use as directed on the CIB&RC-approved label.",
  PAGE.mx,
  y + 12,
  { width: W, lineGap: 1.5 }
);

// Catalogue at a glance
const glanceY = doc.y + 22;
const glance = [
  { value: P.catalogue.skus.toLocaleString("en-IN"), label: "SKUs online" },
  { value: String(P.catalogue.activeIngredients), label: "Active ingredients" },
  { value: `INR ${P.catalogue.priceMin.toLocaleString("en-IN")} – ${P.catalogue.priceMax.toLocaleString("en-IN")}`, label: "Price per pack" },
  { value: String(P.productLines.filter((l) => l.online).length), label: "Lines online of " + P.productLines.length },
];
const gW = W / glance.length;
doc.roundedRect(PAGE.mx, glanceY, W, 64, 6).fill(C.cream);
glance.forEach((g, i) => {
  const gx = PAGE.mx + gW * i;
  if (i > 0) doc.moveTo(gx, glanceY + 14).lineTo(gx, glanceY + 50).lineWidth(0.5).stroke("#EAD9A3");
  // Shrink long values (the price range) so every figure stays on one line.
  let size = 15;
  font(F.bold, size, C.ink);
  while (size > 10 && doc.widthOfString(g.value) > gW - 28) font(F.bold, (size -= 0.5), C.ink);
  doc.text(g.value, gx + 14, glanceY + 16 + (15 - size) / 2, { width: gW - 20, lineBreak: false });
  font(F.reg, 7.5, C.ink2).text(g.label.toUpperCase(), gx + 14, glanceY + 40, { width: gW - 20, characterSpacing: 0.6, lineBreak: false });
});

mark("page 3 end");

// ===========================================================================
// Page 4 — Sales channels and customer segments
// ===========================================================================
doc.addPage();
pageHeader("Sales channels & customers");
y = h2("Sales channels", 84);
let chBottom = y;
P.channels.forEach((ch, i) => {
  const chx = PAGE.mx + (colW + colGap) * i;
  const detail = ch.key === "store" ? SITE.offices[0].address : ch.detail;
  font(F.reg, 8.5);
  const detailH = doc.heightOfString(detail, { width: colW - 24, lineGap: 1.5 });
  font(F.reg, 9);
  const textH = doc.heightOfString(ch.text, { width: colW - 24, lineGap: 1.8 });
  const boxH = 14 + 12 + 8 + detailH + 8 + textH + 14;
  doc.roundedRect(chx, y, colW, boxH, 6).lineWidth(0.8).stroke(C.line);
  doc.rect(chx, y, colW, 4).fill(i === 1 ? C.yellow : C.green);
  font(F.bold, 11, C.ink).text(ch.title, chx + 12, y + 14, { width: colW - 24, lineBreak: false });
  font(F.reg, 8.5, C.green).text(detail, chx + 12, y + 30, { width: colW - 24, lineGap: 1.5 });
  font(F.reg, 9, C.ink2).text(ch.text, chx + 12, doc.y + 8, { width: colW - 24, lineGap: 1.8 });
  chBottom = Math.max(chBottom, y + boxH);
});
y = chBottom;
y = para(
  `Payments on the website are collected by UPI through PayU. Institutional orders are quoted individually; ${SITE.policies.bulk.creditTerms.charAt(0).toLowerCase()}${SITE.policies.bulk.creditTerms.slice(1)}`,
  PAGE.mx,
  y + 12,
  W,
  { size: 8.5, color: C.ink3 }
);

y = h2("Customer segments", y + 24);
y = para(
  `Sales are ${P.salesMix.b2c}% business-to-consumer (farmers) and ${P.salesMix.b2b}% business-to-business (agricultural universities and institutes, bulk enterprises, dealers and co-operatives).`,
  PAGE.mx,
  y,
  W,
  { size: 10, color: C.ink }
);

// Horizontal 70/30 bar drawn with rectangles
const barY = y + 16;
const barH = 34;
const [b2c, b2b] = P.segments;
const b2cW = (W * b2c.share) / 100;
doc.roundedRect(PAGE.mx, barY, W, barH, 5).fill(C.yellow); // base = B2B colour
doc.rect(PAGE.mx + 5, barY, b2cW - 5, barH).fill(C.green); // B2C overlay
doc.roundedRect(PAGE.mx, barY, 10, barH, 5).fill(C.green); // rounded left cap
font(F.bold, 12, C.white).text(`${b2c.share}%  ${b2c.label} — ${b2c.title}`, PAGE.mx + 14, barY + 11, { lineBreak: false });
font(F.bold, 12, C.ink).text(`${b2b.share}%  ${b2b.label}`, PAGE.mx + b2cW + 12, barY + 11, { lineBreak: false });
// Tick labels
font(F.reg, 7.5, C.ink3).text("0%", PAGE.mx, barY + barH + 6, { lineBreak: false });
textRight("100%", RIGHT, barY + barH + 6, { size: 7.5 });
font(F.reg, 7.5, C.ink3).text(`${b2c.share}%`, PAGE.mx + b2cW - 8, barY + barH + 6, { lineBreak: false });

// Legend with descriptions
const legendY = barY + barH + 28;
const legendW = (W - 24) / 2;
P.segments.forEach((s, i) => {
  const lx = PAGE.mx + (legendW + 24) * i;
  doc.roundedRect(lx, legendY + 2, 12, 12, 3).fill(i === 0 ? C.green : C.yellow);
  font(F.bold, 10.5, C.ink).text(`${s.label} — ${s.title}`, lx + 20, legendY, { width: legendW - 20, lineBreak: false });
  font(F.reg, 9, C.ink2).text(s.text, lx + 20, legendY + 16, { width: legendW - 20, lineGap: 1.8 });
  bullets(s.who, lx + 20, doc.y + 8, legendW - 20, { size: 9, gap: 4 });
});

mark("page 4 end");

// ===========================================================================
// Page 5 — Compliance & company details
// ===========================================================================
doc.addPage();
pageHeader("Compliance & company details");
y = h2("Company details", 84);

const half = (W - 20) / 2;
const leftX = PAGE.mx;
const rightX = PAGE.mx + half + 20;

let ly = field("Legal name", [{ text: P.legalName, bold: true }, `Trading as ${P.name} · ${P.website.display}`], leftX, y, half);
ly = field("Founded", [{ text: String(P.founded), bold: true }, "Backend support channel for the agri-inputs supply chain; incorporated and launched the Surya Marketplace."], leftX, ly + 8, half);
for (const office of SITE.offices) {
  ly = field(`${office.kind} — ${office.label.replace(" Registration", "")}`, [office.address, { text: `GSTIN ${office.gstin}`, bold: true }], leftX, ly + 8, half);
}

let ry = y;
if (P.licences.length > 0) {
  ry = field(
    "Agro-input sales licences",
    P.licences.map((l) => [l.authority, l.number && `No. ${l.number}`, l.scope, l.validTill && `valid till ${formatProfileDate(l.validTill)}`].filter(Boolean).join(" · ")),
    rightX,
    ry,
    half
  );
  ry += 8;
}
ry = field(
  "Certifications",
  certs.map((c) => ({ text: `${c.name}${c.detail ? ` — ${c.detail}` : ""}`, bold: false })),
  rightX,
  ry,
  half
);
ry = field(
  "Grievance officer",
  [
    { text: officer.name, bold: true },
    [officer.designation, officer.credentials].filter(Boolean).join(" · "),
    `${officer.email} · ${officer.phone.display}`,
    `Acknowledged within ${SITE.policies.grievance.acknowledgementHours} hours; resolved within ${SITE.policies.grievance.resolutionDays} days.`,
  ],
  rightX,
  ry + 8,
  half
);
ry = field(
  "Contacts",
  [
    { text: `Helpline ${SITE.helpline.display}`, bold: true },
    SITE.helpline.hours,
    SITE.email,
    P.website.url,
  ],
  rightX,
  ry + 8,
  half
);
ry = field("Payment partners", [P.paymentPartners.join(", ")], rightX, ry + 8, half);

y = Math.max(ly, ry) + 18;
rule(PAGE.mx, y, RIGHT);

// Licence note when none are filled yet — never invent a number.
if (P.licences.length === 0) {
  y = para(
    "Surya Enterprises is licensed to sell agro-inputs in India. Licence numbers are available on request and will be printed here once published by the company.",
    PAGE.mx,
    y + 14,
    W,
    { size: 8.5, color: C.ink3, name: F.obl }
  );
}

// Disclaimer box
const discY = y + 18;
font(F.reg, 9);
const discH = doc.heightOfString(profileDisclaimer(), { width: W - 40, lineGap: 2 }) + 28;
doc.roundedRect(PAGE.mx, discY, W, discH, 6).fill(C.cream);
doc.rect(PAGE.mx, discY + 8, 4, discH - 16).fill(C.yellow);
font(F.bold, 7.5, "#7A4E2D").text("DISCLAIMER", PAGE.mx + 20, discY + 10, { characterSpacing: 0.8, lineBreak: false });
font(F.reg, 9, C.ink).text(profileDisclaimer(), PAGE.mx + 20, discY + 24, { width: W - 40, lineGap: 2 });

mark("page 5 end");

// ===========================================================================
// Footer on every page, then finish
// ===========================================================================
const range = doc.bufferedPageRange();
if (range.count !== P.pdf.pages) {
  throw new Error(`[company-profile] expected ${P.pdf.pages} pages, drew ${range.count} — content overflowed a page`);
}
for (let i = range.start; i < range.start + range.count; i += 1) {
  doc.switchToPage(i);
  const saved = doc.page.margins.bottom;
  doc.page.margins.bottom = 0; // footer sits inside the bottom margin
  const fy = PAGE.h - 50;
  rule(PAGE.mx, fy, RIGHT);
  font(F.reg, 7.5, C.ink3).text(`${P.website.display}   ·   Helpline ${SITE.helpline.display}   ·   ${SITE.email}`, PAGE.mx, fy + 9, { lineBreak: false });
  font(F.reg, 7.5, C.ink3).text(`${P.confidentiality}   ·   Generated ${generated}`, PAGE.mx, fy + 21, { lineBreak: false });
  textRight(`Page ${i + 1} of ${range.count}`, RIGHT, fy + 9, { name: F.bold, size: 7.5, color: C.green });
  textRight(P.legalName, RIGHT, fy + 21, { size: 7.5 });
  doc.page.margins.bottom = saved;
}
doc.end();
await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

// ---------------------------------------------------------------------------
// Verify the output without pdfkit: header, size and page count.
// ---------------------------------------------------------------------------
const bytes = await readFile(OUT);
const header = bytes.subarray(0, 5).toString("latin1");
const pageCount = (bytes.toString("latin1").match(/\/Type\s*\/Page(?![s])/g) ?? []).length;
const kb = bytes.length / 1024;
if (header !== "%PDF-") throw new Error(`[company-profile] ${OUT} does not start with %PDF-`);
if (kb < 50) throw new Error(`[company-profile] ${OUT} is only ${kb.toFixed(0)} KB`);
if (pageCount !== P.pdf.pages) throw new Error(`[company-profile] ${OUT} has ${pageCount} pages, expected ${P.pdf.pages}`);
console.log(`[company-profile] ${pageCount} pages -> ${OUT} (${kb.toFixed(0)} KB)`);

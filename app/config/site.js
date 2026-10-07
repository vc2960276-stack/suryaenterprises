// ---------------------------------------------------------------------------
// Surya Enterprises — storefront business configuration.
//
// Every customer-facing business claim on the marketplace (helpline, delivery
// coverage, return policy, shipping thresholds, trust badges) is read from
// THIS FILE ONLY. Values marked `PLACEHOLDER` are safe, non-committal defaults
// — the owner should review and edit them. Set a value to `null` to hide it.
// ---------------------------------------------------------------------------

// PLACEHOLDER — helpline hours. This one string is shown everywhere hours appear
// (header strip, footer, contact page, trust bar, institutional page).
const HELPLINE_HOURS = "Mon–Sat, 9:00 AM – 6:00 PM";

export const SITE = {
  name: "Surya Enterprises",
  legalName: "SURYAENTERPRISES Limited",
  shortLabel: "Agri Marketplace",
  tagline: "India's biggest agriculture marketplace",
  logo: "/assets/images/logo.jpeg",

  // Contact details reused from the existing site (navbar/footer/contact).
  helpline: {
    display: "+91 9650300157",
    tel: "+919650300157",
    hours: HELPLINE_HOURS,
  },
  email: "SURYA2026ENT@gmail.com",
  grievanceEmail: "SURYA2026ENT@gmail.com",
  offices: [
    {
      label: "Rajasthan Registration",
      gstin: "08IIPPP7537C1ZO",
      address:
        "Shop No. SS-53, Rajdhani Krishi Mandi, Sikar Road, Kukar Kheda, Jaipur, Rajasthan — 302013",
    },
    {
      label: "Delhi Registration",
      gstin: "07IIPPP7537C1ZQ",
      address:
        "Ground Floor, 6670, BALMIKI MANDIR, Nabi Karim Road, Nabi Karim, New Delhi, Central Delhi, Delhi — 110055",
    },
  ],

  // PLACEHOLDER — default PIN shown in "Deliver to" until the shopper sets one.
  // null shows "Select PIN".
  defaultPin: null,

  delivery: {
    // PLACEHOLDER — shown after a shopper checks a PIN on a product page.
    // Do not promise dates/ETAs here unless they are operationally true.
    coverageMessage:
      "Delivery availability and charges for this PIN are confirmed when you place your order.",
    // PLACEHOLDER — shown in the cart price breakdown for delivery.
    cartDeliveryLabel: "Calculated at checkout",
    // PLACEHOLDER — set to a rupee amount (e.g. 999) to advertise free shipping
    // above that order value. null = not advertised anywhere.
    freeShippingThreshold: null,
  },

  // PLACEHOLDER — short return / replacement policy line shown in Help areas.
  returnPolicy:
    "For return or replacement queries, contact our helpline with your order ID.",

  // Label disclaimer shown in "Safety & usage" on every product page.
  labelDisclaimer:
    "Always read and follow the label and leaflet approved by the CIB&RC before use. Use only on the crops and at the doses stated on the product label. Keep away from children, food and animal feed.",

  // Trust bar items (home page + footer). `icon` is a lucide icon key resolved
  // in components/shop/TrustBar.jsx. PLACEHOLDER — edit wording to match ops.
  trust: [
    { icon: "factory", title: "Manufacturer direct", text: "Manufactured and supplied by Surya Enterprises" },
    { icon: "shield", title: "Genuine products", text: "Sold by the brand itself" },
    { icon: "upi", title: "Secure UPI payments", text: "UPI via PayU" },
    { icon: "phone", title: "Helpline", text: HELPLINE_HOURS },
  ],

  // Payment methods that are actually live in checkout.
  payments: ["UPI via PayU"],
};

export const telHref = `tel:${SITE.helpline.tel}`;
export const mailHref = `mailto:${SITE.email}`;

// Marketplace taxonomy. Live categories map 1:1 to `category` values in the
// catalogue data. Add a new live category here (with its `dataCategory`) once
// products for it are supplied; "coming soon" entries render greyed out.

export const CATEGORIES = [
  {
    slug: "insecticides",
    illustration: "/assets/marketplace/need-pest.svg",
    name: "Insecticides",
    dataCategory: "Insecticides",
    need: "Insect & pest control",
    icon: "bug",
    tint: "#FFF4D6",
    legacyPath: "/products/insecticides",
    description:
      "Crop protection solutions for managing harmful insects and supporting healthy growth.",
  },
  {
    slug: "herbicides",
    illustration: "/assets/marketplace/need-weed.svg",
    name: "Herbicides",
    dataCategory: "Herbicides",
    need: "Weed control",
    icon: "sprout",
    tint: "#E8F5EC",
    legacyPath: "/products/herbicides",
    description:
      "Responsible weed management products to help crops compete for essential resources.",
  },
  {
    slug: "fungicides",
    illustration: "/assets/marketplace/need-disease.svg",
    name: "Fungicides",
    dataCategory: "Fungicides",
    need: "Leaf & crop disease",
    icon: "leaf",
    tint: "#E7F0FB",
    legacyPath: "/products/fungicides",
    description:
      "Focused crop care for managing fungal pressure and protecting plant quality.",
  },
  {
    slug: "pgr-and-others",
    illustration: "/assets/marketplace/need-growth.svg",
    name: "PGR and Others",
    shortName: "Plant growth regulators",
    dataCategory: "PGR and Others",
    need: "Plant growth",
    icon: "trending",
    tint: "#F3EEE8",
    legacyPath: "/products/pgr-and-others",
    description:
      "Plant growth regulators and specialty solutions for balanced, productive crops.",
  },
];

export const COMING_SOON = [
  { slug: "seeds", name: "Seeds", icon: "wheat", illustration: "/assets/marketplace/soon-seeds.svg" },
  { slug: "fertilisers", name: "Fertilisers", icon: "package", illustration: "/assets/marketplace/soon-fertiliser.svg" },
  { slug: "farm-tools", name: "Farm tools", icon: "shovel", illustration: "/assets/marketplace/soon-tools.svg" },
  { slug: "irrigation", name: "Irrigation", icon: "droplets", illustration: "/assets/marketplace/soon-irrigation.svg" },
];

export const categoryBySlug = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
export const categoryByData = Object.fromEntries(CATEGORIES.map((c) => [c.dataCategory, c]));

export const categoryHref = (slug) => `/c/${slug}`;
export const productHref = (slug) => `/p/${slug}`;

import { notFound } from "next/navigation";
import { categoryBySlug } from "../../../config/taxonomy";
import { getSubcategory } from "../../../products/data/catalog.server";

// Unknown subcategories 404 before the page's loading boundary streams.
export default async function SubcategoryLayout({ params, children }) {
  const { category, subcategory } = await params;
  const c = categoryBySlug[category];
  if (!c || !getSubcategory(c.slug, subcategory)) notFound();
  return children;
}

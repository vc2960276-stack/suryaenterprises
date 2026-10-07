import { notFound } from "next/navigation";
import { getProductBySlug } from "../../products/data/catalog.server";

// Unknown products 404 before the page's loading boundary streams.
export default async function ProductLayout({ params, children }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) notFound();
  return children;
}

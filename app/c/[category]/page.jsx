import { notFound } from "next/navigation";
import ListingView from "../../components/shop/ListingView";
import { categoryBySlug } from "../../config/taxonomy";
import { parseListingParams, queryListing } from "../../products/data/catalog.server";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const c = categoryBySlug[category];
  if (!c) return { title: "Category not found" };
  return {
    title: `${c.name} — buy online`,
    description: `${c.description} Shop ${c.name.toLowerCase()} online from Surya Enterprises.`,
    alternates: { canonical: `/c/${c.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const c = categoryBySlug[category];
  if (!c) notFound();

  const state = parseListingParams(await searchParams);
  state.q = "";
  state.category = "";
  const result = queryListing({ scope: "category", categorySlug: c.slug, params: state });
  const viewState = { ...state, page: result.page };

  return (
    <ListingView
      scope="category"
      basePath={`/c/${c.slug}`}
      title={c.name}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "All categories", href: "/products" },
        { label: c.name },
      ]}
      result={result}
      state={viewState}
      emptyActions={[
        { label: `Clear filters`, href: `/c/${c.slug}` },
        { label: "All categories", href: "/products" },
      ]}
    />
  );
}

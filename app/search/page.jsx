import ListingView from "../components/shop/ListingView";
import { categoryBySlug } from "../config/taxonomy";
import { parseListingParams, queryListing } from "../products/data/catalog.server";

const POPULAR = ["Imidacloprid", "Glyphosate", "Mancozeb", "Gibberellic Acid", "Chlorpyrifos", "Atrazine"];

export async function generateMetadata({ searchParams }) {
  const { q } = parseListingParams(await searchParams);
  return {
    title: q ? `Search results for “${q}”` : "Search products",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }) {
  const state = parseListingParams(await searchParams);
  const result = queryListing({ scope: "search", params: state });
  const scopeName = categoryBySlug[state.category]?.name;

  return (
    <ListingView
      scope="search"
      basePath="/search"
      title={state.q ? <>Results for “{state.q}”</> : scopeName ?? "All products"}
      subtitle={state.q && scopeName ? <>in {scopeName}</> : null}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: state.q ? `Search: ${state.q}` : "Search" }]}
      result={result}
      state={{ ...state, page: result.page }}
      suggestions={POPULAR}
      emptyActions={[
        { label: "Browse all categories", href: "/products" },
        { label: "Contact us", href: "/contact" },
      ]}
    />
  );
}

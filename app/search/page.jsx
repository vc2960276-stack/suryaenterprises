import ListingView from "../components/shop/ListingView";
import { categoryBySlug } from "../config/taxonomy";
import { parseListingParams, queryListing } from "../products/data/catalog.server";

// Suggestions shown on an empty result — brands, crops and product types that
// exist in the catalogue.
const POPULAR = ["Syngenta", "Bayer", "Tomato seeds", "Chilli seeds", "Sprayer", "Tarpaulin"];

export async function generateMetadata({ searchParams }) {
  const { q, brands } = parseListingParams(await searchParams);
  return {
    title: q ? `Search results for “${q}”` : brands.length === 1 ? `${brands[0]} products` : "Search products",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }) {
  const state = parseListingParams(await searchParams);
  const result = queryListing({ scope: "search", params: state });
  const scopeName = categoryBySlug[state.category]?.name;
  const brandTitle = !state.q && state.brands.length === 1 ? state.brands[0] : null;

  return (
    <ListingView
      scope="search"
      basePath="/search"
      title={state.q ? <>Results for “{state.q}”</> : brandTitle ?? scopeName ?? "All products"}
      subtitle={state.q && scopeName ? <>in {scopeName}</> : null}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: state.q ? `Search: ${state.q}` : brandTitle ?? "Search" }]}
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

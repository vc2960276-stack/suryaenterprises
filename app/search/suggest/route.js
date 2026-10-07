// GET /search/suggest?q=...&category=slug
// Returns up to 8 { name, slug, price, image, category } for the header search.
import { suggest } from "../../products/data/catalog.server";

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const items = suggest(searchParams.get("q"), searchParams.get("category"));
  return Response.json(
    { items },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" } }
  );
}

import { redirect } from "next/navigation";

// Legacy category URL — the marketplace listing now lives at /c/herbicides.
export default function LegacyCategoryPage() {
  redirect("/c/herbicides");
}

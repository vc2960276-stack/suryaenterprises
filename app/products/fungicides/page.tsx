import { redirect } from "next/navigation";

// Legacy category URL — the marketplace listing now lives at /c/fungicides.
export default function LegacyCategoryPage() {
  redirect("/c/fungicides");
}

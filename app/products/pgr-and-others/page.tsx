import { redirect } from "next/navigation";

// Legacy category URL — the marketplace listing now lives at /c/pgr-and-others.
export default function LegacyCategoryPage() {
  redirect("/c/pgr-and-others");
}

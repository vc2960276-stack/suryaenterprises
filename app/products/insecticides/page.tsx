import { redirect } from "next/navigation";

// Legacy category URL — the marketplace listing now lives at /c/insecticides.
export default function LegacyCategoryPage() {
  redirect("/c/insecticides");
}

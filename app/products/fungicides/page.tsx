import { permanentRedirect } from "next/navigation";

// Legacy category URL — these products now live under /c/crop-protection/fungicides.
export default function LegacyCategoryPage() {
  permanentRedirect("/c/crop-protection/fungicides");
}

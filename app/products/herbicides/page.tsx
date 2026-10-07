import { permanentRedirect } from "next/navigation";

// Legacy category URL — these products now live under /c/crop-protection/herbicides.
export default function LegacyCategoryPage() {
  permanentRedirect("/c/crop-protection/herbicides");
}

import { permanentRedirect } from "next/navigation";

// Legacy category URL — these products now live under /c/crop-nutrition/growth-regulators.
export default function LegacyCategoryPage() {
  permanentRedirect("/c/crop-nutrition/growth-regulators");
}

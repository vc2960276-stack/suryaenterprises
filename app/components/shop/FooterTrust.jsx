"use client";

import { usePathname } from "next/navigation";
import TrustBar from "./TrustBar";

// The home page shows the trust bar near the top; avoid repeating it there.
export default function FooterTrust() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div className="shell pb-4">
      <TrustBar />
    </div>
  );
}

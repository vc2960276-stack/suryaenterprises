"use client";

import { usePathname } from "next/navigation";

export default function StoreChrome({ children, header, footer, mobileNavigation }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname?.startsWith("/admin/");

  if (isAdmin) return <div id="main">{children}</div>;

  return (
    <>
      {header}
      <div id="main" className="min-h-[60vh]">{children}</div>
      {footer}
      {mobileNavigation}
    </>
  );
}

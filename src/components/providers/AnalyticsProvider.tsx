"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const skipPaths = ["/admin", "/api"];
    const shouldSkip = skipPaths.some((path) => pathname.startsWith(path));
    if (shouldSkip) return;

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        event: "page_view",
      }),
    }).catch(() => {});
  }, [pathname]);

  return <>{children}</>;
}
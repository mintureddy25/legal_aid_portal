"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Resets the window scroll to the top whenever the route changes, so a new
 * page never opens at the previous page's scroll position.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}

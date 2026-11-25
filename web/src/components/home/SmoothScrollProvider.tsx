"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Home-page-only smooth wheel scrolling (Lenis).
 *
 * Mounted from app/page.tsx, so /about and /businesses keep native scrolling;
 * the instance is destroyed when the home page unmounts. Lenis still drives the
 * native window scroll position, so framer-motion's useScroll / whileInView
 * keep working unchanged. Skipped entirely for prefers-reduced-motion.
 */
export default function SmoothScrollProvider({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Short glide so the page tracks the wheel almost immediately
      duration: 0.6,
      // easeOutExpo — quick response, soft settle
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.2,
      smoothWheel: true,
      anchors: true,
      autoRaf: true,
    });

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}

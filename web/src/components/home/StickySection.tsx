"use client";

import React, { useEffect, useRef } from "react";

/**
 * Sticky-overlap wrapper for the home page.
 *
 * The wrapper is `position: sticky` with `top = 100vh − height`: the section
 * scrolls normally until its BOTTOM reaches the bottom of the viewport, then
 * it pins in place while the next (higher z-index, opaque) section slides up
 * over it.
 *
 * While a pinned section is completely covered by the next one it is set to
 * `visibility: hidden`, so its looping animations stop costing paint time.
 *
 * Requirements: the StickySection and everything after it must share one
 * block container (the sticky constraint), and the following content must be
 * opaque with a higher z-index.
 */
export default function StickySection({
  z,
  children,
  divider = false,
  className = "",
}: {
  z: number;
  children: React.ReactNode;
  /** Thin gold hairline + soft shadow on the top edge (overlapping sections) */
  divider?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let lastTop = NaN;
    let hidden = false;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const h = el.offsetHeight;
      // Pin when the section's bottom meets the viewport bottom — for short
      // sections too (positive top), so they are fully visible (clear of the
      // sticky navbar) before the next one slides over.
      const top = vh - h;
      if (top !== lastTop) {
        el.style.top = `${top}px`;
        lastTop = top;
      }

      // Fully covered? Everything after a pinned section is opaque and
      // continuous to the end of the page, so once the next sibling reaches
      // the top of the viewport this layer is entirely hidden for good.
      const next = el.nextElementSibling as HTMLElement | null;
      const covered = next ? next.getBoundingClientRect().top <= 0 : false;
      if (covered !== hidden) {
        el.style.visibility = covered ? "hidden" : "";
        hidden = covered;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ zIndex: z }}
      className={`sticky top-0 w-full transform-gpu will-change-transform ${
        divider ? "shadow-[0_-18px_40px_-12px_rgba(31,31,31,0.18)]" : ""
      } ${className}`}
    >
      {divider && (
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 z-10 h-px bg-gradient-to-r from-transparent via-[#B39B6B]/45 to-transparent pointer-events-none"
        />
      )}
      {children}
    </div>
  );
}

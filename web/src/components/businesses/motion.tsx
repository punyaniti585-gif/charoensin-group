"use client";

import React, { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Architectural Luxury easing shared across the /businesses page */
export const luxEase = [0.22, 1, 0.36, 1] as const;

/** Mask box for slide-up headline reveals (padding protects Thai marks) */
export const MASK_CLASS =
  "inline-block overflow-hidden align-bottom pt-[0.18em] pb-[0.12em] -my-[0.15em]";

const fmt = (n: number, suffix: string) => `${Math.round(n).toLocaleString("en-US")}${suffix}`;

/**
 * Number that counts up once it scrolls into view.
 * Writes straight to the DOM node each frame (no React re-render per frame);
 * the server-rendered text is the final value, so no-JS / reduced motion
 * users always see the real number.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1.6,
  className = "",
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const started = useRef(false);

  // Reset to 0 on mount (before it is visible) so the count-up can play
  useEffect(() => {
    if (!reduce && ref.current && !started.current) ref.current.textContent = fmt(0, suffix);
  }, [reduce, suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || started.current) return;
    started.current = true;
    if (reduce) {
      el.textContent = fmt(value, suffix);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: luxEase,
      onUpdate: (v) => {
        el.textContent = fmt(v, suffix);
      },
    });
    return () => {
      controls.stop();
      el.textContent = fmt(value, suffix); // never leave a half-counted number
    };
  }, [inView, reduce, value, suffix, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {fmt(value, suffix)}
    </span>
  );
}

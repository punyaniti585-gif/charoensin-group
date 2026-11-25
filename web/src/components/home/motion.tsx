"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

/** Shared home-page motion: transform + opacity only, play once at 20% in view. */
export const luxEase = [0.22, 1, 0.36, 1] as const;
export const VIEWPORT = { once: true, amount: 0.2 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: luxEase } },
};

export const stagger = (gap = 0.1): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});

/** Section reveal wrapper (children use `fadeUp` or their own variants) */
export function Reveal({
  children,
  className = "",
  gap = 0.1,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  as?: "div" | "section" | "ul" | "dl";
}) {
  const Comp = motion[as];
  return (
    <Comp variants={stagger(gap)} initial="hidden" whileInView="show" viewport={VIEWPORT} className={className}>
      {children}
    </Comp>
  );
}

/** Section eyebrow + title */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl"}>
      <motion.p
        variants={fadeUp}
        className={`inline-flex items-center gap-3 font-inter text-[11px] font-medium uppercase tracking-[0.3em] ${dark ? "text-[#cfc29f]" : "text-[#a28757]"}`}
      >
        <span aria-hidden className={`h-px w-8 ${dark ? "bg-[#cfc29f]" : "bg-[#a28757]"}`} />
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className={`mt-4 font-kanit font-normal text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.18] tracking-tight ${dark ? "text-white" : "text-[#14171F]"}`}
      >
        {title}
      </motion.h2>
      {lead && (
        <motion.p variants={fadeUp} className={`mt-4 font-sarabun text-base lg:text-lg leading-relaxed ${dark ? "text-white/65" : "text-[#14171F]/65"}`}>
          {lead}
        </motion.p>
      )}
    </Reveal>
  );
}

/**
 * Lightweight count-up: writes textContent directly (no React re-render per
 * frame) once the number scrolls into view.
 */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  duration = 1.6,
  className = "",
  pad = 1,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
  /** minimum integer digits ("05") */
  pad?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: pad, minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  // Once hydrated (and before it is seen) start from 0 so the count-up reads cleanly
  const started = useRef(false);
  useEffect(() => {
    if (!reduce && ref.current && !started.current && !inView) ref.current.textContent = fmt(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || started.current) return;
    started.current = true;
    if (reduce) {
      el.textContent = fmt(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / (duration * 1000));
      const e = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(value * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  // Server/initial render shows the final value (correct without JS)
  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}

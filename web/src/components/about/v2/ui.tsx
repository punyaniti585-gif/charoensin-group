"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { csgEase } from "@/components/ui/MotionWrapper";

/* Shared building blocks for the About V.2 page.
   Motion rule for every V.2 component: animate transform and opacity only
   (no filter / blur, no animated box-shadow or layout properties). */

export const NAVY = "#111e46";
export const GOLD = "#C8A96A";
export const PAGE_BG = "#FAF8F3";

export type ViewId = "history" | "vision" | "leadership";
export const VIEW_ORDER: ViewId[] = ["history", "vision", "leadership"];

/** Height kept clear for the pinned Navbar main bar when scrolling to a view */
export const NAV_OFFSET = 76;

/** Full-bleed rounded section surface: 12px (24px from lg) in from each
    viewport edge, capped at 1640px. No border — sections are told apart by
    alternating background tones. */
export const SURFACE =
  "relative mx-auto w-[calc(100%-24px)] max-w-[1640px] overflow-clip rounded-[28px] lg:w-[calc(100%-48px)]";

/** Desktop one-screen fit (viewport minus the pinned Navbar), with room at
    the bottom for the floating view pill. */
export const FIT = "pb-24 lg:min-h-[calc(100vh-80px)]";

/** Gap between stacked surfaces — matches the side inset */
export const STACK_GAP = "gap-3 lg:gap-6";

/** Fade-up on first entry into the viewport */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: csgEase }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Heading reveal ----------------
   Shared motion for every large section heading (played once on scroll-in):
     1. gold rule draws out (scaleX 0→1) + kicker fades up
     2. the title rises from behind a clipping edge (y 105%→0)
     3. a short gold bar draws out under the title
   Whole lines move together (Thai is never split into letters, which would
   break vowel/tone marks); the clip window has vertical padding so tone
   marks are not cut. Transform + opacity only; with reduced motion the
   pieces just fade in.
   The variant components below run inside any parent that sets
   initial="hidden" + whileInView/animate="show". */
const HEADING_EASE = [0.16, 1, 0.3, 1] as const;

/** Variants for one piece of a heading, `delay` seconds after the trigger */
export function useHeadingVariants() {
  const reduce = useReducedMotion();
  return {
    rule: (delay = 0) => ({
      hidden: { scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
      show: { scaleX: 1, opacity: 1, transition: { duration: 0.8, delay: reduce ? 0 : delay, ease: HEADING_EASE } },
    }),
    fade: (delay = 0, y = 12) => ({
      hidden: { opacity: 0, y: reduce ? 0 : y },
      show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: reduce ? 0 : delay, ease: HEADING_EASE } },
    }),
    rise: (delay = 0) => ({
      hidden: { opacity: 0, y: reduce ? "0%" : "105%" },
      show: { opacity: 1, y: "0%", transition: { duration: 1, delay: reduce ? 0 : delay, ease: HEADING_EASE } },
    }),
  };
}

/** Title text that rises from behind a clipping edge (use inside a variants parent) */
export function MaskedTitle({ children, delay = 0.15 }: { children: React.ReactNode; delay?: number }) {
  const v = useHeadingVariants();
  return (
    <span className="-my-[0.18em] block overflow-hidden py-[0.18em]">
      <motion.span variants={v.rise(delay)} className="block will-change-transform">
        {children}
      </motion.span>
    </span>
  );
}

/** Short gold bar drawn under a title (use inside a variants parent) */
export function TitleBar({ delay = 0.55, center = false, className = "" }: { delay?: number; center?: boolean; className?: string }) {
  const v = useHeadingVariants();
  return (
    <motion.span
      variants={v.rule(delay)}
      aria-hidden
      className={`block h-[2px] w-14 bg-[#C8A96A] ${center ? "mx-auto origin-center" : "origin-left"} ${className}`}
    />
  );
}

/** Numbered section heading: 01 · Kicker / Title — with the heading reveal */
export function SectionHeading({
  number,
  kicker,
  title,
  align = "left",
  tone = "light",
  children,
}: {
  number?: string;
  kicker: string;
  title: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  children?: React.ReactNode;
}) {
  const dark = tone === "dark";
  const center = align === "center";
  const v = useHeadingVariants();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}
    >
      <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        {number && (
          <motion.span variants={v.fade(0, 8)} className="font-playfair text-sm tracking-[0.2em] text-[#C8A96A]">
            {number}
          </motion.span>
        )}
        <motion.span variants={v.rule(0)} className="h-px w-10 origin-left bg-[#C8A96A]/70" aria-hidden />
        <motion.span
          variants={v.fade(0.05, 8)}
          className={`font-kanit text-xs uppercase tracking-[0.28em] ${dark ? "text-white/70" : "text-[#111e46]/60"}`}
        >
          {kicker}
        </motion.span>
      </div>
      <h2
        className={`mt-4 font-kanit text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-white" : "text-[#111e46]"
        }`}
      >
        <MaskedTitle>{title}</MaskedTitle>
      </h2>
      <TitleBar center={center} className="mt-4" />
      {children && (
        <motion.div
          variants={v.fade(0.4, 10)}
          className={`mt-4 font-sarabun text-base leading-relaxed lg:text-[17px] ${dark ? "text-white/75" : "text-[#111e46]/70"}`}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { BusinessPageData } from "@/data/businesses-data";
import { luxEase } from "./motion";
import HeroStage3D from "./HeroStage3D";

type Props = Pick<BusinessPageData, "hero"> & {
  /** Id of the section the CTA scrolls to (stats) */
  ctaTargetId: string;
};

/**
 * Hero — fills the first screen (minus the site header) on desktop:
 *   [ eyebrow · headline · subtitle · CTA | 3D cards 01→05 ]
 * Text motion: gold eyebrow line draws left→right, headline masked
 * slide-up with a soft gold shimmer, subtitle + CTA fade up in sequence.
 */
export default function BusinessHero({ hero, ctaTargetId }: Props) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // 0 → 1 while the hero scrolls from its top to fully out of view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scrollToTarget = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(ctaTargetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${ctaTargetId}`);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#F7F1E7] overflow-hidden flex items-center py-10 sm:py-12 lg:py-10 lg:min-h-[calc(100svh-4.1rem)]"
    >
      {/* Blueprint grid ambience */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #CCA369 1px, transparent 1px), linear-gradient(to bottom, #CCA369 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-60 -right-60 w-[900px] h-[900px] rounded-full bg-radial from-[#CCA369]/14 via-[#CCA369]/4 to-transparent pointer-events-none"
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ================= Text ================= */}
          <div className="lg:col-span-5">
            {/* Eyebrow: gold line draws left → right, label fades after it */}
            <div className="flex items-center gap-3">
              <motion.span
                aria-hidden="true"
                className="block w-10 h-px bg-[#CCA369] origin-left"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: luxEase }}
              />
              <motion.span
                className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#6B5A3A] font-inter font-semibold"
                initial={reduce ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: luxEase }}
              >
                {hero.eyebrow}
              </motion.span>
            </div>

            {/* Headline: masked slide-up + soft gold shimmer */}
            <h1 className="mt-4 text-5xl sm:text-6xl xl:text-7xl font-bold font-kanit tracking-tight leading-[1.1]">
              <span className="inline-block overflow-hidden align-bottom pt-[0.18em] pb-[0.12em] -my-[0.15em]">
                <motion.span
                  className="inline-block text-[#1F1F1F]"
                  initial={reduce ? false : { y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, delay: 0.45, ease: luxEase }}
                >
                  <span className="text-gold-shimmer [--shimmer-base:#1F1F1F]">{hero.title}</span>
                </motion.span>
              </span>
            </h1>

            <motion.div
              aria-hidden="true"
              className="mt-6 h-[1.5px] w-24 bg-[#CCA369] origin-left"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.75, ease: luxEase }}
            />

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: luxEase }}
              className="mt-6 text-base lg:text-lg font-sarabun text-[#1F1F1F]/80 leading-relaxed max-w-md"
            >
              {hero.subtitle}
            </motion.p>

            <motion.a
              href={`#${ctaTargetId}`}
              onClick={scrollToTarget}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05, ease: luxEase }}
              className="group mt-8 inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#1F1F1F] hover:bg-[#6B5A3A] text-white font-kanit text-sm font-medium shadow-[0_10px_30px_rgba(31,31,31,0.18)] transition-colors duration-300"
            >
              ภาพรวมกลุ่มธุรกิจ
              <span className="w-8 h-8 rounded-full bg-[#CCA369] text-[#1F1F1F] flex items-center justify-center transition-transform duration-300 group-hover:translate-y-0.5">
                <ArrowDown className="w-4 h-4" />
              </span>
            </motion.a>
          </div>

          {/* ================= 3D cards ================= */}
          <div className="lg:col-span-7">
            <HeroStage3D tiles={hero.tiles} progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

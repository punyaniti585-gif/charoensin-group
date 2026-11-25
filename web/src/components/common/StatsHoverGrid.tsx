"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CountUp } from "@/components/ui/MotionWrapper";

export interface HoverStat {
  /** Heading shown above the number (moves to the top on hover) */
  title: string;
  value: number;
  /** Unit shown under the number, e.g. "บริษัท" */
  unit: string;
  /** Appended straight after the number, e.g. "+" or "%" */
  suffix?: string;
  decimals?: number;
  /** Optional small line under the unit */
  note?: string;
  /** Background photo revealed on hover (must exist in /public) */
  image: string;
  imageAlt: string;
}

/**
 * Shared "hover reveal" stats grid (used on / and /businesses).
 *
 * Rest:  clean white tiles separated by hairlines, dark centred text.
 * Hover: the photo fades + eases up to full bleed (opacity 0→1, scale 1→1.05),
 *        a black gradient lifts legibility, the text turns white while the
 *        title glides to the top and the number + unit glide to the bottom.
 * Numbers count up once the grid scrolls into view.
 *
 * Only opacity / transform / color are transitioned, so every hover runs on
 * the compositor. Keyboard users get the same reveal via :focus-visible.
 */
export default function StatsHoverGrid({
  stats,
  className = "",
}: {
  stats: HoverStat[];
  className?: string;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.dl
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 overflow-hidden ${className}`}
    >
      {stats.map((s) => (
        <motion.div
          key={s.title}
          variants={item}
          tabIndex={0}
          className="group relative isolate h-[320px] sm:h-[380px] lg:h-[400px] overflow-hidden bg-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#CCA369]"
        >
          {/* Hover photo — fades in and eases to 105% */}
          <Image
            src={s.image}
            alt={s.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="-z-10 object-cover opacity-0 scale-100 transition-[opacity,transform] duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 group-focus-visible:opacity-100 group-focus-visible:scale-105"
          />
          {/* Legibility gradient */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/50 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
          />

          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            {/* Title → glides to the top */}
            <dt className="font-kanit text-base sm:text-lg font-medium text-[#151824] transition-[transform,color] duration-500 ease-out group-hover:text-white group-focus-visible:text-white group-hover:-translate-y-[58px] sm:group-hover:-translate-y-[76px] lg:group-hover:-translate-y-[86px] group-focus-visible:-translate-y-[58px] sm:group-focus-visible:-translate-y-[76px] lg:group-focus-visible:-translate-y-[86px]">
              {s.title}
            </dt>

            {/* Number + unit → glide to the bottom */}
            <dd className="mt-4 flex flex-col items-center transition-transform duration-500 ease-out group-hover:translate-y-[50px] sm:group-hover:translate-y-[68px] lg:group-hover:translate-y-[78px] group-focus-visible:translate-y-[50px] sm:group-focus-visible:translate-y-[68px] lg:group-focus-visible:translate-y-[78px]">
              <span className="font-playfair text-5xl sm:text-6xl font-semibold leading-none tracking-tight text-[#151824] transition-colors duration-500 group-hover:text-white group-focus-visible:text-white">
                <CountUp
                  to={s.value}
                  decimals={s.decimals ?? 0}
                  suffix={s.suffix ?? ""}
                  duration={2}
                />
              </span>
              <span className="mt-3 font-sarabun text-sm sm:text-base text-[#151824]/70 transition-colors duration-500 group-hover:text-white/90 group-focus-visible:text-white/90">
                {s.unit}
              </span>
              {s.note && (
                <span className="mt-1 font-sarabun text-xs text-[#9A7B3E] transition-colors duration-500 group-hover:text-[#E8D3A8] group-focus-visible:text-[#E8D3A8]">
                  {s.note}
                </span>
              )}
            </dd>
          </div>
        </motion.div>
      ))}
    </motion.dl>
  );
}

"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { BusinessPageData } from "@/data/businesses-data";
import { CountUp, luxEase } from "./motion";

type Props = Pick<BusinessPageData, "stats"> & { id: string };

/**
 * Stats band directly after the Hero. When 25% of it scrolls into view the
 * four cards rise one by one (staggerChildren 0.12) and their numbers count
 * up from 0.
 */
export default function BusinessStats({ stats, id }: Props) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
  };
  const card: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.75, ease: luxEase } },
  };

  return (
    <section
      id={id}
      aria-label="ศักยภาพกลุ่มธุรกิจเจริญสิน"
      className="relative w-full bg-white border-y border-[#CCA369]/20 py-12 sm:py-14 lg:py-16 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.dl
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={card}
              className="relative overflow-hidden rounded-2xl bg-[#FAF7F2] border border-[#CCA369]/30 shadow-[0_12px_30px_rgba(107,90,58,0.08)] px-4 sm:px-6 py-5 sm:py-6"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#CCA369] to-transparent"
              />
              <dt className="font-sarabun text-xs sm:text-sm text-[#6B5A3A]">{s.label}</dt>
              <dd className="mt-2 font-playfair text-3xl sm:text-4xl xl:text-5xl font-semibold text-[#1F1F1F] leading-none">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              {s.note && <dd className="mt-2 font-sarabun text-[11px] sm:text-xs text-[#9A7B3E]">{s.note}</dd>}
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import FootprintMap from "./FootprintMap";
import { globalCopy } from "@/data/home-data";
import GrowthTimeline from "./GrowthTimeline";
import { Reveal, VIEWPORT, fadeUp } from "./motion";

/**
 * Section 3 — ฐานธุรกิจและเครือข่ายระดับสากล
 * Clean vector world map + a horizontal pill selector for the 10 countries
 * (select → pin + info card), then 3 growth milestones joined by a gold line
 * that draws across as it scrolls into view. Transform/opacity only.
 */
export default function GlobalSection() {
  return (
    <section aria-labelledby="global-title" className="relative bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Compact header: eyebrow + title left, short lead right */}
        <Reveal className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p variants={fadeUp} className="inline-flex items-center gap-3 font-inter text-[11px] font-medium uppercase tracking-[0.3em] text-[#a28757]">
              <span aria-hidden className="h-px w-8 bg-[#a28757]" />
              {globalCopy.eyebrow}
            </motion.p>
            <motion.h2 id="global-title" variants={fadeUp} className="mt-2 font-kanit font-normal text-2xl sm:text-3xl lg:text-[2.1rem] leading-tight text-[#14171F]">
              {globalCopy.title}
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="max-w-md font-sarabun text-sm text-[#14171F]/60 lg:text-right">
            {globalCopy.lead}
          </motion.p>
        </Reveal>

        {/* Real-country map with travel routes from Bangkok */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT} className="mt-5">
          <FootprintMap />
        </motion.div>

        {/* Growth milestones */}
        <div className="mt-16 lg:mt-20">
          <GrowthTimeline title={globalCopy.growthTitle} />
        </div>
      </div>
    </section>
  );
}

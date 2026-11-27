"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { aboutV2Data } from "@/data/about-data";
import type { AboutDict } from "@/i18n/about";
import { SURFACE } from "./ui";

/* Hero — archival B&W factory photo (pre-converted file, no CSS filter)
   under a navy CI gradient scrim, so the headline reads clearly while the
   upper building detail stays visible. Text shadows use `text-shadow`
   (not the `drop-shadow` filter).

   Cinematic entrance (transform + opacity only):
     0.00s  photo      scale 1.07→1, opacity 0→1 (1.1s)
     0.20s  gold rule  scaleX 0→1 + kicker fades up
     0.35s  headline   "History of buildings", then "/ Charoensin" (+0.12s)
                       rise y 24→0, opacity 0→1
     0.50s  intro box  x 20→0, opacity 0→1
     0.85s  scroll cue fades in */

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HistoryHero({ copy }: { copy: AboutDict["hero"] }) {
  const reduce = useReducedMotion();
  const d = (n: number) => (reduce ? 0 : n);

  const fadeUp = (delay: number, y = 24): Variants => ({
    hidden: { opacity: 0, y: d(y) },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: d(delay), ease: EASE } },
  });
  const rule: Variants = {
    hidden: { scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
    show: { scaleX: 1, opacity: 1, transition: { duration: 0.8, delay: d(0.2), ease: EASE } },
  };
  const slideIn: Variants = {
    hidden: { opacity: 0, x: d(20) },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, delay: d(0.5), ease: EASE } },
  };

  return (
    <section className="pt-3 lg:pt-6">
      <motion.div initial="hidden" animate="show" className={`${SURFACE} flex min-h-[78vh] bg-[#0b132b] lg:min-h-[86vh]`}>
        {/* Beat 1 — photo */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          variants={{
            hidden: { scale: reduce ? 1 : 1.07, opacity: 0 },
            show: { scale: 1, opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <Image
            src={aboutV2Data.heroImageBw}
            alt={copy.imageAlt}
            fill
            priority
            sizes="(min-width: 1640px) 1640px, 100vw"
            className="object-cover"
          />
        </motion.div>
        {/* Navy CI gradient scrim (static) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b]/95 via-[#111e46]/75 to-[#111e46]/25" aria-hidden />

        <div className="relative z-10 flex w-full flex-col justify-end gap-8 p-6 pb-10 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:p-16">
          <div className="max-w-4xl">
            {/* Beat 2 — gold rule + kicker */}
            <div className="flex items-center gap-3">
              <motion.span variants={rule} className="h-px w-10 origin-left bg-[#C8A96A]" aria-hidden />
              <motion.p variants={fadeUp(0.2, 12)} className="font-kanit text-sm uppercase tracking-[0.3em] text-[#C8A96A] text-shadow-sm">
                {copy.kicker}
              </motion.p>
            </div>

            {/* Beat 3 — headline */}
            <h1 className="mt-5 font-playfair leading-[0.95] text-white text-shadow-lg">
              <motion.span variants={fadeUp(0.35)} className="block text-5xl sm:text-7xl lg:text-[6.5rem]">
                {copy.title}
              </motion.span>
              <motion.span variants={fadeUp(0.47)} className="mt-2 block text-4xl italic text-[#DFC07F] sm:text-6xl lg:text-[5.25rem]">
                <span className="not-italic text-white/45">/ </span>
                {copy.brand}
              </motion.span>
            </h1>
          </div>

          {/* Beat 4 — intro box, then the scroll cue */}
          <div className="max-w-md lg:mb-2">
            <motion.div variants={slideIn} className="rounded-r-2xl border-l-2 border-[#C8A96A] bg-[#0d1736]/80 px-6 py-5 shadow-lg">
              <p className="font-kanit text-sm tracking-[0.18em] text-[#C8A96A]">{copy.since}</p>
              <p className="mt-2.5 font-sarabun text-base leading-relaxed text-white/90 lg:text-[17px]">{copy.intro}</p>
            </motion.div>
            <motion.p variants={fadeUp(0.85, 8)} className="mt-5 flex items-center gap-2 font-kanit text-xs uppercase tracking-[0.25em] text-white/65">
              <motion.span
                animate={reduce ? undefined : { y: [0, 6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <ArrowDown className="h-4 w-4" />
              </motion.span>
              {copy.scroll}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

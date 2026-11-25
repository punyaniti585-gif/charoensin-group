"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { manifesto, manifestoStats } from "@/data/home-data";
import { Reveal, fadeUp, luxEase } from "./motion";

const CYCLE_S = 3.2;

/**
 * Section 2 — มุ่งมั่นสู่การเป็นองค์กรชั้นนำ ที่เติบโตอย่างมั่นคง
 * One-screen split inside a warm cream frame.
 * Left: a photo card cycling 4 stats every 3.2s — the photo cross-fades with
 *   a gentle zoom (1.06 → 1), the big number slides up through a mask, and a
 *   gold progress line under the active 01–04 dot drives the timer (its CSS
 *   `animationend` advances). Pauses on hover / while off screen; dots are
 *   clickable.
 * Right: tag, title, the two original paragraphs and a gold gradient CTA,
 *   staggering in on enter. transform + opacity only.
 */
export default function ManifestoSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { amount: 0.35 });
  const paused = hovering || !inView || !!reduce;
  const s = manifestoStats[active];
  const next = () => setActive((i) => (i + 1) % manifestoStats.length);

  // Reduced motion: no auto-cycle at all (dots still work)
  useEffect(() => {
    if (reduce) setActive(0);
  }, [reduce]);

  return (
    <section aria-labelledby="manifesto-title" className="relative bg-white px-3 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-[1320px] rounded-[1.5rem] sm:rounded-[2rem] border border-[#a28757]/20 bg-[#FAF8F3] p-4 sm:p-8 md:p-12 lg:p-14 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ---------------- Left: stat showcase card ---------------- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-6"
          >
            <div
              ref={cardRef}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className="relative mx-auto aspect-[4/3] w-full lg:max-w-[min(100%,calc((100svh-13rem)*4/3))] overflow-hidden rounded-3xl border border-[#a28757]/25 bg-[#111e46] shadow-lg"
            >
              {/* Photo cross-fade + subtle zoom */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={s.image}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: luxEase }}
                >
                  <Image src={s.image} alt={s.imageAlt} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" style={{ objectPosition: s.position }} />
                </motion.div>
              </AnimatePresence>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#111e46]/85 via-[#111e46]/25 to-transparent" />

              {/* Bottom bar: dots + progress (left) · stat (right) */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                <div role="tablist" aria-label="สถิติเจริญสิน" className="flex items-center gap-3 sm:gap-4">
                  {manifestoStats.map((st, i) => {
                    const on = i === active;
                    return (
                      <button
                        key={st.label}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-label={`${st.label} ${st.value} ${st.unit}`}
                        onClick={() => setActive(i)}
                        className="group flex flex-col items-start gap-1.5 focus-visible:outline-none"
                      >
                        <span className={`font-inter text-[11px] tracking-[0.14em] transition-colors ${on ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={`relative block h-[2px] overflow-hidden rounded-full bg-white/25 transition-[width] duration-300 ${on ? "w-12 sm:w-14" : "w-5 sm:w-6"} group-focus-visible:ring-2 group-focus-visible:ring-[#cfc29f]`}>
                          {on && (
                            <span
                              key={`${active}-${st.label}`}
                              className={`absolute inset-0 origin-left bg-[#cfc29f] ${reduce ? "" : "hero-dock-progress"}`}
                              style={{ animationDuration: `${CYCLE_S}s`, animationPlayState: paused ? "paused" : "running" }}
                              onAnimationEnd={next}
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Masked slide-up stat */}
                <div className="overflow-hidden text-right" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={s.label}
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.4, ease: luxEase }}
                    >
                      <p className="font-inter text-4xl md:text-5xl font-semibold leading-none tracking-tight text-white">
                        {s.value}
                        <span className="ml-1.5 font-kanit text-xl md:text-2xl font-normal text-white/85">{s.unit}</span>
                      </p>
                      <p className="mt-2 font-kanit text-sm md:text-base text-[#cfc29f]">{s.label}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---------------- Right: vision copy + CTA ---------------- */}
          <Reveal className="lg:col-span-6">
            <motion.p
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#a28757]/30 bg-white/60 px-4 py-1.5 font-inter text-[10.5px] font-medium uppercase tracking-[0.26em] text-[#a28757]"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#a28757]" />
              {manifesto.tag}
            </motion.p>
            <motion.h2
              id="manifesto-title"
              variants={fadeUp}
              className="mt-5 font-kanit font-normal text-3xl md:text-4xl leading-tight text-[#1C1F26]"
            >
              {manifesto.title}
            </motion.h2>
            <motion.span variants={fadeUp} aria-hidden className="mt-5 block h-px w-16 bg-gradient-to-r from-[#a28757] to-transparent" />
            <motion.p variants={fadeUp} className="mt-5 font-sarabun text-base lg:text-[1.05rem] leading-relaxed text-[#1C1F26]/75">
              {manifesto.vision}
            </motion.p>
            <motion.p variants={fadeUp} className="mt-3 font-sarabun text-[15px] leading-relaxed text-[#1C1F26]/60">
              {manifesto.story}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-7">
              <Link
                href={manifesto.cta.href}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c6538] to-[#b59a63] px-7 py-3.5 font-kanit text-[15px] text-white shadow-md transition-[box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757] focus-visible:ring-offset-2"
              >
                {manifesto.cta.label}
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { philosophies, philosophyCopy } from "@/data/home-data";
import { Reveal, SectionHeading, fadeUp, luxEase } from "./motion";

const SHOWCASE_S = 5;

/**
 * Section 4 — ปรัชญาการดำเนินธุรกิจ 4 ประการ
 * Left: a large visual showcase card — the selected principle's photo
 * cross-fades in with a gentle zoom (1.05 → 1) under a navy gradient, with
 * the gold number, English tag, title and description rising in.
 * Right: four large selectable cards; the active one is white with a gold
 * border, a nudged arrow and a gold progress bar that runs for 5s — its
 * `animationend` advances to the next principle (CSS-driven timer).
 * Auto-showcase pauses on hover, for a while after a manual pick, and while
 * the section is off screen. Transform + opacity only.
 */
export default function PhilosophySection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [hold, setHold] = useState(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25 });
  const p = philosophies[active];

  const paused = hovering || hold || !inView || !!reduce;
  const next = () => setActive((i) => (i + 1) % philosophies.length);

  // A manual pick holds the showcase for a few seconds (touch has no hover)
  const pick = (i: number) => {
    setActive(i);
    setHold(true);
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHold(false), 8000);
  };
  useEffect(() => () => window.clearTimeout(holdTimer.current), []);

  return (
    <section ref={sectionRef} aria-labelledby="philosophy-title" className="relative bg-[#FAF8F3] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="philosophy-title">
          <SectionHeading eyebrow={philosophyCopy.eyebrow} title={philosophyCopy.title} />
        </div>

        <div
          className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* ---------------- Visual showcase card ---------------- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-6 relative min-h-[420px] lg:min-h-[480px] overflow-hidden rounded-3xl border border-[#a28757]/25 bg-[#111e46] shadow-lg"
            aria-live="polite"
          >
            {/* Photo cross-fade + gentle zoom-in */}
            <AnimatePresence initial={false}>
              <motion.div
                key={p.number}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.7, ease: "easeOut" }, scale: { duration: 1.4, ease: luxEase } }}
              >
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: p.imagePosition === "top" ? "center 25%" : "center" }}
                />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#111e46]/90 via-[#111e46]/40 to-transparent" />

            {/* Copy */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={p.number}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: luxEase }}
                >
                  <span className="block font-playfair text-6xl lg:text-7xl leading-none text-[#cfc29f]">{p.number}</span>
                  <p className="mt-4 font-inter text-[11px] uppercase tracking-[0.3em] text-[#cfc29f]">{p.enTitle}</p>
                  <h3 className="mt-2 font-kanit font-normal text-3xl lg:text-4xl text-white">{p.title}</h3>
                  <p className="mt-3 max-w-xl font-sarabun text-base leading-relaxed text-white/80">{p.desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ---------------- Selectable principle cards ---------------- */}
          <Reveal as="ul" gap={0.08} className="lg:col-span-6 flex flex-col gap-3 lg:justify-between" >
            {philosophies.map((ph, i) => {
              const on = i === active;
              return (
                <motion.li key={ph.number} variants={fadeUp} className="lg:flex-1">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => pick(i)}
                    onFocus={() => setActive(i)}
                    className={`group relative flex h-full w-full items-center gap-5 overflow-hidden rounded-2xl border p-5 lg:p-6 text-left transition-[background-color,border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757] ${
                      on
                        ? "border-[#a28757] bg-white shadow-md"
                        : "border-[#a28757]/15 bg-white/50 hover:bg-white/80"
                    }`}
                  >
                    <span className={`font-playfair text-3xl lg:text-4xl leading-none transition-colors duration-300 ${on ? "text-[#a28757]" : "text-[#14171F]/25 group-hover:text-[#a28757]/60"}`}>
                      {ph.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-kanit text-lg lg:text-xl transition-colors ${on ? "text-[#14171F]" : "text-[#14171F]/60 group-hover:text-[#14171F]/85"}`}>
                        {ph.title}
                      </span>
                      <span className="mt-0.5 block font-inter text-[10px] uppercase tracking-[0.2em] text-[#14171F]/40">{ph.enTitle}</span>
                    </span>
                    <ArrowRight
                      className={`h-5 w-5 shrink-0 transition-[transform,color] duration-300 ${
                        on ? "translate-x-1 text-[#a28757]" : "text-[#14171F]/25 group-hover:translate-x-0.5 group-hover:text-[#a28757]/70"
                      }`}
                    />

                    {/* Gold progress bar (5s) — its end advances the showcase */}
                    {on && (
                      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-[#a28757]/12">
                        <span
                          key={`${ph.number}-${active}`}
                          className={`block h-full w-full origin-left bg-gradient-to-r from-[#cfc29f] to-[#a28757] ${reduce ? "" : "hero-dock-progress"}`}
                          style={{ animationDuration: `${SHOWCASE_S}s`, animationPlayState: paused ? "paused" : "running" }}
                          onAnimationEnd={next}
                        />
                      </span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

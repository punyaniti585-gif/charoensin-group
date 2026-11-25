"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { manifesto, manifestoStats } from "@/data/home-data";
import { useHomeCopy, useT } from "@/i18n";
import { CountUp, Reveal, fadeUp, luxEase } from "./motion";

const CYCLE_S = 3.2;

/**
 * Section 2 — เกี่ยวกับกลุ่มเจริญสิน (V.1 copy)
 * One-screen split; the cream card itself is the page Frame (V.3 proportions).
 * Left: a photo card cycling 4 stats every 3.2s — the next photo wipes in
 *   from the right (clip-path) while settling 1.05 → 1, a soft gold glare
 *   follows the pointer (CSS vars --x / --y), the big number slides up through a mask, and a
 *   gold progress line under the active 01–04 dot drives the timer (its CSS
 *   `animationend` advances). Pauses on hover / while off screen; dots are
 *   clickable.
 * Right: tag, title, the two paragraphs, a 3-item strengths band and the
 *   CTA, staggering in on enter. On desktop both columns share one height
 *   (items-stretch): the photo is 4:3 but may grow to the row height
 *   (flex-1 in a flex column) when the copy is taller, and the copy column is a flex
 *   column with justify-between — so both top edges and both bottom edges
 *   line up. transform + opacity only.
 * Copy follows the chosen language (src/i18n/home.ts).
 */
export default function ManifestoSection() {
  const reduce = useReducedMotion();
  const t = useHomeCopy().manifesto;
  const { t: tr } = useT();
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { amount: 0.35 });
  const paused = hovering || !inView || !!reduce;
  const s = manifestoStats[active];
  const statCopy = t.stats[active];
  const next = () => setActive((i) => (i + 1) % manifestoStats.length);

  // Reduced motion: no auto-cycle at all (dots still work)
  useEffect(() => {
    if (reduce) setActive(0);
  }, [reduce]);

  return (
    <section aria-labelledby="manifesto-title" className="relative bg-[#FAF8F3] py-10 sm:py-14 lg:py-16">
      <div className="home-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 lg:items-stretch">
          {/* ---------------- Left: stat showcase card ---------------- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-6 lg:flex lg:flex-col"
          >
            <div
              ref={cardRef}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onPointerMove={(e) => {
                // Gold glare follows the pointer: two CSS variables, no React render
                const el = e.currentTarget;
                const r = el.getBoundingClientRect();
                el.style.setProperty("--x", `${e.clientX - r.left}px`);
                el.style.setProperty("--y", `${e.clientY - r.top}px`);
              }}
              className="group relative mx-auto aspect-[4/3] w-full lg:flex-1 lg:max-w-[min(100%,calc((100svh-13rem)*4/3))] overflow-hidden rounded-3xl border border-[#a28757]/25 bg-[#111e46] shadow-lg"
            >
              {/* Photo swap: the new photo wipes in from the right (clip-path)
                  while settling 1.05 → 1; the old one holds underneath until
                  the wipe has covered it */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={s.image}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 0% 100%)", scale: 1.05, zIndex: 1 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 1, zIndex: 1 }}
                  exit={{ zIndex: 0, opacity: 1, transition: { duration: 0.9 } }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                >
                  <Image src={s.image} alt={tr(s.imageAlt)} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" style={{ objectPosition: s.position }} />
                </motion.div>
              </AnimatePresence>
              <div aria-hidden className="absolute inset-0 z-[1] bg-gradient-to-t from-[#111e46]/85 via-[#111e46]/25 to-transparent" />
              {/* Pointer glare (hover devices) — soft gold light at --x/--y */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100 bg-[radial-gradient(260px_circle_at_var(--x,50%)_var(--y,40%),rgba(229,199,120,0.26),rgba(229,199,120,0.08)_45%,transparent_70%)]"
              />

              {/* Bottom bar: dots + progress (left) · stat (right) */}
              <div className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-4 p-5 sm:p-7">
                <div role="tablist" aria-label={t.statsLabel} className="flex items-center gap-3 sm:gap-4">
                  {manifestoStats.map((st, i) => {
                    const on = i === active;
                    return (
                      <button
                        key={st.label}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-label={`${t.stats[i]?.label ?? st.label} ${st.value} ${t.stats[i]?.unit ?? st.unit}`}
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
                        <span className="ml-1.5 font-kanit text-xl md:text-2xl font-normal text-white/85">{statCopy.unit}</span>
                      </p>
                      <p className="mt-2 font-kanit text-sm md:text-base text-[#cfc29f]">{statCopy.label}</p>
                      <p className="mt-0.5 hidden sm:block font-sarabun text-xs text-white/65">{statCopy.note}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---------------- Right: copy · strengths · CTA ----------------
              Same height as the photo card on desktop: top block (tag →
              paragraphs) meets its top edge, bottom block (strengths + CTA)
              its bottom edge. */}
          <Reveal className="lg:col-span-6 flex flex-col gap-8 lg:justify-between">
            <div>
              <motion.p
                variants={fadeUp}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#a28757]/30 bg-white/60 px-4 py-1.5 font-inter text-[10.5px] font-medium uppercase tracking-[0.26em] text-[#a28757]"
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#a28757]" />
                {t.tag}
              </motion.p>
              <motion.h2
                id="manifesto-title"
                variants={fadeUp}
                className="mt-5 font-kanit font-normal text-3xl md:text-4xl leading-tight text-[#1C1F26]"
              >
                {t.title}
              </motion.h2>
              <motion.span variants={fadeUp} aria-hidden className="mt-5 block h-px w-16 bg-gradient-to-r from-[#a28757] to-transparent" />
              <div className="mt-5 space-y-4">
                <motion.p variants={fadeUp} className="font-sarabun text-base xl:text-[1.05rem] leading-relaxed text-[#1C1F26]/75">
                  {t.vision}
                </motion.p>
                <motion.p variants={fadeUp} className="font-sarabun text-[15px] xl:text-base leading-relaxed text-[#1C1F26]/60">
                  {t.story}
                </motion.p>
              </div>
            </div>

            <div>
              {/* Strengths band — 3 key figures between gold hairlines */}
              <motion.ul
                variants={fadeUp}
                className="grid grid-cols-3 border-y border-[#a28757]/25 divide-x divide-[#a28757]/25"
              >
                {t.strengths.map((it) => (
                  // Hover: cell brightens, a gold bar sweeps in along the top
                  // (scaleX), the figure deepens to dark gold
                  <li
                    key={it.value + it.label}
                    className="group relative overflow-hidden px-3 py-3.5 sm:px-4 transition-colors duration-500 hover:bg-white/80"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-[#a28757] via-[#cfb27a] to-[#a28757] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                    />
                    <p className="font-playfair text-3xl sm:text-[2.1rem] leading-none tabular-nums text-[#a28757] transition-colors duration-500 group-hover:text-[#6B5A3A]">
                      <CountUp value={Number(it.value)} pad={2} duration={1.4} />
                    </p>
                    <p className="mt-2 font-sarabun text-[13px] sm:text-sm leading-snug text-[#1C1F26]/70">{it.label}</p>
                  </li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp} className="mt-7">
                <Link
                  href={manifesto.cta.href}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c6538] to-[#b59a63] px-7 py-3.5 font-kanit text-[15px] text-white shadow-md transition-[box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757] focus-visible:ring-offset-2"
                >
                  {t.cta}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

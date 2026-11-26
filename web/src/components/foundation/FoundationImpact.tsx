"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Hospital, HouseHeart, Landmark, Plus, type LucideIcon } from "lucide-react";
import { foundationImpact, type PillarId } from "@/data/foundation-data";
import { useFoundationCopy } from "@/i18n";
import { CountUp, Reveal, fadeUp, luxEase } from "@/components/home/motion";

const ICONS: Record<PillarId, LucideIcon> = {
  school: GraduationCap,
  temple: Landmark,
  hospital: Hospital,
  care: HouseHeart,
};

const baht = (n: number) => n.toLocaleString("en-US");

/**
 * Core initiatives & impact (option B)
 *  • Navy stat band: 4 numbers count up once in view (rAF, textContent only).
 *  • Four pillar panels. The active one widens (desktop row) or opens
 *    (mobile stack) to show its photo, description and real donations.
 *    Hover, focus or tap selects. Panel size changes run through Framer
 *    Motion `layout` (FLIP = transform), so they stay on the compositor.
 */
export default function FoundationImpact() {
  const c = useFoundationCopy().impact;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(2); // hospital: the largest project
  const transition = reduce ? { duration: 0 } : { duration: 0.6, ease: luxEase };

  return (
    <section id="initiatives" aria-labelledby="foundation-impact-title" className="scroll-mt-24 bg-[#FAF8F3] py-14 sm:py-20 lg:py-24">
      <div className="home-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <motion.p variants={fadeUp} className="inline-flex items-center gap-3 font-inter text-[11px] font-medium uppercase tracking-[0.3em] text-[#a28757]">
              <span aria-hidden className="h-px w-8 bg-[#a28757]" />
              {c.eyebrow}
            </motion.p>
            <motion.h2 variants={fadeUp} id="foundation-impact-title" className="mt-5 font-kanit font-normal text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.2] tracking-tight text-[#111e46]">
              {c.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 font-sarabun text-base lg:text-lg leading-relaxed text-[#14171F]/65">
              {c.lead}
            </motion.p>
          </Reveal>
          <p className="font-sarabun text-sm text-[#14171F]/45">{c.hint}</p>
        </div>

        {/* Stats */}
        <Reveal as="dl" gap={0.08} className="mt-10 grid grid-cols-2 overflow-hidden rounded-[1.5rem] bg-[#111e46] lg:grid-cols-4">
          {foundationImpact.stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`flex flex-col gap-2 p-6 sm:p-8 ${i % 2 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t border-white/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
            >
              <dd className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-none text-[#C8A96A] tabular-nums">
                <CountUp value={s.value} suffix={s.suffix} duration={1.8} />
              </dd>
              <dt className="font-sarabun text-sm text-white/65">{c.stats[i]}</dt>
            </motion.div>
          ))}
        </Reveal>

        {/* Pillars */}
        <LayoutGroup>
          <div className="mt-4 flex flex-col gap-3 lg:h-[34rem] lg:flex-row" role="list">
            {foundationImpact.pillars.map((p, i) => {
              const open = i === active;
              const copy = c.pillars[i];
              const Icon = ICONS[p.id];
              return (
                <motion.div
                  key={p.id}
                  layout
                  transition={transition}
                  role="listitem"
                  onMouseEnter={() => setActive(i)}
                  className={`relative overflow-hidden rounded-[1.5rem] ${
                    open ? "min-h-[26rem] lg:min-h-0 lg:flex-[3.2]" : "min-h-[5.5rem] lg:min-h-0 lg:flex-1"
                  } ${open ? "bg-[#111e46] text-white" : "bg-white text-[#111e46] hover:bg-[#F1EADC]"} transition-colors duration-500`}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={open}
                    className="absolute inset-0 z-20 cursor-pointer rounded-[1.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C8A96A]"
                  >
                    <span className="sr-only">{copy?.name ?? p.name}</span>
                  </button>

                  {/* Photo (open panel only) */}
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        key="photo"
                        aria-hidden
                        initial={reduce ? false : { opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: luxEase }}
                        className="absolute inset-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111e46] via-[#111e46]/70 to-[#111e46]/50" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Header: number, icon, name */}
                  <motion.div layout="position" transition={transition} className="relative z-10 flex items-center gap-4 p-6 lg:p-7">
                    <span className={`font-playfair text-2xl tabular-nums ${open ? "text-[#C8A96A]" : "text-[#a28757]"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon className={`h-5 w-5 ${open ? "text-[#C8A96A]" : "text-[#a28757]"}`} aria-hidden />
                    <h3 className={`font-kanit font-normal text-lg leading-snug ${open ? "lg:text-2xl" : "lg:hidden"}`}>
                      {copy?.name ?? p.name}
                    </h3>
                    <Plus
                      aria-hidden
                      className={`ml-auto h-5 w-5 shrink-0 transition-transform duration-500 ${open ? "rotate-45 text-white/70" : "text-[#a28757]"}`}
                    />
                  </motion.div>

                  {/* Closed desktop panels: vertical name */}
                  {!open && (
                    <span aria-hidden className="pointer-events-none absolute bottom-7 left-7 hidden origin-bottom-left -rotate-90 translate-x-7 whitespace-nowrap font-kanit text-xl text-[#111e46]/80 lg:block">
                      {copy?.name ?? p.name}
                    </span>
                  )}

                  {/* Body (open panel) */}
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        key="body"
                        initial={reduce ? false : { opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: luxEase } }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        className="absolute inset-x-0 bottom-0 z-10 p-6 lg:p-8"
                      >
                        <p className="max-w-xl font-sarabun text-base leading-relaxed text-white/80">{copy?.desc ?? p.desc}</p>
                        {p.projects.length > 0 && (
                          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                            {p.projects.map((x, k) => (
                              <li key={k} className="rounded-2xl border border-white/15 bg-[#111e46]/50 p-4">
                                <p className="font-playfair text-2xl sm:text-3xl text-[#C8A96A] tabular-nums">
                                  {baht(x.amount)} <span className="font-sarabun text-sm text-white/60">{c.baht}</span>
                                </p>
                                <p className="mt-1 font-sarabun text-sm leading-snug text-white/85">{copy?.projects[k] ?? x.title}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

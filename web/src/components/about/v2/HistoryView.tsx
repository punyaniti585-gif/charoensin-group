"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { aboutV2Data, historyTimelineData } from "@/data/about-data";
import { useAboutCopy } from "@/i18n";
import type { AboutDict } from "@/i18n/about";
import { NAV_OFFSET, Reveal, SURFACE, SectionHeading } from "./ui";

/* ==========================================================================
   History — Sticky Scroll Timeline (2488 → …)
   --------------------------------------------------------------------------
   Desktop: a tall scroll track holds a pinned stage. Scroll progress picks
   the active milestone; the giant year behind the stage, the photo and the
   text card crossfade to it. Clicking a year on the rail scrolls there.
   Below lg the same milestones render as a plain stacked list (long Thai
   copy would not fit a pinned phone screen).
   ========================================================================== */

/** The same rows as the dictionary's timeline.steps (same filter, same order) */
const ROWS = historyTimelineData.rows.filter(
  (r) => r.type === "content" && /^\d+$/.test(r.yearNumber ?? "") && Number(r.yearNumber) >= aboutV2Data.timelineFrom,
);

/** Thai: Buddhist-era year as in the data; other languages: Gregorian */
const yearFor = (be: string, lang: string) => (lang === "th" ? be : String(Number(be) - 543));

function Visual({ row, alt, priority = false }: { row: (typeof ROWS)[number]; alt: string; priority?: boolean }) {
  const src = row.images[0] ?? row.logo;
  if (!src) return null;
  if (row.isLogo) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-white">
        <div className="relative h-1/2 w-2/3">
          <Image src={src} alt={alt} fill sizes="400px" className="object-contain" priority={priority} />
        </div>
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" priority={priority} />;
}

export default function HistoryView({ copy }: { copy: AboutDict["timeline"] }) {
  const { lang } = useAboutCopy();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = ROWS.length;

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(p * n)));
    setActive((prev) => (prev === i ? prev : i));
  });

  /** Scroll-linked parallax for the giant year: drifts up through each step */
  const yearY = useTransform(scrollYProgress, (p) => {
    if (reduce) return 0;
    const i = Math.min(n - 1, Math.floor(p * n));
    const local = Math.min(1, Math.max(0, p * n - i));
    return (0.5 - local) * 140;
  });

  const jumpTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const start = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - (window.innerHeight - NAV_OFFSET);
    window.scrollTo({ top: start + ((i + 0.5) / n) * run - NAV_OFFSET + 1, behavior: reduce ? "auto" : "smooth" });
  };

  const row = ROWS[active];
  const step = copy.steps[active];
  const year = yearFor(row.yearNumber ?? "", lang);

  return (
    <section id="sec-timeline" className={`${SURFACE} bg-white`}>
      {/* Mobile heading (desktop shows it inside the pinned frame) */}
      <div className="px-6 pb-2 pt-12 sm:px-10 lg:hidden">
        <SectionHeading kicker={copy.kicker} title={copy.title} />
      </div>

      {/* ---------- Desktop: pinned stage (fits one screen) ---------- */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${n * 80 + 20}vh` }}>
        <div className="sticky flex items-center overflow-hidden" style={{ top: NAV_OFFSET, height: `calc(100vh - ${NAV_OFFSET}px)` }}>
          {/* One frame: heading + photo + card + giant year + dot rail */}
          <div className="flex min-h-[calc(100vh-80px)] w-full flex-col justify-center gap-[3vh] px-16 pb-20 pt-6 xl:px-24">
            <SectionHeading kicker={copy.kicker} title={copy.title} />
            <div className="grid grid-cols-[1.05fr_1fr] items-center gap-12 xl:gap-16">
              {/* Photo */}
              <div className="relative h-[min(46vh,560px)] w-full overflow-hidden rounded-[24px] bg-[#FAF8F3] shadow-[0_30px_60px_-30px_rgba(17,30,70,0.45)]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={row.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Visual row={row} alt={step.title} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Text column: giant parallax year behind the card */}
              <div className="relative">
                <motion.div
                  aria-hidden
                  style={{ y: yearY }}
                  className="pointer-events-none absolute -right-6 -top-[30%] select-none will-change-transform xl:-right-10"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={year}
                      initial={{ opacity: 0, y: reduce ? 0 : 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduce ? 0 : -60 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="block font-playfair text-[clamp(9rem,16vw,16rem)] leading-[0.8] tracking-tight text-[#111e46]/[0.09]"
                    >
                      {year}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -16 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-[24px] border border-[#C8A96A]/30 bg-white/80 p-7 xl:p-9"
                  >
                    <span className="inline-block rounded-full bg-[#111e46] px-3.5 py-1 font-kanit text-sm text-[#C8A96A]">
                      {copy.eraLabel} {year}
                    </span>
                    <h3 className="mt-4 font-kanit text-2xl font-semibold text-[#111e46] xl:text-3xl">{step.title}</h3>
                    <p className="mt-3 font-sarabun text-[15px] leading-[1.8] text-[#111e46]/75 xl:text-base 2xl:text-[17px] [@media(max-height:780px)]:text-[14px]">
                      {step.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Dot rail */}
            <div className="relative pb-8">
              <div className="relative mx-[0.6rem] h-px bg-[#111e46]/15">
                <motion.div className="absolute inset-0 origin-left bg-[#C8A96A]" style={{ scaleX: scrollYProgress }} />
              </div>
              <ol className="absolute inset-x-0 -top-[0.45rem] flex justify-between">
                {ROWS.map((r, i) => (
                  <li key={r.id} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      aria-label={`${copy.eraLabel} ${yearFor(r.yearNumber ?? "", lang)}`}
                      className="group flex flex-col items-center gap-2"
                    >
                      <motion.span
                        initial={false}
                        animate={{ scale: i === active ? 1.35 : 1, opacity: i <= active ? 1 : 0.45 }}
                        transition={{ type: "spring", stiffness: 320, damping: 24 }}
                        className={`block h-[0.9rem] w-[0.9rem] rounded-full border-2 border-[#C8A96A] ${i <= active ? "bg-[#C8A96A]" : "bg-white"}`}
                      />
                      <span
                        className={`font-kanit text-sm transition-colors duration-300 ${
                          i === active ? "text-[#111e46]" : "text-[#111e46]/40 group-hover:text-[#111e46]/70"
                        }`}
                      >
                        {yearFor(r.yearNumber ?? "", lang)}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Mobile / tablet: stacked list ---------- */}
      <ol className="space-y-10 px-6 pb-24 pt-6 sm:px-10 lg:hidden">
        {ROWS.map((r, i) => {
          const y = yearFor(r.yearNumber ?? "", lang);
          return (
            <li key={r.id}>
              <Reveal>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[#FAF8F3]">
                  <Visual row={r} alt={copy.steps[i].title} />
                </div>
                <p className="mt-5 font-playfair text-4xl text-[#C8A96A]">{y}</p>
                <h3 className="mt-1 font-kanit text-xl font-semibold text-[#111e46]">{copy.steps[i].title}</h3>
                <p className="mt-3 font-sarabun text-base leading-[1.8] text-[#111e46]/75">{copy.steps[i].description}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

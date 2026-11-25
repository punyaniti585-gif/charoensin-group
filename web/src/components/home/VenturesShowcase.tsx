"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { ventures, type VentureVideo } from "@/data/ventures-data";
import { venturesCopy } from "@/data/home-data";
import { SectionHeading, luxEase } from "./motion";
import VideoModal from "./VideoModal";

const pad2 = (n: number) => String(n).padStart(2, "0");
const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Auto-play step and the hold after a manual pick */
const CYCLE_S = 5;
const HOLD_MS = 60_000;

/** Card contents: rise in with a 0.06s stagger (index = card order) */
const swapV: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.06, ease: luxEase } }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
};

/**
 * Section 5 — ธุรกิจที่ขับเคลื่อนอนาคต (Clean Bento Showcase, navy)
 *   [ hero image 2×2 ][ logo (white) ][ key figure ]
 *   [                ][ sister companies + ดูรายละเอียด  ]
 *
 * Auto-play: once the section is in view, it advances every 5s
 * (ADB → CPL → TTN → TWS → มูลนิธิ → …). The timer IS the gold progress bar
 * under the active tab (CSS scaleX; its `animationend` advances), so it costs
 * nothing per frame and pauses via animation-play-state.
 * Picking a tab jumps there and holds auto-play for 60s (timer restarts on
 * every pick); hovering the cards / an open video / off-screen also pause.
 * Switching: the card shells stay put; the hero photo cross-fades with a
 * gentle zoom (1.04 → 1, 0.55s) and each card's content rises in with a
 * 0.06s stagger. transform + opacity only.
 */
export default function VenturesShowcase() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [video, setVideo] = useState<VentureVideo | null>(null);
  const [hovering, setHovering] = useState(false);
  const [hold, setHold] = useState(false);
  /** Bumped when a hold ends so the progress bar restarts from 0 */
  const [cycle, setCycle] = useState(0);
  const holdTimer = useRef<number | undefined>(undefined);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const v = ventures[idx];

  const paused = hovering || hold || !inView || !!video || !!reduce;
  const next = useCallback(() => setIdx((i) => (i + 1) % ventures.length), []);

  const pick = (i: number) => {
    setIdx(i);
    setHold(true);
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      setHold(false);
      setCycle((c) => c + 1);
    }, HOLD_MS);
  };
  useEffect(() => () => window.clearTimeout(holdTimer.current), []);

  return (
    <section ref={sectionRef} aria-labelledby="ventures-title" className="relative bg-[#111e46] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_0%,rgba(162,135,87,0.18),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div id="ventures-title">
            <SectionHeading eyebrow={venturesCopy.eyebrow} title={venturesCopy.title} lead={venturesCopy.lead} dark />
          </div>

          {/* Organisation tabs — the active one carries the 5s gold timer */}
          <div role="tablist" aria-label="เลือกองค์กร" className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ventures.map((x, i) => {
              const on = i === idx;
              return (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="ventures-panel"
                  onClick={() => pick(i)}
                  className={`relative shrink-0 inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 font-kanit text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cfc29f] ${
                    on ? "border-[#a28757] bg-[#a28757] text-white" : "border-white/10 bg-white/[0.05] text-white/70 hover:border-[#cfc29f]/60 hover:text-white"
                  }`}
                >
                  <span className={`font-playfair ${on ? "text-white" : "text-[#cfc29f]"}`}>{pad2(i + 1)}</span>
                  {x.code === "CSR" ? "มูลนิธิ" : x.code}
                  {on && !reduce && (
                    <span aria-hidden className="absolute inset-x-3 bottom-[3px] h-[2px] overflow-hidden rounded-full bg-white/25">
                      {!hold && (
                        <span
                          key={`${idx}-${cycle}`}
                          className="hero-dock-progress absolute inset-0 origin-left rounded-full bg-[#f3e3b5]"
                          style={{ animationDuration: `${CYCLE_S}s`, animationPlayState: paused ? "paused" : "running" }}
                          onAnimationEnd={next}
                        />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento — shells stay put, contents swap */}
        <div
          id="ventures-panel"
          role="tabpanel"
          aria-live="polite"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="mt-10 grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 sm:gap-4 lg:h-[34rem]"
        >
          {/* Hero image (2×2) */}
          <article className="group/hero relative col-span-2 lg:row-span-2 min-h-[18rem] overflow-hidden rounded-2xl border border-[#a28757]/20 bg-white/[0.05] shadow-md">
            <AnimatePresence initial={false}>
              <motion.div
                key={v.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: luxEase }}
              >
                <Image src={v.heroImage} alt={v.nameTh} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover/hero:scale-[1.03]" />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,16,40,0.88),rgba(10,16,40,0.2)_55%,rgba(10,16,40,0))]" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={v.id}
                custom={0}
                variants={swapV}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7"
              >
                <div className="min-w-0">
                  <p className="font-inter text-[10px] uppercase tracking-[0.24em] text-[#cfc29f]">
                    {pad2(idx + 1)} / {pad2(ventures.length)} · {v.nameEn}
                  </p>
                  <h3 className="mt-2 font-kanit font-normal text-3xl sm:text-4xl leading-tight">{v.nameTh}</h3>
                  <p className="mt-2 max-w-md font-sarabun text-sm text-white/75 line-clamp-2">{v.tagline}</p>
                </div>
                {v.video && (
                  <button
                    type="button"
                    onClick={() => setVideo(v.video)}
                    aria-label={`เล่นวิดีโอ ${v.nameTh}`}
                    className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-full border border-[#cfc29f]/70 text-white transition-colors hover:bg-[#a28757] hover:border-[#a28757]"
                  >
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </article>

          {/* Logo on clean white */}
          <article className="relative min-h-[10rem] overflow-hidden rounded-2xl bg-white p-6 text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={v.id}
                custom={1}
                variants={swapV}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex h-full flex-col items-center justify-center gap-3"
              >
                <div className="relative h-16 w-[75%]">
                  <Image src={v.logo} alt={`โลโก้ ${v.nameTh}`} fill sizes="240px" className="object-contain" />
                </div>
                <p className="font-kanit text-sm text-[#14171F]/70">{v.nameTh}</p>
              </motion.div>
            </AnimatePresence>
          </article>

          {/* Key figure + strength */}
          <article className="relative min-h-[10rem] overflow-hidden rounded-2xl bg-gradient-to-br from-[#a28757] to-[#7d6640] p-5 sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={v.id}
                custom={2}
                variants={swapV}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex h-full flex-col justify-between gap-3"
              >
                <p className="font-inter text-[10px] uppercase tracking-[0.22em] text-white/80">{v.fact.label}</p>
                <p className="font-inter font-extralight text-5xl leading-none">
                  {v.fact.value}
                  {v.fact.unit && <small className="ml-1.5 font-kanit font-light text-base text-white/85">{v.fact.unit}</small>}
                </p>
                <p className="font-kanit text-sm leading-snug text-white/90">{v.highlight}</p>
              </motion.div>
            </AnimatePresence>
          </article>

          {/* Sister companies + detail */}
          <article className="relative col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={v.id}
                custom={3}
                variants={swapV}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex h-full flex-col justify-between gap-5"
              >
                <div>
                  <p className="font-inter text-[10px] uppercase tracking-[0.22em] text-[#cfc29f]">{v.list.title}</p>
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 font-sarabun text-sm text-white/80">
                    {v.list.items.slice(0, 6).map((it) => (
                      <li key={it.name} className="relative pl-3.5 before:absolute before:left-0 before:top-[0.65em] before:h-px before:w-1.5 before:bg-[#cfc29f]">
                        {it.name}
                      </li>
                    ))}
                    {v.list.items.length > 6 && <li className="pl-3.5 text-white/50">และอีก {v.list.items.length - 6} บริษัท</li>}
                  </ul>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <p className="font-sarabun text-xs text-white/50 line-clamp-1">{v.group.label} · {v.group.name}</p>
                  <a
                    href={v.href}
                    {...(isExternal(v.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-kanit text-sm text-[#14171F] transition-colors hover:bg-[#cfc29f]"
                  >
                    ดูรายละเอียด
                    {isExternal(v.href) ? (
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    ) : (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </article>
        </div>
      </div>

      <VideoModal video={video} onClose={() => setVideo(null)} />
    </section>
  );
}

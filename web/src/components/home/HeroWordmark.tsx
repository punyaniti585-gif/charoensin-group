"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { heroCopy } from "./hero-data";
import { useHomeCopy, useT } from "@/i18n";

/* ==========================================================================
   Hero wordmark (V.3) — italic kicker "Trusted. Established. Future-Focused."
   over the giant serif "Charoensin", bottom-left of the frame, straight on
   the photo (the frame's scrim keeps it legible — no box behind it).

   • Per-character staggered mask reveal: every letter sits in its own
     overflow-hidden inline-block and rises y 105% → 0 (0.045s apart).
     transform + opacity only.
   • The gold light sweep stays ONE continuous band across the split letters:
     each letter paints the same 2×word-wide gradient, offset by its own x
     (--gx) inside the word (--gw), both measured on mount/resize.
   • Timing follows the CSS intro: the reveal starts ~1.9s after first paint
     (time already elapsed before hydration is subtracted), and the whole
     component remounts — so it replays — on every load / bfcache restore.
   ========================================================================== */

const REVEAL_AT = 1.9; // s after first paint (frame has opened by then)
const EASE = [0.22, 1, 0.36, 1] as const;

const scriptV: Variants = {
  hidden: { y: 12, opacity: 0 },
  show: (d: number) => ({ y: 0, opacity: 1, transition: { duration: 0.6, delay: d, ease: EASE } }),
};
const charV: Variants = {
  hidden: { y: "105%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.55, ease: EASE } },
};

export default function HeroWordmark({ replay, reduce }: { replay: boolean; reduce: boolean }) {
  // Seconds until the reveal should start (client-side, at mount)
  const [delay] = useState(() => {
    if (replay || typeof performance === "undefined") return REVEAL_AT;
    return Math.max(0.15, REVEAL_AT - performance.now() / 1000);
  });
  const wordRef = useRef<HTMLSpanElement>(null);
  // zh-CN / zh-TW show the Chinese name 陳振誠集團; other languages "Charoensin"
  const display = useHomeCopy().hero.display;
  const { t } = useT();
  const chars = Array.from(display);

  // Measure word width + each letter's x for the continuous gold sweep
  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    const measure = () => {
      word.style.setProperty("--gw", `${word.offsetWidth}px`);
      word.querySelectorAll<HTMLElement>("[data-ch]").forEach((el) => {
        (el.firstElementChild as HTMLElement).style.setProperty("--gx", `${el.offsetLeft}px`);
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(word);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [display]);

  return (
    <div className="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-12 sm:pb-12">
      <h1 className="relative w-fit max-w-full text-left">
        <span className="sr-only">{display === heroCopy.display ? t(heroCopy.displaySr) : display}</span>

        <motion.span
          aria-hidden
          custom={delay}
          variants={scriptV}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="block mb-2.5 font-playfair italic font-normal text-lg sm:text-xl leading-snug text-[#E6C786] will-change-transform"
        >
          {heroCopy.script}
        </motion.span>

        {/* V.3 size: 14.5vw on phones, 10.5vw from 640px */}
        <motion.span
          ref={wordRef}
          aria-hidden
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
          className="relative block whitespace-nowrap font-playfair font-normal leading-[0.86] tracking-[-0.025em] [font-kerning:none] text-[14.5vw] sm:text-[10.5vw]"
        >
          {chars.map((c, i) => (
            <span key={`${display}-${i}`} data-ch className="inline-block overflow-hidden align-bottom pt-[0.12em] pb-[0.1em] -mt-[0.12em]">
              <motion.span variants={charV} className="hero-gold-char inline-block will-change-transform">
                {c}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </h1>
    </div>
  );
}

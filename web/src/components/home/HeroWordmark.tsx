"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { heroCopy } from "./hero-data";

/* ==========================================================================
   Hero wordmark — "80th Anniversary • Since 1946" + CHAROENSIN on a smoked
   glass frame, bottom-centre of the hero.

   • Per-character staggered mask reveal: every letter sits in its own
     overflow-hidden inline-block and rises y 105% → 0 (0.045s apart).
     transform + opacity only.
   • The gold light sweep stays ONE continuous band across the split letters:
     each letter paints the same 2×word-wide gradient, offset by its own x
     (--gx) inside the word (--gw), both measured on mount/resize.
   • Timing follows the CSS intro: the reveal starts ~1.9s after first paint
     (time already elapsed before hydration is subtracted), and the whole
     component remounts — so it replays — on every load / bfcache restore.
   • The frame's backdrop blur is only applied while the hero is at rest
     (.hero-still on the Act-1 layer), never while scrolling.
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
  const chars = heroCopy.display.split("");

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
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-[clamp(0.75rem,3.5vh,2.5rem)] flex justify-center px-[3vw]">
      <h1
        className="hero-smoke hero-fade relative mx-auto w-fit max-w-[94vw] text-center rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#1C1F26]/28 via-[#1C1F26]/42 to-[#1C1F26]/50 border border-[#cfc29f]/30 px-6 py-3.5 md:px-10 md:py-5 shadow-[0_14px_40px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.18)]"
        style={{ animationDelay: "1.6s" }}
      >
        <span className="sr-only">{heroCopy.displaySr}</span>

        <motion.span
          aria-hidden
          custom={delay}
          variants={scriptV}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="block mb-[clamp(0.15rem,0.8vh,0.6rem)] font-playfair italic font-normal normal-case tracking-[0.04em] text-[clamp(0.85rem,1.5vw,1.35rem)] text-[#E6C786] will-change-transform"
        >
          {heroCopy.script}
        </motion.span>

        {/* Font size: the word (≈6.6em wide) fills the frame's inner width at
            any viewport — 94vw minus the frame's horizontal padding. */}
        <motion.span
          ref={wordRef}
          aria-hidden
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
          className="relative block whitespace-nowrap font-playfair font-normal uppercase leading-[0.82] tracking-[0.02em] [font-kerning:none] text-[calc((94vw_-_3rem_-_2px)/6.7)] md:text-[calc((94vw_-_5rem_-_2px)/6.7)]"
        >
          {chars.map((c, i) => (
            <span key={i} data-ch className="inline-block overflow-hidden align-bottom">
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

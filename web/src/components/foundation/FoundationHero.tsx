"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { foundationHero, foundationLogo, foundationPhotos } from "@/data/foundation-data";
import { useFoundationCopy } from "@/i18n";
import { luxEase } from "@/components/home/motion";

/**
 * Foundation hero (option B) — one navy card filling the first screen.
 *  • Real photo full-bleed with a slow Ken Burns: it settles 1.12 → 1.04 on
 *    load, then drifts with the pointer and scrolls slower than the page.
 *  • Title words rise through masks one after another; the gold accent line
 *    follows.
 *  • The foundation logo floats in a white seed-shaped badge.
 * transform + opacity only; reduced motion shows everything static.
 */
export default function FoundationHero() {
  const c = useFoundationCopy().hero;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Scroll: photo moves slower than the card, copy lifts and fades out
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const copyO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pointer drift on the photo (springy, a few px)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });

  const word = (i: number) => ({
    initial: reduce ? false : { y: "110%" },
    animate: { y: "0%" },
    transition: { duration: 1, delay: 0.25 + i * 0.14, ease: luxEase },
  });

  return (
    <section
      ref={ref}
      aria-labelledby="foundation-hero-title"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width - 0.5) * -24);
        py.set(((e.clientY - r.top) / r.height - 0.5) * -16);
      }}
      className="relative isolate flex min-h-[calc(100svh-6.5rem)] flex-col overflow-hidden rounded-[1.75rem] bg-[#111e46] text-[#FAF8F3]"
    >
      {/* Photo */}
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={reduce ? undefined : { y: photoY }}>
        <motion.div className="absolute -inset-[4%]" style={reduce ? undefined : { x: sx, y: sy }}>
          <motion.img
            src={foundationPhotos.school}
            alt=""
            initial={reduce ? false : { scale: 1.12, opacity: 0 }}
            animate={{ scale: 1.04, opacity: 1 }}
            transition={{ duration: 2.4, ease: luxEase }}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </motion.div>
      {/* Navy wash so the copy always reads */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#111e46] via-[#111e46]/70 to-[#111e46]/30" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#111e46]/80 via-[#111e46]/20 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#111e46]/70 to-transparent" />

      <motion.div
        style={reduce ? undefined : { y: copyY, opacity: copyO }}
        className="home-shell relative flex flex-1 flex-col justify-between gap-10 py-8 sm:py-10 lg:py-12"
      >
        {/* Top row: logo badge + eyebrow */}
        <div className="flex items-start justify-between gap-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: luxEase }}
            className="flex items-center gap-4"
          >
            <motion.span
              animate={reduce ? undefined : { y: [0, -6, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative block h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foundationLogo} alt={c.name} className="absolute inset-0 h-full w-full scale-[1.9] object-contain translate-y-[6%]" />
            </motion.span>
            <span className="leading-tight">
              <span className="block font-kanit text-base sm:text-lg text-white">{c.name}</span>
              <span className="block font-sarabun text-sm text-white/60">{c.under}</span>
            </span>
          </motion.div>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hidden md:block font-inter text-[11px] uppercase tracking-[0.3em] text-[#C8A96A]"
          >
            {c.eyebrow}
          </motion.p>
        </div>

        {/* Title block */}
        <div className="max-w-5xl">
          <h1 id="foundation-hero-title" className="font-kanit font-normal leading-[1.02] tracking-tight text-[clamp(3rem,9vw,8.5rem)]">
            {c.title.map((w, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0">
                <motion.span className="inline-block" {...word(i)}>
                  {w}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span
                className="inline-block font-playfair italic text-[#C8A96A] text-[0.55em]"
                {...word(c.title.length)}
              >
                {c.accent}
              </motion.span>
            </span>
          </h1>
        </div>

        {/* Bottom row: quote + badges + CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: luxEase }}
          className="grid gap-6 border-t border-white/15 pt-6 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-10">
            <p className="max-w-md font-sarabun text-base sm:text-lg leading-relaxed text-white/80">“{c.quote}”</p>
            <dl className="flex gap-8">
              {foundationHero.badges.map((b, i) => (
                <div key={b.value}>
                  <dt className="sr-only">{c.badges[i]?.label}</dt>
                  <dd className="font-playfair text-3xl sm:text-4xl text-white tabular-nums">{b.value}</dd>
                  <dd className="mt-1 font-sarabun text-xs text-white/55">{c.badges[i]?.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#initiatives"
              className="group inline-flex items-center gap-2 rounded-full bg-[#C8A96A] px-6 py-3 font-kanit text-[15px] text-[#111e46] transition-colors hover:bg-[#d8bd85]"
            >
              {c.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#about" aria-label={c.scroll} className="grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white/80 hover:border-white/60">
              <motion.span animate={reduce ? undefined : { y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                <ArrowDown className="h-4 w-4" />
              </motion.span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

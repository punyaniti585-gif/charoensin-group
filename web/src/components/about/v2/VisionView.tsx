"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ChevronDown, Download, Handshake, Leaf, Scale, ShieldCheck, Users } from "lucide-react";
import { aboutV2Data, coreValuesData, visionAndMissionData } from "@/data/about-data";
import { csgEase } from "@/components/ui/MotionWrapper";
import type { AboutDict } from "@/i18n/about";
import MissionWheel from "./MissionWheel";
import { FIT, MaskedTitle, NAV_OFFSET, Reveal, SURFACE, STACK_GAP, SectionHeading } from "./ui";

/* View 2 — Vision (S2), Mission wheel (S3), Core values (S4), Code of conduct (S5).
   Every section is a full-bleed rounded surface (SURFACE) that fits one
   screen on desktop (FIT), with alternating background tones. */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- Pointer parallax ----------------
   Normalised pointer position over the section (-0.5…0.5), smoothed by a
   spring. Only on fine pointers (mouse / trackpad) and when reduced motion
   is off; elsewhere the values stay at 0. */
function usePointerParallax(ref: React.RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.7 });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      if (!last || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((last.clientX - r.left) / r.width - 0.5);
      my.set((last.clientY - r.top) / r.height - 0.5);
    };
    const move = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const leave = () => {
      last = null;
      mx.set(0);
      my.set(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, reduce, mx, my]);

  return { sx, sy };
}

const useLayer = (v: MotionValue<number>, px: number) => useTransform(v, (n) => n * px);

/* ---------------- S2 · Vision ----------------
   Left: cut-out executives rising out of an arch, small "AI image" badge.
   Right: short gold rule + VISION, big title, gold divider, vision text.
   Entrance (staggered): arch backdrop → figure (y 28→0, scale .97→1,
   opacity 0→1) → badge → right-hand copy. Then pointer parallax: the figure
   follows the pointer (±12px), the arch half as much, the copy drifts the
   opposite way (±8px). */
function Vision({ copy }: { copy: AboutDict["vision"] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { sx, sy } = usePointerParallax(ref);
  const figX = useLayer(sx, 24);
  const figY = useLayer(sy, 12);
  const archX = useLayer(sx, 12);
  const archY = useLayer(sy, 6);
  const txtX = useLayer(sx, -16);
  const txtY = useLayer(sy, -8);

  const cutout = aboutV2Data.visionCutout;
  const d = (n: number) => (reduce ? 0 : n);
  const backdrop: Variants = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE } },
  };
  const figure: Variants = {
    hidden: { opacity: 0, y: d(28), scale: reduce ? 1 : 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, delay: d(0.35), ease: EASE } },
  };
  const fadeUp = (delay: number): Variants => ({
    hidden: { opacity: 0, y: d(20) },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: d(delay), ease: EASE } },
  });
  const rule = (delay: number): Variants => ({
    hidden: { opacity: 0, scaleX: reduce ? 1 : 0 },
    show: { opacity: 1, scaleX: 1, transition: { duration: 0.8, delay: d(delay), ease: EASE } },
  });

  const toMission = () => {
    const el = document.getElementById("sec-mission");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <motion.section
      ref={ref}
      id="sec-vision"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      className={`${SURFACE} ${FIT} flex flex-col bg-[#FAF8F3] px-6 pt-12 sm:px-10 lg:px-16 lg:pb-36 lg:pt-8 xl:px-24`}
    >
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        {/* ---- Left: arch + figure (max 58vh tall) ---- */}
        <div className="relative mx-auto aspect-[760/823] w-full max-w-[420px] lg:w-[min(100%,53.5vh)] lg:max-w-[600px]">
          <motion.div style={{ x: archX, y: archY }} className="absolute inset-0 will-change-transform" aria-hidden>
            <motion.div variants={backdrop} className="absolute inset-x-[1.5%] bottom-0 top-[30.5%] origin-bottom">
              <div className="absolute inset-0 rounded-t-full bg-[#EFE4CC]/70" />
              <div className="absolute -inset-2.5 rounded-t-full border border-[#C8A96A]/45 sm:-inset-3.5" />
            </motion.div>
          </motion.div>

          <motion.div style={{ x: figX, y: figY }} className="absolute inset-0 will-change-transform">
            <motion.div variants={figure} className="absolute inset-0 origin-bottom">
              {cutout ? (
                <Image src={cutout} alt={copy.imageAlt} fill priority sizes="(min-width: 1024px) 560px, 90vw" className="object-contain object-bottom" />
              ) : (
                <div className="absolute inset-x-[3%] bottom-0 top-[34%] overflow-hidden rounded-t-full bg-[#111e46]">
                  <Image
                    src={visionAndMissionData.vision.image}
                    alt={copy.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 560px, 90vw"
                    className="object-cover"
                    style={{ objectPosition: aboutV2Data.visionFocus }}
                  />
                </div>
              )}
            </motion.div>
            <motion.span
              variants={fadeUp(0.8)}
              className="absolute right-0 top-[31%] z-10 rounded-full bg-[#111e46]/90 px-3 py-1 font-kanit text-[11px] tracking-wide text-[#E4CC94] sm:text-xs"
            >
              {copy.aiBadge}
            </motion.span>
          </motion.div>
        </div>

        {/* ---- Right: copy (drifts opposite to the pointer) ---- */}
        <motion.div style={{ x: txtX, y: txtY }} className="max-w-xl will-change-transform lg:max-w-none">
          <motion.div variants={fadeUp(0.55)} className="flex items-center gap-4">
            <motion.span variants={rule(0.6)} className="h-px w-12 origin-left bg-[#C8A96A]" aria-hidden />
            <span className="font-kanit text-sm font-medium uppercase tracking-[0.42em] text-[#C8A96A]">{copy.eyebrow}</span>
          </motion.div>
          <h2 className="mt-5 font-kanit text-5xl font-semibold leading-tight tracking-tight text-[#111e46] sm:text-6xl lg:text-[4.25rem]">
            <MaskedTitle delay={0.68}>{copy.title}</MaskedTitle>
          </h2>
          <motion.span variants={rule(0.82)} className="mt-7 block h-[2px] w-24 origin-left bg-[#C8A96A]" aria-hidden />
          <motion.p
            variants={fadeUp(0.92)}
            className="mt-7 font-kanit text-xl font-light leading-[1.75] text-[#111e46]/85 sm:text-2xl lg:text-[1.6rem]"
          >
            {copy.lead}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll cue → mission (desktop; sits above the pill zone) */}
      <motion.button
        type="button"
        variants={fadeUp(1.1)}
        onClick={toMission}
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-kanit text-sm tracking-[0.2em] text-[#111e46]/60 transition-colors hover:text-[#111e46] lg:flex"
      >
        <span className="relative block h-8 w-px overflow-hidden bg-[#C8A96A]/30" aria-hidden>
          <motion.span
            className="absolute inset-x-0 top-0 block h-1/2 bg-[#C8A96A]"
            animate={reduce ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        {copy.scrollCue}
        <ChevronDown className="h-4 w-4" />
      </motion.button>
    </motion.section>
  );
}

/* ---------------- S4 · Core values ---------------- */
function Values({ copy }: { copy: AboutDict["values"] }) {
  const reduce = useReducedMotion();
  return (
    <section id="sec-values" className={`${SURFACE} ${FIT} flex items-center bg-[#FFFDF8] px-6 pt-12 sm:px-10 lg:px-16 lg:pt-10 xl:px-24`}>
      <div className="grid w-full gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14 xl:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#111e46] lg:aspect-auto lg:h-[min(60vh,620px)]">
            {/* Ambient motion: slow drift of the photo + a gold light sweeping across */}
            <motion.div
              className="absolute -inset-[6%] will-change-transform"
              animate={reduce ? undefined : { x: ["-1.5%", "1.5%", "-1.5%"], y: ["1%", "-1%", "1%"], scale: [1.02, 1.06, 1.02] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src={coreValuesData.oldPhoto} alt={copy.photoCaption} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </motion.div>
            <motion.div
              aria-hidden
              className="absolute -left-1/2 top-0 h-full w-[120%] bg-[radial-gradient(closest-side,rgba(200,169,106,0.35),rgba(200,169,106,0))] will-change-transform"
              animate={reduce ? undefined : { x: ["-10%", "70%", "-10%"], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(17,30,70,0.85),rgba(17,30,70,0))] p-5 pt-16">
              <p className="font-sarabun text-sm text-white/80">{copy.photoCaption}</p>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center">
          <SectionHeading number={copy.number} kicker={copy.kicker} title={copy.title}>
            {copy.subtitle}
          </SectionHeading>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:gap-4 [@media(max-height:800px)]:mt-5">
            {copy.items.map((v, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <motion.article
                  whileHover={reduce ? undefined : { y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group relative h-full rounded-[20px] border border-[#111e46]/10 bg-white p-5 [@media(max-height:800px)]:p-4"
                >
                  {/* Hover shadow as its own layer: only its opacity animates */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 shadow-[0_28px_50px_-24px_rgba(17,30,70,0.45)] transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="flex items-baseline gap-3">
                    <span className="font-playfair text-3xl text-[#C8A96A]">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-kanit text-lg font-semibold text-[#111e46]">{v.title}</h3>
                      <p className="font-kanit text-[11px] uppercase tracking-[0.22em] text-[#111e46]/45">{v.titleEn}</p>
                    </div>
                  </div>
                  <p className="mt-2.5 font-sarabun text-[15px] leading-relaxed text-[#111e46]/70 [@media(max-height:800px)]:mt-1.5 [@media(max-height:800px)]:text-sm">{v.description}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- S5 · Code of conduct ---------------- */
const CONDUCT_ICONS = { scale: Scale, shield: ShieldCheck, handshake: Handshake, users: Users, leaf: Leaf } as const;

function Conduct({ copy }: { copy: AboutDict["conduct"] }) {
  const reduce = useReducedMotion();
  return (
    <section id="sec-conduct" className={`${SURFACE} ${FIT} flex items-center bg-[#111e46] px-6 pt-12 text-white sm:px-10 lg:px-16 lg:pt-10 xl:px-24`}>
      {/* Moving light (radial gradients moved with transform + opacity; no blur) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 -top-1/2 h-[140%] w-[70%] bg-[radial-gradient(closest-side,rgba(200,169,106,0.28),rgba(200,169,106,0))] will-change-transform"
        animate={reduce ? undefined : { x: ["0%", "60%", "0%"], y: ["0%", "15%", "0%"], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/2 -right-1/4 h-[120%] w-[60%] bg-[radial-gradient(closest-side,rgba(120,140,210,0.22),rgba(120,140,210,0))] will-change-transform"
        animate={reduce ? undefined : { x: ["0%", "-50%", "0%"], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative grid w-full gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <motion.div
              initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: csgEase }}
              className="grid h-20 w-20 place-items-center rounded-full border border-[#C8A96A]/60 sm:h-24 sm:w-24"
            >
              <span className="font-playfair text-4xl tracking-tight text-[#C8A96A] sm:text-5xl">CS</span>
            </motion.div>
          </Reveal>
          <div className="mt-6">
            <SectionHeading kicker={copy.eyebrow} title={copy.title} tone="dark">
              <p className="font-kanit text-sm uppercase tracking-[0.18em] text-[#C8A96A]">{copy.titleEn}</p>
              <p className="mt-4">{copy.description}</p>
            </SectionHeading>
          </div>
          <Reveal delay={0.2}>
            <a
              href={coreValuesData.codeOfConduct.externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[#C8A96A] px-6 py-3.5 font-kanit text-[15px] text-[#111e46] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              {copy.linkText}
            </a>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <p className="font-kanit text-sm uppercase tracking-[0.24em] text-white/60">{copy.principlesTitle}</p>
          </Reveal>
          <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
            {aboutV2Data.conductPrinciples.map((p, i) => {
              const Icon = CONDUCT_ICONS[p.icon];
              const t = copy.principles[i];
              return (
                <li key={p.id}>
                  <Reveal delay={0.07 * i} y={16} className="flex gap-5 py-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#C8A96A]/50 text-[#C8A96A]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-kanit text-lg text-white">{t.title}</h3>
                      <p className="mt-0.5 font-sarabun text-[15px] leading-relaxed text-white/70">{t.text}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function VisionView({ copy }: { copy: AboutDict }) {
  return (
    <div className={`flex flex-col ${STACK_GAP}`}>
      <Vision copy={copy.vision} />
      <MissionWheel copy={copy.mission} />
      <Values copy={copy.values} />
      <Conduct copy={copy.conduct} />
    </div>
  );
}

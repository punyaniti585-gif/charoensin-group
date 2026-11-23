"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { aboutHeroData } from "@/data/about-data";
import {
  ArrowUpRight,
  Compass,
  Shield,
  Award,
  Users,
  Landmark,
  ChevronDown,
} from "lucide-react";

// Architectural Luxury easing for typography reveals
const revealEase = [0.22, 1, 0.36, 1] as const;

const SHIMMER_PHRASE = "90 ปี";

// Per-phrase mask box; padding keeps Thai upper/lower marks from being clipped
const PHRASE_MASK_CLASS =
  "inline-block overflow-hidden align-bottom pt-[0.18em] pb-[0.12em] -my-[0.15em]";

interface HeroTypographyProps {
  variant: "mobile" | "desktop";
  reduceMotion: boolean;
  /**
   * Desktop ink. "light" = white + drop-shadow (over the colour photo),
   * "dark" = bronze ink (over the cream base). AboutHero stacks both and
   * crossfades them with opacity only, so scrolling never repaints the text.
   */
  ink?: "light" | "dark";
  /** Decorative duplicate layer: no heading semantics, hidden from AT */
  decorative?: boolean;
}

/**
 * Hero headline + gold divider + subheadline.
 * - Masked slide-up reveal for each headline phrase (stagger 0.15s)
 * - Gold hairline expands from the centre, then subheadline fades in (0.45s)
 * - Slow gold shimmer across "90 ปี"
 */
function HeroTypography({
  variant,
  reduceMotion,
  ink = "light",
  decorative = false,
}: HeroTypographyProps) {
  const isDesktop = variant === "desktop";
  const phrases = aboutHeroData.headline.split(" ");
  const [subBefore, subAfter] = aboutHeroData.subheadline.split(SHIMMER_PHRASE);
  const hasShimmer = subAfter !== undefined;

  const headlineType = isDesktop
    ? "text-4xl md:text-6xl lg:text-7xl font-bold font-kanit tracking-tight leading-[1.18]"
    : "text-2xl xs:text-3xl font-bold font-kanit tracking-tight leading-snug";

  const dark = isDesktop && ink === "dark";

  const headlineClass = !isDesktop
    ? `${headlineType} text-[#1F1F1F]`
    : dark
    ? `${headlineType} text-[#2B2418] drop-shadow-[0_1px_10px_rgba(255,250,240,0.7)]`
    : `${headlineType} text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]`;

  const subBase = "text-base md:text-xl font-kanit font-normal max-w-2xl leading-relaxed";
  const subClass = !isDesktop
    ? "text-sm xs:text-base text-[#6B5A3A] font-kanit font-normal leading-relaxed max-w-md mx-auto"
    : dark
    ? `${subBase} text-[#6B5A3A] drop-shadow-[0_1px_10px_rgba(255,250,240,0.7)]`
    : `${subBase} text-[#F7F1E7] drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] drop-shadow-[0_3px_16px_rgba(0,0,0,0.8)]`;

  const Heading = decorative ? motion.div : motion.h1;

  return (
    <>
      <div className={isDesktop ? "max-w-5xl" : undefined}>
        <Heading
          className={headlineClass}
          aria-label={decorative ? undefined : aboutHeroData.headline}
        >
          {phrases.map((phrase, i) => (
            <React.Fragment key={phrase}>
              {/* Mask: padding keeps Thai upper/lower marks from being clipped */}
              <span aria-hidden="true" className={PHRASE_MASK_CLASS}>
                <motion.span
                  className="inline-block"
                  initial={reduceMotion ? false : { y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.1 + i * 0.15,
                    ease: revealEase,
                  }}
                >
                  {phrase}
                </motion.span>
              </span>
              {i < phrases.length - 1 && " "}
            </React.Fragment>
          ))}
        </Heading>
      </div>

      {/* Gold hairline divider — expands from the centre */}
      <motion.div
        aria-hidden="true"
        className="h-[1.5px] w-24 bg-[#CCA369] mx-auto my-4 origin-center"
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: revealEase }}
      />

      <motion.p
        className={subClass}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: revealEase }}
      >
        {hasShimmer ? (
          <>
            {subBefore}
            <span
              className={`text-gold-shimmer inline-block whitespace-nowrap ${
                // light desktop ink uses the CSS default base (#F7F1E7)
                isDesktop && !dark ? "" : "[--shimmer-base:#6B5A3A]"
              }`}
            >
              {SHIMMER_PHRASE}
            </span>
            {subAfter}
          </>
        ) : (
          aboutHeroData.subheadline
        )}
      </motion.p>
    </>
  );
}

export default function AboutHero() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [showFloatingDock, setShowFloatingDock] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const mobileHeroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMounted(true);

    // Floating dock stays hidden while the Hero (and its 5 jump cards) is still on
    // screen; it slides in once the Hero has scrolled past and the Vision
    // section (#vision, directly below) takes over the viewport.
    // Measured at most once per animation frame (rAF-throttled)
    let frame = 0;
    const updateDock = () => {
      frame = 0;
      const hero =
        heroRef.current && heroRef.current.offsetHeight > 0
          ? heroRef.current
          : mobileHeroRef.current;
      if (!hero) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      setShowFloatingDock(heroBottom <= window.innerHeight * 0.75);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateDock);
    };

    updateDock();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // useScroll linked to the 200vh hero section for Desktop Circular Mask Reveal
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // Circular reveal, compositor-only: a round window (300vmax, rounded-full,
  // overflow-hidden) scales 0 → 1 while the photo inside is counter-scaled
  // 1/s, so the photo stays put and only `transform` changes per frame
  // (an animated clip-path would repaint the full-screen photo every frame).
  const revealScale = useTransform(scrollYProgress, [0, 0.75], [0, 1]);
  const revealInverse = useTransform(revealScale, (s) => 1 / Math.max(s, 0.001));

  // Prompt indicator fades out on scroll
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Desktop text tone: dark bronze layer (over the cream base) crossfades to
  // the white + shadow layer once the photo is revealed behind the text.
  // Opacity only — the text itself is painted once.
  const TONE_RANGE = [0.02, 0.18];
  const lightInkOpacity = useTransform(scrollYProgress, TONE_RANGE, [0, 1]);
  const darkInkOpacity = useTransform(scrollYProgress, TONE_RANGE, [1, 0]);
  const enableScrollFx = isMounted && !shouldReduceMotion;

  // 5 Jump to Section items
  const navJumps = [
    { id: "01", label: "วิสัยทัศน์", href: "#vision", icon: Compass },
    { id: "02", label: "พันธกิจ", href: "#mission", icon: Shield },
    { id: "03", label: "ประวัติความเป็นมา", href: "#history", icon: Landmark },
    { id: "04", label: "ค่านิยมองค์กร", href: "#values", icon: Award },
    { id: "05", label: "ผู้นำของเรา", href: "#leadership", icon: Users },
  ];

  // Smooth scroll helper
  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* ========================================================
          MOBILE HERO VIEW (< 768px / max-md)
          - Full-bleed bright photo of Charoensin HQ (no dark curtain)
          - Cream background (#F7F1E7) for text below image
          - Charcoal (#1F1F1F) headline & Bronze (#6B5A3A) subheadline
          - Horizontal smooth swipeable jump cards
         ======================================================== */}
      <section
        ref={mobileHeroRef}
        className="block md:hidden w-full bg-[#F7F1E7] border-b border-[#CCA369]/30 pt-20"
      >
        {/* Top Part: Bright Full-Color Photo of Charoensin HQ */}
        <div className="relative w-full aspect-[4/3] xs:aspect-[16/11] overflow-hidden bg-[#FAF7F2]">
          <Image
            src="/img/charoensin-building-hq.jpg"
            alt="สำนักงานใหญ่ กลุ่มบริษัทเจริญสิน"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter contrast-[1.02] saturate-[1.08] brightness-[0.98]"
          />
          {/* Subtle bottom fade to blend with cream surface */}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#F7F1E7] to-transparent pointer-events-none" />
        </div>

        {/* Bottom Part: Headline & Subheadline on Cream Background (#F7F1E7) */}
        <div className="px-4 pt-5 pb-7 text-center space-y-3">
          <div>
            <HeroTypography
              variant="mobile"
              reduceMotion={!!shouldReduceMotion}
            />
          </div>

          {/* Jump to Section (5 Cards) for Mobile */}
          <div className="pt-3">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 pb-2 -mx-4 px-4 no-scrollbar">
              {navJumps.map((jump) => {
                const IconComponent = jump.icon;
                return (
                  <a
                    key={`mob-${jump.id}`}
                    href={jump.href}
                    onClick={(e) => handleScrollTo(e, jump.href)}
                    className="shrink-0 snap-center min-w-[145px] p-3 rounded-2xl bg-white/95 border border-[#CCA369]/35 shadow-xs flex items-center justify-between active:scale-95 transition-all text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-[#FAF7F2] border border-[#CCA369]/30 flex items-center justify-center text-[#6B5A3A] shrink-0">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-[#9A7B3E] block leading-none">
                          {jump.id}
                        </span>
                        <span className="font-kanit text-xs font-medium text-[#1F1F1F] truncate block">
                          {jump.label}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#CCA369] shrink-0 ml-1" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DESKTOP HERO CONTAINER (>= 768px / md:)
          - Desktop: h-[200vh] with sticky viewport for Circular Mask Reveal
         ======================================================== */}
      <section
        ref={heroRef}
        className="hidden md:block relative w-full h-[200vh] bg-[#F4F0E8] text-white"
      >
        {/* Sticky Viewport Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
          {/* ----------------------------------------------------
              LAYER 1 (BASE): Soft Cream-Gold Architectural Wash
              Shown initially when scroll is at the top
             ---------------------------------------------------- */}
          <div className="absolute inset-0 z-0 bg-[#F4F0E8]">
            {/* Building photo, sepia-toned & multiplied into the cream base */}
            <div className="relative w-full h-full">
              <Image
                src="/img/charoensin-building-hq.jpg"
                alt="สำนักงานใหญ่ กลุ่มบริษัทเจริญสิน (โทนครีมทอง)"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center filter grayscale sepia-[0.55] contrast-[0.9] brightness-[1.08] opacity-45 mix-blend-multiply scale-105"
              />
            </div>

            {/* Light-gold atmosphere: warm wash + soft radial glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#E5D2B0]/30 via-[#CCA369]/10 to-[#E5D2B0]/35 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-[#F4F0E8]/60 via-[#F4F0E8]/25 to-[#CCA369]/25 pointer-events-none" />

            {/* Architectural Blueprint Grid Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #CCA369 1px, transparent 1px), linear-gradient(to bottom, #CCA369 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
          </div>

          {/* ----------------------------------------------------
              LAYER 2 (TOP): Full-Color Real Photo of Charoensin HQ
              Revealed dynamically via Circular Mask as user scrolls
             ---------------------------------------------------- */}
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            {/* Round window: scales 0 → 1 (radius up to 150vmax covers any viewport) */}
            <motion.div
              style={{ scale: enableScrollFx ? revealScale : 1 }}
              className="relative shrink-0 w-[300vmax] h-[300vmax] rounded-full overflow-hidden will-change-transform"
            >
              {/* Viewport-sized photo, counter-scaled so it stays still */}
              <motion.div
                style={{ scale: enableScrollFx ? revealInverse : 1 }}
                className="absolute left-1/2 top-1/2 w-screen h-screen -translate-x-1/2 -translate-y-1/2 will-change-transform"
              >
                {/* Real Full-Color Building Photograph (Vibrant & Bright) */}
                <Image
                  src="/img/charoensin-building-hq.jpg"
                  alt="สำนักงานใหญ่ กลุ่มบริษัทเจริญสิน (ภาพถ่ายสีจริง)"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center filter contrast-[1.03] saturate-[1.08] brightness-[0.92]"
                />

                {/* Light, Natural Overlay to Keep Building Colors Bright & Vivid */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#161412]/85 via-[#161412]/40 to-transparent pointer-events-none" />
              </motion.div>
            </motion.div>
          </div>

          {/* ----------------------------------------------------
              FOREGROUND CONTENT: HEADLINE & SUBHEADLINE (DESKTOP)
              Fixed (no scroll motion). Bottom edge is anchored to the
              ceiling just above the 4 black lamps in the photo:
              photo is 3:2 + object-cover, so that line sits at
              ≈ 50% − 7.5vw from the top on typical desktop viewports.
             ---------------------------------------------------- */}
          <div className="absolute z-20 inset-x-0 bottom-[calc(50%+7.5vw)] max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center">
            <div className="relative flex flex-col items-center">
              {/* Dark ink layer (decorative) — visible over the cream base */}
              {enableScrollFx && (
                <motion.div
                  aria-hidden="true"
                  style={{ opacity: darkInkOpacity }}
                  className="flex flex-col items-center will-change-[opacity]"
                >
                  <HeroTypography variant="desktop" ink="dark" decorative reduceMotion={!!shouldReduceMotion} />
                </motion.div>
              )}
              {/* Light ink layer (real heading) — fades in over the photo */}
              <motion.div
                style={enableScrollFx ? { opacity: lightInkOpacity } : undefined}
                className={`flex flex-col items-center will-change-[opacity] ${
                  enableScrollFx ? "absolute inset-0" : ""
                }`}
              >
                <HeroTypography variant="desktop" ink="light" reduceMotion={!!shouldReduceMotion} />
              </motion.div>
            </div>
          </div>

          {/* ----------------------------------------------------
              BOTTOM BAR: JUMP TO SECTION (5 SECTIONS) - DESKTOP
             ---------------------------------------------------- */}
          <div className="relative z-20 mt-auto w-full max-w-7xl mx-auto px-6 lg:px-8 pb-7 flex flex-col items-center">
            {/* Desktop Scroll Hint moved directly above the Jump Cards */}
            <motion.div
              style={{ opacity: hintOpacity }}
              className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#CCA369] font-kanit font-light select-none bg-black/55 px-3.5 py-1 rounded-full border border-[#CCA369]/30 shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCA369] animate-pulse" />
              <span>เลื่อนหน้าจอเพื่อสัมผัสมุมมองจริง</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#CCA369]" />
            </motion.div>

            {/* Jump Cards Container (5 Columns) */}
            <div className="w-full grid grid-cols-5 gap-3">
              {navJumps.map((jump) => {
                const IconComponent = jump.icon;
                return (
                  <a
                    key={jump.id}
                    href={jump.href}
                    onClick={(e) => handleScrollTo(e, jump.href)}
                    className="group p-3 sm:p-3.5 rounded-2xl bg-[#1A1816]/88 hover:bg-[#25211B] border border-[#CCA369]/35 hover:border-[#CCA369] shadow-lg hover:shadow-[0_8px_24px_rgba(204,163,105,0.22)] -translate-y-0 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white/10 border border-[#CCA369]/40 flex items-center justify-center shrink-0 text-[#CCA369] group-hover:bg-[#CCA369] group-hover:text-[#161412] transition-colors duration-300">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="text-[10px] font-mono text-[#CCA369]/80 block leading-none mb-0.5">
                          {jump.id}
                        </span>
                        <span className="font-kanit text-[13px] font-medium text-white group-hover:text-[#E6C786] truncate block">
                          {jump.label}
                        </span>
                      </div>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-[#CCA369] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 shrink-0 ml-1.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FLOATING DOCK BAR (AFTER THE HERO)
          Hidden over the Hero (avoids overlapping the 5 jump cards);
          slides up once #vision takes over, slides back down on return.
         ======================================================== */}
      <motion.div
        initial={false}
        animate={
          showFloatingDock ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }
        }
        transition={{
          duration: shouldReduceMotion ? 0 : 0.35,
          ease: revealEase,
        }}
        aria-hidden={!showFloatingDock}
        inert={!showFloatingDock}
        className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-max px-2 ${
          showFloatingDock ? "" : "pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-[#1A1816]/95 border border-[#CCA369]/45 shadow-[0_12px_36px_rgba(0,0,0,0.55)] overflow-x-auto no-scrollbar">
          <span className="hidden lg:inline-flex items-center gap-1.5 pl-3 pr-2 text-[11px] font-kanit font-semibold text-[#CCA369] border-r border-[#CCA369]/30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCA369] animate-pulse" />
            หัวข้อในหน้านี้
          </span>

          {navJumps.map((jump) => {
            const IconComponent = jump.icon;
            return (
              <a
                key={jump.id}
                href={jump.href}
                onClick={(e) => handleScrollTo(e, jump.href)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 text-xs sm:text-[13px] font-kanit font-normal transition-all shrink-0 hover:border hover:border-[#CCA369]/40"
              >
                <IconComponent className="w-3.5 h-3.5 text-[#CCA369]" />
                <span>{jump.label}</span>
              </a>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

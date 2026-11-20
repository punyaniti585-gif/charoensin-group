"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { aboutHeroData } from "@/data/about-data";
import { csgEase } from "@/components/ui/MotionWrapper";
import {
  ArrowUpRight,
  Compass,
  Shield,
  Award,
  Users,
  Landmark,
  ChevronDown,
} from "lucide-react";

export default function AboutHero() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [showFloatingDock, setShowFloatingDock] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      if (typeof window !== "undefined") {
        // Show floating dock after scrolling past 650px
        setShowFloatingDock(window.scrollY > 650);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useScroll linked to the 200vh hero section for Desktop Circular Mask Reveal
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // Transform scroll progress (0 -> 0.75) into circle expansion percentage (0% -> 150%)
  const circlePct = useTransform(scrollYProgress, [0, 0.75], [0, 150]);
  const circleMask = useTransform(
    circlePct,
    (pct) => `circle(${pct}% at 50% 50%)`
  );

  // Expanding gold ring at the border of the mask reveal
  const ringScale = useTransform(scrollYProgress, [0, 0.75], [0.3, 3.2]);
  const ringOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.65, 0.8],
    [0, 0.75, 0.75, 0]
  );

  // Prompt indicator fades out on scroll
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

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
      <section className="block md:hidden w-full bg-[#F7F1E7] border-b border-[#CCA369]/30 pt-20">
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
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: csgEase }}
            className="text-2xl xs:text-3xl font-bold font-kanit tracking-tight text-[#1F1F1F] leading-snug"
          >
            {aboutHeroData.headline}
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: csgEase }}
            className="text-sm xs:text-base text-[#6B5A3A] font-kanit font-normal leading-relaxed max-w-md mx-auto"
          >
            {aboutHeroData.subheadline}
          </motion.p>

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
        className="hidden md:block relative w-full h-[200vh] bg-[#161412] text-white"
      >
        {/* Sticky Viewport Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
          {/* ----------------------------------------------------
              LAYER 1 (BASE): Architectural Luxury Monochrome Building
              Shown initially when scroll is at the top
             ---------------------------------------------------- */}
          <div className="absolute inset-0 z-0">
            {/* Monochrome / Architectural Sketch Filtered Image */}
            <div className="relative w-full h-full">
              <Image
                src="/img/charoensin-building-hq.jpg"
                alt="สำนักงานใหญ่ กลุ่มบริษัทเจริญสิน (ภาพลายเส้นสถาปัตยกรรม)"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center filter grayscale contrast-[1.4] brightness-[0.42] scale-105"
              />
            </div>

            {/* Architectural Blueprint Grid Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-[0.14] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #CCA369 1px, transparent 1px), linear-gradient(to bottom, #CCA369 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />

            {/* Vignette Overlay for Crisp Typography Contrast */}
            <div className="absolute inset-0 bg-radial from-black/20 via-black/60 to-black/90 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-[#161412]/80 pointer-events-none" />

            {/* Center Golden Beacon Hint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-[#CCA369]/30 animate-ping opacity-25" />
              <div className="absolute w-20 h-20 rounded-full border border-[#CCA369]/50 animate-pulse" />
              <div className="absolute w-2 h-2 rounded-full bg-[#E6C786]" />
            </div>
          </div>

          {/* ----------------------------------------------------
              LAYER 2 (TOP): Full-Color Real Photo of Charoensin HQ
              Revealed dynamically via Circular Mask as user scrolls
             ---------------------------------------------------- */}
          <motion.div
            style={{
              clipPath:
                isMounted && !shouldReduceMotion
                  ? circleMask
                  : "circle(150% at 50% 50%)",
            }}
            className="absolute inset-0 z-10 pointer-events-none will-change-[clip-path]"
          >
            {/* Real Full-Color Building Photograph (Vibrant & Bright) */}
            <div className="relative w-full h-full">
              <Image
                src="/img/charoensin-building-hq.jpg"
                alt="สำนักงานใหญ่ กลุ่มบริษัทเจริญสิน (ภาพถ่ายสีจริง)"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center filter contrast-[1.03] saturate-[1.08] brightness-[0.92]"
              />
            </div>

            {/* Light, Natural Overlay to Keep Building Colors Bright & Vivid */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#161412]/85 via-[#161412]/40 to-transparent pointer-events-none" />
          </motion.div>

          {/* ----------------------------------------------------
              EXPANDING GOLDEN RING BORDER ON THE CIRCULAR MASK
             ---------------------------------------------------- */}
          {isMounted && !shouldReduceMotion && (
            <motion.div
              style={{
                scale: ringScale,
                opacity: ringOpacity,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border-2 border-[#CCA369] shadow-[0_0_50px_rgba(204,163,105,0.7)] pointer-events-none z-15 will-change-transform"
            />
          )}

          {/* ----------------------------------------------------
              FOREGROUND CONTENT: HEADLINE & SUBHEADLINE (DESKTOP)
              Positioned in Center / Upper-Middle of Screen
             ---------------------------------------------------- */}
          <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 sm:pt-36 flex flex-col items-center text-center">
            {/* Main Headline: "สร้างคุณค่า เติบโตอย่างมั่นคง" with Enhanced Drop Shadow */}
            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: csgEase }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-kanit tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] max-w-4xl leading-[1.18]"
            >
              {aboutHeroData.headline}
            </motion.h1>

            {/* Editorial Subheadline with Enhanced Drop Shadow */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: csgEase }}
              className="mt-4 text-base md:text-xl text-[#F7F1E7] font-kanit font-normal max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] drop-shadow-[0_3px_16px_rgba(0,0,0,0.8)]"
            >
              {aboutHeroData.subheadline}
            </motion.p>
          </div>

          {/* ----------------------------------------------------
              BOTTOM BAR: JUMP TO SECTION (5 SECTIONS) - DESKTOP
             ---------------------------------------------------- */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-7 flex flex-col items-center">
            {/* Desktop Scroll Hint moved directly above the Jump Cards */}
            <motion.div
              style={{ opacity: hintOpacity }}
              className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#CCA369] font-kanit font-light select-none bg-black/40 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#CCA369]/30 shadow-xs"
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
                    className="group p-3 sm:p-3.5 rounded-2xl bg-[#1A1816]/80 hover:bg-[#25211B] backdrop-blur-md border border-[#CCA369]/35 hover:border-[#CCA369] shadow-lg hover:shadow-[0_8px_24px_rgba(204,163,105,0.22)] -translate-y-0 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
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
          FLOATING DOCK BAR (WHEN SCROLLED DOWN)
          Stays docked at the bottom center for instant navigation
         ======================================================== */}
      <AnimatePresence>
        {showFloatingDock && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: csgEase }}
            className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-max px-2"
          >
            <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-[#1A1816]/92 backdrop-blur-lg border border-[#CCA369]/45 shadow-[0_12px_36px_rgba(0,0,0,0.55)] overflow-x-auto no-scrollbar">
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
        )}
      </AnimatePresence>
    </>
  );
}

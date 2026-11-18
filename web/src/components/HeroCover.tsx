"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { brandAssets } from "@/data/asset-map";
import { ArrowDown, ArrowUpRight } from "lucide-react";

interface PillarItem {
  key: string;
  number: string;
  titleTh: string;
  titleEn: string;
  desc: string;
  image: string;
  cardPos: {
    desktopClass: string;
    lineStart: { x: number; y: number };
    lineEnd: { x: number; y: number };
    curveControl: { x: number; y: number };
  };
}

export default function HeroCover() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // =========================================================================
  // SCROLL PROGRESS TRACKING (220vh sticky container for 3-stage cinematic sequence)
  // =========================================================================
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scroll Parallax Pan: Sky down to Real Charoensin Headquarters Building
  const rawBgY = useTransform(scrollYProgress, [0, 1], ["0%", "-33%"]);

  // Stage 1 -> 2: Vertical White Logo in Clear Sky (fades out smoothly on scroll)
  const rawWhiteLogoOpacity = useTransform(scrollYProgress, [0, 0.22, 0.38], [1, 0.7, 0]);
  const rawWhiteLogoScale = useTransform(scrollYProgress, [0, 0.38], [1, 1.18]);
  const rawWhiteLogoY = useTransform(scrollYProgress, [0, 0.38], [0, -35]);

  // Stage 2 -> 3: 80th Anniversary Gold Hub & Architectural Glass Ring
  const rawHubOpacity = useTransform(scrollYProgress, [0.26, 0.50], [0, 1]);
  const rawHubScale = useTransform(scrollYProgress, [0.26, 0.50], [0.82, 1]);
  const rawHubY = useTransform(scrollYProgress, [0.26, 0.50, 1], [30, 0, -18]);

  // Stage 3: 5 Editorial Portrait Cards (Real Estate, Leather, Chemical, Textile, Other)
  const rawCardsOpacity = useTransform(scrollYProgress, [0.46, 0.70], [0, 1]);
  const rawCardsScale = useTransform(scrollYProgress, [0.46, 0.70], [0.88, 1]);
  // Top Cards (01, 02) subtle upward glide on deep scroll
  const rawTopCardsY = useTransform(scrollYProgress, [0.46, 1], [25, -12]);
  // Side Cards (03, 04) subtle upward glide on deep scroll
  const rawSideCardsY = useTransform(scrollYProgress, [0.46, 1], [25, -12]);
  // Bottom Center Card (05 - Other Ventures): settles smoothly at door frame level without rising into 80th logo or "อาคารเจริญสิน"
  const rawOtherCardY = useTransform(scrollYProgress, [0.46, 0.72, 1], [30, 0, 0]);

  // End-of-Section Warm Gold Overlay & Subtle Blur (fades in from scroll 0.65 to 1.0)
  const rawGoldOverlayOpacity = useTransform(scrollYProgress, [0.65, 1], [0, 0.78]);

  // Initial Scroll Cue Prompt (fades out as soon as scroll begins)
  const rawPromptOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Accessibility fallbacks if prefers-reduced-motion is active
  const bgY = shouldReduceMotion ? "-20%" : rawBgY;
  const goldOverlayOpacity = shouldReduceMotion ? 0.78 : rawGoldOverlayOpacity;
  const whiteLogoOpacity = shouldReduceMotion ? 0 : rawWhiteLogoOpacity;
  const whiteLogoScale = shouldReduceMotion ? 1 : rawWhiteLogoScale;
  const whiteLogoY = shouldReduceMotion ? 0 : rawWhiteLogoY;
  const hubOpacity = shouldReduceMotion ? 1 : rawHubOpacity;
  const hubScale = shouldReduceMotion ? 1 : rawHubScale;
  const hubY = shouldReduceMotion ? 0 : rawHubY;
  const cardsOpacity = shouldReduceMotion ? 1 : rawCardsOpacity;
  const cardsScale = shouldReduceMotion ? 1 : rawCardsScale;
  const rawCardsPointer = useTransform(scrollYProgress, (v) => (v >= 0.4 ? "auto" : "none"));
  const cardsPointer = shouldReduceMotion ? "auto" : rawCardsPointer;
  const topCardsY = shouldReduceMotion ? 0 : rawTopCardsY;
  const sideCardsY = shouldReduceMotion ? 0 : rawSideCardsY;
  const otherCardY = shouldReduceMotion ? 0 : rawOtherCardY;
  const promptOpacity = shouldReduceMotion ? 0 : rawPromptOpacity;

  // 5 Radial Pillars with Editorial Portrait Frame layout (แบบที่ 1)
  const pillars: PillarItem[] = [
    {
      key: "real-estate",
      number: "01",
      titleTh: "ธุรกิจอสังหาริมทรัพย์",
      titleEn: "Real Estate",
      desc: "พัฒนาที่อยู่อาศัยและพื้นที่พาณิชย์",
      image: "/img/cat-realestate.png",
      cardPos: {
        desktopClass: "top-[1%] xl:top-[2%] left-[1%] xl:left-[3%]",
        lineStart: { x: 420, y: 165 },
        lineEnd: { x: 265, y: 110 },
        curveControl: { x: 340, y: 130 },
      },
    },
    {
      key: "leather-footwear",
      number: "02",
      titleTh: "ธุรกิจผลิตหนังและรองเท้า",
      titleEn: "Leather & Footwear",
      desc: "หนังฟอกและอุปกรณ์เซฟตี้สากล",
      image: "/img/cat-leather.jpg",
      cardPos: {
        desktopClass: "top-[1%] xl:top-[2%] right-[1%] xl:right-[3%]",
        lineStart: { x: 580, y: 165 },
        lineEnd: { x: 735, y: 110 },
        curveControl: { x: 660, y: 130 },
      },
    },
    {
      key: "chemical",
      number: "03",
      titleTh: "ธุรกิจเคมีภัณฑ์และอุตสาหกรรม",
      titleEn: "Chemical & Industrial",
      desc: "กาว ยาแนว และยางสังเคราะห์",
      image: "/img/cat-chemical.webp",
      cardPos: {
        desktopClass: "top-[48%] xl:top-[50%] left-[1%] xl:left-[3%]",
        lineStart: { x: 410, y: 260 },
        lineEnd: { x: 265, y: 340 },
        curveControl: { x: 335, y: 300 },
      },
    },
    {
      key: "non-woven",
      number: "04",
      titleTh: "ธุรกิจสิ่งทอ",
      titleEn: "Non-Woven Textiles",
      desc: "เส้นใยและสิ่งทอไม่ถักทอ",
      image: "/img/cat-textile.jpg",
      cardPos: {
        desktopClass: "top-[48%] xl:top-[50%] right-[1%] xl:right-[3%]",
        lineStart: { x: 590, y: 260 },
        lineEnd: { x: 735, y: 340 },
        curveControl: { x: 665, y: 300 },
      },
    },
    {
      key: "other",
      number: "05",
      titleTh: "ธุรกิจอื่นๆ",
      titleEn: "Other Ventures",
      desc: "สินเชื่อ พลังงาน และกิจการเพื่อสังคม",
      image: "/img/cat-other.png",
      cardPos: {
        desktopClass: "top-[69%] xl:top-[70%] left-1/2 -translate-x-1/2",
        lineStart: { x: 500, y: 350 },
        lineEnd: { x: 500, y: 410 },
        curveControl: { x: 500, y: 380 },
      },
    },
  ];

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${shouldReduceMotion ? "min-h-screen" : "h-[220vh]"
        } bg-[#F7F1E7]`}
    >
      {/* Sticky Viewport Container: Locks full height for scroll-driven sequence */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* ========================================================
            LAYER 1 (z-0): CINEMATIC BACKGROUND MOTION
            1) Scroll Parallax Pan: Sky down to Real Charoensin Headquarters Building
            2) Slow Ambient Ken Burns Drift: 35s loop (scale 1.02 -> 1.07, horizontal drift)
            3) Warm Sunlight Sweep: gentle golden ray passing through the building
           ======================================================== */}
        <motion.div
          style={{ y: bgY }}
          className="absolute top-0 left-0 w-full h-[155%] z-0 will-change-transform overflow-hidden"
        >
          {/* Ambient Ken Burns Drift Layer */}
          <motion.div
            className="w-full h-full will-change-transform relative"
            animate={
              shouldReduceMotion
                ? {}
                : {
                  scale: [1.02, 1.05, 1.02],
                  x: ["-1%", "1%", "-1%"],
                }
            }
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Top Region: Clear Blue Sky */}
            <div className="absolute inset-x-0 top-0 h-[65%] md:h-[55%] w-full">
              <Image
                src={brandAssets.hero.coverBackground}
                alt="ท้องฟ้ากลุ่มบริษัทเจริญสิน"
                fill
                priority
                loading="eager"
                sizes="100vw"
                className="object-cover object-top"
              />
            </div>

            {/* Bottom Region: Actual Charoensin Building Headquarters (ภาพอาคารเจริญสินจริง) */}
            <div className="absolute inset-x-0 top-[30%] sm:top-[32%] md:top-auto md:bottom-0 h-[56%] md:h-[72%] w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_16%,black_100%)]">
              <Image
                src="/img/charoensin-building-hq.jpg"
                alt="อาคารสำนักงานใหญ่ กลุ่มบริษัทเจริญสิน (Charoensin Building)"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[center_18%] sm:object-[center_20%] md:object-bottom"
              />
              {/* Subtle tint overlay to unify with CI Brand warm tone */}
              <div className="absolute inset-0 bg-[#F7F1E7]/15 mix-blend-color pointer-events-none" />
            </div>
          </motion.div>

          {/* Warm Sunlight Sweep Layer (Looping 24s) */}
          {isMounted && !shouldReduceMotion && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-soft-light">
              <motion.div
                className="absolute -top-[50%] -left-[60%] w-[120%] h-[200%] bg-gradient-to-r from-transparent via-[#CCA369]/25 via-[#FAF7F2]/30 to-transparent transform -rotate-25 filter blur-3xl pointer-events-none"
                animate={{
                  x: ["-20%", "160%", "-20%"],
                  opacity: [0.35, 0.75, 0.35],
                }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          )}

          {/* Sky Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent via-50% to-[#1F1F1F]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#CCA369]/10 to-transparent pointer-events-none" />
        </motion.div>

        {/* ========================================================
            LAYER 1.5 (z-10): END-OF-HERO WARM GOLD OVERLAY & SUBTLE BLUR
            Fades in from scroll 0.65 to 1.0 (opacity 0 -> 0.78)
            Sits above the building image (z-0) but below 80th Hub & Cards (z-25)
           ======================================================== */}
        <motion.div
          style={{ opacity: goldOverlayOpacity }}
          className="absolute inset-0 z-10 bg-[#CCA369] backdrop-blur-[3px] pointer-events-none will-change-[opacity]"
        />

        {/* Top spacer for navbar headroom */}
        <div className="relative z-10 pt-16 sm:pt-20 shrink-0" />

        {/* ========================================================
            STAGE 1 (z-20): MINIMAL VERTICAL WHITE LOGO IN SKY
            Pure white centerpiece at scrollYProgress = 0, positioned in the blue sky on mobile
           ======================================================== */}
        <motion.div
          style={{
            opacity: whiteLogoOpacity,
            scale: whiteLogoScale,
            y: whiteLogoY,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[20vh] sm:pt-[22vh] md:justify-center md:pt-0 px-4 pointer-events-none select-none will-change-transform"
        >
          <div className="relative w-52 sm:w-72 md:w-84 lg:w-96 aspect-[1000/700] drop-shadow-[0_4px_24px_rgba(0,0,0,0.38)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
            <Image
              src={brandAssets.logos.verticalWhite}
              alt="Charoensin Group"
              fill
              priority
              sizes="(max-width: 640px) 208px, (max-width: 1024px) 336px, 384px"
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* ========================================================
            STAGE 2 & 3 (z-25): RADIAL 80TH HUB & EDITORIAL PORTRAIT CARDS (แบบที่ 1)
           ======================================================== */}
        <div className="relative z-25 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center min-h-0">
          {/* Desktop Radial View (lg and up) */}
          <div className="hidden lg:block relative w-full h-[560px] xl:h-[620px] max-h-[calc(100vh-130px)]">
            {/* SVG Connector Arrows Layer */}
            <motion.svg
              style={{ opacity: cardsOpacity }}
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            >
              <defs>
                <marker
                  id="hero-arrow-gold"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#9A7B3E" />
                </marker>

                <filter id="heroBeamGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Render 5 Hub & Spoke Connector Curves (Hidden by default, shown on hover) */}
              {pillars.map((p) => {
                const isActive = hoveredKey === p.key;
                const pathD = `M ${p.cardPos.lineStart.x} ${p.cardPos.lineStart.y} Q ${p.cardPos.curveControl.x} ${p.cardPos.curveControl.y} ${p.cardPos.lineEnd.x} ${p.cardPos.lineEnd.y}`;

                return (
                  <g
                    key={`arrow-${p.key}`}
                    className={`transition-opacity duration-300 ease-out ${
                      isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {/* Golden Brown Dashed Guide Line & Arrowhead (#9A7B3E) */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#9A7B3E"
                      strokeWidth="2"
                      strokeDasharray="5 4"
                      strokeOpacity="0.95"
                      markerEnd="url(#hero-arrow-gold)"
                      style={{
                        filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.8))",
                      }}
                    />

                    {/* Animated Golden Pulse Traveling when Hovered (Gold #CCA369) */}
                    {isActive && isMounted && !shouldReduceMotion && (
                      <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#CCA369"
                        strokeWidth="3.5"
                        strokeDasharray="45 200"
                        initial={{ strokeDashoffset: 245 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        filter="url(#heroBeamGlow)"
                      />
                    )}
                  </g>
                );
              })}
            </motion.svg>

            {/* ----------------------------------------------------
                CENTRAL HUB: 80TH ANNIVERSARY GOLD LOGO + FROSTED WHITE GLASS RING
               ---------------------------------------------------- */}
            <motion.div
              style={{
                opacity: hubOpacity,
                scale: hubScale,
                y: hubY,
              }}
              className="absolute left-1/2 top-[34%] xl:top-[35%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center select-none"
            >
              {/* Frosted White Glass Circle & Compass Rings */}
              <div className="relative w-64 h-64 xl:w-72 xl:h-72 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md border-2 border-white/95 shadow-[0_12px_44px_rgba(255,255,255,0.7),0_8px_32px_rgba(140,104,50,0.25)]">
                {/* Rotating Fine Architectural Ring & Degree Ticks */}
                <motion.svg
                  viewBox="0 0 280 280"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : { rotate: hoveredKey ? 180 : [0, 360] }
                  }
                  transition={
                    hoveredKey
                      ? { duration: 1.2, ease: "easeOut" }
                      : { duration: 60, repeat: Infinity, ease: "linear" }
                  }
                >
                  {/* Outer Fine Architectural Ring (1.5px Gold) */}
                  <circle
                    cx="140"
                    cy="140"
                    r="126"
                    fill="none"
                    stroke="#CCA369"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />

                  {/* Middle Dashed Ring (Luminous White) */}
                  <circle
                    cx="140"
                    cy="140"
                    r="114"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    strokeOpacity="0.9"
                  />

                  {/* Inner Concentric Ring (Gold) */}
                  <circle
                    cx="140"
                    cy="140"
                    r="98"
                    fill="none"
                    stroke="#CCA369"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />

                  {/* 4 Cardinal Coordinate Gold Markers with White Core/Border */}
                  <circle cx="140" cy="14" r="4" fill="#8C6832" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="266" cy="140" r="3.5" fill="#8C6832" stroke="#FFFFFF" strokeWidth="1" />
                  <circle cx="140" cy="266" r="3.5" fill="#8C6832" stroke="#FFFFFF" strokeWidth="1" />
                  <circle cx="14" cy="140" r="3.5" fill="#8C6832" stroke="#FFFFFF" strokeWidth="1" />

                  {/* Cardinal Crosshair Ticks */}
                  <line x1="140" y1="30" x2="140" y2="44" stroke="#8C6832" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="140" y1="236" x2="140" y2="250" stroke="#8C6832" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="30" y1="140" x2="44" y2="140" stroke="#8C6832" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="236" y1="140" x2="250" y2="140" stroke="#8C6832" strokeWidth="1.5" strokeOpacity="0.8" />
                </motion.svg>

                {/* Gold 80th Anniversary Logo - Saturated, Radiant, and Crisp */}
                <div
                  className="relative w-48 sm:w-52 xl:w-56 aspect-square flex items-center justify-center select-none"
                  style={{
                    filter:
                      "drop-shadow(0 0 2px #FFFFFF) drop-shadow(0 0 10px rgba(255,255,255,0.95)) drop-shadow(0 4px 20px rgba(107,90,58,0.45)) saturate(1.22) contrast(1.1) brightness(1.04)",
                  }}
                >
                  <Image
                    src="/img/80th-anniversary-gold.png"
                    alt="80th Anniversary Charoensin Group"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Motto Under Logo */}
              <div className="mt-1.5 text-center">
                <span className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-[#F7F1E7]/95 backdrop-blur-md border border-[#CCA369]/50 shadow-sm text-xs font-kanit font-medium text-[#6B5A3A] tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CCA369]" />
                  <span>สร้างคุณค่า เติบโตอย่างมั่นคง</span>
                </span>
              </div>
            </motion.div>

            {/* ----------------------------------------------------
                STAGE 3: 5 EDITORIAL PORTRAIT CARDS (แบบที่ 1 — Double Inset Gold Hairline)
               ---------------------------------------------------- */}
            {pillars.map((item) => {
              const isTop = item.key === "real-estate" || item.key === "leather-footwear";
              const isOther = item.key === "other";
              const cardMotionY = isOther ? otherCardY : isTop ? topCardsY : sideCardsY;
              const isHovered = hoveredKey === item.key;
              const hasAnotherHovered = hoveredKey !== null && !isHovered;

              return (
                <motion.div
                  key={item.key}
                  style={{
                    opacity: cardsOpacity,
                    scale: cardsScale,
                    y: cardMotionY,
                  }}
                  className={`absolute ${item.cardPos.desktopClass} z-30 transition-all duration-300`}
                >
                  <Link
                    href="#businesses"
                    onMouseEnter={() => setHoveredKey(item.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`group block w-56 sm:w-60 xl:w-64 rounded-2xl overflow-hidden backdrop-blur-md border transition-all duration-300 shadow-[0_6px_28px_rgba(204,163,105,0.14)] cursor-pointer select-none relative ${isHovered
                      ? "scale-105 -translate-y-1.5 border-[#CCA369] shadow-[0_16px_36px_rgba(204,163,105,0.28)]"
                      : "border-[#CCA369]/40 hover:border-[#CCA369]/80"
                      } ${hasAnotherHovered ? "opacity-70" : "opacity-100"}`}
                  >
                    {/* Double Inset Gold Hairline (Invitation Card Style) */}
                    <div className="absolute inset-2 rounded-xl border border-[#CCA369]/35 pointer-events-none z-20 group-hover:border-[#CCA369] transition-colors" />

                    {/* Top Half: Photo */}
                    <div className={`relative ${isOther ? "h-24 sm:h-26 xl:h-28" : "h-28 sm:h-30 xl:h-32"} w-full overflow-hidden bg-black/10`}>
                      <Image
                        src={item.image}
                        alt={item.titleTh}
                        fill
                        className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                      {/* Subtle Vignette Gradient for Depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                      {/* Number Badge floating on Photo */}
                      <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-[#F7F1E7]/95 backdrop-blur-md border border-[#CCA369]/50 shadow-xs">
                        <span className="font-playfair font-bold text-xs text-[#6B5A3A]">
                          {item.number}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Half: Editorial Info Area on Warm Champagne Cream */}
                    <div className={`bg-[#F7F1E7]/95 backdrop-blur-md ${isOther ? "p-2.5 xl:p-3" : "p-3 xl:p-3.5"} border-t border-[#CCA369]/30 flex flex-col justify-between`}>
                      {/* Business Title in Kanit (#1F1F1F) */}
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-kanit font-semibold text-xs xl:text-sm text-[#1F1F1F] leading-tight truncate group-hover:text-[#8C6832] transition-colors">
                          {item.titleTh}
                        </h4>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isHovered
                            ? "bg-[#8C6832] text-white rotate-45"
                            : "bg-[#D9CBAA]/45 text-[#6B5A3A] group-hover:bg-[#CCA369] group-hover:text-white"
                            }`}
                        >
                          <ArrowUpRight className="w-3 h-3" />
                        </div>
                      </div>

                      {/* English Title in Inter (#6B5A3A) */}
                      <span className="font-inter font-medium text-[9px] xl:text-[10px] text-[#6B5A3A] uppercase tracking-wider block mt-0.5 truncate">
                        {item.titleEn}
                      </span>

                      {/* 1-Line Short Description in Sarabun */}
                      <p className="mt-0.5 text-[10px] xl:text-[11px] text-[#1F1F1F]/75 font-sarabun leading-snug line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ====================================================
              MOBILE & TABLET VIEW (< lg): Stacked Editorial Portrait Cards
              Separate sequence: Only White Logo at scroll=0, fading out to reveal
              80th Anniversary Hub & 5 Cards smoothly on scroll down.
             ==================================================== */}
          <div className="lg:hidden flex flex-col items-center justify-center py-2 sm:py-4 space-y-2.5 sm:space-y-4 w-full">
            {/* Mobile 80th Anniversary Logo Centerpiece */}
            <motion.div
              style={{ opacity: hubOpacity, scale: hubScale }}
              className="flex flex-col items-center text-center will-change-transform"
            >
              <div className="relative w-[clamp(100px,26vw,135px)] h-[clamp(100px,26vw,135px)] flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md border-2 border-white/90 shadow-[0_8px_32px_rgba(255,255,255,0.7),0_4px_20px_rgba(140,104,50,0.25)]">
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#CCA369" strokeWidth="1.2" strokeOpacity="0.8" />
                  <circle cx="100" cy="100" r="82" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.9" />
                </svg>
                <div
                  className="relative w-[clamp(80px,21vw,110px)] h-[clamp(80px,21vw,110px)] aspect-square"
                  style={{
                    filter:
                      "drop-shadow(0 0 2px #FFFFFF) drop-shadow(0 0 10px rgba(255,255,255,0.95)) drop-shadow(0 4px 16px rgba(107,90,58,0.45)) saturate(1.22) contrast(1.1) brightness(1.04)",
                  }}
                >
                  <Image
                    src="/img/80th-anniversary-gold.png"
                    alt="80th Anniversary Charoensin Group"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
              <span className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F7F1E7]/95 backdrop-blur-md border border-[#CCA369]/40 text-[clamp(9.5px,2.6vw,11.5px)] font-kanit text-[#6B5A3A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CCA369]" />
                <span>สร้างคุณค่า เติบโตอย่างมั่นคง</span>
              </span>
            </motion.div>

            {/* Mobile 5 Editorial Cards List */}
            <motion.div
              style={{
                opacity: cardsOpacity,
                scale: cardsScale,
                pointerEvents: cardsPointer as any,
              }}
              className="w-full max-w-[360px] sm:max-w-md will-change-transform"
            >
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
                {pillars.slice(0, 4).map((item) => (
                  <Link
                    key={`mob-${item.key}`}
                    href="#businesses"
                    className="rounded-2xl overflow-hidden backdrop-blur-md bg-[#F7F1E7]/95 border border-[#CCA369]/45 shadow-xs active:bg-white transition-all relative p-0.5"
                  >
                    <div className="relative h-[clamp(54px,14vw,72px)] w-full overflow-hidden rounded-t-[14px]">
                      <Image src={item.image} alt={item.titleTh} fill className="object-cover" />
                      <div className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded-full bg-[#F7F1E7]/90 text-[clamp(9px,2.3vw,10px)] font-playfair font-bold text-[#6B5A3A]">
                        {item.number}
                      </div>
                    </div>
                    <div className="p-1.5 sm:p-2">
                      <h5 className="font-kanit font-semibold text-[clamp(10px,2.8vw,11.5px)] text-[#1F1F1F] truncate">
                        {item.titleTh}
                      </h5>
                      <span className="text-[clamp(8px,2.2vw,9.5px)] text-[#6B5A3A] font-inter uppercase block truncate">
                        {item.titleEn}
                      </span>
                    </div>
                  </Link>
                ))}

                {/* 5th Card spanning full width on mobile */}
                <div className="col-span-2">
                  <Link
                    href="#businesses"
                    className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md bg-[#F7F1E7]/95 border border-[#CCA369]/45 shadow-xs active:bg-white transition-all"
                  >
                    <div className="relative w-[clamp(36px,10vw,44px)] h-[clamp(36px,10vw,44px)] rounded-xl overflow-hidden shrink-0 border border-[#CCA369]/30">
                      <Image src={pillars[4].image} alt={pillars[4].titleTh} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-kanit font-semibold text-[clamp(10.5px,2.9vw,12px)] text-[#1F1F1F] truncate">
                          {pillars[4].titleTh}
                        </h5>
                        <span className="font-playfair text-[clamp(9.5px,2.4vw,11px)] font-bold text-[#6B5A3A]">
                          {pillars[4].number}
                        </span>
                      </div>
                      <span className="text-[clamp(8.5px,2.3vw,10px)] text-[#6B5A3A] font-inter uppercase block truncate">
                        {pillars[4].titleEn}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM BAR (z-30): SCROLL PROMPT
           ======================================================== */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 flex items-center justify-start shrink-0 pointer-events-none">
          <motion.div
            style={{ opacity: promptOpacity }}
            className="flex items-center gap-2 text-white/95 text-xs sm:text-sm font-sarabun drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          >
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#CCA369]" />
            <span>เลื่อนลงเพื่อสำรวจเรื่องราวและสถิติองค์กร</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
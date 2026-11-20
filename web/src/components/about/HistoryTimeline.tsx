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
import { historyTimelineData, TimelineRowItem } from "@/data/about-data";
import { csgEase } from "@/components/ui/MotionWrapper";
import { Sparkles, Info, Award } from "lucide-react";

export default function HistoryTimeline() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  // Rotating states for banner ("Succeed" <-> "Charoensin") and end callout
  const [bannerWordIdx, setBannerWordIdx] = useState(0);
  const [calloutWordIdx, setCalloutWordIdx] = useState(0);

  // Parallax + Slow Zoom banner container ref
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: bannerScroll } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });

  // Timeline rail container ref
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 85%"],
  });

  // Parallax and Slow Zoom transforms for banner (GPU-friendly transform properties)
  const bannerImgY = useTransform(bannerScroll, [0, 1], ["-8%", "8%"]);
  const bannerScale = useTransform(bannerScroll, [0, 1], [1, 1.18]);
  const bannerTextY = useTransform(bannerScroll, [0, 1], ["10%", "-10%"]);

  // Moving head indicator top position
  const lineHeadTop = useTransform(timelineScroll, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setIsMounted(true);

    // Ticker intervals: rotate banner words between "Succeed" and "Charoensin" every 2.8s
    const bannerInterval = setInterval(() => {
      setBannerWordIdx(
        (prev) => (prev + 1) % historyTimelineData.banner.rotatingWords.length
      );
    }, 2800);

    const calloutInterval = setInterval(() => {
      setCalloutWordIdx(
        (prev) =>
          (prev + 1) % historyTimelineData.endCallout.rotatingWords.length
      );
    }, 2800);

    return () => {
      clearInterval(bannerInterval);
      clearInterval(calloutInterval);
    };
  }, []);

  const { banner, intro, rows, endCallout } = historyTimelineData;

  return (
    <section className="relative w-full bg-[#F7F1E7]">
      {/* ========================================================
          PART 1: FULL-SCREEN PARALLAX BANNER (MONOCHROME + SLOW ZOOM)
          "History of buildings" with rotating "Succeed" / "Charoensin"
         ======================================================== */}
      <div
        ref={bannerRef}
        className="relative w-full min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#161412] text-white border-y border-[#CCA369]/30"
      >
        {/* Parallax + Slow Zoom Background Image (Monochrome Tone) */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : bannerImgY,
            scale: shouldReduceMotion ? 1 : bannerScale,
          }}
          className="absolute inset-0 -top-[12%] -bottom-[12%] w-full h-[124%] will-change-transform"
        >
          <Image
            src={banner.image}
            alt={banner.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter grayscale contrast-[1.25] brightness-[0.62]"
          />
        </motion.div>

        {/* Cinematic Vignette & Radial Dark-Gold Glow */}
        <div className="absolute inset-0 bg-radial from-black/35 via-black/70 to-black/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-[#161412]/80 pointer-events-none" />

        {/* Foreground Content with Gentle Counter-Parallax */}
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : bannerTextY }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-5 will-change-transform"
        >
          {/* Eyebrow Kicker: หัวข้อเล็ก 'ประวัติความเป็นมา' */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: csgEase }}
            className="flex items-center justify-center gap-3 sm:gap-4"
          >
            <div className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#CCA369]" />
            <span className="font-kanit text-xs sm:text-sm uppercase tracking-[0.28em] text-[#E6C786] font-medium">
              {banner.kicker}
            </span>
            <div className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#CCA369]" />
          </motion.div>

          {/* Main Title: ตัวอักษรใหญ่ 'History of buildings' */}
          <motion.h2
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: csgEase }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-normal tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] leading-tight"
          >
            {banner.title}
          </motion.h2>

          {/* Dynamic Rotating Word: สีทอง (#CCA369 ตัวเอียง) สลับคำอัตโนมัติอย่างนุ่มนวลระหว่าง Succeed และ Charoensin */}
          <div className="h-16 sm:h-24 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={bannerWordIdx}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.5, ease: csgEase }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair italic font-medium text-[#CCA369] tracking-wide inline-block drop-shadow-[0_2px_16px_rgba(204,163,105,0.4)]"
              >
                {banner.rotatingWords[bannerWordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="pt-2">
            <span className="text-xs sm:text-sm font-kanit text-white/80 tracking-widest font-light">
              กลุ่มบริษัทเจริญสิน · รากฐานอุตสาหกรรมไทยสู่สากล
            </span>
          </div>
        </motion.div>
      </div>

      {/* ========================================================
          PART 2: VERTICAL TIMELINE SECTION (id="history")
          Scroll-Drawn Rail + Milestone Pins + History Nodes
         ======================================================== */}
      <div
        id="history"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-6 md:pb-8 scroll-mt-28"
      >
        {/* Timeline Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 sm:pb-12 border-b border-[#CCA369]/30">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: csgEase }}
            className="lg:col-span-8 space-y-3"
          >
            <p className="text-base sm:text-lg font-sarabun text-[#1F1F1F]/85 leading-relaxed font-normal">
              {intro.paragraph}
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: csgEase }}
            className="lg:col-span-4 lg:text-right"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-kanit font-bold text-[#6B5A3A] tracking-tight leading-none">
              <span>{intro.titleLine1}</span>
              <br />
              <span className="text-[#CCA369]">{intro.titleLine2}</span>
            </h2>
          </motion.div>
        </div>

        {/* Lead-in Golden Dot & Dashed Line Guide leading down to Year 2475 */}
        <div className="flex flex-col items-center justify-center my-6 sm:my-8 relative z-20">
          <motion.div
            initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: csgEase }}
            className="w-4 h-4 rounded-full bg-[#E6C786] border-2 border-[#6B5A3A] shadow-[0_0_12px_#CCA369] flex items-center justify-center relative"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B5A3A]" />
            <span className="absolute -inset-2 rounded-full border border-[#CCA369]/60 animate-ping opacity-60" />
          </motion.div>
          <div className="w-[2px] h-8 sm:h-10 border-l-2 border-dashed border-[#CCA369]/60 my-1" />
          <span className="text-[11px] font-mono tracking-widest text-[#9A7B3E] font-semibold uppercase bg-white/95 px-3 py-1 rounded-full border border-[#CCA369]/35 shadow-2xs">
            พ.ศ. 2475 · จุดเริ่มต้นประวัติศาสตร์
          </span>
        </div>

        {/* ------------------------------------------------------
            SCROLL-DRAWN TIMELINE RAIL & 14 ALTERNATING ROWS
           ------------------------------------------------------ */}
        <div ref={timelineRef} className="relative mt-6 sm:mt-8">
          {/* Central Vertical Golden Rail Line (Background Track) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] bg-[#CCA369]/20" />

          {/* Dynamic Scroll-Drawn Golden Line */}
          {isMounted && (
            <>
              <motion.div
                style={{
                  scaleY: shouldReduceMotion ? 1 : timelineScroll,
                  originY: 0,
                }}
                className="absolute left-6 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2.5px] bg-gradient-to-b from-[#CCA369] via-[#E6C786] to-[#9A7B3E] shadow-[0_0_14px_rgba(204,163,105,0.85)] z-10 will-change-transform"
              />

              {/* Glowing Head Indicator riding the leading edge of the drawn line */}
              {!shouldReduceMotion && (
                <motion.div
                  style={{
                    top: lineHeadTop,
                  }}
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E6C786] shadow-[0_0_16px_#CCA369] z-25 pointer-events-none will-change-transform flex items-center justify-center"
                >
                  <span className="w-2 h-2 rounded-full bg-[#6B5A3A]" />
                  <span className="absolute inset-0 rounded-full bg-[#CCA369] animate-ping opacity-75" />
                </motion.div>
              )}
            </>
          )}

          {/* Timeline Nodes / Rows */}
          <div className="space-y-10 sm:space-y-16 relative z-20">
            {rows.map((row, idx) => (
              <TimelineRowNode
                key={row.id}
                row={row}
                idx={idx}
                shouldReduceMotion={!!shouldReduceMotion}
              />
            ))}
          </div>
        </div>

        {/* ========================================================
            PART 3: ROTATING CALLOUT 'เจริญสินมุ่งมั่นสู่ ISO / Green'
            Positioned closely below timeline (tight vertical spacing)
           ======================================================== */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: csgEase }}
          className="my-6 pt-6 border-t border-[#CCA369]/30 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 py-3.5 px-6 sm:py-4.5 sm:px-8 rounded-2xl bg-white/90 backdrop-blur-md border border-[#CCA369]/40 shadow-[0_8px_30px_rgba(107,90,58,0.08)] max-w-3xl mx-auto">
            <span className="text-lg sm:text-xl md:text-2xl font-kanit font-semibold text-[#1F1F1F]">
              {endCallout.prefix}
            </span>

            {/* Vertical Masked Text Transition */}
            <div className="relative h-8 sm:h-10 flex items-center justify-center overflow-hidden min-w-[200px] sm:min-w-[260px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={calloutWordIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: csgEase }}
                  className="relative text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-[#6B5A3A] italic whitespace-nowrap inline-block"
                >
                  {endCallout.rotatingWords[calloutWordIdx]}
                  {/* Golden underline running beneath keyword */}
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#CCA369] via-[#E6C786] to-[#9A7B3E] rounded-full"
                  />
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Individual Node / Row on the Timeline
 * - Desktop: alternates left / right around center rail
 * - Mobile (< md): aligned to left rail (left-6), card padded with pl-14
 */
function TimelineRowNode({
  row,
  idx,
  shouldReduceMotion,
}: {
  row: TimelineRowItem;
  idx: number;
  shouldReduceMotion: boolean;
}) {
  const isLeft = row.align === "left";
  const [isColorRevealed, setIsColorRevealed] = useState(false);
  const is2475 = idx === 0 || row.yearNumber === "2475";

  return (
    <div
      className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center ${
        isLeft ? "" : "md:flex-row-reverse"
      }`}
    >
      {/* --------------------------------------------------------
          Central Golden Node Pin (Rotated Diamond & Double Pulse)
         -------------------------------------------------------- */}
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 0.5,
          ease: csgEase,
        }}
        className="absolute left-6 md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center will-change-transform"
      >
        {/* Special Double Golden Ring Pulse for Founding Year 2475 */}
        {is2475 && (
          <span className="absolute -inset-3 rounded-full border-2 border-[#CCA369]/60 animate-ping opacity-60" />
        )}

        <div
          className={`rounded-full bg-white border-2 flex items-center justify-center transition-all duration-300 hover:scale-125 ${
            is2475
              ? "w-8 h-8 border-[#CCA369] shadow-[0_0_18px_rgba(204,163,105,0.9)] ring-4 ring-[#CCA369]/30"
              : "w-5 h-5 border-[#CCA369] shadow-[0_0_12px_rgba(204,163,105,0.7)]"
          }`}
        >
          {/* Inner Golden Diamond / Dot */}
          <div
            className={`transition-all ${
              is2475
                ? "w-3.5 h-3.5 rotate-45 bg-[#CCA369] rounded-xs"
                : "w-2 h-2 rounded-full bg-[#6B5A3A]"
            }`}
          />
        </div>
      </motion.div>

      {/* --------------------------------------------------------
          LEFT SIDE COLUMN (Content or Gallery)
         -------------------------------------------------------- */}
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : { opacity: 0, x: isLeft ? -28 : 28 }
        }
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: csgEase }}
        className={`pl-14 md:pl-0 will-change-transform ${
          isLeft
            ? "md:pr-10 md:text-right md:order-1"
            : "md:pl-10 md:text-left md:order-2"
        }`}
      >
        {row.type === "content" ? (
          /* Content Card (Year + Title + Description) */
          <div
            className={`group relative p-6 sm:p-7 rounded-3xl bg-white/92 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:border-[#CCA369]/70 ${
              is2475
                ? "border-2 border-[#CCA369] shadow-[0_12px_36px_rgba(204,163,105,0.18)] bg-gradient-to-br from-white via-white to-[#FAF7F2]"
                : "border border-[#CCA369]/35 shadow-[0_8px_30px_rgba(107,90,58,0.08)]"
            }`}
          >
            {/* Special Badge for Year 2475 */}
            {is2475 && (
              <div
                className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-kanit font-semibold bg-[#6B5A3A] text-white shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-[#CCA369]" />
                <span>จุดเริ่มต้นประวัติศาสตร์ พ.ศ. 2475</span>
              </div>
            )}

            {/* Year Header in Playfair Display */}
            {row.year && (
              <div
                className={`flex items-baseline gap-2 mb-2 ${
                  isLeft ? "md:justify-end" : "md:justify-start"
                }`}
              >
                <span
                  className={`text-3xl sm:text-4xl font-playfair font-bold transition-colors ${
                    is2475
                      ? "text-[#CCA369] group-hover:text-[#6B5A3A]"
                      : "text-[#6B5A3A] group-hover:text-[#CCA369]"
                  }`}
                >
                  {row.yearNumber}
                </span>
                <span className="text-xs font-mono uppercase text-[#9A7B3E] font-semibold">
                  {row.year}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold font-kanit text-[#1F1F1F] mb-3">
              {row.title}
            </h3>

            {/* Description */}
            {row.description && (
              <p className="text-sm sm:text-base font-sarabun text-[#1F1F1F]/80 leading-relaxed font-normal">
                {row.description}
              </p>
            )}

            {/* Flag / Note if present */}
            {row.flag && (
              <div
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-kanit bg-[#FAF7F2] text-[#9A7B3E] border border-[#CCA369]/30"
              >
                <Info className="w-3.5 h-3.5 text-[#CCA369]" />
                <span>{row.flag}</span>
              </div>
            )}

            {/* If card has an associated logo inside */}
            {row.isLogo && row.logo && (
              <div
                className={`mt-4 pt-4 border-t border-[#CCA369]/20 flex items-center gap-3 ${
                  isLeft ? "md:justify-end" : "md:justify-start"
                }`}
              >
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#CCA369]/30 p-2 shadow-2xs">
                  <Image
                    src={row.logo}
                    alt={row.title || "Logo"}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </div>
            )}

            {/* Dark logo style for Caltree */}
            {row.isDarkLogo && row.logo && (
              <div
                className={`mt-4 pt-4 border-t border-[#CCA369]/20 flex items-center gap-3 ${
                  isLeft ? "md:justify-end" : "md:justify-start"
                }`}
              >
                <div className="relative w-16 h-14 rounded-2xl overflow-hidden bg-[#231F20] border border-[#CCA369]/40 p-2 shadow-2xs">
                  <Image
                    src={row.logo}
                    alt={row.title || "Logo"}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Side Gallery Image Plate */
          <div className="relative rounded-3xl overflow-hidden border border-[#CCA369]/35 shadow-md bg-white aspect-[4/3] group">
            {row.images[0] && (
              <Image
                src={row.images[0]}
                alt={row.caption || "ภาพในแกลเลอรี"}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-sarabun px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xs flex items-center justify-between border border-white/20">
              <span>{row.caption}</span>
              {row.isAi && (
                <span className="text-[10px] bg-[#CCA369]/80 text-[#1F1F1F] font-bold px-2 py-0.5 rounded-full font-mono">
                  ภาพ AI
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* --------------------------------------------------------
          RIGHT SIDE COLUMN (on Desktop)
         -------------------------------------------------------- */}
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : { opacity: 0, x: isLeft ? 28 : -28 }
        }
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: csgEase }}
        className={`pl-14 md:pl-0 will-change-transform ${
          isLeft
            ? "md:pl-10 md:text-left md:order-2"
            : "md:pr-10 md:text-right md:order-1"
        }`}
      >
        {row.type === "content" ? (
          /* Image / Interactive Visual on opposite side */
          row.images.length > 0 ? (
            <div
              className={`relative rounded-3xl overflow-hidden border-2 border-[#CCA369]/40 bg-white shadow-lg aspect-[16/10] group ${
                row.imageBw ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (row.imageBw) setIsColorRevealed(!isColorRevealed);
              }}
            >
              {/* If row has BW + Color image (Row 3: 2488 Tannery) */}
              {row.imageBw ? (
                <>
                  <Image
                    src={row.imageBw}
                    alt={row.title || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className={`object-cover transition-opacity duration-700 ${
                      isColorRevealed ? "opacity-0" : "opacity-100"
                    } group-hover:opacity-0`}
                  />
                  <Image
                    src={row.images[0]}
                    alt={row.title || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className={`object-cover transition-opacity duration-700 ${
                      isColorRevealed ? "opacity-100" : "opacity-0"
                    } group-hover:opacity-100`}
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-xs border border-white/30 text-white text-[11px] font-kanit">
                    ชี้เพื่อดูภาพสี
                  </div>
                </>
              ) : (
                <Image
                  src={row.images[0]}
                  alt={row.title || ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 text-white text-xs font-kanit drop-shadow-md">
                {row.title}
              </div>
            </div>
          ) : row.isTodo ? (
            /* Placeholder for 2475 (รอภาพของปี 2475) */
            <div className="p-8 rounded-3xl border-2 border-dashed border-[#CCA369]/50 bg-white/70 backdrop-blur-xs text-center flex flex-col items-center justify-center min-h-[190px] shadow-xs">
              <Sparkles className="w-8 h-8 text-[#CCA369] mb-2 animate-pulse" />
              <span className="text-sm font-kanit text-[#6B5A3A] font-semibold">
                รอภาพประวัติศาสตร์ปี 2475
              </span>
              <span className="text-xs font-sarabun text-[#6B5A3A]/75 mt-1">
                จดหมายเหตุกลุ่มบริษัทเจริญสิน
              </span>
            </div>
          ) : null
        ) : (
          /* Side Gallery item description / spacer */
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#9A7B3E]/70 uppercase tracking-widest">
            <div className="w-6 h-px bg-[#CCA369]/40" />
            <span>ARCHIVAL GALLERY RECORD</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

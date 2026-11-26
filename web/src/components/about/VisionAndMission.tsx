"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { visionAndMissionData } from "@/data/about-data";
import { csgEase } from "@/components/ui/MotionWrapper";

export default function VisionAndMission() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { vision, mission } = visionAndMissionData;

  return (
    <section className="relative w-full py-12 md:py-16 bg-[#FCFBF9]">
      {/* Background Subtle Gradient & Light Bloom (Isolated overflow to preserve sticky context) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-radial from-[#CCA369]/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-radial from-[#CCA369]/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Editorial Grid: Left is Sticky on Desktop (lg:), normal flow on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ====================================================
              LEFT COLUMN: Sticky Executive & AI Visual Figure
              (lg:sticky lg:top-28 lg:self-start, relative on mobile)
             ==================================================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: csgEase }}
              className="relative group"
            >
              {/* Outer Decorative Gold Border Frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#CCA369]/40 bg-[#FAF7F2] shadow-[0_12px_40px_rgba(107,90,58,0.12)] aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src={vision.image}
                  alt={vision.imageCaption}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover object-center filter saturate-[1.05] contrast-[1.03] transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                {/* Bottom Glass Caption */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-sarabun backdrop-blur-md bg-black/45 px-4 py-2.5 rounded-2xl border border-white/20 shadow-md">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CCA369] animate-pulse" />
                    {vision.imageCaption}
                  </span>
                  <span className="font-playfair text-[#CCA369] tracking-wider font-semibold text-[11px]">
                    VISION 2026+
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ====================================================
              RIGHT COLUMN: 01 Vision & 02 Mission (6 items)
              Scrolls smoothly past the sticky left column
             ==================================================== */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">
            {/* --------------------------------------------------
                SECTION 02.01: วิสัยทัศน์ (id="vision")
               -------------------------------------------------- */}
            <div id="vision" className="scroll-mt-28">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: csgEase }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-kanit text-[#1F1F1F] tracking-tight mb-3 leading-tight flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CCA369]" />
                  <span>วิสัยทัศน์</span>
                </h2>

                <p className="text-base sm:text-lg lg:text-xl font-sarabun text-[#1F1F1F]/90 leading-relaxed font-normal bg-white/75 backdrop-blur-xs p-5 sm:p-6 rounded-2xl border border-[#CCA369]/30 shadow-2xs">
                  {vision.lead}
                </p>
              </motion.div>
            </div>

            {/* Thin Decorative Gold CI Divider */}
            <div className="w-full h-px bg-gradient-to-r from-[#CCA369]/40 via-[#CCA369]/20 to-transparent" />

            {/* --------------------------------------------------
                SECTION 02.02: พันธกิจ (id="mission")
               -------------------------------------------------- */}
            <div id="mission" className="scroll-mt-28">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: csgEase }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-kanit text-[#1F1F1F] tracking-tight mb-5 leading-tight flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CCA369]" />
                  <span>พันธกิจ</span>
                </h2>

                {/* 6 Mission Items: Staggered Fade-Up as user scrolls */}
                <ol className="space-y-2.5 sm:space-y-3">
                  {mission.items.map((item, idx) => (
                    <motion.li
                      key={item.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.5,
                        delay: shouldReduceMotion ? 0 : idx * 0.08,
                        ease: csgEase,
                      }}
                      className="group relative cursor-pointer p-4 sm:p-5 rounded-2xl bg-white/60 hover:bg-white backdrop-blur-xs border border-[#CCA369]/25 hover:border-[#CCA369] shadow-2xs hover:shadow-[0_8px_24px_rgba(107,90,58,0.12)] transition-all duration-300"
                    >
                      {/* Grid: Number on Left, Text on Right */}
                      <div className="grid grid-cols-[40px_1fr] sm:grid-cols-[48px_1fr] gap-2.5 sm:gap-4 items-baseline">
                        {/* Number 01-06: changes to gold #CCA369 on hover */}
                        <span className="text-xl sm:text-2xl font-playfair font-bold text-[#6B5A3A]/70 transition-all duration-300 group-hover:text-[#CCA369] group-hover:scale-105 inline-block">
                          {item.id}
                        </span>

                        {/* Mission Text: shifts right slightly on hover */}
                        <p className="text-sm sm:text-base font-sarabun text-[#1F1F1F]/85 leading-relaxed transition-all duration-300 group-hover:text-[#1F1F1F] font-normal">
                          {item.text}
                        </p>
                      </div>

                      {/* Animated Gold Underline running underneath the row */}
                      <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-[#CCA369] via-[#E6C786] to-[#9A7B3E] scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 origin-left rounded-full" />
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

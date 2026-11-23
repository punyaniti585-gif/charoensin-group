"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { coreValuesData, CoreValueItem } from "@/data/about-data";
import { csgEase } from "@/components/ui/MotionWrapper";
import {
  ShieldCheck,
  HeartHandshake,
  Mountain,
  Users2,
  FileText,
  ExternalLink,
  Sparkles,
  ZoomIn,
  X,
} from "lucide-react";

export default function CoreValues() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lightbox: close on Escape + lock page scroll while open
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isLightboxOpen]);

  const { values, oldPhoto, oldPhotoCaption, codeOfConduct } = coreValuesData;

  const valueIcons = [ShieldCheck, HeartHandshake, Mountain, Users2];

  return (
    <>
    <section
      id="values"
      className="relative w-full py-12 md:py-16 bg-[#F7F1E7] overflow-hidden scroll-mt-28 border-b border-[#CCA369]/25"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-radial from-[#CCA369]/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Clean Title without tag badge) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: csgEase }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-kanit text-[#1F1F1F] tracking-tight">
            {coreValuesData.title}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base font-sarabun text-[#6B5A3A] max-w-xl mx-auto">
            4 หลักคุณธรรมสำคัญที่สืบทอดจากรุ่นสู่รุ่น เป็นเข็มทิศนำทางในการทำงานและการสร้างสัมพันธ์กับทุกภาคส่วน
          </p>
        </motion.div>

        {/* Bento Grid: 4 Core Values Cards + Historic Team Photograph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch mb-8 sm:mb-10">
          {/* Historical Team Photograph (Left 5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: csgEase }}
            role="button"
            tabIndex={0}
            aria-label={`ดูภาพขยาย: ${oldPhotoCaption}`}
            onClick={() => setIsLightboxOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsLightboxOpen(true);
              }
            }}
            className="group lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#CCA369]/40 shadow-[0_12px_36px_rgba(107,90,58,0.12)] bg-[#1F1F1F] min-h-[300px] lg:min-h-[480px] flex flex-col justify-end cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCA369] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F1E7]"
          >
            <Image
              src={oldPhoto}
              alt={oldPhotoCaption}
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover object-center filter contrast-[1.05] sepia-[0.15] transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Zoom affordance (top-right corner) */}
            <span
              aria-hidden="true"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/45 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:bg-[#CCA369] group-hover:border-[#CCA369] group-hover:text-[#1F1F1F] group-hover:scale-110"
            >
              <ZoomIn className="w-4 h-4" />
            </span>
            <div className="relative p-6 sm:p-8 text-white z-10">
              <span className="text-xs uppercase font-inter tracking-[0.2em] text-[#CCA369] font-bold block mb-1">
                HISTORIC HERITAGE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-kanit text-white leading-snug">
                พลังแห่งความผูกพันและวัฒนธรรมเจริญสิน
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-sarabun text-white/85 leading-relaxed">
                รากฐานความสำเร็จตลอดกว่า 9 ทศวรรษ เกิดจากหัวใจของบุคลากรทุกคนที่ยึดถือคุณธรรมร่วมกันเสมือนครอบครัว
              </p>
            </div>
          </motion.div>

          {/* 4 Pillars Grid (Right 7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {values.map((v: CoreValueItem, idx: number) => {
              const IconComp = valueIcons[idx % valueIcons.length];
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: csgEase }}
                  className="group p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-md border border-[#CCA369]/35 hover:border-[#CCA369] shadow-xs hover:shadow-[0_10px_30px_rgba(107,90,58,0.1)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#CCA369]/30 flex items-center justify-center text-[#6B5A3A] group-hover:scale-110 group-hover:bg-[#6B5A3A] group-hover:text-white transition-all duration-300">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="font-playfair text-xl font-bold text-[#CCA369]">
                        {v.number}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold font-kanit text-[#1F1F1F] group-hover:text-[#6B5A3A] transition-colors">
                      {v.title}
                    </h4>
                    <span className="text-[11px] font-inter uppercase text-[#9A7B3E] font-semibold tracking-wider block mt-0.5 mb-2.5">
                      {v.titleEn}
                    </span>
                    <p className="text-xs sm:text-sm font-sarabun text-[#1F1F1F]/80 leading-relaxed">
                      {v.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#CCA369]/20 flex items-center justify-between text-[10px] font-mono text-[#6B5A3A]/70 uppercase">
                    <span>CORE PHILOSOPHY</span>
                    <span>PILLAR {v.number}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ----------------------------------------------------
            CODE OF CONDUCT (จรรยาบรรณธุรกิจ)
           ---------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: csgEase }}
          className="relative rounded-3xl overflow-hidden border-2 border-[#CCA369]/40 bg-white/95 shadow-[0_16px_40px_rgba(107,90,58,0.1)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Image (4 Cols) */}
            <div className="lg:col-span-5 relative h-56 sm:h-72 lg:h-full min-h-[240px]">
              <Image
                src={codeOfConduct.image}
                alt={codeOfConduct.title}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/50 via-transparent to-transparent" />
            </div>

            {/* Description & Action (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#CCA369]/40 text-[#6B5A3A] text-xs font-semibold tracking-wider font-kanit">
                <FileText className="w-3.5 h-3.5 text-[#CCA369]" />
                <span>{codeOfConduct.eyebrow}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-kanit text-[#1F1F1F]">
                {codeOfConduct.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base font-sarabun text-[#1F1F1F]/85 leading-relaxed">
                {codeOfConduct.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={codeOfConduct.externalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B5A3A] hover:bg-[#52442B] text-white font-kanit text-xs sm:text-sm font-medium shadow-sm transition-all duration-200"
                >
                  <span>เอกสารจรรยาบรรณทางธุรกิจฉบับเต็ม</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-xs font-sarabun text-[#6B5A3A]">
                  (คู่มือธรรมาภิบาลและการกำกับดูแลกิจการ)
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ========================================================
        LIGHTBOX: Historic Heritage photograph (full size)
        Click backdrop / X / Escape to close
       ======================================================== */}
    <AnimatePresence>
      {isLightboxOpen && (
        <motion.div
          key="heritage-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={oldPhotoCaption}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: csgEase }}
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 cursor-zoom-out"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            aria-label="ปิดภาพขยาย"
            autoFocus
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-[#CCA369] border border-white/30 hover:border-[#CCA369] text-white hover:text-[#1F1F1F] flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Full-size image (click on the image itself does not close) */}
          <motion.figure
            initial={shouldReduceMotion ? false : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.3, ease: csgEase }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl cursor-default"
          >
            <div className="relative w-full h-[72vh] sm:h-[80vh]">
              <Image
                src={oldPhoto}
                alt={oldPhotoCaption}
                fill
                sizes="(max-width: 1280px) 100vw, 1152px"
                quality={95}
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-xs sm:text-sm font-sarabun text-white/85">
              {oldPhotoCaption}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

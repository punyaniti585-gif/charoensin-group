"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
} from "lucide-react";

export default function CoreValues() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { values, oldPhoto, oldPhotoCaption, codeOfConduct } = coreValuesData;

  const valueIcons = [ShieldCheck, HeartHandshake, Mountain, Users2];

  return (
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
            className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#CCA369]/40 shadow-[0_12px_36px_rgba(107,90,58,0.12)] bg-[#1F1F1F] min-h-[300px] lg:min-h-[480px] flex flex-col justify-end"
          >
            <Image
              src={oldPhoto}
              alt={oldPhotoCaption}
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover object-center filter contrast-[1.05] sepia-[0.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
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
  );
}

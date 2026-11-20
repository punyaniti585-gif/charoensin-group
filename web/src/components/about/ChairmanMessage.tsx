"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { visionAndMissionData } from "@/data/about-data";
import { csgEase } from "@/components/ui/MotionWrapper";
import { Quote } from "lucide-react";

export default function ChairmanMessage() {
  const shouldReduceMotion = useReducedMotion();
  const { chairmanMessage } = visionAndMissionData;

  return (
    <section
      id="chairman"
      className="relative w-full pt-4 md:pt-6 pb-12 md:pb-16 bg-[#F7F1E7] overflow-hidden scroll-mt-28"
    >
      {/* Decorative Gold Radial Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial from-[#CCA369]/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: csgEase }}
          className="relative rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-white to-[#F7F1E7] border-2 border-[#CCA369]/60 p-6 sm:p-10 lg:p-12 shadow-[0_18px_50px_rgba(107,90,58,0.12)] overflow-hidden"
        >
          {/* Subtle Inner Golden Border Outline */}
          <div className="absolute inset-2.5 sm:inset-3.5 rounded-[22px] border border-[#CCA369]/25 pointer-events-none" />

          {/* Luxury Watermark Quote Icon */}
          <Quote className="absolute -bottom-6 -right-6 w-40 h-40 text-[#CCA369]/10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Chairman Portrait with Gold Ring Frame & Signature */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              {/* Cream circular portrait — same frame as the Leadership Team chairman card */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden shadow-md bg-[#F7F1E7] mb-4">
                {/* Portrait scaled 1.15 from the top + nudged down 6%: the suit runs past
                    the circle and is clipped flush along its bottom curve; ~7% headroom */}
                <Image
                  src={chairmanMessage.image}
                  alt={chairmanMessage.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 176px, 240px"
                  className="object-cover object-top origin-top scale-[1.15] translate-y-[6%]"
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-kanit text-[#1F1F1F]">
                {chairmanMessage.name}
              </h3>
              <span className="text-sm font-kanit font-medium text-[#6B5A3A] mt-0.5">
                {chairmanMessage.role}
              </span>

              {/* Signature with Soft Entrance Animation */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25, ease: csgEase }}
                className="relative w-44 h-16 mt-3"
              >
                <Image
                  src={chairmanMessage.signature}
                  alt={`ลายเซ็น ${chairmanMessage.name}`}
                  fill
                  className="object-contain filter contrast-125"
                />
              </motion.div>
            </div>

            {/* Right: Chairman's Letter Body (Clean Title without tag badge) */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-kanit text-[#1F1F1F] tracking-tight">
                {chairmanMessage.title}
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-[#CCA369] to-[#E6C786] rounded-full mb-4" />

              <div className="space-y-3.5 text-sm sm:text-base font-sarabun text-[#1F1F1F]/85 leading-relaxed">
                {chairmanMessage.paragraphs.map((p, idx) => (
                  <p key={`chair-p-${idx}`}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
